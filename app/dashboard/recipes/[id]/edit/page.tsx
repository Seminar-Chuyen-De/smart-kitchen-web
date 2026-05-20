import { RecipeEditPage } from "@/frontend/components/pages/RecipeEditPage";

export default function Page({ params }: { params: { id: string } }) {
  return <RecipeEditPage recipeId={Number(params.id)} />;
}
