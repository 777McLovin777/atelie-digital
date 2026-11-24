# Ateliê Digital · Vitrine pública

Cópia portátil da vitrine independente. Use Node.js 24 e npm em um ambiente autorizado.

1. SHA256SUMS.txt permanece como evidência histórica da transferência; não o atualize para refletir mudanças posteriores.
2. Execute npm ci, npm test e npm run build:vitrine.
3. npm run build:vitrine executa a auditoria do pacote e atualiza SHA256SUMS.vitrine-build.txt com os hashes dos arquivos compilados atuais.
4. Execute npm run audit:vitrine para repetir a verificação do pacote e regenerar o manifesto de build.

5. A vitrine usa URLs limpas (`/`, `/projetos`, `/estudio`, `/servicos` e `/contato`). O build gera documentos estáticos para cada página e para cada detalhe de projeto autorizado, mantendo o `404.html` dedicado para caminhos desconhecidos.

O acervo mostra projetos demonstrativos e capas gráficas. Os canais comerciais são mantidos em `vitrine/content.js`. A tipografia usa Google Fonts, com fontes de sistema como fallback.
