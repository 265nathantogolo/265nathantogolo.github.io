import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  id?: string;
  as?: "h1" | "h2";
  size?: "lg" | "md";
  className?: string;
  children?: React.ReactNode;
};

/** Surtitre coloré + grand titre, comme les sections Apple (« Design », « Points forts. »). */
export function SectionHeading({ eyebrow, title, id, as = "h2", size = "md", className, children }: SectionHeadingProps) {
  const Tag = as;
  return (
    <div className={cn("max-w-4xl", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag id={id} className={size === "lg" ? "display-lg" : "display-md"}>
        {title}
      </Tag>
      {children && <div className="lead mt-6 max-w-3xl">{children}</div>}
    </div>
  );
}
