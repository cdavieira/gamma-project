import { IEditionResults, NewEditionResults } from './edition-results.model';

export const sampleWithRequiredData: IEditionResults = {
  id: 15923,
  year: 2015,
};

export const sampleWithPartialData: IEditionResults = {
  id: 14296,
  year: 2022,
};

export const sampleWithFullData: IEditionResults = {
  id: 29933,
  year: 2016,
};

export const sampleWithNewData: NewEditionResults = {
  year: 2004,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
