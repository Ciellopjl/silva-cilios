import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const servicos = await prisma.servico.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });
    return res.json(servicos);
  }

  // Apenas POST exige sessão
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ mensagem: "Não autorizado" });

  if (req.method === "POST") {
    const { nome, descricao, preco, duracaoMin, fotoUrl } = req.body;
    if (!nome || !preco) return res.status(400).json({ mensagem: "Nome e preço são obrigatórios" });
    const servico = await prisma.servico.create({
      data: { nome, descricao, preco: parseFloat(preco), duracaoMin: duracaoMin || 60, fotoUrl } as any,
    });
    return res.status(201).json(servico);
  }

  return res.status(405).json({ mensagem: "Método não permitido" });
}
