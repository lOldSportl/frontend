export default function GlossarySearch({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder="Поиск..."
      className="border px-2 py-1 w-full mb-4"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
