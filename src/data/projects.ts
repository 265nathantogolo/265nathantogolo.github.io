// Projets : visuels de « Images Portfolio ». Textes : fichier « textes projets.pdf »
// (Joon, Dauphin Piscine, Crimson Ale, Europcar, The Watchers, GTI Sensei,
// Retromarketing, Concert Bleach) ; Cineman, If you're waiting for a sign et
// Fallen Angel gardent leur texte d'origine. Années : date de capture des fichiers
// (Bleach : date du concert sur l'affiche). Aucune donnée de résultat n'existe
// dans les sources, il n'y a donc pas de section « Résultat ».
// Couleurs : mesurées sur les visuels (palettes, aplats), ajustées pour le
// contraste AA (texte foncé sur les teintes claires).

import { projectHeroTones } from "./hero-tones";

export const skills = [
  {
    slug: "creation-graphique",
    label: "Création graphique",
    cvTitle: "Création graphique",
    description: "Design vectoriel, élaboration de charte graphique et de logo, création de supports visuels.",
  },
  {
    slug: "reseaux-sociaux",
    label: "Réseaux sociaux",
    cvTitle: "Gestion de communauté RS",
    description: "Community management sur Instagram, Facebook et LinkedIn, analyse et reporting.",
  },
  {
    slug: "campagnes",
    label: "Campagnes",
    cvTitle: "Création de campagnes publicitaires",
    description: "Via les outils Meta Ads, Google Ads et LinkedIn Ads.",
  },
  {
    slug: "copywriting",
    label: "Copywriting",
    cvTitle: "Conception-rédaction et copywriting",
    description: "Rédaction de posts, naming, création de slogans.",
  },
  {
    slug: "benchmark",
    label: "Benchmark",
    cvTitle: "Benchmark",
    description: "Veille, analyse concurrentielle, SWOT, PESTEL, mapping de positionnement.",
  },
] as const;

export type SkillSlug = (typeof skills)[number]["slug"];

export type ProjectImage = {
  id: string;
  alt: string;
  /** false : visuel du hero uniquement, absent de la galerie et de la visionneuse. */
  gallery?: false;
};

/**
 * Paragraphe du récit et visuels choisis pour l'illustrer. La mise en page
 * (bento) se déduit du nombre et du format des visuels ; `layout` ne sert plus
 * qu'à indiquer de quel côté placer le texte quand il est à côté d'un visuel.
 * *mot* = italique.
 */
export type StorySection = {
  text: string;
  images?: string[];
  layout?: "split-left" | "split-right" | "pair" | "trio" | "full";
};

/** Document téléchargeable depuis la page projet (copié dans public/docs). */
export type ProjectDocument = {
  /** Chemin dans /public. */
  file: string;
  /** Nom du fichier enregistré par le visiteur. */
  downloadName: string;
  /** Intitulé dans la fiche du projet, et texte du bouton. */
  title: string;
  label: string;
  pages: number;
};

export type ProjectTheme = {
  /** Couleur dominante : teinte des boutons, aplats, citation. */
  accent: string;
  /** Texte posé sur la couleur dominante (AA). */
  onAccent: string;
  /** Variante lisible sur fond blanc (AA), pour les petits textes colorés. */
  ink: string;
  /** Ton du hero : sombre (texte blanc) ou clair (texte encre). */
  heroTone: "dark" | "light";
};

export type ProjectHero =
  /** Visuel paysage en plein écran, assombri en noir ou dans la couleur `shade` (« r, g, b »). */
  | { mode: "cover"; image: string; position?: string; shade?: string }
  /** Visuels posés sur un aplat (affiches, posts verticaux, slides). */
  | { mode: "showcase"; images: string[]; background: string };

export type Project = {
  slug: string;
  number: string;
  title: string;
  /** Phrase descriptive : cartes, liste et référencement. */
  tagline: string;
  /** Accroche du texte (en gras dans le PDF) : en grand sous le titre. */
  accroche?: string;
  /** Nature du projet, quand le texte l'indique (fiche du projet). */
  type?: string;
  year: number;
  skills: SkillSlug[];
  deliverables: string[];
  story: StorySection[];
  /** Phrase de conclusion (en gras dans le PDF) : citation mise en valeur. */
  conclusion?: string;
  facts?: { label: string; value: string }[];
  document?: ProjectDocument;
  theme: ProjectTheme;
  hero: ProjectHero;
  cover: string;
  /** Position de recadrage de la couverture (object-position). */
  coverPosition?: string;
  images: ProjectImage[];
};

const p = (slug: string, nn: string, mm: string) => `projets/${slug}/${nn}-${mm}`;
/** Raccourci : identifiants d'images d'un projet à partir de leur numéro. */
const ids =
  (slug: string, nn: string) =>
  (...mms: string[]) =>
    mms.map((mm) => p(slug, nn, mm));

const theme = (slug: string, colors: Omit<ProjectTheme, "heroTone">): ProjectTheme => ({
  ...colors,
  heroTone: projectHeroTones[slug] ?? "light",
});

