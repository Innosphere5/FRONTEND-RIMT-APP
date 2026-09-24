// Academic Trust Design System Tokens (from stitch_design_file_implementation/academic_trust/DESIGN.md)

export const Colors = {
  // Brand Primaries
  primary: '#a31321', // Collegiate Crimson
  primaryContainer: '#c63036',
  crimsonPressed: '#9E2227',
  onPrimary: '#ffffff',
  primaryFixed: '#ffdad7',
  primaryFixedDim: '#ffb3af',
  
  // Brand Secondaries (Institutional Navy)
  secondary: '#3e6186',
  secondaryNavy: '#2A4E72',
  secondaryContainer: '#b2d5ff',
  onSecondary: '#ffffff',
  secondaryFixed: '#d1e4ff',
  
  // Brand Tertiaries (Deep Navy Anchor)
  tertiary: '#40536c',
  tertiaryDeep: '#12263D',
  tertiaryContainer: '#586b86',
  onTertiary: '#ffffff',
  
  // Canvas & Surfaces
  canvas: '#F7F9FC',
  canvasAlt: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceDim: '#d1daeb',
  surfaceBright: '#f8f9ff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerHigh: '#e0e9f9',
  surfaceContainerHighest: '#dae3f4',
  
  // Text & Content Neutrals
  textPrimary: '#1B2430',
  textSecondary: '#5B6776',
  border: '#DDE3EA',
  borderLight: 'rgba(221, 227, 234, 0.85)',
  neutralGray: '#8A94A3',
  neutralChipBg: '#EEF1F5',
  
  // Status Tokens
  verifiedGreen: '#2E7D4F',
  verifiedGreenBg: 'rgba(46, 125, 79, 0.1)',
  verifiedGreenBorder: 'rgba(46, 125, 79, 0.25)',
  pendingAmber: '#B7791F',
  pendingAmberBg: 'rgba(183, 121, 31, 0.12)',
  pendingAmberBorder: 'rgba(245, 158, 11, 0.28)',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',

  // Dark/Gold accents for Harpreet Greeting Card
  goldAccent: '#d4af37',
  goldLight: '#fde68a',
  goldBorder: 'rgba(212, 175, 55, 0.4)',
  cardDarkBg: '#101218',
  cardNavyBg: '#182b42',
};

export const Spacing = {
  space2xs: 4,
  spaceXs: 8,
  spaceSm: 12,
  spaceMd: 16,
  spaceLg: 20,
  spaceXl: 24,
  space2xl: 32,
  margin: 20,
  marginMobile: 16,
  gutter: 16,
  gutterCompact: 12,
};

export const Radii = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const Typography = {
  // Source Serif 4 emulation / formal serif style
  displayHero: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: Colors.textPrimary,
  },
  displayHeroMobile: {
    fontFamily: 'serif',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
    color: Colors.textPrimary,
  },
  headlineLg: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: Colors.textPrimary,
  },
  headlineMd: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: Colors.textPrimary,
  },
  headlineSm: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  titleFormal: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: Colors.textPrimary,
  },

  // Inter emulation / sans-serif functional style
  bodyLg: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  bodyMdMedium: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  labelMd: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: Colors.textPrimary,
  },
  labelSm: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  },

  // Roboto Mono emulation / monospace technical identifiers
  codeSm: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: Colors.textPrimary,
  },
  codeXs: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
    color: Colors.textSecondary,
  },
};

export const ImageAssets = {
  campusHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0WxpQlbpxQiarnBUYXOm-UdffEHgfxRgYqHcpYW81UL5rGmsBSXxfhK8URFbOue13YJBfR1xcybNvdgqxCugUlL7eXsIsoI1LErveZBZyvEmMH4tTZ6HZdrrNzGqBBtdwIM_rGSe9idFsJn4uZz8vYonAF5dSDL1gvVbZ7xNazKnW4Gju4oR13POPiAN5oPuq68udftDyi3-cSHXEx6Exzkh1oitFx8Od_g_DO9GpZbD8BgpyZZD2A',
  universityLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYu7wEqEho2HzKdFJ1-f9X8GqvaK7LN8aj3MXC0GrK_VF7qROIqfjlIJZH-aM-vLTIeRa23FU3Xt0hQQ9gYLslfyaHFNvI8tRy0ob4h5GPz5XN3fNkV3iQWlsAz7n3DdNEYtyIDNlCXBzFIdU_AdUtMu_06JiFsfJg3MNuaNSQF1zttIm7CGt3GUShMLaVPN4DYBAfxRHmhVt95m1LChjUeRj4W9Z-EPahmqyawfkaOBFTBOwBCHjuUvGNqNRah7l51Eg',
  universityLogoAlt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY-fnLUkZMOj6CKXbXhPDz5G8qKB2oDaTHnsHe-hERjJ-2S_vudVHYlRRDvmqS2hT6aP1HRw8-Vg8TYZRbtO2IPr0QdEc68FzBA580Z4TcxilS2jqepgz20kU2czF0FheX4d_QtKiCQbzqT1wDOZAYwL0OYHodmROsCP4IK7RAjWPW4gIzDDdHdJi_qLyKVrM0D2SKz5lLamOW6vJAbVC0GE35TWodQsGwARNEKJ-D0DyB-9moRH_tuxvI2b3UG0ao-Ro',
  studentAvatar: 'https://lh3.googleusercontent.com/aida/AEtjO1UXAm5cYJI9GLblA6GRlMFHI3CvGm8nXUtVpzwv84OF0ztCwwMJwf_zJyolGQqXsQvm8He2vBEk7m3j-l8ro4sTK0IhI8PVOwpymJXnFQo85jA-JAzPNuUcEYpu0wINgY5UBUcGsRdCmmqoU3FS9FXKq-WXDB8lOzNxBtUhhcKIVqWBP_QaMSMTSXPlmiS4RSPTcMcyA-Nv7UyHpFy7qR-hVZdczfLNim3DRRqjdcwVs5E96E1Mfze3W1lC',
  profileAvatarSecondary: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOD-CmOzYOqOTgassQihXxS_KwiSj6J4LnyGv96NGw6Vxf1TPsXXws9HUa5u4sxvT62Tq_FSmkDUYzygI20Kb2BHMdtcmFewG2BHxORDslnuhL6JEqVyXZITYhf7hED9Y6lH8dNgwLEOSr9RFtA_25Lh4qeSX4redQiy-D30cLgpCzXT0YGGaIAwWAOOnFMf0bFLhUv487Ix0JMu8yXx492F3hN3DyfZ85tCl4eqBEFhNFSkLcdhrvHg',
};
