import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ParticipantDetailComponent } from './participant-detail.component';

describe('Participant Management Detail Component', () => {
  let comp: ParticipantDetailComponent;
  let fixture: ComponentFixture<ParticipantDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./participant-detail.component').then(m => m.ParticipantDetailComponent),
              resolve: { participant: () => of({ id: 26767 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ParticipantDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load participant on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ParticipantDetailComponent);

      // THEN
      expect(instance.participant()).toEqual(expect.objectContaining({ id: 26767 }));
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
