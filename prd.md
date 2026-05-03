# Product Requirements Document (PRD)
## Azzam Barokah Steel — Custom Stainless Steel Website

**Version:** 2.0  
**Date:** April 22, 2026  
**Intended Reader:** AI Coding Agent (Qwen)  
**Status:** Ready for Agent Execution

---

## ⚠️ Agent Execution Instructions

This PRD is written to be executed by an AI coding agent. Follow these rules strictly:

1. **Read the entire PRD before writing any code.**
2. **Work sequentially through phases** — do not skip ahead.
3. **Do not ask for clarification** unless a specification is genuinely contradictory. Make reasonable decisions and document them in code comments.
4. **Scope is LOCAL ONLY** — do not configure Vercel, Supabase, Railway, or any cloud deployment. All work runs on `localhost` with Laragon PostgreSQL.
5. **All UI text must be in Bahasa Indonesia.** All code, variable names, and comments must be in English.
6. **After each phase, verify the app runs with `npm run dev` before proceeding.**
7. **Never delete or overwrite `.env.local`** — append to it if new variables are needed.

---

## 1. Project Context

**Business:** Azzam Barokah Steel — custom stainless steel workshop in Dumai, Riau  
**Tagline:** "Stainless steel custom: pagar, pintu, tangga, canopy, balkon, alat medis, baja ringan, trush & kubah mesjid"  
**Phone:** 0823-8559-7262  
**Address:** Jl. Nelayan Laut, Pangkalan Sesai, Kec. Dumai Bar., Kota Dumai, Riau 28821  
**Google Rating:** 4.5 / 5  
**WhatsApp Number (for CTA links):** 6282385597262

---

## 2. Starting Condition

- Next.js project is **already initialized** (fresh `create-next-app`, App Router)
- PostgreSQL is running via **Laragon** on `localhost:5432`
- No Tailwind, no Prisma, no Auth installed yet
- Agent must install all dependencies from scratch

---

## 3. Tech Stack (Fixed — Do Not Deviate)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js App Router | Already installed |
| Styling | Tailwind CSS 3.x | Must install |
| Database | PostgreSQL via Laragon | localhost:5432 |
| ORM | Prisma (latest) | Must install |
| Auth | NextAuth.js **v4** (`next-auth@4`) | Must install — do NOT use v5/beta |
| Image Storage | Cloudinary | Must install |
| Excel Export | xlsx | Must install |
| PDF Export | jspdf + jspdf-autotable | Must install |
| Charts | recharts | Must install |
| Icons | lucide-react | Must install |
| Password Hashing | bcryptjs | Must install |
| In-app Notifications | Polling-based (React state, no external lib) | — |

---

## 4. Environment Variables

Create `.env.local` in the project root. Agent must use these **exact** variable names:

```env
# Database — Laragon PostgreSQL (default: user=root, no password)
DATABASE_URL="postgresql://root:@localhost:5432/kreasi_kribo"

# NextAuth
NEXTAUTH_SECRET="kreasi-kribo-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (agent should leave these as placeholders — human will fill in)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Optional module flag
PURCHASE_MODULE_ENABLED="false"
```

> Laragon PostgreSQL default: user `root`, no password. If database `kreasi_kribo` does not exist, create it first:
> `psql -U root -c "CREATE DATABASE kreasi_kribo;"`

---

## 5. Folder Structure

Agent must create and strictly follow this folder structure:

```
/app
  /(public)/                    ← Public-facing pages (route group, no URL segment)
    layout.tsx                  ← Public layout: navbar, footer, WA floating button
    page.tsx                    ← Homepage
    /katalog/
      page.tsx                  ← Product catalog list
      /[id]/page.tsx            ← Product detail
    /portofolio/page.tsx        ← Portfolio gallery
    /estimasi/page.tsx          ← Price estimator
    /tentang/page.tsx           ← About & Contact
    /order/page.tsx             ← Custom order form
  /admin/
    layout.tsx                  ← Admin layout: sidebar, topbar, auth guard
    /login/page.tsx             ← Login page
    page.tsx                    ← Dashboard
    /produk/page.tsx            ← Product list (with add/edit modals)
    /portofolio/page.tsx        ← Portfolio list (with add/edit modals)
    /order/page.tsx             ← Order management
    /pembelian/page.tsx         ← Purchase input (optional module)
    /laporan/page.tsx           ← Reports
    /estimasi-config/page.tsx   ← Price config
    /pengguna/page.tsx          ← User management (super admin only)
  /api/
    /auth/[...nextauth]/route.ts
    /products/route.ts          ← GET (list), POST (create)
    /products/[id]/route.ts     ← GET, PATCH, DELETE
    /portfolio/route.ts
    /portfolio/[id]/route.ts
    /orders/route.ts
    /orders/[id]/route.ts
    /purchases/route.ts
    /purchases/[id]/route.ts
    /pricing-config/route.ts
    /pricing-config/[id]/route.ts
    /reports/sales/route.ts
    /reports/purchases/route.ts
    /upload/route.ts
    /users/route.ts
    /users/[id]/route.ts
/components/
  /ui/                          ← Reusable UI (Button, Card, Badge, Modal, Input, etc.)
  /admin/                       ← Admin-specific components
  /public/                      ← Public-facing components
/lib/
  prisma.ts                     ← Prisma client singleton
  auth.ts                       ← NextAuth config & options
  cloudinary.ts                 ← Cloudinary upload helper
  utils.ts                      ← Utility functions
/prisma/
  schema.prisma
  seed.ts
```

