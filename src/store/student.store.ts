import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Student {
  studentId: string;
  studentName: string;
  parentName: string;
  parentEmail: string;
  grade?: string;
  address?: string;
  phone?: string;
  referenceId?: string;
  activationCode?: string;
  password?: string;
}

interface StudentStore {
  student: Student | null;
  setStudent: (student: Student) => void;
  clearStudent: () => void;
}
//persist the student store
export const useStudentStore = create<StudentStore>()(
  persist(
    (set) => ({
      student: null,
      setStudent: (student) => set({ student }),
      clearStudent: () => set({ student: null }),
    }),
    {
      name: "student-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
