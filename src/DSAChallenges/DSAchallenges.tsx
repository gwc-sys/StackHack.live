import React, { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import { useAuth } from "../pages/AuthContext";

/**
 * DSA Arena - Frontend (React + TypeScript)
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
  let body: any = null;
  try { body = await res.json(); } catch (e) { body = await res.text(); }
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
  if (d === "Easy") return "bg-emerald-100 text-emerald-800";
  if (d === "Medium" ) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

const getDifficultyValue = (d: Difficulty) => {
  if (d === "Easy") return 1;
  if (d === "Medium") return 2;
  return 3;
};

const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-100 rounded ${className}`} />
);

// ----------------------------- Components -----------------------------
const Sidebar: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      onNavigate('ai');
    }
  };

  return (
    <aside className="w-80 border-r bg-white hidden lg:block">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-2xl font-bold">DSA Arena</div>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems..."
            className="w-full p-2 rounded border text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
          >
            Search
          </button>
        </div>
      </div>
      
      <nav className="p-4 space-y-3">
        <button onClick={() => onNavigate('dashboard')} className="w-full text-left p-2 rounded hover:bg-slate-50">Dashboard</button>
        <button onClick={() => onNavigate('ai')} className="w-full text-left p-2 rounded hover:bg-slate-50">AI Challenges</button>
        <button onClick={() => onNavigate('community')} className="w-full text-left p-2 rounded hover:bg-slate-50">Community Problems</button>
        <button onClick={() => onNavigate('leaderboard')} className="w-full text-left p-2 rounded hover:bg-slate-50">Leaderboard</button>
        <button onClick={() => onNavigate('profile')} className="w-full text-left p-2 rounded hover:bg-slate-50">Profile</button>
      </nav>

      <div className="p-4 border-t text-xs text-slate-500">Built to integrate with Django REST backend. No mock data included.</div>
    </aside>
  );
};

const ProblemCard: React.FC<{ problem: Problem; onOpen: (id: string) => void }> = ({ problem, onOpen }) => {
  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg truncate">{problem.title}</h3>
            <span className={`text-xs px-2 py-1 rounded ${difficultyBadge(problem.difficulty)}`}>{problem.difficulty}</span>
            <span className="text-xs px-2 py-1 rounded bg-slate-100">{problem.source}</span>
          </div>

          <p className="mt-2 text-sm text-slate-600 line-clamp-3 whitespace-pre-wrap">{problem.statement}</p>

          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
            <div>{problem.tags?.slice(0, 3).map(t => <span key={t} className="px-2 py-1 mr-1 rounded bg-slate-100">{t}</span>)}</div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs">
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
              <div className="flex items-center gap-1 text-emerald-600">
                <span>✓ Solved</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={() => onOpen(problem.id)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Solve Challenge</button>
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

  if (error) return <div className="p-4 text-red-500">Error loading problems: {error}</div>;
  if (!problems) return (
    <div className="grid grid-cols-1 gap-6">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
    </div>
  );

  if (filteredAndSorted.length === 0) return <div className="p-4 text-slate-600">No problems found.</div>;

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

  if (loading) return <div className="p-4">Loading problem...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!problem) return <div className="p-4">Problem not found.</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-auto" style={{ maxHeight: '90vh' }}>
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{problem.title}</h2>
            <div className="text-sm text-slate-500 mt-1">{problem.source} • {problem.difficulty}</div>
          </div>
          <div>
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200">Close</button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <section className="prose max-w-none mb-6">
              <h3 className="text-xl font-semibold mb-4">Problem Statement</h3>
              <div className="whitespace-pre-wrap text-slate-700">{problem.statement}</div>
            </section>

            <section className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Examples</h4>
              {problem.examples?.map((ex, i) => (
                <div key={i} className="mb-4 border p-4 rounded-lg bg-slate-50">
                  <div className="text-sm font-medium text-slate-600 mb-1">Input</div>
                  <pre className="p-3 bg-white rounded">{ex.input}</pre>
                  <div className="text-sm font-medium text-slate-600 mb-1 mt-3">Output</div>
                  <pre className="p-3 bg-white rounded">{ex.output}</pre>
                  {ex.explanation && (
                    <>
                      <div className="text-sm font-medium text-slate-600 mb-1 mt-3">Explanation</div>
                      <div className="text-sm text-slate-700">{ex.explanation}</div>
                    </>
                  )}
                </div>
              ))}
            </section>

            <section>
              <h4 className="text-lg font-semibold mb-3">Your Solution</h4>
              <textarea 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                rows={14} 
                className="w-full font-mono p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              />

              <div className="flex items-center gap-3 mt-4">
                <button onClick={onRun} className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium">Run Code</button>
                <button onClick={onSubmit} disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">
                  {submitting ? "Submitting..." : "Submit Solution"}
                </button>
                <button onClick={() => setCode('// Write your solution here\n')} className="px-4 py-2 bg-slate-200 rounded-lg">Reset Code</button>
              </div>

              {runningResult && (
                <div className="mt-6 p-4 border rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className={`font-semibold ${runningResult.status === 'Accepted' ? 'text-emerald-700' : 'text-red-600'}`}>
                      Status: {runningResult.status}
                    </div>
                    <div className="text-sm text-slate-500">
                      {runningResult.runtime_ms ? `${runningResult.runtime_ms} ms` : ''}
                      {runningResult.memory_kb ? ` • ${runningResult.memory_kb} KB` : ''}
                    </div>
                  </div>
                  {runningResult.message && <div className="mt-2 text-sm">{runningResult.message}</div>}

                  {runningResult.test_results && (
                    <div className="mt-4">
                      <div className="text-sm font-medium">Test Results</div>
                      <ul className="mt-2 text-sm">
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

          <aside className="bg-slate-50 p-5 rounded-lg">
            <div className="text-lg font-semibold text-slate-800 mb-4">Problem Details</div>
            
            <div className="mb-5">
              <div className="text-sm font-medium text-slate-600 mb-2">Constraints</div>
              <ul className="text-sm text-slate-700">
                {problem.constraints?.map((c, i) => <li key={i} className="mb-1">• {c}</li>)}
              </ul>
            </div>

            <div className="mb-5">
              <div className="text-sm font-medium text-slate-600 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {problem.tags?.map(t => (
                  <span key={t} className="text-xs bg-white px-3 py-1 rounded-full border">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Attempts:</span>
                <span className="font-medium">{problem.attempts ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Solves:</span>
                <span className="font-medium">{problem.solves ?? 0}</span>
              </div>
              {problem.success_rate !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Success Rate:</span>
                  <span className="font-medium">{problem.success_rate}%</span>
                </div>
              )}
              {problem.hardness_score !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Hardness Score:</span>
                  <span className="font-medium">{problem.hardness_score}/10</span>
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
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold">Create Community Problem</div>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">Close</button>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Problem title" 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Problem Statement</label>
            <textarea 
              value={statement} 
              onChange={(e) => setStatement(e.target.value)} 
              rows={6} 
              placeholder="Describe the problem..." 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value as Difficulty)} 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
              <input 
                value={tags} 
                onChange={(e) => setTags(e.target.value)} 
                placeholder="algorithm, data-structures, etc." 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
          </div>

          {error && <div className="p-3 text-red-600 bg-red-50 rounded-lg">{error}</div>}

          <div className="flex items-center justify-end gap-3 pt-4">
            <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
            <button onClick={submit} disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
              {loading ? "Creating..." : "Create Problem"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardView: React.FC = () => {
  const [data, setData] = useState<UserProgress[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const d = await fetchProgress();
        if (!mounted) return;
        setData(Array.isArray(d) ? d : []);
      } catch (e: any) { if (!mounted) return; setError(e?.message || String(e)); }
    })();
    return () => { mounted = false; };
  }, []);

  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-4">Loading leaderboard...</div>;

  const sorted = data.slice().sort((a,b)=>b.points-a.points);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h4 className="text-xl font-semibold mb-4">Leaderboard</h4>
      <div className="space-y-4">
        {sorted.map((u, i) => (
          <div key={u.user_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
              </div>
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-slate-500">Solved {u.solved_count} problems</div>
              </div>
            </div>
            <div className="font-semibold text-indigo-600">{u.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">AI Challenges</h1>
        <p className="text-lg mb-6">Practice with algorithm problems generated by our advanced AI system</p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg">
            Generate New Challenge
          </button>
          <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg">
            Explore Community Problems
          </button>
        </div>
      </div>

      <div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">AI-Generated Challenges</h3>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {!aiProblems ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : aiProblems.length === 0 ? (
            <p className="text-slate-600">No AI-generated problems yet.</p>
          ) : (
            <div className="space-y-4">
              {aiProblems.slice(0, 3).map(problem => (
                <div key={problem.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{problem.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${difficultyBadge(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <button 
                      onClick={() => onOpenProblem(problem.id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                    >
                      Solve
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{problem.statement}</p>
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
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Community Problems</h1>
        <p className="text-lg mb-6">Solve problems created by the DSA Arena community and share your own challenges</p>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg"
          >
            Create New Problem
          </button>
          <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg">
            View My Submissions
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Community Challenges</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={filterDifficulty} 
              onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | 'all')}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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

        // Try to find current user's entry
        const uid = (user as any)?.id ?? (user as any)?.username ?? null;
        let entry: any = null;
        if (uid != null && Array.isArray(progress)) {
          entry = (progress as any[]).find((e: any) =>
            String(e.user_id) === String(uid) ||
            String(e.user_id) === String((user as any)?.id) ||
            String(e.user) === String(uid)
          );
        }

        // If no per-user entry found, try common fallback shapes
        if (!entry && Array.isArray(progress) && progress.length === 1) {
          entry = progress[0];
        }

        if (entry) {
          setTotalSolved(Number(entry.solved_count ?? entry.solved ?? 0));
          setPointsEarned(Number(entry.points ?? 0));
          setCurrentStreakDays(Number(entry.current_streak ?? entry.streak ?? entry.streak_days ?? 0));
        } else {
          // No data for user -> fallback to zeros
          setTotalSolved(0);
          setPointsEarned(0);
          setCurrentStreakDays(0);
        }
      } catch (err: any) {
        if (!mounted) return;
        console.error("Failed to load progress:", err);
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[20rem_1fr] gap-6 px-4 py-6">
        <Sidebar onNavigate={(p) => setPage(p)} />

        <main className="px-4">
          {page === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-3">Total Problems Solved</h3>
                  <div className="text-3xl font-bold text-indigo-600">
                    {dashboardLoading ? <Skeleton className="h-8 w-20" /> : (totalSolved ?? 0)}
                  </div>
                  {dashboardError && <div className="text-xs text-red-600 mt-2">Failed to load</div>}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-3">Current Streak</h3>
                  <div className="text-3xl font-bold text-emerald-600">
                    {dashboardLoading ? <Skeleton className="h-8 w-28" /> : `${currentStreakDays ?? 0} days`}
                  </div>
                  {!dashboardLoading && dashboardError && <div className="text-xs text-red-600 mt-2">Streak unavailable</div>}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-3">Points Earned</h3>
                  <div className="text-3xl font-bold text-amber-600">
                    {dashboardLoading ? <Skeleton className="h-8 w-28" /> : ((pointsEarned != null) ? Number(pointsEarned).toLocaleString() : '0')}
                  </div>
                  {!dashboardLoading && dashboardError && <div className="text-xs text-red-600 mt-2">Points unavailable</div>}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Recommended Problems</h3>
                <ProblemListView 
                  onOpen={(id) => setSelectedProblemId(id)}
                  sortBy="newest"
                />
              </div>
            </div>
          )}

          {page === 'ai' && (
            <AIPage onOpenProblem={(id) => setSelectedProblemId(id)} />
          )}

          {page === 'community' && (
            <CommunityPage onOpenProblem={(id) => setSelectedProblemId(id)} />
          )}

          {page === 'leaderboard' && <LeaderboardView />}

          {page === 'profile' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-2xl font-semibold mb-6">Your Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium mb-3">Account Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Username:</span>
                      <span className="font-medium">dsa_learner</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Member since:</span>
                      <span className="font-medium">Jan 2023</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Problems created:</span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-3">Skill Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Data Structures:</span>
                      <span className="font-medium">Advanced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Algorithms:</span>
                      <span className="font-medium">Intermediate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Problem Solving:</span>
                      <span className="font-medium">Advanced</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

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
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-semibold">AI Problem Generator</div>
              <button onClick={() => setAiOpen(false)} className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">Close</button>
            </div>
            <div className="text-center py-8 text-slate-500">
              AI Generation feature coming soon...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}