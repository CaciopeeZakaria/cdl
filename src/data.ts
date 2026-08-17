import type { Regle, Batch, Creance, Client, ConteneurRisque, Creneau, Norme, Stage, ResultatNorme, ValidationEvent, CauseChangement, FicheClientSection, PreAnalyseEngagement, ProcessusValidation, LigneClientTable, IdentificationClient } from './types';

export const conteneursRisque: ConteneurRisque[] = [
  { id: 'cr1', nom: 'Groupe Atlas Holding', type: 'Groupe', encoursTotal: 487_500_000, nombreClients: 12 },
  { id: 'cr2', nom: 'Portefeuille PME Région Nord', type: 'Portefeuille', encoursTotal: 156_800_000, nombreClients: 248 },
  { id: 'cr3', nom: 'Groupe Saham Industries', type: 'Groupe', encoursTotal: 312_400_000, nombreClients: 8 },
  { id: 'cr4', nom: 'Portefeuille Particuliers Premium', type: 'Portefeuille', encoursTotal: 89_200_000, nombreClients: 1240 },
  { id: 'cr5', nom: 'Groupe Marocaine de Distribution', type: 'Groupe', encoursTotal: 223_600_000, nombreClients: 15 },
];

export const regles: Regle[] = [
  {
    id: 'r1',
    nom: 'Défaut de paiement > 90 jours',
    description: 'Bascule en douteux dès dépassement de 90 jours d\'impayé continu',
    norme: 'IFRS9',
    active: true,
    priorite: 1,
    conditions: [
      { id: 'c1', champ: 'Jours d\'impayé', operateur: '≥', valeur: '90' },
      { id: 'c2', champ: 'Statut actuel', operateur: '≠', valeur: 'Perdu' },
    ],
    actions: [
      { id: 'a1', type: 'CLASSIFIER', stage: 'S3', description: 'Classifier en Stage 3 (Douteux)' },
      { id: 'a2', type: 'PROVISIONNER', taux: 50, description: 'Provisionner à 50%' },
    ],
    declenchements: 1247,
    dateModification: '2026-08-02',
  },
  {
    id: 'r2',
    nom: 'Pré-douteux 30–89 jours',
    description: 'Surveillance renforcée et provision IFRS 9 à 12 mois',
    norme: 'IFRS9',
    active: true,
    priorite: 2,
    conditions: [
      { id: 'c3', champ: 'Jours d\'impayé', operateur: '≥', valeur: '30' },
      { id: 'c4', champ: 'Jours d\'impayé', operateur: '<', valeur: '90' },
    ],
    actions: [
      { id: 'a3', type: 'CLASSIFIER', stage: 'S2', description: 'Classifier en Stage 2 (Pré-douteux)' },
      { id: 'a4', type: 'PROVISIONNER', taux: 15, description: 'Provisionner à 15%' },
    ],
    declenchements: 3892,
    dateModification: '2026-07-28',
  },
  {
    id: 'r3',
    nom: 'Créance saine < 30 jours',
    description: 'Encours sans retard significatif — Stage 1, provision à 1%',
    norme: 'IFRS9',
    active: true,
    priorite: 3,
    conditions: [
      { id: 'c5', champ: 'Jours d\'impayé', operateur: '<', valeur: '30' },
      { id: 'c6', champ: 'Statut actuel', operateur: '=', valeur: 'Sain' },
    ],
    actions: [
      { id: 'a5', type: 'CLASSIFIER', stage: 'S1', description: 'Classifier en Stage 1 (Sain)' },
      { id: 'a6', type: 'PROVISIONNER', taux: 1, description: 'Provisionner à 1%' },
    ],
    declenchements: 18_453,
    dateModification: '2026-08-05',
  },
  {
    id: 'r4',
    nom: 'Perte probable > 360 jours',
    description: 'Bascule en pertes sur créances irrécouvrables',
    norme: 'PRUDENTIEL',
    active: true,
    priorite: 1,
    conditions: [
      { id: 'c7', champ: 'Jours d\'impayé', operateur: '≥', valeur: '360' },
    ],
    actions: [
      { id: 'a7', type: 'CLASSIFIER', stage: 'S4', description: 'Classifier en Stage 4 (Perdu)' },
      { id: 'a8', type: 'PROVISIONNER', taux: 100, description: 'Provisionner à 100%' },
    ],
    declenchements: 184,
    dateModification: '2026-07-15',
  },
  {
    id: 'r5',
    nom: 'Douteux prudentiel 90–359 jours',
    description: 'Classification prudentielle BAM avec provision graduelle',
    norme: 'PRUDENTIEL',
    active: true,
    priorite: 2,
    conditions: [
      { id: 'c8', champ: 'Jours d\'impayé', operateur: '≥', valeur: '90' },
      { id: 'c9', champ: 'Jours d\'impayé', operateur: '<', valeur: '360' },
    ],
    actions: [
      { id: 'a9', type: 'CLASSIFIER', stage: 'S3', description: 'Classifier en Douteux' },
      { id: 'a10', type: 'PROVISIONNER', taux: 75, description: 'Provisionner à 75%' },
    ],
    declenchements: 893,
    dateModification: '2026-07-30',
  },
  {
    id: 'r6',
    nom: 'Pré-douteux prudentiel 30–89 jours',
    description: 'Surveillance prudentielle avec provision à 25%',
    norme: 'PRUDENTIEL',
    active: false,
    priorite: 3,
    conditions: [
      { id: 'c10', champ: 'Jours d\'impayé', operateur: '≥', valeur: '30' },
      { id: 'c11', champ: 'Jours d\'impayé', operateur: '<', valeur: '90' },
    ],
    actions: [
      { id: 'a11', type: 'CLASSIFIER', stage: 'S2', description: 'Classifier en Pré-douteux' },
      { id: 'a12', type: 'PROVISIONNER', taux: 25, description: 'Provisionner à 25%' },
    ],
    declenchements: 2104,
    dateModification: '2026-06-22',
  },
];

