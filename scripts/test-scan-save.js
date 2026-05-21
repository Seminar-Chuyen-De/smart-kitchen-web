const fetch = require("node-fetch");

async function testPost() {
  const payload = {
    recipes_name: "Cơm Chiên Trứng (Test AI Save)",
    description: "Một món ăn đơn giản từ AI",
    total_time: 15,
    number_of_serves: 2,
    source_type: "AI_GENERATED",
    image_recipe: "/uploads/dummy.jpg",
    ingredients: [
      {
        name: "Cơm nguội",
        quantity: undefined,
        unit: undefined,
        note: undefined
      },
      {
        name: "Trứng",
        quantity: undefined,
        unit: undefined,
        note: undefined
      }
    ],
    steps: [
      {
        step_number: 1,
        instruction: "Bật bếp, chiên trứng.",
        tip: undefined,
        time: undefined
      }
    ]
  };

  try {
    const res = await fetch("http://localhost:3000/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("STATUS:", res.status);
    console.log("RESPONSE:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
}

testPost();
