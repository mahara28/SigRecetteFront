import { Component, input, computed } from '@angular/core';
import { NgStyle, UpperCasePipe } from '@angular/common';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1559718062-361155fad299?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80';
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1510531704581-5b2870972060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80';
@Component({
  selector: 'app-card',
  imports: [NgStyle],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
avatar = input<string>(DEFAULT_AVATAR);
  cover = input<string>(DEFAULT_COVER);
  firstName = input<string>('');
  lastName = input<string>('');
  fullName = computed(() => `${this.firstName()} ${this.lastName()}`.trim());
  coverStyle = computed(() => ({
    'background-image': `url(${this.cover()})`
  }));
}
