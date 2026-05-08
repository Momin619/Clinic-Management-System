import { forwardRef } from "react";
import type { ChangeEvent } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  type?: "text" | "password" | "email";
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
};

/**
 * FormField is forwardRef-enabled so React Hook Form's `register()` spread
 * (which injects { name, ref, onChange, onBlur }) works without any adapter.
 *
 * Usage with plain state:
 *   <FormField id="x" label="X" value={val} onChange={(e) => setVal(e.target.value)} />
 *
 * Usage with RHF:
 *   <FormField id="x" label="X" error={errors.x?.message} {...register("x")} />
 */
const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ id, label, type = "text", value, onChange, onBlur, placeholder, error, disabled, name }, ref) =>
  {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border
            bg-zinc-50 dark:bg-zinc-800
            text-zinc-900 dark:text-zinc-100
            placeholder-zinc-400 dark:placeholder-zinc-500
            focus:outline-none focus:ring-2
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? "border-red-400 dark:border-red-500 focus:ring-red-400 dark:focus:ring-red-500"
              : "border-zinc-200 dark:border-zinc-700 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            }`}
        />
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
export default FormField;