# Client deliverables — Royal City Labs website

## Os dois PDFs

| Arquivo | Para quem |
|---|---|
| `Royal-City-Labs-Website-Preview-EN.pdf` | **o cliente** — texto do documento em inglês |
| `Royal-City-Labs-Website-Preview-PT.pdf` | **uso interno** — mesmo documento, texto em pt-BR |

120 páginas cada, A4 paisagem, todas as rotas do site capturadas do build de produção
num navegador real. Capítulos 01–11: Home, Solutions (e suas cinco rotas de detalhe),
Industries, Approach, About, Projects, Contact, detalhes de interação, tablet, celular
e Français. As três últimas páginas são o resumo técnico, o que a varredura no
navegador verificou, e a lista de assets e decisões que ainda dependem do cliente.

**As capturas de tela são idênticas nas duas edições** — permanecem em inglês e francês,
porque é nesses idiomas que o site existe. O que muda entre as edições é apenas o texto
do documento: títulos, legendas, sumário e páginas de texto. Nomes de rota (Home,
Solutions, Industries…), frases citadas do próprio site e identificadores de código
seguem em inglês nas duas.

Os dois saem do mesmo gerador (`deckcore.py` + `deck_en.py` / `deck_pt.py`), então a
estrutura e a numeração de páginas são as mesmas — a página 66 é a mesma tela nas duas.

## `screenshots/`

The 160 source captures at 2× (phones at 3×), lossless PNG. Use these for
any other material — slides, proposals, social. `manifest.json` carries the same
index in machine-readable form.

> Not intended for version control: the folder is ~160 MB. Add `deliverables/`
> to `.gitignore`, or keep only the PDF, depending on how you want to share it.

### Index

#### Home — the scroll-driven hero, stage by stage

- `001-home-hero-intro.png` — Opening frame (first paint) · Desktop 1600×1000 · 3200×2000
- `002-home-hero-s1.png` — Stage 01 — AUDIT · Desktop 1600×1000 · 3200×2000
- `003-home-hero-s2.png` — Stage 02 — DIAGNOSE · Desktop 1600×1000 · 3200×2000
- `004-home-hero-s3.png` — Stage 03 — AUTOMATE · Desktop 1600×1000 · 3200×2000
- `005-home-hero-s4.png` — Stage 04 — CONNECT · Desktop 1600×1000 · 3200×2000
- `006-home-hero-s5.png` — Stage 05 — OPTIMIZE · Desktop 1600×1000 · 3200×2000

#### Home — section by section

- `007-home-sec1.png` — Technology changes fast. Engineering judgement matters longer. · Desktop 1600×1000 · 3200×1460
- `008-home-sec2.png` — You're not hiring a vendor. You're hiring these engineers. · Desktop 1600×1000 · 3200×2592
- `009-home-sec3.png` — When the plant underperforms, the problem is rarely just one machine. · Desktop 1600×1000 · 3200×1558
- `010-home-sec4.png` — From machines to decisions. · Desktop 1600×1000 · 3200×1348
- `011-home-sec5.png` — Engineering disciplines that work as one system. · Desktop 1600×1000 · 3200×1770
- `012-home-sec6.png` — Built for the industries that keep operations moving. · Desktop 1600×1000 · 3200×1178
- `013-home-sec7.png` — Technology is only valuable when the operation improves. · Desktop 1600×1000 · 3200×1162
- `014-home-sec8.png` — Tell us what your plant needs to do better. · Desktop 1600×1000 · 3200×642

#### Solutions

- `016-solutions-fold.png` — Engineering systems that perform. · Desktop 1600×1000 · 3200×2000
- `017-solutions-sec1.png` — Engineering disciplines that work as one system. · Desktop 1600×1000 · 3200×2702
- `018-solutions-sec2.png` — Built for the industries that keep operations moving. · Desktop 1600×1000 · 3200×1178
- `019-solutions-sec3.png` — Tell us what your plant needs to do better. · Desktop 1600×1000 · 3200×642

#### Solutions › Industrial Control

- `021-sol-control-fold.png` — Industrial Control. · Desktop 1600×1000 · 3200×2000
- `022-sol-control-sec1.png` — Built around the operation, not the buzzword. · Desktop 1600×1000 · 3200×2316

