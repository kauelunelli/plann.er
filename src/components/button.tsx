import { Loader2 } from "lucide-react";
import { ComponentProps, ReactNode } from "react";
import { VariantProps, tv } from "tailwind-variants";

const buttonVariants = tv({
  base: "rounded-lg px-5 font-medium flex items-center justify-center gap-2",

  variants: {
    variant: {
      primary: "bg-lime-300 text-lime-950 hover:bg-lime-400",
      secondary: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
    },
    disabled: {
      true: "bg-zinc-700 text-white cursor-not-allowed opacity-50 hover:bg-zinc-700",
    },
    size: {
      default: "py-2",
      full: "w-full h-11",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function Button({
  children,
  variant,
  size,
  isLoading,
  isDisabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={isDisabled}
      {...rest}
      className={buttonVariants({ variant, size, disabled: isDisabled })}
    >
      {isLoading && <Loader2 className="size-5 animate-spin mr-2" />}
      {children}
    </button>
  );
}
