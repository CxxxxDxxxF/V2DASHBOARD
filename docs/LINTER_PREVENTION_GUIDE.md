# Linter Issue Prevention Guide

## 🎯 **Overview**

This guide provides strategies to prevent common linter errors and maintain
code quality in the Rutgers Golf Dashboard project.

## 🚨 **Common Linter Issues & Solutions**

### **1. Accessibility Issues (Buttons without discernible text)**

**Problem**: Buttons missing `title`, `aria-label`, or accessible text.

**Solution**:

```tsx
// ❌ Bad
<button onClick={handleClick}>
  <Icon className="h-4 w-4" />
</button>

// ✅ Good
<button
  onClick={handleClick}
  title="Action description"
  aria-label="Action description"
>
  <Icon className="h-4 w-4" />
</button>

// ✅ Also Good - with visible text
<button onClick={handleClick}>
  <Icon className="h-4 w-4" />
  <span>Action</span>
</button>
```

**Prevention Checklist**:

- [ ] All buttons have `title` or `aria-label` attributes
- [ ] Icon-only buttons include descriptive text
- [ ] Form elements have proper labels
- [ ] Images have alt text

### **2. Import/Export Issues**

**Problem**: Importing non-existent exports or using wrong import paths.

**Solution**:

```tsx
// ❌ Bad - importing non-existent export
import { ViewListIcon } from '@heroicons/react/24/outline'

// ✅ Good - check available exports first
import { Squares2X2Icon } from '@heroicons/react/24/outline'
```

**Prevention Checklist**:

- [ ] Verify exports exist before importing
- [ ] Use TypeScript for better import checking
- [ ] Check package documentation for available exports
- [ ] Use IDE autocomplete for imports

### **3. TypeScript Type Issues**

**Problem**: Type mismatches and incorrect type usage.

**Solution**:

```tsx
// ❌ Bad - incorrect type usage
const [currentView, setCurrentView] = useState(Views.MONTH)
if (currentView === 'week') // Type error!

// ✅ Good - proper typing
const [currentView, setCurrentView] = useState<View>(Views.MONTH)
if (currentView === Views.WEEK) // Correct!
```

**Prevention Checklist**:

- [ ] Use proper TypeScript types
- [ ] Avoid string literals when enum values exist
- [ ] Use union types for multiple valid values
- [ ] Leverage TypeScript's type checking

### **4. React Hook Issues**

**Problem**: Missing dependencies in useEffect or incorrect hook usage.

**Solution**:

```tsx
// ❌ Bad - missing dependencies
useEffect(() => {
  fetchData(user.id)
}, []) // Missing user.id dependency

// ✅ Good - proper dependencies
useEffect(() => {
  if (user?.id) {
    fetchData(user.id)
  }
}, [user?.id])
```

**Prevention Checklist**:

- [ ] Include all dependencies in useEffect
- [ ] Use ESLint exhaustive-deps rule
- [ ] Avoid infinite re-renders
- [ ] Use useCallback for function dependencies

## 🛠️ **Development Workflow to Prevent Issues**

### **1. Pre-commit Hooks**

Add pre-commit hooks to catch issues early:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### **2. IDE Configuration**

**VS Code Settings**:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

**Recommended Extensions**:

- ESLint
- Prettier
- TypeScript Importer
- Error Lens

### **3. Linting Configuration**

**ESLint Rules**:

```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error"
  }
}
```

## 📋 **Code Review Checklist**

### **Before Committing**

- [ ] Run `npm run lint` and fix all errors
- [ ] Run `npm run type-check` for TypeScript issues
- [ ] Test accessibility with screen reader
- [ ] Verify all imports are valid
- [ ] Check for unused variables/imports
- [ ] Ensure proper error handling

### **During Code Review**

- [ ] Check for accessibility issues
- [ ] Verify TypeScript types are correct
- [ ] Ensure proper error boundaries
- [ ] Check for performance issues
- [ ] Verify responsive design
- [ ] Test edge cases

## 🔧 **Quick Fix Commands**

```bash
# Fix linting issues automatically
npm run lint -- --fix

# Check TypeScript types
npm run type-check

# Format code
npm run format

# Run all checks
npm run preflight
```

## 🚀 **Best Practices**

### **1. Component Structure**

```tsx
// ✅ Good component structure
interface ComponentProps {
  title: string
  onAction: () => void
}

export function Component({ title, onAction }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState()

  // Effects
  useEffect(() => {
    // Effect logic
  }, [])

  // Event handlers
  const handleClick = useCallback(() => {
    onAction()
  }, [onAction])

  // Render
  return (
    <button
      onClick={handleClick}
      title={title}
      aria-label={title}
    >
      {title}
    </button>
  )
}
```

### **2. Error Handling**

```tsx
// ✅ Good error handling
const fetchData = async () => {
  try {
    setLoading(true)
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    setData(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    setError(error instanceof Error ? error.message : 'Unknown error')
  } finally {
    setLoading(false)
  }
}
```

### **3. Accessibility Patterns**

```tsx
// ✅ Good accessibility patterns
<button
  onClick={handleClick}
  title="Close modal"
  aria-label="Close modal"
  aria-expanded={isOpen}
  aria-controls="modal-content"
>
  <XMarkIcon className="h-4 w-4" aria-hidden="true" />
</button>
```

## 📚 **Resources**

- [React Accessibility Guidelines](https://reactjs.org/docs/accessibility.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Heroicons Documentation](https://heroicons.com/)

## 🎯 **Summary**

Following these guidelines will help prevent:

- ✅ Accessibility violations
- ✅ Import/export errors
- ✅ TypeScript type issues
- ✅ React hook problems
- ✅ Performance issues
- ✅ Code quality problems

**Remember**: It's easier to write clean code from the start than to fix issues later!
