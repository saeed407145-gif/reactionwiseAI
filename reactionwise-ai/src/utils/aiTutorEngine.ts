import { ALL_REACTIONS } from '../data/reactions';
import { Reaction } from '../types';

export interface TutorResponse {
  title: string;
  summary: string;
  reaction?: Reaction;
  stepByStep?: { step: number; text: string; arrowMovement: string }[];
  keyConcept: string;
  examTips: string[];
  suggestedFollowUps: string[];
}

export function queryAITutor(userQuery: string): TutorResponse {
  const query = userQuery.trim().toLowerCase();

  // 1. Direct Reaction Search Match
  const matchedReaction = ALL_REACTIONS.find((r) =>
    query.includes(r.name.toLowerCase()) ||
    r.tags.some((tag) => query.includes(tag.toLowerCase())) ||
    query.includes(r.id.toLowerCase())
  );

  // 2. Specific Organic Chem Concepts & Rules
  if (query.includes('sn1 vs sn2') || query.includes('sn1 or sn2') || query.includes('difference between sn1')) {
    return {
      title: 'S_N1 vs S_N2 Substitution Comparison',
      summary: 'S_N1 and S_N2 are two distinct pathways for nucleophilic substitution, differentiated by substrate sterics, nucleophile strength, and solvent.',
      keyConcept: 'Substrate Steric Hindrance & Carbocation Stability',
      stepByStep: [
        {
          step: 1,
          text: 'Substrate Check: 3° substrates strictly undergo S_N1 (cannot undergo backside attack due to steric hindrance). 1° and methyl substrates strictly undergo S_N2.',
          arrowMovement: 'S_N1: C-LG bond breaks first (rate-determining). S_N2: Nucleophile backside attack simultaneous with C-LG cleavage.',
        },
        {
          step: 2,
          text: 'Nucleophile Strength: Strong nucleophiles (I⁻, CN⁻, OH⁻, N₃⁻) favor S_N2. Weak neutral nucleophiles (H₂O, ROH) favor S_N1.',
          arrowMovement: 'S_N2: Strong Nu⁻ attacks electrophilic C-α in single bimolecular step.',
        },
        {
          step: 3,
          text: 'Stereochemistry: S_N1 yields Racemization (planar carbocation intermediate). S_N2 yields 100% Inversion of Configuration (Walden Inversion).',
          arrowMovement: 'S_N1: Nu attacks top/bottom face of planar p-orbital. S_N2: Nu attacks 180° opposite to LG.',
        },
      ],
      examTips: [
        '3° Alkyl Halide + Strong Base (e.g. NaOEt) → E2 elimination, NOT S_N2!',
        'Polar Protic solvents (H₂O, EtOH) stabilize carbocations (favors S_N1). Polar Aprotic solvents (DMSO, DMF, acetone) enhance nucleophile reactivity (favors S_N2).',
      ],
      suggestedFollowUps: [
        'Explain Walden inversion mechanism in detail',
        'What is the difference between E1 and E2?',
        'Show SN2 reaction with NaI in acetone',
      ],
    };
  }

  if (query.includes('luche') || query.includes('enone') || query.includes('1,2 vs 1,4') || query.includes('nabh4 vs luche')) {
    const luche = ALL_REACTIONS.find((r) => r.id === 'luche-reduction');
    return {
      title: 'Luche Reduction vs Standard NaBH₄ Reduction of Enones',
      summary: 'α,β-Unsaturated ketones (enones) have two electrophilic sites: 1,2-carbonyl carbon (hard) and 1,4-β-carbon (soft). Luche reduction enforces selective 1,2-reduction.',
      reaction: luche,
      keyConcept: 'Hard-Soft Acid-Base (HSAB) Theory & Cerium Activation',
      stepByStep: [
        {
          step: 1,
          text: 'CeCl₃ acts as a hard Lewis acid that coordinates strongly to the hard carbonyl oxygen, increasing the positive charge at C=O.',
          arrowMovement: 'C=O oxygen lone pair coordinates to hard Ce³⁺ cation.',
        },
        {
          step: 2,
          text: 'CeCl₃ reacts with NaBH₄ in MeOH to form methoxyborohydride species, delivering a harder hydride ion.',
          arrowMovement: 'Hydride H⁻ attacks 1,2-carbonyl carbon directly; double bond remains intact.',
        },
      ],
      examTips: [
        'Standard NaBH₄ often gives a mixture of 1,2-reduction (allylic alcohol) and 1,4-reduction (saturated alcohol).',
        'Luche reduction (NaBH₄ + CeCl₃) yields 100% allylic alcohol!',
      ],
      suggestedFollowUps: [
        'Show full Luche reduction mechanism step by step',
        'What is an allylic alcohol?',
        'How does DIBAL-H compare for ester reduction?',
      ],
    };
  }

  if (query.includes('lda') || query.includes('kinetic vs thermodynamic') || query.includes('non-nucleophilic')) {
    return {
      title: 'LDA (Lithium Diisopropylamide) & Kinetic vs Thermodynamic Enolates',
      summary: 'LDA is a sterically hindered, strong non-nucleophilic base (pK_a of conjugate acid ~36) used to selectively generate kinetic enolates.',
      keyConcept: 'Steric Control of Enolate Formation',
      stepByStep: [
        {
          step: 1,
          text: 'Kinetic Enolate (LDA, -78 °C, THF): LDA abstracts the LEAST hindered α-proton rapidly under irreversible conditions.',
          arrowMovement: 'LDA bulky isopropyl groups remove least hindered α-H; C-H pair forms C=C double bond.',
        },
        {
          step: 2,
          text: 'Thermodynamic Enolate (NaOEt, RT/heat, EtOH): Reversible proton transfer yields the MORE substituted, thermodynamically stable enolate.',
          arrowMovement: 'Base deprotonates more substituted α-H forming substituted C=C double bond.',
        },
      ],
      examTips: [
        'Use LDA at -78 °C in THF for KINETIC enolate (less substituted).',
        'Use NaOEt/EtOH or KH at 25 °C for THERMODYNAMIC enolate (more substituted).',
      ],
      suggestedFollowUps: [
        'Explain Aldol condensation with kinetic enolates',
        'What is an enolate vs enol?',
        'Show Claisen condensation mechanism',
      ],
    };
  }

  if (query.includes('walden') || query.includes('inversion') || query.includes('backside')) {
    return {
      title: 'Walden Inversion & Backside Attack Dynamics',
      summary: 'Walden Inversion is the complete inversion of stereochemical configuration at a chiral carbon during an S_N2 bimolecular substitution.',
      keyConcept: 'Backside Attack & Trigonal Bipyramidal Transition State',
      stepByStep: [
        {
          step: 1,
          text: 'The nucleophile approaches the carbon from 180° opposite the leaving group to maximize HOMO-LUMO orbital overlap and avoid electronic repulsion.',
          arrowMovement: 'Nu⁻ lone pair attacks C-α 180° opposite C-LG bond.',
        },
        {
          step: 2,
          text: 'A pentacoordinate trigonal bipyramidal transition state forms where C-Nu is forming and C-LG is breaking simultaneously.',
          arrowMovement: 'The 3 non-reacting substituents flip like an umbrella blowing inside out in a windstorm.',
        },
      ],
      examTips: [
        'An (R) starting material converts to (S) if the nucleophile has the same priority rank as the leaving group.',
        'If nucleophile priority differs from leaving group, assign Cahn-Ingold-Prelog (CIP) rules afresh!',
      ],
      suggestedFollowUps: [
        'Show SN2 reaction of (R)-2-bromobutane with NaI',
        'What is the difference between retention and inversion?',
        'How does Mitsunobu reaction invert stereochemistry?',
      ],
    };
  }

  // 3. Fallback to Matched Reaction or General Explanation
  if (matchedReaction) {
    return {
      title: `${matchedReaction.name} — AI Mechanism Breakdown`,
      summary: matchedReaction.shortOverview,
      reaction: matchedReaction,
      keyConcept: `Category: ${matchedReaction.categoryLabel} | Reactants: ${matchedReaction.equation.reactants}`,
      stepByStep: matchedReaction.mechanism.map((m) => ({
        step: m.stepNumber,
        text: `${m.title}: ${m.description}`,
        arrowMovement: m.electronMovement,
      })),
      examTips: matchedReaction.importantNotes,
      suggestedFollowUps: [
        `What are common mistakes in ${matchedReaction.name}?`,
        `Show key intermediates for ${matchedReaction.name}`,
        `Give an example reaction of ${matchedReaction.name}`,
      ],
    };
  }

  // 4. Default AI Assistant Answer for general queries
  return {
    title: `ReactionWise AI Organic Mechanism Guidance: "${userQuery}"`,
    summary: `Analyzing "${userQuery}" through fundamental organic chemistry electron push principles: nucleophiles (electron donors), electrophiles (electron acceptors), and leaving group stability.`,
    keyConcept: 'Curved Arrow Electron Pushing & Reaction Thermodynamics',
    stepByStep: [
      {
        step: 1,
        text: 'Identify Nucleophile & Electrophile: Locate the electron-rich center (lone pairs, π bonds, carbanions) and electron-poor carbon (carbonyls, carbocations, alkyl halides).',
        arrowMovement: 'Curved arrows start at electron density (lone pair or bond) and point to electron deficiency.',
      },
      {
        step: 2,
        text: 'Evaluate Intermediates: Look for stable intermediates (e.g. resonance-stabilized carbocations, tetrahedral adducts, enolates).',
        arrowMovement: 'Check for potential 1,2-hydride/methyl shifts or ring strain release.',
      },
      {
        step: 3,
        text: 'Determine Regio- and Stereoselectivity: Apply Markovnikov/Anti-Markovnikov rules, Zaitsev/Hofmann elimination, or Cram/Felkin-Anh stereocontrol.',
        arrowMovement: 'Proton transfer or leaving group departure completes the mechanism.',
      },
    ],
    examTips: [
      'Always draw non-bonding lone pairs on nitrogen, oxygen, and halogens before drawing mechanism arrows!',
      'Never draw an arrow starting from a positive charge (arrows represent MOVEMENT OF ELECTRONS, not protons/charges).',
      'Verify formal charges at every intermediate step.',
    ],
    suggestedFollowUps: [
      'Explain Wittig reaction mechanism',
      'How to distinguish SN1 vs SN2?',
      'Predict product of enone + NaBH4 vs Luche',
      'What is Walden inversion?',
    ],
  };
}
