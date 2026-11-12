"use client"

import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { glassShadow } from "./glass"

// Annexe A : bouton en verre liquide. Tous les boutons du site l'utilisent
// (pas de glassmorphism : aucun flou CSS, seulement le filtre SVG et les
// ombres internes). Adaptations :
// - `surface` choisit le jeu d'ombres : arêtes sombres sur fond clair,
//   arêtes claires (variante dark: d'origine) sur fond sombre ;
// - `variant="tinted"` remplit le verre de la teinte de la page (--tint),
//   texte en --on-tint ; `variant="ink"` garde le verre clair, texte en --ink.
const liquidbuttonVariants = cva(
  "relative isolate inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,box-shadow,background-color,transform] duration-300 hover:scale-105 motion-reduce:hover:scale-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/60 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        tinted: "bg-tint text-on-tint",
        ink: "bg-transparent text-ink",
      },
      surface: {
        light: "",
        dark: "",
      },
      size: {
        sm: "h-8 text-xs gap-1.5 px-4",
        default: "h-10 px-5",
        lg: "h-11 px-6 text-[0.9375rem]",
        xl: "h-12 px-7 text-[0.9375rem] has-[>svg]:px-6",
        xxl: "h-14 px-9 text-base has-[>svg]:px-8",
        icon: "size-10",
      },
    },
    compoundVariants: [
      { variant: "default", surface: "light", className: "text-foreground" },
      { variant: "default", surface: "dark", className: "text-white" },
    ],
    defaultVariants: {
      variant: "default",
      surface: "light",
      size: "xl",
    },
  }
)

// Corrections : les filtres SVG sont rendus une seule fois dans le layout
// racine (<GlassFilter />). Les calques sont des <span> (un <div> dans un
// <button> est invalide) et `Slottable` rend `asChild` fonctionnel : le bouton
// peut devenir un <Link> ou un <a> sans casser Slot.
function LiquidButton({
  className,
  variant,
  surface,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(liquidbuttonVariants({ variant, surface, size, className }))}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 left-0 -z-10 h-full w-full rounded-full transition-all",
          glassShadow(surface)
        )}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 -z-20 h-full w-full overflow-hidden rounded-full"
        style={{ backdropFilter: 'url("#container-glass")' }}
      />
      <Slottable child={children}>
        {(child) => (
          <span className="pointer-events-none relative z-10 inline-flex items-center gap-2">
            {child}
          </span>
        )}
      </Slottable>
    </Comp>
  )
}

export { liquidbuttonVariants, LiquidButton }
