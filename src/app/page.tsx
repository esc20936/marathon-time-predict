"use client";
import  MarathonPredictor  from "@/components/marathon-predictor";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function Home() {
  return (
   <MarathonPredictor />
  );
}

export default function App () {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Home />
    </QueryClientProvider>
  );
}