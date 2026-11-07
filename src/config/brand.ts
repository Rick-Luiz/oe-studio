// Configurações da marca — edite aqui os links e contatos.
// Deixe o campo vazio ("") para esconder o botão correspondente no site.
export const brand = {
  name: "OE Studio",
  tagline: "Objetos autorais fabricados em impressão 3D",
  email: "",
  /** Número com DDI e DDD, só dígitos. Ex.: "5511999999999" */
  whatsapp: "",
  instagram: "",
  shopee: "",
  tiktokShop: "",
};

export function whatsappLink(message = "Olá, OE Studio! Gostaria de saber mais.") {
  if (!brand.whatsapp) return "";
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}
