import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }

  const { id } = req.query;

  if (req.method === "DELETE") {
    await prisma.agendamento.delete({ where: { id: id as string } });
    return res.status(204).end();
  }

  if (req.method === "PATCH") {
    const { status, nomeCliente, servico, dataHora, observacoes } = req.body;
    const agendamento = await prisma.agendamento.update({
      where: { id: id as string },
      data: { status, nomeCliente, servico, dataHora: dataHora ? new Date(dataHora) : undefined, observacoes },
    });
    return res.json(agendamento);
  }

  return res.status(405).json({ mensagem: "Método não permitido" });
}
