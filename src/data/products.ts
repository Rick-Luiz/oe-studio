// Catálogo da OE Studio — para adicionar um produto, copie um bloco e edite.
// As imagens atuais são ilustrativas: troque pelas fotografias próprias em src/assets.
import vaso from "@/assets/p-vaso.jpg";
import dragao from "@/assets/p-dragao.jpg";
import organizador from "@/assets/p-organizador.jpg";
import headset from "@/assets/p-headset.jpg";
import cabos from "@/assets/p-cabos.jpg";
import chaveiro from "@/assets/p-chaveiro.jpg";
import luminaria from "@/assets/p-luminaria.jpg";
import controle from "@/assets/p-controle.jpg";

export const categories = [
  { slug: "decoracao", name: "Decoração" },
  { slug: "organizacao", name: "Organização" },
  { slug: "acessorios", name: "Acessórios" },
  { slug: "personalizados", name: "Personalizados" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export interface Product {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  /** Preço em reais. Deixe undefined para não exibir. */
  price?: number;
  category: CategorySlug;
  images: string[];
  shopeeUrl?: string;
  tiktokUrl?: string;
  featured?: boolean;
  details: { label: string; value: string }[];
}

export const products: Product[] = [
  {
    slug: "vaso-organico",
    name: "Vaso Orgânico",
    shortDescription: "Formas fluidas que trazem movimento ao ambiente.",
    description:
      "Inspirado em formas naturais, o Vaso Orgânico tem curvas suaves que mudam com a luz ao longo do dia. Ideal para flores secas e arranjos decorativos.",
    category: "decoracao",
    images: [vaso],
    featured: true,
    details: [
      { label: "Material", value: "PLA" },
      { label: "Uso", value: "Flores secas e decoração" },
    ],
  },
  {
    slug: "dragao-articulado",
    name: "Dragão Articulado",
    shortDescription: "Uma escultura que se move, peça por peça.",
    description:
      "Impresso já montado, com articulações que permitem posar o dragão de diferentes formas. Um objeto colecionável para estantes e mesas.",
    category: "decoracao",
    images: [dragao],
    featured: true,
    details: [
      { label: "Material", value: "PLA" },
      { label: "Articulações", value: "Móveis, impressas em peça única" },
    ],
  },
  {
    slug: "organizador-de-mesa",
    name: "Organizador de Mesa",
    shortDescription: "Canetas, notas e pequenos itens no lugar certo.",
    description:
      "Compartimentos pensados para o dia a dia de trabalho, com linhas limpas que combinam com qualquer mesa.",
    category: "organizacao",
    images: [organizador],
    featured: true,
    details: [
      { label: "Material", value: "PLA" },
      { label: "Compartimentos", value: "Canetas, notas e objetos pequenos" },
    ],
  },
  {
    slug: "suporte-para-headset",
    name: "Suporte para Headset",
    shortDescription: "Seu fone sempre à mão, com elegância.",
    description:
      "Base estável e haste curva que protege a espuma do headset. Deixa a mesa organizada e valoriza o setup.",
    category: "acessorios",
    images: [headset],
    featured: true,
    details: [{ label: "Material", value: "PLA" }],
  },
  {
    slug: "kit-organizador-de-cabos",
    name: "Kit Organizador de Cabos",
    shortDescription: "Fim dos cabos caindo da mesa.",
    description:
      "Conjunto de presilhas para prender e separar cabos na borda da mesa ou atrás de móveis.",
    category: "organizacao",
    images: [cabos],
    details: [{ label: "Material", value: "PLA" }],
  },
  {
    slug: "chaveiro-personalizado",
    name: "Chaveiro Personalizado",
    shortDescription: "Iniciais, nomes ou símbolos que são seus.",
    description:
      "Chaveiro feito sob medida com a letra, nome ou forma que você escolher. Ótimo para presentear.",
    category: "personalizados",
    images: [chaveiro],
    details: [
      { label: "Material", value: "PLA" },
      { label: "Personalização", value: "Letras, nomes ou formas" },
    ],
  },
  {
    slug: "luminaria-decorativa",
    name: "Luminária Decorativa",
    shortDescription: "Luz suave filtrada por camadas ondulantes.",
    description:
      "A cúpula impressa em camadas finas difunde a luz de forma acolhedora, criando um clima calmo no ambiente.",
    category: "decoracao",
    images: [luminaria],
    details: [{ label: "Material", value: "PLA" }],
  },
  {
    slug: "suporte-para-controle",
    name: "Suporte para Controle",
    shortDescription: "Um lugar certo para o controle do videogame.",
    description:
      "Suporte firme que mantém o controle em pé e à vista, deixando o espaço de jogo mais organizado.",
    category: "acessorios",
    images: [controle],
    details: [{ label: "Material", value: "PLA" }],
  },
];

export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
