========================
RESPONSIVE UI MAP
========================

## 1. GLOBAL LAYOUT SYSTEM (APP SHELL)

### Desktop Layout:
- **Layout type:** Top navigation bar + content area with tabbed interface (no sidebar)
- **Navbar:**
  - Logo (icon + "DocFormatter" text)
  - Action buttons: Undo, Redo, Export, Import, Reset, Dark Mode toggle
  - Buttons use `hidden sm:inline` for text labels (visible on desktop)
- **Sidebar:** None
- **Content area:**
  - Palette bar (horizontal scrollable row)
  - Tab bar (Elements, Layout, Output)
  - Tab content (fills remaining vertical space, scrollable)

### Mobile Layout:
- **Layout type:** Stacked single-column with top navbar
- **Navbar behavior:**
  - Condensed: text labels hidden (`hidden sm:inline`), showing icons only
  - Height reduced (h-12)
  - Action buttons remain tappable with icons
- **Navigation pattern:**
  - Tab bar persists at top (sticky) with three tabs
  - No drawer or bottom navigation
- **Content flow:**
  - Single-column stack: palette bar → tabs → tab content
  - All sections stack vertically, no horizontal columns

---

## 2. PAGES STRUCTURE

### Page: Home (`/`)

#### Desktop Layout
- **Grid/Flex structure:** `flex-col` main container, navbar fixed height, rest scrolls
- **Sections order (top → bottom):**
  1. Navbar (fixed)
  2. Palette bar (horizontal scroll)
  3. Tab bar (Elements | Layout | Output)
  4. Tab content (scrollable area)

#### Mobile Layout
- **Single column flow order:**
  1. Navbar (condensed)
  2. Palette bar (scrollable)
  3. Tab bar (sticky)
  4. Tab content (stacked, scrollable)
- **Collapsed sections behavior:**
  - Palette bar: always visible, horizontally scrollable
  - Element editors: collapsed by default, expand on tap
  - Presets panel: collapsible, stacks vertically

### Page: Preview (`/preview`)

#### Desktop Layout
- Full-page preview with back button
- Likely single content area with preview rendering

#### Mobile Layout
- Same as desktop but viewport scaled
- Back button remains accessible (top-left)

---

## 3. RESPONSIVE COMPONENT BEHAVIOR

List components that change across devices:

- **Navbar buttons:**
  - Desktop: icons + text labels side by side
  - Mobile: icons only, text hidden (`hidden sm:inline`)
  - Breakpoint change rule: `sm:` (640px+)

- **Palette buttons:**
  - Desktop: horizontal row with text labels
  - Mobile: same horizontal scroll, labels visible (no change)
  - Breakpoint: none (always horizontal scroll)

- **Tab bar:**
  - Desktop: three tabs with icon + text
  - Mobile: same (text remains visible, tabs flex-1)
  - Breakpoint: none

- **Presets grid:**
  - Desktop: `grid-cols-2` (two-column)
  - Mobile: `grid-cols-1` (single column stack)
  - Breakpoint: `sm:` (640px+)

- **Margin/spacing controls:**
  - Desktop: `grid-cols-2` (two-column layout)
  - Mobile: implicitly stacks (single column)
  - Breakpoint: default stack, no explicit grid change

- **ElementEditor internal layout:**
  - Desktop: multi-column grid for selects/inputs (color, font family, size, etc.)
  - Mobile: single-column stack within editor
  - Breakpoint: internal components use `sm:` variants

- **PromptOutput AI tool tabs:**
  - Desktop: three tabs side by side (flex-1 each)
  - Mobile: same (flex-1 each, no change)
  - Breakpoint: none

---

## 4. REUSABLE COMPONENT SYSTEM

- **ElementEditor:**
  - Used in: Home page (Elements tab)
  - Desktop version: collapsible card with internal grid layout for controls
  - Mobile version: same collapsible card, internal controls stack vertically

- **PromptOutput:**
  - Used in: Home page (Output tab)
  - Desktop version: AI tool tabs + copy button + preformatted text block
  - Mobile version: identical layout (tabs remain horizontal)

- **FloatingPreviewButton:**
  - Used in: Home page (floating action)
  - Desktop version: fixed position (likely bottom-right)
  - Mobile version: fixed position (likely bottom-center or bottom-right)

- **ColorInput:**
  - Used in: ElementEditor
  - Desktop: horizontal flex with label + color picker + text input
  - Mobile: same (flex-col? Actually uses `justify-between` so likely same)

- **SelectInput:**
  - Used in: ElementEditor
  - Desktop: label above select dropdown
  - Mobile: same (label above, full-width select)

---

## 5. NAVIGATION SYSTEM

- **Desktop navigation pattern:**
  - Top tab bar with three tabs (Elements, Layout, Output)
  - Router handles `/` and `/preview` routes
  - No sidebar or drawer

- **Mobile navigation pattern:**
  - Same top tab bar (no hamburger menu)
  - Tabs remain accessible at top
  - Preview page accessed via FloatingPreviewButton

- **State changes:**
  - Tab switching: updates `activeTab` state, renders corresponding content
  - Element editor: open/close state per element (local `useState`)
  - Presets panel: toggle `showPresets` state
  - Dark mode: toggle `darkMode` state, updates `document.documentElement.classList`

---

## 6. USER FLOWS (RESPONSIVE IMPACT)

- **Flow: Configure element styling**
  - Desktop steps:
    1. Navigate to Elements tab
    2. Search/filter elements
    3. Click element editor to expand
    4. Adjust font, color, spacing via grid of controls
    5. Collapse editor
  - Mobile steps (similar but):
    1. Navigate to Elements tab (tab bar)
    2. Search bar full width
    3. Tap element editor to expand (full-width card)
    4. Controls stack vertically (single column)
    5. Tap to collapse
  - UI transitions: expand/collapse animation (likely CSS transition)

- **Flow: Generate prompt**
  - Desktop steps:
    1. Navigate to Output tab
    2. Select AI tool (ChatGPT/Claude/Gemini) via tabs
    3. Click Copy button
    4. View prompt text in scrollable area
  - Mobile steps: identical (tabs remain horizontal)
  - UI transitions: tab switch updates prompt text instantly

- **Flow: Change theme**
  - Desktop: click palette button in horizontal bar
  - Mobile: same (palette bar scrolls horizontally)

---

## 7. DATA-DRIVEN COMPONENTS

- **Tables:** None in this application

- **Forms (ElementEditor controls):**
  - Desktop layout: multi-column grid for selects (font family, font weight, font size, alignment, etc.)
  - Mobile layout: single column stack (each control full width)
  - Breakpoint: internal controls use `sm:` classes for responsive grid

- **Modals:** None, but:
  - **Collapsible editors:** behave like accordions
  - **Popup-like components:** FloatingPreviewButton triggers navigation to Preview page
  - Desktop: standard page transition
  - Mobile: same page transition (no bottom sheet)

- **Prompt text display:**
  - Desktop: fixed-height `<pre>` block with `max-h-64 overflow-y-auto`
  - Mobile: same (scrollable within container)
  - Breakpoint: none (consistent across devices)

---

**Note:** This map is derived from the codebase of the Document Format Prompt Generator (`artifacts/doc-formatter/`). The app uses Tailwind CSS with `sm:` breakpoint (640px) for most responsive behavior. No major layout shifts occur; primarily button labels hide and grid columns collapse to single column on mobile.
