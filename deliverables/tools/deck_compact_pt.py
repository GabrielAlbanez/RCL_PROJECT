# -*- coding: utf-8 -*-
"""Edição compacta (26 páginas), texto em pt-BR. As capturas permanecem em
inglês e francês, porque é nesses idiomas que o site existe."""
from deckcore import *   # noqa: F403

DATA = '4 de setembro de 2026'
D = 'Desktop · 1600 × 1000'

set_ui({
    'vp_desktop': D,
    'foot': 'Royal City Labs — Pré-visualização do site',
    'doc_title': 'Royal City Labs — Pré-visualização do site (resumo)',
    'back_marker': '@@nunca@@',
    'toc_index': 1,
    'toc_front': [],
    'chapter_no': {
        'O site inteiro num relance': '01', 'Home': '02', 'Solutions': '03',
        'Industries': '04', 'Approach': '05', 'About': '06', 'Projects': '07',
        'Contact': '08', 'Tablet e celular': '09', 'Français': '10',
        'Detalhes de interação': '11', 'Resumo técnico': '12',
    },
})

# 1 — capa
add(f'''<div class="cover-top">{LOGO}</div>
  <div class="cover-mid">
    <div class="eyebrow">SITE — PRÉ-VISUALIZAÇÃO</div>
    <h1>O novo site da<br>Royal City Labs<span class="dot">.</span></h1>
    <p>Resumo visual do build em funcionamento — desktop, tablet e celular, em inglês e
       francês, incluindo o formulário e os estados interativos.</p>
  </div>
  <div class="cover-foot">
    <div><b>Preparado para</b><span>Royal City Labs</span></div>
    <div><b>Data</b><span>{DATA}</span></div>
    <div><b>Extensão</b><span>{{PAGECOUNT}} páginas</span></div>
  </div>''', chrome='cover')

# 2 — sumário + como ler
add(head('SUMÁRIO', 'O que tem aqui<span class="dot">.</span>',
         meta_chip('{PAGECOUNT} páginas', '{SHOTCOUNT} capturas disponíveis')) +
    '<div class="stage"><div class="toc-split"><div>{TOC}</div><div class="prose" '
    'style="height:auto;margin:0">'
    '<h3>Toda imagem é uma captura de tela</h3>'
    '<p>Nada aqui é ilustração. Cada imagem foi capturada do build de produção rodando num '
    'navegador real, no tamanho de viewport impresso no canto superior direito da página.</p>'
    '<h3>O site está em inglês e francês</h3>'
    '<p>As telas aparecem nos idiomas em que o site existe — <b>en-CA</b> e <b>fr-CA</b>. O que '
    'está em português é este documento: títulos, legendas e explicações.</p>'
    '<h3>Este é o resumo</h3>'
    '<p>Existe uma edição completa de 120 páginas que percorre cada seção de cada rota e cada '
    'página do celular de cima a baixo. Aqui está o essencial: a linguagem visual em tamanho '
    'legível, mais o site inteiro em miniatura na página seguinte.</p>'
    '<h3>O que é provisório está sinalizado</h3>'
    '<p>O logo é uma recriação na paleta da marca, os retratos são substitutos licenciados e '
    'nenhuma métrica de projeto foi inventada. Tudo que depende do cliente está na última '
    'página.</p>'
    '</div></div></div>' +
    caption('A numeração corre na margem inferior de cada folha.'))

