# Reno Platforms Notice Board

A full-stack Notice Board application built for the Reno Platforms Web Development Internship Assignment.

## Live Demo
**Vercel URL:** [Deploy to Vercel and add link here]
**GitHub Repository:** [Add repo link here]

## Features Built
- **Full CRUD**: Create, Read, Update, and Delete notices.
- **Server-Side Validation**: Zod schemas used in Next.js API routes (`pages/api/notices/index.js` and `[id].js`).
- **Urgent-First Ordering**: Achieved via raw SQL `CASE` queries on the database side (PostgreSQL).
- **Responsive UI**: Tailwind CSS grid layouts, mobile-friendly cards, glassmorphism design.
- **Image Support**: Optional image URL fields with preview capability.

## Required Tech Stack Used
- **Framework**: Next.js Pages Router
- **Database Access**: Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS

## How to Run Locally

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd notice-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the Database**
   - Create a free PostgreSQL database on [Neon](https://neon.tech).
   - Copy the `.env.example` to `.env` and add your database URL:
     ```env
     DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
     ```

4. **Run Prisma Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## One Thing to Improve with More Time
If given more time, I would improve the **Image Handling System**. Currently, the app relies on providing an external image URL. I would implement a direct file upload feature using an object storage service like **AWS S3** or **Vercel Blob** (since we are deploying on Vercel). This would allow users to select images directly from their device, which the backend would then upload securely, returning a CDN URL to store in the Prisma database, significantly enhancing the user experience.

## AI Usage Disclosure
AI (specifically Google's advanced coding agent) was utilized in the development of this project for:
1. Researching the exact CLI commands to initialize a Next.js *Pages Router* project (since Next.js now defaults heavily to App Router).
2. Generating boilerplate React code for the responsive Tailwind CSS components (Layout, Modal, Toast) to accelerate the UI styling process.
3. Structuring the server-side Zod validation schemas for robust API inputs.
4. Crafting the raw SQL `CASE` query logic required to overcome PostgreSQL's default alphabetical enum sorting, ensuring the "Urgent-first" database ordering requirement was strictly met at the query level.
