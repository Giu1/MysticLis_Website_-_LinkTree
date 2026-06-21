# Mystic Lis Website & LinkTree

Static business website for Mystic Lis, built with plain HTML, CSS, and JavaScript so it can run for free on GitHub Pages.

## What is included

- Linktree-style landing section.
- Business services for custom candles, bulk orders, seasonal releases, and event organization.
- Interactive inquiry questionnaire.
- Free email handoff through `mailto:`.
- GitHub Actions workflow for GitHub Pages deployment.

## Before publishing

1. Replace `mysticlis@example.com` in `index.html` and `assets/script.js` with the real business email.
2. Update seasonal collection copy, prices, product photos, and legal/company details when available.
3. In GitHub, open `Settings > Pages` and set the source to `GitHub Actions`.
4. Push to the `main` branch. The workflow in `.github/workflows/deploy.yml` will deploy the static site.

## Email integration options

The current implementation uses `mailto:` because it is free and does not need a server. It opens the visitor's email app with the questionnaire details filled in.

For a direct form submission experience, you can use a free form provider such as FormSubmit or Formspree. That would require adding the real destination email or form endpoint to the page.
