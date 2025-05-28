export default function TestGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-blue-100 p-4">Item {i}</div>
      ))}
    </div>
  )
}