# TCS Sales Intelligence Website

Premium responsive corporate analytics website built with React, Vite, Framer Motion, Lucide icons, and Recharts. Includes animated section reveals, animated hero and loader, responsive navigation, browser-side metrics, interactive sales charts and filters, regional/city/payment insights, and a validated contact form.

## Run locally
Install Node.js 20 LTS from https://nodejs.org, then run in this folder:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Publish with GitHub Pages
1. Create a new GitHub repository.
2. Upload **all files and folders** from this project to the repository root, including `.github/workflows/deploy.yml`.
3. Commit to the `main` branch.
4. Open repository **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **GitHub Actions**.
6. Open **Actions** and wait for “Deploy TCS website to GitHub Pages” to complete.
7. Open **Settings → Pages** to find the website URL.

The workflow automatically builds and deploys the site whenever you push changes to `main`.

## Update the data
The workbook records are in `src/data/sales-data.json`. Replace this JSON with updated records while keeping field names consistent with `src/main.jsx`.

The supplied workbook contains 800 e-commerce order records, so the site presents a sales intelligence dashboard. It does not represent official TCS company financial results. Sales values are recomputed from quantity, unit price, and discount percentage when preparing the dataset.

## Contact form limitation
The contact form validates inputs and shows feedback in the browser. It does not send emails or store messages until connected to a backend endpoint or form service. Do not put secret API keys in front-end code.

## Brand customization
The TCS mark is an editable CSS-built wordmark, not an official logo asset. Replace it with an approved logo and verified company information before publishing. No unprovided team profiles, client logos, addresses, phone numbers, or testimonials are fabricated.

## Production check
```bash
npm run build
npm run preview
```

The deployable files are created in `dist/`.
