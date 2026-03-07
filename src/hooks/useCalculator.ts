import { useState, useCallback } from "react";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

const HISTORY_KEY = "calc-history";

function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 100)));
}

export function useCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [preview, setPreview] = useState("");
  const [lastResult, setLastResult] = useState("");

  const evalSafe = useCallback((expr: string): string => {
    try {
      const sanitized = expr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/%/g, "/100");
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      if (typeof result === "number" && isFinite(result)) {
        return parseFloat(result.toFixed(10)).toString();
      }
      return "Error";
    } catch {
      return "";
    }
  }, []);

  const updatePreview = useCallback((expr: string, currentDisplay: string) => {
    const full = expr + currentDisplay;
    if (full && /[\d]/.test(full)) {
      const r = evalSafe(full);
      setPreview(r && r !== "Error" ? r : "");
    } else {
      setPreview("");
    }
  }, [evalSafe]);

  const inputDigit = useCallback((digit: string) => {
    setDisplay(prev => {
      const next = prev === "0" || lastResult ? digit : prev + digit;
      if (lastResult) setLastResult("");
      updatePreview(expression, next);
      return next;
    });
  }, [expression, lastResult, updatePreview]);

  const inputDecimal = useCallback(() => {
    setDisplay(prev => {
      if (prev.includes(".")) return prev;
      const next = prev + ".";
      updatePreview(expression, next);
      return next;
    });
  }, [expression, updatePreview]);

  const inputOperator = useCallback((op: string) => {
    setExpression(prev => {
      const next = prev + display + ` ${op} `;
      setDisplay("0");
      setLastResult("");
      setPreview("");
      return next;
    });
  }, [display]);

  const calculate = useCallback(() => {
    const full = expression + display;
    if (!full) return;
    const result = evalSafe(full);
    if (result && result !== "Error") {
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        expression: full.replace(/\*/g, "×").replace(/\//g, "÷"),
        result,
        timestamp: Date.now(),
      };
      const history = getHistory();
      history.unshift(entry);
      saveHistory(history);
    }
    setDisplay(result || "Error");
    setExpression("");
    setPreview("");
    setLastResult(result);
  }, [display, expression, evalSafe]);

  const clear = useCallback(() => {
    setDisplay("0");
    setExpression("");
    setPreview("");
    setLastResult("");
  }, []);

  const backspace = useCallback(() => {
    setDisplay(prev => {
      const next = prev.length > 1 ? prev.slice(0, -1) : "0";
      updatePreview(expression, next);
      return next;
    });
  }, [expression, updatePreview]);

  const toggleSign = useCallback(() => {
    setDisplay(prev => {
      if (prev === "0") return prev;
      const next = prev.startsWith("-") ? prev.slice(1) : "-" + prev;
      updatePreview(expression, next);
      return next;
    });
  }, [expression, updatePreview]);

  const inputPercent = useCallback(() => {
    setDisplay(prev => {
      const val = parseFloat(prev);
      if (isNaN(val)) return prev;
      const next = (val / 100).toString();
      updatePreview(expression, next);
      return next;
    });
  }, [expression, updatePreview]);

  return {
    display,
    expression,
    preview,
    inputDigit,
    inputDecimal,
    inputOperator,
    calculate,
    clear,
    backspace,
    toggleSign,
    inputPercent,
    setDisplay,
    setExpression,
  };
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(getHistory);

  const refresh = useCallback(() => setEntries(getHistory()), []);
  const remove = useCallback((id: string) => {
    const updated = getHistory().filter(e => e.id !== id);
    saveHistory(updated);
    setEntries(updated);
  }, []);
  const clearAll = useCallback(() => {
    saveHistory([]);
    setEntries([]);
  }, []);

  return { entries, refresh, remove, clearAll };
}
