const Unauthorized = () => {
  return (
    <div className="h-screen w-full flex flex-col gap-3 items-center justify-center text-center">
      <h1 className="text-red-300 text-3xl font-bold py-2">
        Access Denied
      </h1>
      <p className="text-slate-200">
        We&apos;re sorry, but you do not have permission to access this page.
      </p>
      <p className="text-slate-200">Please login to continue</p>
    </div>
  );
};

export default Unauthorized;
