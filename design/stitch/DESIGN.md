# THS LAB LMS — Design System (design.md)

Use these tokens on every screen. Do not invent new colors, radii, or type sizes.

## Brand

- Product: THS LAB LMS
- Category: Professional IT Learning Management System
- Vibe: premium, calm, focused, intelligent, trustworthy, educational — never gaming
- Feeling: Trust + Technology + Focus + Intelligence + Calmness + Learning + Professionalism

## Light Theme

- Primary: #1E3A8A
- Primary Hover: #1D4ED8
- Primary Soft: #DBEAFE
- Secondary / Teal: #0F766E
- Secondary Soft: #CCFBF1
- Background: #FFFFFF
- Canvas: #EFF6FF
- Surface: #FFFFFF
- Surface Muted: #F8FAFC
- Border: #E2E8F0
- Text Primary: #0F172A
- Text Secondary: #475569
- Text Muted: #64748B
- Success: #16A34A
- Success Soft: #DCFCE7
- Hint / Warning: #F59E0B
- Hint Soft: #FEF3C7
- Error: #DC2626
- Error Soft: #FEE2E2
- AI Accent: #7C3AED
- AI Soft: #EDE9FE
- Overlay: rgba(15, 23, 42, 0.62)

## Dark Theme

- Background: #0F172A
- Surface: #1E293B
- Surface Elevated: #334155
- Border: #334155
- Primary: #3B82F6
- Teal: #14B8A6
- Text Primary: #F8FAFC
- Text Secondary: #CBD5E1
- Text Muted: #94A3B8
- Success: #22C55E
- Hint: #FBBF24
- Error: #F87171
- AI Accent: #A78BFA

## Color Roles

- Primary: brand, sidebar active, primary buttons, key headings, navigation
- Teal: learning progress, completion, secondary actions
- Amber: hints, notices, attention
- Green: correct answers, completed lessons, success
- Red: incorrect answers, errors, critical warnings only
- Purple: AI Tutor only — never as a primary brand color
- Do not use neon, gold trophies, XP bars, or game gradients

## Typography

- UI Font: Inter, system-ui, sans-serif
- Code Font: JetBrains Mono, ui-monospace, monospace
- Display / H1: 36px / 700 / 1.2
- Page Title / H2: 28px / 650 / 1.25
- Section / H3: 20px / 600 / 1.3
- Card Title: 16px / 600 / 1.4
- Body: 16px / 400 / 1.6
- Small / Meta: 14px / 500 / 1.5
- Caption: 12px / 500 / 1.4
- Button: 15px / 600 / 1
- Letter spacing headings: -0.02em
- Never use decorative display fonts

## Spacing (8px grid)

- 4, 8, 12, 16, 24, 32, 40, 48, 64
- Page padding desktop: 32px
- Page padding tablet: 24px
- Page padding mobile: 16px
- Card padding: 20–24px
- Section gap: 32–48px
- Form field gap: 16px
- Sidebar width: 256px
- Top bar height: 64px
- Max content width (app): 1280px
- Max content width (marketing): 1200px

## Radius

- Button: 8px
- Input: 8px
- Badge / chip: 999px
- Card: 12px
- Large panel / modal: 16px
- Sidebar: 0
- Code editor: 8px

## Elevation

- None: cards on canvas use 1px border #E2E8F0
- Card: 0 1px 2px rgba(15, 23, 42, 0.06)
- Raised: 0 8px 24px rgba(15, 23, 42, 0.08)
- Modal: 0 24px 48px rgba(15, 23, 42, 0.18)
- Dark mode: prefer border over shadow

## Components

### Buttons
- Primary: bg #1E3A8A, text white, 12px 20px, radius 8px, height 44px
- Secondary: bg white, border #E2E8F0, text #0F172A, height 44px
- Teal: bg #0F766E, text white — progress / complete actions
- Ghost: transparent, text #1E3A8A
- Danger: bg #DC2626, text white
- Disabled: 40% opacity
- Min tap size: 44px

### Inputs
- Height 44px, 12px 14px padding, 1px #E2E8F0 border
- Focus ring: 2px #1E3A8A at 20%
- Labels above fields, 14px / 500
- Helper text 12px muted
- Error: border #DC2626 + error text below

### Cards
- White surface, 12px radius, 1px border, light shadow
- 20–24px padding
- Hover: raise shadow slightly, never loud color flash

### Sidebar (app shells)
- Light: white, 1px right border
- Dark: #1E293B
- Active item: #1E3A8A background, white text, 8px radius
- Inactive: #475569
- Group labels: 11px uppercase, #64748B, 0.06em tracking
- Logo lockup: “THS LAB” bold + “LMS” muted

### Top bar
- White, 64px, 1px bottom border
- Left: page title / breadcrumbs
- Right: search, notifications, dark-mode toggle, avatar

### Badges
- Level / role: soft primary
- Progress complete: soft teal
- Hint: soft amber
- Error: soft red
- Rank: outline, not gold metallic

### Progress
- Height 8px, track #E2E8F0, fill #0F766E, radius 999px
- Never use gamified XP bars

### Tables
- Header 12px uppercase muted
- Row height 52px
- Divider #E2E8F0
- Hover row #F8FAFC
- Mobile: stacked cards instead of horizontal scroll when possible

### Alerts
- Info: primary soft
- Success: green soft
- Hint: amber soft
- Error: red soft
- 12px radius, 12px 16px padding, icon + text

### Charts
- Professional, thin lines / muted bars
- Series: #1E3A8A, #0F766E, #3B82F6, #94A3B8
- No 3D, no neon glow

### Code editor
- Always dark: bg #0F172A, text #E2E8F0, line numbers #64748B
- JetBrains Mono 14px
- Run = teal, Reset = secondary, Test Cases = primary outline

## Layout Shells

1. Marketing: sticky top navbar + page + footer
2. Auth: centered card on #EFF6FF, logo above card
3. Student / Teacher / Admin app: left sidebar + top bar + main
4. Focus (Lesson / Quiz / Test): collapsed or hidden sidebar, max-width reading column
5. Split (Coding Lab / AI Tutor): two-pane 50/50 desktop, stacked mobile

## Responsive

- Mobile: < 768px — hamburger, collapsible sidebar, stacked cards, full-width buttons
- Tablet: 768–1024px — collapsible sidebar icons, 2-col grids
- Desktop: 1024–1440px — full sidebar, 3–4 col grids
- Large: > 1440px — centered 1280px content, do not stretch tables edge-to-edge

## Accessibility

- Contrast AA minimum
- Visible focus rings
- Do not rely on color alone for correct/incorrect — include icon + label
- Respect reduced motion: no large looping animations

## Do Not Use

- Gaming UI, neon, XP, loot, streaks with flames
- Heavy gradients, glassmorphism overload, 3D cards
- Comic icons, mascots, confetti explosions
- More than one accent gradient per page
- Decorative illustrations that compete with content
