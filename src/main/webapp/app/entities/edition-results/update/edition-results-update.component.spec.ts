import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IParticipant } from 'app/entities/participant/participant.model';
import { ParticipantService } from 'app/entities/participant/service/participant.service';
import { EditionResultsService } from '../service/edition-results.service';
import { IEditionResults } from '../edition-results.model';
import { EditionResultsFormService } from './edition-results-form.service';

import { EditionResultsUpdateComponent } from './edition-results-update.component';

describe('EditionResults Management Update Component', () => {
  let comp: EditionResultsUpdateComponent;
  let fixture: ComponentFixture<EditionResultsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let editionResultsFormService: EditionResultsFormService;
  let editionResultsService: EditionResultsService;
  let participantService: ParticipantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditionResultsUpdateComponent],
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
      .overrideTemplate(EditionResultsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EditionResultsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    editionResultsFormService = TestBed.inject(EditionResultsFormService);
    editionResultsService = TestBed.inject(EditionResultsService);
    participantService = TestBed.inject(ParticipantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Participant query and add missing value', () => {
      const editionResults: IEditionResults = { id: 7301 };
      const participant: IParticipant = { id: 26767 };
      editionResults.participant = participant;

      const participantCollection: IParticipant[] = [{ id: 26767 }];
      jest.spyOn(participantService, 'query').mockReturnValue(of(new HttpResponse({ body: participantCollection })));
      const additionalParticipants = [participant];
      const expectedCollection: IParticipant[] = [...additionalParticipants, ...participantCollection];
      jest.spyOn(participantService, 'addParticipantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ editionResults });
      comp.ngOnInit();

      expect(participantService.query).toHaveBeenCalled();
      expect(participantService.addParticipantToCollectionIfMissing).toHaveBeenCalledWith(
        participantCollection,
        ...additionalParticipants.map(expect.objectContaining),
      );
      expect(comp.participantsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const editionResults: IEditionResults = { id: 7301 };
      const participant: IParticipant = { id: 26767 };
      editionResults.participant = participant;

      activatedRoute.data = of({ editionResults });
      comp.ngOnInit();

      expect(comp.participantsSharedCollection).toContainEqual(participant);
      expect(comp.editionResults).toEqual(editionResults);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEditionResults>>();
      const editionResults = { id: 12230 };
      jest.spyOn(editionResultsFormService, 'getEditionResults').mockReturnValue(editionResults);
      jest.spyOn(editionResultsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ editionResults });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: editionResults }));
      saveSubject.complete();

      // THEN
      expect(editionResultsFormService.getEditionResults).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(editionResultsService.update).toHaveBeenCalledWith(expect.objectContaining(editionResults));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEditionResults>>();
      const editionResults = { id: 12230 };
      jest.spyOn(editionResultsFormService, 'getEditionResults').mockReturnValue({ id: null });
      jest.spyOn(editionResultsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ editionResults: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: editionResults }));
      saveSubject.complete();

      // THEN
      expect(editionResultsFormService.getEditionResults).toHaveBeenCalled();
      expect(editionResultsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEditionResults>>();
      const editionResults = { id: 12230 };
      jest.spyOn(editionResultsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ editionResults });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(editionResultsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareParticipant', () => {
      it('should forward to participantService', () => {
        const entity = { id: 26767 };
        const entity2 = { id: 255 };
        jest.spyOn(participantService, 'compareParticipant');
        comp.compareParticipant(entity, entity2);
        expect(participantService.compareParticipant).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
