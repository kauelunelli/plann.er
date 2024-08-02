import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      tabIndex={-1}
      className={` ${
        isOpen
          ? "flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full animate-fadeIn bg-black bg-opacity-50"
          : ""
      }`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-zinc-900">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <X
              className="end-2.5 rounded-lg hover:bg-gray-600 bg-transparent hover:text-zinc-400 transition-colors duration-300  cursor-pointer"
              onClick={handleClose}
            />
          </div>
          <div className="p-4 md:p-5">
            <div className="space-y-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
