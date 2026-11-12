import { cn } from "@/lib/utils";
import { imageSrc } from "@/lib/images";

/**
 * Signature « Nathan. » (Images Portfolio / Branding perso.png) utilisée comme
 * masque : elle prend la couleur du texte courant (encre, blanc ou rouge).
 */
export function Signature({ className }: { className?: string }) {
  const url = `url("${imageSrc("brand/signature", 640)}")`;
  return (
    <span
      aria-hidden
      className={cn("inline-block aspect-[1181/1316] bg-current", className)}
      style={{
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
