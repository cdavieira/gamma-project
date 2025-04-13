import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEditionResults } from '../edition-results.model';
import { EditionResultsService } from '../service/edition-results.service';

@Component({
  templateUrl: './edition-results-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EditionResultsDeleteDialogComponent {
  editionResults?: IEditionResults;

  protected editionResultsService = inject(EditionResultsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.editionResultsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
