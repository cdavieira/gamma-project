import { IUser } from 'app/entities/user/user.model';

export interface IParticipant {
  id: number;
  name?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewParticipant = Omit<IParticipant, 'id'> & { id: null };
