import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
  promotionalBannerService,
  PromotionalBanner as PromotionalBannerRecord,
} from "@/services/promotionalBannerService";
import { siteImageUrl } from "@/styles/theme";

const patternPurple = siteImageUrl("patterns/pattern-roxo.png");

const normalizeUrl = (url?: string | null) => {
  const value = url?.trim();
  if (!value) return "";
  return value;
};

const TextTrack = ({ text }: { text: string }) => (
  <div className="flex min-w-max shrink-0 items-center gap-8 px-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <span key={index} className="flex items-center gap-8">
        <span className="whitespace-nowrap text-xl font-semibold tracking-normal text-white sm:text-2xl lg:text-3xl">
          {text}
        </span>
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#ffd96f]" />
      </span>
    ))}
  </div>
);

const ImageTrack = ({ src }: { src: string }) => (
  <div className="flex min-w-max shrink-0 items-center">
    {Array.from({ length: 4 }).map((_, index) => (
      <img
        key={index}
        src={src}
        alt=""
        className="h-24 w-[72vw] max-w-[680px] shrink-0 object-cover sm:h-28 md:w-[52vw] lg:h-32"
        loading="lazy"
      />
    ))}
  </div>
);

export function PromotionalBanner() {
  const [banner, setBanner] = useState<PromotionalBannerRecord | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadBanner = async () => {
      try {
        const data = await promotionalBannerService.getActiveBanner();
        if (mounted) setBanner(data);
      } catch (error) {
        console.error("Error loading promotional banner:", error);
      }
    };

    loadBanner();

    return () => {
      mounted = false;
    };
  }, []);

  if (!banner?.is_active) return null;

  const linkUrl = normalizeUrl(banner.link_url);
  const imageUrl = normalizeUrl(banner.image_url);
  const text = banner.text?.trim();
  const isImageMode = banner.type === "image" && imageUrl;
  const isTextMode = banner.type === "text" && text;

  if (!isImageMode && !isTextMode) return null;

  const content = (
    <div
      className={cn(
        "group relative -mt-8 overflow-hidden border-y border-white/70 py-5 shadow-[0_18px_55px_rgba(62,46,89,0.08)] sm:py-6 lg:py-7",
        isTextMode ? "bg-[#5b3d86]" : "bg-[#fbfafc]",
      )}
      style={
        isTextMode
          ? {
              backgroundImage: `linear-gradient(90deg, rgba(91,61,134,0.76), rgba(141,99,199,0.64)), url("${patternPurple}")`,
              backgroundSize: "cover, 420px auto",
              backgroundBlendMode: "multiply, normal",
            }
          : undefined
      }
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r to-transparent",
          isTextMode ? "from-[#5b3d86]" : "from-[#fbfafc]",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l to-transparent",
          isTextMode ? "from-[#5b3d86]" : "from-[#fbfafc]",
        )}
      />
      <div className="flex w-max animate-[promoMarquee_108000ms_linear_infinite] items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {isImageMode ? (
          <>
            <ImageTrack src={imageUrl} />
            <ImageTrack src={imageUrl} />
          </>
        ) : (
          <>
            <TextTrack text={text} />
            <TextTrack text={text} />
          </>
        )}
      </div>
    </div>
  );

  if (!linkUrl) return content;

  return (
    <a href={linkUrl} target="_blank" rel="noreferrer" className="block" aria-label="Abrir destaque da Clinica Crescer">
      {content}
    </a>
  );
}
