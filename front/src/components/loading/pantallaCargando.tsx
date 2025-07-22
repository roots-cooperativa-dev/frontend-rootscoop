const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-center h-[70vh] bg-white w-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#017d74] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 text-sm">Cargando informacion</p>
        </div>
      </div>
    </>
  );
};

export default Loading;
