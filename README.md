# Chautari

**Chautari** is a community-centric platform inspired by the traditional Nepali rest stops — places where neighbours meet, share stories, and help one another.

This app brings that spirit online, offering a digital space for residents and service providers within a neighborhood to **post local updates, share job opportunities, vote in polls, and foster real connections**.

---

## ✨ Features

- 🏘️ **Neighborhood Feed** – Share posts with text and images, visible only to people nearby.
- 🛠️ **Micro-Job Board** – Post small jobs (like repairs, deliveries, etc.) and apply with proof and cover letter.
- 🗳️ **Local Polls** – Create and vote on polls relevant to your community.
- 🧠 **AI Verification** – Smart AI system helps verify job legitimacy and application relevance.
- 🔔 **Notifications** – In-app alerts for new posts, job updates, and community polls.
- 💬 **Private Messaging** – 1-on-1 chat system (optional to enable).
- 📊 **Admin Analytics** – Track platform usage and interactions for community insights.

---

## 🛠️ Tech Stack

| Layer         | Technology                            |
| ------------- | ------------------------------------- |
| Frontend      | Next.js 14 (App Router), TailwindCSS  |
| Auth          | NextAuth.js                           |
| Backend       | Node.js, Prisma ORM                   |
| Database      | PostgreSQL                            |
| AI Layer      | OpenAI API or Gemini for verification |
| Mobile        | React Native (Expo) _(planned)_       |
| Notifications | Firebase Cloud Messaging (planned)    |

---

## 📦 Folder Structure

```bash
.
├── prisma/             # Prisma schema & migrations
├── app/                # Next.js App Router structure
├── components/         # Shared UI components (shadcn/ui)
├── lib/                # Utility functions, middleware, etc.
├── pages/api/          # NextAuth API routes
├── public/             # Static assets
└── README.md
```

### 🧪 Development Setup

Clone the repo

Add your .env:

env

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

Install & run:

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

🙏 Inspired By
Chautaris across Nepal — natural gathering spots under banyan trees, reminding us that community starts with conversation.
