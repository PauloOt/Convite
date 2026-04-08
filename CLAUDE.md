# Projeto: Site de RSVP — Casamento Bruna & Rodrigo

## Status
Site completo e funcional. Todos os arquivos já foram criados.

---

## Evento

| Campo | Valor |
|---|---|
| **Noivos** | Bruna & Rodrigo |
| **Data** | Sábado, 16 de Janeiro de 2027 |
| **Horário** | 15:00 |
| **Verso bíblico** | "Para que todos vejam, e saibam, e considerem e juntamente entendam que a mão do Senhor fez isto." — Isaías 41:20 |

---

## Estrutura de Arquivos

```
D:\Bruna\
├── index.html       # Página pública de RSVP (hero + formulário)
├── obrigado.html    # Tela de agradecimento pós-confirmação
├── admin.html       # Painel administrativo (protegido por PIN)
├── style.css        # Todos os estilos globais
├── app.js           # Lógica do formulário, localStorage, WhatsApp
├── admin.js         # Lógica do painel admin
└── preview.webp     # Referência visual (save the date original)
```

---

## Identidade Visual Implementada

| Elemento | Detalhe |
|---|---|
| **Fundo** | Creme `#F6F1E7` |
| **Texto** | Quase preto `#1C1C1A` |
| **Acento** | Areia/dourado `#C4A882`, `#B8956A` |
| **Fonte cursiva** | *Great Vibes* (nomes dos noivos) |
| **Fonte serif** | *Cormorant Garamond* (números, itálicos) |
| **Fonte sans** | *Montserrat 300* (rótulos, caps espaçados) |
| **Decoração** | Capim-dos-pampas em SVG inline, fixo nos cantos superior-direito e inferior-esquerdo |
| **Sem moldura** | Layout de site (hero section), não cartão impresso |

---

## Layout das Páginas

### `index.html` — RSVP público
- **Hero section** (100vh): data pequena no topo, nomes grandes em cursiva, faixa de data (Sábado | 16 | 15:00), versículo, indicador de scroll
- **Seção de formulário**: campos de nome, acompanhantes (select), mensagem opcional, botão "Confirmar Presença" + link "Não poderei comparecer"

### `obrigado.html` — Agradecimento
- Mensagem personalizada com nome do convidado
- Texto diferente para confirmados vs. recusados
- Link para notificar a Bruna via WhatsApp

### `admin.html` — Painel
- PIN de entrada (ver configuração abaixo)
- Contador de pessoas totais confirmadas
- Placar confirmados × recusados
- Lista completa com nome, status, acompanhantes, data/hora e mensagem

---

## Configurações

### WhatsApp (`app.js`, linha 3)
```js
const WHATSAPP_NUMBER = '5511986755485';
```
Número da Bruna já configurado. Alterar se necessário.

### PIN do Admin (`admin.js`, linha 2)
```js
const ADMIN_PIN = '2027';
```

### Chave do localStorage (`app.js`, linha 6)
```js
const STORAGE_KEY = 'rsvp_bruna_rodrigo';
```

---

## Como os Dados Fluem

1. Convidado preenche o formulário em `index.html`
2. `app.js` salva a entrada no `localStorage` (chave `rsvp_bruna_rodrigo`)
3. Os dados da resposta mais recente são passados via `sessionStorage` para `obrigado.html`
4. `obrigado.html` exibe mensagem personalizada + link WhatsApp para a Bruna
5. `admin.html` lê todo o `localStorage` e exibe o painel completo

---

## Estrutura de cada entrada no localStorage

```json
{
  "id": 1700000000000,
  "name": "Nome do Convidado",
  "guests": 1,
  "message": "Mensagem opcional",
  "confirmed": true,
  "createdAt": "2026-11-15T14:30:00.000Z"
}
```

---

## Stack

- HTML + CSS + JavaScript puro (sem frameworks)
- Persistência: `localStorage` do navegador
- Notificação: link `wa.me` nativo (sem APIs pagas)
- Fontes: Google Fonts (Great Vibes, Cormorant Garamond, Montserrat)
- Hospedagem sugerida: qualquer hosting estático (Netlify, GitHub Pages, Vercel)

---

## O que NÃO alterar sem necessidade

- A paleta de cores — é fiel ao save the date
- As fontes — definem toda a estética boho
- O SVG do capim-dos-pampas — foram desenhados manualmente com coordenadas calculadas
- A estrutura de hero section (não voltar para o layout de cartão com moldura)

---

## Referência Visual

Ver `preview.webp` para referência de paleta, tipografia e decoração do save the date original.
