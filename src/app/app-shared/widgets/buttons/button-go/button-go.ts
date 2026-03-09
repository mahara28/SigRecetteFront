
import { Component, input, signal, HostListener, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'mc-button-go',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './button-go.html',
  styleUrl: './button-go.css',
  encapsulation: ViewEncapsulation.None
})
export class ButtonGo {
 containerSelector = input.required<string>();

  // États gérés par des Signals pour une détection de changement optimale
  isOver = signal(false);
  isScrolling = signal(false);

  // Utilisation du décorateur HostListener pour écouter le scroll de manière performante
  // Note: Si le scroll est sur un élément précis, on utilise l'écouteur dans le constructeur/effect
  @HostListener('window:scroll')
  onWindowScroll() {
    const container = document.querySelector(this.containerSelector());
    if (container) {
      this.isScrolling.set(container.scrollTop > 20);
    }
  }

  goToTop() {
    const container = document.querySelector(this.containerSelector());
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth' // Ajout d'un scroll fluide pour une meilleure UX
      });
    }
  }

  // Méthodes pour gérer le survol (Hover)
  setHover(status: boolean) {
    this.isOver.set(status);
  }
}

