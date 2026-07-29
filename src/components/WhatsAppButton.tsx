import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "../lib/site";
import { cn } from "../lib/utils";

type Props = {
  children?: React.ReactNode;
  variant?: "primary" | "outline" | "accent";
  size?: "md" | "lg";
  className?: string;
  showIcon?: boolean;
};

export function WhatsAppButton({
  children = "Agendar sua sessão",
  variant = "primary",
  size = "md",
  className,
  showIcon = true,
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const sizes = {
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };
  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-[0_10px_30px_-12px_var(--primary)] hover:bg-primary/90 hover:-translate-y-0.5",
    outline:
      "border border-primary/40 bg-transparent text-primary hover:bg-primary/10",
    accent:
      "bg-accent text-accent-foreground shadow-[0_10px_30px_-12px_var(--accent)] hover:bg-accent/90 hover:-translate-y-0.5",
  };

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {showIcon && <MessageCircle className="h-4 w-4" aria-hidden="true" />}
      {children}
    </a>
  );
}
