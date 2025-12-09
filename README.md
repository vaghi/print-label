This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Assumptions
- All fields except Apt / Suite are mandatory.
- For only accept addresses in the United States I used a US validation on the zip code, and restricted the state to US states.
- No validation on real street address.
- No validation on real city.
- Just listed some states for simplicity.

## What I’d do next
- Improve overall design.
- Enable "Create Label" button always; focus with red color and label, and scroll to uncompleted or invalid mandatory fields.
- Add light/dark mode support.
- Add i18n support.
- Add all states.
- Convert Street Address to a predictive field with select options with real street addresses.
- Add real cities consumed from API for the selected state.
- Add import aliasing.