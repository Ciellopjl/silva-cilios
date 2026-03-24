# Silva Cílios — Sistema de Agendamento Premium

Sistema completo para gestão de atendimentos, catálogo de serviços e portfólio, desenvolvido com foco em alta performance e experiência de luxo para o usuário final e eficiência administrativa.

## 🚀 Tecnologias Utilizadas

### Core & Framework
- **Next.js (v16.2)**: Framework React para renderização híbrida (SSR/SSG), garantindo SEO otimizado e carregamento instantâneo.
- **TypeScript**: Linguagem base para garantir robustez, tipagem estática e manutenção segura do código.
- **React (v19)**: Biblioteca principal para construção da interface reativa e componentes modulares.

### Autenticação & Segurança
- **NextAuth.js**: Solução de autenticação completa com suporte a login via Google e persistência de sessão por 30 dias.
- **Bcrypt.js**: Criptografia de senhas para segurança de dados sensíveis.

### Banco de Dados & Gestão
- **Prisma ORM**: ORM moderno para interação segura e performática com o banco de dados.
- **SQLite**: Banco de dados relacional leve e eficiente para armazenamento local de agendamentos e registros.

### Estilização & UI/UX
- **Tailwind CSS (v4)**: Framework CSS utilitário para design responsivo, moderno e de fácil manutenção.
- **Framer Motion**: Biblioteca de animações fluidas para transições de menus e modais sem engasgos.
- **Lucide React**: Biblioteca de ícones vetoriais padronizados para uma interface limpa e profissional.
- **Cormorant Garamond & Inter**: Tipografia selecionada para transmitir elegância e legibilidade.

## 🛠️ Funcionalidades Principais

### Para o Cliente (Site Principal)
- **Agendamento Inteligente**: Fluxo passo a passo para seleção de serviço, profissional e horário.
- **Validação de Horários**: Bloqueio automático de slots ocupados e horários fora do expediente (foco no período vespertino).
- **Confirmação via WhatsApp**: Geração automática de mensagem estruturada com código de agendamento para contato direto.
- **Galeria de Trabalhos**: Portfólio dinâmico para visualização das técnicas realizadas.

### Para a Administração (Painel Admin)
- **Dashboard em Tempo Real**: Resumo de agendamentos diários, totais e estatísticas de clientes.
- **Gestão de Agendamentos**: Visualização em tabela (Desktop) ou Cards (Mobile) com alteração de status imediata.
- **Catálogo de Serviços**: CRUD completo para adicionar, editar ou remover serviços e preços.
- **Gestão de Equipe & Galeria**: Upload de imagens e controle de profissionais especialistas.
- **Totalmente Mobile-First**: Painel administrativo otimizado para gestão rápida diretamente do celular.

## 📈 Otimizações Sênior
- **SSR (Server-Side Rendering)**: Dados críticos buscados no servidor para eliminar delays de carregamento.
- **LCP Optimization**: Prioridade de renderização em imagens principais e recursos de "above-the-fold".
- **Persistência Reforçada**: Configuração de Cookies e JWT para evitar logins repetitivos.

---
Desenvolvido por **[ajucode](https://www.ajucode.com.br/)**
