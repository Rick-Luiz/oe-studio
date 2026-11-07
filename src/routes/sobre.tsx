import { createFileRoute, Link } from "@tanstack/react-router";
import fabricacao from "@/assets/fabricacao.jpg";
import hero from "@/assets/hero-oe.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — OE Studio" },
      { name: "description", content: "Conheça a OE Studio, marca independente que cria e fabrica objetos em impressão 3D." },
      { property: "og:title", content: "Sobre — OE Studio" },
      { property: "og:description", content: "Uma marca independente que desenha e fabrica seus próprios objetos." },
    ],
  }),
  component: Sobre,
});

const steps = [
  { n: "01", t: "Ideia", d: "Tudo começa com um esboço: uma forma, uma necessidade do dia a dia." },
  { n: "02", t: "Modelagem", d: "Desenhamos a peça em 3D, ajustando proporções e encaixes." },
  { n: "03", t: "Impressão", d: "A peça ganha forma na nossa impressora, camada por camada." },
  { n: "04", t: "Acabamento", d: "Revisamos cada detalhe antes de a peça seguir para você." },
];

function Sobre() {
  return (
    <>
      <section className="container-oe pt-16">
        <p className="eyebrow">Sobre</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-[1.05] md:text-7xl">
          Uma marca independente que <em className="text-primary">desenha e fabrica</em> seus próprios objetos.
        </h1>
        <img src={hero} alt="Produtos OE Studio" width={1600} height={1104} className="mt-16 aspect-[16/8] w-full rounded-sm object-cover" />
      </section>

      <section className="container-oe mt-24 grid gap-12 md:grid-cols-2">
        <p className="font-display text-3xl leading-snug">
          A OE Studio nasceu da vontade de transformar ideias em objetos reais — úteis, bonitos e feitos com cuidado.
        </p>
        <div className="space-y-5 text-muted-foreground">
          <p>
            Temos nossa própria impressora 3D e produzimos cada peça que vendemos. Isso nos dá liberdade para criar formas diferentes, testar novas ideias e desenvolver peças personalizadas.
          </p>
          <p>
            Nossos produtos estão disponíveis nos marketplaces parceiros, e este site é a nossa vitrine: um lugar para conhecer a marca, a coleção e o que somos capazes de criar.
          </p>
        </div>
      </section>

      <section className="mt-32 bg-secondary py-24">
        <div className="container-oe grid gap-14 md:grid-cols-2">
          <div>
            <p className="eyebrow">Processo</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Do esboço à peça final.</h2>
            <ol className="mt-12 space-y-8">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-6 border-t border-border pt-6">
                  <span className="font-display text-xl text-primary">{s.n}</span>
                  <div>
                    <p className="font-display text-2xl">{s.t}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <img src={fabricacao} alt="Impressora 3D em funcionamento" loading="lazy" width={1200} height={1408} className="aspect-[4/5] w-full rounded-sm object-cover" />
        </div>
      </section>

      <section className="container-oe mt-24 text-center">
        <Link to="/produtos" search={{}} className="btn-oe">Ver produtos</Link>
      </section>
    </>
  );
}
