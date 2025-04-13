import { IScore, NewScore } from './score.model';

export const sampleWithRequiredData: IScore = {
  id: 25585,
  value: 4,
  subject: 'NATUREZA',
};

export const sampleWithPartialData: IScore = {
  id: 2936,
  value: 226,
  subject: 'LINGUAGENS',
};

export const sampleWithFullData: IScore = {
  id: 14725,
  value: 365,
  subject: 'HUMANAS',
};

export const sampleWithNewData: NewScore = {
  value: 453,
  subject: undefined,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
