// fileService.ts
import { FastifyRequest } from "fastify";
import * as fs from "fs";
import * as path from "path";
import { Image } from "../types/meetingTypes";
import { randomBytes } from "crypto";
import { v4 as uuidv4 } from 'uuid'
import * as fileType from 'file-type'

//pasta onde estarão as pastas de upload
const UPLOAD_DIRECTORY = "./upload";


export async function uploadImage(fileBuffer: Buffer, filename: string, subDir: string) {
  const dirPath = path.join(UPLOAD_DIRECTORY, subDir)
  const filePath = path.join(dirPath, filename);

  //o diretório upload será criado se ele não existir
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  await fs.promises.writeFile(filePath, fileBuffer);

  return filePath;
}



/* export async function handleMultipartFormData(
  imageBuffer: Buffer,
  filename: string,
  subDir: string
): Promise<string> {
  try {

    const extension = path.extname(filename)
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif"]

    if (!validExtensions.includes(extension)) {
      throw new Error(`Invalid image file format. Only ${validExtensions.join(', ')} are allowed.`)
    }

    const hash = randomBytes(16).toString('hex');
    const newFilename = `${hash}${path.extname(filename)}`
    const imageData = await uploadImage(imageBuffer, newFilename, subDir);
    return imageData;
  } catch (error) {
    console.error(error);
    throw error;
  }
} */


export async function handleMultipartFormData(
  imageBuffer: Buffer,
  filename: string,
  subDir: string,
): Promise<string> {

  try {
    const type = await fileType.fileTypeFromBuffer(imageBuffer)

    const validMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

    if (!type || !validMimeTypes.includes(type.mime)) {
      throw new Error(`Invalid image file format. Only ${validMimeTypes.join(', ')} are allowed.`);
    }

    const hash = randomBytes(16).toString('hex');
    const newFilename = `${hash}${path.extname(filename)}`
    const imageData = await uploadImage(imageBuffer, newFilename, subDir);
    return imageData;
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export async function handleImageUpload(
  request: FastifyRequest,
  subDir: string
): Promise<string | undefined> {
  const contentType = request.headers["content-type"];
  const { image, imageProfile } = request.body as {
    image?: Image[];
    imageProfile?: Image[];
  };

  const imageToUpload = image || imageProfile;

  if (
    imageToUpload &&
    request.isMultipart()
    /* contentType &&
    contentType.startsWith("multipart/form-data") */
  ) {
    const imageBuffer = imageToUpload[0].data;
    const filename = uuidv4() + path.extname(imageToUpload[0].filename);
    const filepath = await handleMultipartFormData(imageBuffer, filename, subDir)

    return path.basename(filepath)
  }
}

