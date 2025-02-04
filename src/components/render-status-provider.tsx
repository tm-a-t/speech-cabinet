'use client';

import React, {createContext, type ReactNode, useEffect, useState} from 'react';
import {getVideoProgress, getVideoQueuePosition} from '~/server/server-actions';
import {downloadFile, formatTime} from '~/lib/utils';
import {Progress} from '~/components/ui/progress';
import {Button} from './ui/button';
import {X} from 'lucide-react';

type RenderNotStarted = { state: 'not-started' }
type RenderInQueue = { state: 'in-queue', videoId: string, isGif: boolean, position: number, maxPosition: number }
type RenderInProgress = { state: 'in-progress', videoId: string, isGif: boolean, progress: number }
type RenderFinished = { state: 'finished', videoId: string, isGif: boolean }
export type RenderStatus = RenderNotStarted | RenderInQueue | RenderInProgress | RenderFinished

export const RenderStatusContext = createContext<[RenderStatus, (status: RenderStatus) => void]>(
  [{state: 'not-started'}, () => {}],
);

export const minDisplayedProgress = 2;  // Just so the progressbar looks nice in the beginning

function getPercentage(status: RenderStatus): number {
  if (status.state === 'in-queue') {
    return 100 * (1 - status.position / status.maxPosition);
  }

  if (status.state === 'in-progress') {
    return status.progress;
  }
  return 0;
}

function getPath(status: RenderFinished): string {
  const path = status.isGif ? 'gif' : 'video'
  return `/api/${path}/${status.videoId}`
}

function getName(status: RenderFinished): string {
  const extension = status.isGif ? 'gif' : 'mp4'
  return `Disco ${formatTime()}.${extension}`
}

export function RenderStatusProvider({children}: { children: ReactNode }) {
  const [status, setStatus] = useState<RenderStatus>({state: 'not-started'});
  const displayedProgress = Math.max(getPercentage(status), minDisplayedProgress)

  useEffect(() => {
    if (status.state === 'not-started') {
      return;
    }
    else if (status.state === 'finished') {
      void downloadFile(getPath(status), getName(status));
      return
    }

    const fetchFunction =
      status.state === 'in-queue'
        ? async () => {
          // State is in-queue
          const position = await getVideoQueuePosition(status.videoId);
          const maxPosition = Math.max(position, status.maxPosition);
          setStatus({state: 'in-queue', videoId: status.videoId, isGif: status.isGif, position, maxPosition});
          if (position === 0) {
            clearInterval(timer);
            setStatus({state: 'in-queue', videoId: status.videoId, isGif: status.isGif, position: 0, maxPosition});
            setTimeout(() => {
              setStatus({state: 'in-progress', videoId: status.videoId, isGif: status.isGif, progress: minDisplayedProgress});
            }, 200);
          }
        }
        : async () => {
          // State is in-progress
          const progress = await getVideoProgress(status.videoId);
          if (progress !== 'finished') {
            setStatus({state: 'in-progress', videoId: status.videoId, isGif: status.isGif, progress});
          } else {
            clearInterval(timer);
            setStatus({state: 'finished', videoId: status.videoId, isGif: status.isGif});
          }
        };

    const timer = setInterval(() => {
      void fetchFunction();
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  return (
    <RenderStatusContext.Provider value={[status, setStatus]}>
      {children}

      {status.state !== 'not-started' &&
        <div className="fixed bottom-4 left-2 right-2 p-4 max-w-96 sm:left-4 rounded-xl bg-zinc-950 border transition leading-6">
          <div>
            {status.state === 'in-queue' &&
              <>
                Please wait.
                {status.position === 1
                  ? <> There is 1 dialogue </>
                  : <> There are {status.position} dialogues </>}
                in the queue before yours.
              </>
            }
            {status.state === 'in-progress' &&
              (status.isGif && status.progress === 100
                ? <>Converting to GIF...</>
                : <>Rendering...</>
              )
            }
            {status.state === 'finished' &&
              <>
                Download started! You can also use <a className="underline underline-offset-4" href={getPath(status)} target="_blank">the temporary link.</a>
              </>
            }
          </div>

          {(status.state === 'in-queue' || status.state === 'in-progress') &&
            <Progress value={displayedProgress} className="mt-3"/>
          }

          {status.state === 'finished' &&
            <Button size="icon" variant="ghost" onClick={() => setStatus({state: 'not-started'})}
                    className="absolute right-1 top-1">
              <X className="h-4 w-4"/>
            </Button>
          }
        </div>
      }
    </RenderStatusContext.Provider>
  );
}