#### Solutions › Industrial Connectivity

- `024-sol-connect-fold.png` — Industrial Connectivity. · Desktop 1600×1000 · 3200×2000
- `025-sol-connect-sec1.png` — Built around the operation, not the buzzword. · Desktop 1600×1000 · 3200×2316

#### Solutions › Industrial Engineering

- `027-sol-eng-fold.png` — Industrial Engineering. · Desktop 1600×1000 · 3200×2000
- `028-sol-eng-sec1.png` — Built around the operation, not the buzzword. · Desktop 1600×1000 · 3200×2316

#### Solutions › Industrial Software

- `030-sol-dev-fold.png` — Industrial Software. · Desktop 1600×1000 · 3200×2000
- `031-sol-dev-sec1.png` — Built around the operation, not the buzzword. · Desktop 1600×1000 · 3200×2316

#### Solutions › Advanced Optimization

- `033-sol-opt-fold.png` — Advanced Optimization. · Desktop 1600×1000 · 3200×2000
- `034-sol-opt-sec1.png` — Built around the operation, not the buzzword. · Desktop 1600×1000 · 3200×2316

#### Industries

- `036-industries-fold.png` — Engineering adapted to the plant. · Desktop 1600×1000 · 3200×2000
- `037-industries-sec1.png` — Built for the industries that keep operations moving. · Desktop 1600×1000 · 3200×3886
- `038-industries-sec2.png` — When the plant underperforms, the problem is rarely just one machine. · Desktop 1600×1000 · 3200×1558
- `039-industries-sec3.png` — Tell us what your plant needs to do better. · Desktop 1600×1000 · 3200×642

#### Approach

- `041-approach-fold.png` — Assess. Engineer. Optimize. · Desktop 1600×1000 · 3200×2000
- `042-approach-sec1.png` — From machines to decisions. · Desktop 1600×1000 · 3200×1348
- `043-approach-sec2.png` — The system stays yours after we leave. · Desktop 1600×1000 · 3200×1318
- `044-approach-sec3.png` — Tell us what your plant needs to do better. · Desktop 1600×1000 · 3200×644

#### About

- `046-about-fold.png` — Built by engineers. Focused on outcomes. · Desktop 1600×1000 · 3200×2000
- `047-about-sec1.png` — Multidisciplinary technical talent. · Desktop 1600×1000 · 3200×1460
- `048-about-sec2.png` — Canadian engineering, held to Canadian standards. · Desktop 1600×1000 · 3200×1400
- `049-about-sec3.png` — The screen your operator reads is the screen your operator understands. · Desktop 1600×1000 · 3200×1876
- `050-about-sec4.png` — A bridge between traditional industry and Industry 4.0. · Desktop 1600×1000 · 3200×1952
- `051-about-sec5.png` — You're not hiring a vendor. You're hiring these engineers. · Desktop 1600×1000 · 3200×3522
- `052-about-sec6.png` — Tell us what your plant needs to do better. · Desktop 1600×1000 · 3200×644
- `167-team-grid-flipped.png` — Team grid with an open bio · Desktop 1600×1000 · 3200×3522

#### Projects

- `054-projects-fold.png` — Show the work. Prove the outcome. · Desktop 1600×1000 · 3200×2000
- `055-projects-sec1.png` — Every project is written up the same way. · Desktop 1600×1000 · 3200×1514
- `056-projects-sec2.png` — Technology is only valuable when the operation improves. · Desktop 1600×1000 · 3200×1162
- `057-projects-sec3.png` — Tell us what your plant needs to do better. · Desktop 1600×1000 · 3200×642

#### Contact and the enquiry form

- `059-contact-fold.png` — Talk to an Engineer. · Desktop 1600×1000 · 3200×2000
- `060-contact-sec1.png` — Tell us what needs to work better. · Desktop 1600×1000 · 3200×2026
- `168-form-empty.png` — Contact form — ready · Desktop 1600×1000 · 2360×1466
- `169-form-select-open.png` — Searchable challenge selector · Desktop 1600×1000 · 1344×1466
- `170-form-errors.png` — Server-side validation · Desktop 1600×1000 · 1344×1566
- `171-form-filled.png` — Contact form — completed enquiry · Desktop 1600×1000 · 1344×1466
- `172-form-success.png` — Confirmation · Desktop 1600×1000 · 1344×820
- `206-form-success-live.png` — Confirmation — delivery endpoint live · Desktop 1600×1000 · 1344×610

