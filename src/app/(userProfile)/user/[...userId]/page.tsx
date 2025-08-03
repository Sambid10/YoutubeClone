export const dynamic = "force-dynamic";
import { getQueryClient, HydrateClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import UserProfileView from "@/modules/Home/views/UserProfileView";
type ParamsType = Promise<{ userId: string }>
export default async function Home({params}:{params:ParamsType}) {
  const { userId } = await params;
  const singleuserId=userId[0]
  if (!singleuserId) {
    return <h1>No userid</h1>;
  }
  console.log(userId, "ASSSSS");

  const queryclient = getQueryClient();
  void queryclient.prefetchQuery(
    trpc.User.getOne.queryOptions({
      userId: singleuserId,
    })
  );
  return (
    <HydrateClient>
      <UserProfileView userId={singleuserId} />
    </HydrateClient>
  );
}
