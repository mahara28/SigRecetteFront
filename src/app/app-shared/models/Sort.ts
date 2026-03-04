// models/sort.model.ts
export class Sort {
  nameCol: string;
  direction: string;

  constructor(nameCol: string | null = null, direction: string | null = null) {
    this.nameCol = nameCol ?? '';
    this.direction = direction ?? '';
  }

  /**
   * Vérifie si le tri est actif
   */
  isActive(): boolean {
    return !!(this.nameCol && this.direction);
  }

  /**
   * Réinitialise le tri
   */
  reset(): void {
    this.nameCol = '';
    this.direction = '';
  }
}
