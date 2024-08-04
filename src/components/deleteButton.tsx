import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
  isDisplayed: boolean;
}

export function DeleteButton({ onClick, isDisplayed }: DeleteButtonProps) {
  const handleClick = () => {
    onClick();
  };

  return (
    <button onClick={handleClick} className="size-5">
      {isDisplayed && <Trash2 className="size-5" />}
    </button>
  );
}
