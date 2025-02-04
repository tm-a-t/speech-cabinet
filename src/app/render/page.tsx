'use client';

import {Player} from "~/components/player/player";
import { restoreSavedData } from "~/lib/utils";
import { useEffect, useState } from "react";
import type { DiscoData } from "~/lib/disco-data";

export default function Page() {
  const [data, setData] = useState<DiscoData | null>(null);

  useEffect(() => {
    setData(restoreSavedData);
  }, []);

  return data && <Player data={data} />;
}
