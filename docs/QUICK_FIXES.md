# Quick Fixes for Common Linter Issues

## 🚨 **Immediate Fixes**

### **1. Button Accessibility Issues**

```tsx
// ❌ Problem: Button without discernible text
<button onClick={handleClick}>
  <Icon className="h-4 w-4" />
</button>

// ✅ Fix: Add title and aria-label
<button 
  onClick={handleClick}
  title="Action description"
  aria-label="Action description"
>
  <Icon className="h-4 w-4" />
</button>
```

### **2. Import Errors**

```tsx
// ❌ Problem: Importing non-existent export
import { ViewListIcon } from '@heroicons/react/24/outline'

// ✅ Fix: Use correct icon name
import { Squares2X2Icon } from '@heroicons/react/24/outline'
```

### **3. TypeScript Type Issues**

```tsx
// ❌ Problem: String literal instead of enum
if (currentView === 'week') // Type error!

// ✅ Fix: Use enum values
if (currentView === Views.WEEK) // Correct!
```

### **4. Missing Dependencies**

```tsx
// ❌ Problem: Missing useEffect dependencies
useEffect(() => {
  fetchData(user.id)
}, []) // Missing user.id

// ✅ Fix: Add dependencies
useEffect(() => {
  if (user?.id) {
    fetchData(user.id)
  }
}, [user?.id])
```

## 🔧 **Quick Commands**

```bash
# Fix all auto-fixable issues
npm run lint:fix

# Check TypeScript types
npm run type-check

# Format code
npm run format

# Run all validations
npm run validate
```

## 📋 **Pre-commit Checklist**

Before committing code, run:

1. `npm run lint:fix` - Fix linting issues
2. `npm run type-check` - Check TypeScript
3. `npm run format` - Format code
4. Test the functionality
5. Commit with descriptive message

## 🎯 **Common Patterns**

### **Accessible Button Pattern**

```tsx
const AccessibleButton = ({ onClick, icon, label, ...props }) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    {...props}
  >
    {icon}
  </button>
)
```

### **Safe Import Pattern**

```tsx
// Always check available exports first
import { 
  Squares2X2Icon, 
  ViewColumnsIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline'
```

### **Type-Safe State Pattern**

```tsx
const [currentView, setCurrentView] = useState<View>(Views.MONTH)
const [isLoading, setIsLoading] = useState<boolean>(false)
```

## 🚀 **VS Code Shortcuts**

- `Ctrl/Cmd + Shift + P` → "ESLint: Fix all auto-fixable problems"
- `Ctrl/Cmd + Shift + P` → "TypeScript: Restart TS Server"
- `Ctrl/Cmd + S` → Auto-fix on save (if configured)

## 📚 **Resources**

- [Heroicons](https://heroicons.com/) - Check available icons
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type system
- [React Accessibility](https://reactjs.org/docs/accessibility.html) - A11y guidelines
