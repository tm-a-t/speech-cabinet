import { PipDie } from "~/components/active-check-dice";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { Message } from "~/lib/disco-data";
import { resolveActiveCheckDice } from "~/lib/disco-data";
import {
  ChevronDown,
  ChevronUp,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
} from "lucide-react";
import React from "react";

const dice = [
  <></>,
  <Dice1 key={1} className="inline h-4 w-4 -scale-x-100" />,
  <Dice2 key={2} className="inline h-4 w-4 -scale-x-100" />,
  <Dice3 key={3} className="inline h-4 w-4 -scale-x-100" />,
  <Dice4 key={4} className="inline h-4 w-4 -scale-x-100" />,
  <Dice5 key={5} className="inline h-4 w-4 -scale-x-100" />,
  <Dice6 key={6} className="inline h-4 w-4 -scale-x-100" />,
];

export function ActiveCheckDicePopover({
  check,
  saveCheck,
}: {
  check: NonNullable<Message["check"]>;
  saveCheck: (next: NonNullable<Message["check"]>) => void;
}) {
  const { die1, die2 } = resolveActiveCheckDice(check);

  function setDie(which: 1 | 2, value: number) {
    const modValue = value % 6 || 6;
    saveCheck({
      ...check,
      die1,
      die2,
      [which === 1 ? "die1" : "die2"]: modValue,
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-1 mr-2 pb-1 h-8 text-zinc-400 "
          aria-label="Edit dice roll"
        >
          <span>{dice[die1]}</span>
          <span>{dice[die2]}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-auto items-stretch gap-3 border-zinc-700 bg-zinc-900 py-2 px-8"
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DieStepper
          label="Left die"
          value={die1}
          onChange={(v) => setDie(1, v)}
        />
        <DieStepper
          label="Right die"
          value={die2}
          onChange={(v) => setDie(2, v)}
        />
      </PopoverContent>
    </Popover>
  );
}

function DieStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1" aria-label={label}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-white"
        onClick={() => onChange(value - 1)}
        aria-label={`Increase ${label}`}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <div className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded">
        <DiePreview value={value} />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-white"
        onClick={() => onChange(value + 1)}
        aria-label={`Decrease ${label}`}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}

function DiePreview({ value }: { value: number }) {
  return <PipDie value={value} className="h-full w-full" />;
}
