import React from "react";
import { TabBar } from "@/components/TabBar";
import { TabContent } from "@/components/TabContent";
import useTabsStore from "@/store/tabs";
import { SelectDirectory } from "../../wailsjs/go/main/App";

function App() {
  const { tabs, activeTabId, addTab } = useTabsStore();

  const handleNewTab = async () => {
    try {
      const selectedPath = await SelectDirectory();
      
      if (selectedPath) {
        addTab(selectedPath);
      }
    } catch (error) {
      console.error("Failed to select directory:", error);
    }
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="flex flex-col h-screen bg-background">
      <TabBar onNewTab={handleNewTab} />
      
      <div className="flex-1 overflow-hidden">
        {tabs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-lg mb-4">No tabs open</p>
              <p className="text-muted-foreground">
                Click the + button to add a new tab and scan a directory
              </p>
            </div>
          </div>
        ) : activeTab ? (
          <TabContent tabId={activeTab.id} />
        ) : null}
      </div>
    </div>
  );
}

export default App;
