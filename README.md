# FuteMAX Clean Player

App para assistir futebol ao vivo sem propagandas, com suporte a múltiplas fontes e lista de jogos do dia.

## Como usar localmente (testar antes de publicar)

```bash
python3 -m http.server 8080
# Abra http://localhost:8080/ no Chrome
```

## Como publicar no GitHub Pages

1. Crie um repositório público no GitHub (ex: `futemax-clean-player`)
2. Faça upload de todos os arquivos deste zip para o repo (ou use `git push`)
3. No repo: **Settings** → **Pages** → em "Source" escolha `Deploy from a branch`
4. Selecione `main` branch e pasta `/root` → clique **Save**
5. Aguarde 1-2 minutos — o link `https://SEU_USUARIO.github.io/futemax-clean-player/` vai funcionar

## Estrutura de arquivos

```
├── index.html          # Página principal (renomeada de futemax-clean-player.html)
├── manifest.json       # Configuração PWA
├── sw.js              # Service Worker
└── icons/             # Ícones do app
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-180.png
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-192.png
    └── icon-maskable-512.png
```

## Recursos

- ✅ Player clean sem propagandas
- ✅ Suporte a 7+ fontes de players (futemax, multicanais, etc.)
- ✅ Lista de jogos do dia automática
- ✅ Botão "Enviar para TV" com QR Code
- ✅ PWA instalável no Chrome (PC e Android)
- ✅ Funciona offline (após primeiro acesso)
- ✅ Histórico de jogos recentes

## Como instalar o app

Depois de publicado no GitHub Pages, abra a URL no Chrome:
- **Desktop**: clique no botão "Instalar app" no header, ou menu ⋮ → "Instalar página como aplicativo..."
- **Android (Chrome)**: menu ⋮ → "Adicionar à tela inicial"

Pronto! Vai aparecer um ícone "F" verde na sua tela inicial / Launchpad.
