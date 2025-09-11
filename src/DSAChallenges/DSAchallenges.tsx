import  { useEffect, useMemo, useState, JSX } from "react";

/**
 * DSA Challenges - Frontend (React + TypeScript) integrated with a Django backend
 * - Single-file demo component using Tailwind CSS classes for styling.
 * - Replaces client-side evaluation with server-side evaluation via Django REST API.
 *
 * REQUIRED DJANGO BACKEND ENDPOINTS (suggested):
 *
 * GET  /api/problems/                 -> list of problems
 * GET  /api/problems/:id/             -> problem detail (including examples & hidden tests flag)
 * POST /api/problems/                 -> create/generate a new problem (optional)
 * POST /api/run/                      -> run user code against example tests (body: { problem_id, code }) -> returns RunResult
 * POST /api/submit/                   -> run user code against full tests (body: { problem_id, code }) -> returns RunResult
 * GET  /api/progress/                 -> fetch user progress (optional auth)
 * POST /api/progress/                 -> update progress on success (optional; server may auto-update when submit passes)
 *
 * The server should accept JSON and return structured JSON like the RunResult type below.
 * Authentication is out-of-scope for this demo; if you need auth, attach tokens to the `AUTH_HEADERS` below.
 *
 * HOW TO USE:
 * - Host a Django REST API with endpoints above.
 * - Configure BACKEND_URL below to point to your Django server origin.
 * - Import this component in your React app and ensure Tailwind CSS is available.
 *
 * NOTE: In production, use a proper code editor (Monaco) and secure server-side sandboxing for evaluation.
 */

// ---------------------------- CONFIG ---------------------------------

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const AUTH_HEADERS = {
  // Example for token-based auth: 'Authorization': `Token ${yourToken}`
};

// ---------------------------- Types ----------------------------------

type Difficulty = "Easy" | "Medium" | "Hard";

type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
  // hiddenTests should not be sent to client in detail for fairness, but backend can keep them
  points?: number;
  starter_code?: string;
  solution?: string; // optional canonical solution
};

type RunTestDetail = {
  input: string;
  expected: string;
  got: string;
  pass: boolean;
  error?: string;
};

type RunResult = {
  success: boolean;
  passed: number;
  total: number;
  details: RunTestDetail[];
  runtime_ms?: number;
  message?: string;
};

// ---------------------------- Helpers --------------------------------

