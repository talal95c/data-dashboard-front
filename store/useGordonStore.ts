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
  activeChef: string;
  purchasedChefs: string[];
  robotCredits: number;

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
  setActiveChef: (name: string) => void;
  purchaseChef: (name: string) => void;
  addCredits: (amount: number) => void;
}

const mockVideos: Video[] = [
  {
    id: 'm1',
    title: 'Pick & Place — Station A7',
    source: 'rayban',
    duration: '0:45',
    status: 'analyzed',
    date: 'Today',
    category: 'Pick & Place',
    thumbnailUrl: null,
    metaId: 'fb_123456789'
  },
  {
    id: 'm2',
    title: 'Weld Seam Line B2',
    source: 'rayban',
    duration: '2:15',
    status: 'analyzed',
    date: 'Yesterday',
    category: 'Welding',
    thumbnailUrl: null,
    metaId: 'fb_987654321'
  },
  {
    id: 'm3',
    title: 'Screw Assembly — Part C4',
    source: 'rayban',
    duration: '1:30',
    status: 'pending',
    date: '2 days ago',
    category: 'Assembly',
    thumbnailUrl: null,
    metaId: 'fb_456789123'
  },
  {
    id: 'm4',
    title: 'Packaging Seal Sequence D1',
    source: 'uploaded',
    duration: '0:58',
    status: 'processing',
    date: '3 days ago',
    category: 'Packaging',
    thumbnailUrl: null,
    metaId: null
  },
  {
    id: 'm5',
    title: 'Visual Inspection Cycle E3',
    source: 'uploaded',
    duration: '1:02',
    status: 'error',
    date: '4 days ago',
    category: 'Inspection',
    thumbnailUrl: null,
    metaId: null
  },
  {
    id: 'm6',
    title: 'Raw Recording — Upload Test',
    source: 'uploaded',
    duration: '0:00',
    status: 'pending',
    date: '5 days ago',
    category: null,
    thumbnailUrl: null,
    metaId: null
  }
]

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
  activeChef: 'Pick & Place',
  purchasedChefs: ['Pick & Place'],
  robotCredits: 200,

  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setVideos: (videos) => set({ videos }),
  addVideo: (video) => set((state) => ({ videos: [video, ...state.videos] })),
  updateVideoStatus: (id, status) => set((state) => ({
    videos: state.videos.map((v) => v.id === id ? { ...v, status } : v)
  })),
  setSourceFilter: (sourceFilter) => set({ sourceFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setShowUpload: (showUpload) => set({ showUpload }),
  setActiveNav: (activeNav) => set({ activeNav }),
  setGordonStatus: (gordonStatus) => set({ gordonStatus }),
  addToast: (text, type = 'success') => set((state) => {
    const id = Math.random().toString(36).substring(7)
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4000)
    return { toasts: [...state.toasts, { id, type, text }] }
  }),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveChef: (activeChef) => set({ activeChef }),
  purchaseChef: (name) => set((state) => {
    if (state.purchasedChefs.includes(name)) return {}
    return { purchasedChefs: [...state.purchasedChefs, name] }
  }),
  addCredits: (amount) => set((state) => ({ robotCredits: state.robotCredits + amount })),
}))