#### Navigation, footer and interaction details

- `162-nav-active-solutions.png` — Primary navigation — active route · Desktop 1600×1000 · 2640×122
- `163-nav-active-industries.png` — Primary navigation — active route moves · Desktop 1600×1000 · 2640×122
- `164-footer-desktop.png` — Site footer · Desktop 1600×1000 · 3200×654
- `165-team-card-front.png` — Engineer card — front · Desktop 1600×1000 · 766×980
- `166-team-card-back.png` — Engineer card — flipped · Desktop 1600×1000 · 766×980

#### Whole-page captures (one image per route, top to bottom)

- `015-home-full.png` — Home · Desktop 1600×1000 · 3200×18364
- `020-solutions-full.png` — Solutions · Desktop 1600×1000 · 3200×6148
- `023-sol-control-full.png` — Solutions › Industrial Control · Desktop 1600×1000 · 3200×3822
- `026-sol-connect-full.png` — Solutions › Industrial Connectivity · Desktop 1600×1000 · 3200×3822
- `029-sol-eng-full.png` — Solutions › Industrial Engineering · Desktop 1600×1000 · 3200×3822
- `032-sol-dev-full.png` — Solutions › Industrial Software · Desktop 1600×1000 · 3200×3822
- `035-sol-opt-full.png` — Solutions › Advanced Optimization · Desktop 1600×1000 · 3200×3822
- `040-industries-full.png` — Industries · Desktop 1600×1000 · 3200×7712
- `045-approach-full.png` — Approach · Desktop 1600×1000 · 3200×4816
- `053-about-full.png` — About · Desktop 1600×1000 · 3200×12542
- `058-projects-full.png` — Projects · Desktop 1600×1000 · 3200×5004
- `061-contact-full.png` — Contact · Desktop 1600×1000 · 3200×3532

#### Tablet

- `173-tab-home.png` — Home · Tablet 900×1200 · 1800×2400
- `174-tab-solutions.png` — Solutions · Tablet 900×1200 · 1800×2400
- `175-tab-about.png` — About · Tablet 900×1200 · 1800×2400
- `176-tab-contact.png` — Contact · Tablet 900×1200 · 1800×2400
- `177-tab768-approach.png` — Approach — the RCL system at 768px · Tablet 768×1024 · 1536×2154
- `178-tab768-projects.png` — Projects — documentation framework at 768px · Tablet 768×1024 · 1536×2342

#### Phone — folds and interaction states

- `179-m-home-fold.png` — Home · Phone 430×932 · 1290×2796
- `181-m-solutions-fold.png` — Solutions · Phone 430×932 · 1290×2796
- `183-m-sol-control-fold.png` — Solutions › Industrial Control · Phone 430×932 · 1290×2796
- `185-m-industries-fold.png` — Industries · Phone 430×932 · 1290×2796
- `187-m-approach-fold.png` — Approach · Phone 430×932 · 1290×2796
- `189-m-about-fold.png` — About · Phone 430×932 · 1290×2796
- `191-m-projects-fold.png` — Projects · Phone 430×932 · 1290×2796
- `193-m-contact-fold.png` — Contact · Phone 430×932 · 1290×2796
- `195-m-menu-open.png` — Mobile navigation · Phone 430×932 · 1290×2796
- `196-m-team.png` — Engineer cards on mobile · Phone 430×932 · 1290×2796
- `197-m-form.png` — Contact form on mobile · Phone 430×932 · 1290×2796

#### Phone — full scroll sequences