# 3 — mapa do site
textpage('ESTRUTURA', 'Mapa do site<span class="dot">.</span>', '''
<div class="sitemap">
  <div class="sm-col">
    <div class="sm-h">Rotas principais <b>× 2 idiomas</b></div>
    <ul class="sm-list">
      <li><span>/en</span><i>Home — narrativa em scroll, equipe, método, soluções, setores</i></li>
      <li><span>/en/solutions</span><i>As cinco disciplinas de engenharia</i></li>
      <li><span>/en/industries</span><i>Dez setores, cada um com sua própria descrição</i></li>
      <li><span>/en/approach</span><i>O sistema RCL, e o que fica com o cliente depois</i></li>
      <li><span>/en/about</span><i>Equipe, normas canadenses, entrega bilíngue, posicionamento</i></li>
      <li><span>/en/projects</span><i>Como todo projeto é documentado</i></li>
      <li><span>/en/contact</span><i>O formulário de contato</i></li>
    </ul>
  </div>
  <div class="sm-col">
    <div class="sm-h">Rotas de detalhe das soluções <b>× 2 idiomas</b></div>
    <ul class="sm-list">
      <li><span>/en/solutions/control</span><i>Controle industrial</i></li>
      <li><span>/en/solutions/connect</span><i>Conectividade industrial</i></li>
      <li><span>/en/solutions/engineer</span><i>Engenharia industrial</i></li>
      <li><span>/en/solutions/develop</span><i>Software industrial</i></li>
      <li><span>/en/solutions/optimize</span><i>Otimização avançada</i></li>
    </ul>
    <div class="sm-h" style="margin-top:9mm">Para máquinas</div>
    <ul class="sm-list">
      <li><span>/robots.txt</span><i>Regras de rastreamento</i></li>
      <li><span>/sitemap.xml</span><i>Todas as rotas, nos dois idiomas, com pares hreflang</i></li>
      <li><span>/</span><i>Redireciona para /en ou /fr conforme o idioma do navegador</i></li>
    </ul>
    <p class="sm-note">24 rotas de página no total. Todas pré-renderizadas como HTML estático no
      build, então a primeira pintura não espera servidor.</p>
  </div>
</div>''')

# 4 — o site inteiro
STRIPS = [('home-full','Home'),('solutions-full','Solutions'),('industries-full','Industries'),
          ('approach-full','Approach'),('about-full','About'),('projects-full','Projects'),
          ('contact-full','Contact'),('sol-control-full','Solutions › Control'),
          ('sol-connect-full','Solutions › Connect'),('sol-eng-full','Solutions › Engineer'),
          ('sol-dev-full','Solutions › Develop'),('sol-opt-full','Solutions › Optimize')]
cards = ''.join(f'<figure class="strip"><div class="strip-win">{img(one(pid))}</div>'
                f'<figcaption>{E(lbl)}</figcaption></figure>' for pid, lbl in STRIPS)
add(head('VISÃO GERAL', 'O site inteiro num relance<span class="dot">.</span>',
         meta_chip('Desktop · capturas de página inteira')) +
    f'<div class="stage"><div class="strips">{cards}</div></div>' +
    caption('As doze rotas na mesma escala, cada uma cortada onde a folha termina. As alturas '
            'relativas mostram quanto há para ler em cada rota. Todas são capturas reais.'),
    toc='O site inteiro num relance')

# 5–8 — Home
shot('home-hero-intro', '02 · HOME', 'A primeira tela',
     'Primeira pintura. Título, os dois botões de ação e o índice de cinco passos no lugar, e o '
     'modelo 3D mostrando apenas a camada que a planta já tem — outras três esperam fora de '
     'registro acima dela. O vazio acima da camada sólida é o argumento: faltam três camadas.',
     url='royalcitylabs.ca/en', chip=['Título + duas ações', 'Índice de cinco passos',
                                      'Modelo 3D em repouso'], toc='Home')

grid([(one('home-hero-s1'), '01 · AUDIT'), (one('home-hero-s2'), '02 · DIAGNOSE'),
      (one('home-hero-s3'), '03 · AUTOMATE'), (one('home-hero-s4'), '04 · CONNECT'),
      (one('home-hero-s5'), '05 · OPTIMIZE'), (one('home-hero-intro'), 'REPOUSO')],
     '02 · HOME', 'A narrativa dirigida pelo scroll',
     'Conforme o visitante desce a home, o título recolhe e os cinco passos de engenharia se '
     'abrem um a um — enquanto o modelo 3D se monta camada por camada: a planta existente, o '
     'diagnóstico da falha, a camada de controle, a rede, e por fim a analítica com o laço '
     'fechado. O laranja tem uma função só no site inteiro: marcar o passo descrito agora.',
     D, cols=3, url='royalcitylabs.ca/en')

