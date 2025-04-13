import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IEditionResults } from '../edition-results.model';

@Component({
  selector: 'jhi-edition-results-detail',
  templateUrl: './edition-results-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class EditionResultsDetailComponent {
  editionResults = input<IEditionResults | null>(null);

  previousState(): void {
    window.history.back();
  }
}
