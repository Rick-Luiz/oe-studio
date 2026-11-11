import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { productColors } from "@/data/products";

type Colors = ReturnType<typeof productColors>;

/** Amostras de cor apenas para visualização (cartões do catálogo). */
export function ColorDots({ colors, className }: { colors: Colors; className?: string }) {
  if (colors.length === 0) return null;
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="sr-only">Cores disponíveis: {colors.map((c) => c.name).join(", ")}</span>
      {colors.map((c) => (
        <span
          key={c.key}
          aria-hidden
          title={c.name}
          className="h-3 w-3 rounded-full border border-foreground/15"
          style={{ backgroundColor: c.swatch }}
        />
      ))}
    </div>
  );
}

/** Escolha de cor na página do produto — só oferece cores cadastradas. */
export function ColorPicker({
  colors,
  value,
  onChange,
}: {
  colors: Colors;
  value: string | null;
  onChange: (key: string) => void;
}) {
  if (colors.length === 0) return null;
  const selected = colors.find((c) => c.key === value);
  return (
    <div className="mt-10">
      <p className="text-sm">
        <span className="text-muted-foreground">Cores disponíveis</span>
        {selected && <span> · {selected.name}</span>}
      </p>
      <div role="group" aria-label="Cores disponíveis" className="mt-4 flex flex-wrap gap-3">
        {colors.map((c) => {
          const active = c.key === value;
          return (
            <Button
              key={c.key}
              type="button"
              variant="ghost"
              aria-pressed={active}
              aria-label={c.name}
              title={c.name}
              onClick={() => onChange(c.key)}
              className={cn(
                "h-10 w-10 rounded-full border p-1 transition-colors hover:bg-transparent",
                active ? "border-foreground" : "border-transparent hover:border-border",
              )}
            >
              <span className="block h-full w-full rounded-full border border-foreground/15" style={{ backgroundColor: c.swatch }} />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
