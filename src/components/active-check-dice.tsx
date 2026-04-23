import type { CSSProperties } from "react";
import { cn } from "~/lib/utils";

export const SNAKE_EYES_DICE_SVG = "/effects/dice/snake-eyes.svg";
export const BOX_CARS_DICE_SVG = "/effects/dice/box-cars.svg";

export const ACTIVE_CHECK_PAIR_SVG_URLS = [SNAKE_EYES_DICE_SVG, BOX_CARS_DICE_SVG] as const;

export function activeCheckPairAssetUrl(
  die1: number,
  die2: number,
): string | null {
  if (die1 === 1 && die2 === 1) return SNAKE_EYES_DICE_SVG;
  if (die1 === 6 && die2 === 6) return BOX_CARS_DICE_SVG;
  return null;
}

/** Index 0 = face value 1 */
const PIP_LAYOUT_BY_VALUE = [
  [[48, 48]],
  [[28, 28], [68, 68]],
  [[28, 28], [48, 48], [68, 68]],
  [[28, 28], [68, 28], [28, 68], [68, 68]],
  [[28, 28], [68, 28], [48, 48], [28, 68], [68, 68]],
  [[28, 24], [28, 48], [28, 72], [68, 24], [68, 48], [68, 72]],
] as const;

export function PipDie({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const v = value >= 1 && value <= 6 ? value : 1;
  const faceIndex = (v - 1) as 0 | 1 | 2 | 3 | 4 | 5;
  const pips = PIP_LAYOUT_BY_VALUE[faceIndex];
  return (
    <svg
      viewBox="0 0 96 96"
      className={cn("shrink-0", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Hollow faces like public/effects/check-failure-dice.svg so the check overlay shows through */}
      <rect
        x="2.5"
        y="2.5"
        width="91"
        height="91"
        rx="13.5"
        fill="none"
        stroke="white"
        strokeWidth="5"
      />
      {pips.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill="white" />
      ))}
    </svg>
  );
}

export function ActiveCheckDiceStrip({
  die1,
  die2,
  className,
  style,
}: {
  die1: number;
  die2: number;
  className?: string;
  style?: CSSProperties;
}) {
  const pairUrl = activeCheckPairAssetUrl(die1, die2);
  if (pairUrl) {
    return (
      <img
        src={pairUrl}
        className={cn("h-60 w-auto", className)}
        style={style}
        alt=""
      />
    );
  }
  return (
    <div
      className={cn(
        "flex h-60 items-center justify-center gap-5",
        className,
      )}
      style={style}
    >
      <PipDie value={die1} className="h-[11.5rem] w-[11.5rem]" />
      <PipDie value={die2} className="h-[11.5rem] w-[11.5rem]" />
    </div>
  );
}
