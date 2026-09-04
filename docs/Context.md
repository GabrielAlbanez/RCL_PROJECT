# Contexto Completo do Projeto — Royal City Labs

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
│   └── Context.md                # Este arquivo
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

> **Nota:** O site usa apenas `en` e `fr`. Não existe versão `pt-BR`.

---

## 6. ROTEAMENTO E PROXY

- `proxy.ts` redireciona `/` para `/en` ou `/fr` com base no header `accept-language`.
- `locales` é definido como `['en', 'fr']` em `lib/content.ts`.
- O `generateStaticParams({})` no layout retorna todos os locales para geração estática.

---

## 7. VLibras — REMOVIDO

O widget VLibras (`components/VLibras.tsx` + `<VLibras />` no layout) foi **removido do projeto**.

**Motivo:** o VLibras é um serviço do governo brasileiro, exclusivo para Libras (Língua Brasileira de Sinais / português brasileiro). Não existe versão oficial para ASL (inglês) nem LSF (francês). O cliente é canadense e o site serve apenas `en` e `fr`, então o widget não tinha utilidade prática para o público — apenas carregava um script externo de `vlibras.gov.br` e gerava warnings no console.

**O que foi removido:**

- `components/VLibras.tsx` (excluído)
- `import VLibras` e `<VLibras />` em `app/[locale]/layout.tsx`

Junto com o componente saíram os atributos customizados (`vw`, `access-*`), o `declare module 'react'` que os tipava e o script externo do gov.br.

---

## 8. COMPONENTES CHAVE

| Componente | Responsabilidade | Estado |
|------------|-------------------|--------|
| `Header` | Nav + logo + toggle de idioma | ✅ OK |
| `Footer` | Links de contato + direitos | ✅ OK |
| `ContactForm` | Formulário funcional (Server Action + validação + entrega plugável) | ✅ Funcionando |
| `TeamCard` | Card de membro com foto (placeholder) + botão LinkedIn | ⚠️ Fotos placeholder |
| `TeamSection` | Grid de membros | ✅ OK |
| `ThreeScene` | Hero 3D — **Control Stack** (ver §14) | ✅ OK |
| `Logo` | Logo SVG recreado com CSS (brand palette) | ⚠️ Substituir por vetor oficial |

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

Warning restante:

```
[browser] Detected scroll-behavior: smooth on <html> element.
Add data-scroll-behavior="smooth" to disable smooth scrolling during route transitions.
```

**Arquivo afetado:** `app/globals.css` (linha `html{scroll-behavior:smooth}`)

**Impacto:** Apenas informativa. Não quebra a página.

**✅ Corrigido:** `data-scroll-behavior="smooth"` adicionado ao `<html>` em `app/[locale]/layout.tsx`.

---

## 11. DECISÕES PENDENTES (DO USUÁRIO)

### 11.1 VLibras — ✅ RESOLVIDO (removido)

Decidido remover o widget: serviço do governo brasileiro, exclusivo para Libras/pt-BR, sem equivalente para ASL ou LSF, e o cliente é canadense (`en`/`fr`). Ver seção 7.

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

