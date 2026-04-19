"use client";

import { PipDie } from "~/components/active-check-dice";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { Message } from "~/lib/disco-data";
import { resolveActiveCheckDice } from "~/lib/disco-data";
import { ChevronDown, ChevronUp, Dices } from "lucide-react";
import React from "react";

export function ActiveCheckDicePopover({
  check,
  saveCheck,
  open,
  onOpenChange,
}: {
  check: NonNullable<Message["check"]>;
  saveCheck: (next: NonNullable<Message["check"]>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { die1, die2 } = resolveActiveCheckDice(check);

  function setDie(which: 1 | 2, value: number) {
    const clamped = Math.min(6, Math.max(1, value));
    saveCheck({
      ...check,
      [which === 1 ? "die1" : "die2"]: clamped,
    });
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-1 h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          aria-label="Edit dice roll"
        >
          <Dices className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-auto items-stretch gap-3 border-zinc-700 bg-zinc-900 p-3"
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
        variant="outline"
        size="icon"
        className="h-7 w-7 border-zinc-600 bg-zinc-800 text-white"
        onClick={() => onChange(value + 1)}
        disabled={value >= 6}
        aria-label={`Increase ${label}`}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <div className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded border border-white/40 bg-black/40 p-1">
        <DiePreview value={value} />
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-7 w-7 border-zinc-600 bg-zinc-800 text-white"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
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
