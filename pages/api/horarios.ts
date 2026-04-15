import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const horarios = await prisma.horarioFuncionamento.findMany({
      orderBy: { diaSemana: 'asc' }
    });

    // Se estiver vazio, vamos retornar um default para a UI saber como lidar (ou seeding vazio)
    // Inicialmente, devolve o que tem no banco.
    return res.status(200).json(horarios);
  } catch (error) {
    console.error("Erro ao buscar horários:", error);
    return res.status(500).json({ error: "Erro interno ao buscar horários." });
  }
}
