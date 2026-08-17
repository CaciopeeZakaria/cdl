import { useState, useMemo } from 'react';
import {
    Search, Filter, Users, FileText, ArrowRight, ArrowUpDown, ChevronRight,
    X, Calendar, Clock, Target, Percent, Zap, Info, TrendingUp, TrendingDown, Camera,
    ChevronLeft, Globe, Flag, CheckCircle2, XCircle, Clock3, ShieldAlert, History,
    ClipboardList, Layers, Landmark, AlertTriangle, FileCheck2, Sliders,
    ChevronDown, Building2, UserCheck, Banknote, Eye, Paperclip, Wallet, ArrowDownCircle,
} from 'lucide-react';
import { creances, clients, conteneursRisque, validationsParClient, causesParClient, fichesParClient, preAnalysesParCreance, BATCH_LABEL, PROCESSUS_VALIDATION, LIGNES_CLIENT_TABLE, IDENTIFICATIONS_CLIENT, HEADER_METRICS } from '../data';
import type { Creance, Client, Norme, Stage, ResultatNorme, ValidationEvent, FicheClientSection, PreAnalyseEngagement, LigneClientTable, IdentificationClient, DecisionSimple, WorkflowDirection } from '../types';
import { STAGE_INFO, NORME_INFO, VALIDATION_INFO, DIRECTION_INFO } from '../types';
import { formatMAD } from '../theme';
import { StageBadge, StageTransition, ProvisionGauge } from './StageBadge';

export function AnalyseCDL() {
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="px-8 pt-7 pb-6 max-w-[1400px]">
                        <h1 className="font-display text-2xl font-extrabold text-gray-900 dark:text-white">Classement et Provisionnement</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Validation des propositions de déclassement et reclassement</p>

                        <ProcessContextPanel />

                        <ClientTable selectedId={selectedClientId} onSelect={setSelectedClientId} />
                    </div>
                </div>
            </div>

            {selectedClientId && <ClientDrawer clientId={selectedClientId} onClose={() => setSelectedClientId(null)} />}
        </div>
    );
}

// ============================== PROCESS CONTEXT PANEL ==============================

function ProcessContextPanel() {
    const p = PROCESSUS_VALIDATION;
    const affectationIcon = p.affectationType === 'DIRECTION' ? Building2 : p.affectationType === 'AGENT' ? UserCheck : Banknote;
    const dirInfo = DIRECTION_INFO[HEADER_METRICS.sensClassement];

    return (
        <section className="card p-5 mt-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                    <div className="text-[10px] uppercase tracking-[0.15em] text-brand-600 dark:text-brand-400 font-bold">Contexte</div>
                    <h2 className="text-sm font-bold text-gray-800 dark:text-slate-200">Processus de validation actuel</h2>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <ProcessParam icon={Calendar} label="Date de création" value={p.dateCreation} />
                <ProcessParam icon={Users} label="Type de client / Périmètre" value={p.perimetre} />
                <ProcessParam icon={Clock} label="Date effet batch" value={p.dateEffetBatch} />
                <ProcessParam icon={affectationIcon} label="Affectation de validation" value={p.affectation} highlight />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <MetricCard icon={Layers} label="Dossiers à valider" value={`${HEADER_METRICS.nombreDossiers} dossiers`} tone="brand" />
                <MetricCard icon={Wallet} label="Montant global des impayés" value={formatMAD(HEADER_METRICS.montantGlobalImpayes)} tone="amber" />
                <MetricCard icon={ArrowDownCircle} label="Sens de classement" value={dirInfo.label} tone={HEADER_METRICS.sensClassement === 'DECLASSEMENT' ? 'red' : 'green'} />
            </div>
        </section>
    );
}

