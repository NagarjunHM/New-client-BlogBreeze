import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { Badge } from "./badge";
import { Link } from "react-router-dom";
import { Skeleton } from "./skeleton";
import Error from "./Error";

const FeaturedTopic = () => {
  const instance = useAxios();

  const { data, error, isLoading } = useQuery({
    queryKey: ["topic", "featured"],
    queryFn: async () => {
      const response = await instance.get("/tags?featured=true");
      console.log(response.data);
      return response.data;
    },
  });

  if (isLoading) return <Skeleton className="w-full h-[300px]" />;

  if (error) {
    return (
      <Error
        message={
          error?.response?.data || error?.message || "something went wrong"
        }
      />
    );
  }

  return (
    <div className="py-5">
      <div className="mb-4 text-3xl font-semibold">Explore topics</div>
      <div className="flex flex-wrap max-w-full gap-4 overflow-x-auto">
        {data?.map((tag) => (
          <div key={tag._id}>
            <Badge tagId={tag._id}>{tag.name}</Badge>
          </div>
        ))}
      </div>
      <div className="mt-4 text-green-600 cursor-pointer hover:underline">
        <Link to="/tags">See more topics</Link>
      </div>
    </div>
  );
};

export default FeaturedTopic;
