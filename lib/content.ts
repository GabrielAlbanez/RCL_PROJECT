export type Locale = 'en' | 'fr';

export const locales: Locale[] = ['en', 'fr'];

export const content = {
  en: {
    nav: { solutions: 'Solutions', industries: 'Industries', approach: 'Approach', about: 'About', projects: 'Projects', contact: 'Contact' },
    headerCta: 'Talk to an Engineer',
    hero: {
      eyebrow: 'CANADIAN INDUSTRIAL ENGINEERING · AUTOMATION · IIoT',
      title: 'Engineering better industrial performance.',
      text: 'From legacy systems to intelligent operations — we connect engineering, automation, software and data to make industrial processes perform better.',
      primary: 'Talk to an Engineer', secondary: 'Explore Solutions',
    },
    stats: [
      ['CONTROL', 'PLC · SCADA · HMI'],
      ['CONNECT', 'IIoT · INDUSTRIAL DATA'],
      ['OPTIMIZE', 'ANALYTICS · AI · ML'],
    ],
    problem: {
      eyebrow: 'THE INDUSTRIAL REALITY',
      title: "When the plant underperforms, the problem is rarely just one machine.",
      text: 'Obsolete systems, unplanned downtime, invisible data and disconnected equipment compound into lost capacity and unnecessary cost.',
      cards: [
        ['01', 'Legacy Systems', 'Modernize aging control systems without losing the operational knowledge already embedded in the plant.'],
        ['02', 'Unplanned Downtime', 'Identify failure points, improve reliability and bring better visibility to critical assets.'],
        ['03', 'Disconnected Data', 'Connect machines, controls and software so useful operational information can move where it matters.'],
        ['04', 'Resource Waste', 'Use automation and advanced analysis to reduce avoidable energy, material and process waste.'],
      ],
    },
    method: {
      eyebrow: 'THE RCL SYSTEM',
      title: 'From machines to decisions.',
      text: 'A connected engineering stack that moves the plant from isolated equipment to measurable, optimizable performance.',
      steps: [
        ['01', 'Machines', 'Sensors, drives, equipment and field devices'],
        ['02', 'Control', 'PLC, HMI and process control'],
        ['03', 'Connect', 'SCADA, IIoT and industrial integration'],
        ['04', 'Understand', 'Data, analytics and operational visibility'],
        ['05', 'Optimize', 'Advanced control, machine learning and AI'],
      ],
    },
    solutions: {
      eyebrow: 'SOLUTIONS',
      title: 'Engineering disciplines that work as one system.',
      text: 'The value is not a checklist of technologies. It is the ability to combine them around the operational problem.',
      items: [
        ['CONTROL', 'PLC · SCADA · HMI · Automation', 'Design, upgrade and troubleshoot control systems around the realities of your process.'],
        ['CONNECT', 'IIoT · Industrial Data · Integration', 'Connect equipment, systems and data sources into a usable operational layer.'],
        ['ENGINEER', 'Industrial Engineering · Troubleshooting', 'Solve complex industrial problems with multidisciplinary engineering support.'],
        ['DEVELOP', 'Industrial Software · Custom Systems', 'Build software and digital tools around your specific operation.'],
        ['OPTIMIZE', 'Advanced Control · ML · AI', 'Turn process and equipment data into actionable optimization opportunities.'],
      ],
    },
    human: {
      eyebrow: 'THE DIFFERENCE IS HUMAN',
      title: 'Technology changes fast. Engineering judgement matters longer.',
      text: 'RCL brings multidisciplinary technical talent across engineering, automation, software, data and optimization — so the system is designed around the plant, not around a buzzword.',
      button: 'Meet the team',
      quote: 'Built by engineers. Focused on outcomes.',
    },
    // PEOPLE / CREDIBILITY — the buyer is a company that wants to grow; the team is the proof.
    // ⚠️ trust[] numbers are PLACEHOLDERS: confirm with the client before publishing.
    team: {
      eyebrow: 'THE PEOPLE BEHIND THE SYSTEMS',
      title: "You're not hiring a vendor. You're hiring these engineers.",
      text: 'Growth exposes the plant. The companies that get through it are the ones with senior engineering judgement in the room — not a support ticket. Every RCL project is led by a named engineer with the credentials and the plant hours to own the outcome.',
      hint: 'Read the bio',
      hintBack: 'Back to photo',
      button: 'Meet the full team',
      linkedin: 'LinkedIn',
      trust: [
        ['75+', 'Years of combined plant experience'],
        ['P.Eng.', 'Licensed engineers leading the work'],
        ['5', 'Engineering disciplines in-house'],
        ['1', 'Named lead engineer per project'],
      ],
    },
    industries: {
      eyebrow: 'INDUSTRIES',
      title: 'Built for the industries that keep operations moving.',
      items: ['Manufacturing', 'Chemical', 'Oil & Gas', 'Energy', 'Mining', 'Water Treatment', 'Pharmaceutical', 'Smart Agriculture', 'Robotics', 'Refrigeration'],
    },
    results: {
      eyebrow: 'WHAT BETTER LOOKS LIKE',
      title: 'Technology is only valuable when the operation improves.',
      items: [['DOWN', 'Downtime'], ['DOWN', 'Waste'], ['DOWN', 'Energy Use'], ['UP', 'Visibility'], ['UP', 'Reliability'], ['UP', 'Production']],
    },
    cta: {
      eyebrow: 'START WITH THE PROBLEM',
      title: 'Tell us what your plant needs to do better.',
      text: 'Talk directly with an engineering team about modernization, automation, data or process optimization.',
      button: 'Talk to an Engineer',
    },
    footer: { line: 'Canadian engineering for smarter industrial operations.', rights: 'Royal City Process Control Labs.' },
    pages: {
      solutions: { title: 'Industrial Solutions', intro: 'Integrated engineering for control, connectivity, software and optimization.' },
      industries: { title: 'Industries', intro: 'Industrial engineering expertise adapted to the realities of each sector.' },
      approach: { title: 'Our Approach', intro: 'Assess. Connect. Engineer. Optimize. Support.' },
      about: { title: 'About Royal City Labs', intro: 'A Canadian engineering and automation company connecting industrial expertise with Industry 4.0.' },
      projects: { title: 'Projects', intro: 'A structure for future case studies: problem, diagnosis, engineering, implementation and outcome.' },
      contact: { title: 'Talk to an Engineer', intro: 'Tell us what needs to work better.' },
    },
    forms: { company: 'Company', industry: 'Industry', challenge: 'What are you trying to improve?', name: 'Name', email: 'Email', message: 'Message', send: 'Send request' },
    challengeOptions: ['Reduce downtime', 'Modernize legacy systems', 'Improve automation', 'Connect industrial data', 'Reduce energy consumption', 'Optimize production', 'Other'],
  },
  fr: {
    nav: { solutions: 'Solutions', industries: 'Industries', approach: 'Approche', about: 'À propos', projects: 'Projets', contact: 'Contact' },
    headerCta: 'Parler à un ingénieur',
    hero: {
      eyebrow: 'INGÉNIERIE INDUSTRIELLE CANADIENNE · AUTOMATISATION · IIoT',
      title: 'Pour une meilleure performance industrielle.',
      text: "Des systèmes existants aux opérations intelligentes — nous combinons ingénierie, automatisation, logiciels et données pour améliorer la performance des procédés industriels.",
      primary: 'Parler à un ingénieur', secondary: 'Voir les solutions',
    },
    stats: [['CONTRÔLER', 'PLC · SCADA · IHM'], ['CONNECTER', 'IIoT · DONNÉES INDUSTRIELLES'], ['OPTIMISER', 'ANALYTIQUE · IA · ML']],
    problem: {
      eyebrow: 'LA RÉALITÉ INDUSTRIELLE',
      title: "Quand l'usine sous-performe, le problème dépasse rarement une seule machine.",
      text: "Systèmes vieillissants, arrêts imprévus, données invisibles et équipements déconnectés se combinent pour réduire la capacité et augmenter les coûts.",
      cards: [
        ['01', 'Systèmes existants', 'Moderniser les systèmes de contrôle vieillissants sans perdre les connaissances opérationnelles déjà intégrées à l’usine.'],
        ['02', 'Arrêts imprévus', 'Identifier les points de défaillance, améliorer la fiabilité et renforcer la visibilité des actifs critiques.'],
        ['03', 'Données déconnectées', 'Connecter les équipements, contrôleurs et logiciels afin de faire circuler l’information utile.'],
        ['04', 'Gaspillage des ressources', 'Utiliser l’automatisation et l’analyse avancée pour réduire les pertes d’énergie, de matières et de processus.'],
      ],
    },
    method: { eyebrow: 'LE SYSTÈME RCL', title: 'Des machines aux décisions.', text: "Une architecture d’ingénierie connectée qui fait passer l’usine d’équipements isolés à une performance mesurable et optimisable.", steps: [['01', 'Machines', 'Capteurs, variateurs, équipements et dispositifs terrain'], ['02', 'Contrôle', 'PLC, IHM et contrôle de procédé'], ['03', 'Connexion', 'SCADA, IIoT et intégration industrielle'], ['04', 'Comprendre', 'Données, analytique et visibilité opérationnelle'], ['05', 'Optimiser', 'Contrôle avancé, apprentissage automatique et IA']] },
    solutions: { eyebrow: 'SOLUTIONS', title: 'Des disciplines d’ingénierie qui fonctionnent comme un seul système.', text: 'La valeur ne réside pas dans une simple liste de technologies, mais dans la capacité à les combiner autour du problème opérationnel.', items: [['CONTRÔLE', 'PLC · SCADA · IHM · Automatisation', 'Concevoir, moderniser et dépanner les systèmes de contrôle en fonction des réalités du procédé.'], ['CONNECTER', 'IIoT · Données industrielles · Intégration', 'Connecter les équipements, systèmes et sources de données dans une couche opérationnelle utile.'], ['INGÉNIERIE', 'Ingénierie industrielle · Dépannage', 'Résoudre des problèmes industriels complexes grâce à une expertise multidisciplinaire.'], ['DÉVELOPPER', 'Logiciels industriels · Systèmes sur mesure', 'Développer des logiciels et outils numériques adaptés à votre opération.'], ['OPTIMISER', 'Contrôle avancé · ML · IA', 'Transformer les données de procédés et d’équipements en opportunités d’optimisation concrètes.']] },
    human: { eyebrow: 'LA DIFFÉRENCE EST HUMAINE', title: "La technologie évolue vite. Le jugement d’ingénierie dure plus longtemps.", text: 'RCL réunit des talents techniques multidisciplinaires en ingénierie, automatisation, logiciels, données et optimisation — pour concevoir le système autour de l’usine, pas autour d’un mot à la mode.', button: 'Découvrir l’équipe', quote: 'Conçu par des ingénieurs. Axé sur les résultats.' },
    team: {
      eyebrow: 'LES GENS DERRIÈRE LES SYSTÈMES',
      title: "Vous n'engagez pas un fournisseur. Vous engagez ces ingénieurs.",
      text: "La croissance met l'usine à l'épreuve. Les entreprises qui la traversent sont celles qui ont un jugement d'ingénierie senior dans la salle — pas un billet de support. Chaque projet RCL est dirigé par un ingénieur nommé, avec les titres et les heures d'usine pour en assumer le résultat.",
      hint: 'Lire la biographie',
      hintBack: 'Retour à la photo',
      button: "Découvrir l'équipe complète",
      linkedin: 'LinkedIn',
      trust: [
        ['75+', "Années d'expérience combinée en usine"],
        ['ing.', 'Ingénieurs licenciés à la barre'],
        ['5', "Disciplines d'ingénierie à l'interne"],
        ['1', 'Ingénieur responsable nommé par projet'],
      ],
    },
    industries: { eyebrow: 'INDUSTRIES', title: 'Pour les secteurs qui font tourner les opérations.', items: ['Manufacturier', 'Chimie', 'Pétrole et gaz', 'Énergie', 'Mines', 'Traitement de l’eau', 'Pharmaceutique', 'Agriculture intelligente', 'Robotique', 'Réfrigération'] },
    results: { eyebrow: 'À QUOI RESSEMBLE LE PROGRÈS', title: "La technologie n’a de valeur que lorsque l’opération s’améliore.", items: [['MOINS', 'Arrêts'], ['MOINS', 'Gaspillage'], ['MOINS', 'Énergie'], ['PLUS', 'Visibilité'], ['PLUS', 'Fiabilité'], ['PLUS', 'Production']] },
    cta: { eyebrow: 'COMMENÇONS PAR LE PROBLÈME', title: 'Dites-nous ce que votre usine doit mieux faire.', text: 'Parlez directement à notre équipe d’ingénierie de modernisation, automatisation, données ou optimisation des procédés.', button: 'Parler à un ingénieur' },
    footer: { line: 'Ingénierie canadienne pour des opérations industrielles plus intelligentes.', rights: 'Royal City Process Control Labs.' },
    pages: { solutions: { title: 'Solutions industrielles', intro: 'Une ingénierie intégrée pour le contrôle, la connectivité, les logiciels et l’optimisation.' }, industries: { title: 'Industries', intro: 'Une expertise adaptée aux réalités de chaque secteur industriel.' }, approach: { title: 'Notre approche', intro: 'Évaluer. Connecter. Concevoir. Optimiser. Soutenir.' }, about: { title: 'À propos de Royal City Labs', intro: 'Une entreprise canadienne d’ingénierie et d’automatisation qui relie l’expertise industrielle à l’Industrie 4.0.' }, projects: { title: 'Projets', intro: 'Une structure pour les études de cas futures : problème, diagnostic, ingénierie, mise en œuvre et résultat.' }, contact: { title: 'Parler à un ingénieur', intro: 'Dites-nous ce qui doit mieux fonctionner.' } },
    forms: { company: 'Entreprise', industry: 'Industrie', challenge: 'Que souhaitez-vous améliorer ?', name: 'Nom', email: 'Courriel', message: 'Message', send: 'Envoyer la demande' },
    challengeOptions: ['Réduire les arrêts', 'Moderniser les systèmes existants', 'Améliorer l’automatisation', 'Connecter les données industrielles', 'Réduire la consommation d’énergie', 'Optimiser la production', 'Autre'],
  },
};

export function getContent(locale: string) {
  return content[locale === 'fr' ? 'fr' : 'en'];
}
