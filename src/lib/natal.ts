/**
 * Temas de época do site, com liga e desliga automáticos (horário de Brasília):
 *
 *   19/11 até 25/12  -> tema de Natal   (creme + verde profundo + dourado)
 *   26/12 até 31/12  -> tema de Réveillon (branco perolado + dourado)
 *   fora disso       -> visual normal do site
 *
 * Para mudar o período: troque as datas abaixo (AAAA-MM-DD), salve e faça o push.
 * Para forçar um tema: FORCAR = "natal", "reveillon" ou "nenhum". Deixe null para seguir as datas.
 */
const NATAL_INICIO = "2026-11-19"; // primeiro dia do Natal
const REVEILLON_INICIO = "2026-12-26"; // primeiro dia do Réveillon
const REVEILLON_FIM = "2027-01-01"; // primeiro dia SEM tema (volta ao normal à meia-noite)
const FORCAR: "natal" | "reveillon" | "nenhum" | null = null;

export type TemaEpoca = "natal" | "reveillon" | null;

export function temaEpoca(agora: Date = new Date()): TemaEpoca {
  if (FORCAR === "natal" || FORCAR === "reveillon") return FORCAR;
  if (FORCAR === "nenhum") return null;
  const t = agora.getTime();
  const dia = (d: string) => new Date(`${d}T00:00:00-03:00`).getTime();
  if (t >= dia(NATAL_INICIO) && t < dia(REVEILLON_INICIO)) return "natal";
  if (t >= dia(REVEILLON_INICIO) && t < dia(REVEILLON_FIM)) return "reveillon";
  return null;
}

/** Natal ligado? */
export const natalAtivo = () => temaEpoca() === "natal";
/** Réveillon ligado? */
export const reveillonAtivo = () => temaEpoca() === "reveillon";
/** Algum tema festivo ligado (Natal ou Réveillon)? */
export const festaAtivo = () => temaEpoca() !== null;
