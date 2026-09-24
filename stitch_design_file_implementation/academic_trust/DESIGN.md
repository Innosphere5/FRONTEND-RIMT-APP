---
name: Academic Trust
colors:
  surface: '#FFFFFF'
  surface-dim: '#d1daeb'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#e0e9f9'
  surface-container-highest: '#dae3f4'
  on-surface: '#131c28'
  on-surface-variant: '#5a403f'
  inverse-surface: '#28313d'
  inverse-on-surface: '#eaf1ff'
  outline: '#8e706e'
  outline-variant: '#e2bebc'
  surface-tint: '#b5232c'
  primary: '#a31321'
  on-primary: '#ffffff'
  primary-container: '#c63036'
  on-primary-container: '#ffe5e3'
  inverse-primary: '#ffb3af'
  secondary: '#3e6186'
  on-secondary: '#ffffff'
  secondary-container: '#b2d5ff'
  on-secondary-container: '#395c81'
  tertiary: '#40536c'
  on-tertiary: '#ffffff'
  tertiary-container: '#586b86'
  on-tertiary-container: '#e1ecff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3af'
  on-primary-fixed: '#410005'
  on-primary-fixed-variant: '#930017'
  secondary-fixed: '#d1e4ff'
  secondary-fixed-dim: '#a7c9f4'
  on-secondary-fixed: '#001d35'
  on-secondary-fixed-variant: '#24496d'
  tertiary-fixed: '#d3e4ff'
  tertiary-fixed-dim: '#b4c8e6'
  on-tertiary-fixed: '#071c33'
  on-tertiary-fixed-variant: '#354861'
  background: '#f8f9ff'
  on-background: '#131c28'
  surface-variant: '#dae3f4'
  canvas: '#F7F9FC'
  canvas-alt: '#F5F7FA'
  text-primary: '#1B2430'
  text-secondary: '#5B6776'
  border: '#DDE3EA'
  crimson-pressed: '#9E2227'
  verified-green: '#2E7D4F'
  pending-amber: '#B7791F'
  neutral-chip-bg: '#EEF1F5'
  neutral-gray: '#8A94A3'
typography:
  display-hero:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  display-hero-mobile:
    fontFamily: Source Serif 4
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-formal:
    fontFamily: Source Serif 4
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  eyebrow:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
  code-sm:
    fontFamily: Roboto Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  code-xs:
    fontFamily: Roboto Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-compact: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system establishes an authoritative, collegiate, and highly credible mobile environment for university identity and digital credentials. The aesthetic merges traditional academic prestige with the disciplined utility of modern cryptographic verification tools. 

### Brand Personality & Emotional Impact
The visual atmosphere communicates institutional stability, absolute security, and quiet academic excellence. Users should feel the grounded reassurance of a physical registrar's office coupled with the streamlined precision of a secure digital vault. Interactions avoid trend-driven ornamentation in favor of purposeful restraint, clear boundaries, and immediate structural clarity.

### Design Movement: Institutional Modernism
The design system draws from Classical Academic Typographics and Modern Utilitarian Interface Design:
- **Structural Integrity:** Heavy reliance on clear spatial boundaries, 1px structural framing, and calm surface tiers rather than loud drop shadows or blurry gradients.
- **Controlled Accentuation:** Collegiate crimson is deployed strictly for primary calls to action, focus boundaries, and active verification markers, ensuring every colored accent commands immediate intentional attention.
- **Tripartite Hierarchy:** Distinct typefaces partition the interface into three psychological layers: institutional authority (Source Serif 4), operational functionality (Inter), and cryptographic auditability (monospace identifiers).

## Colors

The palette balances institutional gravitas with high-legibility interface neutrals. Operating exclusively in a crisp light mode, the system preserves white paper surfaces and light slate backdrops reminiscent of official academic documents.

