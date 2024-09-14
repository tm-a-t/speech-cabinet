'use client';

import {Button} from '~/app/_components/ui/button';
import {useEffect, useState} from 'react';
import {SavedData} from '~/app/_lib/data-types';
import {getVideoStatus, startRender} from '~/app/_lib/server-actions';
import {totalDuration} from './time';
import {Progress} from '../ui/progress';
import { Loader2, Download } from 'lucide-react';

export function DownloadButton({data}: { data: SavedData }) {
  const [showButton, setShowButton] = useState(true);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const total = totalDuration(data);
  const progressPercentage = Math.min((downloadProgress ?? 0) / total * 100, 100);

  useEffect(() => {
    if (downloadProgress !== null && downloadProgress < total) {
      const step = Math.min(total - downloadProgress, 500);
      const timer = setTimeout(() => setDownloadProgress(downloadProgress + step), step);
      return () => clearTimeout(timer);
    }
    if (downloadProgress === total) {
      setShowSpinner(true);
      setDownloadProgress(null);
    }
  }, [downloadProgress]);

  useEffect(() => {
    if (!showSpinner) return;
    const timer = setInterval(() => {
      void (async () => {
        const isReady = await getVideoStatus(videoId!)
        if (isReady) {
          setShowSpinner(false);
          setShowResult(true);
          clearInterval(timer);
        }
      })();
    }, 1000);
  }, [showSpinner]);

  async function handleDownload() {
    const id = await startRender(data);
    setVideoId(id);
    setDownloadProgress(1000);
    setShowButton(false);
  }

  return (
    <>
      <div className="absolute top-0 left-0 right-0 p-2">
        {downloadProgress && <Progress value={progressPercentage}/>}
      </div>
      <div className="mt-3 inline-flex justify-center content-center min-h-12 w-full relative">
        {showButton &&
          <Button onClick={handleDownload} variant="ghost"
                 disabled={downloadProgress !== null || showSpinner}
                 className={downloadProgress !== null || showSpinner ? 'invisible' : ''}>
            <Download className="w-4 h-4 mr-2"/>
            Render video
          </Button>
        }
        {showSpinner &&
          <Loader2 className="animate-spin w-8 h-8"/>
        }
        {showResult &&
          <span>Download started. <a className="underline underline-offset-4" href={'/video/' + videoId + '.mp4'} target="_blank">Link to the video</a></span>
        }
      </div>
    </>
  );
}