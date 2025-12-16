import autoCampingImg from "../../assets/images/explore/auto-camping.jpg";
import autoImg from "../../assets/images/explore/auto.jpg";
import caffeeImg from "../../assets/images/explore/caffee.jpg";
import chinaImg from "../../assets/images/explore/china.jpg";
import hikingImg from "../../assets/images/explore/hiking.jpg";
import mountainsImg from "../../assets/images/explore/mountains.jpg";
import newYorkImg from "../../assets/images/explore/new-york.jpg";
import roadImg from "../../assets/images/explore/road.jpg";
import streetImg from "../../assets/images/explore/street.jpg";
import workImg from "../../assets/images/explore/work.jpg";
import instance from "./instance";

const explorePosts = [
  { id: 1, image: autoImg, alt: "Vintage car interior" },
  { id: 2, image: autoCampingImg, alt: "Auto camping trip" },
  { id: 3, image: newYorkImg, alt: "New York skyline" },
  { id: 4, image: hikingImg, alt: "Hiking in the mountains" },
  { id: 5, image: chinaImg, alt: "Dragon ornament" },
  { id: 6, image: roadImg, alt: "Road trip" },
  { id: 7, image: caffeeImg, alt: "Cup of coffee" },
  { id: 8, image: workImg, alt: "Working from home" },
  { id: 9, image: streetImg, alt: "Rainy street scene" },
  { id: 10, image: mountainsImg, alt: "Misty mountain landscape" },
];

const wrapRequest = async (promise) => {
  try {
    const { data } = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createPostApi = (payload) => {
  const formData = new FormData();

  if (payload.image) {
    formData.append("image", payload.image);
  }

  if (payload.description) {
    formData.append("description", payload.description);
  }

  return wrapRequest(
    instance.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
};

export const getFeedPostsApi = async () => {
  const { data } = await instance.get("/posts/feed");
  return { posts: data || [] };
};

export const getPostsApi = async () => {
  try {
    const { data } = await instance.get("/posts");
    const posts = data?.posts ?? data;

    if (Array.isArray(posts) && posts.length > 0) {
      return { posts };
    }
  } catch (error) {
    console.error("Error fetching posts, fallback to explore set", error);
  }

  return { posts: explorePosts };
};

export const getUserPostsApi = async (userId) => {
  const { data } = await instance.get(`/posts/user/${userId}`);
  return data;
};
