import { create } from 'zustand'
import { Video, VideoSource, VideoStatus, GestureCategory } from '@/types/video'

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface GordonStore {
  user: User | null;
  accessToken: string | null;
  videos: Video[];
  sourceFilter: 'all' | VideoSource;
  statusFilter: 'all' | VideoStatus;
  categoryFilter: 'all' | GestureCategory;
  showUpload: boolean;
  activeNav: string;
  gordonStatus: 'online' | 'offline' | 'busy';
  toasts: { id: string; type: 'success' | 'error' | 'info'; text: string }[];
  searchQuery: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setVideos: (videos: Video[]) => void;
  addVideo: (video: Video) => void;
  updateVideoStatus: (id: string | number, status: VideoStatus) => void;
  setSourceFilter: (filter: 'all' | VideoSource) => void;
  setStatusFilter: (filter: 'all' | VideoStatus) => void;
  setCategoryFilter: (filter: 'all' | GestureCategory) => void;
  setShowUpload: (show: boolean) => void;
  setActiveNav: (nav: string) => void;
  setGordonStatus: (status: 'online' | 'offline' | 'busy') => void;
  addToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  setSearchQuery: (query: string) => void;
}

const mockVideos: Video[] = [
  {
    id: 'm1',
    title: 'Seasonal Carrot Julienne',
    source: 'rayban',
    duration: '0:45',
    status: 'analyzed',
    date: "Today",
    category: 'Cutting',
    thumbnailUrl: null,
    metaId: 'fb_123456789'
  },
  {
    id: 'm2',
    title: 'Quick Beef Stir-fry (Hot Wok)',
    source: 'rayban',
    duration: '2:15',
    status: 'analyzed',
    date: 'Yesterday',
    category: 'Cooking / Searing',
    thumbnailUrl: null,
    metaId: 'fb_987654321'
  },
  {
    id: 'm3',
    title: 'Signature Gourmet Plate Dressing',
    source: 'rayban',
    duration: '1:30',
    status: 'pending',
    date: '2 days ago',
    category: 'Plating / Dressing',
    thumbnailUrl: null,
    metaId: 'fb_456789123'
  },
  {
    id: 'm4',
    title: 'Red Wine Reduction & Deglazing',
    source: 'uploaded',
    duration: '0:58',
    status: 'processing',
    date: '3 days ago',
    category: 'Liquids / Deglazing',
    thumbnailUrl: null,
    metaId: null
  },
  {
    id: 'm5',
    title: 'Fresh Basil Chiffonade Express',
    source: 'uploaded',
    duration: '1:02',
    status: 'error',
    date: '4 days ago',
    category: 'Herbs / Greens',
    thumbnailUrl: null,
    metaId: null
  },
  {
    id: 'm6',
    title: 'Raw Kitchen Video Upload Test',
    source: 'uploaded',
    duration: '0:00',
    status: 'pending',
    date: '5 days ago',
    category: null,
    thumbnailUrl: null,
    metaId: null
  }
];

export const useGordonStore = create<GordonStore>((set) => ({
  user: null,
  accessToken: null,
  videos: mockVideos,
  sourceFilter: 'all',
  statusFilter: 'all',
  categoryFilter: 'all',
  showUpload: false,
  activeNav: 'gallery',
  gordonStatus: 'online',
  toasts: [],
  searchQuery: '',

  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setVideos: (videos) => set({ videos }),
  addVideo: (video) => set((state) => ({ 
    videos: [video, ...state.videos] 
  })),
  updateVideoStatus: (id, status) => set((state) => ({
    videos: state.videos.map((vid) => 
      vid.id === id ? { ...vid, status } : vid
    )
  })),
  setSourceFilter: (sourceFilter) => set({ sourceFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setShowUpload: (showUpload) => set({ showUpload }),
  setActiveNav: (activeNav) => set({ activeNav }),
  setGordonStatus: (gordonStatus) => set({ gordonStatus }),
  addToast: (text, type = 'success') => set((state) => {
    const id = Math.random().toString(36).substring(7)
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      set((state2) => ({
        toasts: state2.toasts.filter((t) => t.id !== id)
      }))
    }, 4000)
    return {
      toasts: [...state.toasts, { id, type, text }]
    }
  }),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}))
