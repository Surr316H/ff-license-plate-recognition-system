/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState, useCallback } from "react";

interface VideoPlayerProps {
  src: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  className?: string;
  onLoadStart?: () => void;
  onLoadedData?: () => void;
  onError?: (error: Event) => void;
  enableAdaptiveQuality?: boolean;
  preload?: "none" | "metadata" | "auto";
  bufferHealthThreshold?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  poster,
  className,
  onLoadStart,
  onLoadedData,
  onError,
  enableAdaptiveQuality = true,
  preload = "metadata",
  bufferHealthThreshold = 5,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<
    "good" | "poor" | "unknown"
  >("unknown");
  const [playbackQuality, setPlaybackQuality] = useState<"high" | "low">(
    "high"
  );

  const detectNetworkQuality = useCallback(() => {
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType;

      if (effectiveType === "4g") {
        setConnectionQuality("good");
      } else if (
        effectiveType === "3g" ||
        effectiveType === "2g" ||
        effectiveType === "slow-2g"
      ) {
        setConnectionQuality("poor");
      }
    }
  }, []);

  const checkBufferHealth = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    try {
      const buffered = video.buffered;
      const currentTime = video.currentTime;

      if (buffered.length > 0) {
        const bufferEnd = buffered.end(buffered.length - 1);
        const bufferHealth = bufferEnd - currentTime;

        if (bufferHealth < bufferHealthThreshold) {
          setIsBuffering(true);
          if (enableAdaptiveQuality && connectionQuality === "poor") {
            setPlaybackQuality("low");
          }
        } else {
          setIsBuffering(false);
          if (connectionQuality === "good") {
            setPlaybackQuality("high");
          }
        }
      }
    } catch (error) {
      console.warn("Buffer health check failed:", error);
    }
  }, [bufferHealthThreshold, enableAdaptiveQuality, connectionQuality]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enableAdaptiveQuality) return;

    if (playbackQuality === "low") {
      video.style.imageRendering = "pixelated";
      video.style.filter = "contrast(0.9) brightness(0.95)";
    } else {
      video.style.imageRendering = "auto";
      video.style.filter = "none";
    }
  }, [playbackQuality, enableAdaptiveQuality]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      detectNetworkQuality();
    }
  }, [src, detectNetworkQuality]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsBuffering(true);
      onLoadStart?.();
    };

    const handleLoadedData = () => {
      setIsBuffering(false);
      onLoadedData?.();
    };

    const handleError = (error: Event) => {
      setIsBuffering(false);
      onError?.(error);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
      checkBufferHealth();
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handleProgress = () => {
      checkBufferHealth();
    };

    const handleStalled = () => {
      setIsBuffering(true);
      if (enableAdaptiveQuality) {
        setConnectionQuality("poor");
        setPlaybackQuality("low");
      }
    };

    const handleOnline = () => detectNetworkQuality();
    const handleOffline = () => setConnectionQuality("poor");

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("stalled", handleStalled);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      connection?.addEventListener("change", detectNetworkQuality);
    }

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("stalled", handleStalled);

      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        connection?.removeEventListener("change", detectNetworkQuality);
      }
    };
  }, [
    onLoadStart,
    onLoadedData,
    onError,
    checkBufferHealth,
    detectNetworkQuality,
    enableAdaptiveQuality,
  ]);

  return (
    <div
      className={`video-container ${className || ""}`}
      style={{ position: "relative" }}
    >
      <video
        ref={videoRef}
        src={src}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        poster={poster}
        preload={preload}
        style={{
          width: "100%",
          height: "100%",
          transition: "filter 0.3s ease",
        }}
      />

      {isBuffering && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "14px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {connectionQuality === "poor"
            ? "Optimizing for slow connection..."
            : "Buffering..."}
        </div>
      )}

      {enableAdaptiveQuality && playbackQuality === "low" && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "rgba(255, 165, 0, 0.8)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          Low Quality Mode
        </div>
      )}
    </div>
  );
};
