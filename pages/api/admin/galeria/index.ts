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
    const trabalhos = await prisma.trabalhoRealizado.findMany({
      orderBy: { criadoEm: "desc" },
    });
    return res.status(200).json(trabalhos);
  }

  if (req.method === "POST") {
    const { titulo, fotoUrl } = req.body;
    const trabalho = await prisma.trabalhoRealizado.create({
      data: { titulo, fotoUrl },
    });
    return res.status(201).json(trabalho);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
