import React, { useState, useEffect } from 'react';
import { FESTIVAL_DATES, NAVRATRI_DATES } from '../data/events';

interface EventDateSelectorProps {
  value: string;
  onChange: (dateStr: string) => void;
  name?: string;
  required?: boolean;
}

export default function EventDateSelector({
  value,
  onChange,
  name = 'date',
  required = true,
}: EventDateSelectorProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>(['12 OCT']);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customText, setCustomText] = useState('');

  const getDayNum = (dStr: string) => parseInt(dStr.replace(/\D/g, ''), 10) || 7;

  // Format array of selected dates into standard string
  const formatDates = (dates: string[]) => {
    if (dates.length === 0) return '';
    if (dates.length === 1) return `${dates[0]} 2026`;

    // Sort by day number
    const sorted = [...dates].sort((a, b) => getDayNum(a) - getDayNum(b));
    const dayNums = sorted.map(getDayNum);

    // Check if contiguous consecutive range
    let isContiguous = true;
    for (let i = 1; i < dayNums.length; i++) {
      if (dayNums[i] !== dayNums[i - 1] + 1) {
        isContiguous = false;
        break;
      }
    }

    if (isContiguous) {
      return `${sorted[0]} - ${sorted[sorted.length - 1]} 2026`;
    }

    return sorted.join(', ') + ' 2026';
  };

  // Parse incoming value on mount
  useEffect(() => {
    if (!value) return;
    const clean = value.trim();

    // Check if it's a range like "7 OCT - 15 OCT 2026" or "7th Oct to 15th Oct"
    if (clean.includes('-') || clean.includes('–') || clean.includes('—') || clean.toLowerCase().includes(' to ')) {
      const parts = clean.split(/[-–—]|(?:\s+to\s+)/i).map((s) => s.trim());
      const m1 = parts[0]?.match(/\d{1,2}/);
      const m2 = parts[1]?.match(/\d{1,2}/);
      if (m1 && m2) {
        const start = parseInt(m1[0], 10);
        const end = parseInt(m2[0], 10);
        const matched: string[] = [];
        for (let d = Math.min(start, end); d <= Math.max(start, end); d++) {
          const dStr = `${d} OCT`;
          if (NAVRATRI_DATES.includes(dStr)) matched.push(dStr);
        }
        if (matched.length > 0) {
          setSelectedDates(matched);
          return;
        }
      }
    }

    // Check if comma-separated list
    if (clean.includes(',')) {
      const parts = clean.split(',').map((s) => s.trim());
      const matched: string[] = [];
      parts.forEach((p) => {
        const m = p.match(/\d{1,2}/);
        if (m) {
          const dStr = `${parseInt(m[0], 10)} OCT`;
          if (NAVRATRI_DATES.includes(dStr)) matched.push(dStr);
        }
      });
      if (matched.length > 0) {
        setSelectedDates(matched);
        return;
      }
    }

    // Check single date
    const singleMatch = clean.match(/\d{1,2}/);
    if (singleMatch && (clean.toUpperCase().includes('OCT') || clean.includes('10'))) {
      const dStr = `${parseInt(singleMatch[0], 10)} OCT`;
      if (NAVRATRI_DATES.includes(dStr)) {
        setSelectedDates([dStr]);
        return;
      }
    }

    // If completely custom text outside 7-21 Oct
    if (clean) {
      setCustomText(clean);
      setShowCustomInput(true);
    }
  }, []);

  const toggleDate = (dateVal: string) => {
    let updated: string[];
    if (selectedDates.includes(dateVal)) {
      // Don't allow unselecting the last date if required
      if (selectedDates.length === 1 && required) {
        return;
      }
      updated = selectedDates.filter((d) => d !== dateVal);
    } else {
      updated = [...selectedDates, dateVal].sort((a, b) => getDayNum(a) - getDayNum(b));
    }
    setSelectedDates(updated);
    setShowCustomInput(false);
    onChange(formatDates(updated));
  };

  const selectNavratriDays = () => {
    const navratri = FESTIVAL_DATES.filter((f) => f.dayNumber <= 15).map((f) => f.value);
    setSelectedDates(navratri);
    setShowCustomInput(false);
    onChange(formatDates(navratri));
  };

  const selectAllDays = () => {
    const all = FESTIVAL_DATES.map((f) => f.value);
    setSelectedDates(all);
    setShowCustomInput(false);
    onChange(formatDates(all));
  };

  const clearSelection = () => {
    setSelectedDates(['7 OCT']);
    setShowCustomInput(false);
    onChange('7 OCT 2026');
  };

  // Build current display summary text
  const sortedSelected = [...selectedDates].sort((a, b) => getDayNum(a) - getDayNum(b));
  const count = sortedSelected.length;

  let summaryText = '';
  if (showCustomInput && customText) {
    summaryText = customText;
  } else if (count === 1) {
    summaryText = `${sortedSelected[0]} 2026 (1 Night)`;
  } else if (count > 1) {
    const dayNums = sortedSelected.map(getDayNum);
    let isContiguous = true;
    for (let i = 1; i < dayNums.length; i++) {
      if (dayNums[i] !== dayNums[i - 1] + 1) {
        isContiguous = false;
        break;
      }
    }
    if (isContiguous) {
      summaryText = `${sortedSelected[0]} – ${sortedSelected[count - 1]} 2026 (${count} Nights)`;
    } else {
      summaryText = `${sortedSelected.join(', ')} 2026 (${count} Nights)`;
    }
  }

  return (
    <div className="space-y-3">
      {/* Hidden input to ensure standard FormData submission */}
      <input
        type="hidden"
        name={name}
        value={showCustomInput && customText ? customText : formatDates(selectedDates)}
        required={required}
      />

      <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/70 space-y-3">
        {/* Quick action bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            Select Festival Nights (7th Oct – 21st Oct 2026)
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={selectNavratriDays}
              className="text-[11px] font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition-all"
            >
              All 9 Navratri Days (7–15 Oct)
            </button>
            <button
              type="button"
              onClick={selectAllDays}
              className="text-[11px] font-semibold text-stone-700 bg-stone-200/70 hover:bg-stone-300 px-2 py-0.5 rounded transition-all"
            >
              Select All (7–21 Oct)
            </button>
            {count > 1 && (
              <button
                type="button"
                onClick={clearSelection}
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 px-1.5 py-0.5"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* 15 Days Multi-Select Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {FESTIVAL_DATES.map((f) => {
            const isSelected = !showCustomInput && selectedDates.includes(f.value);
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => toggleDate(f.value)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#C1440E] text-white border-[#C1440E] shadow-sm ring-2 ring-[#C1440E]/20'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-1 right-1.5 text-[9px] font-bold text-white/90">✓</span>
                )}
                <div className="text-xs font-bold leading-tight">{f.value}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/90 font-medium' : 'text-stone-500'}`}>
                  Day {f.dayNumber - 6}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom date toggle / input */}
        <div className="pt-1">
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="text-[11px] text-stone-500 hover:text-stone-800 underline"
            >
              + Need custom date outside 7th–21st Oct?
            </button>
          ) : (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">Custom Event Date</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomInput(false);
                    onChange(formatDates(selectedDates));
                  }}
                  className="text-[11px] text-[#C1440E] font-semibold"
                >
                  ← Back to 7–21 Oct grid
                </button>
              </div>
              <input
                type="text"
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  onChange(e.target.value);
                }}
                placeholder="e.g. 25th October 2026 or Every Weekend"
                className="w-full text-xs font-semibold p-2 bg-white border border-stone-300 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Selected Dates Summary Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-lg bg-amber-100/70 border border-amber-300/80 text-stone-900">
          <span className="text-xs font-semibold text-stone-700">
            {count === 1 ? 'Selected Date:' : 'Selected Dates:'}
          </span>
          <span className="text-xs font-bold text-[#C1440E] text-right">
            {summaryText || 'Select at least 1 date'}
          </span>
        </div>
      </div>
    </div>
  );
}
