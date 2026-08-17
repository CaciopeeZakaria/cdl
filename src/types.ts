// CDL Domain Types — Classification & Provisionnement des Créances et Clients

export type Stage = 'S1' | 'S2' | 'S3' | 'S4';
export type StageInfo = { code: Stage; label: string; color: string; bg: string; dot: string };

export const STAGE_INFO: Record<Stage, StageInfo> = {
  S1: { code: 'S1', label: 'Sain', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-500/15', dot: 'bg-emerald-500' },
  S2: { code: 'S2', label: 'Pré-douteux', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-500/15', dot: 'bg-amber-500' },
  S3: { code: 'S3', label: 'Douteux', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-500/15', dot: 'bg-red-500' },
  S4: { code: 'S4', label: 'Perdu', color: 'text-rose-900 dark:text-rose-200', bg: 'bg-rose-200 dark:bg-rose-500/20', dot: 'bg-rose-700' },
};

export type Norme = 'IFRS9' | 'PRUDENTIEL';

export const NORME_INFO: Record<Norme, { label: string; full: string; accent: string }> = {
  IFRS9: { label: 'IFRS 9', full: 'Norme IFRS 9', accent: 'text-sky-600 dark:text-sky-400' },
  PRUDENTIEL: { label: 'Prudentiel', full: 'Norme Prudentielle (BAM)', accent: 'text-violet-600 dark:text-violet-400' },
};

export type TypeEntite = 'CREANCE' | 'CLIENT';

export type ConteneurRisque = {
  id: string;
  nom: string;
  type: 'Groupe' | 'Portefeuille';
  encoursTotal: number;
  nombreClients: number;
};

export type Condition = {
  id: string;
  champ: string;
  operateur: string;
  valeur: string;
};

export type ActionRegle = {
  id: string;
  type: 'CLASSIFIER' | 'PROVISIONNER';
  stage?: Stage;
  taux?: number;
  description: string;
};

export type Regle = {
  id: string;
  nom: string;
  description: string;
  norme: Norme;
  active: boolean;
  priorite: number;
  conditions: Condition[];
  actions: ActionRegle[];
  declenchements: number;
  dateModification: string;
};

export type StatutBatch = 'TERMINE' | 'EN_COURS' | 'PLANIFIE' | 'ECHEC';

export type DetailCalcul = {
  joursImpaye: number;
  statutPrecedent: Stage;
  regleDeclenchee: string;
  dateCalcul: string;
  tauxApplique: number;
  montantEncours: number;
  provisionCalculee: number;
  facteurs: { label: string; valeur: string }[];
};

export type ResultatNorme = {
  norme: Norme;
  stageInitial: Stage;
  stageFinal: Stage;
  tauxProvision: number;
  montantProvision: number;
  deltaProvision: number;
  detail: DetailCalcul;
};

export type Creance = {
  id: string;
  reference: string;
  clientId: string;
  clientNom: string;
  conteneurRisqueId: string;
  conteneurRisqueNom: string;
  produit: string;
  encours: number;
  devise: string;
  dateOctroi: string;
  joursImpaye: number;
  resultats: ResultatNorme[];
};

export type Client = {
  id: string;
  nom: string;
  clientNom: string;
  segment: 'Entreprise' | 'Particulier' | 'Institutionnel';
  conteneurRisqueId: string;
  conteneurRisqueNom: string;
  encoursTotal: number;
  nombreCreances: number;
  notation: string;
  resultats: ResultatNorme[];
};

export type Batch = {
  id: string;
  nom: string;
  normes: Norme[];
  conteneurRisqueIds: string[];
  statut: StatutBatch;
  dateExecution: string;
  duree: string;
  creancesTraitees: number;
  creancesModifiees: number;
  provisionTotale: number;
  progression: number;
};

export type Creneau = {
  id: string;
  normes: Norme[];
  conteneurRisqueIds: string[];
  frequence: 'Quotidienne' | 'Hebdomadaire' | 'Mensuelle' | 'Trimestrielle';
  prochaineExecution: string;
  heure: string;
  actif: boolean;
};

export type ViewMode = 'regles' | 'orchestrateur' | 'analyse' | 'workflows';
export type AnalyseVision = 'client' | 'creance';

// Validation history & decisions (CDL cockpit)

export type ValidationStatut = 'VALIDE' | 'REFUSE';

export const VALIDATION_INFO: Record<ValidationStatut, { label: string; badge: string; dot: string }> = {
  VALIDE: { label: '', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300', dot: 'bg-emerald-500' },
  REFUSE: { label: '', badge: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300', dot: 'bg-red-500' },
};

export type ValidationEvent = {
  id: string;
  validateur: string;
  role: string;
  date: string;
  statut?: ValidationStatut;
  justificatif?: string;
};

export type DecisionClassement = {
  classification: string;
  provision: string;
  autreClassification?: string;
  autreProvision?: string;
  justification: string;
};

export type CauseChangement = {
  label: string;
  details: string;
};

export type FicheClientSection = {
  id: string;
  titre: string;
  lignes: { label: string; valeur: string }[];
};

export type PreAnalyseEngagement = {
  dateCalcul: string;
  joursImpaye: number;
  encoursEvalue: number;
  statutPrecedent: Stage;
};

export type ProcessusValidation = {
  dateCreation: string;
  perimetre: string;
  dateEffetBatch: string;
  affectation: string;
  affectationType: 'SERVICE' | 'AGENT' | 'DIRECTION';
};

export type CategorieRisqueManuelle = 'Sain' | 'Sous-restructuré' | 'Pré-douteux' | 'Douteux' | 'Compromis';

export const CATEGORIES_RISQUE: CategorieRisqueManuelle[] = ['Sain', 'Sous-restructuré', 'Pré-douteux', 'Douteux', 'Compromis'];

export type LigneClientTable = {
  clientId: string;
  clientNom: string;
  conteneurNom: string;
  stageActuel: Stage;
  stagePropose: Stage;
  provisionActuelle: number;
  provisionProposee: number;
  cause: string;
  statutValidation?: ValidationStatut;
};

export type IdentificationClient = {
  cin: string;
  categorie: string;
  agence: string;
};

export type DecisionAction = 'ACCEPTER' | 'REFUSER' | null;

export type DecisionSimple = {
  action: DecisionAction;
  justification: string;
  pieceJointe: string | null;
};

// Workflow Builder — Validation des déclassements / reclassements CDL

export type WorkflowDirection = 'DECLASSEMENT' | 'RECLASSEMENT';

export const DIRECTION_INFO: Record<WorkflowDirection, { label: string; badge: string; dot: string }> = {
  DECLASSEMENT: { label: 'Déclassement', badge: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300', dot: 'bg-red-500' },
  RECLASSEMENT: { label: 'Reclassement', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300', dot: 'bg-emerald-500' },
};

export type GroupByOption = 'TYPE_CLIENT' | 'PORTEFEUILLE' | 'CATEGORIE_RISQUE' | 'AGENCE';

export const GROUPBY_LABELS: Record<GroupByOption, string> = {
  TYPE_CLIENT: 'Type de client',
  PORTEFEUILLE: 'Portefeuille',
  CATEGORIE_RISQUE: 'Catégorie de risque',
  AGENCE: 'Agence',
};

export type ActorType = 'INDIVIDU' | 'AGENCE' | 'ZONE' | 'UNITE';

export const ACTOR_TYPE_LABELS: Record<ActorType, string> = {
  INDIVIDU: 'Acteur individuel',
  AGENCE: 'Agence / Succursale',
  ZONE: 'Zone régionale',
  UNITE: 'Unité organisationnelle',
};

export type WorkflowStep = {
  id: string;
  sequence: number;
  actorType: ActorType;
  actorLabel: string;
  escalationActive: boolean;
  escalationDelay: number;
  notify: boolean;
};

export type WorkflowProcess = {
  id: string;
  nom: string;
  direction: WorkflowDirection;
  groupBy: GroupByOption;
  priorite: number;
  parentId: string | null;
  niveauxValidation: number;
  notificationSimple: boolean;
  actif: boolean;
  steps: WorkflowStep[];
  dateModification: string;
};
