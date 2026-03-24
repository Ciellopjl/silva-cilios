import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ mensaje: "Método não permitido" });
  }

  const { data } = req.query;

  if (!data || typeof data !== "string") {
    return res.status(400).json({ mensagem: "Data não fornecida" });
  }

  try {
    // Definir o início e fim do dia
    const startOfDay = new Date(`${data}T00:00:00`);
    const endOfDay = new Date(`${data}T23:59:59`);

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        dataHora: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: "cancelado",
        },
      },
      select: {
        dataHora: true,
      },
    });

    // Formatar horários ocupados (ex: ["09:00", "14:30"])
    const ocupados = agendamentos.map((ag) => {
      const date = new Date(ag.dataHora);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    return res.status(200).json(ocupados);
  } catch (error) {
    console.error("Erro ao buscar slots ocupados:", error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}
