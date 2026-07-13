# MediaDock

MediaDock is a Next.js SaaS app for uploading media, generating social image crops, optimizing videos with Cloudinary, and managing uploaded video assets from a dashboard.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- daisyUI 5
- Clerk authentication
- Cloudinary image/video storage and transformations
- Prisma 7 with PostgreSQL

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` for local development and add same keys to production host.

```env
DATABASE_URL="postgresql://..."

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."

CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

If Clerk uses custom routes or webhooks later, add those Clerk variables too.

## Database

Generate Prisma client:

```bash
npx prisma generate
```

Push current schema to development database:

```bash
npx prisma db push
```

For production, prefer migrations:

```bash
npx prisma migrate deploy
```

## Production Checklist

1. Pick final project name and domain.
2. Create production PostgreSQL database.
3. Create production Cloudinary account or folder policy.
4. Create production Clerk app.
5. Add production domain in Clerk allowed origins.
6. Add all environment variables in hosting provider.
7. Run `npm run lint`.
8. Run `npm run build`.
9. Deploy.
10. Test sign in, image upload, video upload, preview, download, and delete.

## Deploy To Vercel

1. Push repo to GitHub.
2. Import repo in Vercel.
3. Add environment variables from `.env.local`.
4. Set build command:

```bash
npm run build
```

5. Set install command:

```bash
npm install
```

6. Deploy.

## Large Video Uploads

This app accepts video uploads up to 70MB. `next.config.ts` uses:

```ts
experimental: {
  proxyClientMaxBodySize: "75mb",
}
```

Keep hosting platform request limits in mind. For larger production uploads, move to direct browser-to-Cloudinary signed uploads.

## Important Production Notes

- Do not commit `.env` or `.env.local`.
- Keep `CLOUDINARY_API_SECRET` server-only.
- Uploaded video compression may show no size reduction when Cloudinary output bytes are same as source or when old database rows were created before compression metadata was saved.
- Delete currently removes Cloudinary video and database row.
- Add ownership (`userId`) to `Video` model before multi-user public launch, so users cannot delete each other's videos.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