const joon = ids("joon", "01");
const dauphin = ids("dauphin-piscine", "02");
const crimson = ids("crimson-ale", "03");
const europcar = ids("europcar", "04");
const cineman = ids("cineman", "05");
const watchers = ids("les-watchers", "06");
const gti = ids("dr-gti", "07");
const retro = ids("retromarketing", "08");
const sign = ids("waiting-for-a-sign", "09");
const bleach = ids("affiche-bleach", "10");

export const projects: Project[] = [
  {
    slug: "joon",
    number: "01",
    title: "Joon",
    tagline: "Identité visuelle et carte d'un restaurant.",
    accroche: "Une identité qui met l'eau à la bouche.",
    type: "Projet fictif",
    year: 2024,
    skills: ["creation-graphique"],
    deliverables: ["Logotype", "Motif graphique", "Palette", "Carte en quatre pages", "Packaging", "Tablier et casquette", "Carnet", "Enseigne"],
    story: [
      {
        text: "Joon est un projet fictif de création d'identité visuelle pour un restaurant. L'idée : imaginer un univers graphique qui donne une personnalité à l'établissement et qui se retrouve dans chaque détail de son expérience client.",
        images: joon("01"),
        layout: "split-left",
      },
      {
        text: "Le travail porte notamment sur la création du logo et des menus, deux supports essentiels pour installer l'identité du restaurant. Le premier pose les bases de son univers, tandis que les seconds le font vivre directement à table, au moment où les clients découvrent la carte et font leurs choix.",
        images: joon("03", "05", "07"),
        layout: "trio",
      },
      {
        text: "L'objectif est de construire une identité cohérente, reconnaissable et déclinable sur différents supports. Parce qu'un restaurant ne se découvre pas uniquement dans l'assiette : son univers visuel participe lui aussi à l'expérience.",
        images: joon("11", "14"),
        layout: "pair",
      },
    ],
    theme: theme("joon", { accent: "#0e341e", onAccent: "#f5ede7", ink: "#0e341e" }),
    hero: { mode: "cover", image: p("joon", "01", "15"), position: "50% 40%" },
    cover: p("joon", "01", "15"),
    images: [
      { id: p("joon", "01", "01"), alt: "Logotype Joon blanc sur le motif de lignes concentriques vert foncé" },
      { id: p("joon", "01", "02"), alt: "Motif de lignes concentriques, vert sur vert" },
      { id: p("joon", "01", "03"), alt: "Couverture de carte vert foncé avec le logotype Joon" },
      { id: p("joon", "01", "05"), alt: "Page Entrées de la carte : titre vertical et assiette vue du dessus" },
      { id: p("joon", "01", "07"), alt: "Page Plats de la carte : titre vertical et assiette de tagliatelles" },
      { id: p("joon", "01", "09"), alt: "Page Tapas de la carte : titre vertical et assiette de légumes rôtis" },
      { id: p("joon", "01", "10"), alt: "Page Desserts de la carte : titre vertical et assiette de fraises" },
      { id: p("joon", "01", "11"), alt: "Tablier vert à motif de lignes, imprimé du logotype Joon" },
      { id: p("joon", "01", "12"), alt: "Casquette verte brodée du logotype Joon, posée sur un plan de travail en inox" },
      { id: p("joon", "01", "13"), alt: "Carnet vert marqué du logotype Joon" },
      { id: p("joon", "01", "14"), alt: "Gobelet et boîte à pizza aux couleurs de Joon" },
      { id: p("joon", "01", "15"), alt: "Enseigne ronde en drapeau sur la façade du restaurant Joon" },
      { id: p("joon", "01", "16"), alt: "Palette Joon : vert foncé, vert d'eau, vert pâle et blanc cassé" },
    ],
  },
  {
    slug: "dauphin-piscine",
    number: "02",
    title: "Dauphin Piscine",
    tagline: "Logo et supports de communication.",
    accroche: "Une identité qui donne envie de plonger.",
    type: "Projet d'école",
    year: 2024,
    skills: ["creation-graphique"],
    deliverables: ["Logo et déclinaisons", "Palette", "Bannières", "Cartes de visite", "Newsletter", "Mises en situation"],
    story: [
      {
        text: "Dans le cadre d'un projet de classe, Dauphin Piscine est une marque fictive spécialisée dans la fabrication et l'installation de piscines. L'objectif : construire une identité visuelle cohérente et donner à l'entreprise une image reconnaissable sur l'ensemble de ses supports de communication.",
        images: dauphin("10"),
        layout: "full",
      },
      {
        text: "Le projet comprend la création du logo, des cartes de visite, de différents visuels et de supports d'emailing. L'enjeu est de créer un univers graphique qui ne se limite pas à une signature visuelle, mais qui puisse vivre sur le terrain comme en ligne. Une identité capable d'accompagner l'entreprise dans ses prises de parole et de rendre sa communication plus cohérente à chaque point de contact.",
        images: dauphin("13", "02"),
        layout: "pair",
      },
    ],
    theme: theme("dauphin-piscine", { accent: "#1eafeb", onAccent: "#062c40", ink: "#076694" }),
    hero: {
      mode: "showcase",
      images: dauphin("11"),
      background: "radial-gradient(120% 90% at 75% 40%, #1eafeb 0%, #076694 55%, #04466a 100%)",
    },
    cover: p("dauphin-piscine", "02", "11"),
    images: [
      { id: p("dauphin-piscine", "02", "01"), alt: "Logo Dauphin Piscine : un dauphin et une vague dans un cercle bleu" },
      { id: p("dauphin-piscine", "02", "02"), alt: "Bannière « Foire de printemps, venez découvrir nos offres » sur une photo de terrasse avec piscine" },
      { id: p("dauphin-piscine", "02", "04"), alt: "Serviette pliée à motif de lignes ondulées, avec le logo" },
      { id: p("dauphin-piscine", "02", "05"), alt: "Bannière horizontale : logo et nom Dauphin Piscine sur fond d'eau" },
      { id: p("dauphin-piscine", "02", "06"), alt: "Reflets d'eau turquoise au bord d'une piscine, avec une forme de vague" },
      { id: p("dauphin-piscine", "02", "07"), alt: "Nom Dauphin Piscine sur une margelle en pierre, au bord de l'eau" },
      { id: p("dauphin-piscine", "02", "08"), alt: "Version au trait du logo, bleu clair sur fond blanc" },
      { id: p("dauphin-piscine", "02", "09"), alt: "Palette de cinq bleus, du plus foncé au plus clair" },
      { id: p("dauphin-piscine", "02", "10"), alt: "Trois déclinaisons du logo : verticale, horizontale et symbole seul" },
      { id: p("dauphin-piscine", "02", "11"), alt: "Cartes de visite Dauphin Piscine recto verso, posées au bord d'une piscine" },
      { id: p("dauphin-piscine", "02", "12"), alt: "Bannière : logo Dauphin Piscine et mention piscines, spa, équipements sur fond d'eau" },
      { id: p("dauphin-piscine", "02", "13"), alt: "Newsletter « Foire de printemps » : bannière, titre « Plongez dans notre univers » et photos de piscines" },
    ],
  },
  {
    slug: "crimson-ale",
    number: "03",
    title: "Crimson Ale",
    tagline: "Étiquettes et packaging d'une bière à l'hibiscus.",
    accroche: "Une bière qui voit rouge.",
    type: "Projet fictif",
    year: 2024,
    skills: ["creation-graphique"],
    deliverables: ["Étiquette Red version", "Étiquette White version", "Bandeaux", "Motif hibiscus", "Palette", "T-shirt", "Mises en situation"],
    story: [
      {
        text: "Crimson Ale est un projet fictif de packaging pour une bière à base d'hibiscus. Un produit avec une matière première singulière, qui devient le point de départ d'un travail d'identité visuelle et de design d'emballage.",
        images: crimson("12"),
        layout: "split-left",
      },
      {
        text: "L'enjeu : donner au produit une identité qui lui ressemble et qui attire l'œil. Le packaging doit à la fois rendre la marque reconnaissable, mettre en valeur son univers et lui permettre de trouver sa place dans un marché où les codes visuels jouent un rôle essentiel.",
        images: crimson("15", "14"),
        layout: "pair",
      },
      {
        text: "À travers ce projet, le design devient un véritable outil de différenciation. Couleurs, composition et identité graphique participent à construire un univers de marque cohérent, capable de faire ressortir le caractère de Crimson Ale avant même la première gorgée.",
        images: crimson("06", "13"),
        layout: "pair",
      },
    ],
    theme: theme("crimson-ale", { accent: "#b61c23", onAccent: "#ffffff", ink: "#b61c23" }),
    hero: { mode: "cover", image: p("crimson-ale", "03", "16"), position: "50% 45%" },
    // Gros plan sur l'étiquette Red version, cadré sur « CRIMSON » et l'hibiscus.
    cover: p("crimson-ale", "03", "05"),
    coverPosition: "50% 42%",
    images: [
      { id: p("crimson-ale", "03", "04"), alt: "Bouteilles Crimson Ale Red et White devant le nom de la bière en grandes lettres" },
      { id: p("crimson-ale", "03", "05"), alt: "Gros plan sur l'étiquette Red version : typographie crème et fleur d'hibiscus rouge" },
      { id: p("crimson-ale", "03", "06"), alt: "Bouteille Red version à côté d'un verre de bière rouge, sur du marbre" },
      { id: p("crimson-ale", "03", "07"), alt: "Bière rouge versée dans un verre, sur fond rose" },
      { id: p("crimson-ale", "03", "08"), alt: "Seau à glace rempli de bouteilles Red version" },
      { id: p("crimson-ale", "03", "09"), alt: "Gros plan sur l'étiquette White version : typographie rouge et fleur d'hibiscus jaune pâle" },
      { id: p("crimson-ale", "03", "10"), alt: "Bière blonde versée dans un verre, version White" },
      { id: p("crimson-ale", "03", "11"), alt: "Palette Crimson Ale : rouge, rose, crème et vert, avec une fleur d'hibiscus" },
      { id: p("crimson-ale", "03", "12"), alt: "Motif d'hibiscus rouges et de feuilles vertes sur fond crème rayé" },
      { id: p("crimson-ale", "03", "13"), alt: "Bouteille White version à côté d'un verre de bière blonde, sur du marbre" },
      { id: p("crimson-ale", "03", "14"), alt: "Bandeaux horizontaux Crimson Ale, White version et Red version" },
      { id: p("crimson-ale", "03", "15"), alt: "Étiquettes Red version et White version côte à côte" },
      { id: p("crimson-ale", "03", "16"), alt: "T-shirt crème imprimé Crimson Ale, porté dans une brasserie" },
    ],
  },
  {
    slug: "europcar",
    number: "04",
    title: "Europcar",
    tagline: "Campagne multisupport autour de la signature « Le moteur de vos moments de vie ».",
    accroche: "Et si la location de voiture devenait le début de l'aventure ?",
    type: "Projet fictif",
    year: 2025,
    skills: ["campagnes", "creation-graphique", "reseaux-sociaux", "copywriting"],
    deliverables: [
      "Signature et palette",
      "Covering véhicule",
      "Affichage",
      "Tote bags",
      "Dépliant « europcarte »",
      "Page d'accueil du site",
      "Application mobile",
      "Posts et carrousels Instagram",
      "Posts X",
      "Visuel de Noël",
    ],
    story: [
      {
        text: "Europcar, ce n'est pas seulement une voiture à récupérer et une destination à rejoindre. C'est aussi le départ en vacances, le road trip improvisé ou le week-end qui change les idées. C'est autour de cette vision que s'articule ce projet fictif de rebranding : repenser l'identité de la marque pour la rapprocher des moments de vie qu'elle rend possibles.",
        images: europcar("15"),
        layout: "split-left",
      },
      {
        text: "Au programme : une nouvelle palette de couleurs, une image de marque revisitée et un positionnement qui remet l'expérience humaine au centre. L'objectif ? Faire d'Europcar une marque qui ne se contente pas d'accompagner les déplacements, mais qui participe aux souvenirs qu'on se crée en chemin.",
        images: europcar("01", "04"),
        layout: "pair",
      },
      {
        text: "Et parce qu'une nouvelle identité ne s'arrête pas au logo, le projet se prolonge sur les réseaux sociaux. Itinéraires à découvrir, jeux à faire pendant un road trip, idées pour rythmer le trajet… Les contenus imaginés donnent à la marque une place dans l'aventure, même après avoir récupéré les clés.",
        images: europcar("09", "10", "16"),
        layout: "trio",
      },
      {
        text: "Le projet va jusqu'aux goodies distribués en agence : des objets utiles, pensés pour accompagner les voyageurs et faire vivre l'identité de la marque au-delà du point de location. De quoi transformer de simples supports publicitaires en petits compagnons de route.",
        images: europcar("06", "07"),
        layout: "pair",
      },
    ],
    theme: theme("europcar", { accent: "#b0ff73", onAccent: "#0b3d2c", ink: "#077e5c" }),
    hero: { mode: "cover", image: p("europcar", "04", "14"), position: "50% 55%" },
    cover: p("europcar", "04", "04"),
    images: [
      { id: p("europcar", "04", "01"), alt: "Logo Europcar, palette de verts et signature « Le moteur de vos moments de vie »" },
      { id: p("europcar", "04", "02"), alt: "Pick-up vert sombre avec le logo Europcar en vert fluo" },
      { id: p("europcar", "04", "04"), alt: "Affiche sur un quai de gare : « On est à 2min… Enfin bref, on est partout. »" },
      { id: p("europcar", "04", "05"), alt: "Panneau mural dans un escalier : « On vous suit dans toutes vos aventures »" },
      { id: p("europcar", "04", "06"), alt: "Quatre tote bags verts portant chacun une phrase différente" },
      { id: p("europcar", "04", "07"), alt: "Dépliant-carte europcarte : carte de France et « Bon, t'embête pas. »" },
      { id: p("europcar", "04", "08"), alt: "Page d'accueil du site « Le moteur de vos moments de vie ! » sur un ordinateur portable" },
      { id: p("europcar", "04", "09"), alt: "Post Instagram « Bon, t'embête pas. » et carrousel « Saint-Brieuc »" },
      { id: p("europcar", "04", "10"), alt: "Posts Instagram « Nos jeux préférés », « Qui suis-je » et « Le blindtest »" },
      { id: p("europcar", "04", "12"), alt: "Mise en situation du profil Instagram Europcar sur un smartphone" },
      { id: p("europcar", "04", "13"), alt: "Visuel de Noël : le Père Noël devant une camionnette Europcar" },
      { id: p("europcar", "04", "14"), alt: "Pick-up vert Europcar en studio, logo en vert fluo" },
      { id: p("europcar", "04", "15"), alt: "Visuel « Écrivez vos premières pages à nos côtés » : trois amis en voiture au soleil" },
      { id: p("europcar", "04", "16"), alt: "Posts X « Blind Test » et « Podcasts » aux couleurs d'Europcar" },
      { id: p("europcar", "04", "17"), alt: "Écran d'application mobile Europcar : offre spéciale et voitures disponibles" },
      { id: p("europcar", "04", "18"), alt: "Grille de six posts Instagram Europcar" },
    ],
  },
  {
    slug: "cineman",
    number: "05",
    title: "Cineman",
    tagline: "Identité et contenus Instagram sur le cinéma, les séries et le manga.",
    year: 2024,
    skills: ["reseaux-sociaux", "creation-graphique"],
    deliverables: ["Logotype et monogramme", "Posts", "Formats verticaux"],
    story: [
      {
        text: "Cineman parle de cinéma, de séries et de manga. Le logotype, en volume jaune et blanc, est posé sur un personnage dessiné ; il se réduit en monogramme CM pour signer chaque publication.",
        images: cineman("01", "15"),
        layout: "pair",
      },
      {
        text: "Les formats verticaux suivent une même grammaire : un surtitre en capitales sur un bandeau jaune, une accroche en très grand, le monogramme en bas de l'image. Les sujets vont du transhumanisme dans le manga aux biopics, en passant par Hellboy, Sons of Anarchy ou Gunnm.",
        images: cineman("06", "11", "14"),
        layout: "trio",
      },
    ],
    theme: theme("cineman", { accent: "#fed81d", onAccent: "#1d1d1f", ink: "#7a5c00" }),
    hero: { mode: "showcase", images: cineman("05", "13", "08"), background: "#fed81d" },
    cover: p("cineman", "05", "01"),
    images: [
      { id: p("cineman", "05", "01"), alt: "Logotype Cineman en volume jaune et blanc, posé sur un personnage dessiné" },
      { id: p("cineman", "05", "03"), alt: "Post « Qu'est-ce que le transhumanisme ? »" },
      { id: p("cineman", "05", "04"), alt: "Post sur le transhumanisme, avec une case de manga" },
      { id: p("cineman", "05", "05"), alt: "Format vertical « L'amour… Sons of Anarchy… et la mort »" },
      { id: p("cineman", "05", "06"), alt: "Format vertical « X-Men : les mutants Omega les plus dangereux »" },
      { id: p("cineman", "05", "08"), alt: "Format vertical « La malédiction de Hellboy »" },
      { id: p("cineman", "05", "09"), alt: "Format vertical « Le meilleur film d'horreur de tous les temps ? »" },
      { id: p("cineman", "05", "10"), alt: "Format vertical « Les meilleurs live action »" },
      { id: p("cineman", "05", "11"), alt: "Format vertical « Les persos les plus stylés de Bleach »" },
      { id: p("cineman", "05", "12"), alt: "Format vertical « Les pires live action »" },
      { id: p("cineman", "05", "13"), alt: "Format vertical « Le meilleur manga : Gunnm ? »" },
      { id: p("cineman", "05", "14"), alt: "Format vertical « 3 excellents biopics »" },
      { id: p("cineman", "05", "15"), alt: "Monogramme CM en volume jaune sur fond gris" },
    ],
  },
  {
    slug: "les-watchers",
    number: "06",
    title: "The Watchers",
    tagline: "Compte Instagram consacré à l'horlogerie.",
    accroche: "L'horlogerie, sans le club privé.",
    type: "Concept fictif",
    year: 2025,
    skills: ["reseaux-sociaux", "creation-graphique"],
    deliverables: ["Logo", "Plateforme du compte", "Carrousels Instagram", "Mises en situation du profil"],
    story: [
      {
        text: "Et si l'horlogerie n'était pas réservée aux collectionneurs et aux experts ? The Watchers est un concept fictif de compte Instagram imaginé pour rendre cet univers plus accessible à une nouvelle génération. L'ambition : parler de montres avec style, transmettre une vraie culture horlogère et donner envie d'en découvrir davantage, même quand on débute.",
        images: watchers("07"),
        layout: "split-left",
      },
      {
        text: "Le compte s'articule autour de plusieurs formats éditoriaux, chacun avec son propre rôle. Ici, un carrousel consacré à la Cartier Santos revient sur l'histoire d'une montre iconique et les raisons qui ont fait sa renommée. Une manière de raconter l'horlogerie autrement, en mêlant culture, anecdotes et storytelling visuel.",
        images: watchers("11"),
        layout: "full",
      },
      {
        text: "Un autre format met à l'honneur les modèles qui ont marqué leur époque. Des pièces classiques aux montres devenues incontournables, l'idée est de décrypter les références qui ont façonné l'histoire du secteur et d'expliquer ce qui les rend si particulières.",
        images: watchers("02", "03"),
        layout: "pair",
      },
      {
        text: "Enfin, un rendez-vous hebdomadaire est consacré à l'actualité horlogère : nouveautés, lancements et tendances à suivre. De quoi garder un œil sur ce qui se passe dans l'industrie sans devoir éplucher dix sites spécialisés.",
        images: watchers("04"),
        layout: "split-right",
      },
    ],
    conclusion: "L'objectif : faire de la culture horlogère un contenu qu'on prend plaisir à découvrir, à comprendre et à partager.",
    facts: [
      { label: "Public visé", value: "Jeunes adultes de 20 à 35 ans, attirés par l'univers horloger" },
      { label: "Rythme", value: "4 posts par semaine, avec des visuels simples et explicatifs" },
      { label: "Ton", value: "Léger, informatif, vulgarisateur" },
      { label: "Objectif", value: "Faire découvrir le monde de l'horlogerie aux jeunes générations" },
    ],
    theme: theme("les-watchers", { accent: "#a61617", onAccent: "#ffffff", ink: "#a61617" }),
    // Ombre rouge très sombre (tirée du rouge The Watchers) derrière le titre.
    hero: { mode: "cover", image: p("les-watchers", "06", "15"), position: "38% 50%", shade: "43, 3, 5" },
    cover: p("les-watchers", "06", "15"),
    images: [
      {
        id: p("les-watchers", "06", "15"),
        alt: "Cartier Santos en acier sur une feutrine rouge, le W de The Watchers en flou à l'arrière-plan",
        gallery: false,
      },
      { id: p("les-watchers", "06", "01"), alt: "Logo The Watchers : W blanc sur fond rouge" },
      { id: p("les-watchers", "06", "02"), alt: "Carrousel Classics Review : la Cartier Santos" },
      { id: p("les-watchers", "06", "03"), alt: "Carrousel Brands : la maison Patek Philippe, 1/3" },
      { id: p("les-watchers", "06", "04"), alt: "Carrousel Actus : 7 actualités de la semaine du 24/3" },
      { id: p("les-watchers", "06", "07"), alt: "Profil Instagram The Watchers sur un smartphone, fond rouge avec une montre" },
      { id: p("les-watchers", "06", "10"), alt: "Profil Instagram The Watchers sur un smartphone, fond noir" },
      { id: p("les-watchers", "06", "11"), alt: "Exemple de carrousel Instagram : l'histoire de la Santos de Cartier" },
      { id: p("les-watchers", "06", "12"), alt: "Plateforme du compte : public visé, rythme de publication, ton et explication du logo" },
      { id: p("les-watchers", "06", "13"), alt: "Montage de visuels Patek Philippe dans un cadre rouge" },
      { id: p("les-watchers", "06", "14"), alt: "Triptyque Instagram : gros plan sur une Cartier Santos, fond rouge" },
    ],
  },
  {
    slug: "dr-gti",
    number: "07",
    title: "GTI Sensei",
    tagline: "Posts Instagram de vulgarisation scientifique.",
    accroche: "La science attire l'œil avant de captiver l'esprit.",
    year: 2025,
    skills: ["reseaux-sociaux"],
    deliverables: ["Bannière", "Posts Instagram"],
    story: [
      {
        text: "Comment donner envie de s'arrêter sur un post scientifique au milieu d'un fil Instagram rempli de contenus en tout genre ? C'est le défi de ce projet de création de posts Instagram pour un compte de vulgarisation scientifique.",
        images: gti("01"),
        layout: "full",
      },
      {
        text: "L'objectif est simple : transformer des sujets parfois complexes en visuels clairs, impactants et immédiatement identifiables. Chaque post doit capter l'attention, hiérarchiser les informations essentielles et piquer suffisamment la curiosité pour donner envie d'en savoir plus.",
        images: gti("04", "05", "07"),
        layout: "trio",
      },
      {
        text: "Le tout s'inscrit dans une identité visuelle cohérente, pensée pour installer des repères et renforcer la reconnaissance du compte au fil des publications.",
        images: gti("09", "08"),
        layout: "pair",
      },
    ],
    conclusion: "Moins de scroll, plus de science.",
    theme: theme("dr-gti", { accent: "#8d5401", onAccent: "#ffffff", ink: "#8d5401" }),
    hero: {
      mode: "showcase",
      images: gti("02", "03", "05"),
      background: "radial-gradient(120% 90% at 70% 40%, #6b4a08 0%, #392a03 60%, #241a02 100%)",
    },
    // Bannière avec le téléphone, recadrée sur le profil Instagram.
    cover: p("dr-gti", "07", "01"),
    images: [
      { id: p("dr-gti", "07", "01"), alt: "Bannière : microscope, planète et smartphone affichant le profil, à côté du personnage en blouse" },
      { id: p("dr-gti", "07", "02"), alt: "Post « L'humanité dans un paquet de chewing-gum ??? »" },
      { id: p("dr-gti", "07", "03"), alt: "Post « Comment on a inventé le micro-onde ??? »" },
      { id: p("dr-gti", "07", "04"), alt: "Post « Ces bactéries feraient 100x la masse de la Terre ??? »" },
      { id: p("dr-gti", "07", "05"), alt: "Post « Pourquoi les bananes sont radioactives ??? »" },
      { id: p("dr-gti", "07", "07"), alt: "Post « Qu'est-ce que l'effet placebo ??? »" },
      { id: p("dr-gti", "07", "08"), alt: "Post « Pourquoi le piment pique-t-il ??? », 2/2" },
      { id: p("dr-gti", "07", "09"), alt: "Post « Pourquoi le piment pique-t-il ??? », 1/2" },
    ],
  },
  {
    slug: "retromarketing",
    number: "08",
    title: "Retromarketing",
    tagline: "Présentation de veille sur le rétromarketing.",
    accroche: "Le rétro n'a jamais été aussi actuel.",
    year: 2025,
    skills: ["benchmark"],
    deliverables: ["Présentation en 10 slides"],
    story: [
      {
        text: "Pourquoi les marques regardent-elles autant dans le rétroviseur ? Ce benchmark explore le rétromarketing, une tendance qui remet les références du passé au cœur des stratégies de communication contemporaines.",
        images: retro("00"),
        layout: "split-left",
      },
      {
        text: "Identités visuelles vintage, rééditions de produits iconiques, anciennes campagnes revisitées ou références culturelles d'une autre époque : l'étude passe en revue différentes façons dont les marques réactivent leur héritage pour parler au public d'aujourd'hui.",
        images: retro("06", "07"),
        layout: "pair",
      },
      {
        text: "Au-delà de l'esthétique, le rétromarketing pose une question intéressante : pourquoi certaines références traversent-elles les générations et continuent-elles de susciter de l'attachement ? La nostalgie, la mémoire collective et la réappropriation des codes historiques deviennent alors de véritables leviers de communication.",
        images: retro("03"),
        layout: "split-right",
      },
      {
        text: "Ce benchmark permet de décrypter les mécanismes de cette tendance, d'en observer les applications concrètes et de comprendre comment le passé peut devenir une source d'inspiration pour créer des campagnes actuelles et différenciantes.",
        images: retro("02", "08"),
        layout: "pair",
      },
    ],
    conclusion: "La nostalgie regarde en arrière. Les marques, elles, savent en faire un levier pour avancer.",
    // « Retromarketing Trend.pdf » (Documents Portfolio), compressé de 34 à 5,5 Mo.
    document: {
      file: "/docs/benchmark-retromarketing.pdf",
      downloadName: "Benchmark Retromarketing - Nathan Togolo.pdf",
      title: "Le benchmark complet",
      label: "Télécharger le benchmark",
      pages: 10,
    },
    theme: theme("retromarketing", { accent: "#a73c1e", onAccent: "#ffffff", ink: "#a73c1e" }),
    hero: { mode: "showcase", images: retro("01"), background: "#a73c1e" },
    cover: p("retromarketing", "08", "01"),
    images: [
      { id: p("retromarketing", "08", "00"), alt: "Planche de références rétromarketing : Burger King, Renault, Intermarché…" },
      { id: p("retromarketing", "08", "01"), alt: "Slide « Histoire de la tendance » avec un appareil Polaroid" },
      { id: p("retromarketing", "08", "02"), alt: "Slide « Évolution de la tendance » : « C'était mieux avant » et cycles de nostalgie" },
      { id: p("retromarketing", "08", "03"), alt: "Slide « Nostalgie » : affiche Air Jordan et repères 1980-2000" },
      { id: p("retromarketing", "08", "04"), alt: "Slide « Exemples modernes » avec une Air Jordan 1" },
      { id: p("retromarketing", "08", "06"), alt: "Slide d'exemples : Burberry, Burger King, Renault, tendance Y2K, Intermarché, Five Guys" },
      { id: p("retromarketing", "08", "07"), alt: "Slide d'exemples : Spotify, équipe de France, Citroën DS, Bonne Maman" },
      { id: p("retromarketing", "08", "08"), alt: "Slide « L'avenir ? » avec une bouteille Coca-Cola et un vinyle" },
    ],
  },
  {
    slug: "waiting-for-a-sign",
    number: "09",
    title: "If you're waiting for a sign",
    tagline: "Série de quatre affiches automobiles signées.",
    year: 2025,
    skills: ["creation-graphique"],
    deliverables: ["Série de 4 affiches"],
    story: [
      {
        text: "Quatre affiches, quatre voitures : une Porsche 911, une BMW, une Ferrari F40 et une Bentley Continental GT. Toutes reprennent la même accroche (« If you're waiting for a sign… this is it. ») et la même signature manuscrite.",
        images: sign("01", "02"),
        layout: "pair",
      },
      {
        text: "Le nom de chaque marque change de typographie : graffiti, capitales géantes, serif, script. Il passe devant ou derrière la voiture pour dialoguer avec la photo.",
        images: sign("03", "04"),
        layout: "pair",
      },
    ],
    theme: theme("waiting-for-a-sign", { accent: "#a61717", onAccent: "#ffffff", ink: "#a61717" }),
    hero: {
      mode: "showcase",
      images: sign("01", "03", "04"),
      background: "radial-gradient(120% 90% at 70% 40%, #3a1414 0%, #171111 60%, #0e0b0b 100%)",
    },
    cover: p("waiting-for-a-sign", "09", "03"),
    coverPosition: "50% 60%",
    images: [
      { id: p("waiting-for-a-sign", "09", "01"), alt: "Affiche Porsche 911 : voiture grise en bord de mer, nom en graffiti rouge" },
      { id: p("waiting-for-a-sign", "09", "02"), alt: "Affiche BMW : voiture de course orange devant un garage, nom en capitales blanches géantes" },
      { id: p("waiting-for-a-sign", "09", "03"), alt: "Affiche Ferrari F40 : voiture rouge sur une route bordée de lavande, nom en serif" },
      { id: p("waiting-for-a-sign", "09", "04"), alt: "Affiche Bentley Continental GT : voiture verte, nom en script rouge" },
    ],
  },
  {
    slug: "affiche-bleach",
    number: "10",
    title: "Concert Bleach",
    tagline: "Affiche de concert pour la bande originale de Bleach.",
    accroche: "Quand les OST sortent de l'écran.",
    type: "Projet fictif",
    year: 2024,
    skills: ["creation-graphique"],
    deliverables: ["Affiche", "Bannière", "Billet", "Billet sur mobile", "Merchandising"],
    story: [
      {
        text: "Ce projet imagine l'identité visuelle d'un concert consacré aux bandes originales de *Bleach* : Thousand-Year Blood War.",
        images: bleach("02"),
        layout: "full",
      },
      {
        text: "L'affiche donne le ton et pose les bases de l'univers graphique de l'événement. L'objectif est de retranscrire l'énergie de la série dans un visuel capable de séduire les fans et de leur donner rendez-vous pour une expérience musicale immersive.",
        images: bleach("01"),
        layout: "split-right",
      },
      {
        text: "Cette direction artistique se décline ensuite sur les tickets et les supports de merchandising. Chaque élément prolonge l'expérience au-delà du concert lui-même, avec une identité cohérente qui fait le lien entre la communication de l'événement, la musique et l'univers de *Bleach*.",
        images: bleach("03", "04", "05"),
        layout: "trio",
      },
    ],
    conclusion: "Une identité pensée pour faire vibrer les fans, avant même la première note.",
    theme: theme("affiche-bleach", { accent: "#f3a503", onAccent: "#1d1d1f", ink: "#ac1918" }),
    hero: { mode: "showcase", images: bleach("01"), background: "#f3a503" },
    cover: p("affiche-bleach", "10", "01"),
    coverPosition: "50% 35%",
    images: [
      { id: p("affiche-bleach", "10", "01"), alt: "Affiche du concert The Blood Warfare : silhouettes noires sur aplat jaune, mot « Concert » en gothique rouge" },
      { id: p("affiche-bleach", "10", "02"), alt: "Bannière horizontale du concert : aplat jaune et silhouettes" },
      { id: p("affiche-bleach", "10", "03"), alt: "Billet de concert « Blood Warfare », siège N3, avec QR code" },
      { id: p("affiche-bleach", "10", "04"), alt: "Billet électronique du concert affiché sur un smartphone" },
      { id: p("affiche-bleach", "10", "05"), alt: "Merchandising officiel du concert : sweat jaune, t-shirt rouge et tote bag" },
    ],
  },
  {
    slug: "fallen-angel",
    number: "11",
    title: "Fallen Angel",
    tagline: "Affiche signée.",
    year: 2026,
    skills: ["creation-graphique"],
    deliverables: ["Affiche"],
    story: [
      {
        text: "Une affiche en deux moitiés : une silhouette casquée sur fond rouge, un personnage de dos sur fond bleu, chacun tenant un sabre lumineux. Le titre « Fallen Angel » est posé en jaune au centre, avec la même signature manuscrite que la série If you're waiting for a sign.",
        images: [p("fallen-angel", "13", "01")],
        layout: "split-right",
      },
    ],
    theme: theme("fallen-angel", { accent: "#a3122a", onAccent: "#ffffff", ink: "#02387a" }),
    hero: {
      mode: "showcase",
      images: [p("fallen-angel", "13", "01")],
      background: "linear-gradient(90deg, #670215 0%, #670215 50%, #02387a 50%, #02387a 100%)",
    },
    cover: p("fallen-angel", "13", "01"),
    coverPosition: "50% 40%",
    images: [
      { id: p("fallen-angel", "13", "01"), alt: "Affiche Fallen Angel : deux silhouettes dos à dos, l'une sur fond rouge, l'autre sur fond bleu, titre jaune au centre" },
    ],
  },
];

/** Projets phares de l'accueil (validés) : image choisie pour le format paysage. */
export const featured: { slug: string; image: string }[] = [
  { slug: "europcar", image: p("europcar", "04", "14") },
  { slug: "crimson-ale", image: p("crimson-ale", "03", "05") },
  { slug: "joon", image: p("joon", "01", "15") },
  { slug: "les-watchers", image: p("les-watchers", "06", "15") },
  { slug: "affiche-bleach", image: p("affiche-bleach", "10", "05") },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getSkill(slug: string) {
  return skills.find((skill) => skill.slug === slug);
}

export function adjacentProjects(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  const total = projects.length;
  return {
    previous: projects[(index - 1 + total) % total],
    next: projects[(index + 1) % total],
  };
}

/** Visuels dans l'ordre de la page : ceux du récit, puis les autres. */
export function orderedImages(project: Project) {
  const inStory = project.story.flatMap((section) => section.images ?? []);
  const byId = new Map(project.images.map((image) => [image.id, image]));
  const story = inStory.map((id) => byId.get(id)).filter((image): image is ProjectImage => Boolean(image));
  const rest = project.images.filter((image) => !inStory.includes(image.id) && image.gallery !== false);
  return { story, rest, all: [...story, ...rest] };
}
