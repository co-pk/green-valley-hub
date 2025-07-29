import { auth, db, storage } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail as sendPasswordResetEmailAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  orderBy,
  query,
  updateDoc,
  Timestamp,
  where,
  deleteDoc,
} from "firebase/firestore";
import type { Student } from "@/store/student.store";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

/**
 * Signs in a user with email and password.
 * Throws a more descriptive error if credentials are invalid.
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    // FirebaseError: Firebase: Error (auth/invalid-credential).
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      throw new Error(
        "Invalid email or password. Please check your credentials and try again."
      );
    }
    throw error;
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const registerWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const sendPasswordResetEmail = async (email: string) => {
  await sendPasswordResetEmailAuth(auth, email);
};

export const createAdminInUserCollection = async (
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await setDoc(doc(db, "users", userCredential.user.uid), {
    email: userCredential.user.email,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    isAdmin: true,
    isStudent: false,
    isParent: false,
    isTeacher: false,
    isStaff: false,
  });
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
};

export const getAdminFromUserCollection = async (email: string) => {
  // Note: This assumes the document ID is the user's email.
  // If you use UID as the document ID, you should change this accordingly.
  const userDoc = await getDoc(doc(db, "users", email));
  return userDoc.data();
};

export const saveApplicationToDatabase = async (application: any) => {
  // Use addDoc to generate a unique ID
  const applicationWithMeta = {
    ...application,
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(
    collection(db, "applications"),
    applicationWithMeta
  );
  return docRef;
};

export const getApplicationsFromDatabaseInOrder = async () => {
  const applications = await getDocs(
    query(collection(db, "applications"), orderBy("createdAt", "desc"))
  );
  let allApplications = [];
  applications.docs.forEach((doc: any) => {
    allApplications.push({ ...doc.data(), id: doc.id });
  });
  return allApplications;
};

export const updateApplicationInDatabase = async (application: any) => {
  const applicationRef = doc(db, "applications", application.id);
  await updateDoc(applicationRef, application);
};
export const createStudentInDatabase = async (student: any) => {
  // Use addDoc to let Firestore generate a unique ID for the student document
  const docRef = await addDoc(collection(db, "students"), student);
  return docRef;
};

export const createParentInDatabase = async (parent: any) => {
  // Use addDoc to let Firestore generate a unique ID for the student document
  const docRef = await addDoc(collection(db, "parents"), parent);
  return docRef;
};

//sign in student with email and password uses the students collection
export const signInStudent = async (studentId: string, password: string) => {
  // Query the students collection for a document where studentId matches
  const studentsQuery = query(
    collection(db, "students"),
    where("studentId", "==", studentId)
  );
  const studentsSnapshot = await getDocs(studentsQuery);

  if (studentsSnapshot.empty) {
    return { success: false, message: "Student not found" };
  }

  // Assuming studentId is unique, get the first matching document
  const studentDoc = studentsSnapshot.docs[0];
  const student = studentDoc.data() as any;
  if (student.password !== password) {
    return { success: false, message: "Invalid password" };
  }
  if (!student.canLogin) {
    return {
      success: false,
      message:
        "Your account is not yet approved. Please wait for admin approval.",
    };
  }
  return {
    success: true,
    message: "Student signed in successfully",
    student: student,
  };
};

export const uploadDocumentsToStorage = async ({
  file,
  studentName,
}: {
  file: File;
  studentName: string;
}) => {
  const fileRef = ref(
    storage,
    `applications/${studentName}_${Date.now()}/${file.name}`
  );
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
};

export const signInParent = async (parentId: string, password: string) => {
  // Query the parents collection for a document where parentId matches
  const parentsQuery = query(
    collection(db, "parents"),
    where("parentId", "==", parentId)
  );
  const parentsSnapshot = await getDocs(parentsQuery);

  if (parentsSnapshot.empty) {
    return { success: false, message: "Parent not found" };
  }

  // Assuming parentId is unique, get the first matching document
  const parentDoc = parentsSnapshot.docs[0];
  const parent = parentDoc.data() as any;
  if (parent.password !== password) {
    return { success: false, message: "Invalid password" };
  }
  if (!parent.canLogin) {
    return {
      success: false,
      message:
        "Your account is not yet approved. Please wait for admin approval.",
    };
  }
  return {
    success: true,
    message: "Parent signed in successfully",
    parent: parent,
  };
};

// Create a poll with a category
export const createPoll = async ({ category }: { category: string }) => {
  const poll = {
    category,
    nominations: [], // array of { name, profileImageUrl, totalVotes }
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(collection(db, "polls"), poll);
  return { id: docRef.id, ...poll };
};

// Add a nomination (student) to a poll
export const addNominationToPoll = async ({
  pollId,
  name,
  profileImageUrl,
}: {
  pollId: string;
  name: string;
  profileImageUrl: string;
}) => {
  const pollRef = doc(db, "polls", pollId);
  const pollSnap = await getDoc(pollRef);
  if (!pollSnap.exists()) throw new Error("Poll not found");
  const pollData = pollSnap.data();
  const nominations = pollData.nominations || [];
  nominations.push({ name, profileImageUrl, totalVotes: 0 });
  await updateDoc(pollRef, { nominations, updatedAt: Timestamp.now() });
};

// Upload nomination profile image to storage
export const uploadNominationProfileImage = async ({
  file,
  studentName,
}: {
  file: File;
  studentName: string;
}) => {
  const fileRef = ref(
    storage,
    `poll-nominations/${studentName}_${Date.now()}/${file.name}`
  );
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
};

// Edit poll category
export const editPollCategory = async ({
  pollId,
  category,
}: {
  pollId: string;
  category: string;
}) => {
  const pollRef = doc(db, "polls", pollId);
  await updateDoc(pollRef, { category, updatedAt: Timestamp.now() });
};

// Delete poll
export const deletePoll = async (pollId: string) => {
  const pollRef = doc(db, "polls", pollId);
  await deleteDoc(pollRef);
};

// Edit nomination (name/profile image)
export const editNomination = async ({
  pollId,
  nominationIdx,
  name,
  profileImageUrl,
}: {
  pollId: string;
  nominationIdx: number;
  name?: string;
  profileImageUrl?: string;
}) => {
  const pollRef = doc(db, "polls", pollId);
  const pollSnap = await getDoc(pollRef);
  if (!pollSnap.exists()) throw new Error("Poll not found");
  const pollData = pollSnap.data();
  const nominations = pollData.nominations || [];
  if (nominations[nominationIdx]) {
    if (name) nominations[nominationIdx].name = name;
    if (profileImageUrl)
      nominations[nominationIdx].profileImageUrl = profileImageUrl;
    await updateDoc(pollRef, { nominations, updatedAt: Timestamp.now() });
  }
};

// Delete nomination
export const deleteNomination = async ({
  pollId,
  nominationIdx,
}: {
  pollId: string;
  nominationIdx: number;
}) => {
  const pollRef = doc(db, "polls", pollId);
  const pollSnap = await getDoc(pollRef);
  if (!pollSnap.exists()) throw new Error("Poll not found");
  const pollData = pollSnap.data();
  const nominations = pollData.nominations || [];
  nominations.splice(nominationIdx, 1);
  await updateDoc(pollRef, { nominations, updatedAt: Timestamp.now() });
};

// Increment vote for a nominee
export const voteForNominee = async ({
  pollId,
  nominationIdx,
}: {
  pollId: string;
  nominationIdx: number;
}) => {
  const pollRef = doc(db, "polls", pollId);
  const pollSnap = await getDoc(pollRef);
  if (!pollSnap.exists()) throw new Error("Poll not found");
  const pollData = pollSnap.data();
  const nominations = pollData.nominations || [];
  if (nominations[nominationIdx]) {
    nominations[nominationIdx].totalVotes =
      (nominations[nominationIdx].totalVotes || 0) + 1;
    await updateDoc(pollRef, { nominations });
  }
};

// Record a student's vote for a nominee in a poll (one vote per student per poll)
export const recordStudentVote = async ({
  pollId,
  nominationIdx,
  studentId,
}: {
  pollId: string;
  nominationIdx: number;
  studentId: string;
}) => {
  // Check if student has already voted in this poll
  const voteRef = doc(db, `polls/${pollId}/votes`, studentId);
  const voteSnap = await getDoc(voteRef);
  if (voteSnap.exists()) {
    throw new Error("You have already voted in this poll.");
  }
  // Increment nominee's vote
  const pollRef = doc(db, "polls", pollId);
  const pollSnap = await getDoc(pollRef);
  if (!pollSnap.exists()) throw new Error("Poll not found");
  const pollData = pollSnap.data();
  const nominations = pollData.nominations || [];
  if (!nominations[nominationIdx]) throw new Error("Nominee not found");
  nominations[nominationIdx].totalVotes =
    (nominations[nominationIdx].totalVotes || 0) + 1;
  await updateDoc(pollRef, { nominations });
  // Record the vote
  await setDoc(voteRef, { nominationIdx, votedAt: Timestamp.now() });
};
