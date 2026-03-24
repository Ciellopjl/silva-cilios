import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || (session.user as any).papel !== "admin") {
    return res.status(401).json({ message: "Não autorizado" });
  }

  if (req.method === "GET") {
    const servicos = await prisma.servico.findMany({
      orderBy: { criadoEm: "desc" },
    });
    return res.status(200).json(servicos);
  }

  if (req.method === "POST") {
    const { nome, descricao, preco, duracaoMin, fotoUrl } = req.body;
    const servico = await prisma.servico.create({
      data: { nome, descricao, preco: Number(preco), duracaoMin: Number(duracaoMin), fotoUrl } as any,
    });
    return res.status(201).json(servico);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
