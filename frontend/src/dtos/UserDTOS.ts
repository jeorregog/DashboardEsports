export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

// Password is optional on update: when omitted, the backend keeps the current one.
export type UpdateUserDTO = Partial<CreateUserDTO>;
