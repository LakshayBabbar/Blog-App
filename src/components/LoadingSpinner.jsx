const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="col-span-3 animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-700" />
    </div>
  );
};

export default LoadingSpinner;
