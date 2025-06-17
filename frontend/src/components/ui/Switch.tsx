interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  mode?: "default" | "theme";
}

export default function Switch({ checked, onChange, mode = "default" }: SwitchProps) {
  if (mode === "theme") {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-9 w-32 items-center justify-center rounded-full border-2 border-gray-400 px-2 transition-colors duration-300 overflow-hidden text-sm font-medium ${
          checked ? "bg-gray-800 text-white" : "bg-yellow-400 text-black"
        } hover:brightness-110`}
      >
        <span className="absolute left-2 text-base transition-opacity duration-200">
          {checked ? "🌙" : "🌞"}
        </span>
        <span className="z-10">Сменить тему</span>
        <span
          className={`absolute top-0 left-0 h-full w-6 transform rounded-full bg-white shadow transition-transform duration-300 ${
            checked ? "translate-x-[100%]" : "translate-x-0"
          }`}
        />
      </button>
    );
  }

  // Стандартный Switch
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-green-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
