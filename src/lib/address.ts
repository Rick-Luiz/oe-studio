import { z } from "zod";

export const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

const digits = (s: string) => s.replace(/\D/g, "");

/** Endereço de entrega exigido para finalizar a compra. */
export const addressSchema = z.object({
  recipient: z.string().trim().min(3, "Informe o nome de quem vai receber").max(120),
  cep: z.string().transform(digits).refine((s) => s.length === 8, "O CEP precisa ter 8 dígitos"),
  street: z.string().trim().min(2, "Informe a rua").max(160),
  number: z.string().trim().min(1, "Informe o número").max(20),
  complement: z.string().trim().max(80).default(""),
  district: z.string().trim().min(2, "Informe o bairro").max(80),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  state: z
    .string()
    .trim()
    .transform((s) => s.toUpperCase())
    .refine((s): s is (typeof UFS)[number] => (UFS as readonly string[]).includes(s), "Escolha o estado"),
});
export type Address = z.infer<typeof addressSchema>;

/** Dados de quem compra. */
export const customerSchema = z.object({
  fullName: z.string().trim().min(3, "Informe seu nome completo").max(120),
  phone: z
    .string()
    .transform(digits)
    .refine((s) => s.length === 10 || s.length === 11, "Informe o celular com DDD"),
});
export type Customer = z.infer<typeof customerSchema>;

export const formatCep = (cep: string) => {
  const d = digits(cep).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

export const formatAddress = (a: Pick<Address, "street" | "number" | "complement" | "district" | "city" | "state" | "cep">) =>
  `${a.street}, ${a.number}${a.complement ? ` — ${a.complement}` : ""} · ${a.district} · ${a.city}/${a.state} · CEP ${formatCep(a.cep)}`;

/** Primeira mensagem de erro por campo, para mostrar no formulário. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  aguardando_pagamento: "Aguardando pagamento",
  em_analise: "Pagamento em análise",
  pago: "Pago",
  recusado: "Pagamento recusado",
  cancelado: "Cancelado",
  reembolsado: "Reembolsado",
};
