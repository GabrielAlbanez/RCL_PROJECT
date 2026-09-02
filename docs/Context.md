# Contexto Completo do Projeto — Royal City Labs + VLibras

---

## 1. IDENTIDADE DO PROJETO

| Atributo | Valor |
|----------|-------|
| **Nome** | Royal City Labs — Site Redesign Prototype |
| **Tipo** | Next.js App Router (Next 16, React 19) |
| **Branch atual** | `fix/site-audit-routing-seo-photos` |
| **Repo** | `c:\Users\gabri\RCL_PROJECT` |
| **Data** | 2026-09-02 |
| **Autor (git)** | Gabriel Albanez |

---

## 2. OBJETIVO DO PROJETO (README.md)

> "Next.js App Router prototype for Royal City Labs, based on the supplied institutional summary and 2026 brand guideline."

- **Marca**: Royal City Labs (Canadá — engenharia industrial, automação, IIoT, controle de processos)
- **Público-alvo**: Canadá (principalmente anglófono e francófono)
- **Idiomas no site**: `en` (inglês) e `fr` (francês) — definido em `lib/content.ts`

---

## 3. SISTEMA DE CORES (Brand — globals.css)

| Token | Hex | Uso |
|-------|-----|-----|
| `--primary` | `#042D7B` | Azul principal (logo, headers) |
| `--orange` | `#D95F0F` | Acento laranja (CTAs, highlights) |
| `--cyan` | `#2AA8FF` | Acento azul (links, tags) |
| `--sub` | `#A7B0BA` | Subtexto |
| `--ink` | `#2F4357` | Texto principal |
| `--paper` | `#F5F7FA` | Fundo |

---

## 4. ESTRUTURA DE ARQUIVOS

```
RCL_PROJECT/
├── app/
│   ├── [locale]/layout.tsx      # Layout por idioma (en/fr)
│   ├── [locale]/page.tsx         # Páginas dinâmicas
│   ├── globals.css               # Estilos globais
│   ├── robots.ts                 # SEO robots
│   └── sitemap.ts                # Sitemap
├── components/
│   ├── VLibras.tsx               # Widget VLibras (Libras/PT-BR)
│   ├── Header.tsx                # Header com nav
│   ├── Footer.tsx                # Footer
│   ├── TeamCard.tsx              # Card de membro
│   ├── ContactForm.tsx           # Formulário de contato
│   ├── ThreeScene.tsx            # Hero 3D (React Three Fiber)
│   ├── Logo.tsx                  # Logo SVG (recriado com CSS)
│   └── ...
├── lib/
│   ├── content.ts                # Conteúdo traduzido (en/fr)
│   ├── team.ts                   # Dados da equipe + COMPANY_LINKEDIN
│   ├── lead-form.ts              # Contrato do formulário (client + server)
│   ├── leads.ts                  # Validação/anti-spam/entrega (SERVER ONLY)
│   └── actions/contact.ts        # Server Action do formulário
├── public/
├── docs/
│   └── VLibras-Context.md        # Este arquivo
├── .env.example                  # Variáveis de entrega do formulário
├── proxy.ts                      # Redireciona / → /en ou /fr
├── next.config.ts                # Next 16 config
├── package.json                  # Dependências
└── README.md                     # Descrição do projeto
```

---

## 5. LINGUAGENS E LOCALES

| Locale | Idioma | URL | Ativo? |
|--------|--------|-----|--------|
| `en` | Inglês (Canadá) | `/en` | ✅ Sim |
| `fr` | Francês (Canadá) | `/fr` | ✅ Sim |
| `pt-BR` (implícito) | Português (Brasil) | Não existe no site | ⚠️ Só via VLibras widget |

> **Nota crítica:** O site usa apenas `en` e `fr`. Não existe versão `pt-BR`. O widget VLibras (Libras) só faz sentido para falantes de português brasileiro, mas está renderizado para todos os locales (`en` e `fr`).

---

## 6. ROTEAMENTO E PROXY

- `proxy.ts` redireciona `/` para `/en` ou `/fr` com base no header `accept-language`.
- `locales` é definido como `['en', 'fr']` em `lib/content.ts`.
- O `generateStaticParams({})` no layout retorna todos os locales para geração estática.

---

## 7. COMPONENTE VLibras — HISTÓRICO COMPLETO

### 7.1 O que é

O `components/VLibras.tsx` carrega dinamicamente o script do VLibras (`vlibras.gov.br/app/vlibras-plugin.js`) e renderiza a estrutura HTML que o plugin espera para criar o widget flutuante de Libras.

### 7.2 Atributos customizados usados pelo VLibras

O plugin JavaScript do VLibras usa esses atributos (não são HTML padrão) para identificar elementos:

| Atributo | Função no widget |
|----------|------------------|
| `vw` | Marca o container principal do widget |
| `access-button` | Botão flutuante de acesso |
| `access-content` | Área do conteúdo traduzido |
| `access-window` | Janela do avatar/tradutor |
| `access-button-access` | Botão de acessibilidade |
| `access-ruby` | Seção de ruby (anotações fonéticas) |

