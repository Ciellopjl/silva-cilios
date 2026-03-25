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
      const servicos = await prisma.servico.findMany({
        orderBy: { criadoEm: "desc" },
      });
      return res.status(200).json(servicos || []);
    }

    if (req.method === "POST") {
      const { nome, descricao, preco, duracaoMin, fotoUrl } = req.body;
      
      if (!nome) return res.status(400).json({ message: "Nome é obrigatório" });

      const servico = await prisma.servico.create({
        data: { 
          nome, 
          descricao: descricao || null, 
          preco: Number(preco) || 0, 
          duracaoMin: Number(duracaoMin) || 60, 
          fotoUrl: fotoUrl || null 
        },
      });
      return res.status(201).json(servico);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error("Erro na API de serviços:", error);
    return res.status(500).json({ message: "Erro interno no servidor: " + String(error?.message || error) });
  }
}
