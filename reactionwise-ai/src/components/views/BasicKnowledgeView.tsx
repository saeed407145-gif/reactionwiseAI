import React, { useState } from 'react';
import {
  FUNCTIONAL_GROUPS,
  PKA_TABLE,
  HYBRIDIZATION_DATA,
  FunctionalGroupInfo,
} from '../../data/chemistryBasics';
import {
  BookOpen,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  Sliders,
  Layers,
  Compass,
  ArrowRight,
  Flame,
  HelpCircle,
  HelpCircle as QuestionIcon,
} from 'lucide-react';

export const BasicKnowledgeView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'functional-groups' | 'pka-ladder' | 'mechanism-rules' | 'hybridization' | 'stereochemistry'
  >('functional-groups');

  const [fgSearchQuery, setFgSearchQuery] = useState<string>('');
  const [selectedFg, setSelectedFg] = useState<FunctionalGroupInfo | null>(FUNCTIONAL_GROUPS[7]); // Aldehyde default
  const [selectedPkaIndex, setSelectedPkaIndex] = useState<number>(4); // Acetic acid

  // Filtered functional groups
  const filteredGroups = FUNCTIONAL_GROUPS.filter((fg) => {
    const q = fgSearchQuery.toLowerCase();
    return (
      fg.name.toLowerCase().includes(q) ||
      fg.iupacSuffix.toLowerCase().includes(q) ||
      fg.generalFormula.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">Chemistry Fundamentals & Knowledge Base</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Core Reference
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Essential reference guide: Functional groups, pKa acidity spectrum, arrow pushing rules, hybridization, and stereochemistry.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80">
          {[
            { id: 'functional-groups', label: '1. Functional Groups', icon: Layers },
            { id: 'pka-ladder', label: '2. Acid-Base & pKa Scale', icon: Sliders },
            { id: 'mechanism-rules', label: '3. Arrow Pushing Rules', icon: Zap },
            { id: 'hybridization', label: '4. Hybridization & Geometry', icon: Compass },
            { id: 'stereochemistry', label: '5. Stereochemistry Guide', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: FUNCTIONAL GROUPS COMPENDIUM */}
      {activeSubTab === 'functional-groups' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search functional groups, formulas, suffixes..."
                value={fgSearchQuery}
                onChange={(e) => setFgSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              Showing {filteredGroups.length} Functional Groups
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((fg) => {
              const isSelected = selectedFg?.id === fg.id;
              return (
                <div
                  key={fg.id}
                  onClick={() => setSelectedFg(fg)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 ring-1 ring-cyan-500 shadow-xl shadow-cyan-500/10'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-100 text-sm">{fg.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                      {fg.iupacSuffix}
                    </span>
                  </div>

                  {/* Formula Box */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-center text-xs text-amber-300 font-bold">
                    {fg.structureRepresentation}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{fg.reactivitySummary}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>IR: {fg.irFrequency.split('(')[0]}</span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Group Detail Modal / Card */}
          {selectedFg && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-slate-100">{selectedFg.name} Comprehensive Profile</h2>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  General Formula: {selectedFg.generalFormula}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">IUPAC Naming Rules</span>
                  <p className="text-slate-200">
                    <strong className="text-cyan-400">Suffix:</strong> {selectedFg.iupacSuffix} |{' '}
                    <strong className="text-cyan-400">Prefix:</strong> {selectedFg.iupacPrefix}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">IR Absorption Frequency</span>
                  <p className="text-slate-200 font-mono text-[11px]">{selectedFg.irFrequency}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">NMR Chemical Shift Range</span>
                  <p className="text-slate-200 font-mono text-[11px]">{selectedFg.nmrChemicalShift}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs space-y-2">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Reactivity & Chemical Behavior</span>
                </span>
                <p className="text-slate-300 leading-relaxed">{selectedFg.reactivitySummary}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Characteristic Reactions</span>
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300 list-disc list-inside">
                  {selectedFg.keyReactions.map((rxn, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {rxn}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ACID-BASE & PKA SPECTRUM */}
      {activeSubTab === 'pka-ladder' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Organic Acid-Base pKa Ladder</h2>
                <p className="text-xs text-slate-400">
                  Lower pKa = Stronger Acid (more willing to yield a proton). Click any compound to inspect the factors governing acidity.
                </p>
              </div>
            </div>

            {/* Visual pKa Ladder Slider Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-rose-400">← Strong Acids (pKa -7)</span>
                <span className="text-amber-400">Moderate / Weak (pKa 0 - 15)</span>
                <span className="text-emerald-400">Extremely Weak Acids (pKa 25 - 50) →</span>
              </div>

              <div className="h-4 w-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 p-0.5 shadow-inner">
                <div className="h-full w-full rounded-full bg-slate-950/40 relative flex items-center">
                  <div
                    className="w-4 h-6 bg-slate-100 rounded-sm border-2 border-slate-950 shadow-lg absolute -top-1 transition-all"
                    style={{
                      left: `${((PKA_TABLE[selectedPkaIndex].pKa + 10) / 60) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Clickable Compounds List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-2">
              {PKA_TABLE.map((entry, idx) => {
                const isSelected = selectedPkaIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedPkaIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg shadow-cyan-500/20 scale-105'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono opacity-80 block">pKa {entry.pKa}</span>
                    <span className="text-xs font-bold block truncate">{entry.compound}</span>
                    <span className="text-[10px] font-mono opacity-70 truncate block">{entry.formula}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected pKa Compound Detail Box */}
          {PKA_TABLE[selectedPkaIndex] && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Selected pKa Entry Analysis
                  </span>
                  <h3 className="text-xl font-bold text-slate-100">{PKA_TABLE[selectedPkaIndex].compound}</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    pKa {PKA_TABLE[selectedPkaIndex].pKa}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">Acid Formula</span>
                  <span className="font-mono text-sm text-cyan-300 font-bold">
                    {PKA_TABLE[selectedPkaIndex].formula}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-semibold">Conjugate Base Anion</span>
                  <span className="font-mono text-sm text-amber-300 font-bold">
                    {PKA_TABLE[selectedPkaIndex].conjugateBase}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs space-y-2">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Key Factor Governing Acidity (ARIO Rules)</span>
                </span>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {PKA_TABLE[selectedPkaIndex].keyFactor}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: CURVED ARROW PUSHING RULES */}
      {activeSubTab === 'mechanism-rules' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Universal Curved Arrow Pushing Commandments</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center border border-cyan-800">
                  1
                </span>
                <h3 className="font-bold text-slate-100">Tail Starts at Electron Density</h3>
                <p className="text-slate-300 leading-relaxed">
                  The tail of a curved arrow ALWAYS starts on a lone pair of electrons, a pi bond, or a sigma bond. NEVER start an arrow from a positive charge or atomic nucleus.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center border border-cyan-800">
                  2
                </span>
                <h3 className="font-bold text-slate-100">Head Points to Destination Atom/Bond</h3>
                <p className="text-slate-300 leading-relaxed">
                  The head of the arrow points directly to the atom receiving the pair (forming a new bond or lone pair) or the interatomic space (forming a new pi bond).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 font-bold flex items-center justify-center border border-cyan-800">
                  3
                </span>
                <h3 className="font-bold text-slate-100">Never Exceed the Octet Rule</h3>
                <p className="text-slate-300 leading-relaxed">
                  Second-row elements (C, N, O, F) can NEVER have more than 8 valence electrons. If an arrow pushes electrons onto a full octet carbon, another bond MUST break simultaneously.
                </p>
              </div>
            </div>
          </div>

          {/* Mechanisms Comparison Table: SN1 vs SN2 vs E1 vs E2 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Substitution vs Elimination Matrix</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-2.5">Mechanism</th>
                    <th className="p-2.5">Kinetics & Rate Law</th>
                    <th className="p-2.5">Nucleophile / Base</th>
                    <th className="p-2.5">Substrate Preference</th>
                    <th className="p-2.5">Stereochemistry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-400">S_N2</td>
                    <td className="p-2.5 font-mono">Bimolecular: Rate = k[R-X][Nu⁻]</td>
                    <td className="p-2.5">Strong nucleophile, weak base (I⁻, CN⁻, N₃⁻)</td>
                    <td className="p-2.5">1° &gt; 2° &gt;&gt; 3° (3° blocked by sterics)</td>
                    <td className="p-2.5 font-semibold text-amber-300">Inversion of configuration (Walden inversion)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-400">S_N1</td>
                    <td className="p-2.5 font-mono">Unimolecular: Rate = k[R-X]</td>
                    <td className="p-2.5">Weak neutral nucleophile (H₂O, MeOH solvolysis)</td>
                    <td className="p-2.5">3° &gt; 2° &gt;&gt; 1° (requires stable carbocation)</td>
                    <td className="p-2.5 font-semibold text-amber-300">Racemization (planar carbocation intermediate)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-400">E2</td>
                    <td className="p-2.5 font-mono">Bimolecular: Rate = k[R-X][Base⁻]</td>
                    <td className="p-2.5">Strong hindered or unhindered base (NaOEt, t-BuOK)</td>
                    <td className="p-2.5">3° &gt; 2° &gt; 1°</td>
                    <td className="p-2.5 font-semibold text-amber-300">Anti-periplanar geometry (H and X at 180°)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-cyan-400">E1</td>
                    <td className="p-2.5 font-mono">Unimolecular: Rate = k[R-X]</td>
                    <td className="p-2.5">Weak base + heat (H₂SO₄ + Δ)</td>
                    <td className="p-2.5">3° &gt; 2° &gt;&gt; 1°</td>
                    <td className="p-2.5 font-semibold text-amber-300">Zaitsev major product (most substituted alkene)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: HYBRIDIZATION & GEOMETRY */}
      {activeSubTab === 'hybridization' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HYBRIDIZATION_DATA.map((h) => (
            <div key={h.type} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xl font-bold text-cyan-400 font-mono">{h.type.toUpperCase()}</h3>
                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-950 text-amber-300 border border-slate-800">
                  {h.geometry}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-2xl font-black text-slate-100 block">{h.bondAngle}</span>
                <span className="text-[11px] text-slate-400 font-mono">Ideal Bond Angle</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>s-Character:</span>
                  <span className="font-bold text-amber-400">{h.sCharacter}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>p-Character:</span>
                  <span className="font-bold text-cyan-400">{h.pCharacter}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Sigma (σ) Bonds:</span>
                  <span className="font-bold text-slate-100">{h.sigmaBonds}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Pi (π) Bonds:</span>
                  <span className="font-bold text-slate-100">{h.piBonds}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                {h.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-semibold mb-1">Examples:</span>
                <div className="flex flex-wrap gap-1">
                  {h.exampleMolecules.map((m, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 5: STEREOCHEMISTRY GUIDE */}
      {activeSubTab === 'stereochemistry' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Chirality & CIP (Cahn-Ingold-Prelog) Priority Rules</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="font-bold text-cyan-300">Assigning R / S Configuration Steps:</h3>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Identify the sp³ chiral center carbon attached to 4 DIFFERENT groups.</li>
                  <li>Assign priority 1 to 4 based on ATOMIC NUMBER (highest atomic number = priority 1).</li>
                  <li>If atoms match, compare down the chain atom-by-atom until first point of difference.</li>
                  <li>Orient lowest priority group (4) pointing BACKWARDS into the page (dashed wedge).</li>
                  <li>Trace 1 → 2 → 3: Clockwise = <strong>R (Rectus)</strong> | Counter-clockwise = <strong>S (Sinister)</strong>.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="font-bold text-amber-300">Isomer Definitions Quick Reference:</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    <strong className="text-slate-100">Enantiomers:</strong> Non-superimposable mirror images. Opposite configuration at ALL chiral centers. Equal physical properties (mp, bp) except optical rotation (+/-).
                  </li>
                  <li>
                    <strong className="text-slate-100">Diastereomers:</strong> Stereoisomers that are NOT mirror images. Differ at SOME but not all chiral centers. Have different melting points and NMR spectra.
                  </li>
                  <li>
                    <strong className="text-slate-100">Meso Compound:</strong> Achiral molecule possessing chiral centers and an internal plane of symmetry (σ). Optically inactive.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
