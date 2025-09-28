import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../pages/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * DSArena - Modern DSA Practice Platform with AI Integration
 * Built with React 19, TypeScript, and Tailwind CSS for 2025 Best Practices
 * 
 * Key Improvements:
 * - Enhanced TypeScript types with generics and unions
 * - Memoized components and hooks for performance
 * - Better error handling and loading states
 * - Admin-only problem creation via createProblem
 * - Separate functions: createProblem (admin), createCommunityProblem (user), generateAIProblem (AI)
 * - React 19 hooks (useActionState, useOptimistic) where applicable
 * - Accessibility improvements (ARIA labels, keyboard nav)
 * 
 * API Endpoints:
 * - GET    /api/problems/                 Fetch all problems
 * - GET    /api/problems/{id}/            Fetch specific problem details
 * - POST   /api/problems/                 Create a new problem (Admin only)
 * - POST   /api/run/                      Run code against test cases
 * - POST   /api/submit/                   Submit final solution
 * - GET    /api/progress/                 Fetch user progress/leaderboard
 * - POST   /api/progress/                 Update user progress
 * - POST   /api/community/problems/       Create DSA Community Problem (User)
 * - POST   /api/ai/generate/              Generate AI DSA Problem
 */

// ----------------------------- Configuration --------------------------
const BACKEND_URL: string = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ----------------------------- Enhanced Types ---------------------------------
type Difficulty = "Easy" | "Medium" | "Hard";
type ProblemSource = "AI" | "User" | "Admin";

interface Problem {
  id: string;
  title: string;
  statement: string;
  input_format?: string;
  output_format?: string;
  constraints?: string[];
  examples?: Array<{ input: string; output: string; explanation?: string }>;
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
  current_streak?: number;
  streak_days?: number;
}

interface AIGeneratePayload {
  difficulty?: Difficulty;
  tags?: string[];
}

