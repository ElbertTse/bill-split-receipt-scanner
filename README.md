# Bill Split Receipt Scanner

A premium, fast, and modern web application built to make splitting receipts among friends completely painless. Built with **Next.js**, styled with **Tailwind CSS**, and rigorously tested with **Jest**.

## ✨ Features

- **Interactive Table Interface:** Easily view your receipt items, their prices, and who is paying for them.
- **Dynamic Split Calculations:** Assign multiple friends to a single item and the app will instantly calculate the exact breakdown of who owes what in the Split Summary.
- **Smart Tag Management:** A built-in "Add All" feature detects everyone already in the receipt to save you from typing names repeatedly.
- **Draggable Columns:** Adjust the width of the Item, Price, and Who columns dynamically just by clicking and dragging their borders.
- **Real-Time Math:** Grand Totals and Split Breakdowns update immediately as you add, edit, or delete items.
- **Sleek Aesthetics:** Built using modern glassmorphism styling, clean typography, and a fully responsive layout with native Dark Mode support.

## 🚀 Getting Started

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

Open [http://localhost:3000/bill-split-receipt-scanner](http://localhost:3000/bill-split-receipt-scanner) with your browser to see the result.

*(Note: Because this project is configured for GitHub Pages, it runs on the `/bill-split-receipt-scanner` subpath locally as well).*

## 🧪 Testing

This project uses **Jest** and **React Testing Library** to ensure all mathematical calculations and UI interactions are robust.

To run the test suite:

```bash
npm run test
```

To run tests in watch mode during development:

```bash
npm run test:watch
```

## 📦 Deployment

The app is fully configured for static export to **GitHub Pages**. Any pushes to the `main` branch will automatically trigger the `.github/workflows/deploy.yml` GitHub Action, which builds and deploys the production bundle.
