import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const trabalhos = await prisma.trabalhoRealizado.findMany({
      where: { ativo: true },
      orderBy: { criadoEm: "desc" },
    });
    return res.status(200).json(trabalhos);
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
