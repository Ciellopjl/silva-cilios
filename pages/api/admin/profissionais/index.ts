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
    const profissionais = await prisma.profissional.findMany({
      orderBy: { criadoEm: "desc" },
    });
    return res.status(200).json(profissionais);
  }

  if (req.method === "POST") {
    const { nome, especialidade, fotoUrl } = req.body;
    const profissional = await prisma.profissional.create({
      data: { nome, especialidade, fotoUrl: fotoUrl || "/logo.png" },
    });
    return res.status(201).json(profissional);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
