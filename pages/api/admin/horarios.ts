import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  if (req.method === "GET") {
    const horarios = await prisma.horarioFuncionamento.findMany({
      orderBy: { diaSemana: 'asc' }
    });
    // Se não houver, retorna defaults para o front
    if (horarios.length === 0) {
      const defaults = Array.from({length: 7}).map((_, i) => ({
        diaSemana: i,
        abertura: "09:00",
        fechamento: "18:00",
        ativo: i >= 1 && i <= 5 // Seg a Sex ativo por padrão
      }));
      return res.status(200).json(defaults);
    }
    return res.status(200).json(horarios);
  }

  if (req.method === "POST") {
    const { horarios } = req.body; // array de { diaSemana, abertura, fechamento, ativo }

    if (!Array.isArray(horarios)) {
       return res.status(400).json({ error: "Formato inválido" });
    }

    try {
      // Deleta todos e insere (modo fácil de replace all)
      await prisma.$transaction(async (tx) => {
        await tx.horarioFuncionamento.deleteMany({});
        await tx.horarioFuncionamento.createMany({
           data: horarios.map((h: any) => ({
              diaSemana: h.diaSemana,
              abertura: h.abertura,
              fechamento: h.fechamento,
              ativo: h.ativo
           }))
        });
      });

      return res.status(200).json({ message: "Horários atualizados com sucesso" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao salvar horários" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
