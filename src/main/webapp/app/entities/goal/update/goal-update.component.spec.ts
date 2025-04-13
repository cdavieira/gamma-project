import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IEditionResults } from 'app/entities/edition-results/edition-results.model';
import { EditionResultsService } from 'app/entities/edition-results/service/edition-results.service';
import { GoalService } from '../service/goal.service';
import { IGoal } from '../goal.model';
import { GoalFormService } from './goal-form.service';

import { GoalUpdateComponent } from './goal-update.component';

describe('Goal Management Update Component', () => {
  let comp: GoalUpdateComponent;
  let fixture: ComponentFixture<GoalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let goalFormService: GoalFormService;
  let goalService: GoalService;
  let editionResultsService: EditionResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GoalUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GoalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GoalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    goalFormService = TestBed.inject(GoalFormService);
    goalService = TestBed.inject(GoalService);
    editionResultsService = TestBed.inject(EditionResultsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call EditionResults query and add missing value', () => {
      const goal: IGoal = { id: 6150 };
      const result: IEditionResults = { id: 12230 };
      goal.result = result;

      const editionResultsCollection: IEditionResults[] = [{ id: 12230 }];
      jest.spyOn(editionResultsService, 'query').mockReturnValue(of(new HttpResponse({ body: editionResultsCollection })));
      const additionalEditionResults = [result];
      const expectedCollection: IEditionResults[] = [...additionalEditionResults, ...editionResultsCollection];
      jest.spyOn(editionResultsService, 'addEditionResultsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ goal });
      comp.ngOnInit();

      expect(editionResultsService.query).toHaveBeenCalled();
      expect(editionResultsService.addEditionResultsToCollectionIfMissing).toHaveBeenCalledWith(
        editionResultsCollection,
        ...additionalEditionResults.map(expect.objectContaining),
      );
      expect(comp.editionResultsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const goal: IGoal = { id: 6150 };
      const result: IEditionResults = { id: 12230 };
      goal.result = result;

      activatedRoute.data = of({ goal });
      comp.ngOnInit();

      expect(comp.editionResultsSharedCollection).toContainEqual(result);
      expect(comp.goal).toEqual(goal);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGoal>>();
      const goal = { id: 2775 };
      jest.spyOn(goalFormService, 'getGoal').mockReturnValue(goal);
      jest.spyOn(goalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ goal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: goal }));
      saveSubject.complete();

      // THEN
      expect(goalFormService.getGoal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(goalService.update).toHaveBeenCalledWith(expect.objectContaining(goal));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGoal>>();
      const goal = { id: 2775 };
      jest.spyOn(goalFormService, 'getGoal').mockReturnValue({ id: null });
      jest.spyOn(goalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ goal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: goal }));
      saveSubject.complete();

      // THEN
      expect(goalFormService.getGoal).toHaveBeenCalled();
      expect(goalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGoal>>();
      const goal = { id: 2775 };
      jest.spyOn(goalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ goal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(goalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEditionResults', () => {
      it('should forward to editionResultsService', () => {
        const entity = { id: 12230 };
        const entity2 = { id: 7301 };
        jest.spyOn(editionResultsService, 'compareEditionResults');
        comp.compareEditionResults(entity, entity2);
        expect(editionResultsService.compareEditionResults).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
