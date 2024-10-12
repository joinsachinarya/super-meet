import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "dotenv/config";
import BlogPage from "@/app/components/blog-page/blog-page";

const plus_jakarta_sans = Plus_Jakarta_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

// async function fetchPostDataBySlug(slug:any) {
//   try {
//     const response = {
//       posts:"hi"
//     }
//     if (
//       process.env.NEXT_PUBLIC_ENV == "Prod" &&
//       (await updateBlogView(response.posts[0].views, slug))
//     );
//     return response.posts[0];
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function updateBlogView(slug, views) {
//   try {
//     await postService.updateViews(slug, views);
//   } catch (error) {
//     console.log(error);
//   }
// }

const BlogSlug = async ({ params }:any) => {
  // const postData = await fetchPostDataBySlug(params.slug);
  const postData: any = {};
  return (
    <div className={" container py-8  mx-auto"}>
      <div className=" xl:px-32 lg:px-12 p-6 h-full flex flex-col justify-center items-center">
        {postData && <BlogPage source={postData.content} data={postData} />}
      </div>
    </div>
  );
};

export default BlogSlug;
