// fileService.ts
import { FastifyRequest } from "fastify";
import * as fs from "fs";
import * as path from "path";

const uploadDir = "./upload";

export async function uploadImage(fileBuffer: Buffer, filename: string) {
  const filePath = path.join(uploadDir, filename);

  //o diretório uploadDir será criado se ele não existir
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  await fs.promises.writeFile(filePath, fileBuffer);

  return filePath;
}

export async function handleMultipartFormData(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  try {
    const imageData = await uploadImage(imageBuffer, filename);
    return imageData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function handleImageUpload(
  request: FastifyRequest
): Promise<string | undefined> {
  const contentType = request.headers["content-type"];
  const { image } = request.body as any;

  if (image && contentType && contentType.startsWith("multipart/form-data")) {
    const imageBuffer = image[0].data;
    const filename = image[0].filename;
    return await handleMultipartFormData(imageBuffer, filename);
  }
}
