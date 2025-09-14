import React, { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import { useAuth } from "../pages/AuthContext";

/**
 *  DSAChallenge - Frontend (React + TypeScript)
 * Modern DSA practice platform with AI integration
 * 
 * API Endpoints:
 * - GET    /api/problems/          Fetch all problems
 * - GET    /api/problems/{id}/     Fetch specific problem details
 * - POST   /api/problems/          Create a new problem
 * - POST   /api/run/               Run code against test cases
 * - POST   /api/submit/            Submit final solution
 * - GET    /api/progress/          Fetch user progress/leaderboard
 * - POST   /api/progress/          Update user progress
 */

// ----------------------------- Configuration --------------------------
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// ----------------------------- Types ---------------------------------
type Difficulty = "Easy" | "Medium" | "Hard";
type ProblemSource = "AI" | "User";

interface Problem {
  id: string;
  title: string;
  statement: string;
  input_format?: string;
  output_format?: string;
  constraints?: string[];
  examples?: { input: string; output: string; explanation?: string }[];
  difficulty: Difficulty;
  tags?: string[];
  created_at?: string;
  author?: string | null;
  source: ProblemSource;
  attempts?: number;
  solves?: number;
  hardness_score?: number;
  user_solved?: boolean;
  success_rate?: number;
}

interface RunResult {
  status: "Accepted" | "Wrong Answer" | "Error" | "Runtime Error" | "Pending";
  runtime_ms?: number;
  memory_kb?: number;
  message?: string;
  test_results?: Array<{ name: string; passed: boolean; message?: string }>;
}

interface UserProgress {
  user_id: string;
  name: string;
  points: number;
  solved_count: number;
}

// ----------------------------- Helpers --------------------------------
const safeJoin = (base: string, path: string) => base.replace(/\/+$/u, "") + path;

const handleFetchError = async (res: Response) => {
  let bodyText = await res.text();
  let body: any = null;
  try {
    body = JSON.parse(bodyText);
  } catch {
    body = bodyText;
  }
  const message = (body && (body.detail || body.message)) || (typeof body === "string" ? body : JSON.stringify(body));
  throw new Error(`API Error ${res.status}: ${message}`);
};

// ----------------------------- API Layer -------------------------------
const apiGET = async <T = any>(path: string) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Token ${token}`;
  
  const url = safeJoin(BACKEND_URL, path);
  const res = await fetch(url, { headers });
  if (!res.ok) await handleFetchError(res);
  return (await res.json()) as T;
};

const apiPOST = async <T = any>(path: string, body: any) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Token ${token}`;
  
  const url = safeJoin(BACKEND_URL, path);
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) await handleFetchError(res);
  return (await res.json()) as T;
};

// API Endpoint Functions
const fetchProblems = async (): Promise<Problem[]> => await apiGET<Problem[]>("/api/problems/");
const fetchProblemDetail = async (id: string): Promise<Problem> => await apiGET<Problem>(`/api/problems/${encodeURIComponent(id)}/`);
const createProblem = async (payload: Partial<Problem>): Promise<Problem> => await apiPOST<Problem>("/api/problems/", payload);
const runCode = async (problemId: string, code: string): Promise<RunResult> => await apiPOST<RunResult>("/api/run/", { problem_id: problemId, code });
const submitCode = async (problemId: string, code: string): Promise<RunResult> => await apiPOST<RunResult>("/api/submit/", { problem_id: problemId, code });
const fetchProgress = async (): Promise<UserProgress[]> => await apiGET<UserProgress[]>("/api/progress/");
const postProgress = async (payload: any) => await apiPOST("/api/progress/", payload);

// ----------------------------- UI Helpers -----------------------------
const difficultyBadge = (d: Difficulty) => {
  if (d === "Easy") return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  if (d === "Medium" ) return "bg-amber-100 text-amber-800 border border-amber-200";
  return "bg-rose-100 text-rose-800 border border-rose-200";
};

const getDifficultyValue = (d: Difficulty) => {
  if (d === "Easy") return 1;
  if (d === "Medium") return 2;
  return 3;
};

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ----------------------------- Components -----------------------------

