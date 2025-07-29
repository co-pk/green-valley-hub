import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export interface Parent {
  parentId: string;
  parentName: string;
  parentEmail: string;
  phoneNumber: string;
  address: string;
  password: string;
  child: string;

  updatedAt: Date;
}

interface ParentStore {
  parent: Parent | null;
  setParent: (parent: Parent) => void;
  clearParent: () => void;
}

export const useParentStore = create<ParentStore>()(
  persist(
    (set) => ({
      parent: null,
      setParent: (parent) => set({ parent }),
      clearParent: () => set({ parent: null }),
    }),
    { name: "parent-store" }
  )
);
