import { IEditionResults } from 'app/entities/edition-results/edition-results.model';
import { Subject } from 'app/entities/enumerations/subject.model';

export interface IGoal {
  id: number;
  value?: number | null;
  subject?: keyof typeof Subject | null;
  result?: IEditionResults | null;
}

export type NewGoal = Omit<IGoal, 'id'> & { id: null };
