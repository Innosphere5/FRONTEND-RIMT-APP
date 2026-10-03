import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, FontFamilies, getAvatarSource } from '../theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = Math.min(SCREEN_WIDTH * 0.82, 340);

export default function PhotoViewerModal({
  visible,
  imageUri,
  name,
  rollNo,
  onClose,
  onChangePhoto,
}) {
  if (!visible) return null;

  const imageSource = getAvatarSource(imageUri);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.scrim}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header Bar */}
              <View style={styles.headerBar}>
                <View style={styles.headerTitleWrap}>
                  <Text style={styles.eyebrow}>RIMT ACADEMIC TRUST</Text>
                  <Text style={styles.title}>Scholar Portrait</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>

              {/* Large Image Frame */}
              <View style={styles.imageContainer}>
                <Image
                  source={imageSource}
                  style={styles.enlargedPhoto}
                  resizeMode="cover"
                />
              </View>

              {/* Scholar Identity Meta */}
              <View style={styles.metaSection}>
                <Text style={styles.studentName} numberOfLines={1}>
                  {name || 'Scholar Record'}
                </Text>
                {rollNo ? (
                  <View style={styles.rollBadge}>
                    <MaterialIcons name="badge" size={13} color={Colors.secondary} />
                    <Text style={styles.rollText}>{rollNo}</Text>
                  </View>
                ) : null}
                <Text style={styles.hintText}>Verified institutional profile photograph</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                {onChangePhoto && (
                  <TouchableOpacity
                    style={styles.changeButton}
                    onPress={() => {
                      onClose();
                      onChangePhoto();
                    }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="photo-camera" size={18} color="#ffffff" />
                    <Text style={styles.changeButtonText}>Change photo</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.dismissButton, !onChangePhoto && { flex: 1 }]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dismissButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(10, 16, 26, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#152132',
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.55,
    shadowRadius: 28,
    elevation: 20,
  },
  headerBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerTitleWrap: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: FontFamilies.sans,
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FontFamilies.sans,
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    backgroundColor: '#0c1420',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  enlargedPhoto: {
    width: '100%',
    height: '100%',
  },
  metaSection: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  studentName: {
    fontFamily: FontFamilies.sans,
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  rollBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.pill,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  rollText: {
    fontFamily: FontFamilies.sans,
    fontSize: 12,
    fontWeight: '600',
    color: '#d1e4ff',
    letterSpacing: 0.5,
  },
  hintText: {
    fontFamily: FontFamilies.sans,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 6,
  },
  actionRow: {
    width: '100%',
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  changeButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Radii.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  changeButtonText: {
    fontFamily: FontFamilies.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  dismissButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    paddingVertical: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  dismissButtonText: {
    fontFamily: FontFamilies.sans,
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
