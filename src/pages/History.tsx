import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Trash2, Clock } from "lucide-react";
import { useHistory } from "@/hooks/useCalculator";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

export default function HistoryPage() {
  const { entries, refresh, remove, clearAll } = useHistory();

  useEffect(() => { refresh(); }, [refresh]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-lg mx-auto pb-24">
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">History</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{entries.length} calculations</p>
        </div>
        {entries.length > 0 && (
          <button onClick={clearAll} className="text-sm text-destructive font-medium btn-bounce">
            Clear All
          </button>
        )}
      </div>

      <div className="px-5">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Clock className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">No history yet</p>
            <p className="text-sm">Your calculations will appear here</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card rounded-2xl border border-border p-4"
                >
                  <p className="text-sm text-muted-foreground font-mono">{entry.expression}</p>
                  <p className="text-xl font-bold font-mono text-foreground">= {entry.result}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => copy(entry.result)} className="p-1.5 rounded-lg bg-secondary btn-bounce">
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => remove(entry.id)} className="p-1.5 rounded-lg bg-secondary btn-bounce">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
