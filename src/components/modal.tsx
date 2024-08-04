import { X } from "lucide-react";
import { tv, VariantProps } from "tailwind-variants";

interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const modalVariants = tv({
  base: "rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5",

  variants: {
    size: {
      default: "max-w-md",
      large: "max-w-xl py-5 px-6",
    },
  },

  defaultVariants: {
    size: "default",
  },
});

export function Modal({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  size,
}: ModalProps) {
  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      tabIndex={-1}
      className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50`}
    >
      <div
        className={`w-full ${modalVariants({
          size,
        })}`}
      >
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-lg font-semibold">{title}</h3>
            <X
              className="end-2.5 rounded-lg hover:bg-gray-600 bg-transparent hover:text-zinc-400 transition-colors duration-300  cursor-pointer"
              onClick={handleClose}
            />
          </div>
          <p className="text-sm text-zinc-400">{subtitle}</p>
          <div className="pt-4">
            <div className="space-y-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
