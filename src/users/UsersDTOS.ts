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
  avatar: string;
}

export interface UpdateProfileDTO extends CreateProfileDTO {
  email: string;
  currentPassword: string;
  newPassword: string;
}
