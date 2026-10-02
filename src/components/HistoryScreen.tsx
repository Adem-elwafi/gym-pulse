import { useState } from 'react';
import { ArrowLeft, Calendar, TrendingUp, CheckCircle2, Clock, Download, Trash2 } from 'lucide-react';
import { loadHistory, exportHistoryJSON, deleteHistoryEntry } from '../lib/storage';
import type { WorkoutHistoryEntry } from '../types';

function formatDate(epoch: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(epoch));
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

interface HistoryScreenProps {
  onBack: () => void;
  timerActive?: boolean;
}

export function HistoryScreen({ onBack, timerActive = false }: HistoryScreenProps) {
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>(() => loadHistory());

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleExport = () => {
    const json = exportHistoryJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gympulse-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen bg-gray-950 ${timerActive ? 'pb-48' : 'pb-8'}`}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-95 flex items-center justify-center transition-all"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 text-gray-300" />
            </button>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">Workout History</h2>
              <p className="text-xs text-gray-400">{history.length} sessions logged</p>
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 active:scale-95 text-xs font-semibold text-gray-300 hover:text-white transition-all border border-gray-700/60"
              aria-label="Export history as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 pt-4">
        {history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <HistoryCard key={entry.id} entry={entry} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryCard({
  entry,
  onDelete,
}: {
  entry: WorkoutHistoryEntry;
  onDelete: (id: string) => void;
}) {
  const duration = formatDuration(entry.finishedAt - entry.startedAt);
  const completionPct =
    entry.totalSets > 0
      ? Math.round((entry.completedSets / entry.totalSets) * 100)
      : 0;

  return (
    <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white">{entry.dayTitle}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3" />
            {formatDate(entry.startedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              completionPct === 100
                ? 'bg-green-900/50 border border-green-700/50 text-green-400'
                : 'bg-amber-950/60 border border-amber-800/50 text-amber-300'
            }`}
          >
            {completionPct}%
          </span>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
            aria-label={`Delete ${entry.dayTitle} session from ${formatDate(entry.startedAt)}`}
            title="Delete workout entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 text-sm tabular-nums">
        <div className="flex items-center gap-1.5 text-gray-400">
          <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
          <span className="font-semibold text-white tabular-nums">{entry.totalVolume.toFixed(0)}</span>
          <span className="text-xs">kg vol</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <span className="font-semibold text-white tabular-nums">
            {entry.completedSets}/{entry.totalSets}
          </span>
          <span className="text-xs">sets</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-white tabular-nums">{duration}</span>
        </div>
      </div>
    </div>
  );
}

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-4">
        <TrendingUp className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-gray-400 font-semibold mb-1">No workouts yet</h3>
      <p className="text-gray-400 text-sm">Complete your first session to see history here.</p>
    </div>
  );
}
