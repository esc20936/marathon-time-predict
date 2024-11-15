"use client";

import { useState } from "react";
import MarathonPredictor from "@/components/marathon-predictor";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import SendData from "../../pages/SendData";

function Home() {
  return <MarathonPredictor />;
}

function SelectionPage({ onSelect }: { onSelect: (page: string) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Select a Page</h1>
      <div className="space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => onSelect("home")}
        >
          Prediction 🕹️
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => onSelect("about")}
        >
          Data Upload 👟
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  return (
    <QueryClientProvider client={new QueryClient()}>
      {!selectedPage && <SelectionPage onSelect={setSelectedPage} />}
      {selectedPage === "home" && <Home />}
      {selectedPage === "about" && <SendData />}
    </QueryClientProvider>
  );
}
