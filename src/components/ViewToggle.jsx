import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Radii } from '../theme/tokens';

/**
 * ViewToggle — Reusable List/Grid view switcher
 * 
 * A two-state segmented control: List view (☰) and Grid view (▦).
 * Reference: Mega Update.md Section 2.3 & ProjectsScreen (Image 6).
 * 
 * Each toggle button itself has the shared zoom micro-interaction.
 */
export default function ViewToggle({ mode = 'list', onChange }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, mode === 'list' && styles.btnActive]}
        onPress={() => onChange?.('list')}
        activeOpacity={0.7}
        accessibilityLabel="List View"
        accessibilityRole="button"
        accessibilityState={{ selected: mode === 'list' }}
      >
        <MaterialIcons
          name="view-stream"
          size={18}
          color={mode === 'list' ? Colors.primary : Colors.neutralGray}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, mode === 'grid' && styles.btnActive]}
        onPress={() => onChange?.('grid')}
        activeOpacity={0.7}
        accessibilityLabel="Grid View"
        accessibilityRole="button"
        accessibilityState={{ selected: mode === 'grid' }}
      >
        <MaterialIcons
          name="grid-view"
          size={18}
          color={mode === 'grid' ? Colors.primary : Colors.neutralGray}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radii.full,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
});
