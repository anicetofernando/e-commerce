import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20",
  secondary: "bg-ink-900 text-white hover:bg-ink-800",
  outline: "border border-ink-200 text-ink-900 hover:border-brand-500 hover:text-brand-600 bg-white",
  ghost: "text-ink-700 hover:bg-ink-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2",
};

const base =
  "inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps &
  React.ComponentProps<typeof Link> & { href: string };

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps | LinkProps) {
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    const { href, children, ...rest } = props as LinkProps;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { children, ...rest } = props as ButtonProps;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
