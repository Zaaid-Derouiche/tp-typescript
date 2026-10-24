import type { House, Wizard } from "./models/wizard.model";
import type { Spell } from "./models/spell.model";

import type { NewWizard, NewSpell } from "./types";

import { Cache, Log, MeasureTime, ValidateSpellPower } from "./decorators";

// Repository générique
export class Repository<T extends { id: number }, C extends object> {
  private items: T[] = [];
  private nextId = 1;

  @Log
  add(item: C): T {
    const newItem = {
      ...item,
      id: this.nextId++,
    } as T;

    this.items.push(newItem);

    return newItem;
  }

  @MeasureTime
  getAll(): T[] {
    return [...this.items];
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  update(id: number, changes: Partial<Omit<T, "id">>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);

    return true;
  }

  delete(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) return false;

    this.items.splice(index, 1);

    return true;
  }
}

// Repository des sorciers
export class WizardRepository extends Repository<Wizard, NewWizard> {
  @Cache
  findByHouse(house: House): Wizard[] {
    return this.getAll().filter((wizard) => wizard.house === house);
  }
}

// Repository des sorts
export class SpellRepository extends Repository<Spell, NewSpell> {
  @ValidateSpellPower
  add(item: NewSpell): Spell {
    return super.add(item);
  }

  findByCategory(category: Spell["category"]): Spell[] {
    return this.getAll().filter((spell) => spell.category === category);
  }
}