### 7.3 Problemas enfrentados

#### Problema 1: Erro TypeScript (`Property 'vw' does not exist`)
- **Arquivo afetado:** `components/VLibras.tsx`
- **Causa:** React/TypeScript não reconhece atributos HTML customizados.
- **Solução aplicada:** `declare module 'react'` estendendo `HTMLAttributes<T>` com `vw?: string` e todos os outros.

#### Problema 2: Warning no console (`Received 'true' for non-boolean attribute`)
- **Arquivo afetado:** `components/VLibras.tsx`
- **Causa:** `vw={true}` passa booleano; o React avisa que o DOM espera string para atributos customizados.
- **Solução aplicada:** `vw="true"`, `access-button="true"`, etc.

#### Problema 3: Widget não aparecia visualmente
- **Arquivo afetado:** `app/[locale]/layout.tsx`
- **Causa:** `VLibras` estava importado (`import VLibras from ...`) mas nunca era colocado no JSX (`<VLibras />` faltava no `return` do layout).
- **Solução aplicada:** Adicionado `<VLibras />` antes de `</body>`.

### 7.4 Estado atual do componente (VLibras.tsx)

```
'use client';
import { useEffect, useRef } from 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    vw?: string;
    'access-button'?: string;
    'access-content'?: string;
    'access-window'?: string;
    'access-button-access'?: string;
    'access-ruby'?: string;
  }
}

export default function VLibras() {
  const initialized = useRef(false);
  useEffect(() => {
    // Carrega script vlibras.gov.br/app/vlibras-plugin.js
    // Inicializa widget com new window.VLibras.Widget('...')
  }, []);

  return (
    <div vw="true" className="enabled">
      <div access-button="true" />
      <div access-content="true">
        <div access-window="true" />
        <div access-button-access="true" />
        <div access-ruby="true" />
      </div>
    </div>
  );
}
```

### 7.5 Limitação fundamental do VLibras

O VLibras é **exclusivamente para português brasileiro (Libras)**. Não existe versão oficial para:

- Inglês (ASL — American Sign Language)
- Francês (LSF — Langue des Signes Française)

Portanto, no site atual (`en` e `fr` apenas), o widget VLibras aparece mas não tem utilidade prática para o público canadense (anglófono/francófono).

---

## 8. COMPONENTES CHAVE

| Componente | Responsabilidade | Estado |
|------------|-------------------|--------|
| `Header` | Nav + logo + toggle de idioma | ✅ OK |
| `Footer` | Links de contato + direitos | ✅ OK |
| `ContactForm` | Formulário funcional (Server Action + validação + entrega plugável) | ✅ Funcionando |
| `TeamCard` | Card de membro com foto (placeholder) + botão LinkedIn | ⚠️ Fotos placeholder |
| `TeamSection` | Grid de membros | ✅ OK |
| `ThreeScene` | Hero 3D (React Three Fiber + Drei) | ✅ OK |
| `Logo` | Logo SVG recreado com CSS (brand palette) | ⚠️ Substituir por vetor oficial |
| `VLibras` | Widget Libras (PT-BR) | ⚠️ Só faz sentido em pt-BR |

---

## 9. PROBLEMAS IDENTIFICADOS NO GIT STATUS / COMMITS RECENTES

Commits na branch atual (`fix/site-audit-routing-seo-photos`):

| Hash | Mensagem | Impacto |
|------|----------|---------|
| `3cc953d` | fixed imagens source | Foto placeholders |
| `e9d7235` | feat(team): add LinkedIn links | Links no perfil |
| `c486a31` | fix(routing): redirect / to /en or /fr via proxy | Redirecionamento |
| `5368125` | feat(team): wire in generated generic placeholder photos | Fotos |
| `795c6d4` | fix: html lang, per-page metadata, dead lint tooling, i18n nav, mobile scroll | Ajustes gerais |

---

## 10. OUTRAS WARNINGS NO CONSOLE

Além do VLibras (`vw`, `access-*`), existe outra warning:

```
[browser] Detected scroll-behavior: smooth on <html> element.
Add data-scroll-behavior="smooth" to disable smooth scrolling during route transitions.
```

**Arquivo afetado:** `app/globals.css` (linha `html{scroll-behavior:smooth}`)

**Impacto:** Apenas informativa. Não quebra a página.

**✅ Corrigido:** `data-scroll-behavior="smooth"` adicionado ao `<html>` em `app/[locale]/layout.tsx`.

---

## 11. DECISÕES PENDENTES (DO USUÁRIO)

### 11.1 VLibras — Manter ou remover?

O usuário questionou:

> "Não tem um vlibras para linguas en-fr?"

A resposta é **não**. O VLibras é exclusivamente para Libras (português brasileiro). Não existe widget oficial para ASL (inglês) ou LSF (francês).

