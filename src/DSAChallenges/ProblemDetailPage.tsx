import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Problem, RunResult, fetchProblemDetail, postProgress, getDifficultyBadgeClass } from "./DSAchallenges";
import Editor from "@monaco-editor/react";

// Judge0 API configuration
const JUDGE0_API_KEY = import.meta.env.VITE_JUDGE0_API_KEY || 'your-judge0-api-key';
const JUDGE0_BASE_URL = import.meta.env.VITE_JUDGE0_BASE_URL || 'https://judge0-ce.p.rapidapi.com';

// Supported languages with Judge0 language IDs
const SUPPORTED_LANGUAGES = [
  { 
    id: 'javascript', 
    name: 'JavaScript (Node.js)', 
    judge0Id: 63,
    defaultCode: `function solve(input) {
    // Your solution here
    // Example: Return the input as is for demonstration
    return input;
}

// Handle the input and call solve function
function main() {
    // Read input (this would be provided by the test cases)
    const input = require('fs').readFileSync(0, 'utf8').trim();
    
    // Parse input if needed (JSON, numbers, etc.)
    let parsedInput;
    try {
        parsedInput = JSON.parse(input);
    } catch {
        parsedInput = input;
    }
    
    // Call your solution
    const result = solve(parsedInput);
    
    // Output the result
    console.log(typeof result === 'object' ? JSON.stringify(result) : result);
}

// Only run if this is the main module
if (require.main === module) {
    main();
}` 
  },
  { 
    id: 'python', 
    name: 'Python 3', 
    judge0Id: 71,
    defaultCode: `def solve(input_data):
    # Your solution here
    # Example: Return the input as is for demonstration
    return input_data

def main():
    # Read input from stdin
    import sys
    input_data = sys.stdin.read().strip()
    
    # Parse input if needed
    try:
        # Try to parse as JSON
        import json
        parsed_input = json.loads(input_data)
    except:
        parsed_input = input_data
    
    # Call your solution
    result = solve(parsed_input)
    
    # Output the result
    if isinstance(result, (dict, list)):
        print(json.dumps(result))
    else:
        print(result)

if __name__ == "__main__":
    main()`
  },
  { 
    id: 'java', 
    name: 'Java', 
    judge0Id: 62,
    defaultCode: `import java.util.*;
import java.io.*;

public class Main {
    public static Object solve(Object input) {
        // Your solution here
        // Example: Return the input as is for demonstration
        return input;
    }
    
    public static void main(String[] args) throws IOException {
        // Read input from stdin
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder inputBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            inputBuilder.append(line);
        }
        String input = inputBuilder.toString().trim();
        
        // Parse input if needed
        Object parsedInput;
        try {
            // Try to parse as JSON (you might want to use a JSON library like Jackson in real implementation)
            if (input.startsWith("{") || input.startsWith("[")) {
                parsedInput = input; // For simplicity, using string as is
            } else {
                parsedInput = input;
            }
        } catch (Exception e) {
            parsedInput = input;
        }
        
        // Call your solution
        Object result = solve(parsedInput);
        
        // Output the result
        System.out.println(result.toString());
    }
}`
  },
  { 
    id: 'cpp', 
    name: 'C++', 
    judge0Id: 54,
    defaultCode: `#include <iostream>
#include <string>
#include <vector>
#include <sstream>

using namespace std;

// Your solution function
string solve(string input) {
    // Your solution here
    // Example: Return the input as is for demonstration
    return input;
}

int main() {
    // Read input from stdin
    string input;
    string line;
    while (getline(cin, line)) {
        input += line;
    }
    
    // Call your solution
    string result = solve(input);
    
    // Output the result
    cout << result << endl;
    
    return 0;
}`
  },
  { 
    id: 'c', 
    name: 'C', 
    judge0Id: 50,
    defaultCode: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Your solution function
char* solve(char* input) {
    // Your solution here
    // Example: Return the input as is for demonstration
    return input;
}

int main() {
    // Read input from stdin
    char input[1000];
    char buffer[100];
    input[0] = '\\0';
    
    while (fgets(buffer, sizeof(buffer), stdin)) {
        strcat(input, buffer);
    }
    
    // Remove trailing newline if exists
    size_t len = strlen(input);
    if (len > 0 && input[len-1] == '\\n') {
        input[len-1] = '\\0';
    }
    
    // Call your solution
    char* result = solve(input);
    
    // Output the result
    printf("%s\\n", result);
    
    return 0;
}`
  }
];

// Types for Judge0 API
interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

interface Judge0Response {
  token: string;
  status?: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  time?: string;
  memory?: number;
}

const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>(SUPPORTED_LANGUAGES[0].defaultCode);
  const [runningResult, setRunningResult] = useState<RunResult | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [executing, setExecuting] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const p = await fetchProblemDetail(id!);
        if (mounted) setProblem(p);
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // Update code when language changes
  useEffect(() => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage);
    if (lang) {
      setCode(lang.defaultCode);
    }
  }, [selectedLanguage]);

  // Judge0 API functions
  const submitToJudge0 = async (submission: Judge0Submission): Promise<Judge0Response> => {
    const response = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify(submission)
    });

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.statusText}`);
    }

    return await response.json();
  };

  const runCustomTest = async (): Promise<void> => {
    if (!customInput.trim()) {
      setRunningResult({ status: 'Error', message: 'Please provide custom input' });
      return;
    }

    setExecuting(true);
    setRunningResult(null);

    try {
      const lang = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage);
      if (!lang) throw new Error('Selected language not supported');

      const submission: Judge0Submission = {
        source_code: code,
        language_id: lang.judge0Id,
        stdin: customInput
      };

      const result = await submitToJudge0(submission);
      
      let status = 'Runtime Error';
      let message = '';

      if (result.compile_output) {
        status = 'Compilation Error';
        message = result.compile_output;
      } else if (result.stderr) {
        status = 'Runtime Error';
        message = result.stderr;
      } else if (result.stdout) {
        status = 'Success';
        message = `Output: ${result.stdout}`;
      } else if (result.message) {
        status = 'Error';
        message = result.message;
      }

      setRunningResult({ 
        status: status as any, 
        message,
        test_results: [{
          name: 'Custom Test',
          passed: status === 'Success',
          message: status === 'Success' ? 'Custom test executed successfully' : message
        }]
      });

    } catch (e: unknown) {
      setRunningResult({ 
        status: 'Error', 
        message: e instanceof Error ? e.message : String(e) 
      });
    } finally {
      setExecuting(false);
    }
  };

  const runTests = async (): Promise<void> => {
    if (!problem?.examples || problem.examples.length === 0) {
      setRunningResult({ status: 'Error', message: 'No test cases available for this problem' });
      return;
    }

    setExecuting(true);
    setRunningResult(null);

    try {
      const lang = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage);
      if (!lang) throw new Error('Selected language not supported');

      const testResults = [];
      
      for (let i = 0; i < problem.examples.length; i++) {
        const testCase = problem.examples[i];
        
        const submission: Judge0Submission = {
          source_code: code,
          language_id: lang.judge0Id,
          stdin: testCase.input,
          expected_output: testCase.output
        };

        const result = await submitToJudge0(submission);
        
        let passed = false;
        let message = '';

        if (result.compile_output) {
          message = `Compilation Error: ${result.compile_output}`;
        } else if (result.stderr) {
          message = `Runtime Error: ${result.stderr}`;
        } else if (result.stdout?.trim() === testCase.output.trim()) {
          passed = true;
          message = 'Test passed';
        } else {
          message = `Expected: ${testCase.output}, Got: ${result.stdout}`;
        }

        testResults.push({
          name: `Test Case ${i + 1}`,
          passed,
          message
        });
      }

      const allPassed = testResults.every(test => test.passed);
      setRunningResult({ 
        status: allPassed ? 'Accepted' : 'Wrong Answer', 
        message: allPassed ? 'All test cases passed!' : 'Some test cases failed',
        test_results: testResults
      });

    } catch (e: unknown) {
      setRunningResult({ 
        status: 'Error', 
        message: e instanceof Error ? e.message : String(e) 
      });
    } finally {
      setExecuting(false);
    }
  };

  const submitSolution = async (): Promise<void> => {
    setSubmitting(true);
    setRunningResult(null);

    try {
      // For submission, we might want to run more comprehensive tests
      // For now, we'll use the same as runTests but with a different message
      await runTests();
      
      // If all tests passed, mark as solved
      if (runningResult?.status === 'Accepted') {
        try { 
          await postProgress({ problem_id: id, solved: true }); 
        } catch {} // Silent fail
      }
    } catch (e: unknown) {
      setRunningResult({ 
        status: 'Error', 
        message: e instanceof Error ? e.message : String(e) 
      });
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleEditorChange = useCallback((value: string | undefined) => {
    setCode(value || '');
  }, []);

  const resetCode = useCallback(() => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.id === selectedLanguage);
    if (lang) {
      setCode(lang.defaultCode);
    }
  }, [selectedLanguage]);

  // Helper function for result color
  function getResultColor(status: string) {
    switch (status) {
      case 'Accepted':
      case 'Success':
        return 'text-green-600';
      case 'Wrong Answer':
        return 'text-yellow-600';
      case 'Compilation Error':
      case 'Error':
      case 'Runtime Error':
      case 'Pending':
      default:
        return 'text-red-600';
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
          <span>Loading problem...</span>
        </div>
      </div>
    </div>
  );
  
  if (error || !problem) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
        <div className="text-red-500 mb-4">{error || "Problem not found."}</div>
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          autoFocus
        >
          Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">{problem.title}</h2>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">{problem.source}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
        >
          Back to Problems
        </button>
      </header>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Information */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Problem Statement */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 border-b pb-2">Problem Statement</h3>
              <div className="prose max-w-none text-gray-700 bg-white p-4 rounded-lg border border-gray-200">
                {problem.statement}
              </div>
            </section>

            {/* Examples */}
            <section className="mb-8">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Examples</h4>
              {problem.examples?.map((ex: { input: string; output: string; explanation?: string }, i: number) => (
                <div key={i} className="mb-4 border border-gray-200 p-4 rounded-lg bg-white">
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Input:</span>
                    <pre className="mt-1 p-2 bg-gray-50 rounded text-sm overflow-x-auto">{ex.input}</pre>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Output:</span>
                    <pre className="mt-1 p-2 bg-gray-50 rounded text-sm overflow-x-auto">{ex.output}</pre>
                  </div>
                  {ex.explanation && (
                    <div className="mt-3 text-gray-600">
                      <span className="font-semibold">Explanation:</span>
                      <div className="mt-1">{ex.explanation}</div>
                    </div>
                  )}
                </div>
              )) || <p className="text-gray-500">No examples available.</p>}
            </section>

            {/* Constraints */}
            <section className="mb-8">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Constraints</h4>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {problem.constraints?.map((c: string, i: number) => (
                    <li key={i} className="text-sm">{c}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Problem Details */}
            <section className="bg-white p-5 rounded-lg border border-gray-200">
              <div className="text-lg font-semibold text-gray-800 mb-4">Problem Details</div>
              
              <div className="mb-5">
                <div className="text-sm font-medium text-gray-600 mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {problem.tags?.map((t: string) => (
                    <span key={t} className="px-2.5 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 font-medium">
                      {t}
                    </span>
                  )) || <span className="text-gray-500">No tags</span>}
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Attempts:</span>
                  <span className="font-medium text-gray-800">{problem.attempts ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Solves:</span>
                  <span className="font-medium text-gray-800">{problem.solves ?? 0}</span>
                </div>
                {problem.success_rate !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium text-gray-800">{problem.success_rate}%</span>
                  </div>
                )}
                {problem.hardness_score !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hardness Score:</span>
                    <span className="font-medium text-gray-800">{problem.hardness_score}/10</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col border-l border-gray-200 bg-white">
          {/* Editor Header */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={resetCode}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <div className="h-full w-full overflow-auto">
              <Editor
                height="100%"
                defaultLanguage={selectedLanguage}
                language={selectedLanguage}
                value={code}
                onChange={handleEditorChange}
                theme="vs-light"
                options={{
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  matchBrackets: 'always',
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                }}
              />
            </div>
          </div>

          {/* Custom Input Toggle */}
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <span>{showCustomInput ? '▼' : '▶'} Custom Input</span>
            </button>
            
            {showCustomInput && (
              <div className="mt-3">
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom input for testing..."
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={runCustomTest}
                  disabled={executing}
                  className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  Run with Custom Input
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons and Results */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={runTests} 
                disabled={executing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {executing ? "Running..." : "Run Tests"}
              </button>
              <button 
                onClick={submitSolution} 
                disabled={submitting || executing}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Solution"}
              </button>
            </div>

            {/* Results */}
            {runningResult && (
              <div className="p-4 border rounded-lg bg-white">
                <div className={`font-semibold mb-2 ${getResultColor(runningResult.status)}`}>
                  Result: {runningResult.status}
                </div>
                {runningResult.message && (
                  <pre
                    className="text-sm text-gray-700 mb-3 p-2 bg-gray-50 rounded font-mono max-h-40 overflow-auto whitespace-pre-wrap"
                    style={{ maxHeight: 160 }}
                  >
                    {runningResult.message}
                  </pre>
                )}
                {runningResult.test_results && runningResult.test_results.length > 0 && (
                  <div className="mt-3">
                    <div className="font-medium mb-2 text-gray-800">Test Results:</div>
                    <ul className="space-y-2">
                      {runningResult.test_results?.map((tr: { name: string; passed: boolean; message?: string }, idx: number) => (
                        <li key={idx} className={`p-2 rounded border ${
                          tr.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${tr.passed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className={`font-medium ${tr.passed ? 'text-green-700' : 'text-red-700'}`}>
                              {tr.name}: {tr.passed ? "Passed" : "Failed"}
                            </span>
                          </div>
                          {tr.message && (
                            <pre
                              className="text-sm text-gray-600 mt-1 ml-4 font-mono max-h-24 overflow-auto whitespace-pre-wrap"
                              style={{ maxHeight: 96 }}
                            >
                              {tr.message}
                            </pre>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;