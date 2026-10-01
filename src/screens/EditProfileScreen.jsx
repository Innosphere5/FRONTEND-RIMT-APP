import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontFamilies, ImageAssets, Radii, Spacing, Typography, getAvatarSource } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';
import { AVAILABLE_COURSES } from './OnboardingScreen';
import ZoomCard from '../components/ZoomCard';
import NoticeModal from '../components/NoticeModal';
import PhotoViewerModal from '../components/PhotoViewerModal';

export default function EditProfileScreen({ onBack }) {
  const { currentStudent, updateProfile } = useAuth();
  const currentCourse = AVAILABLE_COURSES.find((course) => course.code === currentStudent?.course);
  const prof = currentStudent?.profile || {};
  const [name, setName] = useState(currentStudent?.name || '');
  const [phone, setPhone] = useState(currentStudent?.phone || '');
  const [batch, setBatch] = useState(currentStudent?.batch || '');
  const [bio, setBio] = useState(currentStudent?.bio || prof.bio || '');
  const [headline, setHeadline] = useState(currentStudent?.headline || prof.headline || '');
  const [skills, setSkills] = useState(
    Array.isArray(currentStudent?.skills)
      ? currentStudent.skills.join(', ')
      : (Array.isArray(prof.skills) ? prof.skills.join(', ') : (currentStudent?.skills || prof.skills || ''))
  );
  const [linkedinUrl, setLinkedinUrl] = useState(currentStudent?.linkedin_url || prof.linkedin_url || '');
  const [githubUrl, setGithubUrl] = useState(currentStudent?.github_url || prof.github_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentStudent?.portfolio_url || prof.portfolio_url || '');
  const [resumeUrl, setResumeUrl] = useState(currentStudent?.resume_url || prof.resume_url || '');
  const [selectedCourse, setSelectedCourse] = useState(currentCourse || null);
  const [avatarAsset, setAvatarAsset] = useState(null);
  const [bannerAsset, setBannerAsset] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);

  // Refs to distinguish self-saves from external Realtime updates
  const savingRef = useRef(false);
  const initialLoadRef = useRef(true);

  // Sync external Realtime updates (e.g. admin edits) into form state
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    // Skip re-sync if this component triggered the save
    if (savingRef.current) return;

    const p = currentStudent?.profile || {};
    setName(currentStudent?.name || '');
    setPhone(currentStudent?.phone || '');
    setBatch(currentStudent?.batch || '');
    setBio(currentStudent?.bio || p.bio || '');
    setHeadline(currentStudent?.headline || p.headline || '');
    setSkills(
      Array.isArray(currentStudent?.skills)
        ? currentStudent.skills.join(', ')
        : (Array.isArray(p.skills) ? p.skills.join(', ') : (currentStudent?.skills || p.skills || ''))
    );
    setLinkedinUrl(currentStudent?.linkedin_url || p.linkedin_url || '');
    setGithubUrl(currentStudent?.github_url || p.github_url || '');
    setPortfolioUrl(currentStudent?.portfolio_url || p.portfolio_url || '');
    setResumeUrl(currentStudent?.resume_url || p.resume_url || '');

    const updatedCourse = AVAILABLE_COURSES.find((c) => c.code === currentStudent?.course);
    if (updatedCourse) setSelectedCourse(updatedCourse);

    setNotice({
      title: 'Profile refreshed',
      message: 'An administrator updated your profile. The form now shows the latest data.',
    });
  }, [currentStudent?.updated_at, currentStudent?.profile?.updated_at]);

  const pickImage = async (kind) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: kind === 'avatar' ? [1, 1] : [16, 6],
        quality: 0.85,
      });
      if (result.canceled) return;
      if (kind === 'avatar') setAvatarAsset(result.assets[0]);
      else setBannerAsset(result.assets[0]);
    } catch (error) {
      setNotice({ title: 'Image unavailable', message: error.message || 'Choose an image again.' });
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setNotice({ title: 'Name required', message: 'Enter your full legal name to update the scholar record.' });
      return;
    }
    if (!selectedCourse) {
      setNotice({ title: 'Select a course', message: 'Choose the course linked to your academic record.' });
      return;
    }

    savingRef.current = true;
    setSaving(true);
    try {
      const result = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        batch: batch.trim(),
        bio: bio.trim(),
        headline: headline.trim(),
        skills: skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        linkedin_url: linkedinUrl.trim(),
        github_url: githubUrl.trim(),
        portfolio_url: portfolioUrl.trim(),
        resume_url: resumeUrl.trim(),
        course: selectedCourse.code,
        department: selectedCourse.department,
        avatarAsset,
        bannerAsset,
      });
      setNotice(result.success
        ? {
            title: result.warning ? 'Profile saved with setup pending' : 'Profile updated',
            message: result.warning
              ? `Your academic details were saved. ${result.warning}`
              : 'Your profile details and selected course have been saved to your scholar record.',
            actionLabel: 'Return to profile',
            onAction: () => {
              setNotice(null);
              onBack?.();
            },
          }
        : {
            title: 'Update needs attention',
            message: result.error || 'The profile could not be saved to the academic record.',
          });
    } catch (error) {
      setNotice({ title: 'Update failed', message: error.message || 'The profile could not be saved.' });
    } finally {
      setSaving(false);
      // Reset after a short delay so we don't re-sync our own Realtime echo
      setTimeout(() => { savingRef.current = false; }, 2500);
    }
  };

  const avatarSource = avatarAsset?.uri
    ? { uri: avatarAsset.uri }
    : getAvatarSource(currentStudent?.avatar_url);
  const bannerUri = bannerAsset?.uri || currentStudent?.banner_url || ImageAssets.campusHero;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.75}>
          <MaterialIcons name="arrow-back" size={20} color={Colors.secondary} />
        </TouchableOpacity>
        <View style={styles.topBarTitle}>
          <Text style={styles.eyebrow}>RIMT ACADEMIC TRUST</Text>
          <Text style={styles.screenTitle}>Edit profile</Text>
        </View>
        <View style={styles.rollChip}>
          <Text style={styles.rollText}>{currentStudent?.roll_no || 'Scholar'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageCard}>
          <Image source={{ uri: bannerUri }} style={styles.bannerImage} />
          <LinearGradient
            colors={['rgba(18,38,61,0.12)', 'rgba(18,38,61,0.88)']}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity
            style={styles.bannerAction}
            onPress={() => pickImage('banner')}
            activeOpacity={0.8}
          >
            <MaterialIcons name="photo-camera" size={15} color="#ffffff" />
            <Text style={styles.bannerActionText}>Change banner</Text>
          </TouchableOpacity>
          <View style={styles.avatarRow}>
            <TouchableOpacity
              style={styles.avatarFrame}
              onPress={() => setShowPhotoViewer(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Enlarge scholar profile photo"
            >
              <Image source={avatarSource} style={styles.avatar} />
              <View style={styles.zoomHintBadge}>
                <MaterialIcons name="zoom-in" size={12} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarCopy}
              onPress={() => setShowPhotoViewer(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.avatarTitle}>Scholar portrait</Text>
              <Text style={styles.avatarSubtitle}>Tap photo to enlarge · Stored with profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => pickImage('avatar')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <MaterialIcons name="edit" size={17} color={Colors.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ZoomCard style={styles.formCard} scaleTo={1.018}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <MaterialIcons name="badge" size={19} color={Colors.secondary} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Personal details</Text>
              <Text style={styles.sectionHint}>Keep your registrar record current</Text>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Full legal name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor={Colors.neutralGray}
            autoCapitalize="words"
          />
          <Text style={styles.fieldLabel}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Add a contact number"
            placeholderTextColor={Colors.neutralGray}
            keyboardType="phone-pad"
          />
          <Text style={styles.fieldLabel}>Academic batch</Text>
          <TextInput
            style={styles.input}
            value={batch}
            onChangeText={setBatch}
            placeholder="e.g. 2024-2027"
            placeholderTextColor={Colors.neutralGray}
          />
          <Text style={styles.fieldLabel}>Professional Headline</Text>
          <TextInput
            style={styles.input}
            value={headline}
            onChangeText={setHeadline}
            placeholder="e.g. Software Engineer | React Native Developer"
            placeholderTextColor={Colors.neutralGray}
          />
          <Text style={styles.fieldLabel}>Professional Bio &amp; Summary</Text>
          <TextInput
            style={[styles.input, { height: 78, textAlignVertical: 'top', paddingTop: 10 }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Write a brief professional summary about your skills & interests"
            placeholderTextColor={Colors.neutralGray}
            multiline
            numberOfLines={3}
          />
          <Text style={styles.fieldLabel}>Verified Skills (comma separated)</Text>
          <TextInput
            style={styles.input}
            value={skills}
            onChangeText={setSkills}
            placeholder="e.g. React Native, TypeScript, Node.js, Python"
            placeholderTextColor={Colors.neutralGray}
          />
          <Text style={styles.fieldLabel}>LinkedIn Profile URL</Text>
          <TextInput
            style={styles.input}
            value={linkedinUrl}
            onChangeText={setLinkedinUrl}
            placeholder="https://linkedin.com/in/username"
            placeholderTextColor={Colors.neutralGray}
            autoCapitalize="none"
            keyboardType="url"
          />
          <Text style={styles.fieldLabel}>GitHub Profile URL</Text>
          <TextInput
            style={styles.input}
            value={githubUrl}
            onChangeText={setGithubUrl}
            placeholder="https://github.com/username"
            placeholderTextColor={Colors.neutralGray}
            autoCapitalize="none"
            keyboardType="url"
          />
          <Text style={styles.fieldLabel}>Portfolio Website URL</Text>
          <TextInput
            style={styles.input}
            value={portfolioUrl}
            onChangeText={setPortfolioUrl}
            placeholder="https://yourportfolio.dev"
            placeholderTextColor={Colors.neutralGray}
            autoCapitalize="none"
            keyboardType="url"
          />
          <Text style={styles.fieldLabel}>Resume / CV Document URL</Text>
          <TextInput
            style={styles.input}
            value={resumeUrl}
            onChangeText={setResumeUrl}
            placeholder="https://drive.google.com/... or cloud link"
            placeholderTextColor={Colors.neutralGray}
            autoCapitalize="none"
            keyboardType="url"
          />
        </ZoomCard>

        <View style={styles.courseSection}>
          <View style={styles.sectionHeading}>
            <View style={[styles.sectionIcon, styles.courseSectionIcon]}>
              <MaterialIcons name="school" size={19} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Academic course</Text>
              <Text style={styles.sectionHint}>Select the program on your record</Text>
            </View>
          </View>
          <View style={styles.courseList}>
            {AVAILABLE_COURSES.map((course) => {
              const isSelected = selectedCourse?.id === course.id;
              return (
                <ZoomCard
                  key={course.id}
                  scaleTo={1.035}
                  onPress={() => setSelectedCourse(course)}
                >
                  <View style={[styles.courseCard, isSelected && styles.courseCardSelected]}>
                    <View style={[styles.courseIcon, { backgroundColor: course.iconBg }]}>
                      <MaterialIcons name={course.icon} size={20} color={course.iconColor} />
                    </View>
                    <View style={styles.courseCopy}>
                      <Text style={[styles.courseCode, isSelected && styles.courseCodeSelected]}>
                        {course.code}
                      </Text>
                      <Text style={styles.courseName} numberOfLines={2}>{course.name}</Text>
                    </View>
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <MaterialIcons name="check" size={13} color="#ffffff" />}
                    </View>
                  </View>
                </ZoomCard>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.86}
        >
          <LinearGradient
            colors={[Colors.primaryContainer, Colors.primary, Colors.crimsonPressed]}
            style={styles.saveGradient}
          >
            {saving ? <ActivityIndicator color="#ffffff" /> : <MaterialIcons name="save" size={19} color="#ffffff" />}
            <Text style={styles.saveText}>{saving ? 'Saving profile...' : 'Save profile changes'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.bottomSpace} />
      </ScrollView>

      <PhotoViewerModal
        visible={showPhotoViewer}
        imageUri={avatarAsset?.uri || currentStudent?.avatar_url}
        name={name || currentStudent?.name}
        rollNo={currentStudent?.roll_no}
        onClose={() => setShowPhotoViewer(false)}
        onChangePhoto={() => pickImage('avatar')}
      />

      <NoticeModal
        visible={!!notice}
        title={notice?.title}
        message={notice?.message}
        actionLabel={notice?.actionLabel || 'Understood'}
        onAction={notice?.onAction || (() => setNotice(null))}
        onDismiss={() => setNotice(null)}
        icon={notice?.title === 'Profile updated' ? 'check-circle' : 'info-outline'}
        tone={notice?.title === 'Profile updated'
          ? 'success'
          : notice?.title === 'Profile saved with setup pending'
            ? 'warning'
            : 'brand'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.canvas },
  topBar: {
    minHeight: 68,
    paddingHorizontal: Spacing.margin,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.canvasAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  topBarTitle: { flex: 1 },
  eyebrow: { ...Typography.eyebrow, fontSize: 9, color: Colors.textSecondary },
  screenTitle: { ...Typography.headlineSm, fontSize: 18, color: Colors.textPrimary },
  rollChip: {
    maxWidth: 112,
    backgroundColor: Colors.canvasAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  rollText: { ...Typography.codeXs, fontSize: 9, color: Colors.secondary, fontWeight: '700' },
  content: { padding: Spacing.margin, paddingBottom: 20, gap: Spacing.spaceMd },
  imageCard: {
    height: 192,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    backgroundColor: Colors.tertiaryDeep,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'flex-end',
  },
  bannerImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bannerAction: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(18,38,61,0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: Radii.full,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  bannerActionText: { fontFamily: FontFamilies.sansMedium, fontSize: 11, fontWeight: '700', color: '#ffffff' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  avatarFrame: {
    width: 58,
    height: 58,
    borderRadius: Radii.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: Colors.canvasAlt,
    position: 'relative',
  },
  zoomHintBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(18, 38, 61, 0.75)',
    borderRadius: Radii.full,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: '100%', height: '100%' },
  avatarCopy: { flex: 1 },
  avatarTitle: { fontFamily: FontFamilies.sansMedium, color: '#ffffff', fontSize: 14, fontWeight: '700' },
  avatarSubtitle: { fontFamily: FontFamilies.sans, color: 'rgba(255,255,255,0.78)', fontSize: 11, marginTop: 3 },
  photoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.spaceMd,
    shadowColor: Colors.tertiaryDeep,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    backgroundColor: Colors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseSectionIcon: { backgroundColor: '#FCEDEF' },
  sectionTitle: { ...Typography.headlineSm, fontSize: 16, color: Colors.textPrimary },
  sectionHint: { fontFamily: FontFamilies.sans, color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  fieldLabel: {
    fontFamily: FontFamilies.sansMedium,
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 9,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.canvasAlt,
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    color: Colors.textPrimary,
    fontFamily: FontFamilies.sans,
    fontSize: 14,
  },
  courseSection: { gap: 2 },
  courseList: { gap: 9 },
  courseCard: {
    minHeight: 76,
    padding: 12,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  courseCardSelected: { borderColor: Colors.primary, backgroundColor: '#FFFBFB', elevation: 2 },
  courseIcon: { width: 40, height: 40, borderRadius: Radii.md, alignItems: 'center', justifyContent: 'center' },
  courseCopy: { flex: 1 },
  courseCode: { fontFamily: FontFamilies.sansMedium, color: Colors.textPrimary, fontSize: 13, fontWeight: '800' },
  courseCodeSelected: { color: Colors.primary },
  courseName: { fontFamily: FontFamilies.sans, color: Colors.textSecondary, fontSize: 11, lineHeight: 15, marginTop: 3 },
  radio: { width: 21, height: 21, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  saveButton: { borderRadius: Radii.md, overflow: 'hidden', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 9, elevation: 3 },
  saveButtonDisabled: { opacity: 0.75 },
  saveGradient: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  saveText: { fontFamily: FontFamilies.sansMedium, color: '#ffffff', fontSize: 14, fontWeight: '800' },
  bottomSpace: { height: 78 },
});