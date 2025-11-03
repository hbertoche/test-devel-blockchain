export interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Opcional para não retornar em respostas
  createdAt: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}