import { describe, expect, it } from "vitest";
import { addressSchema, customerSchema } from "@/lib/address";

const valid = {
  recipient: "Maria Souza",
  cep: "01310-100",
  street: "Avenida Paulista",
  number: "1000",
  complement: "",
  district: "Bela Vista",
  city: "São Paulo",
  state: "sp",
};

describe("Endereço de entrega", () => {
  it("aceita um endereço completo e guarda o CEP só com números", () => {
    const r = addressSchema.parse(valid);
    expect(r.cep).toBe("01310100");
    expect(r.state).toBe("SP");
  });
  it("recusa CEP sem 8 dígitos", () => {
    expect(addressSchema.safeParse({ ...valid, cep: "0131010" }).success).toBe(false);
  });
  it("recusa estado inexistente", () => {
    expect(addressSchema.safeParse({ ...valid, state: "XX" }).success).toBe(false);
  });
  it("exige número da casa", () => {
    expect(addressSchema.safeParse({ ...valid, number: " " }).success).toBe(false);
  });
});

describe("Dados do comprador", () => {
  it("exige celular com DDD (10 ou 11 dígitos)", () => {
    expect(customerSchema.safeParse({ fullName: "Maria Souza", phone: "(11) 97823-5579" }).success).toBe(true);
    expect(customerSchema.safeParse({ fullName: "Maria Souza", phone: "97823-5579" }).success).toBe(false);
  });
});
