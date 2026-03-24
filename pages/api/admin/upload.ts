import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || (session.user as any).papel !== "admin") {
    return res.status(401).json({ message: "Não autorizado" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Garantir que o diretório existe
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // Aumentado para 10MB
  });

  try {
    const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = Array.isArray(data.files.file) ? data.files.file[0] : data.files.file;

    if (!file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    // No formidable v3+, usamos newFilename para obter o nome do arquivo salvo no disco
    const fileName = file.newFilename;
    const publicUrl = `/uploads/${fileName}`;

    console.log("Upload realizado com sucesso:", publicUrl);
    return res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error("Erro no processamento do upload:", error);
    return res.status(500).json({ message: "Erro ao processar upload", error: String(error) });
  }
}
