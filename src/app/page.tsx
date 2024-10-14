"use client";

import { Suspense } from "react";
import { NeonSign } from "./components/NeonSign";
import { useSearchParams } from "next/navigation";
import { Firefly } from "./components/Firefly";

type Mode = "firefly" | "neon-sign";

function Home() {
  const searchParams = useSearchParams();
  const text = searchParams.get("message") || "Hello World!";
  const mode = (searchParams.get("mode") || "neon-sign") as Mode;

  if (mode === "firefly") {
    return <Firefly text={text} />;
  }

  return (
    <>
      <NeonSign text={text} />
    </>
  );
}

const SuspenseBoundary = () => {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <Home />
    </Suspense>
  );
};

export default SuspenseBoundary;