### Role Allocation
- **Primary (`#C63036`):** Collegiate Crimson is reserved strictly for high-priority interactive touchpoints: primary action buttons, active navigation selections, active step indicators, and inline validation alerts. It is never used as an expansive background fill.
- **Secondary (`#2A4E72`):** Navy provides structural depth, serving as the voice of institutional authority across section groupings, informational badges, secondary action framing, and intermediate status meters.
- **Tertiary (`#12263D`):** Deep Navy anchors dark photo scrims and provides the base tone for modal backdrops.
- **Neutral & Typography (`#1B2430`, `#5B6776`):** High-contrast ink neutrals. `#1B2430` provides unyielding contrast for primary headings, table data, and labels. `#5B6776` handles supportive metadata, timestamps, and secondary operational descriptors.

### Status & Verification Tokens
- **Verified Green (`#2E7D4F`):** Applied to cryptographically validated credentials, official signature rows, and completed requirements.
- **Pending Amber (`#B7791F`):** Signifies in-progress requirements, pending registrar reviews, and incomplete credential sequences.
- **Neutral Gray (`#8A94A3` on `#EEF1F5`):** Reserved for archived milestones, inactive filters, and empty-state placeholders. Color is never used alone; all status tokens must be paired with an icon or clear text label.

## Typography

The typographic hierarchy enforces clear structural separation between institutional identity, operational UX, and technical proof.

### Font System Division
- **Source Serif 4:** Communicates institutional heritage, formal academic certification, and editorial importance. Used for display titles, screen titles, degree headings, and certificate previews.
- **Inter:** The functional core of the application. It governs form controls, instructional copy, action labels, secondary metadata, and card body descriptions with absolute neutral clarity.
- **Roboto Mono (Technical Token):** Strictly isolated for verifiable data artifacts: credential serials, verification checksums, Git commit hashes, registration codes, and IP logs.

### Dynamic Accessibility Rules
- Containers must never use rigid, fixed heights that restrict text expansion.
- All typography levels must comfortably scale up to 130% Dynamic Type sizing without truncating critical institutional proof or clipping button labels.
- Eyebrows must render in uppercase styling with deliberate tracking (`0.08em`) to demarcate structural sections cleanly.

## Layout & Spacing

The layout is engineered on a strict 8pt grid rhythm designed around mobile-first utility, calibrated primarily for portrait viewports ranging between 360px and 390px in width.

### Layout Rhythm & Constraints
- **Screen Margins:** Fixed at `1.25rem` (20px) on standard mobile viewports, stepping down to `1rem` (16px) on compact 360px screens.
- **Card Padding:** Standardized at `1rem` (16px) internally, preserving dense yet comfortable scanning of grades, credentials, and verification logs.
- **Grid Formations:**
  - **Metric/Stat Grids:** Restrained to a maximum configuration of 2 columns × 2 rows (`2×2`).
  - **Action Hub Grids:** Constrained to a maximum configuration of 2 columns × 3 rows (`2×3`).
  - **Inline Chip Sequences:** Capped at 4 items before automatically folding into an overflow counter (e.g., `+2 more`).
- **Touch Ergonomics:**
  - Interactive targets guarantee a physical bounding box of at least 48×48px.
  - Primary call-to-action buttons maintain an authoritative height of 52px.
  - Secondary operational buttons maintain a baseline height of 48px.
  - Bottom navigation screens strictly enforce safe-area bottom insets.

## Elevation & Depth

This design system rejects heavy, dramatic, or floating drop shadows in favor of quiet architectural elevation and hairline framing. Depth is communicated through structural containment and crisp boundaries.

### Depth Mechanics
- **Base Canvas:** Flat `#F7F9FC` serves as the institutional desk surface.
- **Contained Surfaces:** White `#FFFFFF` card layers rest cleanly on the canvas, distinguished primarily by a 1px solid border (`#DDE3EA`) rather than diffuse shadows.
- **Subtle Floor Elevation:** For persistent floating actions, sticky headers, and active modal bottom sheets, elevation is limited to a crisp, low-diffuse ambient shadow: `0 2px 8px rgba(18, 38, 61, 0.06), 0 1px 2px rgba(18, 38, 61, 0.04)`.
- **Hero Scrim Layer:** Media containers use a calibrated gradient scrim transitioning from transparent to Deep Navy (`#12263D`) across the bottom 40% of the image to guarantee pristine white-text legibility.
- **Floating Crest Anchor:** Entry and splash screens utilize an overlapping white card anchor bounded by a 1px border that bridges the bottom edge of the photography scrim into the canvas.

