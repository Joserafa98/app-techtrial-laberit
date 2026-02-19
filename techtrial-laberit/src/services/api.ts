import axios from 'axios';
import type { UserResponse, UsersResponse, CreateUserPayload, User } from '../types/user';

const api = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: {
    'x-api-key': 'REQRES_API_KEY'
  }
});
export const getUsers = (page: number = 1) =>
  api.get<UsersResponse>(`/users?page=${page}`);

export const getUserById = (id: number) =>
  api.get<UserResponse>(`/users/${id}`);

export const createUser = (data: CreateUserPayload) =>
  api.post('/users', data);

export const updateUser = (id: number, data: Partial<User>) =>
  api.put(`/users/${id}`, data);

export const deleteUser = (id: number) =>
  api.delete(`/users/${id}`);