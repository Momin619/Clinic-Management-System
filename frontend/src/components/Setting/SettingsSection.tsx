import type { ReactNode } from "react";

type SettingsSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function SettingsSection({ title, description, children }: SettingsSectionProps)
{
  return (
    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        {title}
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
        {description}
      </p>
      {children}
    </section>
  );
}
