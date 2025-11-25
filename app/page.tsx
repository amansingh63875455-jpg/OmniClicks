import { getNews, getHistory, getHackathons, getJobs } from '@/lib/rss';
import TabsContainer from '@/components/TabsContainer';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default async function Home() {
  const [news, history, hackathons, jobs] = await Promise.all([
    getNews(),
    getHistory(),
    getHackathons(),
    getJobs()
  ]);

  return (
    <main className="h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col max-w-[1920px] mx-auto w-full p-4 md:p-6 min-h-0">
        <header className="mb-6 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 tracking-tight">
              OmniClicks Fintech
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-500 text-sm">Daily Intelligence Dashboard <span className="text-xs text-blue-500 font-mono ml-2">[v2.3 DEPLOYED ✓]</span></p>
              <span className="text-xs text-slate-700">•</span>
              <p className="text-xs text-slate-600 font-mono">
                Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-600 font-mono hidden md:block">{/* Trigger redeploy v3 */}
            <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        <TabsContainer
          news={news}
          history={history}
          hackathons={hackathons}
          jobs={jobs}
        />
      </div>
      <Footer />
    </main>
  );
}
