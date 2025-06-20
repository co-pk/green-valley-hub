
import { useState, useEffect } from 'react';

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

type AuthUser = StudentAuth | ParentAuth;

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const authData = localStorage.getItem('userAuth');
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        setUser(parsedAuth);
      } catch (error) {
        console.error('Error parsing auth data:', error);
        localStorage.removeItem('userAuth');
      }
    }
    setIsLoading(false);
  }, []);

  const loginStudent = (studentId: string, name: string) => {
    const authData: StudentAuth = {
      studentId,
      name,
      loginTime: new Date().toISOString(),
      type: 'student'
    };
    localStorage.setItem('userAuth', JSON.stringify(authData));
    setUser(authData);
  };

  const loginParent = (parentId: string, name: string, children: string[]) => {
    const authData: ParentAuth = {
      parentId,
      name,
      loginTime: new Date().toISOString(),
      type: 'parent',
      children
    };
    localStorage.setItem('userAuth', JSON.stringify(authData));
    setUser(authData);
  };

  const logout = () => {
    localStorage.removeItem('userAuth');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isStudent = user?.type === 'student';
  const isParent = user?.type === 'parent';

  return {
    user,
    student: isStudent ? (user as StudentAuth) : null,
    parent: isParent ? (user as ParentAuth) : null,
    isAuthenticated,
    isStudent,
    isParent,
    isLoading,
    loginStudent,
    loginParent,
    logout
  };
};
