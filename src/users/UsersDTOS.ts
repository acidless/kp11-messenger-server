export interface RegisterUserDTO {
  login: string;
  password: string;
  email: string;
  passwordConfirm: string;
}

export interface LoginUserDTO {
  login: string;
  password: string;
}
