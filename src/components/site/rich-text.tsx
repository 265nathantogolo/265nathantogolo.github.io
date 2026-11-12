/** Typographie française : espaces insécables avant ? ! : ; » et après «. */
export function frenchTypo(text: string) {
  return text.replace(/ ([?!:;»])/g, " $1").replace(/« /g, "« ");
}

/** Texte des données, avec *mot* rendu en italique (titres d'œuvres). */
export function RichText({ text }: { text: string }) {
  const parts = frenchTypo(text).split("*");
  return <>{parts.map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}</>;
}
