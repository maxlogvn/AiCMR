'use client';

import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  presets?: string[];
  disabled?: boolean;
}

const defaultPresets = [
  '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4',
  '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#6B7280',
];

export function ColorPicker({
  value,
  onChange,
  presets = defaultPresets,
  disabled = false,
}: ColorPickerProps) {
  return (
    <div className="space-y-2">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange?.(color)}
            disabled={disabled}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === color
                ? 'border-gray-900 dark:border-white scale-110'
                : 'border-transparent hover:scale-105'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>

      {/* Custom Color */}
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-16 h-10 p-1 cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder="#FF0000"
          maxLength={7}
          pattern="^#[0-9A-Fa-f]{6}$"
        />
      </div>
    </div>
  );
}
