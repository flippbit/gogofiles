import React from "react";
import { Plus, X, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTabsStore from "@/store/tabs";

interface TabBarProps {
  onNewTab: () => void;
}

export function TabBar({ onNewTab }: TabBarProps) {
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabsStore();

  return (
    <div className="flex items-center border-b bg-muted/10">
      <div className="flex items-center overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 border-r cursor-pointer hover:bg-accent/50 ${
              activeTabId === tab.id ? "bg-background border-b-2 border-b-primary" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Folder className="h-4 w-4" />
            <span className="text-sm font-medium">{tab.title}</span>
            {tabs.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="ml-2 h-8 w-8 p-0" 
        onClick={onNewTab}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}