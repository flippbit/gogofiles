import {useState} from 'react';
import {Greet} from "../wailsjs/go/main/App.js";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState('');
    const updateName = (e: any) => setName(e.target.value);
    const updateResultText = (result: string) => setResultText(result);

    function greet() {
        Greet(name).then(updateResultText);
    }

    return (
        <div id="App">
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <ModeToggle />
                <div id="result" className="text-3xl font-bold underline text-blue-500">{resultText}</div>
                <input id="name" className="border border-gray-300 rounded px-2 py-1" onChange={updateName} autoComplete="off" name="input" type="text"/>
                <Button variant='outline' onClick={greet}>Greet</Button>
            </ThemeProvider>
        </div>
        
    )
}

export default App
