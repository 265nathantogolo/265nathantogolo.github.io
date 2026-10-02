// Génère public/favicon.svg à partir de la signature vectorisée.
import fs from "node:fs";

const src = fs.readFileSync("src/components/signature-path.ts", "utf8");
const d = src.match(/SIGNATURE_PATH =\s*"([^"]+)"/)[1];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="190 130 916 916"><rect x="190" y="130" width="916" height="916" rx="200" fill="#121314"/><path d="${d}" fill="#eeeeea" fill-rule="evenodd"/></svg>\n`;
fs.writeFileSync("public/favicon.svg", svg);
console.log("public/favicon.svg", svg.length, "bytes");
