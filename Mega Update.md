# RIMT Academic Trust — UI Micro-Interaction Update (context.md)

## 1. Purpose

This update adds a consistent, app-wide **hover/press "zoom" (scale) micro-interaction** across all key touch/click targets, and introduces a **List / Grid view toggle** on additional screens where it does not yet exist. The goal (per product owner) is:

- **Simplicity** — one predictable interaction pattern, used everywhere.
- **Logical accuracy** — the effect only appears on genuinely interactive elements (buttons, cards, avatars, nav items, tabs), not on static text/labels.
- **Attractiveness** — a premium, tactile feel similar to **macOS Dock magnification**, so the app feels polished rather than static.

This file is the single source of truth for engineering + design when implementing the update. It consolidates six annotated screenshots supplied by the product owner into concrete, screen-by-screen requirements.

---

## 2. Reference Image Manifest

Each screenshot supplied by the product owner is mapped below to its screen and file path, so an AI coding agent or developer can open the exact reference image while implementing the matching section.

| # | Screen | File path | What's annotated in it |
|---|---|---|---|
| 1 | Downloads | `/mnt/user-data/uploads/WhatsApp_Image_2026-09-28_at_11_41_51_AM.jpeg` | Header bar (logo/title/bell/avatar) circled in black; storage-used bar + all three document cards circled in red |
| 2 | Home / Overview | `/mnt/user-data/uploads/WhatsApp_Image_2026-09-28_at_11_43_46_AM.jpeg` | Profile avatar circled in red (top-right); search bar circled in red |
| 3 | Credentials | `/mnt/user-data/uploads/WhatsApp_Image_2026-09-28_at_11_44_30_AM.jpeg` | Header bar circled in red; filter tabs + all record cards circled in red |
| 4 | Projects | `/mnt/user-data/uploads/WhatsApp_Image_2026-09-28_at_11_42_51_AM.jpeg` | Header/tabs area and project cards circled in red; list/grid icons at top-right visible uncircled |
| 5 | Sign In | `/mnt/user-data/uploads/WhatsApp_Image_2026-09-28_at_11_48_44_AM.jpeg` | "Sign In to Portal" button circled in green |
| 6 | Projects (toggle detail) | `/mnt/user-data/uploads/knfwjk.jpeg` | List/grid view toggle circled in red (top-right) — reference for adding to other screens |

> **Note for implementers:** these are local file paths from the product owner's upload session, not public/hosted URLs. If the AI agent building this feature does not have direct filesystem access to `/mnt/user-data/uploads/`, ask the product owner to re-attach the same six images (in this order) so the agent can view them directly, or move them into the project's `/design-reference/` folder using the same filenames referenced in the table above and in each section below.

---

## 3. Global Interaction Pattern (applies everywhere)

### 2.1 "Strong Zoom" effect — definition
A single reusable interaction, to be built once as a shared component/style (e.g. `<Pressable>` wrapper, `hoverZoom` class, or shared `ScaleOnPress` HOC) and reused everywhere instead of being re-implemented per screen.

| Property | Spec |
|---|---|
| Trigger | `onHover` (web/pointer devices) **and** `onPressIn`/`onTap` (touch devices) |
| Effect | `scale(1.05–1.10)` for cards/bars, `scale(1.15–1.25)` for circular avatars/icons/buttons ("great extent" per product owner) |
| Duration | 150–200ms ease-out on press/hover-in, 150–200ms ease-in on release/hover-out |
| Easing | `cubic-bezier(0.34, 1.56, 0.64, 1)` (slight overshoot/"pop") for a lively, non-robotic feel |
| Shadow | Optional subtle elevation/shadow increase paired with the scale, to reinforce the "lift" |
| Accessibility | Respect `prefers-reduced-motion` — fall back to a simple opacity/border highlight, no scale, when reduced motion is enabled |
| Z-index | Element must raise z-index while scaled so it visually overlaps neighboring cards instead of being clipped |

### 2.2 "Dock-style" magnification for Bottom Navigation
Applies specifically to the bottom tab bar (Home / Credentials / Projects / Downloads / Profile).

- As the user's finger/cursor moves across the tab bar (drag-scroll or hover-scan), the icon nearest the pointer scales up the most, with neighboring icons scaling slightly less — mimicking the macOS Dock magnification curve.
- On discrete tap/selection (mobile, no drag-scan), apply a strong scale-up + settle animation on the selected icon instead of a full drag-magnify (since mobile taps are discrete, not continuous pointer movement).
- Icon + label move together as one unit; label fades in slightly bolder on the active/hovered icon.

### 2.3 List / Grid Toggle Component
A reusable two-state segmented control: **List view (☰ lines icon)** and **Grid view (▦ squares icon)**, as shown circled in the Projects screen (Image 6).

- Build as one shared component (`<ViewToggle />`) with `mode: 'list' | 'grid'` prop + `onChange` callback.
- Persist the user's last-selected mode per screen (or globally) using local storage/state so it doesn't reset on navigation.
- Apply the existing zoom/press effect to the toggle buttons themselves.

---

## 4. Screen-by-Screen Requirements

### 4.1 Downloads Screen (Image 1)
**Reference image:** `/mnt/user-data/uploads/WhatsApp_Image_2026-09-28_at_11_41_51_AM.jpeg`

| Element | Current state | Required change |
|---|---|---|
| Header bar (RIMT logo, "Downloads" title, notification bell, profile avatar) | Static | Apply **Strong Zoom** on hover/tap of the header block |
| "Institutional Storage Used" bar/card | Static | Apply **Strong Zoom** on hover/tap |
| Document cards below (Bachelor of Technology, Cumulative Grade Transcript, Institutional Student ID) | Already has zoom effect | ✅ No change — keep as-is, use as the reference implementation for consistency |
| List/Grid toggle | Not present | **Add** the List/Grid toggle component (per Image 6) to this screen's header area |

