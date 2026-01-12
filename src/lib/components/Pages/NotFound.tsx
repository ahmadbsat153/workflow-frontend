"use client";

import Link from "next/link";
import { Button } from "@/lib/ui/button";
import { FadeIn, FadeInStagger } from "../Motion/FadeIn";
import Image from "next/image";
import { authImages } from "@/lib/constants/authImages";
import { API_SETTINGS } from "@/lib/services/Settings/settings_service";
import { useEffect, useState } from "react";

type Props = {
  title?: string;
  error?: string;
  description?: string;
  url?: string;
  show_btn?: boolean;
  image_url?: string;
};

const NotFound = ({
  title = "Home",
  url = "/",
  show_btn = true,
  error = "Oops! Page not found",
  description = "Whoops, this is embarassing. Looks like the page you were looking for was not found.",
  image_url = "/images/404.png",
}: Props) => {
  // Initialize with default image if image_url is not a valid path
  const initialImage = image_url.startsWith('/') || image_url.startsWith('http')
    ? image_url
    : "/images/404.png";
  const [imageUrl, setImageUrl] = useState(initialImage);

  useEffect(() => {
    // Only fetch if image_url is a key (not a valid path)
    const isImageKey = !image_url.startsWith('/') && !image_url.startsWith('http');

    if (isImageKey) {
      const fetchImages = async () => {
        try {
          const backendHost =
            process.env.NEXT_PUBLIC_BACKEND_HOST || "http://localhost:8080";
          const response = await API_SETTINGS.getPublicAuthImages();
          const fetchedUrl =
            backendHost + response.data[image_url]?.value || "/images/404.png";
          setImageUrl(fetchedUrl);
          console.log("Image URL:", fetchedUrl);
        } catch (err) {
          console.error("Failed to load auth images:", err);
          // Fail silently - use default images if API fails
          setImageUrl("/images/404.png");
        }
      };

      fetchImages();
    }
  }, [image_url]);

  return (
    <FadeInStagger className="w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-center lg:pt-24 lg:pb-36 py-24">
        <FadeIn className="lg:w-[320px] sm:w-[300px] max-w-[400px]">
          <Image
            width={300}
            height={300}
            src={imageUrl}
            alt={"not found"}
            className="object-bottom"
          />
        </FadeIn>

        <FadeIn className="text-primary lg:text-2xl text-lg w-full text-center px-8 flex flex-col gap-1 mb-5">
          <h3>{error}</h3>
          <p className="text-black dark:text-white text-sm">{description}</p>
        </FadeIn>

        {show_btn && (
          <FadeIn>
            <Button
              asChild
              variant={"default"}
              color="primary"
              className="text-sm transition-all hover:scale-90"
            >
              <Link href={url}>{title}</Link>
            </Button>
          </FadeIn>
        )}
      </div>
    </FadeInStagger>
  );
};

export default NotFound;
