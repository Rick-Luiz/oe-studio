// ============================================================================
// Catálogo da OE Studio — ÚNICO lugar para cadastrar produtos, categorias e cores.
//
// • Novo produto: copie um bloco da lista `products` e edite os campos.
// • Nova categoria: adicione uma linha em `categories` (ela aparece no menu de
//   filtros, no rodapé e na página inicial automaticamente).
// • Nova cor: adicione uma linha em `colors`. Um produto só pode usar cores
//   cadastradas aqui — o site não aceita outras.
// • Campos opcionais (preço, peso, links) ficam ocultos no site quando vazios.
// • Produtos de demonstração têm `example: true` e aparecem com o selo
//   "Exemplo". Ao cadastrar um produto real, remova essa linha.
// ============================================================================
import vaso from "@/assets/p-vaso.jpg";
import dragao from "@/assets/p-dragao.jpg";
import organizador from "@/assets/p-organizador.jpg";
import headset from "@/assets/p-headset.jpg";
import cabos from "@/assets/p-cabos.jpg";
import chaveiro from "@/assets/p-chaveiro.jpg";
import luminaria from "@/assets/p-luminaria.jpg";
import controle from "@/assets/p-controle.jpg";
import dragaoOliva from "@/assets/p-dragao-oliva.jpg";
import dragaoAreia from "@/assets/p-dragao-areia.jpg";
import cachepo from "@/assets/p-cachepo.jpg";
import suporteCelular from "@/assets/p-suporte-celular.jpg";