- `301-m-home-f01.png` — Home · frame 1/14 · Phone 430×932 · 1290×2796
- `302-m-home-f02.png` — Home · frame 2/14 · Phone 430×932 · 1290×2796
- `303-m-home-f03.png` — Home · frame 3/14 · Phone 430×932 · 1290×2796
- `304-m-home-f04.png` — Home · frame 4/14 · Phone 430×932 · 1290×2796
- `305-m-home-f05.png` — Home · frame 5/14 · Phone 430×932 · 1290×2796
- `306-m-home-f06.png` — Home · frame 6/14 · Phone 430×932 · 1290×2796
- `307-m-home-f07.png` — Home · frame 7/14 · Phone 430×932 · 1290×2796
- `308-m-home-f08.png` — Home · frame 8/14 · Phone 430×932 · 1290×2796
- `309-m-home-f09.png` — Home · frame 9/14 · Phone 430×932 · 1290×2796
- `310-m-home-f10.png` — Home · frame 10/14 · Phone 430×932 · 1290×2796
- `311-m-home-f11.png` — Home · frame 11/14 · Phone 430×932 · 1290×2796
- `312-m-home-f12.png` — Home · frame 12/14 · Phone 430×932 · 1290×2796
- `313-m-home-f13.png` — Home · frame 13/14 · Phone 430×932 · 1290×2796
- `314-m-home-f14.png` — Home · frame 14/14 · Phone 430×932 · 1290×2796
- `315-m-solutions-f01.png` — Solutions · frame 1/5 · Phone 430×932 · 1290×2796
- `316-m-solutions-f02.png` — Solutions · frame 2/5 · Phone 430×932 · 1290×2796
- `317-m-solutions-f03.png` — Solutions · frame 3/5 · Phone 430×932 · 1290×2796
- `318-m-solutions-f04.png` — Solutions · frame 4/5 · Phone 430×932 · 1290×2796
- `319-m-solutions-f05.png` — Solutions · frame 5/5 · Phone 430×932 · 1290×2796
- `320-m-sol-control-f01.png` — Solutions › Industrial Control · frame 1/3 · Phone 430×932 · 1290×2796
- `321-m-sol-control-f02.png` — Solutions › Industrial Control · frame 2/3 · Phone 430×932 · 1290×2796
- `322-m-sol-control-f03.png` — Solutions › Industrial Control · frame 3/3 · Phone 430×932 · 1290×2796
- `323-m-industries-f01.png` — Industries · frame 1/7 · Phone 430×932 · 1290×2796
- `324-m-industries-f02.png` — Industries · frame 2/7 · Phone 430×932 · 1290×2796
- `325-m-industries-f03.png` — Industries · frame 3/7 · Phone 430×932 · 1290×2796
- `326-m-industries-f04.png` — Industries · frame 4/7 · Phone 430×932 · 1290×2796
- `327-m-industries-f05.png` — Industries · frame 5/7 · Phone 430×932 · 1290×2796
- `328-m-industries-f06.png` — Industries · frame 6/7 · Phone 430×932 · 1290×2796
- `329-m-industries-f07.png` — Industries · frame 7/7 · Phone 430×932 · 1290×2796
- `330-m-approach-f01.png` — Approach · frame 1/5 · Phone 430×932 · 1290×2796
- `331-m-approach-f02.png` — Approach · frame 2/5 · Phone 430×932 · 1290×2796
- `332-m-approach-f03.png` — Approach · frame 3/5 · Phone 430×932 · 1290×2796
- `333-m-approach-f04.png` — Approach · frame 4/5 · Phone 430×932 · 1290×2796
- `334-m-approach-f05.png` — Approach · frame 5/5 · Phone 430×932 · 1290×2796
- `335-m-about-f01.png` — About · frame 1/12 · Phone 430×932 · 1290×2796
- `336-m-about-f02.png` — About · frame 2/12 · Phone 430×932 · 1290×2796
- `337-m-about-f03.png` — About · frame 3/12 · Phone 430×932 · 1290×2796
- `338-m-about-f04.png` — About · frame 4/12 · Phone 430×932 · 1290×2796
- `339-m-about-f05.png` — About · frame 5/12 · Phone 430×932 · 1290×2796
- `340-m-about-f06.png` — About · frame 6/12 · Phone 430×932 · 1290×2796
- `341-m-about-f07.png` — About · frame 7/12 · Phone 430×932 · 1290×2796
- `342-m-about-f08.png` — About · frame 8/12 · Phone 430×932 · 1290×2796
- `343-m-about-f09.png` — About · frame 9/12 · Phone 430×932 · 1290×2796
- `344-m-about-f10.png` — About · frame 10/12 · Phone 430×932 · 1290×2796
- `345-m-about-f11.png` — About · frame 11/12 · Phone 430×932 · 1290×2796
- `346-m-about-f12.png` — About · frame 12/12 · Phone 430×932 · 1290×2796
- `347-m-projects-f01.png` — Projects · frame 1/5 · Phone 430×932 · 1290×2796
- `348-m-projects-f02.png` — Projects · frame 2/5 · Phone 430×932 · 1290×2796
- `349-m-projects-f03.png` — Projects · frame 3/5 · Phone 430×932 · 1290×2796
- `350-m-projects-f04.png` — Projects · frame 4/5 · Phone 430×932 · 1290×2796
- `351-m-projects-f05.png` — Projects · frame 5/5 · Phone 430×932 · 1290×2796
- `352-m-contact-f01.png` — Contact · frame 1/3 · Phone 430×932 · 1290×2796
- `353-m-contact-f02.png` — Contact · frame 2/3 · Phone 430×932 · 1290×2796
- `354-m-contact-f03.png` — Contact · frame 3/3 · Phone 430×932 · 1290×2796

