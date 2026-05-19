import { RecipeDetailPage } from "@/frontend/components/pages/RecipeDetailPage";

export default function Page({ params }: { params: { id: string } }) {
  return <RecipeDetailPage recipeId={Number(params.id)} />;
}
