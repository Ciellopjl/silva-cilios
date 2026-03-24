import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || (session.user as any).papel !== "admin") {
    return res.status(401).json({ message: "Não autorizado" });
  }

  const { id } = req.query;

  if (req.method === "DELETE") {
    await prisma.trabalhoRealizado.delete({
      where: { id: id as string },
    });
    return res.status(204).end();
  }

  res.setHeader("Allow", ["DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
