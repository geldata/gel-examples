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
    <div className="overflow-y-auto flex flex-column gap-4 w-full">
      <div className="w-full flex flex-column justify-center pt-8 pb-6">
        <div className="w-[688px] px-4 lg:px-6">
          {!input && messages.length === 0 && (
            <div className="text-center">
              <h1 className="mt-4 font-bold">LET'S CHAT!</h1>
              <p>Ask me about books and authors.</p>
            </div>
          )}
          {messages.map((m) =>
            m.role === "user" ? (
              <div className="flex justify-end relative mb-2" key={m.id}>
                <div className="text-text p-4 bg-elem max-w-[80%] rounded-full shadow-lg">
                  {m.content}
                </div>
                {true && (
                  <LoadingDots className="absolute -bottom-[20px] left-4" />
                )}
              </div>
            ) : (
              m.content && (
                <div
                  key={m.id}
                  className="bg-bg text-text p-4 rounded-xl mb-4 z-10 relative"
                >
                  <div className="opacity-30 text-xs font-semibold">AI</div>
                  {m.content}
                </div>
              )
            )
          )}
          {error && (
            <div
              className="m-auto bg-red-200 text-red-700 px-4 py-2 rounded relative"
              role="alert"
            >
              <span>An error has occurred. </span>
            </div>
          )}
        </div>
      </div>
      <form
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 w-full max-w-2xl"
        onSubmit={handleSubmit}
      >
        <input
          className="bg-text pl-4 py-3 rounded-xl outline-none w-full text-bg 
          placeholder:text-placeholder shadow-md"
          placeholder="Ask a question..."
          onChange={handleInputChange}
          value={input}
        />
        <button className="absolute right-8 top-3">
          <RunIcon className={` ${input ? "text-bg" : "text-placeholder"}`} />
        </button>
      </form>
    </div>
  );
}
