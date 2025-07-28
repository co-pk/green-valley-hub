import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface StudentAuth {
  studentId: string;
  name: string;
  loginTime: string;
  type: "student";
}

interface ParentAuth {
  parentId: string;
  name: string;
  loginTime: string;
  type: "parent";
  children: string[];
}

interface AdminAuth {
  email: string;
  name: string;
  loginTime: string;
  type: "admin";
  isAdmin: boolean;
  uid: string;
}

type AuthUser = StudentAuth | ParentAuth | AdminAuth;

// Helper to generate synthetic email if needed
const getSyntheticEmail = (id: string, type: "student" | "parent") => {
  return `${type}_${id}@greenvalley.local`;
};

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        // Try admin first
        try {
          const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid));
          if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            const authData: AdminAuth = {
              email: firebaseUser.email || "",
              name: adminData.name,
              loginTime: new Date().toISOString(),
              type: "admin",
              isAdmin: true,
              uid: firebaseUser.uid,
            };
            setUser(authData);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          // Not admin, try student/parent
        }
        // Try student
        try {
          const studentsRef = doc(db, "students", firebaseUser.uid);
          const studentDoc = await getDoc(studentsRef);
          if (studentDoc.exists()) {
            const studentData = studentDoc.data();
            const authData: StudentAuth = {
              studentId: studentData.studentId,
              name: studentData.studentName,
              loginTime: new Date().toISOString(),
              type: "student",
            };
            setUser(authData);
            setIsLoading(false);
            return;
          }
        } catch (error) {}
        // Try parent
        try {
          const parentsRef = doc(db, "parents", firebaseUser.uid);
          const parentDoc = await getDoc(parentsRef);
          if (parentDoc.exists()) {
            const parentData = parentDoc.data();
            const authData: ParentAuth = {
              parentId: parentData.parentId,
              name: parentData.name,
              loginTime: new Date().toISOString(),
              type: "parent",
              children: parentData.children || [],
            };
            setUser(authData);
            setIsLoading(false);
            return;
          }
        } catch (error) {}
        // If not found
        setUser(null);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Login for students (using email or synthetic email)
  const loginStudent = async (studentIdOrEmail: string, password: string) => {
    setIsLoading(true);
    try {
      // Try as email, fallback to synthetic
      let email = studentIdOrEmail;
      if (!email.includes("@")) {
        email = getSyntheticEmail(studentIdOrEmail, "student");
      }
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Fetch student profile from Firestore
      const studentDoc = await getDoc(
        doc(db, "students", userCredential.user.uid)
      );
      if (!studentDoc.exists()) {
        await signOut(auth);
        throw new Error("Student profile not found");
      }
      const studentData = studentDoc.data();
      const authData: StudentAuth = {
        studentId: studentData.studentId,
        name: studentData.studentName,
        loginTime: new Date().toISOString(),
        type: "student",
      };
      setUser(authData);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  // Login for parents (using email or synthetic email)
  const loginParent = async (parentIdOrEmail: string, password: string) => {
    setIsLoading(true);
    try {
      let email = parentIdOrEmail;
      if (!email.includes("@")) {
        email = getSyntheticEmail(parentIdOrEmail, "parent");
      }
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Fetch parent profile from Firestore
      const parentDoc = await getDoc(
        doc(db, "parents", userCredential.user.uid)
      );
      if (!parentDoc.exists()) {
        await signOut(auth);
        throw new Error("Parent profile not found");
      }
      const parentData = parentDoc.data();
      const authData: ParentAuth = {
        parentId: parentData.parentId,
        name: parentData.name,
        loginTime: new Date().toISOString(),
        type: "parent",
        children: parentData.children || [],
      };
      setUser(authData);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  // Admin login (email/password)
  const loginAdmin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const adminDoc = await getDoc(doc(db, "admins", userCredential.user.uid));
      if (!adminDoc.exists()) {
        await signOut(auth);
        throw new Error("Unauthorized access");
      }
      const adminData = adminDoc.data();
      const authData: AdminAuth = {
        email: userCredential.user.email || "",
        name: adminData.name,
        loginTime: new Date().toISOString(),
        type: "admin",
        isAdmin: true,
        uid: userCredential.user.uid,
      };
      setUser(authData);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthenticated = !!user;
  const isStudent = user?.type === "student";
  const isParent = user?.type === "parent";
  const isAdmin = user?.type === "admin";

  return {
    user,
    student: isStudent ? (user as StudentAuth) : null,
    parent: isParent ? (user as ParentAuth) : null,
    admin: isAdmin ? (user as AdminAuth) : null,
    isAuthenticated,
    isStudent,
    isParent,
    isAdmin,
    isLoading,
    loginStudent,
    loginParent,
    loginAdmin,
    logout,
  };
};
