# Shadcn/ui Component Guide

## Adding New Components

Since we've manually set up the project, you can add Shadcn/ui components in two ways:

### Method 1: Manual Installation (Recommended for this setup)

1. Visit [ui.shadcn.com](https://ui.shadcn.com/docs/components)
2. Choose a component (e.g., "Dialog", "Dropdown Menu", etc.)
3. Copy the component code from the documentation
4. Create a new file in `src/components/ui/[component-name].tsx`
5. Paste and adjust the imports if needed

### Method 2: Using Shadcn CLI (Alternative)

If you want to use the CLI, first install it globally:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add tabs
```

## Already Included Components

✅ **Button** - `src/components/ui/button.tsx`
✅ **Card** - `src/components/ui/card.tsx`

## Commonly Used Components for Analytics Dashboards

Here are components you might want to add for Studentlytics:

### Data Display
- **Table** - For displaying student data
- **Badge** - For status indicators
- **Avatar** - For student profiles
- **Progress** - For completion rates

### Forms & Inputs
- **Input** - Text inputs
- **Select** - Dropdown selections
- **Checkbox** - Multiple selections
- **Radio Group** - Single selections
- **Date Picker** - Date selection
- **Form** - Form handling

### Navigation
- **Tabs** - Content organization
- **Navigation Menu** - Site navigation
- **Breadcrumb** - Page hierarchy
- **Pagination** - Data pagination

### Overlays
- **Dialog** - Modal dialogs
- **Sheet** - Side panels
- **Popover** - Contextual information
- **Tooltip** - Helpful hints
- **Alert Dialog** - Confirmations

### Feedback
- **Alert** - Important messages
- **Toast** - Notifications
- **Skeleton** - Loading states

## Example: Adding a Dialog Component

1. Create `src/components/ui/dialog.tsx`
2. Copy the Dialog component code from [ui.shadcn.com/docs/components/dialog](https://ui.shadcn.com/docs/components/dialog)
3. Make sure the imports use `@/utils/cn` for the `cn` utility

## Usage Example

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Details</CardTitle>
        <CardDescription>View student information</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>View More</Button>
      </CardContent>
    </Card>
  )
}
```

## Styling Tips

- All components use Tailwind CSS classes
- Colors are defined using CSS variables in `src/index.css`
- You can customize the theme by modifying the CSS variables
- Dark mode is supported out of the box

## Path Aliases

The project is configured with path aliases:
- `@/components` → `src/components`
- `@/utils` → `src/utils`

This allows you to import like:
```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
```

## Resources

- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives) (underlying components)
