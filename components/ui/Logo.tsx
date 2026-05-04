import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  priority?: boolean;
}

/**
 * Single source of truth for the PowerNetPro brand mark.
 *
 * The native asset is 2529×572 (aspect ≈ 4.42). Pass a Tailwind height class
 * (e.g. `h-8 md:h-10`) via `className`; width auto-scales because Image is
 * rendered with `h-auto w-auto` on the underlying element.
 */
export function Logo({ className, priority = false }: LogoProps) {
  return (
    <Image
      src="/images/powernetpro-logo.png"
      alt="PowerNetPro"
      width={3375}
      height={846}
      priority={priority}
      sizes="(max-width: 768px) 180px, 240px"
      className={cn("h-8 w-auto select-none", className)}
    />
  );
}
