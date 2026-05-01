export type LoginData = {
  identifier: string;
  password: string;
};

export type SignupData = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  name: string;
  email: string;
} | null;