---

## 6. Database Schema (Prisma — Use Exactly As Written)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  SUPER_ADMIN
  STAFF
}

enum OrderStatus {
  BARU
  DIPROSES
  DIKONFIRMASI
  SELESAI
  DIBATALKAN
}

enum ProjectType {
  RUMAH
  KAFE
  SEKOLAH
  KANTOR
  LAINNYA
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(STAFF)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          String         @id @default(cuid())
  name        String
  category    String
  description String
  dimensions  String?
  material    String?
  priceMin    Int
  priceMax    Int
  isActive    Boolean        @default(true)
  isFeatured  Boolean        @default(false)
  images      ProductImage[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  url       String
  sortOrder Int     @default(0)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Portfolio {
  id          String      @id @default(cuid())
  title       String
  projectType ProjectType
  description String?
  location    String?
  image       String?     // Single image URL
  isFeatured  Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Order {
  id             String      @id @default(cuid())
  customerName   String
  whatsapp       String
  furnitureType  String
  description    String
  budget         String?
  referenceImage String?
  status         OrderStatus @default(BARU)
  notes          String?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}

model Purchase {
  id         String   @id @default(cuid())
  date       DateTime
  itemName   String
  category   String?
  quantity   Float
  unit       String
  unitPrice  Int
  totalPrice Int
  supplier   String?
  notes      String?
  createdAt  DateTime @default(now())
}

model PricingConfig {
  id                    String   @id @default(cuid())
  category              String   @unique
  basePrice             Int
  materialMultipliers   Json
  complexityMultipliers Json
  pricePerCm            Int      @default(0)
  updatedAt             DateTime @updatedAt
}
```

**Seed file** (`prisma/seed.ts`) must create:
- 1 Super Admin: email `admin@azzambarokahsteel.com`, password `Admin123!` (hashed with bcryptjs)
- 3 PricingConfig entries:
  - `Kursi`: basePrice=500000, pricePerCm=50, materialMultipliers=`{"Triplek":1.0,"MDF":1.2,"Kayu Jati":2.0}`, complexityMultipliers=`{"Simple":1.0,"Standar":1.3,"Premium":1.7}`
  - `Meja`: basePrice=800000, pricePerCm=80, same multipliers
  - `Lemari`: basePrice=1200000, pricePerCm=100, same multipliers

Add to `package.json`:
```json
"prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }
```

---

## 7. Design System

Apply consistently across ALL pages.

### 7.1 Tailwind Config (`tailwind.config.ts`)

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1B4332',    // Deep forest green
          secondary: '#D4A017',  // Mustard gold
          light: '#F5F0E8',      // Warm cream
          dark: '#0A1628',       // Deep navy
        }
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
export default config
```

### 7.2 Typography & Fonts

- Font: **Plus Jakarta Sans** via `next/font/google`
- Load in root `layout.tsx`, apply as CSS variable `--font-jakarta`
- Headings: `font-bold text-brand-dark`
- Body: `font-normal text-gray-700`
- Currency: always formatted as `Rp 1.500.000` (dot as thousand separator, no decimal)

### 7.3 Reusable Component Patterns

```
Card:          rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white overflow-hidden
Button Primary: bg-brand-primary text-white rounded-full px-6 py-3 font-semibold hover:bg-green-800 transition
Button Secondary: border-2 border-brand-secondary text-brand-secondary rounded-full px-6 py-3 font-semibold hover:bg-brand-secondary hover:text-white transition
Button Ghost:  text-brand-primary underline-offset-4 hover:underline transition
Input:         w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary
Badge:         inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
Section:       py-16 px-4 md:px-8 lg:px-16
Container:     max-w-7xl mx-auto w-full
```

### 7.4 Floating WhatsApp Button

Must appear on ALL public pages (put in public layout):

```tsx
<a
  href="https://wa.me/6282385597262"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-transform hover:scale-110"
  aria-label="Chat WhatsApp"
>
  {/* Use MessageCircle icon from lucide-react, size 28 */}
</a>
```

### 7.5 Status Badge Colors

| Status | Tailwind Classes |
|--------|-----------------|
| BARU | `bg-blue-100 text-blue-700` |
| DIPROSES | `bg-yellow-100 text-yellow-700` |
| DIKONFIRMASI | `bg-purple-100 text-purple-700` |
| SELESAI | `bg-green-100 text-green-700` |
| DIBATALKAN | `bg-red-100 text-red-700` |
| Active | `bg-green-100 text-green-700` |
| Inactive | `bg-gray-100 text-gray-500` |

---

## 8. Public Pages — Detailed Specifications

### 8.1 Homepage (`/`)

Sections in order:

**1. Navbar** (sticky, `backdrop-blur-md bg-white/80 border-b border-gray-100`)
- Left: Logo — `"Kreasi Kribo"` text in `font-bold text-brand-primary text-xl` + small leaf/tree icon (lucide `TreePine`)
- Center (desktop): Nav links → Beranda, Katalog, Portofolio, Estimasi Harga, Tentang Kami
- Right: "Hubungi Kami" button → `wa.me` link
- Mobile: hamburger button → slide-down menu

**2. Hero** (`min-h-screen flex items-center`, dark green gradient background `from-brand-dark to-brand-primary`)
- Large headline (white): `"Stainless Steel Custom Berkualitas"` — `text-5xl md:text-7xl font-black`
- Subtext (white/80): `"Pagar, pintu, tempat tidur, tangga, canopy, balkon, alat medis, baja ringan, trush, hingga kubah mesjid — kami wujudkan pesanan stainless steel impian Anda di Dumai, Riau."`
- Two buttons: "Lihat Katalog" (brand.secondary bg) and "Chat WhatsApp" (white outline)
- Decorative element: animated floating shapes or abstract furniture silhouette (CSS only)
- Scroll indicator at bottom

**3. About Snippet** (bg-brand-light)
- 2-column grid (md:grid-cols-2 gap-12)
- Left: placeholder image area (gray rounded-2xl with furniture emoji or placeholder)
- Right: headline `"Tentang Azzam Barokah Steel"`, paragraph about the business, 3 stat chips inline: `"5+ Tahun"`, `"500+ Proyek"`, `"4.5★ Google"`

**4. Featured Products** (bg-white)
- Section heading: `"Produk Unggulan"` + subtext
- Fetch `GET /api/products?featured=true` — limit 6
- Grid: `grid-cols-2 md:grid-cols-3 gap-6`
- Product card: image (aspect-square, object-cover), category badge, name, price range, "Lihat Detail" button
- Fallback if no featured products: show 6 most recent active products
- "Lihat Semua Produk" button → `/katalog`

**5. Featured Portfolio** (bg-brand-light)
- Section heading: `"Hasil Karya Terbaik"`
- Fetch `GET /api/portfolio?featured=true` — limit 3
- Grid: `grid-cols-1 md:grid-cols-3 gap-6`
- Card: image (aspect-video), project type badge, title, location
- "Lihat Semua Portofolio" button → `/portofolio`

**6. CTA Banner** (bg-brand-primary text-white, py-20)
- Headline: `"Siap Mewujudkan Pesanan Stainless Steel Impian Anda?"` — large, bold
- Subtext: `"Konsultasikan kebutuhan Anda dengan tim kami sekarang"`
- Button (brand.secondary): "Request Custom Order" → `/order`

**7. Testimonials** (bg-white)
- Section heading: `"Apa Kata Pelanggan Kami"`
- 3 static review cards (hardcode):
  - Card 1: "Budi S." — ★★★★★ — `"Hasilnya memuaskan, sesuai desain yang saya inginkan. Pengerjaan rapi dan tepat waktu."`
  - Card 2: "Sari W." — ★★★★★ — `"Pesan meja cafe custom, hasilnya bagus banget! Banyak pelanggan cafe saya yang tanya beli dimana."`
  - Card 3: "Ahmad F." — ★★★★☆ — `"Lemari buku untuk sekolah kami sudah jadi, kualitas bagus dan harga terjangkau."`
- Each card: quote icon, star rating (render stars based on number), review text, reviewer name

**8. Footer** (bg-brand-dark text-white)
- Logo + tagline
- 3-column grid: (1) About/tagline (2) Quick Links (3) Contact info
- Contact: address, phone as `tel:` link, hours
- Bottom bar: copyright `© 2026 Azzam Barokah Steel. All rights reserved.`

---

### 8.2 Katalog Produk (`/katalog`)

- Server component: fetch all categories from DB for filter options
- Client component: handles filter state and search
- Fetch: `GET /api/products?category=[cat]`
- Filter UI: category pill buttons (not dropdown), search input top-right
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5`
- Loading: 8 skeleton cards (gray pulsing placeholders)
- Empty: centered message `"Belum ada produk di kategori ini"` with icon

**Product Card:**
```
- Premium design: elevated shadow, subtle gradient background, rounded corners
- Image: aspect-square, object-cover, w-full, hover:scale-105 transition-all duration-300, overlay on hover with quick view icon
- Category badge: top-left overlay on image, premium styling
- Body: name (font-semibold text-lg), price range (text-brand-secondary font-bold text-xl)
- Hover effects: lift card, enhance shadow, show secondary button "Quick View"
- Footer: "Lihat Detail" button full-width, primary style
```

---

### 8.3 Product Detail (`/katalog/[id]`)

Layout: 2-col on desktop (images left, info right)

**Image section:**
- Image slider: main image display with prev/next arrows, dot indicators for multiple images
- Click thumbnail → update main image (client state)
- If only one image, show single image without slider controls

**Info section:**
- Category badge
- Product name (text-3xl font-bold)
- Price range (text-2xl text-brand-secondary font-bold)
- Divider
- Description (whitespace-pre-wrap)
- If dimensions: label "Dimensi:" + value
- If material: label "Material:" + value
- Two CTA buttons (stacked on mobile, side-by-side on desktop):
  - "Pesan via WhatsApp" → `wa.me/6282385597262?text=Halo Azzam Barokah Steel, saya tertarik dengan produk [name]`
  - "Request Custom" → `/order`

**Related products:** heading `"Produk Serupa"`, 3 cards from same category (exclude current), grid-cols-3

---

### 8.4 Portofolio (`/portofolio`)

- Filter tabs: Semua | Rumah | Kafe | Sekolah | Kantor | Lainnya
- Active tab: `bg-brand-primary text-white`, inactive: `bg-gray-100 text-gray-600`
- Grid: `grid-cols-2 md:grid-cols-3 gap-4`
- Card: image (aspect-video), hover overlay with title + type badge, location text below

**Lightbox modal** (on card click):
- Full-screen overlay (bg-black/80)
- Image carousel (prev/next arrows, dot indicators)
- Right panel (md): project title, type, location, description
- Close button (X) top-right
- ESC key closes modal

---

### 8.5 Estimasi Harga (`/estimasi`)

Multi-step form with progress indicator (Step 1 of 3, Step 2 of 3, Step 3 of 3).

**Step 1 — Jenis & Material:**
- Fetch pricing configs from `GET /api/pricing-config`
- Dropdown "Jenis Pesanan Stainless Steel": options dari config categories
- On category select → populate "Material" dropdown from `materialMultipliers` keys
- Dropdown "Tingkat Kompleksitas": Simple | Standar | Premium
- "Lanjut →" button

**Step 2 — Ukuran:**
- 3 number inputs: Panjang (cm), Lebar (cm), Tinggi (cm)
- Min value: 1, no max
- Helper text: `"Masukkan ukuran dalam satuan sentimeter (cm)"`
- "← Kembali" and "Hitung Estimasi →" buttons

**Step 3 — Hasil Estimasi:**

Formula (implement exactly):
```
volumeCm = panjang × lebar × tinggi
baseEstimate = config.basePrice + (volumeCm × config.pricePerCm)
materialMult = config.materialMultipliers[selectedMaterial]
complexityMult = config.complexityMultipliers[selectedComplexity]
rawEstimate = baseEstimate × materialMult × complexityMult
minPrice = Math.round((rawEstimate × 0.9) / 100000) × 100000
maxPrice = Math.round((rawEstimate × 1.1) / 100000) × 100000
```

Display:
- Selected specs summary (jenis, material, kompleksitas, ukuran)
- Large estimate display: `"Estimasi Harga"` label, `"Rp X.XXX.XXX – Rp X.XXX.XXX"` (brand.secondary, text-3xl font-black)
- Disclaimer: `"*Estimasi ini bersifat perkiraan. Harga final ditentukan setelah konsultasi dengan tim kami."`
- Button: "Konsultasi via WhatsApp" → pre-filled WA message with all specs + estimate
- "Hitung Ulang" link → reset to Step 1

---

### 8.6 Form Custom Order (`/order`)

Single-page form with clear section heading: `"Request Custom Order"`

| Field | Input Type | Required | Validation |
|-------|-----------|----------|------------|
| Nama Lengkap | text | ✅ | min 3 chars |
| Nomor WhatsApp | tel | ✅ | regex: `^(08|\+62)[0-9]{8,12}$` |
| Jenis Pesanan | text | ✅ | min 3 chars |
| Deskripsi Kebutuhan | textarea (4 rows) | ✅ | min 20 chars |
| Estimasi Budget | text | ❌ | placeholder: "cth: Rp 2.000.000 – Rp 3.000.000" |
| Foto Referensi | file | ❌ | accept: image/*, max 5MB |

Client-side validation before submit. Show error messages below each field.

On submit:
1. If file selected: POST file to `/api/upload`, get back `url`
2. POST form data + imageUrl to `/api/orders`
3. On success: hide form, show success card
4. On error: show error toast

**Success card:**
```
✅ (green check icon, large)
"Pesanan Berhasil Dikirim!"
"Terima kasih, [nama]! Tim kami akan menghubungi Anda via WhatsApp dalam 1×24 jam."
[Button: "Chat WhatsApp Sekarang" → wa.me link]
```

---

### 8.7 Tentang Kami (`/tentang`)

Sections:
1. Hero sub-page: heading `"Tentang Azzam Barokah Steel"`, breadcrumb
2. Story section: 2-col, placeholder image + 2 paragraphs about company
3. Values: 3 cards — `"Kualitas Terjamin"`, `"Tepat Waktu"`, `"Kepuasan Pelanggan"` each with icon and 1-sentence description
4. Google Maps embed: `<iframe>` for Jl. Nelayan Laut, Dumai (use standard Google Maps embed URL)
5. Contact card: address, phone (tel: link), WhatsApp button, operating hours table (Mon–Sat 08.00–17.30, Sun: Tutup)
6. FAQ accordion (5 items):
   - "Berapa lama waktu pengerjaan?" → "Tergantung kompleksitas, rata-rata 7–21 hari kerja."
   - "Apakah bisa request desain sendiri?" → "Tentu! Kami menerima desain custom sesuai kebutuhan Anda."
   - "Area pengiriman mana saja?" → "Kami melayani seluruh wilayah Dumai dan sekitarnya. Luar kota bisa didiskusikan."
   - "Apakah ada garansi?" → "Ya, kami memberikan garansi pengerjaan selama 3 bulan."
   - "Bagaimana cara pemesanan?" → "Hubungi kami via WhatsApp atau isi form Request Custom Order di website ini."

---

## 9. Admin Panel — Detailed Specifications

### 9.1 Auth Guard

In `app/admin/layout.tsx`:
- Check session with `getServerSession(authOptions)`
- If no session AND path is not `/admin/login` → redirect to `/admin/login`
- If session exists AND path is `/admin/login` → redirect to `/admin`

### 9.2 Admin Login (`/admin/login`)

- Centered card layout, brand logo at top
- Email + password fields
- "Masuk" button → call `signIn("credentials", { email, password, redirect: false })`
- On error: show `"Email atau password salah"` alert
- On success: `router.push('/admin')`

### 9.3 Admin Layout

**Sidebar** (desktop, `w-64`, bg-brand-dark text-white, fixed height):
- Logo area top
- Nav items with icons (lucide-react):
  - LayoutDashboard → Dashboard (`/admin`)
  - Package → Produk (`/admin/produk`)
  - Image → Portofolio (`/admin/portofolio`)
  - ClipboardList → Order Masuk (`/admin/order`) — show badge with BARU count
  - ShoppingCart → Pembelian (`/admin/pembelian`) — only if `PURCHASE_MODULE_ENABLED=true`
  - BarChart3 → Laporan (`/admin/laporan`)
  - Settings → Konfigurasi Estimasi (`/admin/estimasi-config`)
  - Users → Pengguna (`/admin/pengguna`) — only if session.user.role === SUPER_ADMIN
- Bottom: user name + role chip + logout button

**Top bar** (mobile, `h-16`):
- Hamburger → toggles sidebar drawer
- "Azzam Barokah Steel Admin" title
- Notification bell (BARU orders count badge)
- User avatar initials

**Notification polling:** in admin layout, `useEffect` polls `GET /api/orders?status=BARU&countOnly=true` every 60 seconds. Stores last count in `useRef`. If count increases, show toast: `"Ada [n] order baru masuk!"`.

---

### 9.4 Dashboard (`/admin`)

**Stats row (4 cards):**
- Order Baru Hari Ini: `GET /api/orders?status=BARU&today=true&countOnly=true`
- Order Bulan Ini: `GET /api/orders?thisMonth=true&countOnly=true`
- Produk Aktif: count of products where isActive=true
- Total Pembelian Bulan Ini: sum of purchases.totalPrice this month (show `"—"` if module disabled)

**Charts row (2 charts using recharts):**
- Bar chart: orders per month for last 6 months (x=month, y=count)
- Pie chart: order count by status

**Recent Orders table (last 5):**
- Columns: Nama Pelanggan, Jenis Pesanan, Status (badge), Waktu (timeAgo)
- "Lihat Semua" link → `/admin/order`

---

### 9.5 Manajemen Produk (`/admin/produk`)

**List page:**
- Search input + category filter dropdown
- Table (md+) / card list (mobile):
  - Thumbnail (40×40 rounded), Nama, Kategori, Harga (formatted range), Status badge, Featured badge, Action buttons
- Action buttons: Edit (pencil icon), Toggle Active (eye/eye-off), Delete (trash, with confirm dialog)
- "Tambah Produk" button top-right → opens add modal
- Pagination: 10 per page

**Add/Edit Modal:**
- Modal overlay with form inside
- All fields in a clean 2-col grid (1-col on mobile)
- Left column: Nama, Kategori (text + datalist: Kursi,Meja,Lemari,Rak,Tempat Tidur,Custom), Dimensi, Material
- Right column: Deskripsi (full-width textarea), Harga Min, Harga Max, Status toggle, Featured toggle
- Bottom: multi image upload section (full-width)
  - "Upload Foto" area with drag-drop zone or click to browse
  - Show previews as thumbnails in a flex-wrap row
  - Each thumbnail: image preview + X remove button
  - Max 10 images, max 5MB each, accept jpg/png/webp
  - Images uploaded to Cloudinary on add (POST `/api/upload`), URL stored in state
  - On form submit: save product with all image URLs and sort orders
- "Simpan" and "Batal" buttons

---

### 9.6 Manajemen Portofolio (`/admin/portofolio`)

Same CRUD pattern as products, but with modal forms.

Fields: Nama Proyek, Tipe Proyek (select enum), Deskripsi (textarea), Lokasi, Featured toggle, single image upload (same pattern as products but max 1 image).

---

### 9.7 Order Masuk (`/admin/order`)

**List page:**
- Status filter tabs: Semua | Baru | Diproses | Dikonfirmasi | Selesai | Dibatalkan
- Table: No., Nama, WhatsApp, Jenis Furniture, Budget, Status badge, Tanggal, Actions (View, Update Status)
- Click row or "Lihat" → open detail drawer (right-side panel)
- Export buttons top-right: "Export Excel" + "Export PDF"

**Detail drawer (side panel, 480px wide on desktop, full-screen on mobile):**
- All order fields displayed clearly
- Status selector dropdown → on change: PATCH `/api/orders/[id]` with `{ status }`
- Notes textarea → "Simpan Catatan" button → PATCH `/api/orders/[id]` with `{ notes }`
- Reference image: if exists, show `<img>` with link to open full size
- "Chat WhatsApp" button → `wa.me/[whatsapp]?text=Halo [customerName], kami dari Azzam Barokah Steel mengenai pesanan stainless steel Anda.`

**Export Excel** (using `xlsx` library, client-side):
- Download file: `orders-[date].xlsx`
- Columns: No, Nama, WhatsApp, Jenis Furniture, Deskripsi, Budget, Status, Tanggal

**Export PDF** (using `jspdf-autotable`):
- Title: "Laporan Order - Kreasi Kribo"
- Same columns as Excel
- Auto-table formatting

---

### 9.8 Input Pembelian (`/admin/pembelian`)

If `process.env.PURCHASE_MODULE_ENABLED !== 'true'`: render a centered card:
```
ShoppingCart icon (large, gray)
"Modul Pembelian Tidak Aktif"
"Aktifkan modul ini dengan mengubah PURCHASE_MODULE_ENABLED=true di file .env.local"
```

If enabled:
- Date range filter (from/to date inputs)
- "Tambah Pembelian" button → inline form above table or modal
- Table: Tanggal, Nama Barang, Kategori, Jumlah, Satuan, Harga Satuan, Total, Supplier, Actions (Delete)
- Add form fields: Tanggal (date, required), Nama Barang (text), Kategori (text + datalist: Kayu,Hardware,Cat,Kain,Lainnya), Jumlah (number), Satuan (select: pcs,meter,kg,liter,lembar), Harga Satuan (number), Total (auto = jumlah×harga, read-only), Supplier (text), Catatan (textarea)

---

### 9.9 Konfigurasi Estimasi (`/admin/estimasi-config`)

- Fetch all pricing configs
- Display each config as an expandable card/accordion
- Collapsed view: category name, base price, "Edit" button
- Expanded view: all fields editable inline

**Editable fields per config:**
- Base Price (number input)
- Price per cm (number input)
- Material Multipliers: table with 2 columns (Nama Material | Multiplier). "Tambah Material" button adds row. Each row has delete (×) button.
- Complexity Multipliers: same pattern, locked to 3 rows: Simple, Standar, Premium (names not editable, only values)

- "Simpan" button per config → PATCH `/api/pricing-config/[id]`
- "Tambah Kategori Baru" button at bottom → inline form: category name + save → POST `/api/pricing-config` with defaults

---

### 9.10 Laporan (`/admin/laporan`)

Two tabs:

**Tab 1: Laporan Penjualan**
- Filter: date range (from/to), status multi-checkbox
- Apply filter → refetch
- Stats row: Total Order, Est. Pendapatan (sum of average of budget if parseable, else show "N/A"), Order Selesai (count)
- Bar chart (recharts): orders per week in selected range
- Pie chart: by status breakdown
- Data table: all filtered orders (same columns as order list)
- "Export Excel" + "Export PDF" buttons

**Tab 2: Laporan Pembelian** (only if module enabled, else show disabled placeholder)
- Filter: date range
- Stats: Total Pengeluaran (sum of totalPrice), Jumlah Transaksi
- Pie chart: pengeluaran per kategori
- Data table: all filtered purchases
- Export buttons

---

### 9.11 Manajemen Pengguna (`/admin/pengguna`)

Auth check: if session.user.role !== 'SUPER_ADMIN' → show `"Akses ditolak. Halaman ini hanya untuk Super Admin."` and redirect after 3s.

- Table: Nama, Email, Role badge, Tanggal Dibuat, Actions (Edit, Delete — cannot delete own account)
- "Tambah Pengguna" button → modal form: Nama, Email, Password, Role (select: STAFF | SUPER_ADMIN)
- Edit → modal with same fields (password optional — leave blank to keep unchanged)
- Delete → confirm dialog: `"Yakin hapus pengguna [name]?"`

---

## 10. API Route Specifications

All API routes in `/app/api/`. Use `NextResponse.json()`. All admin routes must validate session.

**Auth check pattern:**
```ts
const session = await getServerSession(authOptions)
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

**Super admin check:**
```ts
if (session.user.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
```

| Method | Route | Auth | Behavior |
|--------|-------|------|----------|
| GET | `/api/products` | No | Query params: `category`, `search`, `featured` (bool), `limit` (int). Return products with first image. |
| GET | `/api/products/[id]` | No | Return product with all images ordered by sortOrder |
| POST | `/api/products` | Admin | Create product + images |
| PATCH | `/api/products/[id]` | Admin | Update product fields + images |
| DELETE | `/api/products/[id]` | Admin | Delete product (cascade deletes images) |
| GET | `/api/portfolio` | No | Query: `type` (ProjectType), `featured` (bool). Return with first image. |
| GET | `/api/portfolio/[id]` | No | Return with all images |
| POST | `/api/portfolio` | Admin | Create |
| PATCH | `/api/portfolio/[id]` | Admin | Update |
| DELETE | `/api/portfolio/[id]` | Admin | Delete |
| GET | `/api/orders` | Admin | Query: `status`, `countOnly` (bool), `today` (bool), `thisMonth` (bool). If countOnly=true return `{ count: n }`. |
| POST | `/api/orders` | No | Create order. Validate required fields server-side. |
| PATCH | `/api/orders/[id]` | Admin | Update status and/or notes |
| GET | `/api/purchases` | Admin | Query: `from` (ISO date), `to` (ISO date). Return purchases in range. |
| POST | `/api/purchases` | Admin | Create purchase. Auto-calculate totalPrice = quantity × unitPrice. |
| DELETE | `/api/purchases/[id]` | Admin | Delete |
| GET | `/api/pricing-config` | No | Return all configs |
| POST | `/api/pricing-config` | Admin | Create new config |
| PATCH | `/api/pricing-config/[id]` | Admin | Update config |
| GET | `/api/reports/sales` | Admin | Query: `from`, `to`, `status` (comma-separated). Return orders array + aggregates. |
| GET | `/api/reports/purchases` | Admin | Query: `from`, `to`. Return purchases array + sum. |
| POST | `/api/upload` | Mixed* | Multipart form with `file` field. Upload to Cloudinary. Return `{ url, publicId }`. |
| GET | `/api/users` | Super Admin | Return all users (exclude password field) |
| POST | `/api/users` | Super Admin | Create user, hash password with bcryptjs |
| PATCH | `/api/users/[id]` | Super Admin | Update. If password provided, hash it. |
| DELETE | `/api/users/[id]` | Super Admin | Cannot delete own account (check against session.user.id) |

*`/api/upload`: allow unauthenticated for order reference images (public form), admin session for product/portfolio images.

---

## 11. Utility Functions (`/lib/utils.ts`)

```ts
// Format to Rupiah: 1500000 → "Rp 1.500.000"
export function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID')
}

// Format price range
export function formatPriceRange(min: number, max: number): string {
  return `${formatRupiah(min)} – ${formatRupiah(max)}`
}

// Format date to Indonesian long format
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

// Relative time in Indonesian
export function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  return `${days} hari lalu`
}

// Build WhatsApp URL
export function buildWAUrl(message: string): string {
  return `https://wa.me/6282385597262?text=${encodeURIComponent(message)}`
}

// Truncate text
export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text
}
```

---

## 12. NextAuth Configuration (`/lib/auth.ts`)

```ts
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import prisma from './prisma'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null
        const valid = await compare(credentials.password, user.password)
        if (!valid) return null
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role
      return session
    }
  },
  pages: {
    signIn: '/admin/login'
  },
  session: { strategy: 'jwt' }
}
```

Add TypeScript type augmentation for `session.user.role`.

---

## 13. Prisma Client Singleton (`/lib/prisma.ts`)

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

---

## 14. Initial Setup Commands

Agent must run these commands in order at the start:

```bash
# 1. Install all dependencies
npm install tailwindcss postcss autoprefixer @tailwindcss/typography
npm install prisma @prisma/client
npm install next-auth@4 bcryptjs
npm install @types/bcryptjs --save-dev
npm install cloudinary
npm install recharts
npm install lucide-react
npm install xlsx
npm install jspdf jspdf-autotable

