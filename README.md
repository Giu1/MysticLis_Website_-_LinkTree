# Mystic Lis Website & LinkTree

Static business website for Mystic Lis, built with plain HTML, CSS, and JavaScript so it can run for free on GitHub Pages.

## What is included

- Linktree-style landing section.
- **Loja / portfolio** (`velas.html`) with product cards, filters, and featured pieces on the home page.
- Product catalog in `assets/catalog.js` (titles, copy, categories) wired to photos in `assets/gallery/work-01.jpeg` … `work-19.jpeg`.
- Full photo gallery with lightbox and “Pedir semelhante” → questionnaire prefill.
- Business services for custom candles, bulk orders, seasonal releases, and event organization.
- Interactive inquiry questionnaire.
- Automated email flow with Web3Forms + EmailJS.
- GitHub Actions workflow for GitHub Pages deployment.

### Adding or editing products

1. Add photos under `assets/gallery/` (keep filenames stable or update `image` paths in `assets/catalog.js`).
2. Edit `assets/catalog.js` — each product needs `id`, `name`, `category` (`velas`, `presentes`, `eventos`, `embalagem`), `image`, and `service` for the form prefill.
3. Optional: set `featured: true` to show on the home page destaques section.
4. Bump `?v=shop` on CSS/JS links in HTML if browsers cache old assets.

## Email integration setup

The questionnaire sends emails in two steps:

1. **Web3Forms** sends a formatted enquiry to the Mystic Lis inbox.
2. **EmailJS** sends an automatic confirmation email to the customer.

### 1. Web3Forms (inbox notification)

1. Create a free account at [web3forms.com](https://web3forms.com/).
2. Add the Mystic Lis inbox email.
3. Copy the **Access Key**.
4. Paste it in `index.html` on the form:

```html
data-web3forms-access-key="YOUR_WEB3FORMS_ACCESS_KEY"
```

Web3Forms will deliver emails like this:

```text
Novo pedido Mystic Lis

Nome: ...
Email: ...
Telefone/WhatsApp: ...
Localidade: ...

Servico: ...
Quantidade: ...
Data pretendida: ...
Interesses: ...

Detalhes:
...
```

### 2. EmailJS (customer auto-reply)

1. Create a free account at [emailjs.com](https://www.emailjs.com/).
2. Connect an email service (Gmail, Outlook, etc.).
3. Create a template named something like `mystic_lis_auto_reply`.
4. Use these template settings:

- **To Email:** `{{to_email}}`
- **Subject:** `Recebemos o teu pedido - Mystic Lis`
- **Suggested body:**

```text
Ola {{customer_name}},

Obrigada pelo teu pedido na Mystic Lis.

Recebemos o teu pedido sobre: {{service_type}}.
Entraremos em contacto em breve para confirmar detalhes, prazos e disponibilidade.

Resumo do pedido:
{{inquiry_summary}}

Com carinho,
Mystic Lis
969 137 229
@mysticlis_
```

5. Copy these values into `index.html`:

```html
data-emailjs-public-key="YOUR_EMAILJS_PUBLIC_KEY"
data-emailjs-service-id="YOUR_EMAILJS_SERVICE_ID"
data-emailjs-auto-template-id="YOUR_EMAILJS_AUTO_REPLY_TEMPLATE_ID"
```

6. In EmailJS, allow your domain (for example `giu1.github.io` and any custom domain later).

### 3. Business contact email

Replace `mysticlis@example.com` in `index.html` with the real Mystic Lis email.

This is used as fallback contact info and if Web3Forms/EmailJS are not configured yet.

## Before publishing

1. Configure Web3Forms and EmailJS keys in `index.html`.
2. Replace `mysticlis@example.com` with the real business email.
3. Test the form once on the live site.
4. In GitHub, open `Settings > Pages` and set the source to `GitHub Actions`.
5. Push to the `main` branch. The workflow in `.github/workflows/deploy.yml` will deploy the static site.

## Fallback behavior

If the keys are not configured yet, the form falls back to `mailto:` so enquiries can still be prepared manually.
