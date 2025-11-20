export default function handler(_, res) {
  res.status(200).json({ triggered: true });
}