# 2. Initialize Tailwind
npx tailwindcss init -p

# 3. Initialize Prisma
npx prisma init

# 4. Create database (Laragon must be running)
psql -U root -c "CREATE DATABASE kreasi_kribo;" 2>/dev/null || echo "DB may already exist"

# 5. Write schema, then run migration
npx prisma migrate dev --name init

# 6. Run seed
npx prisma db seed

# 7. Start dev server and verify
npm run dev
```

---

## 15. Verification Checklist

After completing all phases, agent must verify:

- [ ] `npm run dev` runs without errors
- [ ] `http://localhost:3000` loads homepage with navbar, hero, sections, footer
- [ ] Floating WhatsApp button visible on all public pages
- [ ] `/katalog` loads (empty state shown if no products)
- [ ] `/portofolio` loads (empty state shown if no portfolio)
- [ ] `/estimasi` — all 3 steps work, estimate calculates correctly
- [ ] `/order` — form submits, success state shown
- [ ] `/admin/login` — login with `admin@azzambarokahsteel.com / Admin123!` works
- [ ] Admin dashboard loads with stats (zeros if no data)
- [ ] Admin can add a product with images
- [ ] Admin can view and update order status
- [ ] Admin can export orders to Excel and PDF
- [ ] Estimasi config is editable by admin
- [ ] Mobile layout works (test at 375px viewport width)
- [ ] No TypeScript errors (`npx tsc --noEmit` passes)

---

## 16. Scope Boundaries

### ✅ In Scope — Agent Must Build
- All pages and features described in sections 8–13
- Fully functional on `localhost:3000`
- Responsive at 375px (mobile) and 1440px (desktop)
- All UI text in Bahasa Indonesia
- Working local PostgreSQL via Laragon

### ❌ Out of Scope — Agent Must NOT Build
- Vercel, Supabase, Railway, or any cloud config
- Docker or containerization
- Online payment or checkout
- Customer-facing login
- Email sending / SMTP
- Unit or integration tests
- Mobile app
- `.env.production` file

---

## 17. Agent Decision Log Convention

When making any implementation decision not explicitly specified:

```ts
// AGENT DECISION: [what was decided]
// Reason: [brief justification]
```

---

*PRD v2.0 — Optimized for AI agent (Qwen) execution. Local development only. Vercel deployment handled separately by human developer.*
