export default function Card({ title, summary, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20
                 hover:bg-white/20 hover:-translate-y-1 transition shadow-lg"
    >
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <p className="text-xs text-gray-200">{summary}</p>
    </a>
  );
}