const facteursIFRS = (j: number) => [
  { label: 'Jours d\'impayé', valeur: `${j} j` },
  { label: 'Méthode', valeur: 'Perte attendue (12 mois / vie entière)' },
  { label: 'Probabilité de défaut', valeur: j >= 90 ? '12.4%' : j >= 30 ? '3.8%' : '0.9%' },
  { label: 'Loss Given Default', valeur: '45%' },
];

const facteursPrudentiel = (j: number) => [
  { label: 'Jours d\'impayé', valeur: `${j} j` },
  { label: 'Référentiel', valeur: 'Arrêté BAM — Classement des créances' },
  { label: 'Garanties retenues', valeur: j >= 360 ? '0%' : '32%' },
  { label: 'Provision nette', valeur: j >= 360 ? '100%' : j >= 90 ? '75%' : '25%' },
];

function makeResultats(j: number, encours: number, prev: Stage, regleIFRS: string, reglePrud: string): ResultatNorme[] {
  const stageIFRS = j >= 90 ? 'S3' : j >= 30 ? 'S2' : 'S1';
  const stagePrud = j >= 360 ? 'S4' : j >= 90 ? 'S3' : j >= 30 ? 'S2' : 'S1';
  const tauxIFRS = j >= 90 ? 50 : j >= 30 ? 15 : 1;
  const tauxPrud = j >= 360 ? 100 : j >= 90 ? 75 : j >= 30 ? 25 : 1;
  return [
    {
      norme: 'IFRS9',
      stageInitial: prev,
      stageFinal: stageIFRS as Stage,
      tauxProvision: tauxIFRS,
      montantProvision: Math.round(encours * tauxIFRS / 100),
      deltaProvision: Math.round(encours * tauxIFRS / 100) - Math.round(encours * 0.01),
      detail: {
        joursImpaye: j,
        statutPrecedent: prev,
        regleDeclenchee: regleIFRS,
        dateCalcul: '2026-08-10T04:30:00',
        tauxApplique: tauxIFRS,
        montantEncours: encours,
        provisionCalculee: Math.round(encours * tauxIFRS / 100),
        facteurs: facteursIFRS(j),
      },
    },
    {
      norme: 'PRUDENTIEL',
      stageInitial: prev,
      stageFinal: stagePrud as Stage,
      tauxProvision: tauxPrud,
      montantProvision: Math.round(encours * tauxPrud / 100),
      deltaProvision: Math.round(encours * tauxPrud / 100) - Math.round(encours * 0.01),
      detail: {
        joursImpaye: j,
        statutPrecedent: prev,
        regleDeclenchee: reglePrud,
        dateCalcul: '2026-08-10T04:30:00',
        tauxApplique: tauxPrud,
        montantEncours: encours,
        provisionCalculee: Math.round(encours * tauxPrud / 100),
        facteurs: facteursPrudentiel(j),
      },
    },
  ];
}

