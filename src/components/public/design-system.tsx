import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteImageUrl } from "@/styles/theme";

type Tone = "default" | "lilac" | "blue" | "warm" | "coral" | "sage";
type Size = "sm" | "md" | "lg";

const toneClasses: Record<Tone, string> = {
  default: "bg-white text-[#262033]",
  lilac: "bg-[#f8f2ff] text-[#3d2d5c]",
  blue: "bg-[#f1f9ff] text-[#263d55]",
  warm: "bg-[#fff8df] text-[#4f3a18]",
  coral: "bg-[#fff4ef] text-[#5a3028]",
  sage: "bg-[#f3faf6] text-[#274534]",
};

export function Container({
  children,
  className,
  size = "page",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "narrow" | "content" | "page" | "wide";
}) {
  const widths = {
    narrow: "max-w-[620px]",
    content: "max-w-[760px]",
    page: "max-w-[1180px]",
    wide: "max-w-[1360px]",
  };

  return (
    <div className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", widths[size], className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  tone = "default",
  spacing = "default",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
  spacing?: "compact" | "default" | "loose";
  id?: string;
}) {
  const spacingClasses = {
    compact: "py-14 md:py-20",
    default: "py-20 md:py-28",
    loose: "py-24 md:py-36",
  };

  return (
    <section id={id} className={cn("relative overflow-hidden", toneClasses[tone], spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}

export function Heading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
  descriptionClassName,
  level = 2,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  level?: 1 | 2 | 3;
}) {
  const TitleTag = `h${level}` as "h1" | "h2" | "h3";

  return (
    <header className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d63c7]">
          {eyebrow}
        </p>
      )}
      <TitleTag
        className={cn(
          "text-balance text-3xl font-semibold leading-[1.08] text-[#262033] sm:text-4xl lg:text-5xl",
          level === 1 && "text-4xl sm:text-5xl lg:text-6xl",
          level === 3 && "text-2xl sm:text-3xl lg:text-4xl",
          titleClassName,
        )}
      >
        {title}
      </TitleTag>
      {description && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-8 text-[#5d546b] sm:text-lg",
            align === "center" && "mx-auto",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
    </header>
  );
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  withArrow = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: Size;
  asChild?: boolean;
  withArrow?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  const variants = {
    primary: "bg-[#5b3d86] text-white shadow-[0_18px_45px_rgba(91,61,134,0.2)] hover:bg-[#4d3175]",
    secondary: "border border-[#dec7ff] bg-white text-[#4d3175] hover:border-[#c7a5f2] hover:bg-[#f8f2ff]",
    ghost: "bg-transparent text-[#5b3d86] hover:bg-[#f8f2ff]",
  };
  const sizes = {
    sm: "h-10 px-4 text-sm",
    md: "h-12 px-5 text-sm",
    lg: "h-14 px-7 text-base",
  };

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8d63c7] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
      {withArrow && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
    </Comp>
  );
}

export function Card({
  children,
  className,
  tone = "default",
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-[#eee7f6] p-6 shadow-[0_14px_45px_rgba(62,46,89,0.08)]",
        toneClasses[tone],
        interactive && "transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(62,46,89,0.12)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  className,
  tone = "lilac",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: Exclude<Tone, "default">;
}) {
  const badgeTones = {
    lilac: "bg-[#efe2ff] text-[#5b3d86]",
    blue: "bg-[#dff1ff] text-[#26617e]",
    warm: "bg-[#fff3c7] text-[#795716]",
    coral: "bg-[#ffe1d5] text-[#9a4b3b]",
    sage: "bg-[#cce8d7] text-[#31583f]",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", badgeTones[tone], className)}>
      {children}
    </span>
  );
}

export function CTABox({
  title,
  description,
  children,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-[28px] bg-[#5b3d86] p-7 text-white shadow-[0_22px_70px_rgba(62,46,89,0.16)] sm:p-10", className)}>
      <PatternOverlay opacity="medium" />
      <div className="relative z-10 max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">{title}</h2>
        {description && <p className="mt-4 max-w-2xl text-base leading-7 text-white/82">{description}</p>}
        {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
      </div>
    </div>
  );
}

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto h-px w-full max-w-[1180px] bg-gradient-to-r from-transparent via-[#dec7ff] to-transparent", className)} />
  );
}

export function SoftBackground({
  children,
  className,
  image,
  fallbackTone = "lilac",
}: {
  children?: React.ReactNode;
  className?: string;
  image?: string;
  fallbackTone?: Tone;
}) {
  const imageUrl = siteImageUrl(image);

  return (
    <div className={cn("relative overflow-hidden rounded-[32px]", toneClasses[fallbackTone], className)}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-white/88 via-white/74 to-[#f8f2ff]/76" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function PatternOverlay({
  className,
  opacity = "soft",
}: {
  className?: string;
  opacity?: "soft" | "medium";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        opacity === "soft" ? "opacity-35" : "opacity-55",
        className,
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle at 18px 18px, rgba(255,255,255,0.38) 2px, transparent 2.5px), radial-gradient(circle at 72px 46px, rgba(255,217,111,0.34) 2px, transparent 2.5px)",
        backgroundSize: "96px 96px",
      }}
    />
  );
}
