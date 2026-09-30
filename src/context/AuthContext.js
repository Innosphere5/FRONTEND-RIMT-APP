import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signUpStudent,
  signInStudent,
  getActiveScholar,
  signOutStudent,
  updateStudentProfile,
  checkSupabaseConnection,
  hasRegisteredStudents,
  checkStudentApprovalStatus,
} from '../services/authService';

const AuthContext = createContext({
  currentStudent: null,
  isLoading: true,
  hasEverRegistered: false,
  supabaseStatus: { connected: false, tableExists: false, message: '' },
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  refreshStatus: async () => {},
  checkStatusForStudent: async () => {},
  setApprovedStudent: () => {},
});

export const AuthProvider = ({ children }) => {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEverRegistered, setHasEverRegistered] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState({
    connected: false,
    tableExists: false,
    message: 'Checking connection...',
  });

  const refreshStatus = useCallback(async () => {
    const status = await checkSupabaseConnection();
    setSupabaseStatus(status);
    return status;
  }, []);

  // Initial load: check session & supabase health
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const [savedStudent, status, everRegistered] = await Promise.all([
          getActiveScholar(),
          checkSupabaseConnection(),
          hasRegisteredStudents(),
        ]);

        if (savedStudent) {
          const liveStatus = await checkStudentApprovalStatus({
            rollNo: savedStudent.roll_no || savedStudent.roll_number,
          });
          if (isMounted && liveStatus.status === 'APPROVED') {
            setCurrentStudent(liveStatus.student);
          } else {
            await signOutStudent();
          }
        }

        if (isMounted) {
          setSupabaseStatus(status);
          setHasEverRegistered(everRegistered);
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignIn = async ({ rollNo, email, password }) => {
    await signOutStudent();
    setCurrentStudent(null);
    const result = await signInStudent({ rollNo, email, password });
    if (result.success && result.student && result.status === 'APPROVED') {
      setCurrentStudent(result.student);
    }
    return result;
  };

  const handleSignUp = async (data) => {
    const result = await signUpStudent(data);
    // Student enters PENDING queue; not logged in yet
    if (result.success) setHasEverRegistered(true);
    return result;
  };

  const handleCheckStatus = useCallback(async ({ rollNo }) => {
    const result = await checkStudentApprovalStatus({ rollNo });
    if (result.status === 'APPROVED' && result.student) {
      setCurrentStudent(result.student);
    }
    return result;
  }, []);

  const handleSetApproved = (student) => {
    setCurrentStudent(student);
  };

  const handleSignOut = useCallback(async () => {
    await signOutStudent();
    setCurrentStudent(null);
  }, []);

  const handleUpdateProfile = async (profile) => {
    if (!currentStudent?.roll_no && !currentStudent?.roll_number) {
      return { success: false, error: 'No active student' };
    }
    const result = await updateStudentProfile({
      rollNo: currentStudent.roll_no || currentStudent.roll_number,
      ...profile,
    });
    if (result.student) {
      setCurrentStudent(result.student);
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        currentStudent,
        isLoading,
        hasEverRegistered,
        supabaseStatus,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        updateProfile: handleUpdateProfile,
        refreshStatus,
        checkStatusForStudent: handleCheckStatus,
        setApprovedStudent: handleSetApproved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
