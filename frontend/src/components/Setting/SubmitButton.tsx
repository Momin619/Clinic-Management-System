type Variant = "primary" | "danger";

type SubmitButtonProps = {
  loading: boolean;
  label: string;
  loadingLabel: string;
  variant?: Variant;
  type?: "submit" | "button";
  onClick?: () => void;
};

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-zinc-900 text-zinc-50 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 border-0",
  danger:
    "border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900",
};

export default function SubmitButton({
  loading,
  label,
  loadingLabel,
  variant = "primary",
  type = "submit",
  onClick,
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={`text-sm font-medium px-5 py-2 rounded-full cursor-pointer transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
