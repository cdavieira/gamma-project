import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IScore } from '../score.model';
import { ScoreService } from '../service/score.service';

@Component({
  templateUrl: './score-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ScoreDeleteDialogComponent {
  score?: IScore;

  protected scoreService = inject(ScoreService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.scoreService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
