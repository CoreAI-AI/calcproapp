import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

type Category = "length" | "weight" | "temperature" | "speed" | "time" | "data" | "area" | "volume";

interface UnitDef { label: string; toBase: (v: number) => number; fromBase: (v: number) => number; }

const unitData: Record<Category, { label: string; units: Record<string, UnitDef> }> = {
  length: {
    label: "Length",
    units: {
      m: { label: "Meter", toBase: v => v, fromBase: v => v },
      km: { label: "Kilometer", toBase: v => v * 1000, fromBase: v => v / 1000 },
      cm: { label: "Centimeter", toBase: v => v / 100, fromBase: v => v * 100 },
      mm: { label: "Millimeter", toBase: v => v / 1000, fromBase: v => v * 1000 },
      mi: { label: "Mile", toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
      ft: { label: "Foot", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      in: { label: "Inch", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      yd: { label: "Yard", toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    },
  },
  weight: {
    label: "Weight",
    units: {
      kg: { label: "Kilogram", toBase: v => v, fromBase: v => v },
      g: { label: "Gram", toBase: v => v / 1000, fromBase: v => v * 1000 },
      mg: { label: "Milligram", toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      lb: { label: "Pound", toBase: v => v * 0.4536, fromBase: v => v / 0.4536 },
      oz: { label: "Ounce", toBase: v => v * 0.02835, fromBase: v => v / 0.02835 },
      ton: { label: "Metric Ton", toBase: v => v * 1000, fromBase: v => v / 1000 },
    },
  },
  temperature: {
    label: "Temperature",
    units: {
      c: { label: "Celsius", toBase: v => v, fromBase: v => v },
      f: { label: "Fahrenheit", toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      k: { label: "Kelvin", toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    },
  },
  speed: {
    label: "Speed",
    units: {
      mps: { label: "m/s", toBase: v => v, fromBase: v => v },
      kmph: { label: "km/h", toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      mph: { label: "mph", toBase: v => v * 0.4470, fromBase: v => v / 0.4470 },
      knot: { label: "Knot", toBase: v => v * 0.5144, fromBase: v => v / 0.5144 },
    },
  },
  time: {
    label: "Time",
    units: {
      s: { label: "Second", toBase: v => v, fromBase: v => v },
      min: { label: "Minute", toBase: v => v * 60, fromBase: v => v / 60 },
      hr: { label: "Hour", toBase: v => v * 3600, fromBase: v => v / 3600 },
      day: { label: "Day", toBase: v => v * 86400, fromBase: v => v / 86400 },
      week: { label: "Week", toBase: v => v * 604800, fromBase: v => v / 604800 },
    },
  },
  data: {
    label: "Data",
    units: {
      b: { label: "Byte", toBase: v => v, fromBase: v => v },
      kb: { label: "KB", toBase: v => v * 1024, fromBase: v => v / 1024 },
      mb: { label: "MB", toBase: v => v * 1048576, fromBase: v => v / 1048576 },
      gb: { label: "GB", toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
      tb: { label: "TB", toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 },
    },
  },
  area: {
    label: "Area",
    units: {
      sqm: { label: "m²", toBase: v => v, fromBase: v => v },
      sqkm: { label: "km²", toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      sqft: { label: "ft²", toBase: v => v * 0.0929, fromBase: v => v / 0.0929 },
      acre: { label: "Acre", toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
      ha: { label: "Hectare", toBase: v => v * 10000, fromBase: v => v / 10000 },
    },
  },
  volume: {
    label: "Volume",
    units: {
      l: { label: "Liter", toBase: v => v, fromBase: v => v },
      ml: { label: "Milliliter", toBase: v => v / 1000, fromBase: v => v * 1000 },
      gal: { label: "US Gallon", toBase: v => v * 3.785, fromBase: v => v / 3.785 },
      cup: { label: "Cup", toBase: v => v * 0.2366, fromBase: v => v / 0.2366 },
      cbm: { label: "m³", toBase: v => v * 1000, fromBase: v => v / 1000 },
    },
  },
};

const categories: Category[] = ["length", "weight", "temperature", "speed", "time", "data", "area", "volume"];

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [value, setValue] = useState("1000");

  const data = unitData[category];
  const unitKeys = Object.keys(data.units);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    const keys = Object.keys(unitData[cat].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
    setValue("1");
  };

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  const result = useMemo(() => {
    const v = parseFloat(value) || 0;
    const base = data.units[fromUnit].toBase(v);
    const out = data.units[toUnit].fromBase(base);
    return parseFloat(out.toFixed(10)).toString();
  }, [value, fromUnit, toUnit, data]);

  return (
    <div className="max-w-lg mx-auto pb-24">
      <PageHeader title="Unit Converter" subtitle="8 categories, instant results" />

      <div className="px-5 space-y-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap btn-bounce transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {unitData[cat].label}
            </button>
          ))}
        </div>

        <motion.div key={category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* From */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="bg-secondary rounded-lg px-3 py-2 text-sm font-medium text-foreground w-full mb-3 outline-none"
            >
              {unitKeys.map(k => <option key={k} value={k}>{data.units[k].label}</option>)}
            </select>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
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
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="bg-secondary rounded-lg px-3 py-2 text-sm font-medium text-foreground w-full mb-3 outline-none"
            >
              {unitKeys.map(k => <option key={k} value={k}>{data.units[k].label}</option>)}
            </select>
            <p className="text-3xl font-bold font-mono text-primary">{result}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
