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

export const getPostsApi = async () => {
  return { posts: explorePosts };
};
