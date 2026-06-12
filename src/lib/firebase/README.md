# Firebase integration layer

Esta pasta é o ponto único de integração com Firebase. Toda a aplicação
consome dados através dos módulos abaixo — nunca diretamente.

- `config.ts` — inicialização do SDK (stub).
- `auth.ts` — sign in/up/reset/signOut. Hoje usa mock em `localStorage`.
- `firestore.ts` — CRUD por coleção (cursos, materiais, tarefas, metas,
  sessoes, revisoes, notificacoes). Hoje persiste em `localStorage`,
  mantendo a mesma assinatura que será usada com Firestore.
- `storage.ts` — upload/download de materiais (PDFs, vídeos). Stub.

Quando ativar Firebase, basta substituir o corpo das funções; nenhuma
tela ou hook precisa ser tocado.