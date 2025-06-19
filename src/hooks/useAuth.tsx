
import { useState, useEffect } from 'react';

interface StudentAuth {
  studentId: string;
  name: string;
  loginTime: string;
}

export const useAuth = () => {
  const [student, setStudent] = useState<StudentAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const authData = localStorage.getItem('studentAuth');
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        setStudent(parsedAuth);
      } catch (error) {
        console.error('Error parsing auth data:', error);
        localStorage.removeItem('studentAuth');
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('studentAuth');
    setStudent(null);
  };

  const isAuthenticated = !!student;

  return {
    student,
    isAuthenticated,
    isLoading,
    logout
  };
};
