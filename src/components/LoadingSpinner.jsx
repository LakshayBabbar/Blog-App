const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="col-span-3 animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600" />
    </div>
  );
};

export default LoadingSpinner;
