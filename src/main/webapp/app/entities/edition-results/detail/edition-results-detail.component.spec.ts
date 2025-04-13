import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EditionResultsDetailComponent } from './edition-results-detail.component';

describe('EditionResults Management Detail Component', () => {
  let comp: EditionResultsDetailComponent;
  let fixture: ComponentFixture<EditionResultsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionResultsDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./edition-results-detail.component').then(m => m.EditionResultsDetailComponent),
              resolve: { editionResults: () => of({ id: 12230 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EditionResultsDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionResultsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load editionResults on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EditionResultsDetailComponent);

      // THEN
      expect(instance.editionResults()).toEqual(expect.objectContaining({ id: 12230 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
