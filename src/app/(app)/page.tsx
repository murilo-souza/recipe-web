import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();

  return (
    <h1>Bem-vindo, {session?.email}!</h1>
  );
}
