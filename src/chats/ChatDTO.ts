export type ChatDTO = {
  name: string;
  users?: Array<string>;
};

export type ChatUpdateDTO = {
  name: string;
  avatar: string;
};
