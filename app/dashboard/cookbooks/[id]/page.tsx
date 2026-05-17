import { CookbookDetail } from "@/frontend/components/cookbook/CookbookDetail";

export default function Page({ params }: { params: { id: string } }) {
  return <CookbookDetail cookbookId={Number(params.id)} />;
}
