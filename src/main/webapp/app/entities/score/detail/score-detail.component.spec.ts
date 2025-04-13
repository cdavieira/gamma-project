import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ScoreDetailComponent } from './score-detail.component';

describe('Score Management Detail Component', () => {
  let comp: ScoreDetailComponent;
  let fixture: ComponentFixture<ScoreDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./score-detail.component').then(m => m.ScoreDetailComponent),
              resolve: { score: () => of({ id: 4624 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ScoreDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load score on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ScoreDetailComponent);

      // THEN
      expect(instance.score()).toEqual(expect.objectContaining({ id: 4624 }));
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
