import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteButton({ onClick }: { onClick: () => void }) {
  const [deleteOption, setDeleteOption] = useState(false);

  const handleMouseEnter = () => {
    setDeleteOption(true);
  }
  const handleMouseLeave = () => {
    setDeleteOption(false);
  }

  const handleClick = () => {
    onClick();
  }

  return (
    <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} className="size-5">
      {deleteOption &&
        <Trash2 className="size-5" />
      }
    </button>
  );
}
