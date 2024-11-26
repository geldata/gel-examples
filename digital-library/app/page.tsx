"use client";

import { useState } from "react";
import Chat from "./components/chat";
import BookCards from "./components/bookCards";

export default function Home() {
  const [bookIds, setBookIds] = useState<string[]>([]);

  return (
    <div className="flex gap-4 mr-8 h-screen">
      <aside className="mb-8 bg-elem pt-10 w-[320px] p-3 px-4 h-screen overflow-auto">
        <BookCards bookIds={bookIds} updateBookIds={setBookIds} />
      </aside>
      <main className="flex h-[calc(100vh_-_32px)] flex-col items-center mx-auto gap-4 pb-16 w-full rounded-lg mb-8 relative ">
        <Chat bookIds={bookIds} />
      </main>
    </div>
  );
}
