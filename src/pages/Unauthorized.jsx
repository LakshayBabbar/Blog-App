const Unauthorized = () => {
  return (
    <div className="h-screen w-full flex flex-col gap-3 items-center justify-center">
      <h1 className="text-slate-200 text-2xl text-center py-2">
        Unauthorised!
      </h1>
      <p className="text-slate-200">
        Something went wrong while authenticating
      </p>
      <p className="text-slate-200">Please try again later.</p>
    </div>
  );
};

export default Unauthorized;
