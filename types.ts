import type { Wizard, House } from "./models/wizard.model";
import type { Spell, SpellCategory } from "./models/spell.model";
import type { AcademyEvent } from "./models/academy-event.model";

// Omit : supprimer une propriété
export type NewWizard = Omit<Wizard, "id">;

export type NewSpell = Omit<Spell, "id">;

// Pick : sélectionner certaines propriétés
export type WizardSummary = Pick<Wizard, "id" | "name" | "house">;

// Partial : rendre les propriétés facultatives
export type WizardUpdate = Partial<Omit<Wizard, "id">>;

export type SpellUpdate = Partial<Omit<Spell, "id">>;

// Record : associer une valeur à chaque maison
export type HousePoints = Record<House, number>;

// Extract : extraire les événements de lancement de sorts
export type SpellCastEvent = Extract<AcademyEvent, { type: "spell-cast" }>;

// Exclude : exclure une catégorie
export type NonHealingCategory = Exclude<SpellCategory, "healing">;

// Conditional Type
export type SpellOutput<T extends SpellCategory> = T extends "attack"
  ? number
  : T extends "defense"
    ? boolean
    : T extends "healing"
      ? string
      : never;

// infer : extraire le type d'un élément d'un tableau
export type ArrayElement<T> = T extends (infer Item)[] ? Item : never;
