import { IParticipant, NewParticipant } from './participant.model';

export const sampleWithRequiredData: IParticipant = {
  id: 6716,
  name: 'whopping',
};

export const sampleWithPartialData: IParticipant = {
  id: 191,
  name: 'interestingly',
};

export const sampleWithFullData: IParticipant = {
  id: 8118,
  name: 'bungalow pish',
};

export const sampleWithNewData: NewParticipant = {
  name: 'intermarry oof',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
