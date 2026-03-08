import { useState } from "react";
import { Copy, Delete, ChevronUp } from "lucide-react";
import { useCalculator } from "@/hooks/useCalculator";
import { toast } from "sonner";

const digits = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "±"];
const operators = ["÷", "×", "−", "+"];
const sciButtons = ["sin", "cos", "tan", "log", "ln", "√", "π", "e", "x²"];

export default function CalculatorPage() {
  const calc = useCalculator();
  const [showSci, setShowSci] = useState(false);

  const handleDigit = (d: string) => {
    if (d === "±") return calc.toggleSign();
    if (d === ".") return calc.inputDecimal();
    calc.inputDigit(d);
  };

  const handleOperator = (op: string) => {
    const map: Record<string, string> = { "÷": "÷", "×": "×", "−": "-", "+": "+" };
    calc.inputOperator(map[op] || op);
  };

  const handleSci = (fn: string) => {
    const val = parseFloat(calc.display);
    let result: number | null = null;
    switch (fn) {
      case "sin": result = Math.sin(val * Math.PI / 180); break;
      case "cos": result = Math.cos(val * Math.PI / 180); break;
      case "tan": result = Math.tan(val * Math.PI / 180); break;
      case "log": result = Math.log10(val); break;
      case "ln": result = Math.log(val); break;
      case "√": result = Math.sqrt(val); break;
      case "π": result = Math.PI; break;
      case "e": result = Math.E; break;
      case "x²": result = val * val; break;
      default: return;
    }
    if (result !== null && isFinite(result)) {
      calc.setDisplay(parseFloat(result.toFixed(10)).toString());
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(calc.display);
    toast.success("Copied!");
  };

  const fmt = (val: string) => {
    if (val === "Error") return val;
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    if (val.endsWith(".") || (val.includes(".") && val.endsWith("0"))) return val;
    return num.toLocaleString("en-IN", { maximumFractionDigits: 10 });
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto">
      {/* Display Area */}
      <div className="flex-1 flex flex-col justify-end p-5 min-h-[200px]">
        <div className="text-right">
          {calc.expression && (
            <p className="text-sm text-muted-foreground font-mono mb-1 truncate">{calc.expression}</p>
          )}
          <p className="text-5xl font-bold font-mono text-foreground truncate leading-tight">{fmt(calc.display)}</p>
          {calc.preview && calc.preview !== calc.display && (
            <p className="text-lg text-muted-foreground font-mono mt-1">= {fmt(calc.preview)}</p>
          )}
        </div>
        <div className="flex justify-end mt-3">
          <button onClick={copyResult} className="p-2 rounded-xl bg-secondary btn-bounce">
            <Copy className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Scientific Toggle */}
      <button
        onClick={() => setShowSci(!showSci)}
        className="mx-5 mb-2 flex items-center justify-center gap-1 py-2 rounded-xl bg-card border border-border text-muted-foreground text-xs font-medium btn-bounce"
      >
        <ChevronUp className={`w-3 h-3 transition-transform ${showSci ? "rotate-180" : ""}`} />
        Scientific
      </button>

      {/* Scientific Panel */}
      {showSci && (
        <div className="px-5 pb-2">
          <div className="grid grid-cols-3 gap-2">
            {sciButtons.map((btn) => (
              <button
                key={btn}
                onClick={() => handleSci(btn)}
                className="py-3 rounded-xl bg-card border border-border text-foreground text-sm font-medium btn-bounce"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keypad */}
      <div className="px-4 pb-20 pt-2">
        <div className="flex gap-2.5">
          <div className="flex-1">
            {/* AC, %, ⌫ */}
            <div className="grid grid-cols-3 gap-2.5 mb-2.5">
              <button onClick={calc.clear} className="py-4 rounded-2xl bg-card border border-border text-destructive font-semibold text-lg btn-bounce">AC</button>
              <button onClick={calc.inputPercent} className="py-4 rounded-2xl bg-card border border-border text-secondary-foreground font-semibold text-lg btn-bounce">%</button>
              <button onClick={calc.backspace} className="py-4 rounded-2xl bg-card border border-border text-secondary-foreground font-semibold text-lg btn-bounce flex items-center justify-center">
                <Delete className="w-5 h-5" />
              </button>
            </div>
            {/* Digits */}
            <div className="grid grid-cols-3 gap-2.5">
              {digits.map((d) => (
                <button key={d} onClick={() => handleDigit(d)} className="py-4 rounded-2xl bg-calc-btn text-calc-btn-foreground font-semibold text-xl btn-bounce">
                  {d}
                </button>
              ))}
            </div>
          </div>
          {/* Operators */}
          <div className="flex flex-col gap-2.5 w-16">
            {operators.map((op) => (
              <button key={op} onClick={() => handleOperator(op)} className="flex-1 rounded-2xl bg-primary text-primary-foreground font-semibold text-xl btn-bounce shadow-md">
                {op}
              </button>
            ))}
            <button onClick={calc.calculate} className="flex-1 rounded-2xl bg-success text-success-foreground font-semibold text-xl btn-bounce shadow-md">
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
