import { create } from "zustand";
import type { main } from "../../wailsjs/go/models";

type FileNode = main.FileNode;

interface Tab {
  id: string;
  title: string;
  path: string;
  fileTree: FileNode | null;
  isLoading: boolean;
}

interface TabsStore {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (path: string) => string;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
}

const useTabsStore = create<TabsStore>((set, get) => ({
  tabs: [],
  activeTabId: null,

  addTab: (path: string) => {
    const id = Date.now().toString();
    const pathParts = path.split("/");
    const title = pathParts[pathParts.length - 1] || path;
    
    set((state) => ({
      tabs: [...state.tabs, { id, title, path, fileTree: null, isLoading: false }],
      activeTabId: id,
    }));
    
    return id;
  },

  removeTab: (id: string) => {
    set((state) => {
      const newTabs = state.tabs.filter((tab) => tab.id !== id);
      let newActiveTabId = state.activeTabId;
      
      if (state.activeTabId === id) {
        const currentIndex = state.tabs.findIndex((tab) => tab.id === id);
        if (newTabs.length > 0) {
          const newIndex = Math.min(currentIndex, newTabs.length - 1);
          newActiveTabId = newTabs[newIndex].id;
        } else {
          newActiveTabId = null;
        }
      }
      
      return { tabs: newTabs, activeTabId: newActiveTabId };
    });
  },

  setActiveTab: (id: string) => {
    set({ activeTabId: id });
  },

  updateTab: (id: string, updates: Partial<Tab>) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab)),
    }));
  },
}));

export default useTabsStore;
