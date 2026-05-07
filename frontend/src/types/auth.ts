export type LoginData = {
  identifier: string;
  password: string;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};
