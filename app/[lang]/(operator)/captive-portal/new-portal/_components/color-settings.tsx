"use client";
import { ChangeEvent } from "react";

type Field = "background" | "button" | "text";
type Values = Record<Field, string>;

interface ColorSettingsProps {
  /** Colores actuales (estado manejado por el padre) */
  value: Values;
  /** Se dispara cada vez que cambie algún color */
  onChange: (next: Values) => void;
}

export default function ColorSettings({ value, onChange }: ColorSettingsProps) {
  const handleChange = (field: Field) => (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-6">
        {[
          { label: "Background Color", key: "background" as Field },
          { label: "Button Color", key: "button" as Field },
          { label: "Text Color", key: "text" as Field },
        ].map(({ label, key }) => (
          <div key={key} className="flex flex-col space-y-3">
            <label htmlFor={key} className="font-medium">
              {label}
            </label>

            <div className="flex items-center gap-1 rounded-[10px] bg-[#F8FAFA] px-2 py-2">
              <input
                id={key}
                type="color"
                value={value[key]}
                onChange={handleChange(key)}
                className="w-10 h-10 cursor-pointer rounded-sm border-none"
              />
              <input
                type="text"
                value={value[key]}
                onChange={handleChange(key)}
                className="w-24 bg-transparent text-black text-sm outline-none"
                maxLength={7}
                pattern="^#([A-Fa-f0-9]{6})$"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