shot('home-sec2', '02 · HOME', 'Os engenheiros, não o fornecedor',
     'Faixa de credibilidade sobre cards que viram: retrato, tempo de casa, função e credenciais '
     'na frente; a biografia completa no verso, ao passar o mouse ou tocar. <b>Os números da '
     'faixa são provisórios</b> e dependem de confirmação de vocês.',
     url='royalcitylabs.ca/en', part=band('home-sec2', 1))

shot('home-sec4', '02 · HOME', 'O sistema RCL',
     'Cinco passos, de máquinas a decisões. É o mesmo vocabulário que o modelo 3D do hero '
     'desenha, então a imagem no topo e a explicação mais abaixo se leem como um argumento só.',
     url='royalcitylabs.ca/en')

# 9–10 — Solutions
shot('solutions-fold', '03 · SOLUTIONS', 'Solutions',
     'A navegação principal marca a rota atual com um ponto laranja sob o rótulo, então quem cai '
     'aqui a partir de uma busca sabe onde está. A página lista as cinco disciplinas e entrega '
     'cada uma a uma rota de detalhe própria.',
     url='royalcitylabs.ca/en/solutions', toc='Solutions')

grid([(one('sol-control-fold'), 'CONTROL'), (one('sol-connect-fold'), 'CONNECT'),
      (one('sol-eng-fold'), 'ENGINEER'), (one('sol-dev-fold'), 'DEVELOP'),
      (one('sol-opt-fold'), 'OPTIMIZE')],
     '03 · SOLUTIONS', 'As cinco rotas de detalhe',
     'Controle industrial, conectividade industrial, engenharia industrial, software industrial e '
     'otimização avançada. Cada uma tem URL, title tag e meta description próprios, e quatro '
     'cards de capacidade específicos — dez rotas no total, contando o francês.',
     D, cols=3, url='royalcitylabs.ca/en/solutions/…')

# 11–12
shot('industries-sec1', '04 · INDUSTRIES', 'Dez setores, dez descrições',
     'Cada setor tem uma descrição distinta nos dois idiomas — os dez aparecem na miniatura da '
     'página 4. As descrições falam de capacidade e nunca alegam resultado, porque nenhum '
     'resultado foi aprovado para publicação ainda.',
     url='royalcitylabs.ca/en/industries', part=band('industries-sec1', 1), toc='Industries')

shot('approach-sec2', '05 · APPROACH', 'O que fica com vocês',
     'A pergunta que um diretor de operações realmente faz antes de assinar: documentação '
     'as-built, telas de operador, treinamento, código-fonte e licenças. <b>Este texto é uma '
     'proposta e precisa da revisão de vocês</b> — ele descreve como vocês trabalham.',
     url='royalcitylabs.ca/en/approach', toc='Approach')

# 13–15 — About
shot('about-fold', '06 · ABOUT', 'About',
     'A rota da credibilidade: quem são os engenheiros, as normas a que o trabalho responde, a '
     'prova de entrega bilíngue e o posicionamento entre a indústria tradicional e a Indústria '
     '4.0. CSA, IEC e ISO aparecem como referência de projeto, nunca como certificação.',
     url='royalcitylabs.ca/en/about', toc='About')

shot('about-sec3', '06 · ABOUT', 'Entrega bilíngue, demonstrada',
     'Em vez de alegar capacidade bilíngue, a página mostra: um painel de operador de exemplo com '
     'os rótulos em inglês e francês lado a lado, ao lado dos entregáveis que saem nos dois '
     'idiomas. É a diferença entre dizer e provar.',
     url='royalcitylabs.ca/en/about')

shot('team-grid-flipped', '06 · ABOUT', 'A equipe completa',
     'O grid de engenheiros com um card virado, como o visitante veria enquanto lê. <b>Os '
     'retratos são substitutos licenciados</b> até as fotos reais serem aprovadas; funções e '
     'credenciais são propostas para revisão de vocês.',
     url='royalcitylabs.ca/en/about', part=band('team-grid-flipped', 1))

