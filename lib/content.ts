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
        ['P.Eng.', 'Canadian-licensed engineers leading the work'],
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
    // CANADIAN IDENTITY — deliberately restrained: the home page only carries the leaf mark
    // (hero eyebrow) and the footer badge. The argument lives on /about, so the landing page
    // stays about the plant, not about the flag.
    canada: {
      badge: 'Proudly engineered in Canada',
      eyebrow: 'ROOTED IN CANADA',
      title: 'Canadian engineering, held to Canadian standards.',
      text: 'Being Canadian here is not a sticker. It is who is legally accountable for the drawings, which codes the design answers to, and the fact that your operators and your regulators can read the same documentation in their own language.',
      // ⚠️ PLACEHOLDER: "Royal City" is Guelph, Ontario's nickname — confirm the company's
      // registered city with the client before publishing, or drop this single line.
      originNote: 'The name comes from Guelph, Ontario — The Royal City.',
      points: [
        ['P.Eng.', 'Work led and sealed by engineers licensed by a Canadian provincial regulator — accountability that stays in the country.'],
        ['CSA · ISO', 'Designs built against the codes and standards your plant is actually audited to, not a foreign equivalent.'],
        ['EN · FR', 'Engineering delivered in both official languages: documentation, HMI screens and operator training included.'],
        ['On the floor', 'Engineers in Canadian time zones who can stand in front of the machine when it matters.'],
      ],
    },
    // /about page body. Metadata for the same route lives in `pages.about`.
    about: {
      eyebrow: 'ABOUT',
      title: 'Built by engineers.',
      titleAccent: 'Focused on outcomes.',
      human: { eyebrow: 'THE DIFFERENCE IS HUMAN', title: 'Multidisciplinary technical talent.' },
      bilingual: {
        eyebrow: 'TWO OFFICIAL LANGUAGES · ONE PLANT',
        title: 'The screen your operator reads is the screen your operator understands.',
        text: 'Canada runs plants in English and in French — often inside the same corporate group, sometimes inside the same building. We author the engineering package in both languages from the start: HMI screens, alarm text, drawings, procedures and floor training. Nothing critical gets discovered in translation after commissioning.',
        sampleLabel: 'Same alarm · two languages',
        sampleTag: 'P-101 · BEARING TEMP',
        sample: [['EN', 'Pump P-101 — bearing temperature high'], ['FR', 'Pompe P-101 — température de palier élevée']],
        items: [
          ['HMI & SCADA', 'Screens, tag descriptions and alarm text written bilingually from day one — not patched in after the plant is running.'],
          ['Documentation', 'Drawings, functional specifications and O&M manuals issued in the language the site actually works in.'],
          ['Training', 'Commissioning support and operator training delivered on site, in English or in French.'],
        ],
      },
      // ⚠️ PLACEHOLDER: confirm the regions actually served before publishing.
      presence: {
        eyebrow: 'WHERE WE WORK',
        title: 'Canadian plants, Canadian hours.',
        text: 'Engineering that travels to the plant floor, in the time zone the plant runs in.',
        regions: ['Ontario', 'Québec', 'Manitoba', 'Alberta', 'British Columbia', 'Atlantic Canada'],
      },
      position: {
        eyebrow: 'OUR POSITION',
        title: 'A bridge between traditional industry and Industry 4.0.',
        text: 'Most plants do not need a greenfield digital twin. They need the equipment they already own to run better — measured against the standards their own auditors recognize.',
        // ⚠️ Phrased as design references, not certifications. Do not upgrade this to a
        // certification claim (ISO 9001 registered, etc.) without documentation from the client.
        pillars: [
          ['Standards first', 'Designs referenced to CSA, IEC and ISO practice, so the result survives an audit and not just a commissioning day.'],
          ['Own the outcome', 'A named lead engineer carries the project from diagnosis to production — accountability with a licence attached.'],
          ['Modernize, not replace', 'Retrofit and integrate what already works before proposing anything with a capital request behind it.'],
          ['Data with a purpose', 'Instrumentation and IIoT chosen against a decision the plant needs to make, never against a dashboard.'],
        ],
      },
    },
    pages: {
      solutions: { title: 'Industrial Solutions', intro: 'Integrated engineering for control, connectivity, software and optimization.' },
      industries: { title: 'Industries', intro: 'Industrial engineering expertise adapted to the realities of each sector.' },
      approach: { title: 'Our Approach', intro: 'Assess. Connect. Engineer. Optimize. Support.' },
      about: { title: 'About Royal City Labs', intro: 'A Canadian engineering and automation company connecting industrial expertise with Industry 4.0.' },
      projects: { title: 'Projects', intro: 'A structure for future case studies: problem, diagnosis, engineering, implementation and outcome.' },
      contact: { title: 'Talk to an Engineer', intro: 'Tell us what needs to work better.' },
    },
    forms: {
      company: 'Company', industry: 'Industry', challenge: 'What are you trying to improve?',
      name: 'Name', email: 'Email', message: 'Message',
      send: 'Send request', sending: 'Sending…',
      selectOne: 'Select one', optional: 'optional',
      note: 'Accessible form · keyboard friendly · labelled fields · works without JavaScript.',
      successEyebrow: 'THANK YOU',
      successTitle: 'Request received.',
      successText: 'Your request is in. An engineer will review it and reply to the address you provided.',
      successAgain: 'Send another request',
      // Developer-facing note, shown only while no delivery endpoint is configured.
      localNote: 'Prototype delivery mode — the submission was validated and recorded on the server, but no delivery endpoint is configured yet. Set CONTACT_WEBHOOK_URL or RESEND_API_KEY to route leads to the real inbox or CRM.',
      errors: {
        required: 'This field is required.',
        email: 'Enter a valid email address.',
        tooLong: 'This answer is too long.',
        invalidChoice: 'Choose one of the listed options.',
        generic: 'Something went wrong sending your request. Please try again, or email us directly.',
        rate: 'Too many requests from this connection. Please try again in a few minutes.',
      },
    },
    // [value, label] — `value` is locale-independent and validated server-side (lib/leads.ts).
    challengeOptions: [
      ['downtime', 'Reduce downtime'],
      ['legacy', 'Modernize legacy systems'],
      ['automation', 'Improve automation'],
      ['data', 'Connect industrial data'],
      ['energy', 'Reduce energy consumption'],
      ['production', 'Optimize production'],
      ['other', 'Other'],
    ],
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
        ['ing.', 'Ingénieurs licenciés au Canada à la barre'],
        ['5', "Disciplines d'ingénierie à l'interne"],
        ['1', 'Ingénieur responsable nommé par projet'],
      ],
    },
    industries: { eyebrow: 'INDUSTRIES', title: 'Pour les secteurs qui font tourner les opérations.', items: ['Manufacturier', 'Chimie', 'Pétrole et gaz', 'Énergie', 'Mines', 'Traitement de l’eau', 'Pharmaceutique', 'Agriculture intelligente', 'Robotique', 'Réfrigération'] },
    results: { eyebrow: 'À QUOI RESSEMBLE LE PROGRÈS', title: "La technologie n’a de valeur que lorsque l’opération s’améliore.", items: [['MOINS', 'Arrêts'], ['MOINS', 'Gaspillage'], ['MOINS', 'Énergie'], ['PLUS', 'Visibilité'], ['PLUS', 'Fiabilité'], ['PLUS', 'Production']] },
    cta: { eyebrow: 'COMMENÇONS PAR LE PROBLÈME', title: 'Dites-nous ce que votre usine doit mieux faire.', text: 'Parlez directement à notre équipe d’ingénierie de modernisation, automatisation, données ou optimisation des procédés.', button: 'Parler à un ingénieur' },
    footer: { line: 'Ingénierie canadienne pour des opérations industrielles plus intelligentes.', rights: 'Royal City Process Control Labs.' },
    canada: {
      badge: 'Fièrement conçu au Canada',
      eyebrow: 'ENRACINÉ AU CANADA',
      title: 'Une ingénierie canadienne, aux normes canadiennes.',
      text: "Être canadien, ici, n'est pas un autocollant. C'est savoir qui est légalement responsable des plans, à quels codes la conception répond, et que vos opérateurs comme vos autorités peuvent lire la même documentation dans leur langue.",
      originNote: 'Le nom vient de Guelph, en Ontario — la « Royal City ».',
      points: [
        ['ing. / P.Eng.', "Des travaux dirigés et scellés par des ingénieurs licenciés par un ordre provincial canadien — une responsabilité qui reste au pays."],
        ['CSA · ISO', "Des conceptions fondées sur les codes et normes selon lesquels votre usine est réellement auditée, pas un équivalent étranger."],
        ['EN · FR', "Une ingénierie livrée dans les deux langues officielles : documentation, écrans IHM et formation des opérateurs inclus."],
        ['Sur le plancher', "Des ingénieurs dans les fuseaux horaires canadiens, capables de se tenir devant la machine au bon moment."],
      ],
    },
    about: {
      eyebrow: 'À PROPOS',
      title: 'Conçu par des ingénieurs.',
      titleAccent: 'Axé sur les résultats.',
      human: { eyebrow: 'LA DIFFÉRENCE EST HUMAINE', title: 'Un talent technique multidisciplinaire.' },
      bilingual: {
        eyebrow: 'DEUX LANGUES OFFICIELLES · UNE USINE',
        title: "L'écran que lit votre opérateur est l'écran qu'il comprend.",
        text: "Au Canada, les usines fonctionnent en anglais et en français — souvent dans le même groupe, parfois dans le même bâtiment. Nous rédigeons le dossier d'ingénierie dans les deux langues dès le départ : écrans IHM, textes d'alarme, plans, procédures et formation sur le plancher. Rien de critique ne se découvre en traduction après la mise en service.",
        sampleLabel: 'Même alarme · deux langues',
        sampleTag: 'P-101 · TEMP. DE PALIER',
        sample: [['EN', 'Pump P-101 — bearing temperature high'], ['FR', 'Pompe P-101 — température de palier élevée']],
        items: [
          ['IHM et SCADA', "Écrans, descriptions de points et textes d'alarme rédigés dans les deux langues dès le premier jour — pas corrigés après le démarrage."],
          ['Documentation', "Plans, spécifications fonctionnelles et manuels d'exploitation émis dans la langue de travail du site."],
          ['Formation', 'Soutien à la mise en service et formation des opérateurs sur place, en anglais ou en français.'],
        ],
      },
      presence: {
        eyebrow: 'OÙ NOUS TRAVAILLONS',
        title: 'Des usines canadiennes, aux heures canadiennes.',
        text: "Une ingénierie qui se déplace jusqu'au plancher d'usine, dans le fuseau horaire où l'usine opère.",
        regions: ['Ontario', 'Québec', 'Manitoba', 'Alberta', 'Colombie-Britannique', 'Canada atlantique'],
      },
      position: {
        eyebrow: 'NOTRE POSITION',
        title: "Un pont entre l'industrie traditionnelle et l'Industrie 4.0.",
        text: "La plupart des usines n'ont pas besoin d'un jumeau numérique en terrain vierge. Elles ont besoin que les équipements déjà en place fonctionnent mieux — selon les normes que leurs propres auditeurs reconnaissent.",
        pillars: [
          ['Les normes d’abord', 'Des conceptions appuyées sur les pratiques CSA, IEC et ISO, pour un résultat qui passe un audit et pas seulement une journée de mise en service.'],
          ['Assumer le résultat', "Un ingénieur responsable nommé porte le projet du diagnostic à la production — une responsabilité assortie d'un permis d'exercice."],
          ['Moderniser, pas remplacer', 'Moderniser et intégrer ce qui fonctionne déjà avant de proposer quoi que ce soit qui exige une demande de capital.'],
          ['Des données utiles', "Instrumentation et IIoT choisis en fonction d'une décision à prendre, jamais en fonction d'un tableau de bord."],
        ],
      },
    },
    pages: { solutions: { title: 'Solutions industrielles', intro: 'Une ingénierie intégrée pour le contrôle, la connectivité, les logiciels et l’optimisation.' }, industries: { title: 'Industries', intro: 'Une expertise adaptée aux réalités de chaque secteur industriel.' }, approach: { title: 'Notre approche', intro: 'Évaluer. Connecter. Concevoir. Optimiser. Soutenir.' }, about: { title: 'À propos de Royal City Labs', intro: 'Une entreprise canadienne d’ingénierie et d’automatisation qui relie l’expertise industrielle à l’Industrie 4.0.' }, projects: { title: 'Projets', intro: 'Une structure pour les études de cas futures : problème, diagnostic, ingénierie, mise en œuvre et résultat.' }, contact: { title: 'Parler à un ingénieur', intro: 'Dites-nous ce qui doit mieux fonctionner.' } },
    forms: {
      company: 'Entreprise', industry: 'Industrie', challenge: 'Que souhaitez-vous améliorer ?',
      name: 'Nom', email: 'Courriel', message: 'Message',
      send: 'Envoyer la demande', sending: 'Envoi en cours…',
      selectOne: 'Choisir une option', optional: 'facultatif',
      note: 'Formulaire accessible · navigation au clavier · champs étiquetés · fonctionne sans JavaScript.',
      successEyebrow: 'MERCI',
      successTitle: 'Demande reçue.',
      successText: 'Votre demande est enregistrée. Un ingénieur l’examinera et vous répondra à l’adresse fournie.',
      successAgain: 'Envoyer une autre demande',
      localNote: "Mode prototype — la soumission a été validée et enregistrée sur le serveur, mais aucun point de livraison n'est encore configuré. Définissez CONTACT_WEBHOOK_URL ou RESEND_API_KEY pour acheminer les demandes vers la boîte de réception ou le CRM.",
      errors: {
        required: 'Ce champ est obligatoire.',
        email: 'Saisissez une adresse courriel valide.',
        tooLong: 'Cette réponse est trop longue.',
        invalidChoice: 'Choisissez une des options proposées.',
        generic: "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous écrire directement.",
        rate: 'Trop de demandes depuis cette connexion. Veuillez réessayer dans quelques minutes.',
      },
    },
    challengeOptions: [
      ['downtime', 'Réduire les arrêts'],
      ['legacy', 'Moderniser les systèmes existants'],
      ['automation', 'Améliorer l’automatisation'],
      ['data', 'Connecter les données industrielles'],
      ['energy', 'Réduire la consommation d’énergie'],
      ['production', 'Optimiser la production'],
      ['other', 'Autre'],
    ],
  },
};

export function getContent(locale: string) {
  return content[locale === 'fr' ? 'fr' : 'en'];
}
