import { prisma } from "@/backend/db/client";

interface DefaultRecipe {
  name: string;
  description: string;
  totalTime: number;
  numberOfServes: number;
  sourceType: "AI_GENERATED" | "MANUAL" | "IMPORTED";
  ingredients: { name: string; icon?: string; quantity?: number; unit?: string }[];
  steps: { stepNumber: number; instruction: string; time?: number }[];
  tags: { name: string; category?: string; emoji?: string }[];
}

const RECOMMENDED_RECIPES: DefaultRecipe[] = [
  {
    name: "Phở Bò truyền thống",
    description: "Món ăn quốc hồn quốc túy của Việt Nam với nước dùng thơm ngọt từ xương ống bò, bánh phở mềm và thịt bò tái chín lòng đào.",
    totalTime: 180,
    numberOfServes: 4,
    sourceType: "AI_GENERATED",
    ingredients: [
      { name: "Thịt bò", icon: "🥩", quantity: 500, unit: "gram" },
      { name: "Bánh phở", icon: "🍜", quantity: 500, unit: "gram" },
      { name: "Gừng", icon: "🫚", quantity: 1, unit: "củ" },
      { name: "Hành tây", icon: "🧅", quantity: 1, unit: "củ" },
      { name: "Hoa hồi", icon: "🌿", quantity: 5, unit: "cái" },
      { name: "Quế", icon: "🪵", quantity: 1, unit: "thanh" },
      { name: "Nước mắm", icon: "🍶", quantity: 4, unit: "muỗng" },
      { name: "Đường", icon: "🧂", quantity: 2, unit: "muỗng" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Ninh xương bò và thịt bò với gừng, hành tây nướng thơm trong 2-3 tiếng.", time: 120 },
      { stepNumber: 2, instruction: "Rang thơm hoa hồi, quế, thảo quả rồi cho vào túi vải thả vào nồi nước dùng.", time: 15 },
      { stepNumber: 3, instruction: "Nêm nếm nước mắm, đường, muối cho vừa vị thanh ngọt.", time: 5 },
      { stepNumber: 4, instruction: "Chần bánh phở, xếp thịt bò thái mỏng lên tô, rắc hành lá và chan nước dùng thật nóng.", time: 10 },
      { stepNumber: 5, instruction: "Thưởng thức kèm chanh, ớt, rau húng và quẩy giòn.", time: 5 }
    ],
    tags: [
      { name: "Bữa sáng", category: "Bữa ăn", emoji: "🌅" },
      { name: "Món canh", category: "Loại món", emoji: "🥣" }
    ]
  },
  {
    name: "Bún Chả Hà Nội",
    description: "Sự kết hợp hoàn hảo giữa thịt nướng thơm lừng, chả viên đậm đà đậm chất Hà Thành cùng nước chấm chua ngọt đu đủ xanh.",
    totalTime: 45,
    numberOfServes: 3,
    sourceType: "AI_GENERATED",
    ingredients: [
      { name: "Thịt heo", icon: "🥩", quantity: 500, unit: "gram" },
      { name: "Bún", icon: "🍜", quantity: 500, unit: "gram" },
      { name: "Tỏi", icon: "🧄", quantity: 3, unit: "tép" },
      { name: "Nước mắm", icon: "🍶", quantity: 3, unit: "muỗng" },
      { name: "Đường", icon: "🧂", quantity: 2, unit: "muỗng" },
      { name: "Cà rốt", icon: "🥕", quantity: 1, unit: "củ" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Thái thịt ba chỉ thành miếng mỏng và băm nhỏ thịt nạc vai để làm chả viên.", time: 10 },
      { stepNumber: 2, instruction: "Ướp thịt và chả với hành, tỏi băm, nước mắm, đường, dầu hào và nước màu.", time: 15 },
      { stepNumber: 3, instruction: "Nướng thịt trên than hoa đến khi chín vàng ruộm, tỏa mùi thơm đặc trưng.", time: 10 },
      { stepNumber: 4, instruction: "Pha nước chấm ấm nóng với nước mắm, đường, giấm, tỏi, ớt và dưa góp đu đủ, cà rốt.", time: 5 },
      { stepNumber: 5, instruction: "Dọn bún, rau sống (kinh giới, tía tô) cùng thịt nướng ra đĩa và thưởng thức.", time: 5 }
    ],
    tags: [
      { name: "Bữa trưa", category: "Bữa ăn", emoji: "☀️" },
      { name: "Món mặn", category: "Loại món", emoji: "🥘" }
    ]
  },
  {
    name: "Gỏi Cuốn Tôm Thịt",
    description: "Món ăn thanh mát, tốt cho sức khỏe với tôm luộc đỏ au, thịt ba chỉ béo ngậy cuộn cùng rau sống trong bánh tráng dẻo.",
    totalTime: 20,
    numberOfServes: 2,
    sourceType: "AI_GENERATED",
    ingredients: [
      { name: "Tôm", icon: "🍤", quantity: 200, unit: "gram" },
      { name: "Thịt heo", icon: "🥩", quantity: 200, unit: "gram" },
      { name: "Hành lá", icon: "🌿", quantity: 5, unit: "nhánh" },
      { name: "Tỏi", icon: "🧄", quantity: 2, unit: "tép" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Luộc chín tôm và thịt ba chỉ với chút muối, sau đó bóc vỏ tôm xẻ đôi, thái mỏng thịt.", time: 10 },
      { stepNumber: 2, instruction: "Rửa sạch các loại rau sống đi kèm như hẹ, xà lách, rau thơm.", time: 3 },
      { stepNumber: 3, instruction: "Làm ướt nhẹ bánh tráng, xếp rau sống, bún, thịt và tôm dọc theo mép cuốn.", time: 5 },
      { stepNumber: 4, instruction: "Cuộn tròn chặt tay, trang trí bằng một nhánh hẹ xanh thò ra ngoài.", time: 2 }
    ],
    tags: [
      { name: "Ăn vặt", category: "Loại món", emoji: "🍟" },
      { name: "Món mặn", category: "Loại món", emoji: "🥘" }
    ]
  },
  {
    name: "Bánh Mì kẹp thịt Việt Nam",
    description: "Món ăn đường phố nổi tiếng toàn cầu, vỏ bánh mì giòn tan kẹp pate béo ngậy, chả lụa thơm ngon và đồ chua thanh mát.",
    totalTime: 15,
    numberOfServes: 1,
    sourceType: "AI_GENERATED",
    ingredients: [
      { name: "Thịt heo", icon: "🥩", quantity: 100, unit: "gram" },
      { name: "Dầu ăn", icon: "🛢️", quantity: 1, unit: "muỗng" },
      { name: "Tỏi", icon: "🧄", quantity: 1, unit: "tép" },
      { name: "Cà rốt", icon: "🥕", quantity: 0.5, unit: "củ" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Làm nóng bánh mì trong lò nướng cho vỏ thật giòn.", time: 3 },
      { stepNumber: 2, instruction: "Phết đều bơ béo và pate gan thơm ngậy vào bên trong ruột bánh mì.", time: 2 },
      { stepNumber: 3, instruction: "Xếp chả lụa thái mỏng, thịt xá xíu hoặc thịt nguội vào ổ bánh.", time: 3 },
      { stepNumber: 4, instruction: "Thêm đồ chua (cà rốt, củ cải ngâm chua ngọt), dưa leo thái lát và rau ngò.", time: 5 },
      { stepNumber: 5, instruction: "Rưới chút nước sốt thịt đậm đà, tương ớt cay nồng rồi kẹp lại thưởng thức.", time: 2 }
    ],
    tags: [
      { name: "Bữa sáng", category: "Bữa ăn", emoji: "🌅" },
      { name: "Ăn vặt", category: "Loại món", emoji: "🍟" }
    ]
  },
  {
    name: "Cơm Tấm sườn bì chả",
    description: "Đặc sản miền Nam trứ danh với hạt cơm tấm dẻo thơm, sườn nướng mật ong đậm đà, bì thính dai giòn và chả trứng hấp béo bùi.",
    totalTime: 45,
    numberOfServes: 2,
    sourceType: "AI_GENERATED",
    ingredients: [
      { name: "Cơm nguội", icon: "🍚", quantity: 2, unit: "bát" },
      { name: "Thịt heo", icon: "🥩", quantity: 300, unit: "gram" },
      { name: "Trứng", icon: "🥚", quantity: 2, unit: "quả" },
      { name: "Nước mắm", icon: "🍶", quantity: 2, unit: "muỗng" },
      { name: "Tỏi", icon: "🧄", quantity: 2, unit: "tép" },
      { name: "Đường", icon: "🧂", quantity: 1, unit: "muỗng" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Ượp sườn cốt lết với mật ong, dầu hào, hành tỏi băm và chút ngũ vị hương.", time: 15 },
      { stepNumber: 2, instruction: "Làm chả trứng bằng cách trộn thịt băm, mộc nhĩ, bún tàu, lòng đỏ trứng rồi đem hấp chín.", time: 15 },
      { stepNumber: 3, instruction: "Nướng sườn trên lửa than vừa đến khi vàng đều hai mặt và mọng nước.", time: 10 },
      { stepNumber: 4, instruction: "Nấu cơm tấm xới ra đĩa, xếp sườn nướng, chả trứng hấp lên trên.", time: 3 },
      { stepNumber: 5, instruction: "Rưới mỡ hành béo ngậy, ăn kèm nước mắm chua ngọt pha kẹo và dưa góp.", time: 2 }
    ],
    tags: [
      { name: "Bữa trưa", category: "Bữa ăn", emoji: "☀️" },
      { name: "Món mặn", category: "Loại món", emoji: "🥘" },
      { name: "Bữa tối", category: "Bữa ăn", emoji: "🌙" }
    ]
  },
  {
    name: "Bún Bò Huế",
    description: "Hương vị cay nồng, đậm đà đặc trưng của cố đô Huế với nước dùng thơm lừng mùi mắm ruốc, sả cây nướng và giò heo béo ngậy.",
    totalTime: 120,
    numberOfServes: 4,
    sourceType: "AI_GENERATED",
    ingredients: [
      { name: "Thịt bò", icon: "🥩", quantity: 400, unit: "gram" },
      { name: "Thịt heo", icon: "🥩", quantity: 400, unit: "gram" },
      { name: "Gừng", icon: "🫚", quantity: 1, unit: "củ" },
      { name: "Tỏi", icon: "🧄", quantity: 3, unit: "tép" },
      { name: "Hành tây", icon: "🧅", quantity: 1, unit: "củ" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Hầm giò heo, nạm bò với sả đập dập và hành tây nướng thơm.", time: 90 },
      { stepNumber: 2, instruction: "Hòa mắm ruốc Huế với nước lạnh, lọc lấy nước trong đổ vào nồi nước dùng.", time: 5 },
      { stepNumber: 3, instruction: "Phi thơm tỏi, hành và sả băm với dầu màu điều để tạo màu sắc đỏ cam đặc trưng.", time: 10 },
      { stepNumber: 4, instruction: "Nêm nước dùng vừa ăn, thả chả cua hoặc chả bò vào nồi đun sôi nhẹ.", time: 10 },
      { stepNumber: 5, instruction: "Xếp bún sợi to vào tô, thêm thịt bò, giò heo, rắc hành lá và chan nước dùng cay nồng.", time: 5 }
    ],
    tags: [
      { name: "Bữa trưa", category: "Bữa ăn", emoji: "☀️" },
      { name: "Món canh", category: "Loại món", emoji: "🥣" }
    ]
  },
  {
    name: "Cá Kho Tộ truyền thống",
    description: "Món ăn đưa cơm bậc nhất Việt Nam với cá kho kẹo đậm đà vị mắm, ngọt ngào vị đường thắng và cay nồng tiêu sọ.",
    totalTime: 40,
    numberOfServes: 3,
    sourceType: "AI_GENERATED",
    ingredients: [
      { name: "Nước mắm", icon: "🍶", quantity: 4, unit: "muỗng" },
      { name: "Đường", icon: "🧂", quantity: 3, unit: "muỗng" },
      { name: "Tỏi", icon: "🧄", quantity: 3, unit: "tép" },
      { name: "Dầu ăn", icon: "🛢️", quantity: 2, unit: "muỗng" },
      { name: "Tiêu", icon: "🧂", quantity: 1, unit: "muỗng cafe" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Cá cắt khúc rửa sạch, ướp với nước mắm ngon, nước màu dừa, đường, hành tỏi băm.", time: 15 },
      { stepNumber: 2, instruction: "Phi thơm hành tỏi băm trong niêu đất, xếp cá vào nồi cho săn thịt.", time: 5 },
      { stepNumber: 3, instruction: "Đổ nước dừa tươi xâm xấp mặt cá, đun lửa lớn đến khi sôi bùng thì hạ nhỏ lửa.", time: 5 },
      { stepNumber: 4, instruction: "Kho liu riu đến khi nước kho sánh lại, lên màu nâu cánh gián bóng bẩy.", time: 10 },
      { stepNumber: 5, instruction: "Thêm ớt hiểm chín đỏ, hành lá thái khúc, rắc nhiều tiêu bột rồi tắt bếp.", time: 5 }
    ],
    tags: [
      { name: "Bữa tối", category: "Bữa ăn", emoji: "🌙" },
      { name: "Món mặn", category: "Loại món", emoji: "🥘" }
    ]
  },
  {
    name: "Bánh Xèo Nam Bộ",
    description: "Vỏ bánh giòn tan màu vàng ươm nghệ, ôm trọn nhân tôm thịt béo ngọt, giá đỗ thanh mát cuộn cùng rau cải xanh.",
    totalTime: 30,
    numberOfServes: 3,
    sourceType: "AI_GENERATED",
    ingredients: [
      { name: "Tôm", icon: "🍤", quantity: 150, unit: "gram" },
      { name: "Thịt heo", icon: "🥩", quantity: 150, unit: "gram" },
      { name: "Dầu ăn", icon: "🛢️", quantity: 3, unit: "muỗng" },
      { name: "Tỏi", icon: "🧄", quantity: 2, unit: "tép" },
      { name: "Nước mắm", icon: "🍶", quantity: 2, unit: "muỗng" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Khuấy bột bánh xèo với nước cốt dừa, bột nghệ và hành lá cắt nhỏ.", time: 10 },
      { stepNumber: 2, instruction: "Xào sơ tôm, thịt ba chỉ thái mỏng với tỏi băm trong chảo sâu lòng cho chín tái.", time: 5 },
      { stepNumber: 3, instruction: "Tráng một lớp bột mỏng xung quanh chảo, đậy vung lại trong 2 phút cho bột chín giòn.", time: 5 },
      { stepNumber: 4, instruction: "Thêm giá đỗ lên trên nhân tôm thịt, gập đôi bánh lại khi vỏ ngoài đã vàng giòn rụm.", time: 5 },
      { stepNumber: 5, instruction: "Ăn nóng cuộn với lá cải bẹ xanh, xà lách, rau thơm và chấm nước mắm tỏi ớt ngọt.", time: 5 }
    ],
    tags: [
      { name: "Ăn vặt", category: "Loại món", emoji: "🍟" },
      { name: "Món mặn", category: "Loại món", emoji: "🥘" }
    ]
  },
  {
    name: "Canh Chua Cá Lóc",
    description: "Món canh đậm chất Nam Bộ chua thanh từ me ngọt, dứa thơm, cà chua chín đỏ cùng cá lóc tươi rói ngọt thịt.",
    totalTime: 25,
    numberOfServes: 4,
    sourceType: "AI_GENERATED",
    ingredients: [
      { name: "Cà chua", icon: "🍅", quantity: 2, unit: "quả" },
      { name: "Tỏi", icon: "🧄", quantity: 2, unit: "tép" },
      { name: "Nước mắm", icon: "🍶", quantity: 2, unit: "muỗng" },
      { name: "Đường", icon: "🧂", quantity: 2, unit: "muỗng" },
      { name: "Dầu ăn", icon: "🛢️", quantity: 1, unit: "muỗng" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Làm sạch cá lóc cắt khúc luộc sơ qua nước nóng để khử tanh.", time: 5 },
      { stepNumber: 2, instruction: "Nấu nước sôi, dầm me lấy nước chua đổ vào nồi nước dùng.", time: 5 },
      { stepNumber: 3, instruction: "Cho thơm thái lát, cà chua múi cau, dọc mùng, đậu bắp vào đun chín tới.", time: 5 },
      { stepNumber: 4, instruction: "Cho khúc cá lóc vào đun cùng, nêm nước mắm và đường cho vị chua ngọt hài hòa.", time: 5 },
      { stepNumber: 5, instruction: "Thêm giá đỗ, tắt bếp, rắc tỏi phi vàng thơm, ngò gai, rau ngổ lên trên.", time: 5 }
    ],
    tags: [
      { name: "Bữa trưa", category: "Bữa ăn", emoji: "☀️" },
      { name: "Món canh", category: "Loại món", emoji: "🥣" }
    ]
  },
  {
    name: "Thịt Kho Tàu nước dừa",
    description: "Món thịt kho truyền thống đậm đà màu cánh gián bắt mắt, thịt mềm nhừ tan trong miệng kết hợp trứng vịt bùi béo.",
    totalTime: 60,
    numberOfServes: 4,
    sourceType: "AI_GENERATED",
    ingredients: [
      { name: "Thịt heo", icon: "🥩", quantity: 500, unit: "gram" },
      { name: "Trứng", icon: "🥚", quantity: 4, unit: "quả" },
      { name: "Nước mắm", icon: "🍶", quantity: 3, unit: "muỗng" },
      { name: "Đường", icon: "🧂", quantity: 2, unit: "muỗng" },
      { name: "Tỏi", icon: "🧄", quantity: 2, unit: "tép" },
      { name: "Dầu ăn", icon: "🛢️", quantity: 1, unit: "muỗng" }
    ],
    steps: [
      { stepNumber: 1, instruction: "Thái thịt ba chỉ thành những miếng vuông to cỡ 4-5cm.", time: 10 },
      { stepNumber: 2, instruction: "Ướp thịt với hành tỏi băm, nước mắm, đường cát vàng trong ít nhất 1 giờ.", time: 10 },
      { stepNumber: 3, instruction: "Đun nước dừa tươi cùng nước lọc, cho thịt đã ướp vào đun sôi bùng, vớt bọt.", time: 10 },
      { stepNumber: 4, instruction: "Hạ lửa nhỏ kho liu riu trong 1-2 tiếng cho thịt chín mềm rục rã và lên màu tự nhiên.", time: 20 },
      { stepNumber: 5, instruction: "Cho trứng luộc bóc vỏ vào kho chung thêm 20 phút cho thấm gia vị đậm đà.", time: 10 }
    ],
    tags: [
      { name: "Bữa tối", category: "Bữa ăn", emoji: "🌙" },
      { name: "Món mặn", category: "Loại món", emoji: "🥘" }
    ]
  }
];

export async function seedDefaultRecipesForUser(userId: string) {
  console.log(`🌱 Seeding 10 recommended recipes for user: ${userId}...`);

  for (const recipe of RECOMMENDED_RECIPES) {
    // 1. Resolve ingredients and create if missing
    const recipeIngredientsData = [];
    for (const ing of recipe.ingredients) {
      let dbIng = await prisma.ingredient.findFirst({
        where: { name: { equals: ing.name, mode: "insensitive" } }
      });

      if (!dbIng) {
        dbIng = await prisma.ingredient.create({
          data: {
            name: ing.name,
            icon: ing.icon || "🍳",
            bgColor: "#F5F5F5"
          }
        });
      }

      recipeIngredientsData.push({
        ingredientId: dbIng.ingredientId,
        quantity: ing.quantity || null,
        unit: ing.unit || null
      });
    }

    // 2. Resolve tags and create if missing
    const recipeTagsData = [];
    for (const tag of recipe.tags) {
      let dbTag = await prisma.tag.findFirst({
        where: { name: { equals: tag.name, mode: "insensitive" } }
      });

      if (!dbTag) {
        dbTag = await prisma.tag.create({
          data: {
            name: tag.name,
            category: tag.category || "Khác",
            emoji: tag.emoji || "🏷️"
          }
        });
      }

      recipeTagsData.push({
        tagId: dbTag.tagId
      });
    }

    // 3. Create the recipe
    await prisma.recipe.create({
      data: {
        userId,
        recipesName: recipe.name,
        description: recipe.description,
        totalTime: recipe.totalTime,
        numberOfServes: recipe.numberOfServes,
        sourceType: recipe.sourceType,
        steps: {
          create: recipe.steps.map(s => ({
            stepNumber: s.stepNumber,
            instruction: s.instruction,
            time: s.time || null
          }))
        },
        recipeIngredients: {
          create: recipeIngredientsData.map(ri => ({
            ingredientId: ri.ingredientId,
            quantity: ri.quantity,
            unit: ri.unit
          }))
        },
        recipeTags: {
          create: recipeTagsData.map(rt => ({
            tagId: rt.tagId
          }))
        }
      }
    });
  }

  console.log(`✅ Completed seeding recommended recipes for user: ${userId}`);
}
