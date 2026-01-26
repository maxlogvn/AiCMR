import { LucideIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

export function Input({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = "left",
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const hasIcon = Icon !== undefined;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === "left" && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        )}
        <input
          id={inputId}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground ${
            error
              ? "border-destructive focus:ring-destructive"
              : "border-input"
          } ${hasIcon && iconPosition === "left" ? "pl-10" : ""} ${
            hasIcon && iconPosition === "right" ? "pr-10" : ""
          } ${className}`}
          {...props}
        />
        {Icon && iconPosition === "right" && (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        )}
      </div>
      {helperText && !error && (
        <p className="mt-1 text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
