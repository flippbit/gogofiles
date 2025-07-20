"use client";

import * as React from "react";
import {
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  ImageIcon,
  FileText,
  Code,
  Music,
  Video,
  Archive,
  Home,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { main } from "../../wailsjs/go/models";

type FileNode = main.FileNodeWithDetails;

function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
      return <ImageIcon className="h-4 w-4" />;
    case "txt":
    case "md":
    case "doc":
    case "docx":
    case "pdf":
      return <FileText className="h-4 w-4" />;
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "html":
    case "css":
    case "py":
    case "java":
    case "cpp":
      return <Code className="h-4 w-4" />;
    case "mp3":
    case "wav":
    case "flac":
      return <Music className="h-4 w-4" />;
    case "mp4":
    case "avi":
    case "mov":
      return <Video className="h-4 w-4" />;
    case "zip":
    case "rar":
    case "7z":
      return <Archive className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
}

interface TreeNodeProps {
  item: FileNode;
  level: number;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onNavigateToFolder: (item: FileNode) => void;
  allowToggleFolder: boolean;
  onSelect?: (item: FileNode, fullPath: string) => void;
  selectedItem?: FileNode | null;
}

function TreeNode({
  item,
  level,
  expandedFolders,
  onToggleFolder,
  onNavigateToFolder,
  allowToggleFolder,
  onSelect,
  selectedItem,
}: TreeNodeProps) {
  const isExpanded = expandedFolders.has(item.path);
  const isSelected = selectedItem === item;

  const handleClick = () => {
    if (onSelect) {
      // Calculate the full path relative to root
      const fullPath = item.path;
      onSelect(item, fullPath);
    }
    if (item.is_dir && allowToggleFolder) {
      onToggleFolder(item.path);
    }
  };

  const handleDoubleClick = () => {
    if (item.is_dir) {
      onNavigateToFolder(item);
    }
  };

  const dirTitle = allowToggleFolder
    ? "Click to expand/collapse, double-click to navigate"
    : "Double-click to navigate";
  const title = item.is_dir ? dirTitle : item.name;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm group ${
          isSelected ? "bg-accent text-accent-foreground" : ""
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        title={title}
      >
        {item.is_dir && allowToggleFolder && (
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        )}
        {item.is_dir && !allowToggleFolder && <span className="w-4 h-4" />}
        {item.is_dir ? (
          isExpanded && allowToggleFolder ? (
            <FolderOpen className="h-4 w-4 text-blue-500" />
          ) : (
            <Folder className="h-4 w-4 text-blue-500" />
          )
        ) : (
          getFileIcon(item.name)
        )}
        <span className="text-sm flex-1">{item.name}</span>
        {item.is_dir && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToFolder(item);
            }}
            title="Navigate into folder"
          >
            <ArrowLeft className="h-3 w-3 rotate-180" />
          </Button>
        )}
      </div>

      {item.is_dir &&
        isExpanded &&
        item.children &&
        item.children.length > 0 && (
          <div>
            {item.children.map((child) => (
              <TreeNode
                key={child.path}
                item={child}
                level={level + 1}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
                onNavigateToFolder={onNavigateToFolder}
                allowToggleFolder={allowToggleFolder}
                onSelect={onSelect}
                selectedItem={selectedItem}
              />
            ))}
          </div>
        )}
    </div>
  );
}

interface FileBrowserProps {
  fileTree: FileNode | null;
  allowToggleFolder?: boolean;
  onSelect?: (item: FileNode, fullPath: string) => void;
  selectedItem?: FileNode | null;
}

export function FileBrowser({
  fileTree,
  allowToggleFolder = true,
  onSelect,
  selectedItem,
}: FileBrowserProps) {
  if (!fileTree) return null;

  const [root, setRoot] = React.useState<FileNode | null>(fileTree);
  const [currentRoot, setCurrentRoot] = React.useState<FileNode | null>(
    fileTree
  );
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(
    new Set([fileTree.path])
  );

  React.useEffect(() => {
    setRoot(fileTree);
    setCurrentRoot(fileTree);
    setExpandedFolders(new Set([fileTree.path]));
  }, []);

  const handleToggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleNavigateToFolder = (folder: FileNode) => {
    setCurrentRoot(folder);
    setExpandedFolders(new Set([folder.path]));
  };

  const findNodeByPath = (node: FileNode, path: string): FileNode | null => {
    if (node.path === path) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeByPath(child, path);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const getPathSegments = (path: string | undefined): string[] => {
    if (!root || !path) return [];
    const rootPath = root.path;
    if (path === rootPath) return [root.name];
    const relativePath = path.replace(rootPath, "").slice(1);
    return [root.name, ...relativePath.split("/")];
  };

  const goBack = () => {
    if (!currentRoot || !root || currentRoot.path === root.path) return;
    const parentPath = currentRoot.path.substring(
      0,
      currentRoot.path.lastIndexOf("/")
    );
    const parentNode = findNodeByPath(root, parentPath);
    if (parentNode) {
      setCurrentRoot(parentNode);
    }
  };

  const navigateToPath = (targetPath: string) => {
    const node = findNodeByPath(root!, targetPath);
    if (node) {
      setCurrentRoot(node);
      setExpandedFolders(new Set([node.path]));
    }
  };

  const breadcrumbSegments = React.useMemo(() => {
    if (!root || !currentRoot) return [];
    const segments = [];
    let currentPath = root.path;
    segments.push({ name: root.name, path: root.path });

    if (currentRoot.path !== root.path) {
      const relativePath = currentRoot.path.replace(root.path, "").substring(1);
      const parts = relativePath.split("/");

      for (let i = 0; i < parts.length; i++) {
        currentPath += "/" + parts[i];
        segments.push({ name: parts[i], path: currentPath });
      }
    }

    return segments;
  }, [root, currentRoot]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="border-b p-4">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToPath(root!.path)}
            disabled={!root || currentRoot?.path === root?.path}
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            disabled={!root || currentRoot?.path === root?.path}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Breadcrumb className="flex-1">
            <BreadcrumbList>
              {breadcrumbSegments.map((segment, index) => (
                <React.Fragment key={segment.path}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {index === breadcrumbSegments.length - 1 ? (
                      <BreadcrumbPage>{segment.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        onClick={() => navigateToPath(segment.path)}
                        className="cursor-pointer"
                      >
                        {segment.name}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-2">
            {allowToggleFolder
              ? "Click to expand/collapse folders • Double-click to navigate into folders"
              : "Double-click to navigate into folders"}
          </div>
          {currentRoot &&
          currentRoot.children &&
          currentRoot.children.length > 0 ? (
            currentRoot.children.map((item) => (
              <TreeNode
                key={item.path}
                item={item}
                level={0}
                expandedFolders={expandedFolders}
                onToggleFolder={handleToggleFolder}
                onNavigateToFolder={handleNavigateToFolder}
                allowToggleFolder={allowToggleFolder}
                onSelect={onSelect}
                selectedItem={selectedItem}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Folder className="h-16 w-16 mb-4" />
              <p>This folder is empty</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
