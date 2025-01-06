"use client";

import { useContext } from "react";
import { useChat } from "ai/react";
import { BooksContext } from "../booksProvider";
import LoadingDots from "./loadingDots";
import { RunIcon } from "../icons";

export default function Chat() {
  const bookIds = useContext(BooksContext)?.bookIds;

  const { messages, input, handleInputChange, handleSubmit, error, isLoading } =
    useChat({
      body: {
        bookIds,
      },
    });

  return (
    <>
      <div className="overflow-y-auto w-full flex flex-column justify-center pt-[10vh] pb-6">
        <div className="w-[688px]">
          {!input && messages.length === 0 && (
            <>
              <h1 className="mt-4 text-center mb-0">LET'S CHAT!</h1>
              <p className="text-center">Ask me about books and authors.</p>
            </>
          )}
          {messages.map((m) =>
            m.role === "user" ? (
              <div className="relative w-full flex justify-end mb-2" key={m.id}>
                <div
                  className={`${" text-text p-4 bg-elem max-w-1/3 rounded-full w-fit shadow-lg"}`}
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
                  className={`${"bg-bg text-text p-4 self-start max-w-1/3 rounded-xl mb-4 relative z-10"}`}
                >
                  <div className="opacity-30 text-xs font-semibold">AI</div>
                  {m.content}
                </div>
              )
            )
          )}
          {error && (
            <div
              className="w-fit m-auto bg-red-200 text-red-700 px-4 py-2 rounded relative"
              role="alert"
            >
              <span>An error has occurred. </span>
            </div>
          )}
        </div>
      </div>
      <form
        className="absolute bottom-0  left-1/2 transform -translate-x-1/2"
        onSubmit={handleSubmit}
      >
        <input
          className="bg-text pl-4 py-3 rounded-xl outline-none w-[676px] text-bg placeholder:text-placeholder shadow-[0px_34px_0px_0px_#09090a;]"
          placeholder="Ask a question..."
          onChange={handleInputChange}
          value={input}
        />
        <button className={`absolute right-4 top-[14px]`}>
          <RunIcon className={` ${input ? "text-bg" : "text-placeholder"}`} />
        </button>
      </form>
    </>
  );
}