function ProcessParam({ icon: Icon, label, value, highlight }: { icon: typeof Calendar; label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`rounded-xl p-3 border flex items-start gap-3 ${highlight ? 'border-brand-200 dark:border-brand-500/20 bg-brand-50/50 dark:bg-brand-500/5' : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40'}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${highlight ? 'bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-bold">{label}</div>
                <div className={`text-xs font-bold ${highlight ? 'text-brand-700 dark:text-brand-300' : 'text-gray-800 dark:text-slate-200'} leading-snug`}>{value}</div>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value, tone }: { icon: typeof Layers; label: string; value: string; tone: 'brand' | 'amber' | 'red' | 'green' }) {
    const tones: Record<string, { border: string; bg: string; iconBg: string; text: string }> = {
        brand: { border: 'border-brand-200 dark:border-brand-500/20', bg: 'bg-brand-50/50 dark:bg-brand-500/5', iconBg: 'bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400', text: 'text-brand-700 dark:text-brand-300' },
        amber: { border: 'border-amber-200 dark:border-amber-500/20', bg: 'bg-amber-50/50 dark:bg-amber-500/5', iconBg: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400', text: 'text-amber-700 dark:text-amber-300' },
        red: { border: 'border-red-200 dark:border-red-500/20', bg: 'bg-red-50/50 dark:bg-red-500/5', iconBg: 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400', text: 'text-red-700 dark:text-red-300' },
        green: { border: 'border-emerald-200 dark:border-emerald-500/20', bg: 'bg-emerald-50/50 dark:bg-emerald-500/5', iconBg: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', text: 'text-emerald-700 dark:text-emerald-300' },
    };
    const t = tones[tone];
    return (
        <div className={`rounded-xl p-3.5 border flex items-center gap-3 ${t.border} ${t.bg}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.iconBg}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-bold">{label}</div>
                <div className={`text-sm font-extrabold ${t.text} leading-tight`}>{value}</div>
            </div>
        </div>
    );
}

// ============================== CLIENT DATA TABLE ==============================

