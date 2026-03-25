import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || (session.user as any).papel !== "admin") {
      return res.status(401).json({ message: "Não autorizado" });
    }

    if (req.method === "GET") {
      const profissionais = await prisma.profissional.findMany({
        orderBy: { criadoEm: "desc" },
      });
      return res.status(200).json(profissionais || []);
    }

    if (req.method === "POST") {
      const { nome, especialidade, fotoUrl } = req.body;
      
      if (!nome) return res.status(400).json({ message: "Nome é obrigatório" });

      const profissional = await prisma.profissional.create({
        data: { 
          nome, 
          especialidade: especialidade || null, 
          fotoUrl: fotoUrl || "/logo.png" 
        },
      });
      return res.status(201).json(profissional);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Erro na API de profissionais:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}
