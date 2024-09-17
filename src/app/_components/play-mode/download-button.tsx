'use client';

import {Button} from '~/app/_components/ui/button';
import {useEffect, useState} from 'react';
import {DiscoData} from '~/app/_lib/data-types';
import {getVideoProgress, getVideoStatus, startRender} from '~/app/_lib/server-actions';
import {totalDuration} from '../../_lib/time';
import {Progress} from '../ui/progress';
import { Loader2, Download } from 'lucide-react';
import {downloadFile, formatTime} from '~/app/_lib/utils';
import {Simulate} from 'react-dom/test-utils';
import progress = Simulate.progress;

export function DownloadButton({data}: { data: DiscoData }) {
  const [showButton, setShowButton] = useState(true);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const total = totalDuration(data) + 2000;

  useEffect(() => {
    if (videoId && (downloadProgress === null || downloadProgress < 100)) {
      const timer = setInterval(() => {
        void getVideoProgress(videoId).then(progress => {
          setDownloadProgress(progress);
          clearInterval(timer)
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    if (downloadProgress === 100) {
      console.log('!!!')
      setDownloadProgress(null);
      setShowResult(true);
      void downloadFile('/api/video/' + videoId, `Disco ${formatTime()}.mp4`);
    }
  }, [downloadProgress, videoId]);

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

  async function handleDownload() {
    const id = await startRender(data);
    setVideoId(id);
    setShowButton(false);
  }

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 p-2">
        {downloadProgress !== null && <Progress value={Math.max(downloadProgress, 2)}/>}
      </div>
      <div className="text-center inline-flex justify-center content-center min-h-12 w-full relative">
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
          <span>Download started. You can also use <a className="underline underline-offset-4" href={'/api/video/' + videoId} target="_blank">the link to the video.</a></span>
        }
      </div>
    </>
  );
}