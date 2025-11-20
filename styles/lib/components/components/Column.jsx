import Card from "./Card";

export default function Column({ title, items, grad }) {
  return (
    <div className="flex-1 mx-2">
      <h2
        className={`text-lg font-bold mb-4 text-transparent bg-clip-text ${grad}`}
      >
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((it, i) => (
          <Card key={i} {...it} />
        ))}
      </div>
    </div>
  );
}
