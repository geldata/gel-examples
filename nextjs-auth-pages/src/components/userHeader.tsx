import { auth } from "@/edgedb.client";

export function UserHeader({ username }: { username: string }) {
  return (
    <div className="flex bg-slate-50 shadow-sm p-3 rounded-xl mb-8 items-center gap-3">
      <span className="mr-auto ml-2">
        <span className="text-slate-500">Signed in as </span>
        {username}
      </span>
      <a
        href={auth.getSignoutUrl()}
        className="border border-slate-200 rounded-lg bg-white py-2 px-3 font-medium text-sm"
      >
        Sign out
      </a>
    </div>
  );
}
