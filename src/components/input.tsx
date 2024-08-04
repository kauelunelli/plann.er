import React from "react";

interface IInput {
  title?: string;
  type: string;
  placeholder?: string;
  value: string;
  icon?: React.ComponentType;

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  title,
  type,
  placeholder,
  value,
  icon: Icon,
  onChange,
}: IInput) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-zinc-300">
        {title}
      </label>
      <div className="h-14 flex-1 px-4 bg-zinc-950 border text-zinc-400 border-zinc-800 rounded-lg flex items-center gap-2">
        {Icon && <Icon />}
        <input
          type={type}
          onChange={onChange}
          className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
          placeholder={placeholder}
          value={value}
        />
      </div>
    </div>
  );
}
