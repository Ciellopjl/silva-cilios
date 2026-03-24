import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("admin123", 10);

  // Criar Admins autorizados (fallback caso não queira usar Google)
  for (const email of ["ciellolisboa023@gmail.com", "silvacilios082@gmail.com"]) {
    await prisma.usuario.upsert({
      where: { email },
      update: { papel: "admin" },
      create: {
        email,
        nome: "Admin Silva Cílios",
        senha: senhaHash,
        papel: "admin",
      },
    });
  }

  // Limpar dados existentes
  await prisma.servico.deleteMany({});
  await prisma.profissional.deleteMany({});
  await prisma.trabalhoRealizado.deleteMany({});

  // Criar Profissional Inicial
  await prisma.profissional.create({
    data: {
      id: "helena-silva",
      nome: "Helena Silva",
      especialidade: "Especialista em Cílios",
      fotoUrl: "/logo.png",
    }
  });

  // Criar o único serviço funcionando
  await prisma.servico.create({
    data: {
      id: "servico-tufinho",
      nome: "Extensão de Cílios (Tufinho)",
      preco: 100.0,
      duracaoMin: 90,
      descricao: "Aplicação de tufinhos para um olhar realçado com leveza e naturalidade.",
    },
  });

  console.log("Banco de dados populado com Profissional, Serviço e Admin. 🌸✨");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
