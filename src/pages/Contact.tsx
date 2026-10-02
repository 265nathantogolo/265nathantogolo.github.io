import { useState } from "react";
import { contact, identity } from "@/data/profile";
import { useReveals } from "@/lib/motion";
import { Arrow, FitText, Signature } from "@/components/primitives";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

export function Contact() {
  const [copied, setCopied] = useState(false);
  useReveals();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <section className="contact dark page-pad" aria-labelledby="contact-title">
      <div className="contact__top">
        <p className="label" data-reveal="">
          03 — Contact
        </p>
        <h1 className="contact__title" id="contact-title" data-reveal="">
          Contact
        </h1>
      </div>

      <p className="availability availability--dark" data-reveal="">
        <span className="availability__dot" aria-hidden="true" />
        {identity.search}
      </p>

      <a className="contact__mail" href={`mailto:${contact.email}`} data-reveal="">
        <FitText text={contact.email} />
      </a>

      <div className="contact__row" data-reveal="">
        <div className="contact__item">
          <span className="label">Téléphone</span>
          <a href={contact.phoneHref} className="contact__phone">
            {contact.phone}
          </a>
        </div>
        <div className="contact__item">
          <span className="label">E-mail</span>
          <button type="button" className="contact__copy" onClick={copy}>
            {copied ? "Adresse copiée" : "Copier l'adresse"}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Adresse e-mail copiée dans le presse-papiers" : ""}
          </span>
        </div>
        <div className="contact__item">
          <span className="label">CV</span>
          <a href={contact.cv} download="CV-Nathan-Togolo.pdf" className="contact__cv">
            Télécharger (PDF)
          </a>
        </div>
        <div className="contact__actions">
          <LiquidButton asChild size="xl">
            <a href={`mailto:${contact.email}`}>
              <span>Écrire un e-mail</span>
              <Arrow />
            </a>
          </LiquidButton>
        </div>
      </div>

      <Signature className="contact__sig" />
    </section>
  );
}
