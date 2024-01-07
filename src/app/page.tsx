import { useState } from "react";
import CreateUser from "~/components/CreateUser";
import UserCard from "~/components/UserCard/UserCard";
import { api } from "~/trpc/server";

export default async function Home() {
  const users = await api.user.getAll.query();
  return (
    <>
      <main className="flex min-h-screen flex-wrap items-center justify-center  ">
        <CreateUser />
        {users.map((user) => {
          return <UserCard user={user} key={user.id} />;
        })}
      </main>
    </>
  );
}
