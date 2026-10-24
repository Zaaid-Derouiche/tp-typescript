export type AcademyEvent =
  | {
      type: "spell-cast";
      wizardId: number;
      spellName: string;
    }
  | {
      type: "level-up";
      wizardId: number;
      newLevel: number;
    }
  | {
      type: "wizard-expelled";
      wizardId: number;
    };