export const creances: Creance[] = [
  {
    id: 'cr1-1', reference: 'CR-2026-00124', clientId: 'cl1', clientNom: 'Atlas Transport SARL',
    conteneurRisqueId: 'cr1', conteneurRisqueNom: 'Groupe Atlas Holding',
    produit: 'Crédit de trésorerie', encours: 4_250_000, devise: 'MAD', dateOctroi: '2024-03-15', joursImpaye: 127,
    resultats: makeResultats(127, 4_250_000, 'S2', 'Défaut de paiement > 90 jours', 'Douteux prudentiel 90–359 jours'),
  },
  {
    id: 'cr1-2', reference: 'CR-2026-00187', clientId: 'cl2', clientNom: 'Atlas Logistique SA',
    conteneurRisqueId: 'cr1', conteneurRisqueNom: 'Groupe Atlas Holding',
    produit: 'Ligne de crédit documentaire', encours: 8_900_000, devise: 'MAD', dateOctroi: '2023-11-08', joursImpaye: 45,
    resultats: makeResultats(45, 8_900_000, 'S1', 'Pré-douteux 30–89 jours', 'Pré-douteux prudentiel 30–89 jours'),
  },
  {
    id: 'cr1-3', reference: 'CR-2026-00233', clientId: 'cl3', clientNom: 'Atlas BTP Industries',
    conteneurRisqueId: 'cr1', conteneurRisqueNom: 'Groupe Atlas Holding',
    produit: 'Crédit-bail immobilier', encours: 12_500_000, devise: 'MAD', dateOctroi: '2022-06-20', joursImpaye: 12,
    resultats: makeResultats(12, 12_500_000, 'S1', 'Créance saine < 30 jours', 'Créance saine < 30 jours'),
  },
  {
    id: 'cr2-1', reference: 'CR-2026-00345', clientId: 'cl4', clientNom: 'TechNord SARL',
    conteneurRisqueId: 'cr2', conteneurRisqueNom: 'Portefeuille PME Région Nord',
    produit: 'Découvert bancaire', encours: 1_200_000, devise: 'MAD', dateOctroi: '2025-01-12', joursImpaye: 67,
    resultats: makeResultats(67, 1_200_000, 'S1', 'Pré-douteux 30–89 jours', 'Pré-douteux prudentiel 30–89 jours'),
  },
  {
    id: 'cr2-2', reference: 'CR-2026-00412', clientId: 'cl5', clientNom: 'Médina Traders',
    conteneurRisqueId: 'cr2', conteneurRisqueNom: 'Portefeuille PME Région Nord',
    produit: 'Crédit de campagne', encours: 2_750_000, devise: 'MAD', dateOctroi: '2024-09-03', joursImpaye: 412,
    resultats: makeResultats(412, 2_750_000, 'S3', 'Perte probable > 360 jours', 'Perte probable > 360 jours'),
  },
  {
    id: 'cr2-3', reference: 'CR-2026-00488', clientId: 'cl6', clientNom: 'Nord Plastique SARL',
    conteneurRisqueId: 'cr2', conteneurRisqueNom: 'Portefeuille PME Région Nord',
    produit: 'Escompte commercial', encours: 850_000, devise: 'MAD', dateOctroi: '2025-04-22', joursImpaye: 0,
    resultats: makeResultats(0, 850_000, 'S1', 'Créance saine < 30 jours', 'Créance saine < 30 jours'),
  },
  {
    id: 'cr3-1', reference: 'CR-2026-00521', clientId: 'cl7', clientNom: 'Saham Steel Corp',
    conteneurRisqueId: 'cr3', conteneurRisqueNom: 'Groupe Saham Industries',
    produit: 'Crédit d\'investissement', encours: 22_000_000, devise: 'MAD', dateOctroi: '2021-02-14', joursImpaye: 95,
    resultats: makeResultats(95, 22_000_000, 'S2', 'Défaut de paiement > 90 jours', 'Douteux prudentiel 90–359 jours'),
  },
  {
    id: 'cr3-2', reference: 'CR-2026-00598', clientId: 'cl8', clientNom: 'Saham Chemicals SA',
    conteneurRisqueId: 'cr3', conteneurRisqueNom: 'Groupe Saham Industries',
    produit: 'Ligne de crédit revolving', encours: 5_400_000, devise: 'MAD', dateOctroi: '2024-07-30', joursImpaye: 28,
    resultats: makeResultats(28, 5_400_000, 'S1', 'Créance saine < 30 jours', 'Créance saine < 30 jours'),
  },
  {
    id: 'cr4-1', reference: 'CR-2026-00634', clientId: 'cl9', clientNom: 'M. Karim Benali',
    conteneurRisqueId: 'cr4', conteneurRisqueNom: 'Portefeuille Particuliers Premium',
    produit: 'Prêt hypothécaire', encours: 1_850_000, devise: 'MAD', dateOctroi: '2023-05-10', joursImpaye: 54,
    resultats: makeResultats(54, 1_850_000, 'S1', 'Pré-douteux 30–89 jours', 'Pré-douteux prudentiel 30–89 jours'),
  },
  {
    id: 'cr4-2', reference: 'CR-2026-00701', clientId: 'cl10', clientNom: 'Mme Leila Fassi',
    conteneurRisqueId: 'cr4', conteneurRisqueNom: 'Portefeuille Particuliers Premium',
    produit: 'Crédit consommation', encours: 320_000, devise: 'MAD', dateOctroi: '2025-02-18', joursImpaye: 5,
    resultats: makeResultats(5, 320_000, 'S1', 'Créance saine < 30 jours', 'Créance saine < 30 jours'),
  },
  {
    id: 'cr5-1', reference: 'CR-2026-00756', clientId: 'cl11', clientNom: 'Marocaine Distribution SA',
    conteneurRisqueId: 'cr5', conteneurRisqueNom: 'Groupe Marocaine de Distribution',
    produit: 'Crédit de trésorerie', encours: 9_800_000, devise: 'MAD', dateOctroi: '2024-11-25', joursImpaye: 156,
    resultats: makeResultats(156, 9_800_000, 'S2', 'Défaut de paiement > 90 jours', 'Douteux prudentiel 90–359 jours'),
  },
  {
    id: 'cr5-2', reference: 'CR-2026-00823', clientId: 'cl12', clientNom: 'DistriMaroc Logistique',
    conteneurRisqueId: 'cr5', conteneurRisqueNom: 'Groupe Marocaine de Distribution',
    produit: 'Crédit-bail matériel', encours: 3_600_000, devise: 'MAD', dateOctroi: '2024-01-08', joursImpaye: 38,
    resultats: makeResultats(38, 3_600_000, 'S1', 'Pré-douteux 30–89 jours', 'Pré-douteux prudentiel 30–89 jours'),
  },
];

