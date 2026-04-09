# Projeto: Site de RSVP — Casamento Bruna & Rodrigo

## Status
Site completo, em produção no GitHub Pages.
Repositório: https://github.com/PauloOt/ConviteBruna

---

## Evento

| Campo | Valor |
|---|---|
| **Noivos** | Bruna & Rodrigo |
| **Data** | Sábado, 16 de Janeiro de 2027 |
| **Horário** | 15:00 |
| **Local** | Cotia · SP (endereço completo no convite) |
| **Verso bíblico** | "Para que todos vejam, e saibam, e considerem e juntamente entendam que a mão do Senhor fez isto." — Isaías 41:20 |

---

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (utilitários + classes customizadas em `src/index.css`)
- **React Router v6** com `HashRouter` (compatível com GitHub Pages sem config de servidor)
- **Google Sheets** como banco de dados via **Google Apps Script** Web App
- **SheetJS (xlsx 0.18.5)** para exportação
- Fontes: Google Fonts — Great Vibes, Cormorant Garamond, Montserrat

---

## Estrutura de Arquivos

```
D:\Bruna\
├── index.html              # Entrada do Vite
├── apps-script.gs          # Código do Google Apps Script (copiar no GAS editor)
├── vite.config.js          # base: './' para GH Pages
├── tailwind.config.js      # Cores e fontes customizadas
├── postcss.config.js
├── package.json            # Script "deploy" usa gh-pages
├── preview.webp            # Referência visual do save the date
└── src/
    ├── main.jsx
    ├── App.jsx             # Rotas: / | /obrigado | /admin
    ├── index.css           # Tailwind + classes globais (input-line, btn-primary, fade-up…)
    ├── components/
    │   └── PampasDecor.jsx # SVG decorativo nos cantos (fixo, responsivo)
    ├── pages/
    │   ├── RSVP.jsx        # Hero + formulário de confirmação
    │   ├── Obrigado.jsx    # Tela pós-confirmação
    │   └── Admin.jsx       # Painel protegido por PIN
    └── utils/
        ├── api.js          # submitRSVP() e fetchRSVPs() — integração Google Sheets
        ├── storage.js      # helpers localStorage (legado, não usado nas páginas principais)
        └── exportXlsx.js   # Exportação XLSX via SheetJS
```

---

## Rotas

| Rota | Página |
|---|---|
| `/#/` | Formulário de RSVP público |
| `/#/obrigado` | Agradecimento pós-confirmação |
| `/#/admin` | Painel administrativo (PIN: `2027`) |

---

## Identidade Visual

| Elemento | Valor |
|---|---|
| **Fundo** | Creme `#F6F1E7` |
| **Texto principal** | `#1C1C1A` |
| **Dourado (texto)** | `#7A5C32` — valor em `tailwind.config.js` como `sand2` |
| **Dourado (decoração)** | `#C4A882` — `sand` |
| **Fonte cursiva** | *Great Vibes* — nomes dos noivos |
| **Fonte serif** | *Cormorant Garamond* — números, itálicos |
| **Fonte sans** | *Montserrat 300* — labels, botões |
| **Decoração** | Capim-dos-pampas em SVG inline, fixo nos cantos (classe `.pampas-svg`) |
| **Grain** | Textura sutil via `body::after` com SVG de ruído (opacity 3.5%) |

> **Não alterar** a paleta, as fontes nem o SVG dos pampas sem necessidade — são fiéis ao save the date original (`preview.webp`).

---

## Formulário de RSVP (`RSVP.jsx`)

Campos:
1. **Nome completo** + **Idade** (na mesma linha — `flex`, campo de idade `w-[76px]`)
2. **Acompanhantes** (select 0–5)
3. Para cada acompanhante: **Nome** + **Idade** (mesma linha, indent com borda esquerda)

Inputs:
- `type="number" inputMode="numeric" pattern="[0-9]*"` nos campos de idade → teclado numérico no celular
- Setas do `type=number` removidas via CSS (`-webkit-appearance: none`)
- `min-height: 48px` em todos os inputs e botões (touch targets)
- Animação de foco: barra `.focus-bar` escala da esquerda via `scaleX`

---

## Integração Google Sheets

**Arquivo de configuração:** `src/utils/api.js`

```js
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec'
```

**Fluxo POST (confirmação):**
- `fetch` com `mode: 'no-cors'` — sem preflight CORS, dados chegam na planilha
- Navegação para `/obrigado` acontece imediatamente (fire-and-forget)

**Fluxo GET (admin):**
- `fetch` normal com `?pin=2027` na query string
- O Apps Script valida o PIN antes de retornar os dados
- Admin mostra loading, erro com botão "Tentar novamente" e botão "↻ Atualizar lista"

**Apps Script (`apps-script.gs`):**
- `doPost(e)` — recebe JSON, grava linha na aba "RSVPs"
- `doGet(e)` — valida PIN, retorna array JSON de todas as respostas
- Cria cabeçalho automaticamente na primeira execução
- Deploy: *Execute as: Me / Who has access: Anyone*

---

## Estrutura de cada entrada no Google Sheets

| Coluna | Conteúdo |
|---|---|
| ID | `Date.now()` timestamp |
| Nome | Nome completo |
| Idade | Número ou vazio |
| Status | `Confirmado` ou `Recusou` |
| Acompanhantes | Número (0–5) |
| Detalhes Acomp. | `"Nome (idade), Nome (idade)"` |
| Data/Hora | Horário de Brasília |

---

## Painel Admin (`Admin.jsx`)

- PIN local: `'2027'` (constante `ADMIN_PIN`)
- PIN também validado no Apps Script (dupla proteção)
- Exibe: contador total de pessoas, cards confirmados vs recusados
- Cada card tem borda colorida: verde = confirmado, vermelho = recusou
- Botão **Exportar como XLSX** — gera `confirmacoes-bruna-rodrigo.xlsx` com duas abas
- Sessão mantida via `sessionStorage` enquanto o browser estiver aberto

---

## Deploy

```bash
npm run dev        # desenvolvimento local
npm run build      # gera pasta dist/
npm run deploy     # build + push para branch gh-pages (usa pacote gh-pages)
```

GitHub Pages configurado em: **Settings → Pages → Branch: gh-pages / (root)**

URL publicada: `https://pauloot.github.io/ConviteBruna/`

---

## PIN do Admin

```
2027
```

Está hardcoded em dois lugares — alterar em ambos se quiser mudar:
1. `src/pages/Admin.jsx` → constante `ADMIN_PIN`
2. `apps-script.gs` → constante `ADMIN_PIN`
