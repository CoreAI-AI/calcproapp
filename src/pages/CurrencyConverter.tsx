import { useState, useMemo } from "react";
import { ArrowUpDown, Search, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { currencies } from "@/data/currencies";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";

export default function CurrencyConverterPage() {
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");
  const [amount, setAmount] = useState("1000");
  const [showPicker, setShowPicker] = useState<"from" | "to" | null>(null);
  const [search, setSearch] = useState("");

  const { rates, lastUpdated, loading, isLive, refresh } = useCurrencyRates();

  const fromC = currencies.find(c => c.code === from)!;
  const toC = currencies.find(c => c.code === to)!;

  const converted = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    return (amt / (rates[from] || 1) * (rates[to] || 1)).toFixed(2);
  }, [amount, from, to, rates]);

  const rate = useMemo(() => {
    return ((rates[to] || 1) / (rates[from] || 1)).toFixed(4);
  }, [from, to, rates]);

  const swap = () => { setFrom(to); setTo(from); };

  const filtered = currencies.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectCurrency = (code: string) => {
    if (showPicker === "from") setFrom(code);
    else setTo(code);
    setShowPicker(null);
    setSearch("");
  };

  const timeAgo = () => {
    if (!lastUpdated) return "";
    const diff = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <div className="max-w-lg mx-auto pb-24">
      <PageHeader title="Currency" subtitle="50+ currencies • Live rates" />

      <div className="px-5 space-y-4">
        {/* Live Status Bar */}
        <div className="flex items-center justify-between bg-card rounded-2xl border border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            {isLive ? (
              <Wifi className="w-3.5 h-3.5 text-success" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {isLive ? `Live • ${timeAgo()}` : "Offline rates"}
            </span>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-primary font-medium btn-bounce disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* From */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <button
            onClick={() => setShowPicker(showPicker === "from" ? null : "from")}
            className="flex items-center gap-2 mb-3 btn-bounce"
          >
            <span className="text-2xl">{fromC.flag}</span>
            <span className="font-semibold text-foreground">{from}</span>
            <span className="text-xs text-muted-foreground">{fromC.name}</span>
          </button>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-3xl font-bold font-mono text-foreground outline-none"
            placeholder="0"
          />
        </div>

        {/* Swap */}
        <div className="flex justify-center">
          <button onClick={swap} className="p-3 rounded-full bg-primary text-primary-foreground btn-bounce shadow-lg">
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>

        {/* To */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <button
            onClick={() => setShowPicker(showPicker === "to" ? null : "to")}
            className="flex items-center gap-2 mb-3 btn-bounce"
          >
            <span className="text-2xl">{toC.flag}</span>
            <span className="font-semibold text-foreground">{to}</span>
            <span className="text-xs text-muted-foreground">{toC.name}</span>
          </button>
          <p className="text-3xl font-bold font-mono text-primary">{converted}</p>
        </div>

        {/* Rate */}
        <p className="text-center text-sm text-muted-foreground">
          1 {from} = {rate} {to}
          {isLive && <span className="ml-1 text-success">●</span>}
        </p>

        {/* Currency Picker */}
        {showPicker && (
          <div className="bg-card rounded-2xl border border-border p-3">
            <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2 mb-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent w-full outline-none text-sm text-foreground"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {filtered.map(c => (
                <button
                  key={c.code}
                  onClick={() => selectCurrency(c.code)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm btn-bounce ${
                    (showPicker === "from" ? from : to) === c.code ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="font-medium">{c.code}</span>
                  <span className="text-muted-foreground text-xs truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
