'use client';

import { useState, useEffect, useRef } from 'react';
import Terminal, { TerminalHandle } from './components/Terminal';
import CodeEditor, { CodeEditorHandle } from './components/CodeEditor';
import { SoundManager } from './utils/sound';

// Available modes
type Mode = 'terminal' | 'editor';

// Languages for the code editor
const LANGUAGES = ['JavaScript', 'Python', 'Java', 'HTML/CSS', 'SQL'];

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState(false); // Disabled by default
  const [mode, setMode] = useState<Mode>('terminal'); // Default to terminal mode
  const [language, setLanguage] = useState(LANGUAGES[0]); // Default to JavaScript
  
  const soundManagerRef = useRef<SoundManager | null>(null);
  const terminalRef = useRef<TerminalHandle>(null);
  const editorRef = useRef<CodeEditorHandle>(null);

  useEffect(() => {
    // Initialize sound manager
    soundManagerRef.current = new SoundManager();
    soundManagerRef.current.initialize();
    
    // Set up global keyboard listener
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for some keys to avoid browser shortcuts
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        return; // Allow browser refresh
      }
      
      if (e.key === 'Tab' || e.key === 'Alt' || e.ctrlKey) {
        e.preventDefault(); // Prevent tab navigation and other browser shortcuts
      }
      
      // Forward the key to the active component
      if (mode === 'terminal' && terminalRef.current) {
        terminalRef.current.handleKeyPress(e.key);
      } else if (mode === 'editor' && editorRef.current) {
        editorRef.current.handleKeyPress(e.key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode]); // Re-add the listener when mode changes

  const playSound = () => {
    if (soundEnabled && soundManagerRef.current) {
      soundManagerRef.current.playRandomSound();
    }
  };

  const handleSaveLog = () => {
    // Create a link element
    const element = document.createElement('a');
    
    // Set the href to a data URL representing the terminal content
    const selector = mode === 'terminal' ? '.terminal div' : '.code-editor div';
    const lines = document.querySelectorAll(selector);
    const text = Array.from(lines).map(line => line.textContent).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    
    // Set download attribute to specify filename
    const prefix = mode === 'terminal' ? 'hacker-session' : `${language.toLowerCase()}-code`;
    element.download = `${prefix}-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.log`;
    
    // Simulate click to trigger download
    document.body.appendChild(element);
    element.click();
    
    // Clean up
    document.body.removeChild(element);
  };

  const handleClearLogs = () => {
    // Clear the terminal or editor content
    if (mode === 'terminal' && terminalRef.current) {
      terminalRef.current.clearTerminal();
    } else if (mode === 'editor' && editorRef.current) {
      editorRef.current.clearEditor();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-gradient-to-b from-gray-900 to-black text-green-400">
      <div className="w-full max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            Type Like a Hacker
          </h1>
          <p className="text-gray-400 text-sm">Press any key to start typing. The matrix is waiting.</p>
        </header>
        
        <div className="controls mb-6 flex flex-wrap gap-3 justify-between items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 shadow-xl">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Sound toggle */}
            <div className="flex items-center space-x-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={() => setSoundEnabled(!soundEnabled)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                <span className="ml-2 text-sm font-medium text-white">Sound</span>
              </label>
            </div>
            
            {/* Divider */}
            <div className="h-6 w-px bg-gray-700"></div>
            
            {/* Mode selector */}
            <div className="flex items-center justify-between w-full px-4 py-2">
              <div className="flex items-center space-x-4">
                <div className="relative z-10 rounded-md mode-selector">
                  <button
                    className={`relative px-3 py-1.5 text-sm font-medium text-white rounded-l-md border border-gray-700 ${
                      mode === 'terminal'
                        ? 'bg-green-600 bg-opacity-40'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setMode('terminal')}
                  >
                    Terminal
                    {mode === 'terminal' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400"></span>
                    )}
                  </button>
                  <button
                    className={`relative px-3 py-1.5 text-sm font-medium text-white rounded-r-md border border-gray-700 ${
                      mode === 'editor'
                        ? 'bg-green-600 bg-opacity-40'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => setMode('editor')}
                  >
                    Editor
                    {mode === 'editor' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400"></span>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Language selector (only visible in editor mode) */}
            {mode === 'editor' && (
              <>
                {/* Divider */}
                <div className="h-6 w-px bg-gray-700"></div>
                
                <div className="language-selector flex gap-2 items-center">
                  <span className="text-white text-sm">Language:</span>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1.5 text-sm focus:ring-green-500 focus:border-green-500 outline-none appearance-none"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleSaveLog}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all duration-200 ease-in-out flex items-center gap-2 text-sm shadow-lg relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Save Log
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </button>

            <button
              onClick={handleClearLogs}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-md transition-all duration-200 ease-in-out flex items-center gap-2 text-sm shadow-lg relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Clear Logs
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-red-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </button>
          </div>
        </div>
        
        <div className="terminal-container border border-green-500/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(74,222,128,0.15)] backdrop-blur-sm">
          {/* Terminal header with fake controls */}
          <div className="bg-gray-800 px-4 py-2 flex items-center border-b border-gray-700">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center text-xs text-gray-400">
              {mode === 'terminal' ? 'bash - hacker@mainframe' : `${language} - code@mainframe`}
            </div>
          </div>
          
          {/* Terminal/Editor content */}
          <div className="backdrop-blur-sm backdrop-filter">
            {mode === 'terminal' ? (
              <Terminal
                ref={terminalRef}
                soundEnabled={soundEnabled}
                playSound={playSound}
              />
            ) : (
              <CodeEditor
                ref={editorRef}
                soundEnabled={soundEnabled}
                playSound={playSound}
                language={language}
              />
            )}
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs">
          {mode === 'terminal' ? (
            <p className="text-green-300/70">Enter the matrix. Execute commands with each keystroke.</p>
          ) : (
            <p className="text-green-300/70">Crafting {language} code one character at a time.</p>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Hacker Terminal | Press any key to continue</p>
      </footer>
    </main>
  );
} 