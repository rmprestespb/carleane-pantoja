// ============================================================
// AGENDA GOOGLE — é aqui que se liga o agendamento do Google.
//
// Depois de criar o "Agendamento" no Google Agenda da Carleane,
// cole o link da página de reserva entre as aspas abaixo.
// Exemplo: "https://calendar.google.com/calendar/appointments/schedules/AcZss..."
//
// Enquanto estiver vazio ("") o site continua com o formulário atual,
// nada muda para o visitante.
// ============================================================
export const GOOGLE_AGENDA_URL = "";

export const agendaGoogleAtiva = () => GOOGLE_AGENDA_URL.trim().startsWith("https://");

// Endereço para mostrar a reserva dentro da página (a Google pede ?gv=true).
export function agendaGoogleEmbed() {
  const url = GOOGLE_AGENDA_URL.trim();
  return url.includes("?") ? url : `${url}?gv=true`;
}