**Opções para o usuário decidir:**

| Opção | Ação | Impacto |
|-------|------|---------|
| A | Remover `<VLibras />` do layout (`app/[locale]/layout.tsx`) e excluir `components/VLibras.tsx` | Limpa o site; elimina warnings do console; adequado para público canadense |
| B | Manter VLibras mas renderizar **condicionalmente** (apenas se locale = `pt-BR`) | Requer adicionar `pt-BR` aos locales; não resolve o problema fundamental |
| C | Manter como está (visível em `en` e `fr`) | Não faz sentido para o público; mantém warnings; widget não funciona para inglês/francês |

### 11.2 Fotos de equipe (TeamCard)

- As fotos são **placeholders genéricos** (`generated generic placeholder photos`).
- Substituir por fotos reais quando aprovadas.

### 11.3 Logo

- O logo atual é uma **recriação leve em CSS** usando a paleta de marca.
- Substituir por vetor oficial quando fornecido.

### 11.4 Formulário de contato — ✅ IMPLEMENTADO

O formulário deixou de ser mock. Arquitetura:

| Arquivo | Responsabilidade |
|---------|------------------|
| `lib/lead-form.ts` | Contrato compartilhado client/server (tipos, valores do select, limites de tamanho). Sem APIs de Node — é bundlado para o browser. |
| `lib/leads.ts` | **Server only**: validação, rate limit e entrega. Importar isso de um Client Component quebra o build. |
| `lib/actions/contact.ts` | Server Action (`'use server'`) — único export assíncrono. |
| `components/ContactForm.tsx` | `useActionState` + `useFormStatus`: erros inline por campo, estado "enviando", painel de sucesso. |
| `.env.example` | Documenta as variáveis de entrega. |

Comportamento:

- **Validação server-side** de todos os campos (o `required`/`type=email` do browser é só conveniência). O select usa valores independentes de idioma (`downtime`, `legacy`, …) validados contra uma allow-list — valor adulterado é rejeitado.
- **Anti-spam**: honeypot (campo oculto `website`) + rate limit de 5 envios / 10 min por IP (em memória; trocar por Redis/KV se escalar horizontalmente).
- **Erros preservam o que foi digitado** e são anunciados via `aria-invalid` / `aria-describedby`; mensagens traduzidas em `lib/content.ts` (en/fr).
- **Funciona sem JavaScript** (progressive enhancement do Server Action).

Entrega plugável, por ordem de prioridade:

1. `CONTACT_WEBHOOK_URL` → POST JSON do lead (Zapier, Make, n8n, Slack, CRM).
2. `RESEND_API_KEY` + `CONTACT_TO_EMAIL` → email via API REST do Resend (sem SDK).
3. Nada configurado → **modo protótipo local**: loga e grava em `.data/leads.jsonl`; o painel de sucesso mostra uma nota de desenvolvedor dizendo que nenhum endpoint está configurado (não finge que enviou email).

**Pendência restante:** escolher webhook ou Resend com o cliente e definir a variável em `.env.local`. Nada de código é necessário.

⚠️ **Armadilha encontrada e corrigida** (não reintroduzir): passar argumento via `submitLead.bind(null, locale)` faz o React serializar a ação como payload `$ACTION_REF`, que **travava indefinidamente** o POST sem JavaScript e derrubava o servidor inteiro. O locale agora vai por `<input type="hidden" name="locale">` e é sanitizado no servidor.

### 11.5 LinkedIn dos colaboradores

- Botão discreto abaixo de cada card da equipe (`components/TeamSection.tsx`, estilo `.team-linkedin`).
- Como não há perfis pessoais ainda, `getTeam()` cai no fallback `COMPANY_LINKEDIN` (`lib/team.ts`) — antes era `#`, que abria uma página aleatória do site em nova aba.
- ⚠️ **A URL da empresa não pôde ser verificada** (o site atual não expõe LinkedIn). Confirmar `COMPANY_LINKEDIN` com o cliente: slug errado = 404 do LinkedIn. Ao receber os perfis reais, basta preencher `linkedin` em cada membro.

---

## 12. COMANDOS ÚTEIS

```bash
# Instalar dependências
npm install

# Dev server
npm run dev

# Build de produção
npm run build

# Lint
npm run lint
```

---

## 13. FONTES E REFERÊNCIAS

- [VLibras — Governo Federal](https://www.gov.br/governadigital/pt-br/vlibras)
- [Documentação VLibras](https://www.gov.br/governadigital/pt-br/vlibras/documentacao)
- [NPM react-vlibras](https://www.npmjs.com/package/react-vlibras)
- [Next.js Docs — App Router](https://nextjs.org/docs/app)
- [React 19 Types](https://react.dev/reference/react)

---

*Documento gerado automaticamente — contém contexto completo do projeto Royal City Labs (site + componente VLibras) com histórico de problemas, soluções aplicadas, decisões pendentes e referências.*
