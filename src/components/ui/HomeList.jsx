import React from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { userSlice } from "@/store/userSlice";
import useAxios from "@/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import BlogList from "./BlogList";
import BlogHorizontalCard from "./BlogHoriontalSkeleton";
import Error from "./Error";

const HomeList = () => {
  const instance = useAxios();
  const { id } = userSlice();
  const location = useLocation();
  const [searchQuery] = useSearchParams("tags");
  const tagId = searchQuery.get("tags");
  let blogData;

  if (location.pathname === "/" && location.search === "") {
    blogData = useQuery({
      queryKey: ["following", "tag", id],
      queryFn: async () => {
        const response = await instance.get(`blogs/following/tags/${id}`);
        return response.data;
      },
    });
  }

  if (location.pathname === "/" && location.search.includes("feeds")) {
    blogData = useQuery({
      queryKey: ["following", "users", id],
      queryFn: async () => {
        const response = await instance.get(`/blogs/following/users/${id}`);
        console.log(response.data);
        return response.data;
      },
    });
  }

  if (location.pathname === "/" && location.search.includes("tags")) {
    blogData = useQuery({
      queryKey: ["tags", tagId],
      queryFn: async () => {
        const response = await instance.get(`/blogs/tag/${tagId}`);
        return response.data;
      },
    });
  }

  if (blogData.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <BlogHorizontalCard />
        <BlogHorizontalCard />
      </div>
    );
  }

  if (blogData.error) {
    return (
      <Error
        message={
          blogData?.error?.response?.data ||
          blogData?.error?.message ||
          "something went wrong"
        }
      />
    );
  }

  if (
    blogData.data?.length === 0 &&
    location.pathname === "/" &&
    location.search === ""
  ) {
    return (
      <div className="flex flex-col text-center">
        <div className="mb-5">
          Stories from the topics you follow will appear here.
        </div>
        <div>
          <Link
            to="/tags"
            className="px-3 py-2 text-white bg-green-600 rounded-full"
          >
            Explore topics
          </Link>
        </div>
      </div>
    );
  }
  if (
    blogData.data?.length === 0 &&
    location.pathname === "/" &&
    location.search.includes("feeds")
  ) {
    return (
      <div className="flex flex-col text-center">
        <div className="mb-5">
          Stories from the writers you follow will appear here.
        </div>
        <div>
          <Link
            to="/users"
            className="px-3 py-2 text-white bg-green-600 rounded-full"
          >
            Explore writers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div>
        {<BlogList data={blogData.data?.blog || blogData.data || []} />}
      </div>
    </div>
  );
};

export default HomeList;
