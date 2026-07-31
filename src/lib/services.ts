import { supabase } from "@/integrations/supabase/client";

export type Service = {
  id: string;
  name: string;
  detail: string | null;
  price: number;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
};

export type ServiceInput = {
  name: string;
  detail: string | null;
  price: number;
  image_url: string | null;
  is_visible?: boolean;
};

export const servicesQueryKey = ["services"] as const;

const PHOTO_BUCKET = "service-photos";
const TEN_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 10;

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("id, name, detail, price, image_url, sort_order, is_visible")
    .order("name", { ascending: true });

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

/** Uploads a photo to the private bucket and returns a long-lived signed URL. */
export async function uploadServicePhoto(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrl(path, TEN_YEARS_IN_SECONDS);
  if (error) throw error;

  return data.signedUrl;
}

export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
