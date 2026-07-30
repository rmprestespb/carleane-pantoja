import { supabase } from "@/integrations/supabase/client";

export type Service = {
  id: string;
  name: string;
  detail: string | null;
  price: number;
  image_url: string | null;
  sort_order: number;
};

export type ServiceInput = {
  name: string;
  detail: string | null;
  price: number;
  image_url: string | null;
};

export const servicesQueryKey = ["services"] as const;

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("id, name, detail, price, image_url, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => ({ ...row, price: Number(row.price) }));
}

export async function createService(input: ServiceInput) {
  const { error } = await supabase.from("services").insert(input);
  if (error) throw error;
}

export async function updateService(id: string, input: Partial<ServiceInput>) {
  const { error } = await supabase.from("services").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteService(id: string) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
