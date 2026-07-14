import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "앱 이름", // 실제 프로젝트명으로 변경
    short_name: "짧은이름",
    description: "앱 설명",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      { src: "/images/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
