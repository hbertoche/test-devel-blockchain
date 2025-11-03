import axios from 'axios';
import { Task, CreateTaskRequest, UpdateTaskRequest, AuthResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Task API
export const taskApi = {
  // Get all tasks with optional filters
  getTasks: async (params?: { filter?: string; search?: string }): Promise<Task[]> => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get task by ID
  getTask: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const response = await api.post('/tasks', task);
    return response.data;
  },

  // Update task
  updateTask: async (id: number, task: UpdateTaskRequest): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, task);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Export tasks
  exportTasks: async (): Promise<Blob> => {
    const response = await api.get('/tasks/export', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Import tasks
  importTasks: async (tasks: Task[]): Promise<{ imported: number; errors: number; total: number }> => {
    const response = await api.post('/tasks/import', { tasks });
    return response.data;
  },
};

// Auth API
export const authApi = {
  // Register new user
  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get profile
  getProfile: async (): Promise<any> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export default api;