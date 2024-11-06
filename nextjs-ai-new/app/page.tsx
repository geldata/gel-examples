"use client";
import { useState } from "react";
import { useChat } from "ai/react";
import LoadingDots from "./components/loadingDots";
import { GPTLogo, RunIcon } from "./icons";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, error, isLoading } =
    useChat();
  console.log("messages", messages);
  return (
    <main className="flex min-h-screen flex-col items-center px-16 pt-[25vh] max-w-3xl mx-auto gap-4 pb-28">
      {!input && messages.length === 0 && (
        <>
          <GPTLogo />
          <h1 className="mt-4">How can I help you today?</h1>
          <p className="-mt-8">Chat with me.</p>
        </>
      )}
      {messages.map((m) =>
        m.role === "user" ? (
          <div className="relative w-full flex justify-end" key={m.id}>
            <div
              className={`${"bg-[#43384a] text-white border border-[#765d86] p-4 max-w-1/3 rounded-xl w-fit"}`}
            >
              {m.content}
            </div>
            {isLoading && (
              <LoadingDots className="absolute -bottom-[22px] left-4" />
            )}
          </div>
        ) : (
          m.content && (
            <div
              key={m.id}
              className={`${"bg-[#333333] text-gray-300 border border-[#3f3f3f] p-4 self-start max-w-1/3 rounded-xl z-10"}`}
            >
              <div className="opacity-30 text-xs font-semibold">AI</div>
              {m.content}
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
          <span className="block sm:inline">{error.message}</span>
        </div>
      )}
      <form
        className="fixed bottom-8 w-full max-w-[640px]"
        onSubmit={handleSubmit}
      >
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
