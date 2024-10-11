"use client";

import { Suspense } from "react";
import { NeonSign } from "./components/NeonSign";
import { useSearchParams } from "next/navigation";

function Home() {
  const searchParams = useSearchParams();
  const text = searchParams.get("message") || "Hello World!";
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
