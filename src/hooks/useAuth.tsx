
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface StudentAuth {
  studentId: string;
  name: string;
  loginTime: string;
  type: 'student';
}

interface ParentAuth {
  parentId: string;
  name: string;
  loginTime: string;
  type: 'parent';
  children: string[];
}

interface AdminAuth {
  email: string;
  name: string;
  loginTime: string;
  type: 'admin';
  isAdmin: boolean;
  uid: string;
}

type AuthUser = StudentAuth | ParentAuth | AdminAuth;

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
          if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            const authData: AdminAuth = {
              email: firebaseUser.email || '',
              name: adminData.name,
              loginTime: new Date().toISOString(),
              type: 'admin',
              isAdmin: true,
              uid: firebaseUser.uid
            };
            setUser(authData);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching admin data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginStudent = async (studentId: string, password: string) => {
    try {
      const response = await fetch('/api/auth/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { user } = await response.json();
      const authData: StudentAuth = {
        ...user,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('userAuth', JSON.stringify(authData));
      setUser(authData);
      return { success: true };
    } catch (error) {
      console.error('Student login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  };

  const loginParent = async (parentId: string, password: string) => {
    try {
      const response = await fetch('/api/auth/parent/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentId, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { user } = await response.json();
      const authData: ParentAuth = {
        ...user,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('userAuth', JSON.stringify(authData));
      setUser(authData);
      return { success: true };
    } catch (error) {
      console.error('Parent login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const adminDoc = await getDoc(doc(db, 'admins', userCredential.user.uid));
      
      if (!adminDoc.exists()) {
        await signOut(auth);
        throw new Error('Unauthorized access');
      }

      const adminData = adminDoc.data();
      const authData: AdminAuth = {
        email: userCredential.user.email || '',
        name: adminData.name,
        loginTime: new Date().toISOString(),
        type: 'admin',
        isAdmin: true,
        uid: userCredential.user.uid
      };

      setUser(authData);
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  };

  const isAuthenticated = !!user;
  const isStudent = user?.type === 'student';
  const isParent = user?.type === 'parent';
  const isAdmin = user?.type === 'admin';

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
    logout
  };
};
