import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type * as React from "react";
import { Greet } from "../wailsjs/go/main/App.js";

function App() {
  const [resultText, setResultText] = useState("Please enter your name below");
  const [name, setName] = useState("");
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const updateResultText = (result: string) => setResultText(result);

  function greet() {
    Greet(name).then(updateResultText);
  }

  return (
    <div id="App">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ModeToggle />
        <div id="result" className="text-3xl font-bold underline text-blue-500">
          {resultText}
        </div>
        <div className="flex align-center mt-2">
          <Input
            id="name"
            onChange={updateName}
            autoComplete="off"
            name="input"
            type="text"
            placeholder="Enter your name"
            className="w-[20rem]"
          />
          <Button variant="outline" onClick={greet} className="ml-2">
            Greet
          </Button>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
