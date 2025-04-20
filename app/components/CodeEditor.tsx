'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { generateCodeSnippet } from '../utils/codeSnippets';

interface CodeEditorProps {
  soundEnabled: boolean;
  playSound: () => void;
  language: string;
}

export interface CodeEditorHandle {
  handleKeyPress: (key: string) => void;
  clearEditor: () => void;
}

const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  ({ soundEnabled, playSound, language }, ref) => {
    // Static lines that won't change (welcome messages and completed snippets)
    const [staticLines, setStaticLines] = useState<string[]>([]);
    
    // Active snippet being typed
    const [activeSnippet, setActiveSnippet] = useState<string[]>([]);
    
    // How many characters have been typed in the current snippet
    const [typedChars, setTypedChars] = useState(0);
    
    // Total number of characters in the current snippet (calculated from all lines)
    const [totalChars, setTotalChars] = useState(0);
    
    // Current line and character positions
    const [currentLine, setCurrentLine] = useState(0);
    const [currentChar, setCurrentChar] = useState(0);
    
    // Processing state
    const [isProcessing, setIsProcessing] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);
    
    // Reference to the editor div for scrolling
    const editorRef = useRef<HTMLDivElement>(null);

    // Blink the cursor
    useEffect(() => {
      const interval = setInterval(() => {
        setCursorVisible((prev) => !prev);
      }, 500);
      return () => clearInterval(interval);
    }, []);

    // Auto-scroll to bottom when new lines are added
    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.scrollTop = editorRef.current.scrollHeight;
      }
    }, [staticLines, activeSnippet, currentLine]);

    // Add initial welcome message
    useEffect(() => {
      setStaticLines([
        `// ${language} Editor initialized`,
        `// Start typing to generate ${language} code`,
      ]);
      
      // Reset states when language changes
      setActiveSnippet([]);
      setTypedChars(0);
      setTotalChars(0);
      setCurrentLine(0);
      setCurrentChar(0);
    }, [language]);

    // Handle a keypress
    const handleKeyPress = (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      key: string
    ) => {
      if (soundEnabled) {
        playSound();
      }

      if (!isProcessing) {
        // If we've reached the end of the current snippet, start a new one
        if (activeSnippet.length === 0 || typedChars >= totalChars) {
          startNewSnippet();
        } else {
          // Continue typing the current snippet
          setIsProcessing(true);
          setTimeout(() => typeNextCharacters(), 50);
        }
      }
    };
    
    // Start typing a new code snippet
    const startNewSnippet = () => {
      try {
        // Get a new snippet and ensure it's not empty
        const rawSnippet = generateCodeSnippet(language);
        const newSnippet = rawSnippet.split('\n').filter(line => line !== undefined);
        
        // Safety check - if somehow the snippet is empty, provide a default
        if (newSnippet.length === 0) {
          newSnippet.push(`// Empty ${language} snippet`);
        }
        
        // Calculate total chars in the snippet
        const chars = newSnippet.reduce((sum, line) => sum + (line?.length || 0), 0);
        
        // Set up the new snippet
        setActiveSnippet(newSnippet);
        setTypedChars(0);
        setTotalChars(chars);
        setCurrentLine(0);
        setCurrentChar(0);
        setIsProcessing(true);
        
        // Begin typing animation
        setTimeout(() => typeNextCharacters(), 50);
      } catch (error) {
        console.error("Error starting new snippet:", error);
        setIsProcessing(false);
      }
    };
    
    // Type the next few characters in the snippet
    const typeNextCharacters = () => {
      try {
        // Safety check - if snippet is empty or invalid, reset and return
        if (!activeSnippet || activeSnippet.length === 0) {
          setIsProcessing(false);
          return;
        }
        
        // Type 1-3 characters at a time for a realistic effect
        const charsToType = Math.floor(Math.random() * 3) + 1;
        let charsTyped = 0;
        
        // Copy current state
        let line = currentLine;
        let char = currentChar;
        let typed = typedChars;
        
        // Safety check - ensure line is within bounds
        if (line >= activeSnippet.length) {
          line = activeSnippet.length - 1;
        }
        
        // Type characters up to the limit
        while (charsTyped < charsToType && typed < totalChars) {
          // Safety check - ensure we have valid lines
          if (line >= activeSnippet.length || !activeSnippet[line]) {
            break;
          }
          
          // Get the current line safely
          const currentLine = activeSnippet[line] || '';
          
          // Increment character count
          char++;
          typed++;
          charsTyped++;
          
          // If we reach the end of a line, move to the next line
          if (char >= currentLine.length) {
            line++;
            char = 0;
            
            // Safety check - if we've gone past the last line, break
            if (line >= activeSnippet.length) {
              break;
            }
          }
        }
        
        // Update state
        setCurrentLine(line);
        setCurrentChar(char);
        setTypedChars(typed);
        
        // Check if we've finished typing the snippet
        if (typed >= totalChars || line >= activeSnippet.length) {
          // Move the completed snippet to the static lines
          const completedLines = [...staticLines, ...activeSnippet];
          setStaticLines(completedLines);
          setActiveSnippet([]);
          
          // Reset typing state
          setTimeout(() => {
            setIsProcessing(false);
          }, 300);
        } else {
          // Continue typing after a short delay
          setTimeout(() => {
            setIsProcessing(false);
          }, 30 + Math.random() * 50);
        }
      } catch (error) {
        console.error("Error in typing animation:", error);
        setIsProcessing(false);
      }
    };

    // Generate the array of lines to display
    const displayLines = () => {
      try {
        // Start with all static lines
        const lines = [...staticLines];
        
        // Add the active snippet with proper typing animation
        if (activeSnippet && activeSnippet.length > 0) {
          // Add fully typed lines
          for (let i = 0; i < Math.min(currentLine, activeSnippet.length); i++) {
            if (activeSnippet[i] !== undefined) {
              lines.push(activeSnippet[i]);
            }
          }
          
          // Add the currently typing line (partially typed)
          if (currentLine < activeSnippet.length && activeSnippet[currentLine]) {
            const lineToType = activeSnippet[currentLine];
            lines.push(lineToType.substring(0, Math.min(currentChar, lineToType.length)));
          }
        }
        
        // Add a blank line at the end for the cursor
        if (!activeSnippet || activeSnippet.length === 0) {
          lines.push('');
        }
        
        return lines;
      } catch (error) {
        console.error("Error generating display lines:", error);
        return staticLines.concat(['// Error displaying code']);
      }
    };

    // Clear the editor content
    const clearEditor = () => {
      setStaticLines([
        `// ${language} Editor initialized`,
        `// Start typing to generate ${language} code`,
      ]);
      setActiveSnippet([]);
      setTypedChars(0);
      setTotalChars(0);
      setCurrentLine(0);
      setCurrentChar(0);
      setIsProcessing(false);
    };

    // Expose handleKeyPress method to parent component via ref
    useImperativeHandle(ref, () => ({
      handleKeyPress,
      clearEditor
    }));

    // Get the current cursor position
    const getCursorPosition = () => {
      try {
        if (!activeSnippet || activeSnippet.length === 0) {
          // Cursor is at the end if no active snippet
          return staticLines.length;
        }
        
        // Otherwise cursor is at the current typing position
        return Math.min(staticLines.length + currentLine, displayLines().length - 1);
      } catch (error) {
        console.error("Error calculating cursor position:", error);
        return staticLines.length;
      }
    };

    return (
      <div 
        className="code-editor bg-gray-900/80 text-green-400 font-mono p-4 rounded-b-xl h-[60vh] overflow-auto w-full border-t border-gray-800"
        ref={editorRef}
      >
        {displayLines().map((line, i) => (
          <div key={i} className="whitespace-pre leading-6">
            {line || ''}
            {i === getCursorPosition() && cursorVisible && !isProcessing && (
              <span className="animate-pulse text-green-300">▌</span>
            )}
          </div>
        ))}
      </div>
    );
  }
);

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor; 