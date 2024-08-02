interface IInput {
  title?: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ title, type, placeholder, value, onChange }: IInput) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-zinc-300">
        {title}
      </label>
      <input
        type={type}
        onChange={onChange}
        className="block w-full p-2.5 text-base rounded-lg border-gray-500 placeholder-gray-400 text-white"
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}
