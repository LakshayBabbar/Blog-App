import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../../components/ui/Card";

const Home = () => {
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const fetchdata = async () => {
      const response = await fetch(
        import.meta.env.VITE_AUTH + "all-blogs/?category=" + category
      );
      const resData = await response.json();
      setData(resData);
    };
    fetchdata();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-thin my-28">Welcome to Blog-Tech</h1>
      {data.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        {data.map((items) => {
          return <Card key={items._id} data={items} />;
        })}
      </div>:<h1 className="mt-4">Cannot find any blog with &#39;{searchParams.get('category')}&#39; category.</h1>}
    </div>
  );
};

export default Home;