# 16
shot('projects-sec1', '07 · PROJECTS', 'A estrutura de documentação',
     'Nenhum case foi inventado. A página apresenta a estrutura de cinco passos que todo relato '
     'de projeto segue — situação, diagnóstico, engenharia, comissionamento, resultado — e diz '
     'abertamente por que os números ainda não estão lá. Quando vocês aprovarem um projeto real, '
     'ele entra direto nesse formato.',
     url='royalcitylabs.ca/en/projects', toc='Projects')

# 17–18 — formulário
shot('form-empty', '08 · CONTACT', 'O formulário não é maquete',
     'Seis campos, dois obrigatórios. Os rótulos são permanentes — nunca placeholders que '
     'desaparecem assim que alguém digita. Todo campo é validado no servidor, o envio tem limite '
     'de taxa e triagem anti-bot, e o formulário funciona com o JavaScript desligado.',
     url='royalcitylabs.ca/en/contact', toc='Contact')

grid([(one('form-select-open'), 'SELETOR ABERTO'), (one('form-errors'), 'VALIDAÇÃO NO SERVIDOR'),
      (one('form-success-live'), 'CONFIRMAÇÃO')],
     '08 · CONTACT', 'O formulário em uso',
     'À esquerda: o seletor de desafio é um listbox próprio, operável por teclado, com os valores '
     'conferidos contra uma allow-list no servidor. No centro: um envio vazio — a validação roda '
     'no servidor, não só no navegador, e cada mensagem é anunciada a leitores de tela e '
     'traduzida por idioma; o que já foi digitado sobrevive ao erro. À direita: a confirmação, '
     'verificada de ponta a ponta contra um webhook real nesta revisão.',
     D, cols=3, url='royalcitylabs.ca/en/contact')

# 19–20 — tablet e celular
grid([(one('tab-home'), 'HOME · 900'), (one('tab-solutions'), 'SOLUTIONS · 900'),
      (one('tab768-approach'), 'APPROACH · 768'), (one('tab768-projects'), 'PROJECTS · 768')],
     '09 · TABLET', 'O layout muda de forma no tablet',
     'Entre 701 e 1100 pixels a navegação principal se recolhe no botão de menu, o hero se divide '
     'e os grids de várias colunas se reorganizam. Nos dois da direita, em 768 px, o grid de '
     'cinco passos dobra para duas colunas com o quinto passo ocupando a largura — antes desta '
     'revisão ele ficava cortado na borda.',
     'Tablet · 900 e 768 px', cols=4, wrapper='tablet', toc='Tablet e celular')

grid([(one('m-home-fold'), 'HOME'), (one('m-solutions-fold'), 'SOLUTIONS'),
      (one('m-industries-fold'), 'INDUSTRIES'), (one('m-about-fold'), 'ABOUT'),
      (one('m-contact-fold'), 'CONTACT'), (one('m-menu-open'), 'NAVEGAÇÃO'),
      (one('m-home-f4'), 'HOME · SCROLL'), (one('m-home-f9'), 'HOME · SCROLL'),
      (one('m-about-f6'), 'ABOUT · SCROLL'), (one('m-form'), 'FORMULÁRIO')],
     '09 · CELULAR', 'No celular',
     'Cinco rotas como carregam, o painel de navegação com a rota atual marcada e o botão EN ↔ FR '
     'no pé, e quatro telas mais abaixo nas páginas. No celular o hero apresenta o estado final '
     'em vez de animar, então nada depende de um gesto de scroll. A edição completa percorre as '
     'oito rotas inteiras, quadro por quadro.',
     'Celular · 430 × 932', cols=5, wrapper='phone')

