import { User } from '../../users/entities';

export interface IAuthResponse {
  user: User;
  token: string;
}
