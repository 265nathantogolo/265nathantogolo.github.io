import Image from "next/image";
import Link from "next/link";

// Annexe B. Adaptations (§ 7) :
// 1. Données de démo remplacées par les projets phares (props `items`).
// 2. Chaque panneau mène à la page du projet.
// 3. <h3> au lieu de <h1> ; le nom du projet devient l'élément dominant
//    (titre en grand, catégorie en petit : hiérarchie inversée par rapport à l'annexe).
// 4. `alt` descriptif propre à chaque projet.
// 5. Focus : anneau rouge du site au lieu de `ring-indigo-300`.
// 6. Largeur alignée sur la grille (`w-full`), hauteur 300 / 480 / 540 px.
// 7. next/image avec `unoptimized` (next.config).
// 8. prefers-reduced-motion : l'élargissement et l'apparition des titres sont
//    placés sous `motion-safe:` ; sans animation, panneaux fixes et titres visibles.
// Mobile : carrousel horizontal à défilement aimanté plutôt que 5 blocs empilés.
// Sans flou de fond (pas de glassmorphism) ; posé dans le panneau en verre de l'accueil.
// Au repos (ni survol ni focus), le premier panneau est ouvert : un titre reste
// toujours lisible sans survol (règles .accordion dans globals.css).

export type AccordionItem = {
  id: string;
  url: string;
  /** srcset WebP : <picture> donne une image responsive malgré `unoptimized`. */
  srcSet?: string;
  width: number;
  height: number;
  title: string;
  description: string;
  alt: string;
  href: string;
  tags?: string[];
};

function TailwindImageAccordion({ items }: { items: AccordionItem[] }) {
  return (
    <div className="accordion group flex gap-2 max-md:no-scrollbar max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto">
      {items.map((item) => {
        return (
          <article
            key={item.id}
            className="group/article relative w-full rounded-[1.375rem] overflow-hidden bg-night max-md:w-[82%] max-md:shrink-0 max-md:snap-start sm:max-md:w-[60%] md:motion-safe:not-[&:hover]:group-hover:w-[20%] md:motion-safe:[&:not(:focus-within):not(:hover)]:group-focus-within:w-[20%] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.15)] before:absolute before:inset-x-0 before:bottom-0 before:z-[1] before:h-1/2 before:bg-linear-to-t before:from-black/70 before:transition-opacity md:motion-safe:before:opacity-0 md:hover:before:opacity-100 focus-within:before:opacity-100 after:pointer-events-none after:opacity-0 md:motion-safe:not-[&:hover]:group-hover:after:opacity-100 md:motion-safe:[&:not(:focus-within):not(:hover)]:group-focus-within:after:opacity-100 after:absolute after:inset-0 after:bg-black/30 after:rounded-[inherit] after:transition-all focus-within:ring-3 focus-within:ring-ring focus-within:ring-offset-2"
          >
            <Link
              className="absolute inset-0 text-white z-10 p-5 md:p-6 flex flex-col justify-end outline-none"
              href={item.href}
            >
              <span className="accordion-reveal text-sm font-medium text-white md:motion-safe:whitespace-nowrap md:motion-safe:truncate md:motion-safe:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:motion-safe:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-300 group-focus-within/article:delay-300">
                {item.description}
              </span>
              <h3 className="accordion-reveal mt-1 text-3xl md:text-4xl font-bold tracking-[-0.035em] md:motion-safe:whitespace-nowrap md:motion-safe:truncate md:motion-safe:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 md:motion-safe:translate-y-2 group-hover/article:translate-y-0 group-focus-within/article:translate-y-0 transition duration-200 ease-[cubic-bezier(.5,.85,.25,1.8)] group-hover/article:delay-500 group-focus-within/article:delay-500">
                {item.title}
              </h3>
              {item.tags && item.tags.length > 0 && (
                <ul className="accordion-reveal mt-3 flex flex-wrap gap-1.5 md:motion-safe:opacity-0 group-hover/article:opacity-100 group-focus-within/article:opacity-100 transition duration-200 group-hover/article:delay-500 group-focus-within/article:delay-500">
                  {item.tags.map((tag) => (
                    <li key={tag} className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </Link>
            <picture className="block">
              {item.srcSet && <source type="image/webp" srcSet={item.srcSet} sizes="(min-width: 768px) 60vw, 82vw" />}
              <Image
                className="object-cover h-[300px] md:h-[480px] xl:h-[540px] w-full"
                src={item.url}
                width={item.width}
                height={item.height}
                sizes="(min-width: 768px) 60vw, 82vw"
                alt={item.alt}
              />
            </picture>
          </article>
        );
      })}
    </div>
  );
}

export default TailwindImageAccordion;
