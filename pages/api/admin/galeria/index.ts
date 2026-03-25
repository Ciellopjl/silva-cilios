import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    if (req.method === "GET") {
      const trabalhos = await prisma.trabalhoRealizado.findMany({
        orderBy: { criadoEm: "desc" },
      });
      return res.status(200).json(trabalhos || []);
    }

    if (req.method === "POST") {
      const { titulo, fotoUrl } = req.body;
      
      if (!fotoUrl) return res.status(400).json({ message: "URL da foto é obrigatória" });

      const trabalho = await prisma.trabalhoRealizado.create({
        data: { titulo: titulo || null, fotoUrl },
      });
      return res.status(201).json(trabalho);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Erro na API da galeria:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}