/* ---------------------------------- Categorias ---------------------------------- */
export const categories = [
  { slug: "decoracao", name: "Decoração" },
  { slug: "organizacao", name: "Organização" },
  { slug: "acessorios", name: "Acessórios" },
  { slug: "personalizados", name: "Personalizados" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

/* ------------------------------------ Cores ------------------------------------- */
/** `swatch` é a cor exibida na bolinha de amostra (código hexadecimal). */
export const colors = {
  branco: { name: "Branco", swatch: "#F1EEE7" },
  areia: { name: "Areia", swatch: "#D8C6A6" },
  bege: { name: "Bege", swatch: "#C9B391" },
  terracota: { name: "Terracota", swatch: "#B4664B" },
  oliva: { name: "Verde-oliva", swatch: "#6C7148" },
  cinza: { name: "Cinza", swatch: "#9A9893" },
  grafite: { name: "Grafite", swatch: "#4A4947" },
  preto: { name: "Preto", swatch: "#242423" },
} as const satisfies Record<string, { name: string; swatch: string }>;

export type ColorKey = keyof typeof colors;

/* ----------------------------------- Produto ------------------------------------ */
export interface Product {
  /** Endereço da página: /produto/<slug>. Use letras minúsculas e hífens. */
  slug: string;
  name: string;
  /** Frase curta exibida nos cartões do catálogo. */
  shortDescription: string;
  description: string;
  /** Preço em reais (ex.: 49.9). Deixe sem preencher para não exibir preço. */
  price?: number;
  category: CategorySlug;
  /** Ex.: "PLA", "PETG". */
  material: string;
  /** Ex.: "12 × 12 × 18 cm". */
  dimensions: string;
  /** Peso aproximado. Ex.: "120 g". Opcional. */
  weight?: string;
  /** Cores disponíveis — apenas chaves cadastradas em `colors`. */
  colors: ColorKey[];
  /** A primeira foto é a capa do produto. */
  images: string[];
  /** Foto da peça em cada cor (opcional). Ao escolher a cor, a foto muda. */
  colorImages?: Partial<Record<ColorKey, string>>;
  /** Link do anúncio deste produto na Shopee. */
  shopeeUrl?: string;
  /** Link do anúncio deste produto na TikTok Shop. */
  tiktokUrl?: string;
  /** Exibir na seção "Produtos em destaque" da página inicial. */
  featured?: boolean;
  /** Produto de demonstração. Remova ao cadastrar o produto real. */
  example?: boolean;
  /** Informações extras opcionais, exibidas na ficha técnica. */
  extraDetails?: { label: string; value: string }[];
}

/* ----------------------------------- Catálogo ----------------------------------- */
export const products: Product[] = [
  {
    slug: "vaso-organico",
    name: "Vaso Orgânico",
    shortDescription: "Formas fluidas que trazem movimento ao ambiente.",
    description:
      "Inspirado em formas naturais, o Vaso Orgânico tem curvas suaves que mudam com a luz ao longo do dia. Ideal para flores secas e arranjos decorativos.",
    category: "decoracao",
    material: "PLA",
    dimensions: "12 × 12 × 20 cm",
    weight: "150 g",
    colors: ["oliva", "areia", "terracota"],
    images: [vaso],
    featured: true,
    example: true,
    price: 1, // valor de teste — trocar pelo preço real
    extraDetails: [{ label: "Uso", value: "Flores secas e decoração" }],
  },
  {
    slug: "dragao-articulado",
    name: "Dragão Articulado",
    shortDescription: "Uma escultura que se move, peça por peça.",
    description:
      "Impresso já montado, com articulações que permitem posar o dragão de diferentes formas. Um objeto colecionável para estantes e mesas.",
    category: "decoracao",
    material: "PLA",
    dimensions: "30 × 8 × 6 cm",
    colors: ["grafite", "oliva", "areia"],
    images: [dragao],
    colorImages: { grafite: dragao, oliva: dragaoOliva, areia: dragaoAreia },
    featured: true,
    example: true,
    price: 1, // valor de teste — trocar pelo preço real
    extraDetails: [{ label: "Articulações", value: "Móveis, impressas em peça única" }],
  },
  {
    slug: "organizador-de-mesa",
    name: "Organizador de Mesa",
    shortDescription: "Canetas, notas e pequenos itens no lugar certo.",
    description:
      "Compartimentos pensados para o dia a dia de trabalho, com linhas limpas que combinam com qualquer mesa.",
    category: "organizacao",
    material: "PLA",
    dimensions: "20 × 10 × 9 cm",
    weight: "180 g",
    colors: ["bege", "grafite", "branco"],
    images: [organizador],
    featured: true,
    example: true,
    price: 1, // valor de teste — trocar pelo preço real
    extraDetails: [{ label: "Compartimentos", value: "Canetas, notas e objetos pequenos" }],
  },
  {
    slug: "suporte-para-headset",
    name: "Suporte para Headset",
    shortDescription: "Seu fone sempre à mão, com elegância.",
    description:
      "Base estável e haste curva que protege a espuma do headset. Deixa a mesa organizada e valoriza o setup.",
    category: "acessorios",
    material: "PLA",
    dimensions: "12 × 10 × 26 cm",
    colors: ["preto", "grafite", "branco"],
    images: [headset],
    featured: true,
    example: true,
    price: 1, // valor de teste — trocar pelo preço real
  },
  {
    slug: "kit-organizador-de-cabos",
    name: "Kit Organizador de Cabos",
    shortDescription: "Fim dos cabos caindo da mesa.",
    description:
      "Conjunto de presilhas para prender e separar cabos na borda da mesa ou atrás de móveis.",
    category: "organizacao",
    material: "PLA",
    dimensions: "4 × 3 × 2 cm (cada presilha)",
    colors: ["oliva", "areia", "branco"],
    images: [cabos],
    example: true,
    price: 1, // valor de teste — trocar pelo preço real
  },
  {
    slug: "chaveiro-personalizado",
    name: "Chaveiro Personalizado",
    shortDescription: "Iniciais, nomes ou símbolos que são seus.",
    description:
      "Chaveiro feito sob medida com a letra, nome ou forma que você escolher. Ótimo para presentear.",
    category: "personalizados",
    material: "PLA",
    dimensions: "Até 6 × 3 cm",
    colors: ["oliva", "terracota", "areia", "preto"],
    images: [chaveiro],
    example: true,
    price: 1, // valor de teste — trocar pelo preço real
    extraDetails: [{ label: "Personalização", value: "Letras, nomes ou formas" }],
  },
  {
    slug: "luminaria-decorativa",
    name: "Luminária Decorativa",
    shortDescription: "Luz suave filtrada por camadas ondulantes.",
    description:
      "A cúpula impressa em camadas finas difunde a luz de forma acolhedora, criando um clima calmo no ambiente.",
    category: "decoracao",
    material: "PLA",
    dimensions: "16 × 16 × 24 cm",
    colors: ["branco", "areia"],
    images: [luminaria],
    example: true,
    price: 1, // valor de teste — trocar pelo preço real
  },
  {
    slug: "suporte-para-controle",
    name: "Suporte para Controle",
    shortDescription: "Um lugar certo para o controle do videogame.",
    description:
      "Suporte firme que mantém o controle em pé e à vista, deixando o espaço de jogo mais organizado.",
    category: "acessorios",
    material: "PLA",
    dimensions: "10 × 8 × 12 cm",
    colors: ["preto", "grafite"],
    images: [controle],
    example: true,
    price: 1, // valor de teste — trocar pelo preço real
  },
  {
    slug: "cachepo-geometrico",
    name: "Cachepô Geométrico",
    shortDescription: "Facetas que valorizam suculentas e pequenas plantas.",
    description:
      "Cachepô de faces geométricas com acabamento em camadas finas. Perfeito para suculentas, cactos e mudas pequenas em mesas e prateleiras.",
    category: "decoracao",
    material: "PLA",
    dimensions: "11 × 11 × 9 cm",
    weight: "110 g",
    colors: ["terracota"],
    images: [cachepo],
    example: true,
    price: 1, // valor de teste — trocar pelo preço real
    extraDetails: [{ label: "Uso", value: "Suculentas e plantas pequenas" }],
  },
  {
    slug: "suporte-para-celular",
    name: "Suporte para Celular",
    shortDescription: "Seu celular em pé, no ângulo certo.",
    description:
      "Suporte de mesa com inclinação confortável para chamadas de vídeo, receitas ou acompanhar notificações enquanto trabalha.",
    category: "acessorios",
    material: "PLA",
    dimensions: "8 × 9 × 11 cm",
    weight: "70 g",
    colors: ["branco"],
    images: [suporteCelular],
    example: true,
    price: 1, // valor de teste — trocar pelo preço real
  },
];

/* --------------------------- Funções auxiliares (não editar) --------------------------- */
export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export const isCategory = (slug: string): slug is CategorySlug =>
  categories.some((c) => c.slug === slug);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const featuredProducts = () => products.filter((p) => p.featured);

export const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Foto da peça na cor escolhida; sem foto cadastrada para a cor, usa a capa. */
export const imageForColor = (p: Pick<Product, "images" | "colorImages">, color?: string | null) =>
  (color && p.colorImages?.[color as ColorKey]) || p.images[0];

/** Preço formatado, ou `null` quando o produto não tem preço definido. */
export const displayPrice = (p: Pick<Product, "price">): string | null =>
  typeof p.price === "number" && Number.isFinite(p.price) && p.price > 0
    ? formatPrice(p.price)
    : null;

/** Cores do produto já resolvidas a partir do cadastro de cores (ignora chaves desconhecidas). */
export const productColors = (p: Pick<Product, "colors">) =>
  Array.from(new Set(p.colors))
    .filter((key): key is ColorKey => key in colors)
    .map((key) => ({ key, ...colors[key] }));

const isWebLink = (href?: string): href is string => {
  if (!href) return false;
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export type BuyLink = { channel: "shopee" | "tiktok"; label: string; href: string };

/** Botões de compra do produto: apenas marketplaces com link válido cadastrado. */
export const buyLinks = (p: Pick<Product, "shopeeUrl" | "tiktokUrl">): BuyLink[] => {
  const links: BuyLink[] = [];
  if (isWebLink(p.shopeeUrl)) links.push({ channel: "shopee", label: "Comprar na Shopee", href: p.shopeeUrl });
  if (isWebLink(p.tiktokUrl)) links.push({ channel: "tiktok", label: "Comprar na TikTok Shop", href: p.tiktokUrl });
  return links;
};

/** Ficha técnica exibida na página do produto (campos vazios ficam de fora). */
export const productSpecs = (p: Product) =>
  [
    { label: "Material", value: p.material },
    { label: "Dimensões", value: p.dimensions },
    { label: "Peso aproximado", value: p.weight },
    ...(p.extraDetails ?? []),
  ].filter((d): d is { label: string; value: string } => Boolean(d.value?.trim()));

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Busca por nome, descrição, material, categoria e cores (ignora acentos). */
export const matchesSearch = (p: Product, term: string) => {
  const t = normalize(term.trim());
  if (!t) return true;
  const haystack = [
    p.name,
    p.shortDescription,
    p.description,
    p.material,
    categoryName(p.category),
    ...productColors(p).map((c) => c.name),
  ].join(" ");
  return normalize(haystack).includes(t);
};
