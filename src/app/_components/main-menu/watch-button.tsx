import {Drawer, DrawerContent, DrawerTrigger} from '~/app/_components/ui/drawer';
import {Button} from '~/app/_components/ui/button';
import {Play} from 'lucide-react';
import React, {useContext, useEffect, useState} from 'react';
import {Player} from '~/app/_components/play-mode/player';
import {RenderButton} from '~/app/_components/play-mode/render-button';
import type {DiscoData} from '~/app/_lib/data-types';
import {Dialog, DialogContent, DialogTrigger} from '~/app/_components/ui/dialog';
import {useIsDesktop} from '~/app/_lib/hooks/use-media-query';
import {RenderStatusContext} from '~/app/_components/render-status-provider';

export function WatchButton({data, onMouseOver}: {data: DiscoData, onMouseOver: () => void}) {
  const isDesktop = useIsDesktop();
  const [status, _] = useContext(RenderStatusContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status.state === 'finished') {
      setIsOpen(false);
    }
  }, [status]);

  const button = <Button variant="default" className="text-zinc-400 pl-3 ml-auto" onMouseOver={onMouseOver}>
    <Play className="h-3 w-3 mr-1.5"/>
    Watch
  </Button>

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{button}</DialogTrigger>
        <DialogContent className="w-[26rem] p-0 dark:bg-opacity-0 border-0">
          <PlayerWrapper data={data} setIsOpen={setIsOpen}/>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{button}</DrawerTrigger>
      <DrawerContent>
        <PlayerWrapper data={data} setIsOpen={setIsOpen}/>
      </DrawerContent>
    </Drawer>
  )
}

function PlayerWrapper({data, setIsOpen}: {data: DiscoData, setIsOpen: (isOpen: boolean) => void}) {
  return (
    <>
      <div className="w-[324px] overflow-hidden mx-auto">
        <div className="h-[576px] my-12 lg:my-1 border box-content">
          <div
            className="scale-[0.3] -translate-y-[35%] w-[1080px] relative -translate-x-[50%] left-1/2">
            <Player data={data}/>
          </div>
        </div>
      </div>
      <RenderButton data={data} setIsOpen={setIsOpen}/>
    </>
  )
}
