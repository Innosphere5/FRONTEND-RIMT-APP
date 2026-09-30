import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Colors, Radii, Typography, Spacing } from './src/theme/tokens';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import SignInScreen from './src/screens/SignInScreen';
import PendingApprovalScreen from './src/screens/PendingApprovalScreen';
import RejectedScreen from './src/screens/RejectedScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CredentialsScreen from './src/screens/CredentialsScreen';
import DownloadsScreen from './src/screens/DownloadsScreen';
import BottomNav from './src/components/BottomNav';

function MainNavigator() {
  const { currentStudent, setApprovedStudent, checkStatusForStudent, signOut } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('signin'); // default to signin to showcase auth
  const [showScreenSwitcher, setShowScreenSwitcher] = useState(false);
  const [pendingStudent, setPendingStudent] = useState(null);
  const [rejectedStudent, setRejectedStudent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const rollNo = currentStudent?.roll_no || currentStudent?.roll_number;
    if (!rollNo || !['APPROVED', 'VERIFIED'].includes(currentStudent?.status)) return undefined;

    let isMounted = true;
    let isChecking = false;
    const verifyLiveStatus = async () => {
      if (isChecking) return;
      isChecking = true;
      try {
        const result = await checkStatusForStudent({ rollNo });
        if (!isMounted || result.status === 'ERROR' || result.status === 'APPROVED') return;

        await signOut();
        if (result.status === 'REJECTED' || result.status === 'REVOKED') {
          setRejectedStudent(result.student || currentStudent);
          setRejectionReason(result.reason || result.student?.rejection_reason || result.student?.revocation_reason || 'Access is no longer approved.');
          setCurrentScreen('rejected');
        } else if (result.status === 'PENDING') {
          setPendingStudent(result.student || currentStudent);
          setCurrentScreen('pending');
        } else {
          setCurrentScreen('signin');
        }
      } finally {
        isChecking = false;
      }
    };

    const interval = setInterval(verifyLiveStatus, 3500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentStudent?.roll_no, currentStudent?.roll_number, currentStudent?.status, checkStatusForStudent, signOut]);

  const handleNavigate = (screenId) => {
    const isApproved =
      currentStudent &&
      (currentStudent.status === 'APPROVED' || currentStudent.status === 'VERIFIED');

    const protectedScreens = ['home', 'projects', 'profile', 'credentials', 'downloads'];

    if (protectedScreens.includes(screenId)) {
      if (!isApproved) {
        Alert.alert(
          'Unauthorized: Approval Required',
          'Your account has not been approved by university administration yet. Access to the campus portal and dashboard is locked until your registration is approved.',
          [{ text: 'Understood', onPress: () => setCurrentScreen(pendingStudent ? 'pending' : 'signin') }]
        );
        return;
      }
    }

    setCurrentScreen(screenId);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'pending':
        return (
          <PendingApprovalScreen
            student={pendingStudent}
            onApproved={(approvedUser) => {
              if (setApprovedStudent) setApprovedStudent(approvedUser);
              setCurrentScreen('home');
            }}
            onRejected={(student, reason) => {
              setRejectedStudent(student);
              setRejectionReason(reason);
              setCurrentScreen('rejected');
            }}
            onBackToSignIn={() => setCurrentScreen('signin')}
          />
        );
      case 'rejected':
        return (
          <RejectedScreen
            student={rejectedStudent}
            rejectionReason={rejectionReason}
            onBackToSignIn={() => setCurrentScreen('signin')}
          />
        );
      case 'onboarding':
        return (
          <OnboardingScreen
            onGetStarted={() => setCurrentScreen(currentStudent ? 'home' : 'signin')}
            onSignIn={() => setCurrentScreen('signin')}
          />
        );
      case 'signin':
        return (
          <SignInScreen
            onSignInSuccess={() => setCurrentScreen('home')}
            onSignUpSuccess={() => setCurrentScreen('onboarding')}
            onPendingStatus={(student) => {
              setPendingStudent(student);
              setCurrentScreen('pending');
            }}
            onRejectedStatus={(student, reason) => {
              setRejectedStudent(student);
              setRejectionReason(reason);
              setCurrentScreen('rejected');
            }}
            onNavigate={handleNavigate}
          />
        );
      case 'projects':
        return <ProjectsScreen onNavigate={handleNavigate} />;
      case 'profile':
        return (
          <ProfileScreen
            onNavigate={handleNavigate}
            onSignOut={() => setCurrentScreen('signin')}
          />
        );
      case 'credentials':
        return <CredentialsScreen onNavigate={handleNavigate} />;
      case 'downloads':
        return <DownloadsScreen onNavigate={handleNavigate} />;
      case 'home':
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" backgroundColor={Colors.surface} />
      <View style={styles.container}>
        {/* Screen Switcher Banner (allows instant jumping between all screens for pairing/review) */}
        <View style={styles.switcherHeader}>
          <TouchableOpacity
            style={styles.switcherToggle}
            onPress={() => setShowScreenSwitcher(!showScreenSwitcher)}
            activeOpacity={0.7}
          >
            <View style={styles.liveDot} />
            <Text style={styles.switcherToggleText}>
              Active: <Text style={styles.currentScreenBold}>{currentScreen.toUpperCase()}</Text>
              {currentStudent ? (
                <Text style={styles.studentPill}> · {currentStudent.roll_no}</Text>
              ) : (
                <Text style={styles.unauthPill}> · Not Authenticated</Text>
              )}
            </Text>
            <Text style={styles.switcherArrowText}>{showScreenSwitcher ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showScreenSwitcher && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.switcherPillScroll}
              style={styles.switcherDropdown}
            >
              {[
                { id: 'signin', label: '1. Sign In / Register' },
                { id: 'pending', label: '⏳ 2. Pending Approval Screen' },
                { id: 'rejected', label: '🚫 3. Rejected Screen' },
                { id: 'home', label: '4. Home Overview (Approved)' },
                { id: 'projects', label: '5. My Projects' },
                { id: 'profile', label: '6. Academic Profile' },
                { id: 'credentials', label: '7. Credentials Vault' },
                { id: 'downloads', label: '8. Downloads Cache' },
                { id: 'onboarding', label: '0. Onboarding' },
              ].map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.switcherPill,
                    currentScreen === s.id && styles.switcherPillActive,
                  ]}
                  onPress={() => {
                    setShowScreenSwitcher(false);
                    handleNavigate(s.id);
                  }}
                >
                  <Text
                    style={[
                      styles.switcherPillText,
                      currentScreen === s.id && styles.switcherPillTextActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Main Active Screen */}
        <View style={styles.screenWrapper}>
          {renderActiveScreen()}
        </View>

        {/* Floating Bottom Nav (ONLY visible when authenticated AND approved) */}
        {Boolean(
          currentStudent &&
          (currentStudent.status === 'APPROVED' || currentStudent.status === 'VERIFIED') &&
          ['home', 'credentials', 'projects', 'downloads', 'profile'].includes(currentScreen)
        ) && (
          <BottomNav
            activeTab={currentScreen}
            onTabPress={handleNavigate}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.canvas,
    position: 'relative',
  },
  switcherHeader: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 100,
  },
  switcherToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.margin,
    paddingVertical: 7,
    backgroundColor: 'rgba(239, 244, 255, 0.7)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.verifiedGreen,
    marginRight: 6,
  },
  switcherToggleText: {
    ...Typography.eyebrow,
    fontSize: 10,
    color: Colors.textSecondary,
    flex: 1,
  },
  currentScreenBold: {
    fontWeight: '800',
    color: Colors.primary,
  },
  studentPill: {
    color: Colors.secondary,
    fontWeight: '700',
  },
  unauthPill: {
    color: Colors.pendingAmber,
    fontWeight: '600',
  },
  switcherArrowText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  switcherDropdown: {
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: Spacing.margin,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  switcherPillScroll: {
    gap: 6,
  },
  switcherPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
    backgroundColor: Colors.canvasAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switcherPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  switcherPillText: {
    ...Typography.labelSm,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  switcherPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  screenWrapper: {
    flex: 1,
  },
});
