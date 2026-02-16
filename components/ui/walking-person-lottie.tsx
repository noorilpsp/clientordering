"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import type { LottieProps } from "lottie-react";

interface WalkingPersonLottieProps {
  className?: string;
}

export function WalkingPersonLottie({ className }: WalkingPersonLottieProps) {
  const [animationData, setAnimationData] = useState<LottieProps["animationData"]>(null);

  useEffect(() => {
    fetch("/stickman-walking.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  if (!animationData) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