export const clients: Client[] = [
  { id: 'cl1', nom: 'Atlas Transport SARL', clientNom: 'Atlas Transport SARL', segment: 'Entreprise', conteneurRisqueId: 'cr1', conteneurRisqueNom: 'Groupe Atlas Holding', encoursTotal: 4_250_000, nombreCreances: 1, notation: 'B+', resultats: creances[0].resultats },
  { id: 'cl2', nom: 'Atlas Logistique SA', clientNom: 'Atlas Logistique SA', segment: 'Entreprise', conteneurRisqueId: 'cr1', conteneurRisqueNom: 'Groupe Atlas Holding', encoursTotal: 8_900_000, nombreCreances: 1, notation: 'A-', resultats: creances[1].resultats },
  { id: 'cl3', nom: 'Atlas BTP Industries', clientNom: 'Atlas BTP Industries', segment: 'Entreprise', conteneurRisqueId: 'cr1', conteneurRisqueNom: 'Groupe Atlas Holding', encoursTotal: 12_500_000, nombreCreances: 1, notation: 'A', resultats: creances[2].resultats },
  { id: 'cl4', nom: 'TechNord SARL', clientNom: 'TechNord SARL', segment: 'Entreprise', conteneurRisqueId: 'cr2', conteneurRisqueNom: 'Portefeuille PME Région Nord', encoursTotal: 1_200_000, nombreCreances: 1, notation: 'BB', resultats: creances[3].resultats },
  { id: 'cl5', nom: 'Médina Traders', clientNom: 'Médina Traders', segment: 'Entreprise', conteneurRisqueId: 'cr2', conteneurRisqueNom: 'Portefeuille PME Région Nord', encoursTotal: 2_750_000, nombreCreances: 1, notation: 'CCC', resultats: creances[4].resultats },
  { id: 'cl6', nom: 'Nord Plastique SARL', clientNom: 'Nord Plastique SARL', segment: 'Entreprise', conteneurRisqueId: 'cr2', conteneurRisqueNom: 'Portefeuille PME Région Nord', encoursTotal: 850_000, nombreCreances: 1, notation: 'BBB', resultats: creances[5].resultats },
  { id: 'cl7', nom: 'Saham Steel Corp', clientNom: 'Saham Steel Corp', segment: 'Entreprise', conteneurRisqueId: 'cr3', conteneurRisqueNom: 'Groupe Saham Industries', encoursTotal: 22_000_000, nombreCreances: 1, notation: 'BB-', resultats: creances[6].resultats },
  { id: 'cl8', nom: 'Saham Chemicals SA', clientNom: 'Saham Chemicals SA', segment: 'Entreprise', conteneurRisqueId: 'cr3', conteneurRisqueNom: 'Groupe Saham Industries', encoursTotal: 5_400_000, nombreCreances: 1, notation: 'A+', resultats: creances[7].resultats },
  { id: 'cl9', nom: 'M. Karim Benali', clientNom: 'M. Karim Benali', segment: 'Particulier', conteneurRisqueId: 'cr4', conteneurRisqueNom: 'Portefeuille Particuliers Premium', encoursTotal: 1_850_000, nombreCreances: 1, notation: 'A-', resultats: creances[8].resultats },
  { id: 'cl10', nom: 'Mme Leila Fassi', clientNom: 'Mme Leila Fassi', segment: 'Particulier', conteneurRisqueId: 'cr4', conteneurRisqueNom: 'Portefeuille Particuliers Premium', encoursTotal: 320_000, nombreCreances: 1, notation: 'AA', resultats: creances[9].resultats },
  { id: 'cl11', nom: 'Marocaine Distribution SA', clientNom: 'Marocaine Distribution SA', segment: 'Entreprise', conteneurRisqueId: 'cr5', conteneurRisqueNom: 'Groupe Marocaine de Distribution', encoursTotal: 9_800_000, nombreCreances: 1, notation: 'B', resultats: creances[10].resultats },
  { id: 'cl12', nom: 'DistriMaroc Logistique', clientNom: 'DistriMaroc Logistique', segment: 'Entreprise', conteneurRisqueId: 'cr5', conteneurRisqueNom: 'Groupe Marocaine de Distribution', encoursTotal: 3_600_000, nombreCreances: 1, notation: 'BBB+', resultats: creances[11].resultats },
];

