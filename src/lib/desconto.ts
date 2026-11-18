/**
 * Card de desconto que aparece quando a pessoa entra no site.
 * Ela clica em "Pegar meu desconto" e o código aparece, pronto para copiar ou enviar no WhatsApp.
 *
 * Para mudar o desconto: troque os textos abaixo, salve e faça o push.
 * Para tirar o card do ar: ATIVO = false.
 * Quem usa o código avisa a Carleane pelo WhatsApp, e ela confere antes de dar o desconto.
 */
export const DESCONTO = {
  ATIVO: false,
  /** Último dia em que o card aparece (AAAA-MM-DD). Use null para não ter fim. */
  ATE: "2026-12-31" as string | null,
  etiqueta: "Presente para você",
  destaque: "10% OFF",
  descricao: "na sua primeira sessão de massoterapia",
  codigo: "BEMVINDA10",
  regra: "Mostre este código no WhatsApp ao agendar. Válido até 31/12.",
  /** Depois de fechar o card, ele só volta a aparecer depois de quantas horas. */
  VOLTAR_EM_HORAS: 24,
};

export function descontoAtivo(agora: Date = new Date()): boolean {
  if (!DESCONTO.ATIVO) return false;
  if (!DESCONTO.ATE) return true;
  // vale até o fim do dia (horário de Brasília)
  return agora.getTime() < new Date(`${DESCONTO.ATE}T23:59:59-03:00`).getTime();
}

export function mensagemDesconto(): string {
  return `Olá Carleane! Quero usar o código ${DESCONTO.codigo} (${DESCONTO.destaque}) para agendar minha sessão.`;
}
