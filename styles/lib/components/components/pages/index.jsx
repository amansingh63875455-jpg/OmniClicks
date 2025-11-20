import { fetchRSS } from "../lib/rssFetcher";
import Column from "../components/Column";

export default function Home({ latest, historical, hackathons, jobs }) {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-extrabold text-center mb-10">
        Fintech Daily Dashboard
      </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <Column
          title="Latest Fintech News"
          items={latest}
          grad="bg-gradient-to-r from-cyan-400 to-blue-500"
        />
        <Column
          title="Historical Fintech News"
          items={historical}
          grad="bg-gradient-to-r from-green-400 to-teal-500"
        />
        <Column
          title="Fintech Hackathons"
          items={hackathons}
          grad="bg-gradient-to-r from-purple-400 to-pink-500"
        />
        <Column
          title="Jobs & Internships"
          items={jobs}
          grad="bg-gradient-to-r from-orange-400 to-yellow-500"
        />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const [latest, historical, hackathons, jobs] = await Promise.all([
    fetchRSS("latest"),
    fetchRSS("historical"),
    fetchRSS("hackathons"),
    fetchRSS("jobs"),
  ]);
  return {
    props: { latest, historical, hackathons, jobs },
    revalidate: 86400, // once per day
  };
}