async function apiGET<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...AUTH_HEADERS },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.statusText}`);
  return await res.json();
}

async function apiPOST<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...AUTH_HEADERS },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.detail || JSON.stringify(json));
    } catch (e) {
      throw new Error(`POST ${path} failed: ${res.statusText} - ${text}`);
    }
  }
  return await res.json();
}

// ---------------------------- Component -------------------------------

export default function DSAChallengesWithDjango(): JSX.Element {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editorCode, setEditorCode] = useState<string>("// select a problem to load starter code");
  const [search, setSearch] = useState<string>("");
  const [filterDifficulty, setFilterDifficulty] = useState<"All" | Difficulty | "Custom">("All");
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<RunResult | null>(null);
  const [progressPoints, setProgressPoints] = useState<number>(0);
  const [loadingProblems, setLoadingProblems] = useState<boolean>(false);

  // Fetch problems from backend on mount
  useEffect(() => {
    loadProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProblems() {
    try {
      setLoadingProblems(true);
      const data = await apiGET<Problem[]>("/api/problems/");
      setProblems(data);
      if (data.length > 0) setSelectedId(data[0].id);
    } catch (err: any) {
      console.error(err);
      alert("Failed to load problems: " + err.message);
    } finally {
      setLoadingProblems(false);
    }
  }

  // When selection changes, fetch full problem detail (if backend provides extra fields), and load starter code
  useEffect(() => {
    async function fetchDetail() {
      if (!selectedId) return;
      try {
        const detail = await apiGET<Problem>(`/api/problems/${selectedId}/`);
        // if server provides starter_code use it
        setEditorCode(detail.starter_code || detail.starter_code === "" ? detail.starter_code : `// Write solution for ${detail.title}\n`);
      } catch (err: any) {
        // fallback: find in problems list
        const p = problems.find((x) => x.id === selectedId);
        if (p) setEditorCode(p.starter_code || `// Write solution for ${p.title}\n`);
      }
    }
    fetchDetail();
  }, [selectedId, problems]);

  const filteredProblems = useMemo(() => {
    let list = problems.slice();
    if (filterDifficulty !== "All") list = list.filter((p) => p.difficulty === filterDifficulty);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.tags.join(" ").toLowerCase().includes(q));
    }
    return list;
  }, [problems, search, filterDifficulty]);

  // Run examples via backend
  async function runExamples() {
    if (!selectedId) return alert("Select a problem first");
    setRunning(true);
    setLastResult(null);
    try {
      const res = await apiPOST<RunResult>("/api/run/", { problem_id: selectedId, code: editorCode });
      setLastResult(res);
      if (res.success) await refreshProgress();
    } catch (err: any) {
      setLastResult({ success: false, passed: 0, total: 0, details: [{ input: "<error>", expected: "-", got: err.message || String(err), pass: false }], runtime_ms: 0 });
    } finally {
      setRunning(false);
    }
  }

  async function submitFull() {
    if (!selectedId) return alert("Select a problem first");
    setRunning(true);
    setLastResult(null);
    try {
      const res = await apiPOST<RunResult>("/api/submit/", { problem_id: selectedId, code: editorCode });
      setLastResult(res);
      if (res.success) {
        // Optionally notify server to persist progress
        try {
          await apiPOST("/api/progress/", { problem_id: selectedId, points: 1 });
        } catch (e) {
          // ignore progress update error
        }
        await refreshProgress();
      }
    } catch (err: any) {
      setLastResult({ success: false, passed: 0, total: 0, details: [{ input: "<error>", expected: "-", got: err.message || String(err), pass: false }], runtime_ms: 0 });
    } finally {
      setRunning(false);
    }
  }

  async function refreshProgress() {
    try {
      const data = await apiGET<{ points: number }>("/api/progress/");
      setProgressPoints(data.points || 0);
    } catch (e) {
      // ignore
    }
  }

  async function generateProblem() {
    try {
      const newP = await apiPOST<Problem>("/api/problems/", { generate: true });
      // prepend to list
      setProblems((prev) => [newP, ...prev]);
      setSelectedId(newP.id);
    } catch (err: any) {
      alert("Failed to generate problem: " + err.message);
    }
  }

  function DifficultyPill({ d }: { d: Difficulty | string }) {
    const cls = d === "Easy" ? "bg-green-100 text-green-800" : d === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{d}</span>;
  }

  // Download code helper
  function downloadCode() {
    const blob = new Blob([editorCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedId || "solution"}.ts`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">DSA Challenges (Django backend)</h1>
            <p className="text-sm text-slate-600">Problems and evaluation run on your Django server. Configure BACKEND_URL to point to it.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={generateProblem} className="px-4 py-2 bg-indigo-600 text-white rounded">Generate Problem</button>
            <div className="text-sm text-slate-500">Points: {progressPoints}</div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-4 bg-white p-4 rounded shadow">
            <div className="flex gap-2 mb-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 px-3 py-2 border rounded" />
              <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value as any)} className="px-2 py-2 border rounded">
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-auto">
              {loadingProblems ? (
                <div className="text-sm text-slate-500">Loading problems...</div>
              ) : (
                filteredProblems.map((p) => (
                  <div key={p.id} onClick={() => setSelectedId(p.id)} className={`p-3 rounded cursor-pointer hover:bg-slate-50 ${selectedId === p.id ? "ring-2 ring-indigo-200" : ""}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-sm">{p.title}</div>
                          <DifficultyPill d={p.difficulty} />
                        </div>
                        <div className="text-xs text-slate-500">{p.tags?.join(", ")}</div>
                      </div>
                      <div className="text-xs text-slate-400">{p.points || 0} pts</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          <main className="col-span-5 bg-white p-4 rounded shadow flex flex-col">
            {selectedId ? (
              <>
                <ProblemDetail
                  problem={problems.find((x) => x.id === selectedId) ?? null}
                  editorCode={editorCode}
                  onEditorChange={(c) => setEditorCode(c)}
                  onRun={runExamples}
                  onSubmit={submitFull}
                  running={running}
                />
              </>
            ) : (
              <div className="text-slate-500">Select a problem</div>
            )}
          </main>

          <aside className="col-span-3 bg-white p-4 rounded shadow flex flex-col gap-4">
            <div>
              <div className="text-sm font-semibold">Run Output</div>
              <div className="mt-2 bg-slate-50 p-3 rounded font-mono text-sm max-h-60 overflow-auto">
                {running ? (
                  <div>Running...</div>
                ) : lastResult ? (
                  <div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${lastResult.success ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>{lastResult.success ? "All Passed" : `${lastResult.passed}/${lastResult.total}`}</div>
                    <div className="mt-2 space-y-2">
                      {lastResult.details.map((d, i) => (
                        <div key={i} className={`p-2 rounded ${d.pass ? "bg-emerald-50" : "bg-red-50"}`}>
                          <div className="text-xs text-slate-600">Input: <span className="font-mono">{d.input}</span></div>
                          <div className="text-xs text-slate-600">Expected: <span className="font-mono">{d.expected}</span></div>
                          <div className="text-xs">Got: <span className="font-mono">{d.got}</span></div>
                          {d.error ? <div className="text-xs text-red-600">Error: {d.error}</div> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500">Run examples to see output.</div>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold">Hints</div>
              <div className="text-xs text-slate-500 mt-2">Use common patterns: hashing, two pointers, stack, recursion, DP. Server preserves hidden tests; do not rely on client-only checks.</div>
            </div>

            <div className="mt-auto flex gap-2">
              <button onClick={downloadCode} className="px-3 py-2 border rounded">Download</button>
              <div className="text-xs text-slate-400 ml-auto">Backend: {BACKEND_URL}</div>
            </div>
          </aside>
        </div>

        <footer className="mt-6 text-xs text-slate-500">DSA Challenges • Uses Django REST API for evaluation</footer>
      </div>
    </div>
  );
}

// ------------------------ ProblemDetail subcomponent ------------------

function ProblemDetail({
  problem,
  editorCode,
  onEditorChange,
  onRun,
  onSubmit,
  running,
}: {
  problem: Problem | null;
  editorCode: string;
  onEditorChange: (c: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  running: boolean;
}) {
  return (
    <>
      {problem ? (
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">{problem.title}</h2>
                <div className="text-xs text-slate-500">{problem.points || 0} pts</div>
              </div>
              <p className="text-sm text-slate-600 mt-1">{problem.description}</p>
              <div className="text-xs text-slate-500 mt-2">Tags: {problem.tags?.join(", ")}</div>
            </div>
          </div>

          <div className="mt-3 flex-1 flex flex-col">
            <label className="text-xs font-semibold mb-1">Code</label>
            <textarea spellCheck={false} value={editorCode} onChange={(e) => onEditorChange(e.target.value)} className="flex-1 font-mono p-3 border rounded resize-y min-h-[220px]" />

            <div className="mt-3 flex items-center gap-3">
              <button onClick={onRun} disabled={running} className="px-4 py-2 bg-emerald-500 text-white rounded">Run Examples</button>
              <button onClick={onSubmit} disabled={running} className="px-4 py-2 bg-indigo-600 text-white rounded">Submit (Full Tests)</button>
              <div className="ml-auto text-xs text-slate-500">{running ? "Running..." : "Ready"}</div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-semibold">Examples</label>
              <div className="grid gap-2 mt-2">
                {problem.examples?.map((ex, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded">
                    <div className="text-xs text-slate-500">Input:</div>
                    <div className="font-mono text-sm">{ex.input}</div>
                    <div className="text-xs text-slate-500 mt-1">Output:</div>
                    <div className="font-mono text-sm">{ex.output}</div>
                    {ex.explanation ? <div className="text-xs text-slate-400 mt-1">{ex.explanation}</div> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-slate-500">Problem not found</div>
      )}
    </>
  );
}
