import { useState, useEffect, useCallback } from "react";
import { fallbackRates } from "@/data/currencies";

const CACHE_KEY = "calc-currency-rates";
const CACHE_TIME_KEY = "calc-currency-rates-time";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface RatesData {
  rates: Record<string, number>;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
  isLive: boolean;
}

function getCached(): Record<string, number> | null {
  try {
    const time = localStorage.getItem(CACHE_TIME_KEY);
    if (time && Date.now() - parseInt(time) < CACHE_DURATION) {
      const rates = JSON.parse(localStorage.getItem(CACHE_KEY) || "");
      if (rates && Object.keys(rates).length > 0) return rates;
    }
  } catch {}
  return null;
}

function setCache(rates: Record<string, number>) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
  localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
}

export function useCurrencyRates(): RatesData & { refresh: () => void } {
  const [rates, setRates] = useState<Record<string, number>>(() => getCached() || fallbackRates);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data?.rates) {
        setRates(data.rates);
        setCache(data.rates);
        setLastUpdated(new Date());
        setIsLive(true);
      }
    } catch (e) {
      setError("Using offline rates");
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = getCached();
    if (cached) {
      setRates(cached);
      setIsLive(true);
      setLastUpdated(new Date(parseInt(localStorage.getItem(CACHE_TIME_KEY) || "0")));
    }
    fetchRates();

    // Auto refresh every 10 minutes
    const interval = setInterval(fetchRates, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [fetchRates]);

  return { rates, lastUpdated, loading, error, isLive, refresh: fetchRates };
}
