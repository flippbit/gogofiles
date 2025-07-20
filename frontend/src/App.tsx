import { ThemeProvider } from "@/components/theme-provider";
import { FileBrowser } from "@/components/file-browser";
import { useEffect, useState } from "react";
import { CreateFileTree } from "../wailsjs/go/main/App";
import type { main } from "../wailsjs/go/models";

type FileNode = main.FileNode;

function App() {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);

  useEffect(() => {
    const fetchFileTree = async () => {
      const tree = await CreateFileTree(".", true);
      setFileTree(tree);
    };
    fetchFileTree();
  }, []);

  return (
    <div id="App">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <FileBrowser allowToggleFolder={false} fileTree={fileTree} />
      </ThemeProvider>
    </div>
  );
}

export default App;
