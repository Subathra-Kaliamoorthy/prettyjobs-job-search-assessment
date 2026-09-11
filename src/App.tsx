import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-fuchsia-600 text-sm font-black text-white">
            P
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Pretty<span className="text-brand-600">Jobs</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Browse jobs
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <Routes>
          <Route path="/" element={<JobsPage />} />
          <Route path="/job/:id" element={<JobDetailsPage />} />
        </Routes>
        <footer className="mt-16 border-t border-slate-200 bg-white py-6">
          <p className="mx-auto max-w-6xl px-4 text-xs text-slate-400">
            PrettyJobs — 1,200 listings across 20 industries.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