function ClientTable({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
    const [search, setSearch] = useState('');
    const [filterStage, setFilterStage] = useState<Stage | 'ALL'>('ALL');
    const [filterStatut, setFilterStatut] = useState<string>('ALL');

    const filtered = useMemo(() => LIGNES_CLIENT_TABLE.filter((row) => {
        const q = search.toLowerCase();
        const matchSearch = !q || row.clientNom.toLowerCase().includes(q) || row.conteneurNom.toLowerCase().includes(q);
        const matchStage = filterStage === 'ALL' || row.stagePropose === filterStage;
        const matchStatut = filterStatut === 'ALL' || row.statutValidation === filterStatut;
        return matchSearch && matchStage && matchStatut;
    }), [search, filterStage, filterStatut]);

    return (
        <section className="mt-5">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h2 className="font-display text-base font-bold text-gray-900 dark:text-white">Clients à valider</h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{filtered.length} client{filtered.length > 1 ? 's' : ''} dans ce batch</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="input-base pl-9 py-2 text-xs w-56" />
                    </div>
                    <select value={filterStage} onChange={(e) => setFilterStage(e.target.value as Stage | 'ALL')} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer">
                        <option value="ALL">Tous stages</option>
                        {(['S1', 'S2', 'S3', 'S4'] as Stage[]).map((s) => <option key={s} value={s}>{STAGE_INFO[s].code} · {STAGE_INFO[s].label}</option>)}
                    </select>
                    <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer">
                        <option value="ALL">Tous statuts</option>
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="VALIDE">Validé</option>
                        <option value="REFUSE">Refusé</option>
                    </select>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full min-w-[1100px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-700 text-[10px] uppercase tracking-[0.1em] font-bold text-gray-400 dark:text-slate-500">
                                <th className="px-4 py-3 text-left">Client</th>
                                <th className="px-4 py-3 text-left">Impayé</th>
                                <th className="px-4 py-3 text-left">Statut Actuel → Proposé</th>
                                <th className="px-4 py-3 text-right">Provision Actuelle → Proposée</th>
                                <th className="px-4 py-3 text-left">Cause / Règle</th>
                                <th className="px-4 py-3 text-left">Avis</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/40">
                            {filtered.map((row) => (
                                <tr
                                    key={row.clientId}
                                    onClick={() => onSelect(row.clientId)}
                                    className={`cursor-pointer transition ${selectedId === row.clientId ? 'bg-brand-50/60 dark:bg-brand-500/5' : 'hover:bg-gray-50/80 dark:hover:bg-slate-800/30'}`}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-gray-800 dark:text-slate-200 truncate">{row.clientNom}</div>
                                                <div className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{row.conteneurNom}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-bold text-gray-800 dark:text-slate-200">{formatMAD(row.provisionProposee + 1000)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`chip ${STAGE_INFO[row.stageActuel].bg} ${STAGE_INFO[row.stageActuel].color} text-[10px] px-1.5 py-0.5`}>{STAGE_INFO[row.stageActuel].code}</span>
                                            <ArrowRight className="w-3 h-3 text-gray-300 dark:text-slate-600" />
                                            <span className={`chip ${STAGE_INFO[row.stagePropose].bg} ${STAGE_INFO[row.stagePropose].color} text-[10px] px-1.5 py-0.5 font-bold`}>{STAGE_INFO[row.stagePropose].code}</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-slate-400">
                                        <div className="flex gap-2">
                                            {formatMAD(row.provisionActuelle)}
                                            {row.provisionProposee > row.provisionActuelle && <TrendingUp className="w-3 h-3 text-red-500 inline ml-1" />}
                                            <span className="text-xs font-bold text-gray-800 dark:text-slate-200">{formatMAD(row.provisionProposee)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-gray-600 dark:text-slate-400">{row.cause}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.statutValidation && <span className={`chip ${VALIDATION_INFO[row.statutValidation].badge} text-[10px]`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${VALIDATION_INFO[row.statutValidation].dot}`} />
                                            {VALIDATION_INFO[row.statutValidation].label}
                                        </span>}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={(e) => { e.stopPropagation(); onSelect(row.clientId); }} className="btn-ghost text-xs py-1.5 px-2.5">
                                            <Eye className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="py-12 text-center text-sm text-gray-400 dark:text-slate-500">
                        <Search className="w-7 h-7 mx-auto mb-2 opacity-50" />
                        Aucun client ne correspond à vos filtres.
                    </div>
                )}
            </div>
        </section>
    );
}

// ============================== CLIENT DRAWER (SIDE PANEL) ==============================

function ClientDrawer({ clientId, onClose }: { clientId: string; onClose: () => void }) {
    const client = clients.find((c) => c.id === clientId) ?? clients[0];
    const clientCreances = creances.filter((c) => c.clientId === clientId);
    const ifrs = client.resultats.find((r) => r.norme === 'IFRS9')!;
    const prud = client.resultats.find((r) => r.norme === 'PRUDENTIEL')!;
    const cause = causesParClient[clientId];
    const validations = validationsParClient[clientId] ?? [];
    const fiches = fichesParClient[clientId] ?? [];
    const tableRow = LIGNES_CLIENT_TABLE.find((r) => r.clientId === clientId);
    const identification = IDENTIFICATIONS_CLIENT[clientId];

    const [openSection, setOpenSection] = useState<string | null>('statut');
    const [modalCreanceId, setModalCreanceId] = useState<string | null>(null);
    const [decision, setDecision] = useState<DecisionSimple>({ action: null, justification: '', pieceJointe: null });

    function toggle(id: string) { setOpenSection(openSection === id ? null : id); }

    // Split fiches into categories
    const ficheIdentification = fiches.find((f) => f.titre === 'Identification');
    const ficheClassement = fiches.find((f) => f.titre === 'Classement des engagements');
    const ficheGaranties = fiches.find((f) => f.titre === 'Garanties');
    const ficheContagion = fiches.find((f) => f.titre === 'Groupement de contagion');

    return (
        <>
            <aside className="w-[60%] max-w-[920px] shrink-0 h-screen border-l border-gray-200 dark:border-slate-700/60 bg-gray-50 dark:bg-slate-900/50 flex flex-col animate-slide-in-right">
                {/* Drawer header — Identification + Classement overview integrated */}
                <div className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                {tableRow?.statutValidation && <span className={`chip ${VALIDATION_INFO[tableRow?.statutValidation].badge} text-[10px]`}>
                                    {VALIDATION_INFO[tableRow?.statutValidation].label}
                                </span>}
                                {tableRow && (
                                    <span className="chip bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-[10px]">
                                        {STAGE_INFO[tableRow.stageActuel].code} → {STAGE_INFO[tableRow.stagePropose].code}
                                    </span>
                                )}
                            </div>
                            <h2 className="font-display text-lg font-extrabold text-gray-900 dark:text-white truncate">{client.nom}</h2>
                            <div className="text-[11px] text-gray-400 dark:text-slate-500 font-mono">{client.id} · {client.conteneurRisqueNom}</div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition shrink-0">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Identification Client */}
                    {identification && (
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            <HeaderInfoChip icon={FileText} label="CIN / RC" value={identification.cin} />
                            <HeaderInfoChip icon={Users} label="Catégorie" value={identification.categorie} />
                            <HeaderInfoChip icon={Building2} label="Agence" value={identification.agence} />
                        </div>
                    )}

                    {/* Classement des engagements overview */}
                    {ficheClassement && (
                        <div className="mt-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 p-2.5">
                            <div className="text-[9px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-bold mb-1.5">Classement des engagements</div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {ficheClassement.lignes.map((l, i) => (
                                    <div key={i}>
                                        <div className="text-[9px] text-gray-400 dark:text-slate-500">{l.label}</div>
                                        <div className="text-[11px] font-bold text-gray-800 dark:text-slate-200">{l.valeur}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Drawer body — strict section order */}
                <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-3">
                    {/* 1. Changement de statut + integrated decision */}
                    <DrawerAccordion id="statut" icon={ArrowUpDown} title="Changement de statut" open={openSection === 'statut'} onToggle={() => toggle('statut')}>
                        <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
                            <div className="flex items-center gap-3">
                                <div className="text-center">
                                    <div className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1.5 font-bold">État initial</div>
                                    <StageBadge stage={ifrs.stageInitial} size="sm" />
                                </div>
                                <ArrowRight className="w-6 h-6 text-gray-300 dark:text-slate-600" />
                                <div className="text-center">
                                    <div className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1.5 font-bold">Nouvel état</div>
                                    <StageBadge stage={ifrs.stageFinal} size="sm" />
                                </div>
                            </div>
                            <div className="flex-1 sm:border-l sm:border-gray-200 dark:sm:border-slate-700 sm:pl-4 w-full">
                                <div className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-bold mb-1">Cause du changement</div>
                                {cause ? (
                                    <div className="flex items-start gap-2">
                                        <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                        <div>
                                            <div className="text-sm font-bold text-gray-800 dark:text-slate-200">{cause.label}</div>
                                            <div className="text-xs text-gray-500 dark:text-slate-400">{cause.details}</div>
                                        </div>
                                    </div>
                                ) : <div className="text-xs text-gray-400 dark:text-slate-500">Aucune cause enregistrée.</div>}
                            </div>
                        </div>

                        {/* Integrated decision block */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-3">
                                <ClipboardList className="w-3.5 h-3.5 text-brand-500" />
                                <span className="text-xs font-bold text-gray-700 dark:text-slate-300">Votre décision</span>
                            </div>
                            <DecisionBlock decision={decision} setDecision={setDecision} />
                        </div>
                    </DrawerAccordion>

                    {/* 2. Validations (Circuit des validations précédentes) */}
                    <DrawerAccordion id="hist" icon={History} title="Circuit des validations précédentes" open={openSection === 'hist'} onToggle={() => toggle('hist')}>
                        {validations.length === 0 ? (
                            <div className="text-xs text-gray-400 dark:text-slate-500 py-3">Aucune validation enregistrée.</div>
                        ) : (
                            <div className="space-y-3 pt-1">
                                {validations.map((v, i) => v.statut ? <ValidationTimelineRow key={v.id} event={v} last={i === validations.length - 1} /> : null)}
                            </div>
                        )}
                    </DrawerAccordion>

                    {/* 3. Engagements (isolated accordion) */}
                    <DrawerAccordion id="engagements" icon={Layers} title="Engagements / Créances" open={openSection === 'engagements'} onToggle={() => toggle('engagements')}>
                        <div className="space-y-2 pt-1">
                            {clientCreances.length === 0 && <div className="text-xs text-gray-400 dark:text-slate-500">Aucune créance active.</div>}
                            {clientCreances.map((c) => {
                                const ci = c.resultats.find((r) => r.norme === 'IFRS9')!;
                                return (
                                    <button key={c.id} onClick={() => setModalCreanceId(c.id)} className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-brand-400 hover:bg-brand-50/40 dark:hover:bg-brand-500/5 text-left flex items-center gap-3 transition group">
                                        <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center"><FileText className="w-4 h-4 text-gray-500" /></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[11px] font-mono text-gray-400 dark:text-slate-500">{c.reference}</div>
                                            <div className="text-sm font-bold text-gray-800 dark:text-slate-200">{c.produit}</div>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-3">
                                            <StageTransition from={ci.stageInitial} to={ci.stageFinal} />
                                            <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{formatMAD(c.encours)}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-brand-500" />
                                    </button>
                                );
                            })}
                        </div>
                    </DrawerAccordion>

                    {/* 4. Rest of details — Garanties, Contagion, Normes */}
                    <DrawerAccordion id="garanties" icon={ShieldAlert} title="Garanties" open={openSection === 'garanties'} onToggle={() => toggle('garanties')}>
                        {ficheGaranties ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 pt-1">
                                {ficheGaranties.lignes.map((l, i) => (
                                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-slate-700/40 last:border-0">
                                        <span className="text-[11px] text-gray-500 dark:text-slate-400">{l.label}</span>
                                        <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200">{l.valeur}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <div className="text-xs text-gray-400 dark:text-slate-500 py-3">Aucune garantie enregistrée.</div>}
                    </DrawerAccordion>

                    <DrawerAccordion id="contagion" icon={Users} title="Groupement de contagion" open={openSection === 'contagion'} onToggle={() => toggle('contagion')}>
                        {ficheContagion ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 pt-1">
                                {ficheContagion.lignes.map((l, i) => (
                                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-slate-700/40 last:border-0">
                                        <span className="text-[11px] text-gray-500 dark:text-slate-400">{l.label}</span>
                                        <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200">{l.valeur}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <div className="text-xs text-gray-400 dark:text-slate-500 py-3">Aucun groupement de contagion.</div>}
                    </DrawerAccordion>

                    <DrawerAccordion id="normes" icon={Globe} title="Normes IFRS vs BAM" open={openSection === 'normes'} onToggle={() => toggle('normes')}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pb-1.5 border-b border-sky-200 dark:border-sky-500/20">
                                    <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                    <span className="text-xs font-bold text-sky-700 dark:text-sky-300">IFRS 9</span>
                                </div>
                                <MiniRuleCard result={ifrs} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pb-1.5 border-b border-violet-200 dark:border-violet-500/20">
                                    <Flag className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                                    <span className="text-xs font-bold text-violet-700 dark:text-violet-300">BAM Prudentiel</span>
                                </div>
                                <MiniRuleCard result={prud} />
                            </div>
                        </div>
                    </DrawerAccordion>
                </div>
            </aside>

            {/* Debt inspection modal */}
            {modalCreanceId && <DebtModal creanceId={modalCreanceId} clientId={clientId} onClose={() => setModalCreanceId(null)} />}
        </>
    );
}

function HeaderInfoChip({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
    return (
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700 px-2.5 py-1.5">
            <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-bold">{label}</div>
                <div className="text-[11px] font-bold text-gray-800 dark:text-slate-200 truncate">{value}</div>
            </div>
        </div>
    );
}

// ============================== DEBT MODAL ==============================

function DebtModal({ creanceId, clientId, onClose }: { creanceId: string; clientId: string; onClose: () => void }) {
    const creance = creances.find((c) => c.id === creanceId)!;
    const client = clients.find((c) => c.id === clientId)!;
    const ifrs = creance.resultats.find((r) => r.norme === 'IFRS9')!;
    const prud = creance.resultats.find((r) => r.norme === 'PRUDENTIEL')!;
    const preAnalyse = preAnalysesParCreance[creanceId];

    const [openSection, setOpenSection] = useState<string | null>('statut');
    const [decision, setDecision] = useState<DecisionSimple>({ action: null, justification: '', pieceJointe: null });

    function toggle(id: string) { setOpenSection(openSection === id ? null : id); }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col animate-scale-in">
                {/* Modal header */}
                <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-700 flex items-start justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="chip bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-[10px]">
                                <FileText className="w-3 h-3" /> Créance
                            </span>
                            <span className={`chip ${STAGE_INFO[ifrs.stageFinal].bg} ${STAGE_INFO[ifrs.stageFinal].color} text-[10px]`}>
                                {STAGE_INFO[ifrs.stageFinal].code} · {STAGE_INFO[ifrs.stageFinal].label}
                            </span>
                        </div>
                        <h2 className="font-display text-lg font-extrabold text-gray-900 dark:text-white">{creance.reference}</h2>
                        <div className="text-xs text-gray-500 dark:text-slate-400">{creance.produit} · {client.nom}</div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Summary chips */}
                <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2 flex-wrap">
                    <span className="chip bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-[10px]"><Landmark className="w-3 h-3" /> {formatMAD(creance.encours)}</span>
                    <span className="chip bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px]"><AlertTriangle className="w-3 h-3" /> {creance.joursImpaye}j impayé</span>
                    <span className="chip bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[10px]"><Target className="w-3 h-3" /> IFRS: {ifrs.tauxProvision}%</span>
                    <span className="chip bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 text-[10px]"><Flag className="w-3 h-3" /> BAM: {prud.tauxProvision}%</span>
                </div>

                {/* Modal body — same section order as client drawer */}
                <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-3">
                    {/* Pre-analysis state */}
                    {preAnalyse && (
                        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Camera className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-[10px] uppercase tracking-wide font-bold text-gray-400 dark:text-slate-500">État d'engagement avant l'analyse</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <PreAnalyseItem label="Date de calcul" value={preAnalyse.dateCalcul} />
                                <PreAnalyseItem label="Jours d'impayé" value={`${preAnalyse.joursImpaye} j`} highlight />
                                <PreAnalyseItem label="Encours évalué" value={formatMAD(preAnalyse.encoursEvalue)} highlight />
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-bold">Statut précédent</span>
                                    <StageBadge stage={preAnalyse.statutPrecedent} size="sm" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 1. Changement de statut + decision */}
                    <DrawerAccordion id="statut" icon={ArrowUpDown} title="Changement de statut" open={openSection === 'statut'} onToggle={() => toggle('statut')}>
                        <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
                            <div className="flex items-center gap-3">
                                <div className="text-center">
                                    <div className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1.5 font-bold">État initial</div>
                                    <StageBadge stage={ifrs.stageInitial} size="sm" />
                                </div>
                                <ArrowRight className="w-6 h-6 text-gray-300 dark:text-slate-600" />
                                <div className="text-center">
                                    <div className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1.5 font-bold">Nouvel état</div>
                                    <StageBadge stage={ifrs.stageFinal} size="sm" />
                                </div>
                            </div>
                        </div>

                        {/* Dual-norm analysis inside statut section for debt */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <DualNormCard norme="IFRS" icon={Globe} result={ifrs} tone="sky" />
                            <DualNormCard norme="BAM" icon={Flag} result={prud} tone="violet" />
                        </div>

                        {/* Integrated decision */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-3">
                                <ClipboardList className="w-3.5 h-3.5 text-brand-500" />
                                <span className="text-xs font-bold text-gray-700 dark:text-slate-300">Votre décision (Au niveau Créance)</span>
                            </div>
                            <DecisionBlock decision={decision} setDecision={setDecision} />
                        </div>
                    </DrawerAccordion>

                    {/* 2. Validations */}
                    <DrawerAccordion id="hist" icon={History} title="Circuit des validations précédentes" open={openSection === 'hist'} onToggle={() => toggle('hist')}>
                        <div className="text-xs text-gray-400 dark:text-slate-500 py-3">Aucune validation enregistrée au niveau de cette créance.</div>
                    </DrawerAccordion>

                    {/* 3. Engagements */}
                    <DrawerAccordion id="engagements" icon={Layers} title="Détails de l'engagement" open={openSection === 'engagements'} onToggle={() => toggle('engagements')}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 pt-1">
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-slate-700/40">
                                <span className="text-[11px] text-gray-500 dark:text-slate-400">Référence</span>
                                <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200 font-mono">{creance.reference}</span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-slate-700/40">
                                <span className="text-[11px] text-gray-500 dark:text-slate-400">Produit</span>
                                <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200">{creance.produit}</span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-slate-700/40">
                                <span className="text-[11px] text-gray-500 dark:text-slate-400">Encours total</span>
                                <span className="text-[11px] font-bold text-gray-800 dark:text-slate-200">{formatMAD(creance.encours)}</span>
                            </div>
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-slate-700/40">
                                <span className="text-[11px] text-gray-500 dark:text-slate-400">Jours d'impayé</span>
                                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">{creance.joursImpaye} j</span>
                            </div>
                        </div>
                    </DrawerAccordion>
                </div>
            </div>
        </div>
    );
}

function PreAnalyseItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`rounded-lg p-2 border ${highlight ? 'border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60'}`}>
            <div className="text-[9px] uppercase tracking-wide text-gray-400 dark:text-slate-500 font-bold">{label}</div>
            <div className={`text-xs font-bold ${highlight ? 'text-amber-700 dark:text-amber-300' : 'text-gray-800 dark:text-slate-200'}`}>{value}</div>
        </div>
    );
}

// ============================== DECISION BLOCK (simplified Accept/Refuse) ==============================

function DecisionBlock({ decision, setDecision }: { decision: DecisionSimple; setDecision: (d: DecisionSimple) => void }) {
    return (
        <div className="space-y-3">
            {/* Primary action buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setDecision({ ...decision, action: 'ACCEPTER' })}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${decision.action === 'ACCEPTER' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'}`}
                >
                    <CheckCircle2 className="w-4 h-4" /> Accepter
                </button>
                <button
                    onClick={() => setDecision({ ...decision, action: 'REFUSER' })}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${decision.action === 'REFUSER' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20'}`}
                >
                    <XCircle className="w-4 h-4" /> Refuser
                </button>
            </div>

            {/* Accept confirmation */}
            {decision.action === 'ACCEPTER' && (
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 p-3 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">
                        <span className="font-bold">Décision confirmée.</span> Le statut et la provision proposés seront appliqués.
                    </div>
                </div>
            )}

            {/* Refuse — conditional fields */}
            {decision.action === 'REFUSER' && (
                <div className="space-y-3 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50/30 dark:bg-red-500/5 p-3">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 dark:text-slate-500 mb-1.5">
                            Justification <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={decision.justification}
                            onChange={(e) => setDecision({ ...decision, justification: e.target.value })}
                            placeholder="Expliquez les raisons du refus…"
                            rows={3}
                            className="input-base resize-none text-xs"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 dark:text-slate-500 mb-1.5">Pièce jointe</label>
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-slate-600 cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-brand-500/5 transition text-xs text-gray-500 dark:text-slate-400">
                                <Paperclip className="w-3.5 h-3.5" />
                                <span>{decision.pieceJointe ?? 'Joindre un document'}</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setDecision({ ...decision, pieceJointe: e.target.files?.[0]?.name ?? 'Document joint' })}
                                />
                            </label>
                            {decision.pieceJointe && (
                                <button onClick={() => setDecision({ ...decision, pieceJointe: null })} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================== SHARED COMPONENTS ==============================

function DrawerAccordion({ id, icon: Icon, title, open, onToggle, children }: { id: string; icon: typeof Sliders; title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
    return (
        <div className={`card overflow-hidden transition-all ${open ? 'ring-1 ring-brand-200 dark:ring-brand-500/20' : ''}`}>
            <button onClick={onToggle} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-slate-800/40 transition">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200">{title}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <div className="px-4 pb-4">{children}</div>}
        </div>
    );
}

function ValidationTimelineRow({ event, last }: { event: ValidationEvent; last: boolean }) {
    const info = VALIDATION_INFO[event.statut ?? "VALIDE"];
    const Icon = event.statut === 'VALIDE' ? CheckCircle2 : event.statut === 'REFUSE' ? XCircle : Clock3;
    const iconColor = event.statut === 'VALIDE' ? 'text-emerald-500' : event.statut === 'REFUSE' ? 'text-red-500' : 'text-amber-500';
    return (
        <div className="relative pl-7 pb-3">
            {!last && <div className="absolute left-[10px] top-6 bottom-0 w-px bg-gray-200 dark:bg-slate-700" />}
            <div className="absolute left-0 top-0.5 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 flex items-center justify-center">
                <Icon className={`w-3 h-3 ${iconColor}`} />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                    <div className="text-xs font-bold text-gray-800 dark:text-slate-200">{event.validateur}</div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500">{event.role}</div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">{new Date(event.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    <span className={`chip ${info.badge} text-[10px]`}>{info.label}</span>
                </div>
            </div>
            {event.justificatif && (
                <div className="mt-1.5 p-2 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60 text-[11px] text-gray-600 dark:text-slate-300">
                    <span className="font-bold text-gray-400 dark:text-slate-500">Justificatif : </span>{event.justificatif}
                </div>
            )}
        </div>
    );
}

function MiniRuleCard({ result }: { result: ResultatNorme }) {
    const d = result.detail;
    return (
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 p-3 space-y-2">
            <div className="flex items-center justify-center gap-2 py-1">
                <StageBadge stage={result.stageInitial} size="sm" />
                <ArrowRight className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                <StageBadge stage={result.stageFinal} size="sm" />
            </div>
            <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500 dark:text-slate-400">Provision</span>
                <span className="font-bold text-gray-800 dark:text-slate-200">{result.tauxProvision}% · {formatMAD(result.montantProvision)}</span>
            </div>
            <div className="flex items-start gap-1.5 pt-1.5 border-t border-gray-100 dark:border-slate-700/40">
                <Zap className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                <div>
                    <div className="text-[9px] uppercase tracking-wide font-bold text-gray-400 dark:text-slate-500">Règle déclenchée</div>
                    <div className="text-[11px] font-semibold text-gray-700 dark:text-slate-300">{d.regleDeclenchee}</div>
                </div>
            </div>
        </div>
    );
}

function DualNormCard({ norme, icon: Icon, result, tone }: { norme: string; icon: typeof Globe; result: ResultatNorme; tone: 'sky' | 'violet' }) {
    const d = result.detail;
    const toneClasses = tone === 'sky'
        ? { border: 'border-sky-200 dark:border-sky-500/20', bg: 'bg-sky-50/50 dark:bg-sky-500/5', text: 'text-sky-700 dark:text-sky-300', accent: 'text-sky-600 dark:text-sky-400', divider: 'border-sky-200/60 dark:border-sky-500/20' }
        : { border: 'border-violet-200 dark:border-violet-500/20', bg: 'bg-violet-50/50 dark:bg-violet-500/5', text: 'text-violet-700 dark:text-violet-300', accent: 'text-violet-600 dark:text-violet-400', divider: 'border-violet-200/60 dark:border-violet-500/20' };

    return (
        <div className={`rounded-xl border ${toneClasses.border} ${toneClasses.bg} p-3 space-y-2.5`}>
            <div className={`flex items-center gap-2 pb-1.5 border-b ${toneClasses.divider}`}>
                <Icon className={`w-4 h-4 ${toneClasses.accent}`} />
                <span className={`text-xs font-bold ${toneClasses.text}`}>{norme === 'IFRS' ? 'IFRS 9 / IFRS 7' : 'BAM (Prudentiel)'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
                <div className="text-center">
                    <StageBadge stage={result.stageInitial} size="sm" />
                    <div className="text-[9px] text-gray-400 dark:text-slate-500 mt-0.5">Initial</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 dark:text-slate-600" />
                <div className="text-center">
                    <StageBadge stage={result.stageFinal} size="sm" />
                    <div className="text-[9px] text-gray-400 dark:text-slate-500 mt-0.5">Final</div>
                </div>
            </div>
            <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500 dark:text-slate-400">Provision</span>
                <span className="font-bold text-gray-800 dark:text-slate-200">{result.tauxProvision}% · {formatMAD(result.montantProvision)}</span>
            </div>
            <div className={`flex items-start gap-1.5 pt-2 border-t ${toneClasses.divider}`}>
                <Zap className={`w-3.5 h-3.5 ${toneClasses.accent} mt-0.5 shrink-0`} />
                <div>
                    <div className="text-[9px] uppercase tracking-wide font-bold text-gray-400 dark:text-slate-500">Règle déclenchée</div>
                    <div className="text-[11px] font-semibold text-gray-700 dark:text-slate-300">{d.regleDeclenchee}</div>
                </div>
            </div>
        </div>
    );
}