export const batches: Batch[] = [
  {
    id: 'b1', nom: 'Calcul mensuel IFRS 9 — Tous groupes', normes: ['IFRS9'], conteneurRisqueIds: ['cr1', 'cr2', 'cr3', 'cr4', 'cr5'],
    statut: 'TERMINE', dateExecution: '2026-08-10 04:30', duree: '12 min 34 s', creancesTraitees: 18_453, creancesModifiees: 1247, provisionTotale: 24_680_000, progression: 100,
  },
  {
    id: 'b2', nom: 'Calcul prudentiel BAM — Portefeuilles PME', normes: ['PRUDENTIEL'], conteneurRisqueIds: ['cr2', 'cr4'],
    statut: 'TERMINE', dateExecution: '2026-08-10 05:15', duree: '8 min 12 s', creancesTraitees: 1488, creancesModifiees: 893, provisionTotale: 18_240_000, progression: 100,
  },
  {
    id: 'b3', nom: 'Calcul multi-normes — Groupe Atlas', normes: ['IFRS9', 'PRUDENTIEL'], conteneurRisqueIds: ['cr1'],
    statut: 'EN_COURS', dateExecution: '2026-08-10 06:00', duree: '—', creancesTraitees: 8, creancesModifiees: 0, provisionTotale: 0, progression: 64,
  },
  {
    id: 'b4', nom: 'Calcul trimestriel IFRS 9 — Groupe Saham', normes: ['IFRS9'], conteneurRisqueIds: ['cr3'],
    statut: 'PLANIFIE', dateExecution: '2026-09-10 04:30', duree: '—', creancesTraitees: 0, creancesModifiees: 0, provisionTotale: 0, progression: 0,
  },
  {
    id: 'b5', nom: 'Calcul prudentiel — Groupe Marocaine Distribution', normes: ['PRUDENTIEL'], conteneurRisqueIds: ['cr5'],
    statut: 'ECHEC', dateExecution: '2026-08-09 03:00', duree: '2 min 08 s', creancesTraitees: 0, creancesModifiees: 0, provisionTotale: 0, progression: 0,
  },
];

