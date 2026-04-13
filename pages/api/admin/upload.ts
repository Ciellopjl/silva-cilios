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

    if (!session) {
      return res.status(401).json({ message: "Não autorizado (Sessão inválida ou expirada)" });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Método não permitido" });
    }

    const os = require('os');
    const form = formidable({
      uploadDir: os.tmpdir(),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024 // 10mb limite
    });

    console.log("Iniciando parse do formulário...");
    const [fields, files] = await form.parse(req);
    
    console.log("Campos recebidos:", Object.keys(fields));
    console.log("Arquivos recebidos:", Object.keys(files));

    const fileArray = files.file;
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!file) {
      console.error("Erro: Nenhum arquivo encontrado no objeto files.");
      return res.status(400).json({ message: "Nenhum arquivo enviado ou campo 'file' ausente." });
    }

    const filepath = file.filepath || (file as any).path;
    console.log("Caminho do arquivo temporário:", filepath);

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.error("ERRO CRÍTICO: Credenciais do Cloudinary não encontradas no .env");
      return res.status(500).json({ message: "Erro de configuração no servidor (Cloudinary)" });
    }

    // Upload para o Cloudinary
    console.log("Enviando para Cloudinary...");
    const result = await cloudinary.uploader.upload(filepath, {
      folder: "silva-cilios",
    });

    console.log("Upload Cloudinary com sucesso:", result.secure_url);
    return res.status(200).json({ url: result.secure_url });
  } catch (error: any) {
    console.error("ERRO NO HANDLER DE UPLOAD:", error);
    return res.status(500).json({ 
      message: "Erro ao processar upload", 
      error: error.message || String(error),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