const ProblemCard: React.FC<{ problem: Problem; onOpen: (id: string) => void }> = ({ problem, onOpen }) => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{problem.title}</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyBadge(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
              {problem.source}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">{problem.statement}</p>

          <div className="flex items-center gap-2 mt-3">
            {problem.tags?.slice(0, 3).map(t => (
              <span key={t} className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            {problem.solves !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>{problem.solves} solved</span>
              </div>
            )}
            {problem.attempts !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-blue-600">↻</span>
                <span>{problem.attempts} attempts</span>
              </div>
            )}
            {problem.success_rate !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-purple-600">%</span>
                <span>{problem.success_rate}% success rate</span>
              </div>
            )}
            {problem.user_solved && (
              <div className="flex items-center gap-1 text-emerald-600 font-medium">
                <span>✓ Solved</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => onOpen(problem.id)} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Solve Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

const ProblemListView: React.FC<{ 
  filter?: { source?: ProblemSource | 'all'; difficulty?: Difficulty | 'all' }; 
  onOpen: (id: string) => void;
  sortBy?: 'hardest' | 'newest' | 'solved' | 'success';
}> = ({ filter = { source: 'all', difficulty: 'all' }, onOpen, sortBy = 'newest' }) => {
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setProblems(null);
    setError(null);
    (async () => {
      try {
        const data = await fetchProblems();
        if (!mounted) return;
        setProblems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || String(err));
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredAndSorted = useMemo(() => {
    if (!problems) return [];
    
    let result = problems.filter(p => {
      if (filter.source && filter.source !== 'all' && p.source !== filter.source) return false;
      if (filter.difficulty && filter.difficulty !== 'all' && p.difficulty !== filter.difficulty) return false;
      return true;
    });

    // Apply sorting
    if (sortBy === 'hardest') {
      result.sort((a, b) => {
        const aScore = a.hardness_score || getDifficultyValue(a.difficulty);
        const bScore = b.hardness_score || getDifficultyValue(b.difficulty);
        return bScore - aScore;
      });
    } else if (sortBy === 'solved') {
      result.sort((a, b) => (b.solves || 0) - (a.solves || 0));
    } else if (sortBy === 'success') {
      result.sort((a, b) => (b.success_rate || 0) - (a.success_rate || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    return result;
  }, [problems, filter, sortBy]);

  if (error) return <div className="p-4 text-red-500 bg-red-50 rounded-lg">Error loading problems: {error}</div>;
  if (!problems) return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
    </div>
  );

  if (filteredAndSorted.length === 0) return <div className="p-6 text-center text-gray-500 bg-white rounded-lg border">No problems found.</div>;

  return (
    <div className="grid grid-cols-1 gap-6">
      {filteredAndSorted.map(p => <ProblemCard key={p.id} problem={p} onOpen={onOpen} />)}
    </div>
  );
};

const ProblemDetail: React.FC<{ problemId: string; onClose: () => void }> = ({ problemId, onClose }) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>("// Write your solution here\n");
  const [runningResult, setRunningResult] = useState<RunResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const p = await fetchProblemDetail(problemId);
        if (!mounted) return;
        setProblem(p);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || String(err));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [problemId]);

  const onRun = async () => {
    setRunningResult(null);
    try {
      const res = await runCode(problemId, code);
      setRunningResult(res);
    } catch (e: any) {
      setRunningResult({ status: 'Error', message: e.message });
    }
  };

  const onSubmit = async () => {
    setSubmitting(true);
    setRunningResult(null);
    try {
      const res = await submitCode(problemId, code);
      setRunningResult(res);
      if (res.status === 'Accepted') {
        try { await postProgress({ problem_id: problemId, solved: true }); } catch (e) { /* ignore */ }
      }
    } catch (e: any) {
      setRunningResult({ status: 'Error', message: e.message });
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading problem...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Close</button>
      </div>
    </div>
  );
  
  if (!problem) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div>Problem not found.</div>
        <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 mt-4">Close</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 overflow-auto">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden" style={{ maxHeight: '90vh' }}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{problem.title}</h2>
            <div className="text-sm text-gray-500 mt-1 flex gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{problem.source}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${difficultyBadge(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>
          </div>
          <div>
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
              Close
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Problem Statement</h3>
              <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">{problem.statement}</div>
            </section>

            <section className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Examples</h4>
              {problem.examples?.map((ex, i) => (
                <div key={i} className="mb-4 border border-gray-200 p-4 rounded-lg bg-gray-50">
                  <div className="text-sm font-medium text-gray-600 mb-1">Input</div>
                  <pre className="p-3 bg-white rounded border text-sm">{ex.input}</pre>
                  <div className="text-sm font-medium text-gray-600 mb-1 mt-3">Output</div>
                  <pre className="p-3 bg-white rounded border text-sm">{ex.output}</pre>
                  {ex.explanation && (
                    <>
                      <div className="text-sm font-medium text-gray-600 mb-1 mt-3">Explanation</div>
                      <div className="text-sm text-gray-700">{ex.explanation}</div>
                    </>
                  )}
                </div>
              ))}
            </section>

            <section>
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Your Solution</h4>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <textarea 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  rows={14} 
                  className="w-full font-mono p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button onClick={onRun} className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Run Code
                </button>
                <button 
                  onClick={onSubmit} 
                  disabled={submitting} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Solution"}
                </button>
                <button onClick={() => setCode('// Write your solution here\n')} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                  Reset Code
                </button>
              </div>

              {runningResult && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className={`font-semibold ${runningResult.status === 'Accepted' ? 'text-emerald-700' : 'text-red-600'}`}>
                      Status: {runningResult.status}
                    </div>
                    <div className="text-sm text-gray-500">
                      {runningResult.runtime_ms ? `${runningResult.runtime_ms} ms` : ''}
                      {runningResult.memory_kb ? ` • ${runningResult.memory_kb} KB` : ''}
                    </div>
                  </div>
                  {runningResult.message && <div className="mt-2 text-sm text-gray-700">{runningResult.message}</div>}

                  {runningResult.test_results && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700">Test Results</div>
                      <ul className="mt-2 text-sm space-y-1">
                        {runningResult.test_results.map((t, i) => (
                          <li key={i} className={`py-1 ${t.passed ? 'text-emerald-700' : 'text-red-600'}`}>
                            {t.name}: {t.passed ? 'PASSED' : 'FAILED'}{t.message ? ` — ${t.message}` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          <aside className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div className="text-lg font-semibold text-gray-800 mb-4">Problem Details</div>
            
            <div className="mb-5">
              <div className="text-sm font-medium text-gray-600 mb-2">Constraints</div>
              <ul className="text-sm text-gray-700 space-y-1">
                {problem.constraints?.map((c, i) => <li key={i} className="mb-1">• {c}</li>)}
              </ul>
            </div>

            <div className="mb-5">
              <div className="text-sm font-medium text-gray-600 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {problem.tags?.map(t => (
                  <span key={t} className="text-xs bg-white px-3 py-1 rounded-full border border-gray-300 text-gray-700">
                    {t}
                  </span>
                ))}
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
          </aside>
        </div>
      </div>
    </div>
  );
};

const CreateProblemModal: React.FC<{ open: boolean; onClose: () => void; onCreated?: (p: Problem) => void }> = ({ open, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!open) { setTitle(''); setStatement(''); setTags(''); setDifficulty('Easy'); setError(null); } }, [open]);

  if (!open) return null;

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: Partial<Problem> = {
        title: title || 'Untitled problem',
        statement,
        difficulty,
        tags: tags.split(',').map(s => s.trim()).filter(Boolean),
        source: 'User',
      };
      const p = await createProblem(payload);
      onCreated?.(p);
      onClose();
    } catch (e: any) { setError(e?.message || String(e)); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold text-gray-900">Create Community Problem</div>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">
            Close
          </button>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Problem title" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
            <textarea 
              value={statement} 
              onChange={(e) => setStatement(e.target.value)} 
              rows={6} 
              placeholder="Describe the problem..." 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value as Difficulty)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input 
                value={tags} 
                onChange={(e) => setTags(e.target.value)} 
                placeholder="algorithm, data-structures, etc." 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
          </div>

          {error && <div className="p-3 text-red-600 bg-red-50 rounded-lg text-sm">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium">
              Cancel
            </button>
            <button onClick={submit} disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50">
              {loading ? "Creating..." : "Create Problem"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaticLeaderboard: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
    <h4 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard</h4>
    <div className="space-y-3">
      {/* 1st Place */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            🥇
          </div>
          <div>
            <div className="font-medium text-gray-900">Alice</div>
            <div className="text-sm text-gray-500">Solved 120 problems</div>
          </div>
        </div>
        <div className="font-semibold text-indigo-600">2500 pts</div>
      </div>
      {/* 2nd Place */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            🥈
          </div>
          <div>
            <div className="font-medium text-gray-900">Bob</div>
            <div className="text-sm text-gray-500">Solved 110 problems</div>
          </div>
        </div>
        <div className="font-semibold text-indigo-600">2200 pts</div>
      </div>
      {/* 3rd Place */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            🥉
          </div>
          <div>
            <div className="font-medium text-gray-900">Charlie</div>
            <div className="text-sm text-gray-500">Solved 100 problems</div>
          </div>
        </div>
        <div className="font-semibold text-indigo-600">2000 pts</div>
      </div>
      {/* 4th Place */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            4
          </div>
          <div>
            <div className="font-medium text-gray-900">David</div>
            <div className="text-sm text-gray-500">Solved 90 problems</div>
          </div>
        </div>
        <div className="font-semibold text-indigo-600">1800 pts</div>
      </div>
    </div>
  </div>
);

const AIPage: React.FC<{ onOpenProblem: (id: string) => void }> = ({ onOpenProblem }) => {
  const [aiProblems, setAiProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const problems = await fetchProblems();
        if (!mounted) return;
        setAiProblems(problems.filter(p => p.source === "AI"));
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || String(err));
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl">
        <h1 className="text-4xl font-bold mb-4">AI Challenges</h1>
        <p className="text-lg mb-6">Practice with algorithm problems generated by our advanced AI system</p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Generate New Challenge
          </button>
          <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
            Explore Community Problems
          </button>
        </div>
      </div>

      <div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Generated Challenges</h3>
          {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}
          {!aiProblems ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : aiProblems.length === 0 ? (
            <p className="text-gray-600 p-4 text-center">No AI-generated problems yet.</p>
          ) : (
            <div className="space-y-4">
              {aiProblems.slice(0, 3).map(problem => (
                <div key={problem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{problem.title}</h4>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium mt-2 inline-block ${difficultyBadge(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <button 
                      onClick={() => onOpenProblem(problem.id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Solve
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{problem.statement}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommunityPage: React.FC<{ onOpenProblem: (id: string) => void }> = ({ onOpenProblem }) => {
  const [sortBy, setSortBy] = useState<'hardest' | 'newest' | 'solved' | 'success'>('newest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all');

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-xl">
        <h1 className="text-4xl font-bold mb-4">Community Problems</h1>
        <p className="text-lg mb-6">Solve problems created by the community and share your own challenges</p>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create New Problem
          </button>
          <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
            View My Submissions
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Community Challenges</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={filterDifficulty} 
              onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="hardest">Hardest First</option>
              <option value="solved">Most Solved</option>
              <option value="success">Highest Success Rate</option>
            </select>
          </div>
        </div>

        <ProblemListView 
          filter={{ source: 'User', difficulty: filterDifficulty }} 
          onOpen={onOpenProblem}
          sortBy={sortBy}
        />
      </div>

      {showCreateModal && (
        <CreateProblemModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

// --- Top Navigation Bar ---
const TopNav: React.FC<{ onNavigate: (page: string) => void; current: string }> = ({ onNavigate, current }) => (
  <nav className="w-full bg-white border-b shadow-sm flex items-center px-4 py-2 gap-2">
    {[
      { label: "Dashboard", page: "dashboard" },
      { label: "AI Challenges", page: "ai" },
      { label: "Community Problems", page: "community" },
      { label: "Leaderboard", page: "leaderboard" },
      { label: "Profile", page: "profile" },
    ].map(({ label, page }) => (
      <button
        key={page}
        onClick={() => onNavigate(page)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors
          ${current === page
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"}
        `}
      >
        {label}
      </button>
    ))}
  </nav>
);

// --- Main App with TopNav ---
export default function DSArenaApp(): JSX.Element {
  const [page, setPage] = useState<string>('dashboard');
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  // Dashboard stats (dynamic)
  const { user } = useAuth();
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(false);
  const [totalSolved, setTotalSolved] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [currentStreakDays, setCurrentStreakDays] = useState<number | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try { await fetchProblems(); } catch (e) { /* ignore for now */ }
    })();
  }, []);

  useEffect(() => {
    let mounted = true;
    if (page !== 'dashboard') return;
    setDashboardLoading(true);
    setDashboardError(null);

    (async () => {
      try {
        const progress = await fetchProgress();
        const uid = (user as any)?.id ?? (user as any)?.username ?? null;
        let entry: any = null;
        if (uid != null && Array.isArray(progress)) {
          entry = (progress as any[]).find((e: any) =>
            String(e.user_id) === String(uid) ||
            String(e.user_id) === String((user as any)?.id) ||
            String(e.user) === String(uid)
          );
        }
        if (!entry && Array.isArray(progress) && progress.length === 1) {
          entry = progress[0];
        }
        if (entry) {
          setTotalSolved(Number(entry.solved_count ?? entry.solved ?? 0));
          setPointsEarned(Number(entry.points ?? 0));
          setCurrentStreakDays(Number(entry.current_streak ?? entry.streak ?? entry.streak_days ?? 0));
        } else {
          setTotalSolved(0);
          setPointsEarned(0);
          setCurrentStreakDays(0);
        }
      } catch (err: any) {
        if (!mounted) return;
        setDashboardError(err?.message || String(err));
        setTotalSolved(0);
        setPointsEarned(0);
        setCurrentStreakDays(0);
      } finally {
        if (!mounted) return;
        setDashboardLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [page, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <TopNav onNavigate={setPage} current={page} />
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <main>
          {page === 'dashboard' && (
            <>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Total Problems Solved</h3>
                    <div className="text-3xl font-bold text-indigo-600">
                      {dashboardLoading ? <Skeleton className="h-8 w-20" /> : (totalSolved ?? 0)}
                    </div>
                    {dashboardError && <div className="text-xs text-red-600 mt-2">Failed to load</div>}
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Current Streak</h3>
                    <div className="text-3xl font-bold text-green-600">
                      {dashboardLoading ? <Skeleton className="h-8 w-28" /> : `${currentStreakDays ?? 0} days`}
                    </div>
                    {!dashboardLoading && dashboardError && <div className="text-xs text-red-600 mt-2">Streak unavailable</div>}
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Points Earned</h3>
                    <div className="text-3xl font-bold text-amber-600">
                      {dashboardLoading ? <Skeleton className="h-8 w-28" /> : ((pointsEarned != null) ? Number(pointsEarned).toLocaleString() : '0')}
                    </div>
                    {!dashboardLoading && dashboardError && <div className="text-xs text-red-600 mt-2">Points unavailable</div>}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Recommended Problems</h3>
                  <ProblemListView 
                    onOpen={(id) => setSelectedProblemId(id)}
                    sortBy="newest"
                  />
                </div>
              </div>
            </>
          )}

          {page === 'ai' && (
            <AIPage onOpenProblem={(id) => setSelectedProblemId(id)} />
          )}

          {page === 'community' && (
            <CommunityPage onOpenProblem={(id) => setSelectedProblemId(id)} />
          )}

          {page === 'leaderboard' && <StaticLeaderboard />}

          {page === 'profile' && (
            <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-0 m-0">
              <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-10 mt-10 mb-10">
                <div className="flex flex-col md:flex-row items-center gap-10 mb-10">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl text-white font-bold shadow-lg border-4 border-white">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{user?.username || "-"}</h2>
                    <div className="text-xl text-gray-500">{user?.email || "-"}</div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm shadow">Member since: September 2025</span>
                      <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-semibold text-sm shadow">Problems created: 0</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-6">Account Details</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.015-8 4.5V21h16v-2.5c0-2.485-3.582-4.5-8-4.5z" fill="currentColor"/></svg>
                        </span>
                        <span className="font-medium text-lg">Username:</span>
                        <span className="text-lg">{user?.username || "-"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm-7 7h18v2H-3v-2z" fill="currentColor"/></svg>
                        </span>
                        <span className="font-medium text-lg">Email:</span>
                        <span className="text-lg">{user?.email || "-"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-600 mb-6">Tech Profile</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M7 7h10v10H7V7z" fill="currentColor"/></svg>
                        </span>
                        <span className="font-medium text-lg">Data Structures:</span>
                        <span className="text-lg">Beginner</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2l4 4-4 4-4-4 4-4zm0 16l4-4-4-4-4 4 4 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span className="font-medium text-lg">Algorithms:</span>
                        <span className="text-lg">Beginner</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 8v8m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span className="font-medium text-lg">Point Earn:</span>
                        <span className="text-lg">{pointsEarned != null ? Number(pointsEarned).toLocaleString() : '0'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-block w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span className="font-medium text-lg">Problem Solve:</span>
                        <span className="text-lg">{totalSolved ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-2xl font-semibold text-green-600 mb-6">Problem Solving Activity</h3>
                  <div className="bg-gray-900 rounded-lg p-8 w-full shadow">
                    {/* Year label */}
                    <div className="text-lg text-gray-400 mb-4">2025</div>
                    {/* Contribution graph */}
                    <div className="flex flex-col gap-2">
                      {/* Month labels */}
                      <div className="flex ml-12 mb-2">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                          <div key={month} className="w-8 text-sm text-gray-400 text-center">{month}</div>
                        ))}
                      </div>
                      {/* Weeks (rows) */}
                      {[...Array(7)].map((_, weekIdx) => (
                        <div key={weekIdx} className="flex items-center">
                          {/* Day labels (left side) */}
                          <div className="w-10 text-sm text-gray-400 text-right mr-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekIdx]}
                          </div>
                          {/* Day squares */}
                          {[...Array(12 * 4)].map((_, dayIdx) => {
                            // Example: color some random days for demo
                            const solved = (weekIdx === 2 && dayIdx === 10) || (weekIdx === 4 && dayIdx === 25);
                            // Color levels (like GitHub: 0, 1, 2, 3, 4)
                            const level = solved ? 3 : 0;
                            const colors = [
                              "bg-gray-800 border-gray-700", // 0: no activity
                              "bg-green-900 border-green-800", // 1: low
                              "bg-green-700 border-green-600", // 2: medium
                              "bg-green-500 border-green-400", // 3: high
                              "bg-green-300 border-green-200", // 4: very high
                            ];
                            return (
                              <div
                                key={dayIdx}
                                className={`w-4 h-4 rounded-sm border ${colors[level]} mx-[1.5px]`}
                                title={`2025, ${dayIdx % 12 + 1} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Math.floor(dayIdx / 4)]}`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                      <span>Less</span>
                      <div className="w-4 h-4 rounded-sm border bg-gray-800 border-gray-700" />
                      <div className="w-4 h-4 rounded-sm border bg-green-900 border-green-800" />
                      <div className="w-4 h-4 rounded-sm border bg-green-700 border-green-600" />
                      <div className="w-4 h-4 rounded-sm border bg-green-500 border-green-400" />
                      <div className="w-4 h-4 rounded-sm border bg-green-300 border-green-200" />
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Modals outside grid for overlays */}
      {selectedProblemId && (
        <ProblemDetail problemId={selectedProblemId} onClose={() => setSelectedProblemId(null)} />
      )}
      {createOpen && (
        <CreateProblemModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => setCreateOpen(false)}
        />
      )}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold text-gray-900">AI Problem Generator</div>
              <button onClick={() => setAiOpen(false)} className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700">
                Close
              </button>
            </div>
            <div className="text-center py-8 text-gray-500">
              AI Generation feature coming soon...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}