export const creneaux: Creneau[] = [
  { id: 's1', normes: ['IFRS9'], conteneurRisqueIds: ['cr1', 'cr2', 'cr3', 'cr4', 'cr5'], frequence: 'Mensuelle', prochaineExecution: '2026-09-10', heure: '04:30', actif: true },
  { id: 's2', normes: ['PRUDENTIEL'], conteneurRisqueIds: ['cr2', 'cr4'], frequence: 'Hebdomadaire', prochaineExecution: '2026-08-17', heure: '22:00', actif: true },
  { id: 's3', normes: ['IFRS9', 'PRUDENTIEL'], conteneurRisqueIds: ['cr1'], frequence: 'Trimestrielle', prochaineExecution: '2026-10-01', heure: '06:00', actif: false },
];

export const CHAMPS_DISPONIBLES = [
  'Jours d\'impayé', 'Statut actuel', 'Encours total', 'Segment client', 'Notation interne',
  'Conteneur de risque', 'Produit de crédit', 'Date d\'octroi', 'Garanties', 'Ratio d\'endettement',
];

export const OPERATEURS = ['≥', '≤', '=', '≠', '<', '>', 'comprend', 'appartient à'];

// --- Cockpit mock data: validation history, causes, fiches, pre-analysis ---

export const validationsParClient: Record<string, ValidationEvent[]> = {
  cl1: [
    { id: 'v1', validateur: 'S. Alaoui', role: 'Analyste Risque Senior', date: '2026-08-11T09:14:00', statut: 'VALIDE', justificatif: 'Défaut confirmé, provision alignée sur IFRS 9.' },
    { id: 'v2', validateur: 'F. Bennani', role: 'Responsable Risque Crédit', date: '2026-08-11T14:22:00', statut: 'VALIDE', justificatif: 'Conforme à la politique de groupe.' },
    { id: 'v3', validateur: 'Comité Risque N3', role: 'Instance finale', date: '2026-08-12T10:00:00' },
  ],
  cl7: [
    { id: 'v4', validateur: 'M. Tazi', role: 'Gestionnaire de relation', date: '2026-08-10T08:30:00', statut: 'VALIDE', justificatif: 'Impayé > 90j vérifié, passage en douteux.' },
    { id: 'v5', validateur: 'Direction Zone Nord', role: 'Validateur N2', date: '2026-08-10T16:45:00', statut: 'REFUSE', justificatif: 'Demande de revue des garanties avant confirmation.' },
  ],
  cl11: [
    { id: 'v6', validateur: 'K. Idrissi', role: 'Analyste Risque', date: '2026-08-12T11:10:00', statut: 'VALIDE', justificatif: 'Contagion de groupe confirmée.' },
  ],
};

