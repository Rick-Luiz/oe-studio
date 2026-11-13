import { cn } from "@/lib/utils";

/** Selo para produtos de demonstração, até serem trocados pelos reais. */
export function ExampleBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-sm border border-border bg-background/90 px-2.5 py-1 font-mono text-[0.65rem] uppercase text-muted-foreground backdrop-blur", className)}>
      Exemplo
    </span>
  );
}
