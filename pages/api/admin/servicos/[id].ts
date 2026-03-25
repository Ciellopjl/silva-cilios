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

    const { id } = req.query;

    if (req.method === "PUT") {
      const { nome, descricao, preco, duracaoMin, ativo, fotoUrl } = req.body;
      const servico = await prisma.servico.update({
        where: { id: id as string },
        data: { 
          nome, 
          descricao: descricao || null, 
          preco: Number(preco) || 0, 
          duracaoMin: Number(duracaoMin) || 60, 
          ativo: ativo ?? true, 
          fotoUrl: fotoUrl || null 
        },
      });
      return res.status(200).json(servico);
    }

    if (req.method === "DELETE") {
      await prisma.servico.delete({
        where: { id: id as string },
      });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Erro na API de serviço por ID:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}
