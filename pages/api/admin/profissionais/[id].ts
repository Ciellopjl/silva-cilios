import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const { nome, especialidade, fotoUrl, ativo } = req.body;
    const profissional = await prisma.profissional.update({
      where: { id: id as string },
      data: { nome, especialidade, fotoUrl, ativo },
    });
    return res.status(200).json(profissional);
  }

  if (req.method === "DELETE") {
    await prisma.profissional.delete({
      where: { id: id as string },
    });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
