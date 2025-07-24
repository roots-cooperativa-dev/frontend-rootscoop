const Loading = () => {
  return (
    <>
      <div className="flex justify-center items-center py-20 w-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#017d74] mx-auto"></div>
          <p className="text-gray-500">Cargando</p>
        </div>
      </div>
    </>
  );
};

export default Loading;
