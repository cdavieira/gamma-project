import { IGoal, NewGoal } from './goal.model';

export const sampleWithRequiredData: IGoal = {
  id: 3744,
  value: 705,
  subject: 'NATUREZA',
};

export const sampleWithPartialData: IGoal = {
  id: 7699,
  value: 462,
  subject: 'HUMANAS',
};

export const sampleWithFullData: IGoal = {
  id: 13490,
  value: 917,
  subject: 'LINGUAGENS',
};

export const sampleWithNewData: NewGoal = {
  value: 417,
  subject: undefined,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
