import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGoal } from '../goal.model';
import { GoalService } from '../service/goal.service';

@Component({
  templateUrl: './goal-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GoalDeleteDialogComponent {
  goal?: IGoal;

  protected goalService = inject(GoalService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.goalService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
