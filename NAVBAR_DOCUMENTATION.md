# Navbar Component Documentation

## Overview

A fully responsive navigation bar component with glass morphism effect, sticky positioning, and mobile hamburger menu.

## Features

### ✅ Desktop Features
- **Logo with Icon** - Graduation cap icon with "Studentlytics" branding
- **Navigation Menu** - 6 menu items: Home, About Us, Services, Students, Courses, Sessions
- **Action Buttons** - "Login" (ghost variant) and "Get Started" (primary variant)
- **Hover Effects** - Animated underline on nav items, smooth transitions
- **Gradient Logo Text** - Primary gradient on the brand name

### ✅ Mobile Features
- **Hamburger Menu** - Animated menu toggle (Menu/X icon)
- **Slide-in Animation** - Smooth dropdown animation with Framer Motion
- **Stacked Layout** - Full-width navigation items and buttons
- **Touch-Friendly** - Large tap targets for mobile devices

### ✅ Styling
- **Sticky Position** - Stays at top while scrolling
- **Glass Morphism** - Backdrop blur with semi-transparent background
- **Subtle Border** - Bottom border with reduced opacity
- **Shadow Effect** - Subtle shadow on "Get Started" button
- **Responsive Breakpoint** - Switches at `md` (768px)

## Component Structure

```
Navbar
├── Desktop Layout (hidden on mobile)
│   ├── Logo (left)
│   ├── Navigation Links (center)
│   └── Action Buttons (right)
│
└── Mobile Layout (hidden on desktop)
    ├── Hamburger Button
    └── Dropdown Menu (AnimatePresence)
        ├── Navigation Links
        └── Action Buttons
```

## File Locations

- **Component**: `src/components/Navbar.tsx`
- **Layout**: `src/layouts/MainLayout.tsx`
- **Routes**: `src/App.tsx`

## Pages Created

All navigation items link to functional pages:

1. **HomePage** (`/`) - Dashboard with stats and charts
2. **AboutPage** (`/about`) - Company information with mission/values
3. **ServicesPage** (`/services`) - Service offerings in card grid
4. **StudentsPage** (`/students`) - Student management with search
5. **CoursesPage** (`/courses`) - Course catalog with details
6. **SessionsPage** (`/sessions`) - Upcoming sessions and workshops

## Usage

The navbar is automatically included in all pages through the `MainLayout` component:

```tsx
// App.tsx
<Routes>
  <Route element={<MainLayout />}>
    <Route path="/" element={<HomePage />} />
    {/* Other routes */}
  </Route>
</Routes>
```

## Customization

### Change Navigation Items

Edit the `navItems` array in `Navbar.tsx`:

```tsx
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  // Add or modify items here
]
```

### Modify Styling

The navbar uses Tailwind CSS classes. Key classes:

- **Sticky**: `sticky top-0 z-50`
- **Glass Effect**: `bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`
- **Border**: `border-b border-border/40`

### Button Variants

- **Login Button**: `variant="ghost"` - Transparent with hover effect
- **Get Started Button**: Primary with shadow (`shadow-lg shadow-primary/20`)

## Animations

### Desktop
- **Hover Underline**: Animated width transition on nav items
- **Opacity**: Logo hover effect

### Mobile
- **Menu Toggle**: Smooth icon transition (Menu ↔ X)
- **Dropdown**: Height and opacity animation
- **Stagger**: Sequential fade-in for menu items (50ms delay each)

## Responsive Breakpoints

- **Mobile**: `< 768px` - Hamburger menu
- **Desktop**: `≥ 768px` - Full horizontal layout

## Dependencies

- **React Router DOM** - Navigation links
- **Framer Motion** - Animations
- **Lucide React** - Icons (GraduationCap, Menu, X)
- **Shadcn/ui Button** - Styled buttons

## Browser Support

- Modern browsers with backdrop-filter support
- Graceful fallback for older browsers (solid background)

## Accessibility

- Semantic HTML (`<nav>`, `<button>`)
- ARIA labels on mobile menu button
- Keyboard navigation support
- Focus states on interactive elements

## Performance

- Minimal re-renders with `useState` for menu state
- CSS-based animations (GPU accelerated)
- Lazy loading with AnimatePresence

## Future Enhancements

Potential improvements:

- [ ] Active route highlighting
- [ ] Dropdown submenus
- [ ] User profile menu
- [ ] Notifications badge
- [ ] Search bar integration
- [ ] Theme toggle (light/dark mode)
- [ ] Scroll-based navbar shrinking
