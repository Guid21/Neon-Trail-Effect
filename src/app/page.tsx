"use client";

import { NeonSign } from "./components/NeonSign";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const text = searchParams.get("message") || "Hello World!";
  return (
    <>
      <NeonSign text={text} />
    </>
  );
}
