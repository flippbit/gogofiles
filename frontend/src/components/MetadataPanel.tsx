import React from "react";
import { File, Folder, Calendar, Clock, Shield, HardDrive } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { main } from "../../wailsjs/go/models";

type FileNode = main.FileNodeWithDetails;

interface MetadataPanelProps {
  item: FileNode | null;
  itemPath: string;
}

export function MetadataPanel({ item, itemPath }: MetadataPanelProps) {
  if (!item) {
    return (
      <div className="w-80 border-l bg-muted/10 p-4">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <File className="h-16 w-16 mb-4" />
          <p>Select a file or folder to view details</p>
        </div>
      </div>
    );
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatPermissions = (permissions: number): string => {
    return (permissions & 0o777).toString(8).padStart(3, '0');
  };

  const getFileType = (item: FileNode): string => {
    if (item.is_dir) return "Folder";
    const extension = item.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "Image";
      case "pdf":
        return "PDF Document";
      case "txt":
        return "Text Document";
      case "docx":
        return "Word Document";
      case "xlsx":
        return "Excel Spreadsheet";
      case "js":
      case "ts":
      case "tsx":
        return "JavaScript/TypeScript";
      case "py":
        return "Python Script";
      case "go":
        return "Go Source";
      case "md":
        return "Markdown Document";
      case "mp3":
      case "wav":
        return "Audio File";
      case "mp4":
      case "avi":
        return "Video File";
      case "zip":
      case "tar":
      case "gz":
        return "Archive";
      default:
        return "File";
    }
  };

  const countItemsRecursively = (node: FileNode): { files: number; folders: number; totalSize: number } => {
    let files = 0;
    let folders = 0;
    let totalSize = node.size || 0;

    if (node.is_dir && node.children) {
      folders = 1;
      for (const child of node.children) {
        const childCount = countItemsRecursively(child);
        files += childCount.files;
        folders += childCount.folders;
        totalSize += childCount.totalSize;
      }
    } else {
      files = 1;
    }

    return { files, folders, totalSize };
  };

  const stats = item.is_dir ? countItemsRecursively(item) : null;

  return (
    <div className="w-80 border-l bg-muted/10">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Properties</h3>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-6">
          {/* Header with icon and name */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background">
              {item.is_dir ? (
                <Folder className="h-8 w-8 text-blue-500" />
              ) : (
                <File className="h-8 w-8 text-gray-500" />
              )}
            </div>
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">{getFileType(item)}</p>
            </div>
          </div>

          {/* Size information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="h-4 w-4" />
              <span className="font-medium">Size</span>
            </div>
            <div className="pl-6 space-y-1">
              {item.is_dir && stats ? (
                <>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Total:</span>{" "}
                    {formatFileSize(stats.totalSize)}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Files:</span> {stats.files - 1}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Folders:</span> {stats.folders - 1}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm">{formatFileSize(item.size)}</p>
                  {item.hash && (
                    <p className="text-xs text-muted-foreground font-mono">
                      Hash: {item.hash.substring(0, 12)}...
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Date information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Dates</span>
            </div>
            <div className="pl-6 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Modified</p>
                <p className="text-sm">{formatDate(item.mod_time)}</p>
              </div>
              {item.created_time && (
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">{formatDate(item.created_time)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Permissions</span>
            </div>
            <div className="pl-6">
              <p className="text-sm font-mono">{formatPermissions(item.permissions)}</p>
            </div>
          </div>

          {/* Path */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Path</p>
            <p className="text-xs text-muted-foreground break-all">{itemPath || item.path}</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}