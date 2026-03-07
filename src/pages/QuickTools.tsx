import { useState } from "react";
import { motion } from "framer-motion";
import { Percent, Receipt, UtensilsCrossed, Users, TrendingUp, Calculator } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

type Tool = "discount" | "gst" | "tip" | "split" | "percentage" | "profit";

const tools: { id: Tool; label: string; icon: typeof Calculator }[] = [
  { id: "discount", label: "Discount", icon: Percent },
  { id: "gst", label: "GST", icon: Receipt },
  { id: "tip", label: "Tip", icon: UtensilsCrossed },
  { id: "split", label: "Split Bill", icon: Users },
  { id: "percentage", label: "Percentage", icon: TrendingUp },
  { id: "profit", label: "Profit/Loss", icon: Calculator },
];

function InputField({ label, value, onChange, prefix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      <div className="flex items-center bg-secondary rounded-xl px-4 py-3">
        {prefix && <span className="text-muted-foreground mr-1 font-medium">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent w-full outline-none text-foreground font-mono text-lg"
          placeholder="0"
        />
      </div>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-primary/10 rounded-xl p-4 mt-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold font-mono text-primary">{value}</p>
    </div>
  );
}

function DiscountCalc() {
  const [price, setPrice] = useState("");
  const [disc, setDisc] = useState("");
  const p = parseFloat(price) || 0;
  const d = parseFloat(disc) || 0;
  const saved = p * d / 100;
  return (
    <div className="space-y-3">
      <InputField label="Original Price" value={price} onChange={setPrice} prefix="₹" />
      <InputField label="Discount %" value={disc} onChange={setDisc} />
      <ResultCard label="You Pay" value={`₹${(p - saved).toFixed(2)}`} />
      <p className="text-sm text-muted-foreground text-center">You save ₹{saved.toFixed(2)}</p>
    </div>
  );
}

function GSTCalc() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18");
  const a = parseFloat(amount) || 0;
  const r = parseFloat(rate) || 0;
  const gst = a * r / 100;
  return (
    <div className="space-y-3">
      <InputField label="Amount" value={amount} onChange={setAmount} prefix="₹" />
      <InputField label="GST Rate %" value={rate} onChange={setRate} />
      <ResultCard label="Total with GST" value={`₹${(a + gst).toFixed(2)}`} />
      <p className="text-sm text-muted-foreground text-center">GST: ₹{gst.toFixed(2)}</p>
    </div>
  );
}

function TipCalc() {
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState("15");
  const b = parseFloat(bill) || 0;
  const t = parseFloat(tip) || 0;
  const tipAmt = b * t / 100;
  return (
    <div className="space-y-3">
      <InputField label="Bill Amount" value={bill} onChange={setBill} prefix="₹" />
      <InputField label="Tip %" value={tip} onChange={setTip} />
      <ResultCard label="Total with Tip" value={`₹${(b + tipAmt).toFixed(2)}`} />
      <p className="text-sm text-muted-foreground text-center">Tip: ₹{tipAmt.toFixed(2)}</p>
    </div>
  );
}

function SplitBill() {
  const [bill, setBill] = useState("");
  const [people, setPeople] = useState("2");
  const b = parseFloat(bill) || 0;
  const p = parseInt(people) || 1;
  return (
    <div className="space-y-3">
      <InputField label="Total Bill" value={bill} onChange={setBill} prefix="₹" />
      <InputField label="Number of People" value={people} onChange={setPeople} />
      <ResultCard label="Each Person Pays" value={`₹${(b / p).toFixed(2)}`} />
    </div>
  );
}

function PercentCalc() {
  const [num, setNum] = useState("");
  const [pct, setPct] = useState("");
  const n = parseFloat(num) || 0;
  const p = parseFloat(pct) || 0;
  return (
    <div className="space-y-3">
      <InputField label="Number" value={num} onChange={setNum} />
      <InputField label="Percentage %" value={pct} onChange={setPct} />
      <ResultCard label="Result" value={`${(n * p / 100).toFixed(2)}`} />
    </div>
  );
}

function ProfitLoss() {
  const [cost, setCost] = useState("");
  const [sell, setSell] = useState("");
  const c = parseFloat(cost) || 0;
  const s = parseFloat(sell) || 0;
  const diff = s - c;
  const pct = c > 0 ? (diff / c * 100).toFixed(2) : "0";
  return (
    <div className="space-y-3">
      <InputField label="Cost Price" value={cost} onChange={setCost} prefix="₹" />
      <InputField label="Selling Price" value={sell} onChange={setSell} prefix="₹" />
      <ResultCard
        label={diff >= 0 ? "Profit" : "Loss"}
        value={`₹${Math.abs(diff).toFixed(2)} (${pct}%)`}
      />
    </div>
  );
}

const toolComponents: Record<Tool, () => JSX.Element> = {
  discount: DiscountCalc,
  gst: GSTCalc,
  tip: TipCalc,
  split: SplitBill,
  percentage: PercentCalc,
  profit: ProfitLoss,
};

export default function QuickToolsPage() {
  const [active, setActive] = useState<Tool>("discount");
  const ActiveTool = toolComponents[active];

  return (
    <div className="max-w-lg mx-auto pb-24">
      <PageHeader title="Quick Tools" subtitle="Daily calculation shortcuts" />
      
      <div className="px-5">
        <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActive(tool.id)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap btn-bounce transition-colors ${
                active === tool.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <tool.icon className="w-3.5 h-3.5" />
              {tool.label}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <ActiveTool />
        </motion.div>
      </div>
    </div>
  );
}
