import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { getUsers } from '../services/api';
import type { User } from '../types/user';

// Estado
interface UsersState {
  allUsers: User[];
  currentPage: number;
  loading: boolean;
  error: string | null;
}

// Acciones
type Action =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: number };

const USERS_PER_PAGE = 6;

function usersReducer(state: UsersState, action: Action): UsersState {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, allUsers: action.payload, loading: false };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_USER':
      return { ...state, allUsers: [action.payload, ...state.allUsers] };
    case 'UPDATE_USER':
      return { ...state, allUsers: state.allUsers.map(u => u.id === action.payload.id ? action.payload : u) };
    case 'DELETE_USER':
      return { ...state, allUsers: state.allUsers.filter(u => u.id !== action.payload) };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Context
interface UsersContextType {
  state: {
    users: User[];
    currentPage: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
  };
  getUserById: (id: number) => User | undefined;
  addUser: (data: Omit<User, 'id' | 'avatar'>, avatarUrl?: string) => void;
  editUser: (id: number, data: Omit<User, 'id' | 'avatar'>, avatarUrl?: string) => void;
  removeUser: (id: number) => void;
  setPage: (page: number) => void;
}

const UsersContext = createContext<UsersContextType | null>(null);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(usersReducer, {
  allUsers: [],
  currentPage: 1,
  loading: true,
  error: null,
});

  useEffect(() => {
  dispatch({ type: 'SET_LOADING', payload: true });
  getUsers(1)
    .then(res => {
      dispatch({ type: 'SET_USERS', payload: res.data.data });
    })
    .catch(() => {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar los usuarios. Inténtalo de nuevo.' });
    });
}, []);

  const totalPages = Math.ceil(state.allUsers.length / USERS_PER_PAGE);
  const users = state.allUsers.slice(
    (state.currentPage - 1) * USERS_PER_PAGE,
    state.currentPage * USERS_PER_PAGE
  );

  const getUserById = (id: number) => state.allUsers.find(u => u.id === id);

  const addUser = (data: Omit<User, 'id' | 'avatar'>, avatarUrl?: string) => {
  const newUser: User = {
    ...data,
    id: Date.now(),
    avatar: avatarUrl || `https://ui-avatars.com/api/?name=${data.first_name}+${data.last_name}&background=random&color=fff`,
  };
  dispatch({ type: 'ADD_USER', payload: newUser });
};

 const editUser = (id: number, data: Omit<User, 'id' | 'avatar'>, avatarUrl?: string) => {
  const existing = getUserById(id);
  if (!existing) return;
  dispatch({ type: 'UPDATE_USER', payload: { ...existing, ...data, avatar: avatarUrl || existing.avatar } });
};

  const removeUser = (id: number) => {
    dispatch({ type: 'DELETE_USER', payload: id });
  };

  const setPage = (page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  return (
    <UsersContext.Provider value={{ state: { ...state, users, totalPages }, getUserById, addUser, editUser, removeUser, setPage }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsers debe usarse dentro de UsersProvider');
  return ctx;
}