const PeoplePage = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">Pictures</div>
      <div className="h-14 bg-gray-800 flex items-center justify-center gap-6">
        <button className="rounded px-2 py-1 bg-gray-600">Button 1</button>
        <button className="rounded px-2 py-1 bg-gray-600">Button 2</button>
        <button className="rounded px-2 py-1 bg-gray-600">Button 3</button>
      </div>
    </div>
  );
};

export default PeoplePage;