# 21 — francês
grid([(one('fr-home'), 'ACCUEIL'), (one('fr-solutions'), 'SOLUTIONS'),
      (one('fr-about'), 'À PROPOS'), (one('fr-contact'), 'CONTACT')],
     '10 · FRANÇAIS', 'O site francês não é uma camada de tradução',
     'São doze rotas próprias, cada uma com URL, título, meta description e texto seus, servidas '
     'como fr-CA e pareadas com a rota inglesa por hreflang. Os rótulos do formulário, as opções '
     'do seletor e todas as mensagens de validação estão traduzidos. Trocar de idioma mantém o '
     'visitante na mesma página: /en/industries se torna /fr/industries.',
     D, cols=2, url='royalcitylabs.ca/fr/…', toc='Français')

# 22 — detalhes
bands([(20.0, [(one("nav-active-solutions"), 'A NAVEGAÇÃO MARCA A ROTA ATUAL', 'plain')]),
       (54.0, [(one("footer-desktop"), 'RODAPÉ, ANCORADO NAS TROCAS DE ROTA', 'plain')]),
       (68.0, [(one("team-card-front"), 'CARD — FRENTE', 'plain'),
               (one('team-card-back'), 'CARD — VERSO', 'plain')])],
      '11 · DETALHES', 'As partes que só existem em movimento',
      'A página atual fica mais forte, com fundo tingido e um ponto laranja sob o rótulo — a mesma '
      'convenção de laranja do modelo 3D; leitores de tela recebem aria-current="page" no mesmo '
      'link. O rodapé é ancorado, então não pisca quando o visitante navega. O card de engenheiro '
      'é um botão de verdade: funciona pelo teclado, e vira para a biografia no mouse ou no toque.',
      D, toc='Detalhes de interação')

# 23–26 — fechamento
textpage('RESUMO TÉCNICO', 'Sobre o que foi construído<span class="dot">.</span>', '''
<div class="cols2">
 <div>
  <h3>Stack</h3>
  <table class="spec">
   <tr><th>Framework</th><td>Next.js 16, App Router</td></tr>
   <tr><th>Interface</th><td>React 19, TypeScript (strict)</td></tr>
   <tr><th>3D</th><td>React Three Fiber + drei sobre three.js — geometria gerada em código, sem asset de megabytes</td></tr>
   <tr><th>Movimento</th><td>Framer Motion nas entradas; a própria View Transitions API do navegador nas trocas de rota</td></tr>
   <tr><th>Estilo</th><td>CSS escrito à mão sobre um sistema de tokens</td></tr>
   <tr><th>Tipografia</th><td>Exo 2 · Saira · Barlow, hospedadas no próprio domínio</td></tr>
  </table>
  <h3>Entrega e desempenho</h3>
  <p>As 24 rotas são pré-renderizadas como HTML estático no build, então a primeira pintura nunca
     espera servidor. As fontes vêm do domínio do cliente em vez do Google, o que elimina três
     idas e voltas antes do primeiro glifo. O hero 3D custa cerca de 29 draw calls e menos de
     3.000 triângulos, e o loop de render para por completo quando o modelo sai da tela.</p>
  <h3>O formulário</h3>
  <ul class="ticks">
   <li>Validado no servidor — as checagens do navegador são conveniência, não barreira</li>
   <li>Campo honeypot oculto e limite de cinco envios por dez minutos por endereço</li>
   <li>Funciona com o JavaScript desativado</li>
   <li>Entrega plugável: webhook (CRM, Zapier, Make, n8n, Slack) ou e-mail transacional</li>
  </ul>
 </div>
 <div>
  <h3>Acessibilidade</h3>
  <ul class="ticks">
   <li>Idioma correto no documento: <span class="mono">en-CA</span> / <span class="mono">fr-CA</span></li>
   <li><span class="mono">aria-current="page"</span> no link ativo, nas duas navegações</li>
   <li>Erros de formulário ligados aos campos com <span class="mono">aria-invalid</span> e <span class="mono">aria-describedby</span>, e anunciados</li>
   <li>Anel de foco visível em todo elemento interativo</li>
   <li>A narrativa inteira respeita <span class="mono">prefers-reduced-motion</span>: o modelo apresenta o estado final em vez de animar</li>
   <li>O modelo 3D tem alternativa textual traduzida; overlays decorativos ficam ocultos para leitores de tela</li>
  </ul>
  <h3>Encontrabilidade</h3>
  <ul class="ticks">
   <li>Title e meta description próprios nas 24 rotas</li>
   <li><span class="mono">hreflang</span> pareia cada rota inglesa com a gêmea francesa</li>
   <li>Dados estruturados de Organization (JSON-LD) em todas as páginas</li>
   <li><span class="mono">robots.txt</span> e <span class="mono">sitemap.xml</span> gerado</li>
   <li><span class="mono">/</span> redireciona para o idioma do próprio visitante</li>
  </ul>
  <p class="note">O contraste de cor é o único item aberto: 19 estilos de texto ficam abaixo do
     mínimo WCAG AA, o pior em 1,95:1. Tudo é legível — nada é invisível — e a causa são dois
     cinzas da marca usados em tamanhos pequenos. Ver a página seguinte.</p>
 </div>
</div>''', toc='Resumo técnico')

