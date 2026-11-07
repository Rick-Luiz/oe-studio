import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero-oe.jpg";
import fabricacao from "@/assets/fabricacao.jpg";
import { categories, products } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { ChannelsSection } from "@/components/site/ChannelsSection";
import { whatsappLink } from "@/config/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OE Studio — Pequenas ideias. Grandes possibilidades." },
      { name: "description", content: "Objetos de decoração, organização e acessórios criados e fabricados pela OE Studio com impressão 3D." },
      { property: "og:title", content: "OE Studio — Pequenas ideias. Grandes possibilidades." },
      { property: "og:description", content: "Conheça a coleção de objetos autorais em impressão 3D da OE Studio." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.filter((p) => p.featured);
  const catImage = (slug: string) => products.find((p) => p.category === slug)?.images[0];
  const wa = whatsappLink("Olá, OE Studio! Tenho uma ideia de peça personalizada.");

  return (
    <>
      {/* Hero */}
      <section className="container-oe grid items-center gap-12 pt-12 pb-20 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-5 animate-fade-up">
          <p className="eyebrow">Design · Impressão 3D</p>
          <h1 className="mt-6 text-5xl leading-[1.05] md:text-7xl">
            Pequenas ideias.<br />
            <em className="text-primary">Grandes possibilidades.</em>
          </h1>
          <p className="mt-8 max-w-md text-muted-foreground">
            Transformamos criatividade em objetos reais. Conheça nossa coleção de produtos desenvolvidos e fabricados com impressão 3D.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/produtos" search={{}} className="btn-oe">Conhecer produtos <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/sobre" className="btn-oe-outline">Descobrir a OE Studio</Link>
          </div>
        </div>
        <div className="md:col-span-7 animate-fade-up [animation-delay:150ms]">
          <img src={hero} alt="Vaso, organizador e luminária impressos em 3D pela OE Studio" width={1600} height={1104} className="w-full rounded-sm object-cover" />
        </div>
      </section>

      {/* Destaques */}
      <section className="container-oe mt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Coleção</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Produtos em destaque</h2>
          </div>
          <Link to="/produtos" search={{}} className="text-sm link-underline">Ver catálogo completo →</Link>
        </div>
        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* Fabricação */}
      <section className="mt-32 bg-secondary py-24">
        <div className="container-oe grid items-center gap-14 md:grid-cols-2">
          <img src={fabricacao} alt="Impressora 3D fabricando um vaso" loading="lazy" width={1200} height={1408} className="aspect-[4/5] w-full rounded-sm object-cover" />
          <div>
            <p className="eyebrow">Fabricação própria</p>
            <h2 className="mt-4 text-4xl leading-tight md:text-5xl">Da nossa impressora para o seu dia a dia.</h2>
            <p className="mt-8 text-muted-foreground">
              Cada peça da OE Studio é desenhada e produzida por nós, na nossa própria impressora 3D. Acompanhamos camada por camada, com atenção aos detalhes, do primeiro esboço ao acabamento.
            </p>
            <p className="mt-5 text-muted-foreground">
              A impressão 3D nos permite criar objetos funcionais, decorativos e personalizados — peças que dificilmente existiriam em uma linha de produção tradicional.
            </p>
            <Link to="/sobre" className="btn-oe-outline mt-10">Conheça o estúdio</Link>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="container-oe mt-32">
        <p className="eyebrow">Explorar</p>
        <h2 className="mt-4 text-4xl md:text-5xl">Categorias</h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.slug} to="/produtos" search={{ categoria: c.slug }} className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-muted">
              <img src={catImage(c.slug)} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6 pt-20">
                <p className="font-display text-3xl text-ink-foreground">{c.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Personalizados */}
      <section className="container-oe mt-32">
        <div className="rounded-sm bg-primary px-8 py-20 text-center text-primary-foreground md:px-20">
          <p className="eyebrow text-primary-foreground/70">Personalizados</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl leading-tight md:text-6xl">Tem uma ideia? Vamos dar forma a ela.</h2>
          <p className="mx-auto mt-8 max-w-xl opacity-80">
            Também desenvolvemos peças sob medida: presentes, objetos com nomes, suportes específicos e muito mais — conforme a viabilidade de fabricação.
          </p>
          {wa ? (
            <a href={wa} target="_blank" rel="noreferrer" className="btn-oe-light mt-10">Conversar no WhatsApp</a>
          ) : (
            <Link to="/contato" className="btn-oe-light mt-10">Fale com a gente</Link>
          )}
        </div>
      </section>

      <ChannelsSection />
    </>
  );
}
