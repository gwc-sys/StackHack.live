import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

// Types
interface FileEntry {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CompilationResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
  memoryUsed?: number;
}

interface PanelTab {
  id: string;
  name: string;
  component: React.ReactNode;
}

// File System Hook
const useFileSystem = () => {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [currentFileId, setCurrentFileId] = useState<string>('');
  const nextId = useRef(1);

  const createFile = (name: string, language: string, content: string = ''): FileEntry => {
    const file: FileEntry = {
      id: `file-${nextId.current++}`,
      name,
      language,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setFiles(prev => [...prev, file]);
    if (!currentFileId) setCurrentFileId(file.id);
    
    return file;
  };

  const getFile = (id: string): FileEntry | undefined => {
    return files.find(file => file.id === id);
  };

  const updateFile = (id: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === id 
        ? { ...file, content, updatedAt: new Date() }
        : file
    ));
  };

  const deleteFile = (id: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(file => file.id !== id);
      
      if (id === currentFileId && newFiles.length > 0) {
        setCurrentFileId(newFiles[0].id);
      }
      
      return newFiles;
    });
  };

  const currentFile = getFile(currentFileId);

  return {
    files,
    currentFile,
    currentFileId,
    setCurrentFileId,
    createFile,
    getFile,
    updateFile,
    deleteFile
  };
};

// Compiler Service
class CompilerService {
  private readonly API_URL = 'https://emkc.org/api/v2/piston';

