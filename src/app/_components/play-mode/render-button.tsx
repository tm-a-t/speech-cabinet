'use client';

import {Button} from '~/app/_components/ui/button';
import {useContext} from 'react';
import type {DiscoData} from '~/app/_lib/data-types';
import {startRender} from '~/app/_lib/server-actions';
import {Download} from 'lucide-react';
import {RenderStatusContext} from '~/app/_components/render-status-provider';

export function RenderButton({data, setIsOpen}: { data: DiscoData, setIsOpen: (isOpen: boolean) => void }) {
  const [status, setStatus] = useContext(RenderStatusContext);

  async function send() {
    const {id, queuePosition} = await startRender(data);
    if (queuePosition > 0) {
      setStatus({state: 'in-queue', videoId: id, position: queuePosition, maxPosition: queuePosition});
    }
    else {
      setStatus({state: 'in-progress', videoId: id, progress: 0})
    }
    setIsOpen(false);
  }

  return (
    <>
      <div className="text-center inline-flex justify-center content-center min-h-12 w-full relative">
        {(status.state === 'not-started' || status.state === 'finished') &&
          <Button onClick={send} variant="ghost">
            <Download className="w-4 h-4 mr-2"/>
            Render video
          </Button>
        }
      </div>
    </>
  );
}