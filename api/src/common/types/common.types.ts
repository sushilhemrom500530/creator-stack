import { Role } from '../enums/role.enum';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RequestWithUser extends Express.Request {
  user: {
    id: string;
    email: string;
    roles?: Role[];
    role?: Role;
  };
}
