import { getUnifiedNews } from '@/lib/rss';
import SwipeFeed from '@/components/SwipeFeed';
import HistoricalSources from '@/components/HistoricalSources';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const news = await getUnifiedNews();

  return (
    <main className="h-screen w-full bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      <SwipeFeed initialNews={news} />
      <HistoricalSources />
    </main>
  );
}
