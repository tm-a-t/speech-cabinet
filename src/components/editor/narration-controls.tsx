"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, Trash2, Upload, Volume2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { DiscoData, Message, Narration } from "~/lib/disco-data";
import {
  createNarrationFromBlob,
  formatBytes,
  formatDuration,
  getSupportedRecordingMimeType,
  getTotalNarrationSizeBytes,
  narrationSoftLimitBytes,
} from "~/lib/audio";
import { useToast } from "~/lib/hooks/use-toast";
import { cn } from "~/lib/utils";

export function NarrationControls({
  message,
  saveMessage,
  data,
  popoverOpen,
  onPopoverOpenChange,
  entryActive,
  sessionKey,
  onExitAudioEntry,
}: {
  message: Message;
  saveMessage: (message: Message) => void;
  data: DiscoData;
  popoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  entryActive: boolean;
  sessionKey: number;
  onExitAudioEntry: () => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });

  const narration = message.narration;
  const totalNarrationBytes = getTotalNarrationSizeBytes(data);
  const showVisibleTrigger = [narration != null, isRecording, entryActive].some(Boolean);
  /** Speaker = clip attached; mic (muted) = draft / no clip yet; mic + pulse = recording */
  const TriggerIcon = isRecording ? Mic : narration ? Volume2 : Mic;
  const triggerLabel = isRecording
    ? "Recording narration"
    : narration
      ? "Edit narration"
      : "Add narration";

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }, []);

  const stopPreview = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current?.remove();
    audioRef.current = null;
    setIsPlaying(false);
  }, []);

  const handleDragPointerMove = useCallback((event: PointerEvent) => {
    const dragStart = dragStartRef.current;
    if (!dragStart) return;
    setPanelOffset({
      x: dragStart.originX + event.clientX - dragStart.pointerX,
      y: dragStart.originY + event.clientY - dragStart.pointerY,
    });
  }, []);

  const stopDragging = useCallback(() => {
    dragStartRef.current = null;
    window.removeEventListener("pointermove", handleDragPointerMove);
  }, [handleDragPointerMove]);

  useEffect(() => {
    return () => {
      stopPreview();
      stopStream();
      stopDragging();
    };
  }, [stopDragging, stopPreview, stopStream]);

  const discardRecordingSession = useCallback(() => {
    const rec = recorderRef.current;
    if (rec) {
      rec.ondataavailable = null;
      rec.onstop = null;
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
      recorderRef.current = null;
    }
    setIsRecording(false);
    chunksRef.current = [];
    stopStream();
  }, [stopStream]);

  useEffect(() => {
    discardRecordingSession();
    stopPreview();
    setIsBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [sessionKey, discardRecordingSession, stopPreview]);

  async function saveNarration(narration: Narration) {
    const previousSize = message.narration?.sizeBytes ?? 0;
    const nextTotalBytes =
      totalNarrationBytes - previousSize + (narration.sizeBytes ?? 0);

    saveMessage({ ...message, narration });

    onExitAudioEntry();

    if (nextTotalBytes >= narrationSoftLimitBytes) {
      toast({
        title: "Audio project is getting large",
        description: `Embedded narration is now about ${formatBytes(nextTotalBytes)}. Large .disco files may fail to autosave or render.`,
      });
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      setIsBusy(true);
      await saveNarration(await createNarrationFromBlob(file, { name: file.name }));
    } catch (error) {
      toast({
        title: "Couldn't attach narration",
        description: error instanceof Error ? error.message : "The file could not be read as audio.",
      });
    } finally {
      setIsBusy(false);
    }
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      toast({
        title: "Recording isn't available",
        description: "This browser does not support live audio recording.",
      });
      return;
    }

    const mimeType = getSupportedRecordingMimeType();
    if (!mimeType) {
      toast({
        title: "Recording isn't available",
        description: "This browser does not support a renderable audio recording format.",
      });
      return;
    }

    try {
      chunksRef.current = [];
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorderRef.current = new MediaRecorder(streamRef.current, { mimeType });
      recorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorderRef.current.onstop = () => {
        void handleRecordingStop(mimeType);
      };
      recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Couldn't start recording",
        description: error instanceof Error ? error.message : "Microphone access was denied.",
      });
      stopStream();
    }
  }

  async function handleRecordingStop(mimeType: string) {
    try {
      setIsBusy(true);
      const blob = new Blob(chunksRef.current, { type: mimeType });
      await saveNarration(await createNarrationFromBlob(blob, { name: "Recorded narration" }));
    } catch (error) {
      toast({
        title: "Couldn't save recording",
        description: error instanceof Error ? error.message : "The recording could not be saved.",
      });
    } finally {
      setIsBusy(false);
      chunksRef.current = [];
      stopStream();
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setIsRecording(false);
  }

  function togglePreview() {
    if (!narration) return;
    if (isPlaying) {
      stopPreview();
      return;
    }

    const audio = new Audio(narration.src);
    audio.onended = stopPreview;
    audio.onerror = () => {
      stopPreview();
      toast({ title: "Couldn't play narration" });
    };
    audioRef.current = audio;
    setIsPlaying(true);
    void audio.play();
  }

  function removeNarration() {
    discardRecordingSession();
    stopPreview();
    saveMessage({ ...message, narration: undefined });
    onExitAudioEntry();
    onPopoverOpenChange(false);
  }

  function handleDragPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      originX: panelOffset.x,
      originY: panelOffset.y,
    };
    window.addEventListener("pointermove", handleDragPointerMove);
    window.addEventListener("pointerup", stopDragging, { once: true });
  }

  return (
    <Popover modal={false} open={popoverOpen} onOpenChange={onPopoverOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "ml-1 inline-flex h-8 items-center rounded px-1 transition hover:bg-zinc-800 hover:text-white",
            showVisibleTrigger
              ? isRecording
                ? "animate-pulse text-red-400"
                : narration
                  ? "text-zinc-200"
                  : "text-zinc-500 opacity-80 hover:opacity-100 hover:text-zinc-300"
              : "sr-only h-px w-px shrink-0 overflow-hidden border-0 p-0 opacity-0",
          )}
          aria-label={triggerLabel}
          title={showVisibleTrigger ? triggerLabel : undefined}
          aria-hidden={!showVisibleTrigger}
          tabIndex={showVisibleTrigger ? 0 : -1}
          data-testid="narration-trigger"
          data-state={
            isRecording ? "recording" : narration ? "attached" : entryActive ? "draft" : "empty"
          }
        >
          {showVisibleTrigger ? <TriggerIcon className="h-4 w-4" /> : <span aria-hidden />}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        data-testid="narration-popover-content"
        className="w-96 space-y-3 font-sans text-sm"
        style={{ transform: `translate(${panelOffset.x}px, ${panelOffset.y}px)` }}
      >
        <div
          className="-mx-1 -mt-1 cursor-move rounded px-1 py-1"
          onPointerDown={handleDragPointerDown}
          title="Drag to move"
          data-testid="narration-drag-handle"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="font-medium">Narration</div>
            {isRecording && (
              <div
                className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-500"
                data-testid="narration-recording-badge"
              >
                <Mic className="h-3 w-3" />
                Recording
              </div>
            )}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Optional audio for this line. When present, the line lasts as long as the clip.
          </div>
        </div>

        {narration ? (
          <div className="rounded border border-zinc-200 p-2 text-xs dark:border-zinc-800">
            <div className="truncate font-medium">{narration.name ?? "Audio clip"}</div>
            <div className="text-zinc-500 dark:text-zinc-400">
              {formatDuration(narration.durationMs)}
              {narration.sizeBytes ? ` · ${formatBytes(narration.sizeBytes)}` : ""}
            </div>
          </div>
        ) : (
          <div className="rounded border border-dashed border-zinc-300 p-2 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No narration attached.
          </div>
        )}

        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          data-testid="narration-file-input"
        />

        <div className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isBusy || isRecording}
            onClick={() => fileInputRef.current?.click()}
            className="px-3"
          >
            <Upload className="mr-1 h-3 w-3" />
            Upload
          </Button>
          <Button
            type="button"
            variant={isRecording ? "destructive" : "secondary"}
            size="sm"
            disabled={isBusy}
            onClick={isRecording ? stopRecording : startRecording}
            className="px-3"
            data-testid="narration-record-toggle"
          >
            {isRecording ? <Square className="mr-1 h-3 w-3" /> : <Mic className="mr-1 h-3 w-3" />}
            {isRecording ? "Stop" : "Record"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!narration || isBusy || isRecording}
            onClick={togglePreview}
            className="px-3"
          >
            {isPlaying ? "Stop" : "Preview"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={(!narration && !isRecording && !entryActive) || isBusy}
            onClick={removeNarration}
            aria-label="Remove audio"
            className="h-8 w-8 p-0"
            data-testid="remove-narration"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Total embedded audio: {formatBytes(totalNarrationBytes)}.
        </div>
      </PopoverContent>
    </Popover>
  );
}