## Shapes

The shape vocabulary reflects an orderly, institutional aesthetic. It balances structural firmness with tactile interaction through standardized corner radii:

- **10px Radius (`rounded-md` equivalent):** Applied consistently across form controls, text inputs, primary buttons, and secondary action modules to create a defined, dependable interactive contour.
- **12px Radius (`rounded-lg` equivalent):** Reserved for contextual containment cards, profile overviews, document preview shells, and warning panels.
- **20px Radius (`rounded-xl` equivalent):** Strictly applied to the top edges of modal sheets (`border-top-left: 20px`, `border-top-right: 20px`).
- **Fully Rounded Pills (`9999px`):** Used strictly for non-rectangular micro-elements: verification status badges, skill tokens, interactive filter chips, active step nodes, and user avatar rings.

## Components

### Buttons
- **Primary Button:** Height 52px, 10px corner radius, background Crimson (`#C63036`), label text in Inter Semi-bold (`#FFFFFF`). On active press, the background shifts immediately to Pressed Crimson (`#9E2227`).
- **Secondary Button:** Height 48px, 10px corner radius, background Surface (`#FFFFFF`), border 1px solid `#DDE3EA`, label text in Navy (`#2A4E72`). On press, shifts to `#F5F7FA`.
- **Icon Actions:** Minimum hit box of 48×48px, containing a centered 20px icon. Always provided with semantic access labels.

### Input Fields
- **Container:** Height 48px, 10px corner radius, background `#FFFFFF`, border 1px solid `#DDE3EA`, horizontal padding 16px.
- **Typography:** Placeholder text in `#8A94A3`, entered text in `#1B2430` (Inter Regular 16px).
- **Validation State:** On blur error, border shifts to 1px solid Crimson (`#C63036`), paired with an inline error label below in 12px Inter. Keystroke-level instant error snapping is forbidden.

### Status Chips & Pills
- **Geometry:** Height 28px, fully rounded pill (`9999px`), horizontal padding 10px.
- **Verified Pill:** Surface `#2E7D4F` tint at 10% opacity, border 1px solid `#2E7D4F`, text `#2E7D4F` (Inter 12px Medium) accompanied by a trailing checkmark icon.
- **Pending Pill:** Surface `#B7791F` tint at 10% opacity, border 1px solid `#B7791F`, text `#B7791F` (Inter 12px Medium).
- **Neutral/Archived Pill:** Surface `#EEF1F5`, text `#8A94A3` (Inter 12px Medium).

### Cards & Group Containers
- **Visuals:** Surface `#FFFFFF`, 12px corner radius, 1px solid `#DDE3EA` outline, 16px internal padding.
- **Credential Card Structure:** Top row displays the category eyebrow and verification badge; middle row presents the formal degree title in Source Serif 4 (`#1B2430`); footer exposes the issuing university department and cryptographic ID rendered in Roboto Mono (`#5B6776`).

### Checkboxes & Radios
- **Checkbox:** 20×20px square with 4px corner radius, 1.5px border `#DDE3EA`. When checked, fills with Crimson (`#C63036`) displaying a white check glyph.
- **Radio:** 20×20px circle, 1.5px border `#DDE3EA`. When checked, displays a centered 8px Crimson circle.

### Lists & Timeline Trackers
- **Milestone Nodes:** 12px circular nodes linked by a continuous 2px vertical stroke in `#DDE3EA`.
- **Active Milestones:** Filled with `#C63036` with an outer 4px ring in `#F7F9FC`.
- **Completed Milestones:** Filled with Verified Green (`#2E7D4F`).