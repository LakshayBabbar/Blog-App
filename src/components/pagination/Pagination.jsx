import Link from "next/link";

const Pagination = ({ pageNo, totalPages, limit = 20, url }) => {
  return (
    <section className="flex mt-20 gap-4 items-center">
      {pageNo > 1 && (
        <Link
          href={`${url}?page=${Number(pageNo) - 1}&limit=${limit}`}
          className="py-2 px-4 bg-secondary rounded-md text-sm disabled:opacity-[0.7] disabled:cursor-not-allowed"
        >
          Prev
        </Link>
      )}
      <p className="text-slate-200 text-sm">
        Page {pageNo} of {totalPages || 1}
      </p>
      {pageNo < totalPages && (
        <Link
          href={`${url}?page=${Number(pageNo) + 1}&limit=${limit}`}
          disabled={pageNo >= totalPages}
          className="py-2 px-4 bg-secondary rounded-md text-sm disabled:opacity-[0.7] disabled:cursor-not-allowed"
        >
          Next
        </Link>
      )}
    </section>
  );
};

export default Pagination;
