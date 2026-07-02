import { useRef } from "react";


// ─── OTP Input ────────────────────────────────────────────────────────────────
export default function OtpInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const next = Array(6).fill("");
      pasted.split("").forEach((c, i) => { next[i] = c; });
      onChange(next);
      const focusIdx = Math.min(pasted.length, 5);
      refs.current[focusIdx]?.focus();
      e.preventDefault();
    }
  };

  return (
    <div className="flex gap-2 justify-between" onPaste={handlePaste}>
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={[
            "w-10 h-12 text-center text-lg font-semibold border rounded-xl bg-gray-50 text-gray-900 outline-none transition",
            digit
              ? "border-blue-500 ring-2 ring-blue-500/10"
              : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10",
          ].join(" ")}
        />
      ))}
    </div>
  );
}