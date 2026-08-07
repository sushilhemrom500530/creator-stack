import { Role } from '../common/enums/role.enum';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      roles?: Role[];
      role?: Role;
    }
    interface Request {
      user?: User;
    }
  }
}
