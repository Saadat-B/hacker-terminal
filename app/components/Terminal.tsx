'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { generateCommand, getCommandOutput } from '../utils/commands';

interface TerminalProps {
  soundEnabled: boolean;
  playSound: () => void;
}

export interface TerminalHandle {
  handleKeyPress: (key: string) => void;
  clearTerminal: () => void;
}

const Terminal = forwardRef<TerminalHandle, TerminalProps>(
  ({ soundEnabled, playSound }, ref) => {
    const [lines, setLines] = useState<string[]>(['$ ']);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cursor, setCursor] = useState<{ show: boolean; line: number; char: number }>({
      show: true,
      line: 0,
      char: 0,
    });
    const terminalRef = useRef<HTMLDivElement>(null);

    // Blink the cursor
    useEffect(() => {
      const interval = setInterval(() => {
        setCursor((prev) => ({ ...prev, show: !prev.show }));
      }, 500);
      return () => clearInterval(interval);
    }, []);

    // Auto-scroll to bottom when new lines are added
    useEffect(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, [lines]);

    // Add initial welcome message
    useEffect(() => {
      setLines([
        '# Terminal initialized - SecureBashRC v3.4.1',
        '# Connection established to central mainframe',
        '# All systems operational',
        '# Press any key to begin hacking sequence',
        '$ '
      ]);
    }, []);

    const handleKeyPress = (
      // The key parameter is required for the interface but not used in this implementation
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      key: string
    ) => {
      if (soundEnabled) {
        playSound();
      }

      // Only process keypresses if we're not already processing a command
      if (!isProcessing) {
        setIsProcessing(true);
        
        // Generate a new command regardless of which key was pressed
        const newCommand = generateCommand();
        
        // Add the prompt symbol to make it look like a command
        const promptLine = `$ ${newCommand}`;
        setLines([...lines, promptLine]);
        
        // Simulate typing animation for command result/output
        setTimeout(() => {
          // Generate a random number of output lines (1-5)
          const numOutputLines = Math.floor(Math.random() * 5) + 1;
          
          // Get command specific outputs or random outputs
          const outputs = getCommandOutput(newCommand, numOutputLines);
          
          let newLines = [...lines, promptLine];
          let outputAdded = 0;
          
          const addOutputLine = () => {
            if (outputAdded < outputs.length) {
              // Add the current output line
              newLines = [...newLines, outputs[outputAdded]];
              setLines(newLines);
              outputAdded++;
              
              // Schedule the next output line with varying delay to simulate processing
              const typingDelay = outputs[outputAdded - 1].length * 5 + Math.random() * 200 + 100;
              setTimeout(addOutputLine, typingDelay);
            } else {
              // We're done processing
              setTimeout(() => {
                setIsProcessing(false);
                
                // Add an empty line with just the prompt for the next command
                setLines([...newLines, '$ ']);
              }, 300); // Short delay before showing the next prompt
            }
          };
          
          // Start adding output lines
          setTimeout(addOutputLine, 300);
          
        }, 300); // Initial delay before showing output
      }
    };

    const clearTerminal = () => {
      setLines(['$ ']);
      setIsProcessing(false);
    };

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      handleKeyPress,
      clearTerminal
    }));

    return (
      <div 
        className="terminal bg-gray-900/80 text-green-400 font-mono p-4 rounded-b-xl h-[60vh] overflow-auto w-full border-t border-gray-800"
        ref={terminalRef}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre leading-6">
            {line}
            {i === lines.length - 1 && cursor.show && !isProcessing && (
              <span className="animate-pulse text-green-300">▌</span>
            )}
          </div>
        ))}
      </div>
    );
  }
);

Terminal.displayName = 'Terminal';

export default Terminal; 