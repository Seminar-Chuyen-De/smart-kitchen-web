<div align="center">

# 🍳 Smart Kitchen VN

**Ứng dụng web nấu ăn thông minh ứng dụng kiến trúc Multi-Agent AI**

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Claude Sonnet](https://img.shields.io/badge/Claude_Sonnet_4.5-D97757?style=flat-square&logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)


</div>

---


## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Video Demo](#-video-demo)
- [Tính Năng](#-tính-năng)
- [Kiến Trúc Hệ Thống](#️-kiến-trúc-hệ-thống)
- [Tech Stack](#-tech-stack)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt & Chạy Dự Án](#-cài-đặt--chạy-dự-án)
- [Biến Môi Trường](#-biến-môi-trường)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [Tài Liệu Liên Quan](#-tài-liệu-liên-quan)
- [Thành Viên Nhóm](#-thành-viên-nhóm)

---

## 🎯 Giới Thiệu

**Smart Kitchen VN** là ứng dụng web nấu ăn thông minh, giải quyết bài toán thực tế: _"Tủ lạnh có gì, nấu món gì?"_

Người dùng chỉ cần **chụp hoặc tải lên ảnh nguyên liệu** — hệ thống AI sẽ tự động nhận diện nguyên liệu, đề xuất công thức nấu ăn phù hợp và lưu vào sổ tay cá nhân. Dự án được xây dựng theo mô hình **Multi-Agent System (MSA)**, trong đó nhiều AI Agent chuyên biệt phối hợp với nhau để hoàn thành toàn bộ pipeline từ ảnh đầu vào đến công thức đầu ra.

### Vấn Đề Giải Quyết

| Vấn đề | Giải pháp của Smart Kitchen |
|---|---|
| Không biết nấu gì với nguyên liệu sẵn có | AI tự nhận diện và đề xuất công thức phù hợp |
| Mất thời gian tra cứu công thức thủ công | Sinh công thức tự động trong vài giây |
| Khó quản lý và lưu trữ công thức yêu thích | Cookbook cá nhân với tìm kiếm và lọc nâng cao |
| Thiếu thông tin dinh dưỡng khi nấu ăn | AI tự tính toán và cung cấp thông tin dinh dưỡng |

## ✨ Tính Năng

### Tính Năng Cốt Lõi

| # | Tính năng | Mô tả |
|---|---|---|
| 1 | **🔍 AI Scan Nguyên Liệu** | Tải ảnh lên → Google Cloud Vision nhận diện nguyên liệu tự động |
| 2 | **🍳 Sinh Công Thức Tự Động** | Claude Sonnet 4.5 đề xuất công thức, các bước nấu và thông tin dinh dưỡng |
| 3 | **📚 Quản Lý Cookbook** | Lưu, chỉnh sửa và xem lại các công thức cá nhân |
| 4 | **✍️ Tạo Công Thức Thủ Công** | Nhập công thức trực tiếp qua form không cần AI |
| 5 | **🔎 Tìm Kiếm & Lọc** | Lọc theo tags, nguyên liệu, thời gian nấu |
| 6 | **🔐 Xác Thực Người Dùng** | Đăng ký / đăng nhập an toàn qua Clerk |
| 7 | **📊 Thông Tin Dinh Dưỡng** | Hiển thị calories, protein, fat, carbs cho mỗi công thức |

---

## 🏗️ Kiến Trúc Hệ Thống

Dự án áp dụng mô hình **Orchestrator + Specialist Agents**, trong đó mỗi agent đảm nhiệm một nhiệm vụ chuyên biệt và phối hợp thông qua Orchestrator trung tâm.

```
                         ┌──────────────────────────┐
    POST /api/           │                          │
    ai/analyze-image ──► │    Orchestrator Agent    │
                         │  orchestrator.agent.ts   │
                         └────────────┬─────────────┘
                                      │
             ┌──────────────────────┬─┴──────────────────────┐
             ▼                      ▼                         ▼
  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
  │   Vision Agent    │  │   Recipe Agent    │  │  Storage Agent    │
  │ vision.agent.ts   │  │  recipe.agent.ts  │  │ storage.agent.ts  │
  │                   │  │                   │  │                   │
  │  Google Cloud     │  │  Claude Sonnet    │  │  Prisma ORM +     │
  │  Vision API       │  │      4.5          │  │  PostgreSQL       │
  │                   │  │                   │  │                   │
  │ image → string[]  │  │ string[] →        │  │ RecipeDTO →       │
  │  ingredients      │  │  RecipeDTO        │  │  recipe_id ✅     │
  └───────────────────┘  └───────────────────┘  └───────────────────┘
```

### Phân Chia Trách Nhiệm Các Agent

| Agent | File | Đầu vào | Đầu ra | Công nghệ |
|---|---|---|---|---|
| **Orchestrator** | `orchestrator.agent.ts` | HTTP Request | Kết quả tổng hợp | TypeScript |
| **Vision Agent** | `vision.agent.ts` | Image binary | `string[]` ingredients | Google Cloud Vision API |
| **Recipe Agent** | `recipe.agent.ts` | `string[]` ingredients | `RecipeDTO` | Claude Sonnet 4.5 |
| **Storage Agent** | `storage.agent.ts` | `RecipeDTO` | `recipe_id` | Prisma + PostgreSQL |

### Luồng Dữ Liệu Chính

```
User upload ảnh
     │
     ▼  POST /api/ai/analyze-image
[Route Handler]  (app/api/ai/analyze-image/route.ts)
     │
     ▼
[Orchestrator Agent] ──► [Vision Agent] ──► Google Cloud Vision
                                │              → ["cà chua", "trứng", "hành tây", ...]
                                ▼
                         [Recipe Agent] ──► Claude Sonnet 4.5
                                │              → { recipeName, steps[], nutrition, tags }
                                ▼
                         [Storage Agent] ──► Prisma ORM ──► PostgreSQL
                                               → recipe_id ✅
     │
     ▼
Frontend redirect → /recipes/[id]  →  Hiển thị công thức chi tiết
```

---

## 🛠️ Tech Stack

### Frontend
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| [Next.js](https://nextjs.org/) | 14 (App Router) | Framework chính |
| [React](https://react.dev/) | 18 | UI Library |
| [Tailwind CSS](https://tailwindcss.com/) | 3 | Styling |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Ngôn ngữ lập trình |

### Backend & Database
| Công nghệ | Phiên bản | Vai trò |
|---|---|---|
| [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | 14 | API layer |
| [Prisma ORM](https://www.prisma.io/) | 5 | Database toolkit |
| [PostgreSQL](https://www.postgresql.org/) | 14+ | Cơ sở dữ liệu |
| [Zod](https://zod.dev/) | 3 | Validation schema |
| [Clerk](https://clerk.com/) | 5 | Authentication |

### AI & Agent System
| Công nghệ | Vai trò |
|---|---|
| [Claude Sonnet 4.5](https://www.anthropic.com/) (Anthropic) | Sinh công thức nấu ăn |
| [Google Cloud Vision API](https://cloud.google.com/vision) | Nhận diện nguyên liệu từ ảnh |
| [MCP — PostgreSQL Server](https://modelcontextprotocol.io/) | Kết nối AI với database |
| [Context7 MCP](https://context7.com/) | Tra cứu tài liệu kỹ thuật cho AI |

---

## 📁 Cấu Trúc Thư Mục

```
smart-kitchen-web/
│
├── 📄 README.md
├── 📄 .env.example
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 next.config.mjs
│
├── 📂 app/                                  ← Routing layer (3–15 dòng/file, không chứa logic)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   └── api/
│       ├── ai/
│       │   └── analyze-image/route.ts       ← POST: Kích hoạt toàn bộ AI pipeline
│       └── recipes/
│           ├── route.ts                     ← GET (list) + POST (create)
│           └── [id]/route.ts                ← GET / PUT / DELETE
│
├── 📂 Frontend/                             ← Mọi thứ chạy trên browser
│   ├── components/
│   │   ├── IngredientUpload.tsx             ← Upload ảnh nguyên liệu
│   │   ├── RecipeCard.tsx                   ← Thẻ hiển thị công thức
│   │   ├── RecipeDetail.tsx                 ← Trang chi tiết công thức
│   │   └── CookbookList.tsx                 ← Danh sách cookbook
│   ├── hooks/
│   │   └── useRecipes.ts
│   ├── styles/
│   └── contexts/
│
├── 📂 Backend/                              ← Logic server, KHÔNG gọi AI từ đây
│   ├── services/
│   │   └── recipe.service.ts                ← Business logic CRUD công thức
│   ├── schemas/
│   │   └── recipe.schema.ts                 ← Zod validation schemas
│   ├── middleware/
│   │   └── auth.middleware.ts               ← Clerk auth middleware
│   └── db/
│       └── client.ts                        ← Prisma client singleton
│
├── 📂 AI/                                   ← 🧠 Multi-Agent System
│   ├── agents/
│   │   ├── orchestrator.agent.ts            ← Điều phối toàn bộ pipeline
│   │   ├── vision.agent.ts                  ← Nhận diện nguyên liệu từ ảnh
│   │   ├── recipe.agent.ts                  ← Sinh công thức với Claude
│   │   └── storage.agent.ts                 ← Lưu kết quả vào database
│   ├── tools/
│   │   └── vision.tool.ts                   ← Google Vision API wrapper
│   ├── prompts/
│   │   └── recipe-generation.prompt.ts      ← System prompt cho Recipe Agent
│   └── workflows/
│       └── recipe-generation.workflow.ts    ← Workflow tổng hợp
│
└── 📂 prisma/
    ├── schema.prisma                        ← Database schema (8 bảng)
    ├── seed.ts                              ← Dữ liệu mẫu
    └── migrations/
```

> 📌 **Quy tắc 3-Folder bắt buộc**: Mọi logic phải nằm trong đúng thư mục của mình. `app/` chỉ làm routing. `Backend/` không được gọi AI. `AI/` không truy cập trực tiếp database — phải qua `Backend/services/`.

---

## 💻 Yêu Cầu Hệ Thống

| Công cụ | Phiên bản tối thiểu |
|---|---|
| [Node.js](https://nodejs.org/) | >= 18.x |
| [npm](https://www.npmjs.com/) | >= 9.x |
| [PostgreSQL](https://www.postgresql.org/) | >= 14 |
| Git | >= 2.x |

---

## 🚀 Cài Đặt & Chạy Dự Án

### Bước 1 — Clone Repository

```bash
git clone https://github.com/Seminar-Chuyen-De/smart-kitchen-web.git
cd smart-kitchen-web
```

### Bước 2 — Cài Đặt Dependencies

```bash
npm install
```

### Bước 3 — Cấu Hình Môi Trường

```bash
# Tạo file .env từ template
cp .env.example .env
```

Mở file `.env` và điền đầy đủ các giá trị (xem chi tiết tại [Biến Môi Trường](#-biến-môi-trường)).

### Bước 4 — Cài Đặt Database

```bash
# Generate Prisma client từ schema
npm run db:generate

# Chạy migration để tạo các bảng
npm run db:migrate

# (Tùy chọn) Seed dữ liệu mẫu để test
npm run db:seed
```

### Bước 5 — Khởi Động Ứng Dụng

```bash
# Chạy development server
npm run dev
```

Mở trình duyệt và truy cập: **http://localhost:3000** 🎉

### Các Lệnh Hữu Ích Khác

```bash
npm run build          # Build production
npm run start          # Chạy production server
npm run lint           # Kiểm tra lỗi ESLint
npm run db:studio      # Mở Prisma Studio (GUI quản lý DB)
npm run db:reset       # Reset toàn bộ database (⚠️ xoá hết dữ liệu)
```

---

## 🔐 Biến Môi Trường

Tạo file `.env` tại thư mục gốc với nội dung:

```env
# =============================================
# DATABASE
# =============================================
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/smart_kitchen_db"

# =============================================
# CLERK AUTHENTICATION
# Lấy tại: https://dashboard.clerk.com
# =============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# =============================================
# ANTHROPIC — CLAUDE SONNET 4.5
# Lấy tại: https://console.anthropic.com
# =============================================
ANTHROPIC_API_KEY=sk-ant-api03-...

# =============================================
# GOOGLE CLOUD VISION API
# Lấy tại: https://console.cloud.google.com
# =============================================
GOOGLE_CLOUD_VISION_API_KEY=AIzaSy...

# =============================================
# APP CONFIG
# =============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

> ⚠️ **Lưu ý bảo mật**: File `.env` đã được thêm vào `.gitignore`. **Tuyệt đối không commit** file này lên Git.

### Hướng Dẫn Lấy API Keys

| Key | Nơi lấy |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| `GOOGLE_CLOUD_VISION_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials |
| `CLERK_SECRET_KEY` | [dashboard.clerk.com](https://dashboard.clerk.com) → API Keys |

---

## 📖 Hướng Dẫn Sử Dụng

### 1. Đăng Ký / Đăng Nhập

Truy cập `http://localhost:3000` → Nhấn **Sign Up** để tạo tài khoản mới hoặc **Sign In** nếu đã có tài khoản. Hệ thống sử dụng Clerk để xác thực, hỗ trợ đăng nhập bằng email hoặc tài khoản Google.

### 2. Tạo Công Thức Bằng AI (Tính năng chính)

```
① Nhấn nút "Scan Nguyên Liệu" trên trang chủ
② Chọn hoặc kéo thả ảnh nguyên liệu từ thiết bị
③ Nhấn "Phân tích" — AI sẽ:
   • Nhận diện nguyên liệu từ ảnh (Vision Agent)
   • Sinh công thức phù hợp (Recipe Agent)
   • Tự động lưu vào Cookbook của bạn (Storage Agent)
④ Xem kết quả: tên món, nguyên liệu, các bước nấu, dinh dưỡng
⑤ Chỉnh sửa hoặc lưu vào Cookbook cá nhân
```

### 3. Tạo Công Thức Thủ Công

```
① Nhấn "Tạo Công Thức" → "Nhập thủ công"
② Điền thông tin: Tên món, Nguyên liệu, Các bước nấu
③ Thêm tags phân loại (tuỳ chọn)
④ Nhấn "Lưu" để thêm vào Cookbook
```

### 4. Quản Lý Cookbook

- **Xem danh sách**: Vào trang `/cookbook` để thấy toàn bộ công thức đã lưu
- **Tìm kiếm**: Dùng thanh tìm kiếm để lọc theo tên món hoặc nguyên liệu
- **Lọc theo tags**: Click vào tag để lọc nhanh theo danh mục
- **Chỉnh sửa**: Mở công thức → nhấn biểu tượng ✏️ để sửa
- **Xóa**: Mở công thức → nhấn biểu tượng 🗑️ để xóa

### 5. Path Aliases (Dành cho Developer)

```typescript
import { RecipeCard } from "@/frontend/components/RecipeCard"
import { recipeService } from "@/backend/services/recipe.service"
import { orchestratorAgent } from "@/ai/agents/orchestrator.agent"
import { prisma } from "@/prisma"
```

---

## 📚 Tài Liệu Liên Quan

Dự án được quản lý qua **2 repository riêng biệt** để tách bạch code và context engineering:

| Repository | Nội dung | Link |
|---|---|---|
| 🌐 **smart-kitchen-web** _(repo này)_ | Source code Next.js 14 — toàn bộ code chạy được | [Xem repo](https://github.com/Seminar-Chuyen-De/smart-kitchen-web) |
| 🧠 **Smart-kitchen-prompts** | Context Engineering — Prompts, AI Skills, Kinh nghiệm sửa lỗi, Tài liệu nhóm | [Xem repo](https://github.com/Seminar-Chuyen-De/Smart-kitchen-prompts) |

### Sơ Đồ Quan Hệ Giữa Hai Repo

```
┌────────────────────────────────────┐     git submodule    ┌──────────────────────────────────────┐
│       smart-kitchen-web            │ ◄──────────────────► │    Smart-kitchen-prompts             │
│  (Source Code — chạy được)         │                      │  (Context Engineering — .md files)   │
│                                    │                      │                                      │
│  app/  Frontend/  Backend/  AI/    │                      │  context/    ← CLAUDE.md, AGENTS.md  │
│  prisma/                           │                      │  Frontend/   ← prompts, skills       │
│                                    │                      │  Backend/    ← prompts, skills       │
│  Ngôn ngữ: TypeScript              │                      │  AI-training/ ← prompts, skills     │
└────────────────────────────────────┘                      │  Manager-Documentation/              │
                                                            └──────────────────────────────────────┘
```

### Tài Liệu Quan Trọng Trong Smart-kitchen-prompts

| File | Mô tả |
|---|---|
| `context/CLAUDE.md` | Tech stack, coding rules toàn dự án |
| `context/AGENTS.md` | Thiết kế và phân công 4 AI Agents |
| `context/FLOW.md` | 5 luồng nghiệp vụ chi tiết kèm API list |
| `context/ERD.md` | Schema database quan hệ (8 bảng PostgreSQL) |
| `Manager-Documentation/prompts/BACKLOG.md` | 80+ đầu việc chia theo độ ưu tiên P0–P3 |

---

## 👨‍💻 Thành Viên Nhóm

| Thành viên | Vai trò | Phụ trách |
|---|---|---|
| — | Frontend Developer | UI/UX, React Components, Custom Hooks, Animations |
| — | Backend Developer & QA | API Routes, Database Schema, Prisma, Testing |
| — | AI / Prompt Engineer | Thiết kế prompt, tối ưu pipeline AI, Gemini/Claude |
| — | Project Manager | Backlog, tài liệu báo cáo, Git workflow, MCP config |

---

## 📄 License

Dự án thuộc phạm vi học thuật — **Seminar Chuyên Đề**, không dùng cho mục đích thương mại.

---

<div align="center">

**Smart Kitchen VN** · *Nấu ăn thông minh hơn với AI*

Made with ❤️ by **Seminar-Chuyen-De** team

</div>