  async compileAndExecute(code: string, language: string): Promise<CompilationResult> {
    try {
      const runtime = this.getRuntime(language);
      const response = await fetch(`${this.API_URL}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: runtime.language,
          version: runtime.version,
          files: [{ name: this.getFileName(language), content: code }],
          stdin: ''
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: !data.run.stderr,
        output: data.run.stdout || data.run.stderr,
        error: data.run.stderr || undefined,
        executionTime: data.run.time,
        memoryUsed: data.run.memory
      };
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: `Compilation failed: ${error.message}`
      };
    }
  }

  private getRuntime(language: string): { language: string; version: string } {
    const runtimes: { [key: string]: { language: string; version: string } } = {
      'python': { language: 'python', version: '3.10.0' },
      'java': { language: 'java', version: '15.0.2' },
      'cpp': { language: 'cpp', version: '10.2.0' },
      'javascript': { language: 'javascript', version: '18.15.0' },
      'typescript': { language: 'typescript', version: '5.0.3' },
      'c': { language: 'c', version: '10.2.0' },
      'csharp': { language: 'csharp', version: '6.12.0' },
      'go': { language: 'go', version: '1.16.2' },
      'rust': { language: 'rust', version: '1.68.2' },
      'ruby': { language: 'ruby', version: '3.0.1' }
    };
    return runtimes[language] || { language, version: 'latest' };
  }

  private getFileName(language: string): string {
    const extensions: { [key: string]: string } = {
      'python': 'main.py',
      'java': 'Main.java',
      'cpp': 'main.cpp',
      'javascript': 'main.js',
      'typescript': 'main.ts',
      'c': 'main.c',
      'csharp': 'main.cs',
      'go': 'main.go',
      'rust': 'main.rs',
      'ruby': 'main.rb'
    };
    return extensions[language] || 'main.txt';
  }
}

// Main IDE Component
const OnlineIDE: React.FC = () => {
  // State
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [output, setOutput] = useState<{ type: 'info' | 'success' | 'error'; message: string; details?: string }>();
  const [editorContent, setEditorContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [activeBottomPanel, setActiveBottomPanel] = useState<string>('output');
  const [availablePanels, setAvailablePanels] = useState<PanelTab[]>([
    {
      id: 'output',
      name: 'OUTPUT',
      component: (
        <div className="text-[#969696]">
          {output ? (
            <div className={output.type === 'error' ? 'text-[#f48771]' : output.type === 'success' ? 'text-[#4ec9b0]' : 'text-[#cccccc]'}>
              {output.message.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              {output.details && (
                <div className="mt-2 text-white">
                  {output.details.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>Output will appear here after running code...</div>
          )}
        </div>
      )
    },
    {
      id: 'terminal',
      name: 'TERMINAL',
      component: (
        <div className="text-[#cccccc]">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-400">➜</span>
            <span className="text-blue-400">PS_B:\\Learning Project\\java</span>
          </div>
          <div className="text-[#969696]">Type 'help' for available commands</div>
        </div>
      )
    },
    {
      id: 'problems',
      name: 'PROBLEMS',
      component: (
        <div className="text-[#969696]">
          <div className="flex items-center space-x-2">
            <span>🔍</span>
            <span>No problems have been detected in the workspace.</span>
          </div>
        </div>
      )
    },
    {
      id: 'debug',
      name: 'DEBUG CONSOLE',
      component: (
        <div className="text-[#969696]">
          <div className="flex items-center space-x-2">
            <span>🔍</span>
            <span>Debug console will appear here when debugging starts.</span>
          </div>
        </div>
      )
    }
  ]);
  
  // Services
  const compilerService = useRef(new CompilerService());
  
  // File system
  const fileSystem = useFileSystem();

  // Refs for drag and drop
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Initialize default files
  useEffect(() => {
    const defaultFiles = [
      { 
        name: 'Practice.java', 
        language: 'java', 
        content: `public class Practice {\n    public static void main(String[] args) {\n        int num1 = 10;\n        int num2 = 40;\n        System.out.println("The sum of this two numbers: " + (num1 + num2));\n    }\n}` 
      },
      { name: 'app.py', language: 'python', content: '# Python file\nprint("Hello, World!")' },
    ];

    defaultFiles.forEach(file => {
      fileSystem.createFile(file.name, file.language, file.content);
    });
  }, []);

  // Update editor content when file changes
  useEffect(() => {
    if (fileSystem.currentFile) {
      setEditorContent(fileSystem.currentFile.content);
    }
  }, [fileSystem.currentFileId]);

  // Update output panel when output changes
  useEffect(() => {
    setAvailablePanels(prev => prev.map(panel => 
      panel.id === 'output' 
        ? {
            ...panel,
            component: (
              <div className="text-[#969696]">
                {output ? (
                  <div className={output.type === 'error' ? 'text-[#f48771]' : output.type === 'success' ? 'text-[#4ec9b0]' : 'text-[#cccccc]'}>
                    {output.message.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                    {output.details && (
                      <div className="mt-2 text-white">
                        {output.details.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>Output will appear here after running code...</div>
                )}
              </div>
            )
          }
        : panel
    ));
  }, [output]);

  // Event handlers
  const handleRunCode = async () => {
    if (!fileSystem.currentFile) {
      setOutput({ type: 'error', message: 'No file selected' });
      return;
    }

    setOutput({ type: 'info', message: 'Running code...' });
    setActiveBottomPanel('output');

    try {
      const result = await compilerService.current.compileAndExecute(
        editorContent,
        fileSystem.currentFile.language
      );

      if (result.success) {
        setOutput({
          type: 'success',
          message: `Execution successful\nExecution time: ${result.executionTime}s\nMemory used: ${result.memoryUsed}KB`,
          details: result.output
        });
      } else {
        setOutput({
          type: 'error',
          message: 'Execution failed',
          details: result.error
        });
      }
    } catch (error: any) {
      setOutput({
        type: 'error',
        message: `Error: ${error.message}`
      });
    }
  };

  const handleDebugCode = async () => {
    if (!fileSystem.currentFile) {
      setOutput({ type: 'error', message: 'No file selected' });
      return;
    }

    setOutput({ type: 'info', message: 'Starting debug session...' });
    setActiveBottomPanel('debug');

    // Simulate debug session
    setTimeout(() => {
      setOutput({ 
        type: 'success', 
        message: 'Debug session started\nBreakpoints set\nReady for debugging' 
      });
    }, 1000);
  };

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name (with extension):');
    if (!fileName) return;

    const language = getLanguageFromExtension(fileName);
    fileSystem.createFile(fileName, language, '');
  };

  const handleEditorChange = (value: string | undefined) => {
    setEditorContent(value || '');
    if (fileSystem.currentFile) {
      fileSystem.updateFile(fileSystem.currentFile.id, value || '');
    }
  };

  const handleEditorMount = (editor: any) => {
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        lineNumber: e.position.lineNumber,
        column: e.position.column
      });
    });
  };

  const handleAddPanel = () => {
    const panelName = prompt('Enter panel name:');
    if (!panelName) return;

    const newPanel: PanelTab = {
      id: `panel-${Date.now()}`,
      name: panelName.toUpperCase(),
      component: (
        <div className="text-[#969696]">
          <div>This is your custom panel: {panelName}</div>
          <div>You can add any content you want here.</div>
        </div>
      )
    };

    setAvailablePanels(prev => [...prev, newPanel]);
    setActiveBottomPanel(newPanel.id);
  };

  // Drag and drop functions drindrin
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newPanels = [...availablePanels];
      const draggedItem = newPanels[dragItem.current];
      newPanels.splice(dragItem.current, 1);
      newPanels.splice(dragOverItem.current, 0, draggedItem);
      setAvailablePanels(newPanels);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Helper functions
  const getLanguageFromExtension = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript', 'py': 'python', 'java': 'java', 'cpp': 'cpp', 'c': 'c',
      'cs': 'csharp', 'go': 'go', 'rs': 'rust', 'rb': 'ruby', 'ts': 'typescript',
      'html': 'html', 'css': 'css', 'json': 'json', 'xml': 'xml'
    };
    return languageMap[extension || ''] || 'plaintext';
  };

  const getLanguageName = (lang: string): string => {
    const languageNames: { [key: string]: string } = {
      'javascript': 'JavaScript', 'python': 'Python', 'java': 'Java', 'cpp': 'C++',
      'c': 'C', 'csharp': 'C#', 'go': 'Go', 'rust': 'Rust', 'ruby': 'Ruby',
      'typescript': 'TypeScript'
    };
    return languageNames[lang] || lang;
  };

  const formatFileSize = (content: string): string => {
    const bytes = new Blob([content]).size;
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const activePanel = availablePanels.find(panel => panel.id === activeBottomPanel);

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white">
      {/* Activity Bar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-4 space-y-6">
          <button 
            className={`p-2 rounded ${isSidebarVisible ? 'bg-[#2a2d2e]' : 'hover:bg-[#2a2d2e]'}`}
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            title="Explorer"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v4H3zm0 6h8v4H3zm0 6h8v4H3zm10 0h8v4h-8zm0-6h8v4h-8zm0-6h8v4h-8z"/>
            </svg>
          </button>
          
          <button className="p-2 rounded hover:bg-[#2a2d2e]" title="Search">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>

          <button className="p-2 rounded hover:bg-[#2a2d2e]" title="Run and Debug">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <button className="p-2 rounded hover:bg-[#2a2d2e]" title="Extensions">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
            </svg>
          </button>
        </div>

        {/* Sidebar & Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          {isSidebarVisible && (
            <div className="w-60 bg-[#252526] border-r border-[#3e3e42] flex flex-col">
              {/* Explorer Header */}
              <div className="px-4 py-2 bg-[#252526]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wider text-[#cccccc]">
                    EXPLORER
                  </span>
                  <div className="flex space-x-1">
                    <button 
                      onClick={handleCreateFile}
                      className="text-[#cccccc] hover:text-white p-1"
                      title="New File"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Open Editors Section */}
              <div className="flex-1 text-sm">
                <div className="text-[#969696] text-xs uppercase tracking-wider py-1 px-4 flex items-center justify-between">
                  <span>OPEN EDITORS</span>
                  <button className="text-[#969696] hover:text-white">⋯</button>
                </div>
                
                {/* File List */}
                <div className="mt-1">
                  {fileSystem.files.map(file => (
                    <div
                      key={file.id}
                      className={`flex items-center space-x-2 py-1 px-4 cursor-pointer group ${
                        fileSystem.currentFileId === file.id 
                          ? 'bg-[#37373d] text-white' 
                          : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                      }`}
                      onClick={() => fileSystem.setCurrentFileId(file.id)}
                    >
                      <svg className="w-4 h-4 flex-shrink-0 text-[#519aba]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12h6v-2H9v2z M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
                      </svg>
                      <span className="truncate flex-1 text-sm">{file.name}</span>
                      {fileSystem.files.length > 1 && (
                        <button
                          className="opacity-0 group-hover:opacity-100 text-[#cccccc] hover:text-white p-1 rounded hover:bg-[#3c3c3c]"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileSystem.deleteFile(file.id);
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tab Bar */}
            <div className="bg-[#2d2d30] border-b border-[#3e3e42] flex items-center min-w-0">
              {fileSystem.files.map(file => (
                <div
                  key={file.id}
                  className={`flex items-center space-x-2 py-2 px-4 border-r border-[#3e3e42] cursor-pointer group min-w-0 max-w-48 ${
                    fileSystem.currentFileId === file.id 
                      ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#4ec9b0]' 
                      : 'bg-[#2d2d30] text-[#cccccc] hover:bg-[#383838]'
                  }`}
                  onClick={() => fileSystem.setCurrentFileId(file.id)}
                >
                  <svg className="w-4 h-4 flex-shrink-0 text-[#519aba]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6v-2H9v2z M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
                  </svg>
                  <span className="truncate text-sm flex-1">{file.name}</span>
                  {fileSystem.files.length > 1 && (
                    <button
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-[#cccccc] hover:text-white p-1 rounded hover:bg-[#3c3c3c]"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileSystem.deleteFile(file.id);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Editor Area */}
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={fileSystem.currentFile?.language || 'java'}
                theme="vs-dark"
                value={editorContent}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                options={{
                  fontSize: 14,
                  minimap: { enabled: true },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  folding: true,
                  renderLineHighlight: 'all',
                  selectOnLineNumbers: true,
                  matchBrackets: 'always',
                  autoIndent: 'full',
                  tabSize: 2,
                  insertSpaces: true,
                  glyphMargin: true,
                }}
              />
            </div>

            {/* Bottom Panel */}
            <div className="h-48 bg-[#1e1e1e] border-t border-[#3e3e42] flex flex-col">
              {/* Panel Tabs */}
              <div className="bg-[#252526] border-b border-[#3e3e42] flex items-center">
                {availablePanels.map((panel, index) => (
                  <div
                    key={panel.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex items-center"
                  >
                    <button
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${
                        activeBottomPanel === panel.id
                          ? 'border-[#4ec9b0] text-white'
                          : 'border-transparent text-[#969696] hover:text-white'
                      }`}
                      onClick={() => setActiveBottomPanel(panel.id)}
                    >
                      <span>{panel.name}</span>
                    </button>
                  </div>
                ))}
                <button
                  className="px-3 py-2 text-[#969696] hover:text-white text-sm"
                  onClick={handleAddPanel}
                  title="Add Panel"
                >
                  +
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 p-4 font-mono text-sm overflow-y-auto bg-[#1e1e1e]">
                {activePanel ? activePanel.component : 'No panel selected'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#007acc] px-4 py-1 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleRunCode}
            className="flex items-center space-x-1 hover:bg-[#1a8ad6] px-2 py-1 rounded"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Run</span>
          </button>
          <button 
            onClick={handleDebugCode}
            className="flex items-center space-x-1 hover:bg-[#1a8ad6] px-2 py-1 rounded"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Debug</span>
          </button>
          <span className="text-[#e7e7e7]">
            {fileSystem.currentFile ? getLanguageName(fileSystem.currentFile.language) : 'Java'}
          </span>
          <span className="text-[#e7e7e7]">
            Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-[#e7e7e7]">
          <span>UTF-8</span>
          <span>LF</span>
          <span>{formatFileSize(editorContent)}</span>
        </div>
      </div>
    </div>
  );
};

export default OnlineIDE;