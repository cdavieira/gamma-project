import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IParticipant } from '../participant.model';

@Component({
  selector: 'jhi-participant-detail',
  templateUrl: './participant-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ParticipantDetailComponent {
  participant = input<IParticipant | null>(null);

  previousState(): void {
    window.history.back();
  }
}
