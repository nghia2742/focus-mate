import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  className,
  ...props
}: NumberInputProps) {
  const [localValue, setLocalValue] = React.useState(value.toString());

  React.useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    } else {
      onChange(min);
    }
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (newValue <= max) {
      onChange(newValue);
    } else {
      onChange(max);
    }
  };

  const handleBlur = () => {
    let parsed = parseInt(localValue);
    if (isNaN(parsed)) {
      parsed = min;
    } else if (parsed < min) {
      parsed = min;
    } else if (parsed > max) {
      parsed = max;
    }
    setLocalValue(parsed.toString());
    onChange(parsed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  return (
    <div className={cn("flex items-center rounded-md border border-input shadow-xs transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50", className)}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="flex h-full min-h-9 w-10 shrink-0 items-center justify-center rounded-l-md border-r border-input bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="flex h-full min-h-9 w-full min-w-0 bg-transparent px-3 py-1 text-center text-base outline-none selection:bg-primary selection:text-primary-foreground md:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...props}
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="flex h-full min-h-9 w-10 shrink-0 items-center justify-center rounded-r-md border-l border-input bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
