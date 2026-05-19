import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/backend/db/client";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json({ error: "Vui lòng cung cấp hình ảnh nguyên liệu" }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    // Lưu trữ ảnh tải lên cục bộ vào public/uploads/ để giữ lại hình ảnh gốc của người dùng
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const fileExtension = file.name ? (file.name.split(".").pop() || "jpg") : "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.promises.writeFile(filePath, buffer);
    const localImageUrl = `/uploads/${fileName}`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chưa cấu hình GEMINI_API_KEY trong file .env" }, { status: 500 });
    }

    const prompt = `Bạn là một chuyên gia ẩm thực AI thông minh. Hãy nhận diện tất cả các nguyên liệu nấu ăn có trong ảnh. Sau đó, gợi ý một công thức nấu ăn ngon, sáng tạo và phù hợp nhất sử dụng các nguyên liệu đó (có thể thêm các gia vị cơ bản thông dụng). Trả về kết quả dưới dạng JSON có cấu trúc chính xác như sau:
    {
      "title": "Tên món ăn bằng tiếng Việt",
      "description": "Mô tả ngắn gọn và hấp dẫn về món ăn",
      "ingredients": ["danh sách tên nguyên liệu nhận diện được và gia vị cần dùng, ví dụ: '2 quả Trứng', '2 bát Cơm nguội', 'Hành lá'"],
      "instructions": ["danh sách các bước thực hiện chi tiết"],
      "cookTime": 20, // thời gian nấu ước tính bằng phút (số nguyên)
      "servings": 2, // số người ăn ước tính (số nguyên)
      "unsplashKeyword": "từ khóa tiếng Anh ngắn gọn và cơ bản nhất liên quan đến món ăn để tìm ảnh trên Unsplash, ví dụ: 'fried-rice', 'soup', 'beef', 'salad', 'chicken', 'noodles'"
    }`;

    // Gọi API của Google Gemini 2.5 Flash
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error?.code === 429 || errJson.error?.status === "RESOURCE_EXHAUSTED") {
          return NextResponse.json({ 
            error: "Hệ thống AI Google đang quá tải hoặc địa chỉ IP mạng của bạn đang bị giới hạn lượt quét thử miễn phí. Mẹo nhỏ: Bạn hãy thử đổi mạng Wifi, dùng 4G hoặc bật/tắt VPN để đổi địa chỉ IP mới, sau đó tải lại trang và quét lại nhé!" 
          }, { status: 429 });
        }
      } catch {}

      return NextResponse.json({ error: "Không thể nhận diện hình ảnh từ Gemini API" }, { status: 500 });
    }

    const resData = await response.json();
    const textResult = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResult) {
      return NextResponse.json({ error: "Không nhận diện được nội dung từ hình ảnh" }, { status: 500 });
    }

    const parsedResult = JSON.parse(textResult);

    // Lưu lại log quét ảnh vào Database
    const scanLog = await prisma.scanLog.create({
      data: {
        imageUrl: localImageUrl,
        detectedItems: parsedResult.ingredients,
        confidenceScore: 0.95,
      },
    });

    return NextResponse.json({
      recipe: {
        title: parsedResult.title || "Món ăn từ nguyên liệu của bạn",
        description: parsedResult.description || "Công thức nấu ăn hấp dẫn",
        ingredients: parsedResult.ingredients || [],
        instructions: parsedResult.instructions || [],
        cookTime: Number(parsedResult.cookTime) || 15,
        servings: Number(parsedResult.servings) || 2,
        image_recipe: localImageUrl
      },
      scanLogId: scanLog.id,
    });
  } catch (error: any) {
    console.error("Scan error:", error);
    return NextResponse.json({ error: error.message || "Lỗi máy chủ trong quá trình quét ảnh" }, { status: 500 });
  }
}