### 4.2 Home / Overview Screen (Image 2)
**Reference image:** `/mnt/user-data/uploads/WhatsApp_Image_2026-09-28_at_11_43_46_AM.jpeg`

| Element | Current state | Required change |
|---|---|---|
| Profile avatar (top-right, circled) | Static | Apply **Strong Zoom** ("to a great extent" — use the larger avatar scale range, ~1.15–1.25) on hover/tap |
| "Search documents and projects" search bar | Static | Apply **Strong Zoom** on hover/tap |
| Academic Overview stat cards (Verified Degrees, Courses, Saved Repositories, Profile Completed) | Not explicitly mentioned | Recommend applying the same shared zoom effect for consistency (flag to product owner — see Section 5) |
| List/Grid toggle | Not present | **Add** (optional, per product owner: "if possible") so users can view home content as list or grid |

### 4.3 Credentials Screen (Image 3)
**Reference image:** `/mnt/user-data/uploads/WhatsApp_Image_2026-09-28_at_11_44_30_AM.jpeg`

| Element | Current state | Required change |
|---|---|---|
| Header bar (RIMT logo, "Credentials" title, bell, avatar) | Static | Apply **Strong Zoom** on hover/tap |
| Filter tabs (All Records / Degrees / Transcripts) | Static | Apply **Strong Zoom** on hover/tap |
| Record cards (Bachelor of Technology, Cumulative Grade Transcript, Dean's Academic Excellence, Advanced Data Structures, etc.) | Static | Apply **Strong Zoom** on hover/tap to each card |
| List/Grid toggle | Not present | **Add** the List/Grid toggle component (per Image 6) to this screen |

### 4.4 Projects Screen (Images 4 & 6)
**Reference images:** `/mnt/user-data/uploads/WhatsApp_Image_2026-09-28_at_11_42_51_AM.jpeg` (cards/header) and `/mnt/user-data/uploads/knfwjk.jpeg` (list/grid toggle detail)

| Element | Current state | Required change |
|---|---|---|
| Header bar ("Projects" title, bell, avatar) | Static | Apply **Strong Zoom** on hover/tap |
| Category tabs (All / Academic / Personal / …) | Static | Apply **Strong Zoom** on hover/tap |
| Project cards (Academic Trust — Verification Protocol, Smart Campus Attendance Scanner, etc.) | Static (per markup) | Apply **Strong Zoom** on hover/tap |
| List/Grid toggle (already exists here, top-right, circled in Image 6) | ✅ Present | Use this as the **reference implementation** to replicate on Downloads, Credentials, and (optionally) Home |

### 4.5 Bottom Navigation Bar (all screens)
**Reference images:** visible at the bottom of all screens — `WhatsApp_Image_2026-09-28_at_11_41_51_AM.jpeg`, `_11_43_46_AM.jpeg`, `_11_44_30_AM.jpeg`, `_11_42_51_AM.jpeg` (all under `/mnt/user-data/uploads/`)

| Element | Current state | Required change |
|---|---|---|
| Home / Credentials / Projects / Downloads / Profile tab icons | Standard tab bar | Apply **Dock-style magnification** (Section 2.2) as the user moves/scans/taps across tabs |

### 4.6 Sign In Screen (Image 5)
**Reference image:** `/mnt/user-data/uploads/WhatsApp_Image_2026-09-28_at_11_48_44_AM.jpeg`

| Element | Current state | Required change |
|---|---|---|
| "Sign In to Portal" button (circled) | Static | Apply **Strong Zoom** on **both** hover and press/click/tap |

---

## 5. Consistency Rule (Design System Principle)

To keep the app **logically accurate and simple**, all zoom effects across every screen must:
1. Use the **same shared component/utility**, not screen-specific custom code.
2. Use the **same timing curve and duration** everywhere (Section 2.1), so the app feels like one coherent system rather than five different implementations.
3. Only be applied to elements that are actually **tappable/clickable/navigable** — decorative text, section labels ("Institutional Certifications", "Portfolio & Lab Works", etc.) should NOT zoom, to avoid confusing users about what's interactive.

---

## 6. Open Questions for Product Owner (before implementation)

- **Home stat cards** (Verified Degrees / Courses / Saved Repositories / Profile Completed): should these also get the zoom effect, or are they intentionally excluded since they're informational, not navigational?
- **Home screen List/Grid toggle**: confirmed as "if possible" / nice-to-have — should this apply to the Academic Overview cards, Quick Actions section, or both?
- **Dock magnification on mobile**: since true continuous drag-magnify (like macOS trackpad hover) doesn't map directly to touchscreens, confirm that a strong scale-up-on-tap per icon (rather than a live drag-scan effect) is an acceptable interpretation for the mobile app.

---

## 7. Acceptance Criteria (Definition of Done)

- [ ] Shared `ScaleOnPress`/`hoverZoom` utility created and used by all screens listed above (no duplicated per-screen animation code).
- [ ] Downloads screen: header + storage bar zoom on hover/tap; List/Grid toggle added.
- [ ] Home screen: profile avatar + search bar zoom on hover/tap.
- [ ] Credentials screen: header, tabs, and all record cards zoom on hover/tap; List/Grid toggle added.
- [ ] Projects screen: header, tabs, and project cards zoom on hover/tap (existing toggle kept as reference).
- [ ] Bottom nav bar: dock-style magnification implemented across all 5 tabs.
- [ ] Sign In screen: "Sign In to Portal" button zooms on hover and press.
- [ ] `prefers-reduced-motion` fallback implemented globally.
- [ ] QA pass on both touch (mobile) and pointer (web/tablet) input to confirm effect fires correctly on each.
