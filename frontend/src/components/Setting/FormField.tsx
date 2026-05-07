type FormFieldProps = {
  id: string;
  label: string;
  type?: "text" | "password" | "email";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700
          bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
          placeholder-zinc-400 dark:placeholder-zinc-500
          focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100
          transition-colors"
      />
    </div>
  );
}
