import { customAlphabet } from 'nanoid';

export const generateId = () => {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 21);
  return nanoid();
};