- [Next.js Docs — App Router](https://nextjs.org/docs/app)
- [React 19 Types](https://react.dev/reference/react)

---

## 14. OBJETO 3D DO HERO — REDESIGN "CONTROL STACK"

### 14.1 Por que mudou

A cena anterior (`DetailedProcessUnit`) era uma **célula de processo industrial literal**: vaso de
pressão com impeller, bomba/motor, volante de válvula, manômetro com ponteiro, painel elétrico com
IHM, flanges parafusados e tubulação, tudo com textura de aço escovado. Ela lia como *"vendemos essa
peça"* — comunicava a **matéria-prima do cliente**, não a **inteligência que a RCL entrega**. A RCL
vende serviço de engenharia B2B: não vende máquina, peça nem hardware.

Achado adicional durante o redesign: a cena antiga usava **~85 hexadecimais hardcoded**
(`#C8D5DF`, `#E96A19`, `#168CD7`, `#722000`, `#70BEEA`…), **nenhum deles token**. Era a causa real de
o hero não parecer do mesmo sistema visual que `.problem-card` ou `.method-grid`. Aço fotorrealista é
o que força hexes inventados; sem aço, a deriva não tem como voltar.

### 14.2 O conceito

Quatro lajes finas empilhadas e escalonadas em profundidade — **FIELD**, **CONTROL**, **NETWORK**,
**ANALYTICS** (modelo Purdue / ISA-95, que é como um diretor de engenharia pensa). FIELD é a planta
que o cliente já tem: opaca, em `--ink`, com grade interrompida. As outras três **chegam** por cima
dela conforme o scroll. Nada tem forma de equipamento.

O gesto narrativo é **chegada, não iluminação**: cada laje espera fora de registro em XZ, à deriva e
levemente rotacionada, até seu estágio a **travar** em posição. Uma laje vira quatro — "desordem →
sistema" é aritmética que o visitante conta, não um efeito de luz que alguém precisa explicar.

### 14.3 Regra de cor (importante — não violar)

**Laranja significa exatamente uma coisa: o passo que está sendo descrito agora.** Só três elementos
o usam — o tick de estágio na placa-base, o bracket de foco na laje ativa e a sonda de diagnóstico.
Mais nada. Estrutura é `--primary`, sinal vivo é `--cyan`, a planta não instrumentada é `--ink`,
hairlines e camadas pendentes são `--sub`. `--maple` não aparece.

Todos os valores vêm de `CSS_TOKEN` no topo de `ThreeScene.tsx`, copiado de
`app/styles/tokens.css`. **Nenhum hex novo.** Materiais usam esses valores ou uma mistura de dois
deles via `THREE.Color.lerp`.

### 14.4 Como os processos são enfatizados

| Mecanismo | O que faz |
|---|---|
| **Chegada da laje** | A laje viaja de fora de registro até travar — translação visível, não fade. |
| **Flash de travamento** | No instante do encaixe a aresta clareia para branco e decai (`flash` em `StackLayer`). |
| **Bracket de foco** | Quatro cantoneiras laranja que cavalgam até a laje do estágio atual. |
| **Câmera** | O `lookAt` segue a laje descrita — o assunto da copy é o assunto do quadro. |
| **Índice de 5 passos** | Cinco ticks na placa-base: feito (cyan), aqui (laranja), a fazer (sub). |
| **Risers e pulsos** | Só existem entre lajes travadas; o tráfego acelera conforme a pilha entra em operação. |
| **Readout por laje** | Cada face carrega um tipo de trabalho diferente: grade legada esburacada, programa de controle (trilhos + degraus com contatos), grafo de roteamento, tendência ascendente. |
| **Overlay HTML** | `.three-detail-index` virou 4 pastilhas ANALYTICS→FIELD (de cima para baixo, na mesma ordem da pilha), com estados `is-set` / `is-live`. |
| **Contador na legenda** | `.three-caption` mostra `NN / 05`, com o número em laranja. |

### 14.5 Mapa estágio → laje

| Estágio | Copy (`HeroExperience.tsx`) | Laje | O que acontece |
|---|---|---|---|
| 0 | AUDIT | FIELD | Só FIELD existe. Três lajes-fantasma desalinhadas. |
| 1 | DIAGNOSE | FIELD | Sonda laranja desce e acende o nó de falha (`FAULT_NODE`). |
| 2 | AUTOMATE | CONTROL | CONTROL trava. Risers FIELD→CONTROL acendem. |
| 3 | CONNECT | NETWORK | NETWORK trava. Malha de roteamento aparece, pulsos sobem. |
| 4 | OPTIMIZE | ANALYTICS | ANALYTICS trava. Curva ascendente. Laranja recolhe ao tick. |

AUDIT e DIAGNOSE agem os dois sobre FIELD — o audit revela a planta, o diagnóstico acha a falha
dentro dela. Daí `STAGE_LAYER = [0, 0, 1, 2, 3]`.

### 14.6 Contratos preservados (não quebrar)

- Props de `ThreeScene`: `{ locale, scrollProgress, activeStage }` — **inalteradas**.
- `scrollProgress` é lido **dentro do `useFrame`** (ref). O estágio é derivado de
  `stageFromProgress()`, que espelha `boundaries` em `HeroExperience.tsx` — **se um dos dois mudar,
  mude o outro**, senão copy e cena dessincronizam.
- `frameloop: 'demand'` fora da viewport e em modo estático; `dpr` limitado (`1` em compact).
- **Armadilha do modo estático:** com `frameloop: 'demand'` só **um** frame renderiza, e
  `THREE.MathUtils.damp` com `delta ≈ 0` não converge — todo valor animado ficaria no estado
  inicial. Por isso existe `approach(current, target, lambda, delta, snap)`: com `snap` verdadeiro
  ela devolve o alvo direto. **Todo valor animado novo tem que passar por `approach`**, ou vai
  aparecer errado em `prefers-reduced-motion` e em ≤700px.
- `role="img"` + `aria-label` traduzido no shell; overlays com `aria-hidden`.
- Zero dependência nova. Geometria procedural + `CanvasTexture`; texturas descartadas em
  `useStackTextures`.

### 14.7 Orçamento

~27 draw calls e <3k triângulos (orçamento era ≤60 e ≤40k). Sem `transmission`, sem `clearcoat`,
sem bump map, sem centenas de matrizes de instância por frame.

### 14.8 O que foi removido do arquivo

`BoltRing`, `Impeller`, `PressureGauge`, `ValveWheel`, `ProcessFlowParticles`, `AuditScanner`,
`ProcessVessel`, `PipeRun`, `PumpMotor`, `ControlCabinet`, `ControlBase`, `SupportFrame`,
`SignalParticles`, `SensorNetwork`, `DiagnosticHotspots`, `NarrativeLighting`,
`DetailedProcessUnit`, `createSurfaceTexture`, `createScreenTexture`, `useIndustrialTextures`,
`ROOT_HOME_TRANSFORMS`, `ASSEMBLY_TRANSFORMS`, `NARRATIVE_TRANSFORMS`/`ANCHORS` e as texturas
`steel`/`paint`/`rubber` com seus bump maps.

### 14.9 Ajustes pós-teste do cliente (1ª rodada)

Feedback: visual aprovado; enquadramento grande demais (não encaixava nem com o H1 inicial nem no
estágio 5 Optimize) e scroll pouco dinâmico.

**Enquadramento.** A causa era `BASE_PLATE = PLATE * 1.24` = 3.55 unidades. A placa-base é o elemento
mais largo da cena e a câmera a vê obliquamente — um quadrado de lado S projeta ~`S * 1.41` nesse
ângulo — o que dava ~5.0 num quadro visível de ~5.2: **97% da largura**, encostando na hairline da
moldura. Correções:

- `PLATE` 2.86 → **2.34**, `BASE_PLATE` fator 1.24 → **1.10**, `LAYER_STEP` **0.56**.
- **`FRAMING`** (novo): a câmera faz *dolly out* de 14% ao longo do scroll. Uma câmera fixa não
  serve as duas pontas — no AUDIT enquadraria ar vazio, no OPTIMIZE a pilha pronta lotaria o quadro.
- **`FRAME_CENTRE`** (novo): o quadro é centrado onde a pilha *terminada* vai ficar, não no que está
  sólido no momento. O ar vazio acima de FIELD no AUDIT **é** o argumento "faltam três camadas", então
  a composição o reserva desde o primeiro paint em vez de abrir espaço depois.
- Resultado medido: placa-base a 75% da largura no estágio 0 e 69% no estágio 4, tudo dentro do
  quadro nas duas pontas, preenchimento vertical 46–48%.
- Objeto deslocado 0.12 para a esquerda, para o índice de camadas ter ar na borda direita.

**Dinâmica.** Seis mudanças:

1. **Mola na chegada** (`spring()`): as lajes eram amortecidas exponencialmente, que se aproxima do
   alvo assintoticamente — nunca *aterrissa*. Agora ζ≈0.62, com overshoot de poucos por cento.
   `MAX_STEP = 1/30` protege a integração explícita de frames longos.
2. **Uma única etapa de atraso**: `visualProgress` de λ 7.5 → **12**. O λ 7.5 empilhava com o
   amortecimento por laje, e dois atrasos em série é o que fazia o objeto "nadar" atrás da página.
3. **Acoplamento à velocidade do scroll** (`scrollVelocity`): o objeto inclina na direção do
   movimento (`rotation.z`), ganha um termo de antecipação no giro e o tráfego dos risers acelera.
   Posição de scroll sozinha sincroniza; velocidade **conecta**.
4. **Janelas de travamento estreitas**: ~11% do scroll em vez de 18%, com pausa de 7% depois de cada
   chegada. Uma laje que dissolve devagar é um fade; uma que viaja e para é um evento.
5. **Giro contínuo** de 0.26 → **0.5 rad**, e stagger de 0.035 entre os cantos dos risers.
6. **`.hero-scroll` 360svh → 300svh** (~60svh por estágio). É o número para retunar a cadência.

### 14.10 Altura da moldura (2ª rodada de teste)

Feedback: a caixa do 3D terminava bem abaixo da coluna de texto no estágio 05 Optimize (~130px de
vazio no print).

**Por que acontecia.** `.hero-grid` usa `align-items: center`, então a moldura e a coluna de texto
compartilham um único eixo vertical: o transbordo é sempre `(altura_caixa − altura_texto) / 2`.
A coluna de texto **muda de altura durante o scroll** — ~600px enquanto o H1 está de pé, ~340px
depois que `is-story-emphasized` o colapsa. Com a caixa em 580px o transbordo ia de ~0 no estágio 0
para ~120px do 1 ao 5. **Nenhuma altura fixa serve as duas pontas.**

**Decisão:** otimizar para o estado colapsado, onde o leitor passa os estágios 01–05.

- `.three-shell` height **580px → 480px** (`app/styles/three-shell.css`, só >1100px — a faixa
  701–1100px é definida em `three-scene.css` e ≤700px em `responsive-700.css`).
- 480px é um meio deliberado, escolhido pelo cliente depois de ver 400px. O transbordo é simétrico
  entre as duas pontas:

  | Altura | Transbordo abaixo do texto colapsado (est. 01–05) | Texto abaixo da caixa no est. 0 |
  |---|---|---|
  | 580px (original) | ~120px | ~10px |
  | 400px | ~30px | ~100px |
  | **480px (atual)** | **~70px** | **~60px** |
- ⚠️ **Altura da moldura e `FRAMING` são uma única decisão, não duas.** `fov` é vertical, então a
  altura da caixa é o que determina quanto espaço **horizontal** o objeto recebe: caixa mais alta é
  proporcionalmente mais estreita e, a distância fixa, o objeto encosta nas paredes laterais. Por
  isso a câmera **recua** quando a caixa cresce (distância 6.74 → 7.50 no fim, com o aspect indo de
  1.38 para 1.15). **Mexer numa sem a outra estraga o enquadramento.**
- `.three-shell::after` (anel laranja decorativo) 260px → 215px, proporcional à caixa.
- Objeto deslocado 0.26 para a esquerda (era 0.12) para a borda direita ficar livre das pastilhas
  de camada numa caixa mais estreita.
- Verificado por cálculo em 480px: placa-base a 69% da largura no estágio 0 e 64% no 4,
  preenchimento vertical 52–54%, tudo dentro do quadro; caixa do objeto em 55–438px / 72–427px de
  551px, livre das pastilhas (452–527px, y 24–119px) e da legenda (y ~450px).

**Se quiser o vazio eliminado por completo** nas duas pontas, o caminho é a altura acompanhar o
estado: `.hero-scroll.is-story-emphasized .three-shell { height: … }`. Não foi feito porque animar
`height` num `<canvas>` dispara o `ResizeObserver` do R3F a cada frame da transição (~36
realocações de framebuffer), e o orçamento do briefing é 60fps em notebook integrado. Sem transição
a caixa daria um salto visível.

### 14.11 Vocabulário do overlay (3ª rodada) — usar o do site, não inventar

Feedback: os rótulos dentro da moldura ("FIELD LAYER AUDIT", "CONTROL LAYER IN REGISTER",
pastilhas FIELD/CONTROL/NETWORK/ANALYTICS) deviam ser processos reais, ligados ao que a RCL vende,
demonstrando abrangência de escopo e passando confiança.

**Diagnóstico.** Os rótulos antigos descreviam a **geometria da cena**, não uma entrega de
engenharia. "In register" é termo de desenho técnico sobre a animação — para um diretor de operações
não significa nada.

**A descoberta.** `method` em `lib/content.ts` **já é** exatamente isso: *"THE RCL SYSTEM / LE
SYSTÈME RCL — From machines to decisions"*, com cinco degraus (Machines · Control · Connect ·
Understand · Optimize). O objeto 3D desenha justamente essa pilha. O hero estava inventando um
vocabulário paralelo em vez de **prever** o da seção que o explica mais abaixo.

**Decisão: o overlay passa a citar `method` literalmente.** O leitor encontra as mesmas quatro
palavras duas vezes — no hero e na seção — e elas leem como um argumento só.

| Slot | Antes | Agora |
|---|---|---|
| Pastilhas (4) | FIELD / CONTROL / NETWORK / ANALYTICS | **MACHINES / CONTROL / CONNECT / OPTIMIZE** (degraus de `method`) |
| Cabeçalho das pastilhas | — | **RCL SYSTEM** / SYSTÈME RCL (eyebrow de `method`) |
| Meio da legenda | estado da laje ("LAYER IN REGISTER") | **entrega** ("CONTROL SYSTEM ENGINEERED") |
| Direita da legenda | "SCROLL-DRIVEN SYSTEM" | **disciplinas do estágio** |

O degrau 04 "Understand" de `method` está dobrado na laje ANALYTICS/OPTIMIZE, cujo readout **é** a
tendência — quatro lajes, cinco degraus.

**Abrangência de escopo.** É o campo `disciplines`, novo: uma linha por estágio, mostrando o que
aquele passo envolve. Ao longo dos cinco estágios o leitor vê o escopo inteiro — documentação e
risco, três disciplinas de dependuração, PLC e IHM, SCADA e IIoT, e por fim controle avançado e IA.
Escopo demonstrado **ao longo do tempo**, em vez de espremido num quadro só.

**Confiança.** Vem de nomear o sistema (`RCL SYSTEM`) em vez de descrever a animação. Deliberadamente
**não** usei `P.Eng.` nem os números de `team.trust` — estão marcados como PLACEHOLDER em
`lib/content.ts`, a confirmar com o cliente. Nenhuma alegação nova foi inventada: todo termo do
overlay já existe em `method`, `solutions` ou `stats`.

⚠️ **Largura da legenda é apertada.** As strings foram dimensionadas para caber na moldura mais
estreita do desktop (494px, viewport 1101px). Verificado nos dois locales e nas duas larguras: pior
caso −4px (fr 01), menos de um caractere. `.three-caption b` é o **único** item que cede, truncando
com reticência em vez de quebrar a legenda em duas linhas sobre o canvas — os `span` são
`flex: none; white-space: nowrap`. **Ao editar essas strings, refaça a conta**: francês costuma ser
15–20% mais longo, e a linha de disciplinas é justamente o sinal de abrangência, então ela não pode
ser a que aparece cortada.

### 14.12 Sincronia do estágio 05 (4ª rodada) — o segundo ato do OPTIMIZE

Feedback: no ponto 05 Optimize o objeto precisa concluir **junto** com o scroll dos processos, sem
parecer travado.

**Diagnóstico.** A laje ANALYTICS terminava de chegar em `progress` **0.93**, mas o scroll vai até
**1.0**. Depois de 0.93 nada estrutural se movia — e 0.07 de progresso em 300svh são **~14svh de
rolagem com o objeto congelado**, justamente enquanto a copy do 05 está na tela.

**A causa conceitual.** As janelas de travamento foram desenhadas para que a chegada de uma laje
seja um evento com pausa depois (§14.9). Isso funciona nos estágios 02–04, onde o estágio *é* a
chegada. Mas **OPTIMIZE é o único estágio cuja entrega não é uma laje pousando** — é o sistema
funcionando. Faltava um segundo ato.

**`convergence(progress)`** = `smoothstep(p, 0.9, 1)` é esse ato. Cinco coisas correm nele:

1. **O laço se fecha.** Controle avançado é a camada analítica escrevendo setpoints de volta no
   controlador, então pulsos **descem** a pilha (`RETURN_CORNERS`, 2 dos 4 cantos, 6 instâncias,
   tetraedro em vez de octaedro). Telemetria sobe, ação de controle desce. É o que distingue
   OPTIMIZE de CONNECT, e é o gesto que faltava. Mesmo cyan — **direção é o sinal**, e laranja
   continua reservado para "o passo descrito agora".
2. **Todas as lajes acendem juntas.** Até aqui só a laje em foco brilhava; `converged` soma +0.45 ao
   `signalMix` de todas. O argumento deixa de ser "uma camada chegou" e passa a ser "o conjunto
   está rodando" — é o fecho de "ordem emergindo do caos".
3. **A tendência se desenha sozinha**, via `setDrawRange` crescente. Por isso
   `analyticsCurvePositions()` emite vértices estritamente da esquerda para a direita e intercalados
   (segmento, depois a haste daquele passo) — mexer nessa ordem quebra o desenho progressivo.
   `LineSegments` usa 2 vértices por segmento, então o range tem de cair em contagem par.
4. **O tráfego acelera** (`convergence` soma +0.3 à velocidade dos pulsos).
5. **A câmera continua andando**: `built` foi de `smoothstep(0.34, 0.95)` para `(0.34, 1)`. Parar o
   dolly em 0.95 era parte do que fazia o fim parecer desistência.

**Zona morta do começo, também corrigida.** Entre 0 e 0.15 as lajes-fantasma apenas ficavam paradas
fora de registro. Agora derivam: um balanço lento e temporal de amplitude `0.035 × settle`, que
portanto **só existe enquanto a laje não foi trazida ao sistema** e desaparece sozinho quando ela
trava. Reforça "fora de registro" em vez de "parado".

**Verificado por cálculo** — em nenhum ponto do scroll o objeto fica sem nada mudando:

| Faixa | O que se move |
|---|---|
| 0.00–0.15 | giro contínuo (0.5 rad no total) + deriva das 3 lajes-fantasma |
| 0.15–0.46 | + sonda de diagnóstico (pico em 0.28) |
| 0.42–0.93 | + travamentos, foco, dolly, deriva decrescente |
| 0.90–1.00 | + convergência: laço, tendência se desenhando, todas as arestas vivas |

### 14.13 Projeção do gráfico (5ª rodada)

Pedido: aumentar a projeção da curva no objeto para evidenciar crescimento.

**`TREND_RISE`** (novo, em `ThreeScene.tsx`): **0.30 → 0.52**. É a única coisa que decide quanto o
objeto *parece* crescimento, então virou constante nomeada em vez de número solto na fórmula.

| | antes | agora |
|---|---|---|
| Subida acima da laje | 0.30 | **0.52** |
| Ângulo de subida | 10° | **16°** |
| Haste mais alta (direita) | 0.36 | **0.57** |
| Topo do objeto | 129px de 480 | 107px |

As hastes crescem de 0.02 (esquerda) a 0.57 (direita) e acompanham a curva automaticamente, então
subir a curva também torna o gráfico mais parecido com barras — o que reforça o crescimento sem
geometria nova. A ondulação subiu de 0.024 para 0.03: mantém a leitura de dado medido em vez de
rampa desenhada, mas continua pequena frente à subida, então a escalada domina.

Combina com §14.12: a curva se desenha sozinha durante `convergence` (0.90→1.0), então a subida
maior aparece justamente no momento em que o leitor está no estágio 05.

**Verificado por cálculo:** topo da curva em world y 1.66 contra teto do quadro em 2.74 (cabe com
1.08 de folga); topo do objeto sobe para 107px, entrando na faixa vertical das pastilhas (24–134px),
mas sem sobreposição — a borda direita do objeto está em 427px e as pastilhas começam em 451px.

⚠️ `TREND_RISE` levanta o topo do objeto inteiro. Se subir mais, refaça as duas contas: folga do
quadro e distância horizontal até as pastilhas.

#### 14.13.1 Correção — `trendDraw()`, a janela própria da curva

O cliente reportou não sentir mudança visual com a subida acima. **A subida não era o problema.**

A curva se desenhava por `convergence` = `smoothstep(p, 0.9, 1)`. Em `progress` 0.95 só **metade**
dela existia — e a metade que se desenha primeiro é a **esquerda, plana e baixa**. A ponta direita
alta, que é a razão de existir de um gráfico de tendência, só aparecia dentro dos últimos 2% do
scroll (~4svh). Aumentar `TREND_RISE` melhorava um pedaço de desenho que o leitor praticamente
nunca via.

**`trendDraw()`** = `smoothstep(p, 0.84, 0.95)`, janela separada da `convergence`:

| progress | desenhado antes | desenhado agora |
|---|---|---|
| 0.88 | 0% | 30% |
| 0.92 | 10% | 82% |
| 0.96 | 65% | **100%** |

Curva em altura total visível pelos últimos **5%** do scroll (~10svh) em vez de 2% (~4svh). Também
é melhor narrativamente: a curva se desenha **junto** com a chegada da laje ANALYTICS
(lock 0.82–0.93), em vez de depois dela.

`convergence` continua existindo e dirigindo o resto do segundo ato (laço fechando, arestas vivas,
dolly) — só a curva saiu dela.

**Lição:** aqui não basta conferir se a geometria cabe no quadro. Tem de se conferir **em que faixa
do scroll ela está visível** — geometria correta numa janela mal colocada é invisível na prática.

#### 14.13.2 Subida final

`TREND_RISE` **0.52 → 0.78** (+50%, pedido do cliente):

| | 0.52 | 0.78 |
|---|---|---|
| Topo da curva (world y) | 1.66 | **1.92** (teto do quadro 2.74) |
| Subida aparente | 26° | **36°** |
| Fração da altura do objeto | 20% | **27%** |
| Topo do objeto | 107px de 480 | 81px |

"Subida aparente" é o ângulo que se vê de fato: a rotação da câmera mais a do conjunto comprimem a
corrida horizontal em ~40%, então a inclinação lê mais forte do que os 24° geométricos.

### 14.14 Redesenho do gráfico (6ª rodada) — colunas em vez de billboard

Feedback: o gráfico parecia torto e merecia um desenho mais bonito.

**Duas causas, ambas reais.**

1. **Dois gráficos concorrendo na mesma laje.** `drawAnalyticsReadout` desenhava um gráfico completo
   na textura da face — grade, área preenchida, curva grossa e ponto final — **e** havia a polilinha
   3D de pé sobre a mesma laje, em outra orientação. Dois gráficos disputando uma face.
2. **A polilinha era um billboard enviesado.** Vivia no plano XY local da laje: o eixo horizontal
   dela **recuava na diagonal** para longe da câmera, então a linha de base nunca estava nivelada na
   tela e o conjunto lia como cisalhado. Não era bug de valor, era de orientação.

**Correção — separar os papéis:**

| | Antes | Agora |
|---|---|---|
| Face da laje | gráfico completo (grade + área + curva + ponto) | **papel milimetrado**: grade, eixos e um tique por coluna |
| O dado | polilinha num plano vertical | **9 colunas de pé sobre a laje** + linha ligando os topos |

As colunas são verticais em espaço de mundo e a base delas assenta na face da laje, então
**compartilham a perspectiva do objeto** em vez de brigar com ela. Isso resolve o "torto"
geometricamente, não por ajuste de número.

**Desenho das alturas** (`trendHeight`): levemente convexa — `t * 0.66 + t² * 0.34` — então o
gráfico **acelera** em vez de subir em reta, que é a forma clássica de crescimento. A ondulação
(`sin(t * 4.4) * 0.018`) é pequena o suficiente para **nunca produzir uma queda**: verificado que os
incrementos crescem monotonicamente de +0.078 a +0.121. A curva antiga tinha uma senoide de ciclo
inteiro e amostragem de 16 pontos, o que gerava dobras e vales — parte do aspecto torto.

**Animação:** cada coluna tem sua fatia da janela `trendDraw`, sobrepondo-se à da vizinha, então a
subida é uma **onda** e não nove estouros separados; a linha dos topos se desenha em compasso via
`drawRange`. Um gráfico se construindo é melhor uso do tempo do estágio 05 que uma linha se
desenrolando.

**Verificado por cálculo:** alturas monotônicas; passo entre colunas 0.211 contra base 0.078 (folga
0.133, sem encostar); vão 1.68 = 72% da largura da laje; coroa em world y 1.91 contra teto do quadro
2.74 (0.83 de folga); topo do objeto 82px de 480, borda direita 427px contra pastilhas em 451px.
Custo: +1 draw call (~29 no total, orçamento 60).

### 14.15 Pendência de verificação

⚠️ `npm run lint`, `npx tsc --noEmit` e `npm run build` passam limpos, e o enquadramento e a
coreografia foram verificados por cálculo. **A cena não foi verificada
visualmente em navegador** — não havia driver de browser scriptável no ambiente para percorrer o
scroll e os breakpoints. Conferir em `npm run dev` nos cinco estágios, em 1440/1100/768/390 px, e
com `prefers-reduced-motion` ativo.

---

## 15. ROTAS INTERNAS — i18n, CONTEÚDO E TRANSIÇÃO

### 15.1 O bug que motivou tudo

Ao avaliar a viabilidade de redesenhar Solutions / Industries / Approach / Projects, extraí do HTML
**já buildado** que os H1 e eyebrows dessas quatro rotas estavam **hardcoded em inglês** nos
`page.tsx` — não passavam por `lib/content.ts`. Em `/fr` o leitor francófono recebia:

| Rota | H1 servido em `/fr` (antes) |
|---|---|
| `/fr/approach` | "Assess. Engineer. Optimize." |
| `/fr/industries` | "Engineering adapted to the plant." |
| `/fr/projects` | "Show the work. Prove the outcome." |
| `/fr/solutions` | "Engineering systems that perform." |

E `/fr/industries` repetia **o mesmo parágrafo em inglês 20 vezes** (10 cards × 2 ocorrências no
HTML) como descrição de todos os setores.

Não era problema de estética: era conteúdo errado no idioma errado. Redesenhar antes de corrigir
seria deixar bonita uma página que mostra inglês para quem pediu francês.

### 15.2 Etapa 1 — i18n e conteúdo

- `pages.{solutions,industries,approach,projects}` ganharam `eyebrow`, `heading` e `headingAccent`
  (o fragmento em laranja) nos dois locales. `title`/`intro` continuam alimentando o
  `generateMetadata`.
- **`industries.items` mudou de forma**: `string[]` → `[nome, descrição][]`, com uma descrição real
  por setor nos dois idiomas. ⚠️ Isso é uma mudança de contrato — os dois pontos de uso
  (`/industries` e a faixa de pastilhas da home) foram atualizados, e o `tsc` pega qualquer novo.
  As descrições falam de **capacidade**, nunca de resultado: nenhum número é alegado.
- `pages.approach.deliverables` (novo): "o que sobra para você" — documentação tal-como-construído,
  telas de operador, formação, código-fonte e licenças. É a pergunta que um diretor de operações faz
  antes de assinar, e complementa o método (que descreve o que se constrói, não o que se entrega).
- `pages.projects.framework` (novo): a estrutura em 5 passos que toda documentação de projeto segue.
  ⚠️ **Nenhum case study foi inventado** — o `README.md` exige aprovação do cliente para métricas
  reais, então a página apresenta o **framework** e diz abertamente por que os números não estão lá.

⚠️ **A copy nova é proposta e precisa de revisão do cliente** — em especial as 10 descrições de
setor e o texto de `deliverables`, que descrevem prática de trabalho.

### 15.3 Etapa 2 — visual

Cada uma das quatro páginas tinha **2 seções**; agora tem **3** mais a faixa de CTA. Tudo montado
com padrões que já existiam (`.section-head`, `.listing-grid`, `.method-grid`, `.problem-grid`,
`.canada-grid`, `.industry-list`, `.results`) — **nenhum componente visual novo foi inventado**.

| Rota | Estrutura |
|---|---|
| Solutions | hero → 5 disciplinas → setores atendidos (dark) → CTA |
| Industries | hero → 10 setores com descrição própria → a realidade industrial comum (dark) → CTA |
| Approach | hero → O Sistema RCL (dark) → o que sobra para você → CTA |
| Projects | hero → framework de documentação → o que "melhor" significa (dark) → CTA |

- **`components/CtaBand.tsx`** (novo): antes só `/projects` e `/about` ofereciam saída; as outras
  três terminavam num grid e deixavam o leitor sem para onde ir. Extraído em vez de colado quatro
  vezes.
- `.cta .eyebrow { color: #fff }` foi para `app/styles/cta.css` — era `style` inline repetido em
  cada página que fechava com CTA. É propriedade da faixa, não da página.
- Os quatro `page.tsx` eram uma linha única minificada cada; foram reescritos em JSX legível.

### 15.4 Transição entre rotas

`components/PageTransition.tsx` usa **`<ViewTransition>` do React 19.2** sobre a View Transitions
API do browser. Fatos do guia do Next 16 que definem a implementação:

- Navegação de rota no App Router **já é uma React Transition**, então a animação ativa sozinha —
  sem configuração, sem biblioteca. Sem suporte do browser, o site navega sem animar.
- **`key={pathname}` é o que faz `enter`/`exit` disparar.** Um `<ViewTransition>` no layout persiste
  entre navegações e, sozinho, só reportaria um update.

Decisões:

- **Não é slide direcional.** Exigiria semântica forward/back por link, erra no botão voltar do
  browser, e movimento posicional é o gatilho mais comum de sensibilidade a movimento. É um
  cross-fade de 400ms com assentamento de 8–12px, assimétrico: a página velha sai em 140ms, a nova
  entra em 260ms com 140ms de atraso.
- **`enter`/`exit` carregam classe, não `name` compartilhado.** Nome compartilhado parearia as duas
  páginas e faria morph do grupo — e as alturas aqui são absurdamente diferentes (hero da home tem
  300svh contra ~1,5 tela do /solutions).
- **Header e footer ancorados puro em CSS** via `view-transition-name` em `.site-header` /
  `.site-footer`, com animação morta. Nenhum componente precisou saber que participa.
- **`::view-transition-group(root) { animation: none }`** — sem isso o root faz cross-fade do
  documento inteiro *em cima* da animação da página: dois fades por navegação, que é o que faz
  view transition ingênua parecer suja.
- **`::view-transition { pointer-events: none }`** — o overlay engoliria cliques enquanto roda.
- `prefers-reduced-motion` zera duração e atraso com wildcard.

Fica no layout, não em cada `page.tsx`, para uma rota futura não poder esquecer de entrar. Custo: o
subtree remonta na navegação — o que já acontecia, já que o componente de página muda. **As 19
rotas continuam SSG.**

### 15.5 Verificado

`npm run lint`, `npx tsc --noEmit` e `npm run build` limpos. Do HTML buildado:

- H1 corretos nos dois locales: `/fr/approach` → "Évaluer. Concevoir. Optimiser.", etc.
- Parágrafo inglês repetido em `/fr/industries`: **20 → 0**; as 10 descrições francesas são distintas.
- As quatro rotas fecham com a faixa de CTA.
- Regras de view-transition presentes no bundle CSS de produção (15 ocorrências).

**Não verificado visualmente em navegador** — sem browser scriptável no ambiente. Conferir em
`npm run dev` o ritmo da transição e a densidade das quatro páginas nos breakpoints.

---

## 16. NAV PRINCIPAL — ESTADO DE ROTA ATIVA (7ª entrega)

Pedido: redesenhar visualmente os links do header para Solutions / Industries / Approach / About /
Projects.

**Achado ao investigar.** O nav não tinha **nenhuma indicação de rota ativa** — nem `aria-current`,
nem classe, nem cor diferente. O único feedback era um sublinhado laranja que só existia durante o
hover, então ao pousar na própria página "Solutions" o link parecia idêntico aos outros quatro. Isso
é uma lacuna de usabilidade real, não só estética, então entrou no escopo do redesenho.

**`components/Header.tsx`**: `usePathname()` (já usado em `PageTransition` e `LanguageToggle`, então
não é dependência nova) mais `isActiveRoute(pathname, href)`, que casa a rota exata **e** qualquer
coisa aninhada sob ela — `/solutions/[slug]` mantém "Solutions" marcado. `aria-current="page"` vai
para o link ativo nos dois navs (desktop `.main-nav` e `.mobile-nav`); o CTA "Talk to an Engineer"
fica de fora de propósito, pois não está na lista de rotas do pedido.

**Desktop (`app/styles/header.css`)**: o sublinhado deslizante (`.main-nav a:after` com
`right: 100% → 0` no hover) foi trocado por **pílulas com fundo**. Um efeito só de hover não
conseguia carregar dois estados — "estou passando o mouse" e "estou nesta página" — ao mesmo tempo;
fundo consegue. Hover aplica um tingimento leve; a rota ativa aplica um tingimento mais forte, peso
700 e um **ponto laranja** sob o rótulo. O seletor de hover exclui explicitamente
`[aria-current="page"]`, então passar o mouse pelo nav nunca faz a própria página parecer que deixou
de ser a página atual.

**Mobile (`app/styles/mobile-nav.css`)**: mesmo padrão adaptado a lista vertical — texto em negrito
e o ponto laranja à esquerda do rótulo em vez de embaixo.

**Por que um ponto laranja.** Reaproveita a convenção já estabelecida no objeto 3D do hero (§14.3):
laranja é o marcador único de "o passo/lugar atual", nunca decoração. Usar o mesmo papel aqui em vez
de inventar uma cor ou padrão novo mantém a convenção válida no site inteiro, não só dentro do
Canvas.

`:focus-visible` em ambos usa `outline: 2px solid var(--cyan)`, o mesmo padrão já usado em
`.team-card` e `.custom-select-clear` — não um estilo de foco novo.

**Verificado no HTML buildado**: as cinco rotas marcam exatamente o link correspondente com
`aria-current="page"` nos dois navs; `/en/solutions/control` mantém "Solutions" ativo. `lint`,
`tsc --noEmit` e `build` limpos.

---

*Documento gerado automaticamente — contém contexto completo do projeto Royal City Labs com histórico de problemas, soluções aplicadas, decisões pendentes e referências.*
