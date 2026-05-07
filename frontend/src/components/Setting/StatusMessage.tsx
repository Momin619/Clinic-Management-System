type StatusMessageProps = {
  message: { type: "success" | "error"; text: string } | null;
};

export default function StatusMessage({ message }: StatusMessageProps) {
  if (!message) return null;

  return (
    <p
      className={`text-xs font-medium ${
        message.type === "success"
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400"
      }`}
    >
      {message.text}
    </p>
  );
}