export const causesParClient: Record<string, CauseChangement> = {
  cl1: { label: 'Contagion', details: 'Portefeuille VW Grp Maroc' },
  cl7: { label: 'Défaut de paiement', details: 'Impayé > 90 jours continu' },
  cl11: { label: 'Contagion', details: 'Groupe Marocaine de Distribution' },
};

export const fichesParClient: Record<string, FicheClientSection[]> = {
  cl1: [
    { id: 'f1', titre: 'Identification', lignes: [
      { label: 'Raison sociale', valeur: 'Atlas Transport SARL' },
      { label: 'Segment', valeur: 'Entreprise — PME' },
      { label: 'Notation interne', valeur: 'B+' },
      { label: 'Conteneur de risque', valeur: 'Groupe Atlas Holding' },
    ] },
    { id: 'f2', titre: 'Garanties', lignes: [
      { label: 'Hypothèque', valeur: '2 500 000 MAD' },
      { label: 'Caution solidaire', valeur: '1 000 000 MAD' },
      { label: 'Couverture globale', valeur: '82%' },
    ] },
    { id: 'f3', titre: 'Classement des engagements', lignes: [
      { label: 'Encours total', valeur: '4 250 000 MAD' },
      { label: 'Nombre de créances', valeur: '1' },
      { label: 'Stage IFRS 9', valeur: 'S3 · Douteux' },
      { label: 'Stage Prudentiel', valeur: 'S3 · Douteux' },
    ] },
    { id: 'f4', titre: 'Groupement de contagion', lignes: [
      { label: 'Groupe', valeur: 'Atlas Holding' },
      { label: 'Membres', valeur: '12 entités' },
      { label: 'Encours groupe', valeur: '487 500 000 MAD' },
      { label: 'Entité déclencheuse', valeur: 'Atlas Transport SARL' },
    ] },
  ],
  cl7: [
    { id: 'f5', titre: 'Identification', lignes: [
      { label: 'Raison sociale', valeur: 'Saham Steel Corp' },
      { label: 'Segment', valeur: 'Entreprise — Corporate' },
      { label: 'Notation interne', valeur: 'BB-' },
      { label: 'Conteneur de risque', valeur: 'Groupe Saham Industries' },
    ] },
    { id: 'f6', titre: 'Garanties', lignes: [
      { label: 'Nantissement matériel', valeur: '8 000 000 MAD' },
      { label: 'Dépôt de garantie', valeur: '1 200 000 MAD' },
      { label: 'Couverture globale', valeur: '42%' },
    ] },
    { id: 'f7', titre: 'Classement des engagements', lignes: [
      { label: 'Encours total', valeur: '22 000 000 MAD' },
      { label: 'Nombre de créances', valeur: '1' },
      { label: 'Stage IFRS 9', valeur: 'S3 · Douteux' },
      { label: 'Stage Prudentiel', valeur: 'S3 · Douteux' },
    ] },
    { id: 'f8', titre: 'Groupement de contagion', lignes: [
      { label: 'Groupe', valeur: 'Saham Industries' },
      { label: 'Membres', valeur: '8 entités' },
      { label: 'Encours groupe', valeur: '312 400 000 MAD' },
      { label: 'Entité déclencheuse', valeur: 'Saham Steel Corp' },
    ] },
  ],
};

export const preAnalysesParCreance: Record<string, PreAnalyseEngagement> = {
  'cr1-1': { dateCalcul: '2026-08-10 04:30', joursImpaye: 127, encoursEvalue: 4_250_000, statutPrecedent: 'S2' },
  'cr3-1': { dateCalcul: '2026-08-10 04:30', joursImpaye: 95, encoursEvalue: 22_000_000, statutPrecedent: 'S2' },
  'cr5-1': { dateCalcul: '2026-08-10 04:30', joursImpaye: 156, encoursEvalue: 9_800_000, statutPrecedent: 'S2' },
};

export const BATCH_LABEL = 'Batch-12-08-2026';

export const PROCESSUS_VALIDATION: ProcessusValidation = {
  dateCreation: '10/08/2026',
  perimetre: 'Personnes Physiques / Professionnels',
  dateEffetBatch: '12/08/2026',
  affectation: 'Direction des Engagements - Zone Nord',
  affectationType: 'DIRECTION',
};

