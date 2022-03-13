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

export interface CreateProfileDTO {
  name: string;
  surname: string;
  phoneNumber: string;
  group: string;
}
