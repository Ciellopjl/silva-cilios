import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || (session.user as any).papel !== "admin") {
      return res.status(401).json({ message: "Não autorizado" });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método não permitido" });
    }

    const form = formidable({});

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

    // Upload para o Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: "silva-cilios",
    });

    console.log("Upload Cloudinary com sucesso:", result.secure_url);
    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Erro no handler de upload:", error);
    return res.status(500).json({ message: "Erro ao processar upload", error: String(error) });
  }
}
