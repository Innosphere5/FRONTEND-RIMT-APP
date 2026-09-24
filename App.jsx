import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Colors, Radii, Typography, Spacing } from './src/theme/tokens';
import SignInScreen from './src/screens/SignInScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CredentialsScreen from './src/screens/CredentialsScreen';
import DownloadsScreen from './src/screens/DownloadsScreen';
import BottomNav from './src/components/BottomNav';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home'); // 'signin' | 'home' | 'projects' | 'profile' | 'credentials' | 'downloads'
  const [showScreenSwitcher, setShowScreenSwitcher] = useState(false);

  const handleNavigate = (screenId) => {
    setCurrentScreen(screenId);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'signin':
        return <SignInScreen onSignInSuccess={() => setCurrentScreen('home')} />;
      case 'projects':
        return <ProjectsScreen onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileScreen onNavigate={handleNavigate} />;
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
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="dark" backgroundColor={Colors.surface} />
        <View style={styles.container}>
        {/* Screen Switcher Banner (allows instant jumping between all 5 screens & Sign In for pairing/review) */}
        <View style={styles.switcherHeader}>
          <TouchableOpacity
            style={styles.switcherToggle}
            onPress={() => setShowScreenSwitcher(!showScreenSwitcher)}
            activeOpacity={0.7}
          >
            <View style={styles.liveDot} />
            <Text style={styles.switcherToggleText}>
              Screen Preview: <Text style={styles.currentScreenBold}>{currentScreen.toUpperCase()}</Text>
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
                { id: 'signin', label: '1. Sign In' },
                { id: 'home', label: '2. Home Overview' },
                { id: 'projects', label: '3. My Projects' },
                { id: 'profile', label: '4. Academic Profile' },
                { id: 'credentials', label: '5. Credentials Vault' },
                { id: 'downloads', label: '6. Downloads Cache' },
              ].map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.switcherPill,
                    currentScreen === s.id && styles.switcherPillActive,
                  ]}
                  onPress={() => {
                    setCurrentScreen(s.id);
                    setShowScreenSwitcher(false);
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

        {/* Floating Bottom Nav (Visible on authenticated screens) */}
        {currentScreen !== 'signin' && (
          <BottomNav
            activeTab={
              ['home', 'credentials', 'projects', 'downloads', 'profile'].includes(currentScreen)
                ? currentScreen
                : 'home'
            }
            onTabPress={handleNavigate}
          />
        )}
        </View>
      </SafeAreaView>
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
