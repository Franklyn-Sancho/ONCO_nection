// fileService.ts
import { FastifyRequest } from "fastify";
import * as fs from "fs";
import * as path from "path";
import { Image } from "../types/meetingTypes";
import { randomBytes } from "crypto";

//pasta onde estarão as pastas de upload
const uploadDir = "./upload";

export async function uploadImage(fileBuffer: Buffer, filename: string) {
  const filePath = path.join(uploadDir, filename);

  //o diretório upload será criado se ele não existir
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  await fs.promises.writeFile(filePath, fileBuffer);

  return filePath;
}

//
export async function handleMultipartFormData(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  try {

    const hash = randomBytes(16).toString('hex');
    const newFilename = `${hash}${path.extname(filename)}`
    const imageData = await uploadImage(imageBuffer, newFilename);
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
  const { image, imageProfile } = request.body as {
    image?: Image[];
    imageProfile?: Image[];
  };

  const imageToUpload = image || imageProfile;

  //se não funcionar, apagar daqui até o comentário 
  if(
    imageToUpload && 
    contentType &&
    contentType.startsWith("multipart/form-data")
  ) {
    const imageBuffer = imageToUpload[0].data;
    const filename = imageToUpload[0].filename
    const filepath = await handleMultipartFormData(imageBuffer,filename)

    return filepath
  }

  /* if (
    imageToUpload &&
    contentType &&
    contentType.startsWith("multipart/form-data")
  ) {
    const imageBuffer = imageToUpload[0].data;
    const filename = imageToUpload[0].filename;
    const filePath = await handleMultipartFormData(imageBuffer, filename);

    const fileContent = fs.readFileSync(filePath);
    const base64Image = fileContent.toString("base64");

    return base64Image;
  } */
}