textpage('QUALIDADE', 'O que foi verificado, e o que apareceu<span class="dot">.</span>', '''
<p class="lede">Este documento foi produzido dirigindo o build de produção num navegador real, o que
   permitiu testar o que uma revisão de código não vê. Apareceram seis defeitos reais — dois deles
   conteúdo que ninguém conseguia ler — e todos os seis estão corrigidos e reverificados.</p>
<div class="cols2">
 <div>
  <h3>Defeitos encontrados e corrigidos</h3>
  <table class="spec faults">
   <tr><th>Projects, todas as larguras</th><td><b>As descrições da estrutura estavam invisíveis.</b>
       O padrão de cinco passos foi escrito para o fundo azul que ele usa na Home e em Approach —
       texto e filetes brancos — e Projects o coloca numa seção clara. Branco no branco.</td></tr>
   <tr><th>Sete seções, 14 rotas</th><td><b>Títulos em seção escura eram azul-marinho sobre
       azul-marinho.</b> A regra compartilhada de título e a específica do fundo escuro tinham o
       mesmo peso, e a compartilhada foi escrita depois — então venceu.</td></tr>
   <tr><th>About, celulares</th><td>O painel bilíngue ficava num split de duas colunas mais largo
       que qualquer celular, cortando a borda direita.</td></tr>
   <tr><th>About, celulares e tablets</th><td>Seis pastilhas de região continuavam seis em toda
       largura, empurrando "British Columbia" para fora da borda.</td></tr>
   <tr><th>Grids de cinco passos, 701–1100 px</th><td>Cinco colunas num espaço que cabe três
       cortavam o passo 05 em Approach, Projects e na home francesa.</td></tr>
   <tr><th>Troca de idioma, celulares</th><td>Uma regra que enxuga o header também escondia o
       botão dentro do painel de navegação — o único na tela naquela largura.</td></tr>
  </table>
 </div>
 <div>
  <h3>Verificações que passam</h3>
  <ul class="ticks">
   <li>Lint, TypeScript e build de produção: limpos</li>
   <li>As 24 rotas pré-renderizam; sem erro de rota e sem erro de runtime no console</li>
   <li><b>195 combinações</b> — 15 páginas × 13 larguras de viewport, de 360 px a 1920 px, nos dois
       idiomas — verificadas contra scroll horizontal e conteúdo cortado: nada restou</li>
   <li>A narrativa 3D renderiza e avança corretamente nos cinco estágios, nos dois idiomas</li>
   <li>O formulário entregou um lead de ponta a ponta a um endpoint webhook real</li>
   <li>Toda captura deste documento foi feita depois das correções, no mesmo build</li>
  </ul>
  <h3>Um item aberto: contraste</h3>
  <p>Uma varredura automática de todos os estilos de texto nas 15 páginas, nos dois idiomas, mediu
     contraste contra o WCAG AA. <b>19 estilos ficam abaixo do mínimo</b> — quatro deles abaixo de
     3:1, o pior em 1,95:1. Nada é invisível e nada disso é bug: é o cinza de subtexto da marca
     (<span class="mono">#A7B0BA</span>) entre 7 e 15 px, uma família de cinzas médios no corpo de
     texto e o laranja da marca em 11 px sobre branco.</p>
  <p>Zerar a lista significa escurecer dois ou três valores da paleta — decisão de marca, não de
     engenharia, então deixamos com vocês em vez de alterar o visual aprovado.</p>
  <p class="note">Todo o resto desta página foi corrigido de imediato, porque um título que ninguém
     lê não é questão de gosto.</p>
 </div>
</div>''', toc='Qualidade e verificação')

