import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";

type Tool = "discount" | "gst" | "tip" | "split" | "percentage" | "profit";

const toolLabels: Record<Tool, string> = {
  discount: "Discount",
  gst: "GST",
  tip: "Tip",
  split: "Split Bill",
  percentage: "Percentage",
  profit: "Profit/Loss",
};

export default function QuickToolsPage() {
  const [active, setActive] = useState<Tool>("discount");

  return (
    <div className="max-w-lg mx-auto pb-24">
      <PageHeader title="Quick Tools" subtitle="Daily calculation shortcuts" />

      <div className="px-5">
        {/* Tool Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
          {(Object.keys(toolLabels) as Tool[]).map((id) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap btn-bounce transition-colors ${
                active === id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {toolLabels[id]}
            </button>
          ))}
        </div>

        {/* Active Tool */}
        <div className="mt-4">
          {active === "discount" && <DiscountCalc />}
          {active === "gst" && <GSTCalc />}
          {active === "tip" && <TipCalc />}
          {active === "split" && <SplitBillCalc />}
          {active === "percentage" && <PercentCalc />}
          {active === "profit" && <ProfitLossCalc />}
        </div>
      </div>
    </div>
  );
}

/* ── Shared UI ── */
function Field({ label, value, onChange, prefix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string }) {
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

function Result({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-primary/10 rounded-xl p-4 mt-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold font-mono text-primary">{value}</p>
      {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

/* ── Tools ── */
function DiscountCalc() {
  const [price, setPrice] = useState("");
  const [disc, setDisc] = useState("");
  const p = parseFloat(price) || 0;
  const d = parseFloat(disc) || 0;
  const saved = p * d / 100;
  return (
    <div className="space-y-3">
      <Field label="Original Price" value={price} onChange={setPrice} prefix="₹" />
      <Field label="Discount %" value={disc} onChange={setDisc} />
      <Result label="You Pay" value={`₹${(p - saved).toFixed(2)}`} sub={`You save ₹${saved.toFixed(2)}`} />
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
      <Field label="Amount" value={amount} onChange={setAmount} prefix="₹" />
      <Field label="GST Rate %" value={rate} onChange={setRate} />
      <Result label="Total with GST" value={`₹${(a + gst).toFixed(2)}`} sub={`GST: ₹${gst.toFixed(2)}`} />
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
      <Field label="Bill Amount" value={bill} onChange={setBill} prefix="₹" />
      <Field label="Tip %" value={tip} onChange={setTip} />
      <Result label="Total with Tip" value={`₹${(b + tipAmt).toFixed(2)}`} sub={`Tip: ₹${tipAmt.toFixed(2)}`} />
    </div>
  );
}

function SplitBillCalc() {
  const [bill, setBill] = useState("");
  const [people, setPeople] = useState("2");
  const b = parseFloat(bill) || 0;
  const p = parseInt(people) || 1;
  return (
    <div className="space-y-3">
      <Field label="Total Bill" value={bill} onChange={setBill} prefix="₹" />
      <Field label="Number of People" value={people} onChange={setPeople} />
      <Result label="Each Person Pays" value={`₹${(b / p).toFixed(2)}`} />
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
      <Field label="Number" value={num} onChange={setNum} />
      <Field label="Percentage %" value={pct} onChange={setPct} />
      <Result label="Result" value={(n * p / 100).toFixed(2)} />
    </div>
  );
}

function ProfitLossCalc() {
  const [cost, setCost] = useState("");
  const [sell, setSell] = useState("");
  const c = parseFloat(cost) || 0;
  const s = parseFloat(sell) || 0;
  const diff = s - c;
  const pct = c > 0 ? (diff / c * 100).toFixed(2) : "0";
  return (
    <div className="space-y-3">
      <Field label="Cost Price" value={cost} onChange={setCost} prefix="₹" />
      <Field label="Selling Price" value={sell} onChange={setSell} prefix="₹" />
      <Result label={diff >= 0 ? "Profit" : "Loss"} value={`₹${Math.abs(diff).toFixed(2)} (${pct}%)`} />
    </div>
  );
}
