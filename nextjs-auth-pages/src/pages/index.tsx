import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { auth } from "@/edgedb";

import { UserHeader } from "@/components/userHeader";
import { TodosList } from "@/components/todos";

export const getServerSideProps = (async ({ req }) => {
  const session = auth.getSession(req);

  if (!(await session.isSignedIn())) {
    return {
      redirect: {
        destination: "/welcome",
        permanent: false,
      },
    };
  }

  const username = await session.client.queryRequiredSingle<string>(
    `select global currentUser.name`
  );

  return {
    props: { username },
  };
}) satisfies GetServerSideProps<{
  username: string;
}>;

export default function Home({
  username,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="p-8 w-[40rem]">
      <UserHeader username={username} />

      <h1 className="text-3xl font-semibold">Todo's</h1>
      <TodosList />
    </main>
  );
}
