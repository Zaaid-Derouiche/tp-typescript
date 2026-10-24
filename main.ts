import type { Wizard, House } from "./models/wizard.model";

import type { Spell } from "./models/spell.model";

import type { AcademyEvent } from "./models/academy-event.model";

import type {
  NewWizard,
  NewSpell,
  WizardSummary,
  WizardUpdate,
  SpellCastEvent,
  HousePoints,
  SpellOutput,
  ArrayElement,
  NonHealingCategory,
} from "./types";

import { WizardRepository, SpellRepository } from "./repository";

import { Log } from "./decorators";

// Vérifier qu'une maison est valide
function isHouse(value: unknown): value is House {
  const houses: House[] = [
    "Gryffindor",
    "Slytherin",
    "Ravenclaw",
    "Hufflepuff",
  ];

  return typeof value === "string" && houses.includes(value as House);
}

// Vérifier qu'un objet correspond à Wizard
function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" &&
    typeof candidate.active === "boolean" &&
    typeof candidate.speciality === "string"
  );
}

class AcademyService {
  constructor(
    private readonly wizards: WizardRepository,
    private readonly spells: SpellRepository,
  ) {}

  // Lancer un sort
  castSpell(wizardId: number, spellId: number): string {
    const wizard = this.wizards.findById(wizardId);
    const spell = this.spells.findById(spellId);

    if (!wizard || !spell) {
      throw new Error("Wizard or Spell not found");
    }

    return `${wizard.name} casts ${spell.name}!`;
  }

  // Filtrer par maison
  findByHouse(house: House): WizardSummary[] {
    return this.wizards.findByHouse(house).map(({ id, name, house }) => ({
      id,
      name,
      house,
    }));
  }

  // Modifier un sorcier
  updateWizard(id: number, changes: WizardUpdate): boolean {
    return this.wizards.update(id, changes);
  }

  // Extraire les événements de lancement de sorts
  getSpellEvents(events: AcademyEvent[]): SpellCastEvent[] {
    return events.filter(
      (event): event is SpellCastEvent => event.type === "spell-cast",
    );
  }
}

const wizards = new WizardRepository();
const spells = new SpellRepository();

const academy = new AcademyService(wizards, spells);

console.log("\n===== CREATE WIZARDS =====");

const harry: NewWizard = {
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
  speciality: "Defense",
};

const hermione: NewWizard = {
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 8,
  active: true,
  speciality: "Magic",
};

const draco: NewWizard = {
  name: "Draco Malfoy",
  house: "Slytherin",
  level: 6,
  active: true,
  speciality: "Potions",
};

const createdHarry = wizards.add(harry);
const createdHermione = wizards.add(hermione);
const createdDraco = wizards.add(draco);

console.log(createdHarry);
console.log(createdHermione);
console.log(createdDraco);

console.log("\n===== FIND BY HOUSE =====");

console.log(academy.findByHouse("Gryffindor"));

console.log("\n===== GET ALL WIZARDS =====");

console.log(wizards.getAll());

console.log("\n===== FIND BY ID =====");

console.log(wizards.findById(2));

console.log("\n===== UPDATE WIZARD =====");

academy.updateWizard(1, {
  level: 10,
  speciality: "Advanced Defense",
});

console.log(wizards.findById(1));

console.log("\n===== DELETE WIZARD =====");

console.log("Deleted :", wizards.delete(3));

console.log(wizards.getAll());

console.log("\n===== CREATE SPELLS =====");

const validSpell: NewSpell = {
  name: "Expelliarmus",
  category: "attack",
  power: 80,
  description: "Disarming spell",
};

const secondSpell: NewSpell = {
  name: "Protego",
  category: "defense",
  power: 60,
  description: "Protective spell",
};

console.log(spells.add(validSpell));
console.log(spells.add(secondSpell));

console.log("\n===== SPELL VALIDATION =====");

try {
  spells.add({
    name: "Dark Magic",
    category: "attack",
    power: -20,
    description: "Invalid spell",
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
}

console.log("\n===== FIND BY CATEGORY =====");

console.log(spells.findByCategory("attack"));

console.log("\n===== CAST SPELL =====");

console.log(academy.castSpell(1, 1));

console.log("\n===== SPELL EVENTS =====");

const events: AcademyEvent[] = [
  {
    type: "spell-cast",
    wizardId: 1,
    spellName: "Lumos",
  },

  {
    type: "level-up",
    wizardId: 2,
    newLevel: 9,
  },

  {
    type: "wizard-expelled",
    wizardId: 3,
  },

  {
    type: "spell-cast",
    wizardId: 2,
    spellName: "Wingardium Leviosa",
  },
];

console.log(academy.getSpellEvents(events));

console.log("\n===== CACHE TEST =====");

// Premier appel : calcul
console.log(wizards.findByHouse("Gryffindor"));

// Deuxième appel : résultat en cache
console.log(wizards.findByHouse("Gryffindor"));

// Autre maison : nouveau calcul
console.log(wizards.findByHouse("Slytherin"));

console.log("\n===== TYPE GUARD =====");

const validWizard: unknown = {
  id: 10,
  name: "Luna Lovegood",
  house: "Ravenclaw",
  level: 7,
  active: true,
  speciality: "Astronomy",
};

const invalidWizard: unknown = {
  id: 11,
  name: "Viktor",
  house: "Durmstrang",
  level: 5,
  active: true,
  speciality: "Magic",
};

console.log("Valid :", isWizard(validWizard));
console.log("Invalid :", isWizard(invalidWizard));
