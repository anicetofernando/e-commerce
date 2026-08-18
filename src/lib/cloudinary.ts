import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImageToCloudinary(file: File, folder: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<{ url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `albimaq/${folder}`, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Falha ao enviar a imagem."));
        resolve({ url: result.secure_url });
      },
    );
    stream.end(buffer);
  });
}
