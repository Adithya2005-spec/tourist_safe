import { create } from 'zustand';
import { LocalStore } from '../utils/storage';
import apiClient from '../services/api';
import { CONFIG } from '../constants/config';

export const useAuthStore = create((set, get) => ({
  user: null,
  touristProfile: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initAuth: async () => {
    try {
      const token = await LocalStore.getToken();
      if (token) {
        set({ token, isAuthenticated: true });
        await get().fetchProfile();
      }
    } catch (e) {
      console.warn('Failed to restore auth token', e);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (username_or_email, password) => {
    set({ isLoading: true });
    try {
      if (CONFIG.USE_MOCK_API) {
        const mockUser = {
          user_id: 2,
          username: username_or_email,
          role: 'TOURIST',
          tourist_code: 'TOURIST-1024',
        };
        const mockToken = 'mock_jwt_token_sih260483';
        await LocalStore.saveToken(mockToken);
        set({
          user: mockUser,
          token: mockToken,
          isAuthenticated: true,
          isLoading: false,
          touristProfile: {
            tourist_code: 'TOURIST-1024',
            full_name: 'Mahalasa Rao',
            email: 'tourist@example.com',
            phone_number: '+91 98765 43210',
            nationality: 'Indian',
            verification_status: 'VERIFIED',
            credential_status: 'ACTIVE',
            did_identifier: 'did:sih:tourist-1024:aadhaar-verified',
            emergency_contacts: [
              { id: 1, name: 'Sunil Rao', phone: '+91 98800 11223', relationship: 'Parent / Family' }
            ]
          }
        });
        return { success: true };
      }

      const res = await apiClient.post('/auth/login', { username_or_email, password });
      const { access_token, user_id, username, role, tourist_code } = res.data;
      await LocalStore.saveToken(access_token);
      set({
        token: access_token,
        user: { user_id, username, role, tourist_code },
        isAuthenticated: true,
      });
      await get().fetchProfile();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.detail || 'Invalid username or password',
      };
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post('/auth/register', payload);
      const { access_token, user_id, username, role, tourist_code } = res.data;
      await LocalStore.saveToken(access_token);
      set({
        token: access_token,
        user: { user_id, username, role, tourist_code },
        isAuthenticated: true,
      });
      await get().fetchProfile();
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.detail || 'Registration failed',
      };
    }
  },

  fetchProfile: async () => {
    try {
      const res = await apiClient.get('/tourists/me');
      set({ touristProfile: res.data, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await LocalStore.removeToken();
    set({
      user: null,
      touristProfile: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
