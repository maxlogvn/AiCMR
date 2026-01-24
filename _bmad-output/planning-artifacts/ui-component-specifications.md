# UI Component Specifications - AiCMR

**Version:** 1.0
**Date:** 2026-01-24
**Design System:** Indigo/Teal palette, Inter typography, 8px spacing

---

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Layout Components](#layout-components)
3. [Navigation Components](#navigation-components)
4. [Form Components](#form-components)
5. [Data Display Components](#data-display-components)
6. [Feedback Components](#feedback-components)
7. [Overlays Components](#overlays-components)

---

## Design Tokens

### Colors

```typescript
// tokens/colors.ts
export const colors = {
  // Primary (Indigo)
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5', // Primary actions
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  // Accent (Teal)
  accent: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // CTA, highlights
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },
  // Neutral (Gray)
  gray: {
    50: '#F9FAFB',  // Background
    100: '#F3F4F6',
    200: '#E5E7EB', // Border
    300: '#D1D5DB',
    400: '#9CA3AF', // Disabled
    500: '#6B7280',
    600: '#4B5563', // Text secondary
    700: '#374151',
    800: '#1F2937',
    900: '#111827', // Text primary
  },
  // Semantic
  semantic: {
    success: '#10B981', // Published, active
    warning: '#F59E0B', // Draft, pending
    error: '#EF4444',   // Error, deleted
    info: '#3B82F6',     // Info, scheduled
  },
} as const;
```

### Typography

```typescript
// tokens/typography.ts
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    display: ['48px', { lineHeight: '56px', letterSpacing: '-0.02' }],
    h1: ['36px', { lineHeight: '40px', letterSpacing: '-0.02' }],
    h2: ['30px', { lineHeight: '36px', letterSpacing: '-0.01' }],
    h3: ['24px', { lineHeight: '32px' }],
    h4: ['20px', { lineHeight: '28px' }],
    bodyLg: ['18px', { lineHeight: '28px' }],
    body: ['16px', { lineHeight: '24px' }],
    bodySm: ['14px', { lineHeight: '20px', letterSpacing: '0.01' }],
    caption: ['12px', { lineHeight: '16px', letterSpacing: '0.04' }],
  },
} as const;
```

### Spacing

```typescript
// tokens/spacing.ts
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;
```

### Border Radius

```typescript
// tokens/radius.ts
export const radius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;
```

### Shadows

```typescript
// tokens/shadows.ts
export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;
```

---

## Layout Components

### Container

**Purpose:** Wrapper component with max-width and centering

```typescript
// components/layout/Container.tsx
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
}) => {
  const sizes = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg', // 1024px
    xl: 'max-w-screen-xl', // 1280px
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
};
```

**Variants:**
- `sm`: 640px max-width
- `md`: 768px max-width
- `lg`: 1024px max-width (default)
- `xl`: 1280px max-width
- `full`: No max-width

---

### Sidebar

**Purpose:** Main navigation sidebar with rank-based visibility

```typescript
// components/layout/Sidebar.tsx
interface SidebarProps {
  userRank: number; // 0-10
  currentPath?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  minRank: number;
  children?: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  userRank,
  currentPath = '/',
  collapsed = false,
  onToggle,
}) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/', minRank: 0 },
    { id: 'blog', label: 'Blog', icon: '📝', path: '/blog', minRank: 0 },
    { id: 'profile', label: 'My Profile', icon: '👤', path: '/user/profile', minRank: 1 },
    { id: 'my-posts', label: 'My Posts', icon: '✍️', path: '/user/posts', minRank: 3 },
    { id: 'divider-1', label: 'DASHBOARD', icon: '', path: '#', minRank: 5, isDivider: true },
    { id: 'posts', label: 'All Posts', icon: '✍️', path: '/dashboard/posts', minRank: 5 },
    { id: 'categories', label: 'Categories', icon: '📂', path: '/dashboard/categories', minRank: 5 },
    { id: 'tags', label: 'Tags', icon: '🏷️', path: '/dashboard/tags', minRank: 5 },
    { id: 'users', label: 'Users', icon: '👥', path: '/dashboard/users', minRank: 5 },
    { id: 'stats', label: 'Statistics', icon: '📊', path: '/dashboard/stats', minRank: 5 },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/dashboard/settings', minRank: 10 },
    { id: 'logout', label: 'Logout', icon: '🚀', path: '/logout', minRank: 1 },
  ];

  const visibleItems = navItems.filter(item => item.minRank <= userRank);

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200
        transition-all duration-300 z-40
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        {!collapsed ? (
          <span className="text-xl font-bold text-gray-900">AiCMR</span>
        ) : (
          <span className="text-xl font-bold text-gray-900">A</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {visibleItems.map((item) => (
          item.isDivider ? (
            <div
              key={item.id}
              className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
            >
              {!collapsed && item.label}
            </div>
          ) : (
            <SidebarItem
              key={item.id}
              item={item}
              currentPath={currentPath}
              collapsed={collapsed}
            />
          )
        ))}
      </nav>

      {/* Toggle Button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute bottom-4 right-4 p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          {collapsed ? '→' : '←'}
        </button>
      )}
    </aside>
  );
};
```

**States:**
- Default: Full width (240px)
- Collapsed: Icon only (64px)
- Active: Highlight current page
- Hover: Light gray background

---

### TopBar

**Purpose:** Header with breadcrumb, actions, user menu

```typescript
// components/layout/TopBar.tsx
interface TopBarProps {
  title?: string;
  breadcrumb?: BreadcrumbItem[];
  actions?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    rank: number;
  };
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  breadcrumb = [],
  actions,
  user,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-4">
        {breadcrumb.length > 0 && (
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-400">/</span>}
                {item.href ? (
                  <a href={item.href} className="text-gray-600 hover:text-gray-900">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-gray-900 font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        {title && (
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center gap-4">
        {actions}
        {user && <UserMenu user={user} />}
      </div>
    </header>
  );
};
```

---

## Navigation Components

### SidebarItem

```typescript
// components/navigation/SidebarItem.tsx
interface SidebarItemProps {
  item: NavItem;
  currentPath: string;
  collapsed?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  currentPath,
  collapsed = false,
}) => {
  const isActive = currentPath === item.path;

  return (
    <a
      href={item.path}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg
        transition-colors duration-150
        ${isActive
          ? 'bg-primary-50 text-primary-600 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="text-lg">{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </a>
  );
};
```

**States:**
- Default: Gray text
- Active: Primary-50 background, Primary-600 text
- Hover: Gray-100 background

---

### Pagination

```typescript
// components/navigation/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize = 10,
  totalItems,
  onPageChange,
}) => {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Info */}
      {totalItems && (
        <span className="text-sm text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} results
        </span>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`
                min-w-[40px] h-10 rounded-lg
                ${currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'border border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

function getPageNumbers(current: number, total: number): (number | string)[] {
  const pages: (number | string)[] = [];
  const showAround = 2;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - showAround && i <= current + showAround)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return pages;
}
```

**Variants:**
- With info: Shows "X to Y of Z results"
- Without info: Just pagination controls

---

### Tabs

```typescript
// components/navigation/Tabs.tsx
interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: number | string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'line' | 'pilled';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
}) => {
  const baseClasses = "flex items-center gap-2 px-4 py-2 font-medium transition-colors";
  const variantClasses = {
    line: {
      base: "border-b-2",
      active: "border-primary-600 text-primary-600",
      inactive: "border-transparent text-gray-500 hover:text-gray-700",
    },
    pilled: {
      base: "rounded-full",
      active: "bg-primary-600 text-white",
      inactive: "text-gray-500 hover:bg-gray-100",
    },
  };

  return (
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={`
            ${baseClasses}
            ${variantClasses[variant].base}
            ${activeTab === tab.id
              ? variantClasses[variant].active
              : variantClasses[variant].inactive
            }
            ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {tab.icon && <span>{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
```

**Variants:**
- `line`: Underline style (default)
- `pilled`: Pill-shaped buttons

---

## Form Components

### Button

```typescript
// components/form/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-600",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {!loading && leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};
```

**Variants:**
- `primary`: Indigo-600 background (default)
- `secondary`: White with border
- `ghost`: Transparent with hover
- `destructive`: Red-600 background

**Sizes:**
- `sm`: 32px height
- `md`: 40px height (default)
- `lg`: 48px height

---

### Input

```typescript
// components/form/Input.tsx
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  leftAddon,
  rightAddon,
  fullWidth = true,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || useId();
  const hasError = Boolean(error);

  const inputClasses = `
    w-full px-3 py-2 rounded-lg border
    ${hasError
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
    }
    focus:outline-none focus:ring-2
    ${leftIcon || rightIcon ? 'pl-10' : ''}
    bg-white disabled:bg-gray-50 disabled:text-gray-400
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {leftAddon && (
          <div className="absolute left-0 top-0 bottom-0 px-3 flex items-center border border-r-0 rounded-l-lg bg-gray-50 text-gray-500 border-gray-300">
            {leftAddon}
          </div>
        )}

        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          className={`${inputClasses} ${leftAddon ? 'rounded-l-none pl-10' : ''} ${rightAddon ? 'rounded-r-none' : ''}`}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </span>
        )}

        {rightAddon && (
          <div className="absolute right-0 top-0 bottom-0 px-3 flex items-center border border-l-0 rounded-r-lg bg-gray-50 text-gray-500 border-gray-300">
            {rightAddon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
```

**States:**
- Default: Gray-300 border
- Focus: Primary-500 ring
- Error: Red-500 border and ring
- Disabled: Gray-50 background

---

### Select

```typescript
// components/form/Select.tsx
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  fullWidth = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const hasError = Boolean(error);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 rounded-lg border
            flex items-center justify-between
            ${hasError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary-500'
            }
            focus:outline-none focus:ring-2
            bg-white disabled:bg-gray-50
          `}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption?.label || placeholder}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                disabled={option.disabled}
                className={`
                  w-full px-3 py-2 text-left hover:bg-gray-50
                  ${option.value === value ? 'bg-primary-50 text-primary-600' : 'text-gray-900'}
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={`mt-1 text-sm ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
```

---

### Checkbox

```typescript
// components/form/Checkbox.tsx
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, indeterminate = false, className = '', ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle indeterminate state
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <input
          ref={(el) => {
            inputRef.current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref) ref.current = el;
          }}
          type="checkbox"
          className={`
            mt-0.5 w-4 h-4 rounded border-gray-300
            text-primary-600 focus:ring-primary-500
            ${error ? 'border-red-500' : ''}
          `}
          {...props}
        />
        {label && (
          <label className="text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);
```

---

### RadioGroup

```typescript
// components/form/RadioGroup.tsx
interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error,
  orientation = 'vertical',
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className={orientation === 'horizontal' ? 'flex gap-6' : 'space-y-2'}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={option.disabled}
              className={`
                mt-0.5 w-4 h-4 border-gray-300
                text-primary-600 focus:ring-primary-500
                ${error ? 'border-red-500' : ''}
              `}
            />
            <div>
              <span className="text-sm font-medium text-gray-900">{option.label}</span>
              {option.description && (
                <p className="text-sm text-gray-500">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

---

### Toggle

```typescript
// components/form/Toggle.tsx
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <label className={`flex items-center justify-between gap-4 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div>
        {label && (
          <span className="text-sm font-medium text-gray-900">{label}</span>
        )}
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-150 ease-in-out
          ${checked ? 'bg-primary-600' : 'bg-gray-200'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 rounded-full bg-white
            transition-transform duration-150 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </label>
  );
};
```

---

## Data Display Components

### Badge

```typescript
// components/data-display/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};
```

**Variants:**
- `default`: Gray
- `success`: Green (Published, Active)
- `warning`: Yellow (Draft, Pending)
- `error`: Red (Error, Deleted)
- `info`: Blue (Scheduled)

---

### StatusBadge (for posts)

```typescript
// components/data-display/StatusBadge.tsx
type PostStatus = 'published' | 'draft' | 'scheduled' | 'archived';

interface StatusBadgeProps {
  status: PostStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = {
    published: { icon: '✅', label: 'Published', variant: 'success' as const },
    draft: { icon: '⏳', label: 'Draft', variant: 'warning' as const },
    scheduled: { icon: '📅', label: 'Scheduled', variant: 'info' as const },
    archived: { icon: '🗑️', label: 'Archived', variant: 'default' as const },
  };

  const { icon, label, variant } = config[status];

  return (
    <Badge variant={variant} icon={icon} className={className}>
      {label}
    </Badge>
  );
};
```

---

### RankBadge

```typescript
// components/data-display/RankBadge.tsx
type UserRank = 0 | 1 | 2 | 3 | 4 | 5 | 10;

interface RankBadgeProps {
  rank: UserRank;
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, className = '' }) => {
  const config = {
    0: { icon: '👤', label: 'Guest', variant: 'default' as const },
    1: { icon: '👥', label: 'Member', variant: 'default' as const },
    2: { icon: '👥', label: 'Member', variant: 'default' as const },
    3: { icon: '✍️', label: 'Editor', variant: 'info' as const },
    4: { icon: '✍️', label: 'Editor', variant: 'info' as const },
    5: { icon: '🔧', label: 'Moderator', variant: 'warning' as const },
    10: { icon: '👑', label: 'Admin', variant: 'error' as const },
  };

  const { icon, label, variant } = config[rank] || config[0];

  return (
    <Badge variant={variant} icon={icon} className={className}>
      {label}
    </Badge>
  );
};
```

---

### Card

```typescript
// components/data-display/Card.tsx
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  image,
  imageAlt,
  footer,
  hoverable = false,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${hoverable ? 'hover:shadow-md transition-shadow' : ''} ${className}`}>
      {image && (
        <img src={image} alt={imageAlt} className="w-full h-48 object-cover rounded-t-xl" />
      )}

      {(title || subtitle || actions) && (
        <div className="p-4 pb-0 flex items-start justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {children && <div className="p-4">{children}</div>}

      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};
```

---

### DataTable

```typescript
// components/data-display/DataTable.tsx
interface Column<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  rowKey,
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && selectedKeys.length === data.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(data.map(row => String(row[rowKey])));
    }
  };

  const handleSelectRow = (key: string) => {
    if (selectedKeys.includes(key)) {
      onSelectionChange?.(selectedKeys.filter(k => k !== key));
    } else {
      onSelectionChange?.([...selectedKeys, key]);
    }
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {selectable && (
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const key = String(row[rowKey]);
              const isSelected = selectedKeys.includes(key);

              return (
                <tr
                  key={key}
                  className={`
                    ${isSelected ? 'bg-primary-50' : ''}
                    ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Feedback Components

### Spinner

```typescript
// components/feedback/Spinner.tsx
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${color} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};
```

---

### Toast

```typescript
// components/feedback/Toast.tsx
type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  title: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  message,
  variant = 'info',
  onClose,
}) => {
  const config = {
    success: { icon: '✅', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    error: { icon: '❌', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    warning: { icon: '⚠️', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    info: { icon: 'ℹ️', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  };

  const { icon, bgColor, borderColor } = config[variant];

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{icon}</span>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          {message && (
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
```

---

### Alert

```typescript
// components/feedback/Alert.tsx
interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  onClose,
  className = '',
}) => {
  const config = {
    success: { icon: '✅', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
    error: { icon: '❌', bgColor: 'bg-red-50', iconColor: 'text-red-600' },
    warning: { icon: '⚠️', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    info: { icon: 'ℹ️', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
  };

  const { icon, bgColor, iconColor } = config[variant];

  return (
    <div className={`${bgColor} border border-current rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className={`text-lg ${iconColor}`}>{icon}</span>
        <div className="flex-1">
          {title && (
            <h5 className="text-sm font-medium text-gray-900 mb-1">{title}</h5>
          )}
          <div className="text-sm text-gray-700">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-auto"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
```

---

## Overlays Components

### Modal

```typescript
// components/overlays/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Focus trap
  useFocusTrap({ isOpen });

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full m-4',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
```

---

### Dialog (Confirm Dialog)

```typescript
// components/overlays/Dialog.tsx
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
}) => {
  const config = {
    danger: { icon: '⚠️', confirmVariant: 'destructive' as const },
    warning: { icon: '⚠️', confirmVariant: 'primary' as const },
    info: { icon: 'ℹ️', confirmVariant: 'primary' as const },
  };

  const { icon, confirmVariant } = config[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <span className="text-4xl">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-900 mt-4">{title}</h3>
        <p className="text-gray-600 mt-2">{message}</p>
      </div>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const ModalFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-end gap-3 mt-6">
    {children}
  </div>
);
```

---

### Tooltip

```typescript
// components/overlays/Tooltip.tsx
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div className={`
          absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg
          pointer-events-none whitespace-nowrap
          ${placement === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2'}
          ${placement === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2'}
          ${placement === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2'}
          ${placement === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2'}
        `}>
          {content}
        </div>
      )}
    </div>
  );
};
```

---

## TailwindCSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

---

## Component Usage Examples

### Button Examples

```typescript
// Primary button
<Button>Click me</Button>

// With icon
<Button leftIcon={<span>+</span>}>Add New</Button>

// Loading state
<Button loading>Submitting...</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Input Examples

```typescript
// Basic input
<Input label="Email" type="email" placeholder="you@example.com" />

// With error
<Input label="Email" error="Invalid email address" />

// With icon
<Input
  label="Search"
  leftIcon={<span>🔍</span>}
  placeholder="Search posts..."
/>

// With addon
<Input
  label="Website"
  leftAddon="https://"
  placeholder="example.com"
/>
```

### Badge Examples

```typescript
// Status badges
<StatusBadge status="published" />  // ✅ Published
<StatusBadge status="draft" />      // ⏳ Draft
<StatusBadge status="scheduled" />  // 📅 Scheduled

// Rank badges
<RankBadge rank={0} />  // 👤 Guest
<RankBadge rank={5} />  // 🔧 Moderator
<RankBadge rank={10} /> // 👑 Admin
```

---

## Accessibility Guidelines

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Use `tabindex` appropriately
- Provide visible focus indicators
- Support Escape key for closing modals/dropdowns

### Screen Readers

- Use `aria-label` for icon-only buttons
- Use `aria-current` for active navigation items
- Use `aria-expanded` for dropdowns/toggles
- Use `role` attributes for custom components

### Color Contrast

- Text contrast ratio: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum

---

## Implementation Checklist

- [ ] Create `/src/tokens/` directory with design tokens
- [ ] Create `/src/components/ui/` for all base components
- [ ] Export components from index file
- [ ] Add Storybook stories for visual testing
- [ ] Write unit tests for components
- [ ] Document component props with TSDoc
- [ ] Add keyboard navigation tests
- [ ] Verify color contrast ratios
