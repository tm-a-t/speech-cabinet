'use client';

import {Player} from "~/components/player/player";
import { restoreSavedData, sleep } from "~/lib/utils";
import { useEffect, useState } from "react";
import type { DiscoData } from "~/lib/disco-data";

export default function Page() {
  const [data, setData] = useState<DiscoData | null>(null);

  useEffect(() => {
    window.addEventListener('disco', handleData)
    return () => window.removeEventListener('disco', handleData)
  }, []);

  function handleData() {
    setData(restoreSavedData);
  }

  return data && <Player data={data} />;
}
