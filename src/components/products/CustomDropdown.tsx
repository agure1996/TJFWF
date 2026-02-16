import { useTheme } from "@/ThemeContext";

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string; // optional extra classes
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  className = "",
}: Readonly<CustomDropdownProps>) {
  const { darkMode } = useTheme();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium appearance-none w-full sm:w-auto
        ${darkMode
          ? "bg-neutral-700 border border-neutral-600 text-white hover:bg-neutral-600"
          : "bg-white border border-stone-300 text-slate-700 hover:bg-stone-50"
        } focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
