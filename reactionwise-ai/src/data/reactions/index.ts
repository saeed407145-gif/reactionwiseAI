import { Reaction, CategoryId } from '../../types';
import { CARBON_CARBON_REACTIONS } from './carbonCarbon';
import { AROMATIC_REACTIONS } from './aromatic';
import { REARRANGEMENT_REACTIONS } from './rearrangements';
import { PERICYCLIC_REACTIONS } from './pericyclic';
import { OXIDATION_REACTIONS } from './oxidation';
import { REDUCTION_REACTIONS } from './reduction';
import { SUBSTITUTION_ELIMINATION_REACTIONS } from './substitutionElimination';
import { PROTECTING_GROUPS_REACTIONS } from './protectingGroups';
import { MORE_REACTIONS } from './moreReactions';
import { EXTENDED_REACTIONS } from './extendedReactions';
import { MORE_REACTIONS_2 } from './moreReactions2';
import { MORE_REACTIONS_3 } from './moreReactions3';

// Combine all reactions into a single comprehensive database of 100+ reactions
export const ALL_REACTIONS: Reaction[] = [
  ...CARBON_CARBON_REACTIONS,
  ...AROMATIC_REACTIONS,
  ...REARRANGEMENT_REACTIONS,
  ...PERICYCLIC_REACTIONS,
  ...OXIDATION_REACTIONS,
  ...REDUCTION_REACTIONS,
  ...SUBSTITUTION_ELIMINATION_REACTIONS,
  ...PROTECTING_GROUPS_REACTIONS,
  ...MORE_REACTIONS,
  ...EXTENDED_REACTIONS,
  ...MORE_REACTIONS_2,
  ...MORE_REACTIONS_3,
];

export function getReactionById(id: string): Reaction | undefined {
  return ALL_REACTIONS.find((r) => r.id === id);
}

export function getReactionsByCategory(categoryId: CategoryId): Reaction[] {
  return ALL_REACTIONS.filter((r) => r.category === categoryId);
}

export function searchReactions(
  query: string,
  categoryFilter?: string,
  difficultyFilter?: string
): Reaction[] {
  const q = query.trim().toLowerCase();

  return ALL_REACTIONS.filter((r) => {
    // Category filter
    if (categoryFilter && categoryFilter !== 'all' && r.category !== categoryFilter) {
      return false;
    }
    // Difficulty filter
    if (difficultyFilter && difficultyFilter !== 'all' && r.difficulty !== difficultyFilter) {
      return false;
    }

    if (!q) return true;

    // Search query matches name, overview, reactants, reagents, products, or tags
    const matchName = r.name.toLowerCase().includes(q);
    const matchOverview = r.shortOverview.toLowerCase().includes(q);
    const matchCategory = r.categoryLabel.toLowerCase().includes(q);
    const matchReactants = r.reactantsDescription.toLowerCase().includes(q) || r.equation.reactants.toLowerCase().includes(q);
    const matchReagents = r.reagentsConditionsDescription.toLowerCase().includes(q) || r.equation.reagentsConditions.toLowerCase().includes(q);
    const matchProduct = r.mainProductDescription.toLowerCase().includes(q) || r.equation.products.toLowerCase().includes(q);
    const matchTags = r.tags.some((t) => t.toLowerCase().includes(q));

    return (
      matchName ||
      matchOverview ||
      matchCategory ||
      matchReactants ||
      matchReagents ||
      matchProduct ||
      matchTags
    );
  });
}

export function getRandomReactions(count: number = 4): Reaction[] {
  const shuffled = [...ALL_REACTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getFeaturedReaction(): Reaction {
  // Returns a deterministic featured reaction based on current day of year or static pick
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % ALL_REACTIONS.length;
  return ALL_REACTIONS[index] || ALL_REACTIONS[0];
}
