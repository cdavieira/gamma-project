import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IScore } from '../score.model';

@Component({
  selector: 'jhi-score-detail',
  templateUrl: './score-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ScoreDetailComponent {
  score = input<IScore | null>(null);

  previousState(): void {
    window.history.back();
  }
}
