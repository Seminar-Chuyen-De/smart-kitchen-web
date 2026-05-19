// Helper function to map Prisma Recipe model to Frontend's snake_case format
export function mapRecipeToFrontend(recipe: any) {
  if (!recipe) return null;
  return {
    recipe_id: recipe.recipeId,
    recipes_name: recipe.recipesName,
    description: recipe.description || undefined,
    image_recipe: recipe.imageRecipe || undefined,
    total_time: recipe.totalTime || undefined,
    calories: recipe.calories || undefined,
    protein: recipe.protein || undefined,
    carbs: recipe.carbs || undefined,
    fats: recipe.fats || undefined,
    source_type: recipe.sourceType || undefined,
    number_of_serves: recipe.numberOfServes || undefined,
    created_at: recipe.createdAt ? recipe.createdAt.toISOString() : new Date().toISOString(),
    updated_at: recipe.updatedAt ? recipe.updatedAt.toISOString() : undefined,
    ingredients: recipe.recipeIngredients?.map((ri: any) => ({
      ingredient_id: ri.ingredientId,
      name: ri.ingredient?.name || "",
      icon: ri.ingredient?.icon || undefined,
      quantity: ri.quantity || undefined,
      unit: ri.unit || undefined,
      note: ri.note || undefined
    })) || [],
    steps: recipe.steps?.map((s: any) => ({
      step_id: s.stepId,
      step_number: s.stepNumber,
      instruction: s.instruction,
      tip: s.tip || undefined,
      time: s.time || undefined
    })) || [],
    tags: recipe.recipeTags?.map((rt: any) => ({
      tag_id: rt.tagId,
      name: rt.tag?.name || "",
      emoji: rt.tag?.emoji || undefined,
      category: rt.tag?.category || undefined
    })) || []
  };
}

// Helper function to parse ingredient name and return a suitable Emoji
export function getEmojiForIngredient(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("cơm") || lower.includes("gạo")) return "🍚";
  if (lower.includes("trứng")) return "🥚";
  if (
    lower.includes("thịt heo") ||
    lower.includes("thịt lợn") ||
    lower.includes("heo") ||
    lower.includes("lợn") ||
    lower.includes("ham") ||
    lower.includes("xúc xích") ||
    lower.includes("giò") ||
    lower.includes("chả") ||
    lower.includes("lạp xưởng") ||
    lower.includes("thịt nguội")
  ) return "🐷";
  if (lower.includes("bò")) return "🐮";
  if (lower.includes("gà")) return "🐔";
  if (lower.includes("vịt")) return "🦆";
  if (lower.includes("cá")) return "🐟";
  if (lower.includes("tôm")) return "🍤";
  if (lower.includes("cua") || lower.includes("ghẹ")) return "🦀";
  if (lower.includes("mực") || lower.includes("bạch tuộc")) return "🦑";
  if (lower.includes("tỏi")) return "🧄";
  if (lower.includes("hành")) return "🧅";
  if (lower.includes("ớt")) return "🌶️";
  if (lower.includes("cà chua")) return "🍅";
  if (lower.includes("cà rốt")) return "🥕";
  if (lower.includes("ngô") || lower.includes("bắp")) return "🌽";
  if (lower.includes("khoai")) return "🥔";
  if (lower.includes("dưa chuột") || lower.includes("dưa leo") || lower.includes("dưa")) return "🥒";
  if (lower.includes("dứa") || lower.includes("thơm")) return "🍍";
  if (
    lower.includes("rau") ||
    lower.includes("cải") ||
    lower.includes("xà lách") ||
    lower.includes("ngò") ||
    lower.includes("húng") ||
    lower.includes("tía tô") ||
    lower.includes("mùi") ||
    lower.includes("hành lá")
  ) return "🥬";
  if (lower.includes("nấm") || lower.includes("mộc nhĩ")) return "🍄";
  if (lower.includes("đậu") || lower.includes("đỗ") || lower.includes("tương")) return "🫘";
  if (lower.includes("bí") || lower.includes("mướp")) return "🍈";
  if (lower.includes("chanh")) return "🍋";
  if (lower.includes("bột") || lower.includes("mì") || lower.includes("nui")) return "🌾";
  if (lower.includes("bánh")) return "🫓";
  if (lower.includes("sữa")) return "🥛";
  if (lower.includes("phô mai") || lower.includes("cheese")) return "🧀";
  if (lower.includes("dầu") || lower.includes("mỡ") || lower.includes("bơ")) return "🥑";
  if (lower.includes("mắm") || lower.includes("xì dầu") || lower.includes("nước tương")) return "🍶";
  if (lower.includes("muối") || lower.includes("đường") || lower.includes("tiêu") || lower.includes("hạt nêm") || lower.includes("gia vị")) return "🧂";
  if (lower.includes("bún") || lower.includes("phở") || lower.includes("hủ tiếu") || lower.includes("mỳ")) return "🍜";
  if (lower.includes("giá đỗ") || lower.includes("giá")) return "🌱";
  return "🍳"; // default
}