export const LIGNES_CLIENT_TABLE: LigneClientTable[] = [
  { clientId: 'cl1', clientNom: 'Atlas Transport SARL', conteneurNom: 'Groupe Atlas Holding', stageActuel: 'S2', stagePropose: 'S3', provisionActuelle: 637_500, provisionProposee: 2_125_000, cause: 'Contagion - Portefeuille VW Grp Maroc' },
  { clientId: 'cl7', clientNom: 'Saham Steel Corp', conteneurNom: 'Groupe Saham Industries', stageActuel: 'S2', stagePropose: 'S3', provisionActuelle: 3_300_000, provisionProposee: 16_500_000, cause: 'Impayé > 90j', statutValidation: 'REFUSE' },
  { clientId: 'cl11', clientNom: 'Marocaine Distribution SA', conteneurNom: 'Groupe Marocaine de Distribution', stageActuel: 'S2', stagePropose: 'S3', provisionActuelle: 1_470_000, provisionProposee: 4_900_000, cause: 'Contagion - Groupe Marocaine de Distribution', statutValidation: 'VALIDE' },
  { clientId: 'cl2', clientNom: 'Atlas Logistique SA', conteneurNom: 'Groupe Atlas Holding', stageActuel: 'S1', stagePropose: 'S2', provisionActuelle: 89_000, provisionProposee: 1_335_000, cause: 'Impayé 30–89j' },
  { clientId: 'cl4', clientNom: 'TechNord SARL', conteneurNom: 'Portefeuille PME Région Nord', stageActuel: 'S1', stagePropose: 'S2', provisionActuelle: 12_000, provisionProposee: 180_000, cause: 'Impayé 30–89j' },
  { clientId: 'cl5', clientNom: 'Médina Traders', conteneurNom: 'Portefeuille PME Région Nord', stageActuel: 'S3', stagePropose: 'S4', provisionActuelle: 2_062_500, provisionProposee: 2_750_000, cause: 'Impayé > 360j', statutValidation: 'VALIDE' },
  { clientId: 'cl9', clientNom: 'M. Karim Benali', conteneurNom: 'Portefeuille Particuliers Premium', stageActuel: 'S1', stagePropose: 'S2', provisionActuelle: 18_500, provisionProposee: 277_500, cause: 'Impayé 30–89j' },
  { clientId: 'cl5-2', clientNom: 'DistriMaroc Logistique', conteneurNom: 'Groupe Marocaine de Distribution', stageActuel: 'S1', stagePropose: 'S2', provisionActuelle: 36_000, provisionProposee: 540_000, cause: 'Impayé 30–89j' },
];

export const IDENTIFICATIONS_CLIENT: Record<string, IdentificationClient> = {
  cl1: { cin: 'RC 458721 / Casablanca', categorie: 'PME — Transport & Logistique', agence: 'Casablanca Finance City' },
  cl7: { cin: 'RC 993104 / Tanger', categorie: 'Corporate — Industrie', agence: 'Tanger Zone Portuaire' },
  cl11: { cin: 'RC 774512 / Rabat', categorie: 'Corporate — Distribution', agence: 'Rabat Centre' },
  cl2: { cin: 'RC 458722 / Casablanca', categorie: 'PME — Logistique', agence: 'Casablanca Finance City' },
  cl4: { cin: 'RC 612340 / Tétouan', categorie: 'PME — Services Tech', agence: 'Tétouan Nord' },
  cl5: { cin: 'RC 884521 / Fès', categorie: 'PME — Commerce', agence: 'Fès Médina' },
  cl9: { cin: 'CIN BE284567', categorie: 'Particulier Premium', agence: 'Casablanca Anfa' },
  'cl5-2': { cin: 'RC 774513 / Rabat', categorie: 'PME — Logistique', agence: 'Rabat Agdal' },
};

export const HEADER_METRICS = {
  nombreDossiers: 8,
  montantGlobalImpayes: 2_450_000,
  sensClassement: 'DECLASSEMENT' as 'DECLASSEMENT' | 'RECLASSEMENT',
};
