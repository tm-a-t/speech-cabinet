'use client';

import {Button} from '~/app/_components/ui/button';
import {useEffect, useState} from 'react';
import {DiscoData} from '~/app/_lib/data-types';
import {getVideoProgress, startRender} from '~/app/_lib/server-actions';
import {Progress} from '../ui/progress';
import {Download, Loader2} from 'lucide-react';
import {downloadFile, formatTime} from '~/app/_lib/utils';

enum State {
  NotStarted,
  InProgress,
  Finished,
}

export function DownloadButton({data}: { data: DiscoData }) {
  const [state, setState] = useState(State.NotStarted);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  useEffect(() => {
    if (videoId === null || state !== State.InProgress) return;

    const timer = setInterval(async () => {
      const progress = await getVideoProgress(videoId)
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
        setState(State.Finished);
        setDownloadProgress(null);
        void downloadFile('/api/video/' + videoId, `Disco ${formatTime()}.mp4`);
        return;
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [downloadProgress, state]);

  // useEffect(() => {
  //   if (!showSpinner) return;
  //   const timer = setInterval(() => {
  //     void (async () => {
  //       const isReady = await getVideoStatus(videoId!)
  //       if (isReady) {
  //         setShowSpinner(false);
  //         setShowResult(true);
  //         clearInterval(timer);
  //         downloadFile('/api/video/' + videoId, `Disco ${formatTime()}.mp4`);
  //       }
  //     })();
  //   }, 1000);
  // }, [showSpinner]);

  async function startDownload() {
    const id = await startRender(data);
    setVideoId(id);
    setState(State.InProgress);
  }

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 p-2">
        {downloadProgress !== null && <Progress value={Math.max(downloadProgress, 2)}/>}
      </div>
      <div className="text-center inline-flex justify-center content-center min-h-12 w-full relative">
        {state === State.NotStarted &&
          <Button onClick={startDownload} variant="ghost"
                  disabled={downloadProgress !== null}
                  className={downloadProgress !== null ? 'invisible' : ''}>
            <Download className="w-4 h-4 mr-2"/>
            Render video
          </Button>
        }
        {state === State.Finished &&
          <span>Download started. You can also use <a className="underline underline-offset-4"
                                                      href={'/api/video/' + videoId} target="_blank">the link to the video.</a></span>
        }
      </div>
    </>
  );
}