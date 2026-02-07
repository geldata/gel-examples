"use client";

import { useState } from "react";
import LoadingDots from "../components/loadingDots";
import { RunIcon, GPTLogo } from "../icons";

export default function Completion() {
  const [input, setInput] = useState("");
  const [completion, setCompletion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInput(ev.target.value);
  };

  // handle the incoming text chunks
  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!input.trim()) return;

    setCompletion("");
    setLoading(true);

    try {
      setError(null);

      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      setLoading(false);
      setInput("");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setCompletion((prev) => prev + chunk);
      }
    } catch (err: unknown) {
      if (typeof err === "string") {
        setError(`Error: ${err}`);
      } else if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        console.log("An unknown error has occured: ", err);
        setError("An unknown error has occured.");
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-16 pt-[25vh] max-w-3xl mx-auto gap-4 pb-28">
      {!input && !completion && (
        <>
          <GPTLogo />
          <h1 className="mt-4">Ask me something.</h1>
        </>
      )}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {loading && <LoadingDots />}
      <p className={`${"text-gray-300 max-w-1/3"}`}>{completion}</p>

      <form className="fixed bottom-8 w-full max-w-[640px]" onSubmit={onSubmit}>
        <input
          className="border pl-4 py-2.5 rounded-xl border-neutral-700 outline-none w-[676px] text-[#bfbfbf] placeholder:text-[#666] focus:border-neutral-600 bg-[#191919] shadow-[0px_34px_0px_0px_#191919;] -ml-3"
          placeholder="Ask a question..."
          onChange={handleInputChange}
          value={input}
        />
        <button className={`absolute -right-1 top-[12px]`}>
          <RunIcon className={` ${input ? "text-[#9e6bbd]" : "text-[#666]"}`} />
        </button>
      </form>
    </main>
  );
}
