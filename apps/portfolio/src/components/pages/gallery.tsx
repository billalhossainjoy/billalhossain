import { getGalleryItems } from "@/lib/content";
import GalleryClient from "./gallery-client";

export default function Gallery() {
  const items = getGalleryItems();
  return <GalleryClient items={items} />;
}
