"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { LiquidButton } from "@/components/ui/button";

/** Copie l'adresse e-mail ; confirmation annoncée aux lecteurs d'écran. */
export function CopyEmail({
  email,
  surface = "light",
  className,
}: {
  email: string;
  surface?: "light" | "dark";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <>
      <LiquidButton type="button" surface={surface} size="lg" className={className} onClick={copy}>
        {copied ? <Check /> : <Copy />}
        {copied ? "Adresse copiée" : "Copier l'adresse"}
      </LiquidButton>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Adresse e-mail copiée dans le presse-papiers." : ""}
      </span>
    </>
  );
}
