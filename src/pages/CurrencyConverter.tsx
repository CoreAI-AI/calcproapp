import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, Search, Star, StarOff } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { currencies, fallbackRates, type Currency } from "@/data/currencies";

function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem("fav-currencies") || '["USD","EUR","GBP","AED"]'); }
  catch { return ["USD", "EUR", "GBP", "AED"]; }
}
function saveFavorites(favs: string[]) { localStorage.setItem("fav-currencies", JSON.stringify(favs)); }

function CurrencyPicker({ selected, onSelect, search, onSearch }: {
  selected: string; onSelect: (c: string) => void; search: string; onSearch: (s: string) => void;
}) {
  const filtered = currencies.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="bg-card rounded-2xl border border-border p-3 max-h-60 overflow-y-auto">
      <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2 mb-2 sticky top-0">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search currency..."
          className="bg-transparent w-full outline-none text-sm text-foreground"
        />
      </div>
      <div className="space-y-0.5">
        {filtered.map(c => (
          <button
            key={c.code}
            onClick={() => onSelect(c.code)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm btn-bounce transition-colors ${
              selected === c.code ? "bg-primary/10 text-primary" : "hover:bg-secondary"
            }`}
          >
            <span className="text-lg">{c.flag}</span>
            <span className="font-medium">{c.code}</span>
            <span className="text-muted-foreground text-xs truncate">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CurrencyConverterPage() {
  const [from, setFrom] = useState("INR");
  const [to, setTo] = useState("USD");
  const [amount, setAmount] = useState("1000");
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [favorites, setFavorites] = useState(getFavorites);

  const fromCurrency = currencies.find(c => c.code === from)!;
  const toCurrency = currencies.find(c => c.code === to)!;

  const converted = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const fromRate = fallbackRates[from] || 1;
    const toRate = fallbackRates[to] || 1;
    return (amt / fromRate * toRate).toFixed(2);
  }, [amount, from, to]);

  const rate = useMemo(() => {
    const fromRate = fallbackRates[from] || 1;
    const toRate = fallbackRates[to] || 1;
    return (toRate / fromRate).toFixed(6);
  }, [from, to]);

  const swap = () => { setFrom(to); setTo(from); };

  const toggleFav = (code: string) => {
    const updated = favorites.includes(code)
      ? favorites.filter(f => f !== code)
      : [...favorites, code];
    setFavorites(updated);
    saveFavorites(updated);
  };

  return (
    <div className="max-w-lg mx-auto pb-24">
      <PageHeader title="Currency Converter" subtitle="50+ world currencies" />
      
      <div className="px-5 space-y-4">
        {/* From */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => { setShowFromPicker(!showFromPicker); setShowToPicker(false); }}
              className="flex items-center gap-2 btn-bounce"
            >
              <span className="text-2xl">{fromCurrency.flag}</span>
              <span className="font-semibold text-foreground">{from}</span>
            </button>
            <button onClick={() => toggleFav(from)} className="btn-bounce">
              {favorites.includes(from)
                ? <Star className="w-5 h-5 text-primary fill-primary" />
                : <StarOff className="w-5 h-5 text-muted-foreground" />}
            </button>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-3xl font-bold font-mono text-foreground outline-none"
            placeholder="0"
          />
          {showFromPicker && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
              <CurrencyPicker selected={from} onSelect={(c) => { setFrom(c); setShowFromPicker(false); }} search={searchFrom} onSearch={setSearchFrom} />
            </motion.div>
          )}
        </div>

        {/* Swap */}
        <div className="flex justify-center">
          <button onClick={swap} className="p-3 rounded-full bg-primary text-primary-foreground btn-bounce shadow-lg">
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>

        {/* To */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => { setShowToPicker(!showToPicker); setShowFromPicker(false); }}
              className="flex items-center gap-2 btn-bounce"
            >
              <span className="text-2xl">{toCurrency.flag}</span>
              <span className="font-semibold text-foreground">{to}</span>
            </button>
            <button onClick={() => toggleFav(to)} className="btn-bounce">
              {favorites.includes(to)
                ? <Star className="w-5 h-5 text-primary fill-primary" />
                : <StarOff className="w-5 h-5 text-muted-foreground" />}
            </button>
          </div>
          <p className="text-3xl font-bold font-mono text-primary">{converted}</p>
          {showToPicker && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
              <CurrencyPicker selected={to} onSelect={(c) => { setTo(c); setShowToPicker(false); }} search={searchTo} onSearch={setSearchTo} />
            </motion.div>
          )}
        </div>

        {/* Rate */}
        <p className="text-center text-sm text-muted-foreground">
          1 {from} = {rate} {to}
        </p>

        {/* Favorites Quick Access */}
        {favorites.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick Convert from {from}</p>
            <div className="grid grid-cols-2 gap-2">
              {favorites.filter(f => f !== from).slice(0, 4).map(fav => {
                const c = currencies.find(c => c.code === fav);
                if (!c) return null;
                const r = (fallbackRates[fav] || 1) / (fallbackRates[from] || 1);
                const val = ((parseFloat(amount) || 0) * r).toFixed(2);
                return (
                  <button
                    key={fav}
                    onClick={() => setTo(fav)}
                    className="flex items-center gap-2 bg-card border border-border rounded-xl p-3 btn-bounce text-left"
                  >
                    <span>{c.flag}</span>
                    <div>
                      <p className="text-xs text-muted-foreground">{fav}</p>
                      <p className="text-sm font-mono font-semibold text-foreground">{val}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
