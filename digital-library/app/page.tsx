import Chat from "./components/chat";
import BookCards from "./components/bookCards";
import BooksProvider from "./booksProvider";
import Logo from "./components/logo";

export default function Home() {
  return (
    <div className="flex gap-4 mr-8 h-screen">
      <BooksProvider>
        <BookCards />
        <main className="flex flex-col items-center h-[calc(100vh_-_32px)] gap-4 pb-16 w-full rounded-lg mb-8 relative pt-7">
          <div className="flex flex-col justify-center items-center text-xs max-w-md">
            <Logo />
            <p className="text-placeholder text-center">
              This demo app is backed by EdgeDB, Next.js, and Vercel AI SDK.
              Runs on Vercel and EdgeDB Cloud. Read the blog post for more
              details.
            </p>
          </div>
          <Chat />
        </main>
      </BooksProvider>
    </div>
  );
}
