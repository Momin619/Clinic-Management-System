type TabItem<T extends string> = {
  label: string;
  value: T;
};

type TabBarProps<T extends string> = {
  tabs: TabItem<T>[];
  active: T;
  onChange: (value: T) => void;
};

export default function TabBar<T extends string>({ tabs, active, onChange }: TabBarProps<T>) {
  return (
    <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-1 py-1 gap-1 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer border-0 ${
            active === tab.value
              ? "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-transparent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