textpage('PRÓXIMOS PASSOS', 'O que precisamos de vocês<span class="dot">.</span>', '''
<p class="lede">O build está completo e o site funciona. O que falta é conteúdo e decisões que
   cabem a vocês — nada desta lista exige trabalho de engenharia, e nada disso impede uma decisão
   sobre a proposta.</p>
<div class="cols2">
 <div>
  <h3>Assets</h3>
  <table class="spec">
   <tr><th>Logo</th><td>O vetor oficial. O que aparece aqui é uma recriação cuidadosa na paleta da
       marca de 2026 — boa para avaliar, não para publicar.</td></tr>
   <tr><th>Retratos da equipe</th><td>Fotos da equipe real. Os atuais são substitutos licenciados,
       colocados para que o layout do card pudesse ser julgado com o espaço da foto preenchido.</td></tr>
   <tr><th>Favicon</th><td>Ícone de aba e ícones de app. Hoje não existem — o navegador pede e não
       recebe nada.</td></tr>
  </table>
  <h3>Conteúdo a confirmar</h3>
  <table class="spec">
   <tr><th>Nomes e credenciais</th><td>Nome, função e registro de cada engenheiro, para que os
       cards deixem de exibir uma função onde deveria haver um nome.</td></tr>
   <tr><th>Os números de credibilidade</th><td>Anos combinados de planta, engenheiros registrados,
       disciplinas em casa. Estão como placeholder no código e marcados como tal.</td></tr>
   <tr><th>LinkedIn</th><td>A URL da empresa e os perfis pessoais quando existirem. Hoje todos os
       botões caem no link da empresa, que não pôde ser verificado.</td></tr>
   <tr><th>Textos propostos</th><td>As dez descrições de setor e a lista "o que fica com vocês" em
       Approach descrevem como vocês trabalham. São nossa proposta e precisam da leitura de vocês.</td></tr>
  </table>
 </div>
 <div>
  <h3>Decisões</h3>
  <table class="spec">
   <tr><th>Para onde vão os leads</th><td>Um webhook de CRM ou automação, ou uma caixa de entrada
       para e-mail transacional. Uma variável de ambiente em qualquer um dos casos — a esteira está
       construída e testada.</td></tr>
   <tr><th>Domínio</th><td>O site está construído contra
       <span class="mono">royalcitylabs.ca</span>; confirmar isso, e se o francês fica no mesmo
       domínio.</td></tr>
   <tr><th>Redação sobre normas</th><td>CSA, IEC e ISO estão referenciadas como prática de projeto,
       nunca como certificação. Se vocês têm certificações e querem alegá-las, precisamos da
       documentação.</td></tr>
   <tr><th>Primeiros cases</th><td>Projects mostra de propósito a estrutura em vez de números
       inventados. Aprovem um ou dois projetos com números reais e eles entram direto nela.</td></tr>
   <tr><th>Contraste</th><td>Escurecer dois ou três cinzas da paleta para zerar a lista de
       acessibilidade, ou manter o visual como está.</td></tr>
  </table>
  <h3>O que não foi feito de propósito</h3>
  <p>Nenhuma métrica, certificação ou nome de cliente foi inventado em qualquer lugar do site. Todo
     número que aparece é estrutural — cinco disciplinas, dez setores, cinco passos — ou está
     marcado no código como placeholder esperando confirmação de vocês. É por isso que a página
     Projects tem uma estrutura onde um concorrente teria colocado porcentagens.</p>
 </div>
</div>''', toc='O que precisamos de vocês')

render('compact-pt.html')
