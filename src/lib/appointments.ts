import { supabase } from "@/integrations/supabase/client";

export type AppointmentStatus = "pending" | "confirmed" | "done" | "cancelled";

export type Appointment = {
  id: string;
  client_name: string;
  client_phone: string;
  service_id: string | null;
  service_name: string;
  preferred_at: string;
  notes: string | null;
  status: AppointmentStatus;
  created_at: string;
};

export type AppointmentRequest = {
  client_name: string;
  client_phone: string;
  service_id: string | null;
  service_name: string;
  preferred_at: string;
  notes: string | null;
};

export const appointmentsQueryKey = ["appointments"] as const;

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  done: "Realizado",
  cancelled: "Cancelado",
};

export async function requestAppointment(input: AppointmentRequest) {
  const { error } = await supabase
    .from("appointments")
    .insert({ ...input, status: "pending" });
  if (error) throw error;
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id, client_name, client_phone, service_id, service_name, preferred_at, notes, status, created_at",
    )
    .order("preferred_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
) {
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteAppointment(id: string) {
  const { error } = await supabase.from("appointments").delete().eq("id", id);
  if (error) throw error;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
