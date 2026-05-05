/**
 * Normaliza uma string removendo acentos e convertendo para minúsculas.
 * Ex: "Café" -> "cafe", "Pão" -> "pao"
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
