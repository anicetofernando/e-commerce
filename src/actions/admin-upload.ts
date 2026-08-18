"use server";

import { requireAdmin } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function uploadAdminImage(folder: string, formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Nenhum ficheiro selecionado." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Formato não suportado. Use JPG, PNG, WEBP, GIF ou SVG." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "A imagem não pode exceder 5MB." };
  }

  try {
    const { url } = await uploadImageToCloudinary(file, folder);
    return { url };
  } catch {
    return { error: "Falha ao enviar a imagem. Tente novamente." };
  }
}