#### Phone — whole-page captures

- `180-m-home-full.png` — Home · Phone 430×932 · 1290×35877
- `182-m-solutions-full.png` — Solutions · Phone 430×932 · 1290×11871
- `184-m-sol-control-full.png` — Solutions › Industrial Control · Phone 430×932 · 1290×7695
- `186-m-industries-full.png` — Industries · Phone 430×932 · 1290×18048
- `188-m-approach-full.png` — Approach · Phone 430×932 · 1290×11505
- `190-m-about-full.png` — About · Phone 430×932 · 1290×28857
- `192-m-projects-full.png` — Projects · Phone 430×932 · 1290×11103
- `194-m-contact-full.png` — Contact · Phone 430×932 · 1290×6669

#### Français

- `198-fr-home.png` — Accueil — Home · Desktop 1600×1000 · 3200×2000
- `199-fr-solutions.png` — Solutions · Desktop 1600×1000 · 3200×2000
- `200-fr-industries.png` — Industries · Desktop 1600×1000 · 3200×2000
- `201-fr-approach.png` — Approche — Approach · Desktop 1600×1000 · 3200×2000
- `202-fr-about.png` — À propos — About · Desktop 1600×1000 · 3200×2000
- `203-fr-projects.png` — Projets — Projects · Desktop 1600×1000 · 3200×2000
- `204-fr-contact.png` — Contact · Desktop 1600×1000 · 3200×2000
- `205-fr-m-solutions.png` — Solutions — mobile FR · Phone 430×932 · 1290×2796

---

## Edição resumida (25 páginas)

| Arquivo | Para quem |
|---|---|
| `Royal-City-Labs-Website-Summary-EN.pdf` | **o cliente** — 25 páginas, texto em inglês |
| `Royal-City-Labs-Website-Summary-PT.pdf` | uso interno — mesmas 25 páginas, texto em pt-BR |

Mesmas capturas, layouts mais densos: a narrativa em scroll da home nos seis
estágios numa página, as cinco rotas de detalhe numa página, o formulário em três
estados numa página, tablet em quatro telas, celular em dez, francês em quatro.
Termina no resumo técnico, no que a varredura verificou e no que depende do cliente.

Use a resumida para a apresentação e a completa de 120 páginas para quem quiser
percorrer tudo.

## `tools/`

O gerador. `python3 assets.py` extrai as fontes da marca do build de produção e
gera os JPEGs a partir de `../screenshots`; `python3 deck_compact_en.py` (ou `_pt`)
monta o HTML; `node print.mjs build/compact-en.html saida.pdf` imprime o PDF e
verifica cada página contra estouro de margem e colisão de legenda antes de gravar.

Estrutura, CSS e geometria ficam em `deckcore.py`, então as duas edições não podem
divergir de layout — só o texto muda. Requer `npm i` dentro de `tools/` (puppeteer-core)
e um `npm run build` na raiz do projeto para as fontes.

> Os PDFs completos de 120 páginas continuam válidos como arquivo, mas o gerador
> deles foi perdido numa limpeza de diretório temporário. Por isso esta ferramenta
> agora mora no repositório.
