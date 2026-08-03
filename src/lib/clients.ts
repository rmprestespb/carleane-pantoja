import { supabase } from "@/integrations/supabase/client";

export type ClientStatus = "active" | "inactive";

export type Client = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  birth_date: string | null;
  notes: string | null;
  status: ClientStatus;
  first_visit_at: string | null;
  last_visit_at: string | null;
  created_at: string;
};

export type ClientInput = {
  full_name: string;
  phone: string;
  email: string | null;
  birth_date: string | null;
  notes: string | null;
  status?: ClientStatus;
};

export type Anamnesis = {
  id: string;
  client_id: string;
  pain_history: string | null;
  injuries: string | null;
  surgeries: string | null;
  allergies: string | null;
  medications: string | null;
  contraindications: string[];
  pressure_preference: string | null;
  preferred_oils: string[];
  avoid_areas: string[];
  objectives: string | null;
  signed_at: string | null;
};

export type AnamnesisInput = Omit<Anamnesis, "id">;

export type Package = {
  id: string;
  client_id: string;
  service_id: string | null;
  service_name: string;
  total_sessions: number;
  used_sessions: number;
  total_price: number;
  status: string;
  purchased_at: string;
  expires_at: string | null;
};

export type Payment = {
  id: string;
  package_id: string;
  amount: number;
  method: string;
  paid_at: string;
  notes: string | null;
};

export type Session = {
  id: string;
  client_id: string;
  package_id: string | null;
  service_name: string;
  performed_at: string;
  session_notes: string | null;
  pressure_used: string | null;
};

export const clientsQueryKey = ["clients"] as const;
export const clientDetailQueryKey = (id: string) => ["client", id] as const;

export const pressureLabels: Record<string, string> = {
  light: "Leve",
  medium: "Média",
  strong: "Forte",
};

export const paymentMethods = ["pix", "dinheiro", "cartão", "transferência"];

export const commonContraindications = [
  "Gestante",
  "Hipertensão",
  "Trombose",
  "Inflamação aguda",
  "Febre",
  "Câncer em tratamento",
  "Marca-passo",
];

export const commonOils = [
  "Lavanda",
  "Capim-limão",
  "Eucalipto",
  "Hortelã",
  "Óleo de amêndoas",
  "Óleo de coco",
];

export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select(
      "id, full_name, phone, email, birth_date, notes, status, first_visit_at, last_visit_at, created_at",
    )
    .order("full_name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Client[];
}

export async function fetchClient(id: string): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .select(
      "id, full_name, phone, email, birth_date, notes, status, first_visit_at, last_visit_at, created_at",
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Client;
}

export async function createClient(input: ClientInput) {
  const { data, error } = await supabase
    .from("clients")
    .insert(input)
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateClient(id: string, input: Partial<ClientInput>) {
  const { error } = await supabase.from("clients").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchAnamnesis(clientId: string): Promise<Anamnesis | null> {
  const { data, error } = await supabase
    .from("client_anamnesis")
    .select("*")
    .eq("client_id", clientId)
    .maybeSingle();
  if (error) throw error;
  return (data as Anamnesis | null) ?? null;
}

export async function saveAnamnesis(input: AnamnesisInput) {
  const { error } = await supabase
    .from("client_anamnesis")
    .upsert(input, { onConflict: "client_id" });
  if (error) throw error;
}

export async function fetchPackages(clientId: string): Promise<Package[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("client_id", clientId)
    .order("purchased_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...row,
    total_price: Number(row.total_price),
  })) as Package[];
}

export async function createPackage(input: {
  client_id: string;
  service_id: string | null;
  service_name: string;
  total_sessions: number;
  total_price: number;
  expires_at: string | null;
}) {
  const { error } = await supabase.from("packages").insert(input);
  if (error) throw error;
}

export async function deletePackage(id: string) {
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchPayments(clientId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from("package_payments")
    .select("*, packages!inner(client_id)")
    .eq("packages.client_id", clientId)
    .order("paid_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    package_id: row.package_id,
    amount: Number(row.amount),
    method: row.method,
    paid_at: row.paid_at,
    notes: row.notes,
  }));
}

export async function createPayment(input: {
  package_id: string;
  amount: number;
  method: string;
  notes: string | null;
}) {
  const { error } = await supabase.from("package_payments").insert(input);
  if (error) throw error;
}

export async function fetchSessions(clientId: string): Promise<Session[]> {
  const { data, error } = await supabase
    .from("sessions")
    .select(
      "id, client_id, package_id, service_name, performed_at, session_notes, pressure_used",
    )
    .eq("client_id", clientId)
    .order("performed_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Session[];
}

export async function registerSession(input: {
  client_id: string;
  package_id: string | null;
  service_name: string;
  session_notes: string | null;
  pressure_used: string | null;
}) {
  const { error } = await supabase.from("sessions").insert(input);
  if (error) throw error;
}

export function whatsappLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

export function reminderMessage(name: string) {
  return `Olá ${name.split(" ")[0]}! Passando para confirmar sua sessão de massoterapia. Posso confirmar o horário?`;
}

export function returnMessage(name: string) {
  return `Olá ${name.split(" ")[0]}! Já faz um tempinho desde a sua última sessão. Quer agendar um novo atendimento para cuidar do seu corpo?`;
}

export function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function daysSince(iso: string | null) {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}
