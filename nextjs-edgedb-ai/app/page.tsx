"use client";

import { useState } from "react";
import { GPTLogo, RunIcon } from "./icons";
import { AssistantMessage, UserMessage } from "@gel/ai";
import LoadingDots from "./components/loadingDots";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<(UserMessage | AssistantMessage)[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInput(ev.target.value);
  };

  // handle the incoming text chunks
  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: [{ type: "text", text: input }] },
      { role: "assistant", content: "" },
    ]);

    setLoading(true);

    try {
      setError(null);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", content: [{ type: "text", text: input }] },
          ],
        }),
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      setLoading(false);
      setInput("");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const messages = [...prev];

          const last = messages.pop();
          if (last?.role === "assistant") {
            last.content += chunk;
            return [...messages, last];
          }
          return [...messages];
        });
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
      {!input && messages.length === 0 && (
        <>
          <GPTLogo />
          <h1 className="mt-4">How can I help you today?</h1>
          <p className="-mt-8">Chat with me.</p>
        </>
      )}
      {messages.map((m, index) =>
        m.role === "user" ? (
          <div className="relative w-full flex justify-end" key={index}>
            <div
              key={index}
              className={`${"bg-[#43384a] text-white border border-[#765d86] p-4 self-end max-w-1/3 rounded-xl"}`}
            >
              {m.content[0].text}
            </div>
            {loading && (
              <LoadingDots className="absolute -bottom-[22px] left-4" />
            )}
          </div>
        ) : (
          m.content && (
            <div
              key={index}
              className={`${"bg-[#333333] text-gray-300 border border-[#3f3f3f] p-4 self-start max-w-1/3 rounded-xl"}`}
            >
              <div className="opacity-30 text-xs font-semibold">AI</div>
              {m.content!}
            </div>
          )
        )
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
