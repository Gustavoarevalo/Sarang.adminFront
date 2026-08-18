import { formatGeneral, formatNumeral, unformatNumeral, formatTime, TimePatternType } from "cleave-zen";

export const parseToNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '').trim();
    return parseFloat(cleaned);
  }
  return 0;
};
export const ConvertirDecimal_a_Moneda = (value: string) => {
  return formatNumeral(value);
};

export const UnFormatCash_o_decimal = (value: string) => {
  return unformatNumeral(value);
};

export const UnFormatNumber = (value: string, block: number[]): string => {
  return formatGeneral(value, {
    blocks: block,
    numericOnly: true
  })
};

export const TimeFormatInput = (timeInput: string, time: TimePatternType = ['h', 'm']) => {
  return formatTime(timeInput, {
    timePattern: time,
  })
}


export const CompleteTimeFormatInput = (timeInput: string, time: TimePatternType = ['h', 'm', 's']) => {
  const parts = timeInput.split(':');
  const normalized: string[] = [];
  for (let i = 0; i < time.length; i++) {
    const value = parts[i] ?? "0";
    const padded = value.padStart(2, "0");
    normalized.push(padded);
  }
  const finalTime = normalized.join(':');
  return finalTime;
};
