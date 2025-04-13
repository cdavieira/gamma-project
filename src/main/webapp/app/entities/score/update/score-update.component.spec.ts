import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IEditionResults } from 'app/entities/edition-results/edition-results.model';
import { EditionResultsService } from 'app/entities/edition-results/service/edition-results.service';
import { ScoreService } from '../service/score.service';
import { IScore } from '../score.model';
import { ScoreFormService } from './score-form.service';

import { ScoreUpdateComponent } from './score-update.component';

describe('Score Management Update Component', () => {
  let comp: ScoreUpdateComponent;
  let fixture: ComponentFixture<ScoreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let scoreFormService: ScoreFormService;
  let scoreService: ScoreService;
  let editionResultsService: EditionResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ScoreUpdateComponent],
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
      .overrideTemplate(ScoreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScoreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    scoreFormService = TestBed.inject(ScoreFormService);
    scoreService = TestBed.inject(ScoreService);
    editionResultsService = TestBed.inject(EditionResultsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call EditionResults query and add missing value', () => {
      const score: IScore = { id: 2120 };
      const result: IEditionResults = { id: 12230 };
      score.result = result;

      const editionResultsCollection: IEditionResults[] = [{ id: 12230 }];
      jest.spyOn(editionResultsService, 'query').mockReturnValue(of(new HttpResponse({ body: editionResultsCollection })));
      const additionalEditionResults = [result];
      const expectedCollection: IEditionResults[] = [...additionalEditionResults, ...editionResultsCollection];
      jest.spyOn(editionResultsService, 'addEditionResultsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ score });
      comp.ngOnInit();

      expect(editionResultsService.query).toHaveBeenCalled();
      expect(editionResultsService.addEditionResultsToCollectionIfMissing).toHaveBeenCalledWith(
        editionResultsCollection,
        ...additionalEditionResults.map(expect.objectContaining),
      );
      expect(comp.editionResultsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const score: IScore = { id: 2120 };
      const result: IEditionResults = { id: 12230 };
      score.result = result;

      activatedRoute.data = of({ score });
      comp.ngOnInit();

      expect(comp.editionResultsSharedCollection).toContainEqual(result);
      expect(comp.score).toEqual(score);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScore>>();
      const score = { id: 4624 };
      jest.spyOn(scoreFormService, 'getScore').mockReturnValue(score);
      jest.spyOn(scoreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ score });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: score }));
      saveSubject.complete();

      // THEN
      expect(scoreFormService.getScore).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(scoreService.update).toHaveBeenCalledWith(expect.objectContaining(score));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScore>>();
      const score = { id: 4624 };
      jest.spyOn(scoreFormService, 'getScore').mockReturnValue({ id: null });
      jest.spyOn(scoreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ score: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: score }));
      saveSubject.complete();

      // THEN
      expect(scoreFormService.getScore).toHaveBeenCalled();
      expect(scoreService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScore>>();
      const score = { id: 4624 };
      jest.spyOn(scoreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ score });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(scoreService.update).toHaveBeenCalled();
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