// ----------------------------- Enhanced Helpers --------------------------------
const safeJoin = (base: string, path: string): string => 
  base.replace(/\/+$/u, "") + "/" + path.replace(/^\//u, "");

const handleFetchError = async (res: Response): Promise<never> => {
  const bodyText: string = await res.text();
  let body: unknown = null;
  try {
    body = JSON.parse(bodyText);
  } catch {
    body = bodyText;
  }
  const message: string = (body && typeof body === 'object' && ((body as any).detail || (body as any).message)) || 
                          (typeof body === "string" ? body : `HTTP ${res.status}`);
  throw new Error(`API Error ${res.status}: ${message}`);
};

// ----------------------------- Enhanced API Layer -------------------------------
const apiRequest = async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const token: string | null = localStorage.getItem('token');
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Token ${token}` }),
      ...options.headers,
    },
  };
  
  const url: string = safeJoin(BACKEND_URL, endpoint);
  const res: Response = await fetch(url, config);
  if (!res.ok) await handleFetchError(res);
  return (await res.json()) as T;
};

const apiGET = async <T = unknown>(path: string): Promise<T> => apiRequest<T>(path);

const apiPOST = async <T = unknown>(path: string, body?: unknown): Promise<T> => 
  apiRequest<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });

// API Endpoint Functions
const fetchProblems = async (): Promise<Problem[]> => {
  const data = await apiGET<Problem[]>("/problems/");
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }
  // If no problems from backend, return the default problem
  return [];
};

const fetchProblemDetail = async (id: string): Promise<Problem> => 
  await apiGET<Problem>(`/problems/${encodeURIComponent(id)}/`);

const createProblem = async (payload: Omit<Partial<Problem>, 'source'>, isAdmin: boolean): Promise<Problem> => {
  if (!isAdmin) {
    throw new Error("Unauthorized: Only admin users can create problems via this endpoint");
  }
  return await apiPOST<Problem>("/problems/", { ...payload, source: 'Admin' as const });
};

const createCommunityProblem = async (payload: Omit<Partial<Problem>, 'source'>): Promise<Problem> => 
  await apiPOST<Problem>("/community/problems/", { ...payload, source: 'User' as const });

const generateAIProblem = async (payload: AIGeneratePayload): Promise<Problem> => 
  await apiPOST<Problem>("/ai/generate/", { ...payload, source: 'AI' as const });

const runCode = async (problemId: string, code: string): Promise<RunResult> => 
  await apiPOST<RunResult>("/run/", { problem_id: problemId, code });

const submitCode = async (problemId: string, code: string): Promise<RunResult> => 
  await apiPOST<RunResult>("/submit/", { problem_id: problemId, code });

const fetchProgress = async (): Promise<UserProgress[]> => await apiGET<UserProgress[]>("/progress/");

const postProgress = async (payload: unknown): Promise<unknown> => await apiPOST("/progress/", payload);

// --- 1. API: Admin-only update problem ---
const updateProblem = async (
  id: string,
  payload: Partial<Problem>,
  isAdmin: boolean
): Promise<Problem> => {
  if (!isAdmin) throw new Error("Unauthorized: Only admin users can update problems");
  return await apiRequest<Problem>(`/problems/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

// ----------------------------- UI Helpers -----------------------------
// Moved outside components since useCallback cannot be used at top level
const getDifficultyBadgeClass = (d: Difficulty): string => {
  switch (d) {
    case "Easy": return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "Medium": return "bg-amber-100 text-amber-800 border border-amber-200";
    case "Hard": return "bg-rose-100 text-rose-800 border border-rose-200";
    default: return "";
  }
};

const getDifficultyValue = (d: Difficulty): number => {
  switch (d) {
    case "Easy": return 1;
    case "Medium": return 2;
    case "Hard": return 3;
    default: return 0;
  }
};

// ----------------------------- Components -----------------------------

interface SkeletonProps { className?: string; }
const Skeleton: React.FC<SkeletonProps> = React.memo(({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
));
Skeleton.displayName = 'Skeleton';

interface ProblemCardProps { problem: Problem; onOpen: (id: string) => void; }
const ProblemCard: React.FC<ProblemCardProps> = React.memo(({ problem}) => {
  const navigate = useNavigate();
  return (
    <article className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200" role="article">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <header className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{problem.title}</h3>
            <span 
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${getDifficultyBadgeClass(problem.difficulty)}`}
              aria-label={`Difficulty: ${problem.difficulty}`}
            >
              {problem.difficulty}
            </span>
            <span 
              className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium"
              aria-label={`Source: ${problem.source}`}
            >
              {problem.source}
            </span>
          </header>

          <p className="mt-2 text-gray-700 line-clamp-2">{problem.statement}</p>

          <div className="flex items-center gap-2 mt-3" role="list">
            {problem.tags?.slice(0, 3).map(t => (
              <span key={t} className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700" role="listitem">
                {t}
              </span>
            ))}
          </div>

          <footer className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            {problem.solves !== undefined && (
              <div className="flex items-center gap-1" aria-label={`${problem.solves} solves`}>
                <span className="text-green-600" aria-hidden="true">✓</span>
                <span>{problem.solves} solved</span>
              </div>
            )}
            {problem.attempts !== undefined && (
              <div className="flex items-center gap-1" aria-label={`${problem.attempts} attempts`}>
                <span className="text-blue-600" aria-hidden="true">↻</span>
                <span>{problem.attempts} attempts</span>
              </div>
            )}
            {problem.success_rate !== undefined && (
              <div className="flex items-center gap-1" aria-label={`${problem.success_rate}% success rate`}>
                <span className="text-purple-600" aria-hidden="true">%</span>
                <span>{problem.success_rate}% success rate</span>
              </div>
            )}
            {problem.user_solved && (
              <div className="flex items-center gap-1 text-emerald-600 font-medium" aria-label="Solved by user">
                <span>✓ Solved</span>
              </div>
            )}
          </footer>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => navigate(`/problems/${problem.id}`)} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            aria-label={`Solve ${problem.title}`}
          >
            Solve Challenge
          </button>
        </div>
      </div>
    </article>
  );
});
ProblemCard.displayName = 'ProblemCard';

interface ProblemListViewProps { 
  filter?: { source?: ProblemSource | 'all'; difficulty?: Difficulty | 'all' }; 
  onOpen: (id: string) => void;
  sortBy?: 'hardest' | 'newest' | 'solved' | 'success';
}
const ProblemListView: React.FC<ProblemListViewProps> = React.memo(({ 
  filter = { source: 'all', difficulty: 'all' }, 
  onOpen, 
  sortBy = 'newest' 
}) => {
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setProblems(null);
    setError(null);
    (async () => {
      try {
        const data = await fetchProblems();
        if (mounted) setProblems(data);
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredAndSorted = useMemo(() => {
    if (!problems?.length) return [];
    
    let result = problems.filter(p => {
      if (filter.source !== 'all' && p.source !== filter.source) return false;
      if (filter.difficulty !== 'all' && p.difficulty !== filter.difficulty) return false;
      return true;
    });

    switch (sortBy) {
      case 'hardest':
        result.sort((a, b) => (b.hardness_score || getDifficultyValue(b.difficulty)) - (a.hardness_score || getDifficultyValue(a.difficulty)));
        break;
      case 'solved':
        result.sort((a, b) => (b.solves || 0) - (a.solves || 0));
        break;
      case 'success':
        result.sort((a, b) => (b.success_rate || 0) - (a.success_rate || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    return result;
  }, [problems, filter, sortBy]);

  const uniqueProblems = Array.from(
    new Map(filteredAndSorted.map(p => [p.id, p])).values()
  );

  if (error) return (
    <div className="p-4 text-red-500 bg-red-50 rounded-lg" role="alert" aria-label="Error loading problems">
      Error loading problems: {error}
    </div>
  );
  
  if (!problems) return (
    <div className="grid grid-cols-1 gap-6" role="status" aria-label="Loading problems">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
    </div>
  );

  if (!uniqueProblems.length) return (
    <div className="p-6 text-center text-gray-500 bg-white rounded-lg border" aria-label="No problems found">
      No problems found.
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6" role="list">
      {uniqueProblems.map(p => <ProblemCard key={p.id} problem={p} onOpen={onOpen} />)}
    </div>
  );
});
ProblemListView.displayName = 'ProblemListView';

interface ProblemDetailProps { problemId: string; onClose: () => void; setOptimisticSolved?: React.Dispatch<React.SetStateAction<number>>; }
const ProblemDetail: React.FC<ProblemDetailProps> = ({ problemId, onClose, setOptimisticSolved }) => {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>("// Write your solution here\n");
  const [runningResult, setRunningResult] = useState<RunResult | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const p = await fetchProblemDetail(problemId);
        if (mounted) setProblem(p);
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [problemId]);

  const onRun = useCallback(async (): Promise<void> => {
    setRunningResult(null);
    try {
      const res = await runCode(problemId, code);
      setRunningResult(res);
    } catch (e: unknown) {
      setRunningResult({ status: 'Error', message: e instanceof Error ? e.message : String(e) });
    }
  }, [problemId, code]);

  const onSubmit = useCallback(async (): Promise<void> => {
    setSubmitting(true);
    setRunningResult(null);
    try {
      const res = await submitCode(problemId, code);
      setRunningResult(res);
      if (res.status === 'Accepted') {
        try { 
          await postProgress({ problem_id: problemId, solved: true }); 
          setOptimisticSolved?.(prev => prev + 1); // Optimistically increment solved count
        } catch {} // Silent fail
      }
    } catch (e: unknown) {
      setRunningResult({ status: 'Error', message: e instanceof Error ? e.message : String(e) });
    } finally { 
      setSubmitting(false); 
    }
  }, [problemId, code, setOptimisticSolved]);

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-label="Loading problem">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
          <span>Loading problem...</span>
        </div>
      </div>
    </div>
  );
  
  if (error || !problem) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="alertdialog">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
        <div className="text-red-500 mb-4">{error || "Problem not found."}</div>
        <button 
          onClick={onClose} 
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          autoFocus
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 overflow-auto" role="dialog" aria-label={`${problem.title} details`}>
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden" style={{ maxHeight: '90vh' }}>
        <header className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{problem.title}</h2>
            <div className="text-sm text-gray-500 mt-1 flex gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs" aria-label={`Source: ${problem.source}`}>
                {problem.source}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyBadgeClass(problem.difficulty)}`} aria-label={`Difficulty: ${problem.difficulty}`}>
                {problem.difficulty}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
            aria-label="Close problem details"
          >
            Close
          </button>
        </header>

        {/* Add max-h-[70vh] and overflow-y-auto here */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
          <div className="lg:col-span-2">
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Problem Statement</h3>
              <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg" aria-label="Problem statement">
                {problem.statement}
              </div>
            </section>

            <section className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Examples</h4>
              {problem.examples?.map((ex, i) => (
                <div key={i} className="mb-4 border border-gray-200 p-4 rounded-lg bg-gray-50" role="group">
                  <div className="text-sm font-medium text-gray-600 mb-1">Input</div>
                  <pre className="p-3 bg-white rounded border text-sm" aria-label={`Example ${i + 1} input`}>{ex.input}</pre>
                  <div className="text-sm font-medium text-gray-600 mb-1 mt-3">Output</div>
                  <pre className="p-3 bg-white rounded border text-sm" aria-label={`Example ${i + 1} output`}>{ex.output}</pre>
                  {ex.explanation && (
                    <>
                      <div className="text-sm font-medium text-gray-600 mb-1 mt-3">Explanation</div>
                      <div className="text-sm text-gray-700" aria-label={`Example ${i + 1} explanation`}>{ex.explanation}</div>
                    </>
                  )}
                </div>
              )) || <p>No examples available.</p>}
            </section>

            <section>
              <h4 className="text-lg font-semibold mb-3 text-gray-900">Your Solution</h4>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <textarea 
                  value={code} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)} 
                  rows={14} 
                  className="w-full font-mono p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="// Write your solution here"
                  aria-label="Code editor"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button 
                  onClick={onRun} 
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  aria-label="Run code"
                >
                  Run Code
                </button>
                <button 
                  onClick={onSubmit} 
                  disabled={submitting} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  aria-label="Submit solution"
                >
                  {submitting ? "Submitting..." : "Submit Solution"}
                </button>
                <button 
                  onClick={() => setCode('// Write your solution here\n')} 
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  aria-label="Reset code"
                >
                  Reset Code
                </button>
              </div>

              {runningResult && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50" role="status" aria-label="Run results">
                  <div className="flex items-center justify-between">
                    <div className={`font-semibold ${runningResult.status === 'Accepted' ? 'text-emerald-700' : 'text-red-600'}`}>
                      Status: {runningResult.status}
                    </div>
                    <div className="text-sm text-gray-500" aria-label="Performance metrics">
                      {runningResult.runtime_ms ? `${runningResult.runtime_ms} ms` : ''}
                      {runningResult.memory_kb ? ` • ${runningResult.memory_kb} KB` : ''}
                    </div>
                  </div>
                  {runningResult.message && <div className="mt-2 text-sm text-gray-700">{runningResult.message}</div>}

                  {runningResult.test_results && runningResult.test_results.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700">Test Results</div>
                      <ul className="mt-2 text-sm space-y-1" role="list">
                        {runningResult.test_results.map((t, i) => (
                          <li key={i} className={`py-1 ${t.passed ? 'text-emerald-700' : 'text-red-600'}`} role="listitem">
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

          <aside className="bg-gray-50 p-5 rounded-lg border border-gray-200" aria-label="Problem details">
            <div className="text-lg font-semibold text-gray-800 mb-4">Problem Details</div>
            
            <div className="mb-5">
              <div className="text-sm font-medium text-gray-600 mb-2">Constraints</div>
              <ul className="text-sm text-gray-700 space-y-1" role="list">
                {problem.constraints?.map((c, i) => <li key={i} className="mb-1" role="listitem">• {c}</li>) || <li>No constraints specified.</li>}
              </ul>
            </div>

            <div className="mb-5">
              <div className="text-sm font-medium text-gray-600 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2" role="list">
                {problem.tags?.map(t => (
                  <span key={t} className="text-xs bg-white px-3 py-1 rounded-full border border-gray-300 text-gray-700" role="listitem">
                    {t}
                  </span>
                )) || <span>No tags.</span>}
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

interface CreateProblemModalProps { open: boolean; onClose: () => void; onCreated?: (p: Problem) => void; }
const CreateProblemModal: React.FC<CreateProblemModalProps> = React.memo(({ open, onClose, onCreated }) => {
  const { isSuperUser, isStaff } = useAuth();
  const isAdmin = isSuperUser || isStaff;
  const [title, setTitle] = useState<string>("");
  const [statement, setStatement] = useState<string>("");
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [tags, setTags] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTitle(''); setStatement(''); setTags(''); setDifficulty('Easy'); setError(null);
    }
  }, [open]);

  const submit = useCallback(async (): Promise<void> => {
    if (!isAdmin) {
      setError("Only admin users can create problems");
      return;
    }
    if (!title.trim() || !statement.trim()) {
      setError("Title and statement are required");
      return;
    }
    setLoading(true); setError(null);
    try {
      const payload = {
        title: title.trim() || 'Untitled problem',
        statement: statement.trim(),
        difficulty,
        tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      };
      const p = await createProblem(payload, isAdmin); // or createCommunityProblem, or generateAIProblem
      onCreated?.(p);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create problem");
    } finally {
      setLoading(false);
    }
  }, [title, statement, difficulty, tags, isAdmin, onCreated, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40" role="dialog" aria-modal="true" aria-label="Create admin problem">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Admin Problem {!isAdmin && "(Admin Only)"}</h2>
          <button 
            onClick={onClose} 
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Close modal"
          >
            Close
          </button>
        </header>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Title *</label>
            <input 
              id="title"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Problem title" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="statement">Problem Statement *</label>
            <textarea 
              id="statement"
              value={statement} 
              onChange={(e) => setStatement(e.target.value)} 
              rows={6} 
              placeholder="Describe the problem..." 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="difficulty">Difficulty</label>
              <select 
                id="difficulty"
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
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tags">Tags (comma separated)</label>
              <input 
                id="tags"
                value={tags} 
                onChange={(e) => setTags(e.target.value)} 
                placeholder="algorithm, data-structures, etc." 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
          </div>

          {error && <div className="p-3 text-red-600 bg-red-50 rounded-lg text-sm" role="alert">{error}</div>}

          <footer className="flex items-center justify-end gap-3 pt-4">
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              onClick={submit} 
              disabled={loading || !isAdmin}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Problem"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
});
CreateProblemModal.displayName = 'CreateProblemModal';

// --- Community Problem Creation Modal for Users ---
interface CommunityProblemModalProps { open: boolean; onClose: () => void; onCreated?: (p: Problem) => void; }
const CommunityProblemModal: React.FC<CommunityProblemModalProps> = React.memo(({ open, onClose, onCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [statement, setStatement] = useState<string>("");
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [tags, setTags] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setTitle(''); setStatement(''); setTags(''); setDifficulty('Easy'); setError(null);
    }
  }, [open]);

  const submit = useCallback(async (): Promise<void> => {
    if (!user) {
      setError("You must be logged in to create a problem");
      return;
    }
    if (!title.trim() || !statement.trim()) {
      setError("Title and statement are required");
      return;
    }
    setLoading(true); setError(null);
    try {
      const payload = {
        title: title.trim() || 'Untitled problem',
        statement: statement.trim(),
        difficulty,
        tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      };
      const p = await createCommunityProblem(payload);
      onCreated?.(p);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create problem");
    } finally {
      setLoading(false);
    }
  }, [title, statement, difficulty, tags, user, onCreated, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40" role="dialog" aria-modal="true" aria-label="Create community problem">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Community Problem</h2>
          <button 
            onClick={onClose} 
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Close modal"
          >
            Close
          </button>
        </header>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">Title *</label>
            <input 
              id="title"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Problem title" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="statement">Problem Statement *</label>
            <textarea 
              id="statement"
              value={statement} 
              onChange={(e) => setStatement(e.target.value)} 
              rows={6} 
              placeholder="Describe the problem..." 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="difficulty">Difficulty</label>
              <select 
                id="difficulty"
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
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tags">Tags (comma separated)</label>
              <input 
                id="tags"
                value={tags} 
                onChange={(e) => setTags(e.target.value)} 
                placeholder="algorithm, data-structures, etc." 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
          </div>

          {error && <div className="p-3 text-red-600 bg-red-50 rounded-lg text-sm" role="alert">{error}</div>}

          <footer className="flex items-center justify-end gap-3 pt-4">
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              onClick={submit} 
              disabled={loading} 
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Problem"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
});
CommunityProblemModal.displayName = 'CommunityProblemModal';

// --- AI Page Component ---
interface AIPageProps { onOpenProblem: (id: string) => void; }
const AIPage: React.FC<AIPageProps> = React.memo(({ onOpenProblem }) => {
  const [aiProblems, setAiProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const problems = await fetchProblems();
        if (mounted) setAiProblems(problems.filter(p => p.source === "AI"));
      } catch (err: unknown) {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => { mounted = false; };
  }, []);

  const refreshAIProblems = useCallback(async () => {
    try {
      const problems = await fetchProblems();
      setAiProblems(problems.filter(p => p.source === "AI"));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  return (
    <div className="space-y-6">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl">
        <h1 className="text-4xl font-bold mb-4">AI Challenges</h1>
        <p className="text-lg mb-6">Practice with algorithm problems generated by our advanced AI system</p>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Generate new challenge"
          >
            Generate New Challenge
          </button>
          <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
            Explore Community Problems
          </button>
        </div>
      </header>

      <section>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">AI-Generated Challenges</h3>
          {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg" role="alert">{error}</div>}
          {!aiProblems ? (
            <div className="space-y-4" aria-label="Loading AI problems">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          ) : !aiProblems.length ? (
            <p className="text-gray-600 p-4 text-center" aria-label="No AI problems">No AI-generated problems yet.</p>
          ) : (
            <div className="space-y-4">
              {aiProblems.slice(0, 3).map(problem => (
                <article key={problem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{problem.title}</h4>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium mt-2 inline-block ${getDifficultyBadgeClass(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <button 
                      onClick={() => onOpenProblem(problem.id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                      aria-label={`Solve ${problem.title}`}
                    >
                      Solve
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{problem.statement}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {showGenerateModal && (
        <AIGenerateModal
          open={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onCreated={() => {
            setShowGenerateModal(false);
            refreshAIProblems();
          }}
        />
      )}
    </div>
  );
});
AIPage.displayName = 'AIPage';

// --- Community Page Component ---
interface CommunityPageProps { onOpenProblem: (id: string) => void; }
const CommunityPage: React.FC<CommunityPageProps> = React.memo(({ onOpenProblem }) => {
  const [sortBy, setSortBy] = useState<'hardest' | 'newest' | 'solved' | 'success'>('newest');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showCommunityModal, setShowCommunityModal] = useState<boolean>(false);
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all');
  const { isSuperUser, isStaff } = useAuth();
  const isAdmin = isSuperUser || isStaff;

  const handleCreate = useCallback((_p: Problem) => {
    setShowCreateModal(false);
    setShowCommunityModal(false);
  }, []);

  return (
    <div className="space-y-6">
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 rounded-xl">
        <h1 className="text-4xl font-bold mb-4">Community Problems</h1>
        <p className="text-lg mb-6">Solve problems created by the community and share your own challenges</p>
        <div className="flex gap-4">
          <button 
            onClick={() => isAdmin ? setShowCreateModal(true) : setShowCommunityModal(true)}
            className={`px-6 py-3 bg-white ${isAdmin ? "text-emerald-600" : "text-blue-600"} font-semibold rounded-lg hover:bg-gray-100 transition-colors`}
            aria-label="Create new problem"
          >
            {isAdmin ? "Create New Problem" : "Create Community Problem"}
          </button>
          <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
            View My Submissions
          </button>
        </div>
      </header>

      <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Community Challenges</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={filterDifficulty} 
              onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              aria-label="Filter by difficulty"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              aria-label="Sort by"
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
      </section>

      {showCreateModal && (
        <CreateProblemModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreate}
        />
      )}
      {showCommunityModal && (
        <CommunityProblemModal
          open={showCommunityModal}
          onClose={() => setShowCommunityModal(false)}
          onCreated={handleCreate}
        />
      )}
    </div>
  );
});
CommunityPage.displayName = 'CommunityPage';

// --- Top Navigation Bar ---
interface TopNavProps { onNavigate: (page: string) => void; current: string; }
const TopNav: React.FC<TopNavProps> = ({ onNavigate, current }) => (
  <nav className="w-full bg-white border-b shadow-sm flex flex-wrap items-center justify-center px-4 py-3 gap-3 mb-6 rounded-b-xl" role="navigation" aria-label="Main navigation">
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
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${current === page ? "bg-indigo-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"}`}
        style={{ minWidth: 120 }}
        aria-current={current === page ? "page" : undefined}
        aria-label={`Navigate to ${label}`}
      >
        {label}
      </button>
    ))}
  </nav>
);

// --- Main App ---
const DSAchallenges: React.FC = () => {
  const [page, setPage] = useState<string>('dashboard');
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState<boolean>(false);

  const { user, isSuperUser, isStaff } = useAuth();
  const isAdmin = isSuperUser || isStaff;
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(false);
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [currentStreakDays, setCurrentStreakDays] = useState<number>(0);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [optimisticSolved, setOptimisticSolved] = useState(0);

  useEffect(() => {
    (async () => {
      try { await fetchProblems(); } catch {} // Preload
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
        const uid = user?.id || user?.username || null;
        const entry = progress.find((e: UserProgress) => 
          String(e.user_id) === String(uid)
        ) || { solved_count: 0, points: 0, current_streak: 0 };
        if (mounted) {
          setTotalSolved(entry.solved_count || 0);
          setPointsEarned(entry.points || 0);
          setCurrentStreakDays(entry.current_streak || 0);
        }
      } catch (err: unknown) {
        if (mounted) {
          setDashboardError(err instanceof Error ? err.message : "Failed to load dashboard");
          setTotalSolved(0); setPointsEarned(0); setCurrentStreakDays(0);
        }
      } finally {
        if (mounted) setDashboardLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [page, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav onNavigate={setPage} current={page} />
      <main className="max-w-7xl mx-auto px-2 py-4">
        {page === 'dashboard' && (
          <div className="space-y-6">
            {/* Admin-only button */}
            {isAdmin && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setCreateOpen(true)}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Admin: Create New Problem
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="figure" aria-label="Total problems solved">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Total Problems Solved</h3>
                <div className="text-3xl font-bold text-indigo-600">
                  {dashboardLoading ? <Skeleton className="h-8 w-20 inline-block" /> : totalSolved + optimisticSolved}
                </div>
                {dashboardError && <div className="text-xs text-red-600 mt-2">Failed to load</div>}
              </div>

              <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="figure" aria-label="Current streak">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Current Streak</h3>
                <div className="text-3xl font-bold text-green-600">
                  {dashboardLoading ? <Skeleton className="h-8 w-28 inline-block" /> : `${currentStreakDays} days`}
                </div>
                {dashboardError && <div className="text-xs text-red-600 mt-2">Streak unavailable</div>}
              </div>

              <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="figure" aria-label="Points earned">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Points Earned</h3>
                <div className="text-3xl font-bold text-amber-600">
                  {dashboardLoading ? <Skeleton className="h-8 w-28 inline-block" /> : pointsEarned.toLocaleString()}
                </div>
                {dashboardError && <div className="text-xs text-red-600 mt-2">Points unavailable</div>}
              </div>
            </div>
            
            <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Recommended Problems</h3>
              <ProblemListView onOpen={(id) => setSelectedProblemId(id)} sortBy="newest" />
            </section>
          </div>
        )}

        {page === 'ai' && <AIPage onOpenProblem={(id) => setSelectedProblemId(id)} />}

        {page === 'community' && <CommunityPage onOpenProblem={(id) => setSelectedProblemId(id)} />}

        {page === 'leaderboard' && <StaticLeaderboard />}

        {page === 'profile' && (
          <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-0 m-0">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-10 mt-10 mb-10">
              <header className="flex flex-col md:flex-row items-center gap-10 mb-10">
                <div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl text-white font-bold shadow-lg border-4 border-white"
                  aria-label="User avatar"
                >
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{user?.username || "-"}</h2>
                  <div className="text-xl text-gray-500">{user?.email || "-"}</div>
                  <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                    <span className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm shadow">Member since: September 2025</span>
                    <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-semibold text-sm shadow">Problems created: 0</span>
                  </div>
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <section>
                  <h3 className="text-2xl font-bold text-blue-600 mb-6">Account Details</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600" aria-hidden="true">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.015-8 4.5V21h16v-2.5c0-2.485-3.582-4.5-8-4.5z" /></svg>
                      </span>
                      <span className="font-medium text-lg">Username:</span>
                      <span className="text-lg">{user?.username || "-"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600" aria-hidden="true">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm-7 7h18v2H-3v-2z" /></svg>
                      </span>
                      <span className="font-medium text-lg">Email:</span>
                      <span className="text-lg">{user?.email || "-"}</span>
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="text-2xl font-bold text-purple-600 mb-6">Tech Profile</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600" aria-hidden="true">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v10H7V7z" /></svg>
                      </span>
                      <span className="font-medium text-lg">Data Structures:</span>
                      <span className="text-lg">Beginner</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600" aria-hidden="true">
                        <svg width="24" height="24" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2l4 4-4 4-4-4 4-4zm0 16l4-4-4-4-4 4 4 4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span className="font-medium text-lg">Algorithms:</span>
                      <span className="text-lg">Beginner</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600" aria-hidden="true">
                        <svg width="24" height="24" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v8m0 0l-4-4m4 4l4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span className="font-medium text-lg">Points Earned:</span>
                      <span className="text-lg">{pointsEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600" aria-hidden="true">
                        <svg width="24" height="24" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M8 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span className="font-medium text-lg">Problems Solved:</span>
                      <span className="text-lg">{totalSolved}</span>
                    </div>
                  </div>
                </section>
              </div>

              <section className="mt-12">
                <h3 className="text-2xl font-semibold text-green-600 mb-6">Problem Solving Activity</h3>
                <div className="bg-gray-900 rounded-lg p-8 w-full shadow" aria-label="Contribution graph">
                  <div className="text-lg text-gray-400 mb-4">2025</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex ml-12 mb-2">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                        <div key={month} className="w-8 text-sm text-gray-400 text-center">{month}</div>
                      ))}
                    </div>
                    {[...Array(7)].map((_, weekIdx) => (
                      <div key={weekIdx} className="flex items-center">
                        <div className="w-10 text-sm text-gray-400 text-right mr-2">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekIdx]}
                        </div>
                        {[...Array(52)].map((_, dayIdx) => {
                          const solved = Math.random() > 0.8;
                          const level = solved ? Math.floor(Math.random() * 4) + 1 : 0;
                          const colors = [
                            "bg-gray-800 border-gray-700",
                            "bg-green-900 border-green-800",
                            "bg-green-700 border-green-600",
                            "bg-green-500 border-green-400",
                            "bg-green-300 border-green-200",
                          ];
                          return (
                            <div
                              key={dayIdx}
                              className={`w-4 h-4 rounded-sm border ${colors[level]} mx-[1.5px] tooltip`}
                              title={`Week ${weekIdx + 1}, Day ${dayIdx + 1}: ${level} problems solved`}
                              aria-hidden="true"
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-400" aria-label="Legend">
                    <span>Less</span>
                    {['bg-gray-800 border-gray-700', 'bg-green-900 border-green-800', 'bg-green-700 border-green-600', 'bg-green-500 border-green-400', 'bg-green-300 border-green-200'].map((color, i) => (
                      <div key={i} className={`w-4 h-4 rounded-sm border ${color}`} aria-hidden="true" />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
      {selectedProblemId && (
        <ProblemDetail 
          problemId={selectedProblemId} 
          onClose={() => setSelectedProblemId(null)} 
          setOptimisticSolved={setOptimisticSolved}
        />
      )}
      {createOpen && (
        <CreateProblemModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => setCreateOpen(false)}
        />
      )}
    </div>
  );
};

// Add this if missing
const StaticLeaderboard: React.FC = () => (
  <div className="bg-white p-6 rounded-xl shadow border border-gray-200" role="region" aria-label="Leaderboard">
    <h4 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard</h4>
    <ol className="space-y-3" role="list">
      {Array.from({ length: 10 }).map((_, i) => (
        <li 
          key={i} 
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" 
          role="listitem"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold" aria-hidden="true">
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
            </div>
            <div>
              <div className="font-medium text-gray-900">User {i + 1}</div>
              <div className="text-sm text-gray-500">Solved {Math.floor(Math.random() * 100)} problems</div>
            </div>
          </div>
          <div className="font-semibold text-indigo-600" aria-label={`${(i + 1) * 100} points`}>{(i + 1) * 100} pts</div>
        </li>
      ))}
    </ol>
  </div>
);

// Add this if missing
// Example AI Problem Generation Modal
interface AIGenerateModalProps { open: boolean; onClose: () => void; onCreated?: (p: Problem) => void; }
const AIGenerateModal: React.FC<AIGenerateModalProps> = React.memo(({ open, onClose, onCreated }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [tags, setTags] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) { setTags(''); setDifficulty('Easy'); setError(null); }
  }, [open]);

  const submit = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const payload: AIGeneratePayload = {
        difficulty,
        tags: tags.split(',').map(s => s.trim()).filter(Boolean),
      };
      const p = await generateAIProblem(payload);
      onCreated?.(p);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate problem");
    } finally {
      setLoading(false);
    }
  }, [difficulty, tags, onCreated, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40" role="dialog" aria-modal="true" aria-label="Generate AI problem">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Generate AI Problem</h2>
          <button 
            onClick={onClose} 
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Close modal"
          >
            Close
          </button>
        </header>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ai-difficulty">Difficulty</label>
            <select 
              id="ai-difficulty"
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
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ai-tags">Tags (comma separated)</label>
            <input 
              id="ai-tags"
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
              placeholder="algorithm, data-structures, etc." 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          {error && <div className="p-3 text-red-600 bg-red-50 rounded-lg text-sm" role="alert">{error}</div>}
          <footer className="flex items-center justify-end gap-3 pt-4">
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              onClick={submit} 
              disabled={loading} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Problem"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
});
AIGenerateModal.displayName = 'AIGenerateModal';

// --- Admin Update Problem Modal ---
interface UpdateProblemModalProps {
  open: boolean;
  onClose: () => void;
  problem: Problem | null;
  onUpdated?: (p: Problem) => void;
}
const UpdateProblemModal: React.FC<UpdateProblemModalProps> = React.memo(({ open, onClose, problem, onUpdated }) => {
  const { isSuperUser, isStaff } = useAuth();
  const isAdmin = isSuperUser || isStaff;
  const [title, setTitle] = useState<string>(problem?.title || "");
  const [statement, setStatement] = useState<string>(problem?.statement || "");
  const [difficulty, setDifficulty] = useState<Difficulty>(problem?.difficulty || "Easy");
  const [tags, setTags] = useState<string>((problem?.tags || []).join(", "));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && problem) {
      setTitle(problem.title || "");
      setStatement(problem.statement || "");
      setDifficulty(problem.difficulty || "Easy");
      setTags((problem.tags || []).join(", "));
      setError(null);
    }
  }, [open, problem]);

  const submit = useCallback(async () => {
    if (!isAdmin || !problem) {
      setError("Only admin users can update problems");
      return;
    }
    if (!title.trim() || !statement.trim()) {
      setError("Title and statement are required");
      return;
    }
    setLoading(true); setError(null);


    try {
      const payload = {
        title: title.trim(),
        statement: statement.trim(),
        difficulty,
        tags: tags.split(",").map(s => s.trim()).filter(Boolean),
      };
      const updated = await updateProblem(problem.id, payload, isAdmin);
      onUpdated?.(updated);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update problem");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, problem, title, statement, difficulty, tags, onUpdated, onClose]);

  if (!open || !problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40" role="dialog" aria-modal="true" aria-label="Update problem">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Update Problem</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Close modal"
          >
            Close
          </button>
        </header>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="update-title">Title *</label>
            <input
              id="update-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="update-statement">Problem Statement *</label>
            <textarea
              id="update-statement"
              value={statement}
              onChange={e => setStatement(e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="update-difficulty">Difficulty</label>
              <select
                id="update-difficulty"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as Difficulty)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="update-tags">Tags (comma separated)</label>
              <input
                id="update-tags"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          {error && <div className="p-3 text-red-600 bg-red-50 rounded-lg text-sm" role="alert">{error}</div>}
          <footer className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading || !isAdmin}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Problem"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
});
UpdateProblemModal.displayName = "UpdateProblemModal";

export type { Problem, RunResult };
export { fetchProblemDetail, runCode, submitCode, postProgress, getDifficultyBadgeClass };
export default DSAchallenges;