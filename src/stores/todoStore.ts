
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { Todo } from '../types';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
}

interface TodoActions {
  addTodo: (title: string, description?: string, priority?: 'low' | 'medium' | 'high') => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  getTodosByUser: (userId: string) => Todo[];
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export type TodoStore = TodoState & TodoActions;

export const useTodoStore = create<TodoStore>()(persist(
  (set, get) => ({
    // Initial state
    todos: [],
    isLoading: false,
    error: null,

    // Actions
    addTodo: async (title: string, description?: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
      set({ isLoading: true, error: null });
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newTodo: Todo = {
          id: Date.now().toString(),
          title,
          description: description || '',
          completed: false,
          priority,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: '1' // In real app, get from auth store
        };

        set(state => ({
          todos: [...state.todos, newTodo],
          isLoading: false
        }));
      } catch (error) {
        set({ isLoading: false, error: 'Failed to add todo' });
      }
    },

    updateTodo: async (id: string, updates: Partial<Todo>) => {
      set({ isLoading: true, error: null });
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        set(state => ({
          todos: state.todos.map(todo => 
            todo.id === id 
              ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
              : todo
          ),
          isLoading: false
        }));
      } catch (error) {
        set({ isLoading: false, error: 'Failed to update todo' });
      }
    },

    deleteTodo: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        set(state => ({
          todos: state.todos.filter(todo => todo.id !== id),
          isLoading: false
        }));
      } catch (error) {
        set({ isLoading: false, error: 'Failed to delete todo' });
      }
    },

    toggleTodo: async (id: string) => {
      const todo = get().todos.find(t => t.id === id);
      if (todo) {
        await get().updateTodo(id, { completed: !todo.completed });
      }
    },

    getTodosByUser: (userId: string) => {
      return get().todos.filter(todo => todo.userId === userId);
    },

    clearError: () => set({ error: null }),
    setLoading: (isLoading: boolean) => set({ isLoading })
  }),
  {
    name: STORAGE_KEYS.TODO_STORE,
    storage: {
      getItem: async (name: string) => {
        const value = await AsyncStorage.getItem(name);
        return value ? JSON.parse(value) : null;
      },
      setItem: async (name: string, value: any) => {
        await AsyncStorage.setItem(name, JSON.stringify(value));
      },
      removeItem: async (name: string) => {
        await AsyncStorage.removeItem(name);
      }
    },
    partialize: (state) => ({
      todos: state.todos
    })
  }
));
