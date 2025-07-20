import React, { useEffect } from "react";
import { FileBrowser } from "./file-browser";
import { MetadataPanel } from "./MetadataPanel";
import { CreateFileTreeWithDetails } from "../../wailsjs/go/main/App";
import useTabsStore from "@/store/tabs";
import type { main } from "../../wailsjs/go/models";

type FileNode = main.FileNodeWithDetails;

interface TabContentProps {
  tabId: string;
}

export function TabContent({ tabId }: TabContentProps) {
  const { tabs, updateTab } = useTabsStore();
  const tab = tabs.find(t => t.id === tabId);

  useEffect(() => {
    if (tab && !tab.fileTree && !tab.isLoading) {
      performScan();
    }
  }, [tab]);

  const performScan = async () => {
    if (!tab) return;

    updateTab(tabId, { isLoading: true });
    
    try {
      const fileTree = await CreateFileTreeWithDetails(tab.path);
      updateTab(tabId, { fileTree, isLoading: false });
    } catch (error) {
      console.error("Failed to scan directory:", error);
      updateTab(tabId, { isLoading: false });
    }
  };

  const handleSelect = (item: FileNode, fullPath: string) => {
    updateTab(tabId, {
      selectedItem: item,
      selectedItemPath: fullPath,
    });
  };

  if (!tab) {
    return null;
  }

  if (tab.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg mb-2">Scanning directory...</p>
          <p className="text-muted-foreground">{tab.path}</p>
        </div>
      </div>
    );
  }

  if (!tab.fileTree) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg mb-2">No data available</p>
          <p className="text-muted-foreground">Failed to scan directory</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <FileBrowser
          fileTree={tab.fileTree}
          allowToggleFolder={true}
          onSelect={handleSelect}
          selectedItem={tab.selectedItem}
        />
      </div>
      <MetadataPanel
        item={tab.selectedItem}
        itemPath={tab.selectedItemPath}
      />
    </div>
  );
}