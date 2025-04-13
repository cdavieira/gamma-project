import { IParticipant } from 'app/entities/participant/participant.model';

export interface IEditionResults {
  id: number;
  year?: number | null;
  participant?: IParticipant | null;
}

export type NewEditionResults = Omit<IEditionResults, 'id'> & { id: null };
