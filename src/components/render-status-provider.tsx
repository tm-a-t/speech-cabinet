'use client';

import React, {createContext, type ReactNode, useEffect, useState} from 'react';
import {getVideoProgress, getVideoQueuePosition} from '~/server/server-actions';
import {downloadFile, formatTime} from '~/lib/utils';
import {Progress} from '~/components/ui/progress';
import {Button} from './ui/button';
import {X} from 'lucide-react';

type RenderNotStarted = { state: 'not-started' }
type RenderInQueue = { state: 'in-queue', videoId: string, position: number, maxPosition: number }
type RenderInProgress = { state: 'in-progress', videoId: string, progress: number }
type RenderFinished = { state: 'finished', videoId: string }
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

export function RenderStatusProvider({children}: { children: ReactNode }) {
  const [status, setStatus] = useState<RenderStatus>({state: 'not-started'});
  const displayedProgress = Math.max(getPercentage(status), minDisplayedProgress)

  useEffect(() => {
    if (status.state === 'not-started' || status.state === 'finished') return;

    const fetchFunction =
      status.state === 'in-queue'
        ? async () => {
          // State is in-queue
          const position = await getVideoQueuePosition(status.videoId);
          const maxPosition = Math.max(position, status.maxPosition);
          setStatus({state: 'in-queue', videoId: status.videoId, position, maxPosition});
          if (position === 0) {
            clearInterval(timer);
            setStatus({state: 'in-queue', videoId: status.videoId, position: 0, maxPosition});
            setTimeout(() => {
              setStatus({state: 'in-progress', videoId: status.videoId, progress: minDisplayedProgress});
            }, 200);
          }
        }
        : async () => {
          // State is in-progress
          const progress = await getVideoProgress(status.videoId);
          setStatus({state: 'in-progress', videoId: status.videoId, progress});
          if (progress >= 100) {
            clearInterval(timer);
            setStatus({state: 'finished', videoId: status.videoId});
            void downloadFile('/api/video/' + status.videoId, `Disco ${formatTime()}.mp4`);
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
                  ? <> There is 1 video </>
                  : <> There are {status.position} videos </>}
                in the queue before yours.
              </>
            }
            {status.state === 'in-progress' &&
              <>Rendering...</>
            }
            {status.state === 'finished' &&
              <>
                Download started! You can also use <a className="underline underline-offset-4" href={'/api/video/' + status.videoId} target="_blank">the link to the video.</a>
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
