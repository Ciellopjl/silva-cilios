import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ mensagem: "Não autorizado" });
    }

    const agendamentos = await prisma.agendamento.findMany({
      orderBy: { dataHora: "asc" },
      include: {
        usuario: {
          select: { nome: true, email: true },
        },
      },
    });
    return res.json(agendamentos);
  }

  if (req.method === "POST") {
    const { nomeCliente, whatsapp, servico, dataHora, observacoes, local, endereco } = req.body;

    if (!nomeCliente || !whatsapp || !servico || !dataHora) {
      return res.status(400).json({ mensagem: "Campos obrigatórios ausentes" });
    }

    // Tentar pegar a sessão se existir (opcional)
    const session = await getServerSession(req, res, authOptions);

    // Verificar se o horário já está ocupado
    const dataHoraObj = new Date(dataHora);
    const existe = await prisma.agendamento.findFirst({
      where: {
        dataHora: dataHoraObj,
        status: { not: "cancelado" }
      }
    });

    if (existe) {
      return res.status(409).json({ mensagem: "Este horário já foi preenchido por outra cliente. Por favor, escolha outro momento. ✨" });
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        nomeCliente,
        whatsapp,
        servico,
        dataHora: dataHoraObj,
        observacoes: observacoes || null,
        local: local || null,
        endereco: endereco || null,
        usuarioId: session?.user?.id || null, 
      },
    });

    return res.status(201).json(agendamento);
  }

  return res.status(405).json({ mensagem: "Método não permitido" });
}
