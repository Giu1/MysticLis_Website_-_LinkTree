const form = document.querySelector("#inquiry-form");
const serviceType = document.querySelector("#service-type");
const copyButton = document.querySelector("#copy-summary");
const statusMessage = document.querySelector("#form-status");
const detailsField = form?.elements.details;

const detailPrompts = {
  "Velas artesanais": "Conta-nos o aroma, cor, tema, mensagem, embalagem e para que ocasiao e.",
  "Ambientadores": "Indica se procuras difusores, sprays, quantidade, aroma e espaco onde serao usados.",
  "Workshops criativos": "Indica numero de participantes, local, data pretendida e tipo de experiencia.",
  "Decoracao de eventos": "Indica tipo de evento, numero de convidados, local, data e estilo pretendido.",
  "Lembrancas personalizadas": "Indica evento, quantidade, tema, cores, prazo e se queres embalagem personalizada.",
  "Outro pedido": "Descreve o pedido com o maximo de detalhes possivel."
};

function getCheckedValues(formData, fieldName) {
  return formData.getAll(fieldName).filter(Boolean).join(", ") || "Nao indicado";
}

function buildInquirySummary(formData = new FormData(form)) {
  return [
    "Novo pedido Mystic Lis",
    "",
    `Nome: ${formData.get("name") || "Nao indicado"}`,
    `Email: ${formData.get("email") || "Nao indicado"}`,
    `Telefone/WhatsApp: ${formData.get("phone") || "Nao indicado"}`,
    `Localidade: ${formData.get("location") || "Nao indicado"}`,
    "",
    `Servico: ${formData.get("serviceType") || "Nao indicado"}`,
    `Quantidade: ${formData.get("quantity") || "Nao indicado"}`,
    `Data pretendida: ${formData.get("date") || "Nao indicado"}`,
    `Interesses: ${getCheckedValues(formData, "interests")}`,
    "",
    "Detalhes:",
    formData.get("details") || "Nao indicado"
  ].join("\n");
}

function getContactEmail() {
  return form?.dataset.contactEmail || "mysticlis@example.com";
}

function getEmailIntegrationConfig() {
  return {
    contactEmail: getContactEmail(),
    web3formsKey: form?.dataset.web3formsAccessKey || "",
    emailjsPublicKey: form?.dataset.emailjsPublicKey || "",
    emailjsServiceId: form?.dataset.emailjsServiceId || "",
    emailjsAutoTemplateId: form?.dataset.emailjsAutoTemplateId || ""
  };
}

function isPlaceholderValue(value) {
  return !value || value.includes("YOUR_") || value.includes("example.com");
}

function isEmailIntegrationConfigured(config) {
  return (
    !isPlaceholderValue(config.web3formsKey) &&
    !isPlaceholderValue(config.emailjsPublicKey) &&
    !isPlaceholderValue(config.emailjsServiceId) &&
    !isPlaceholderValue(config.emailjsAutoTemplateId)
  );
}

function buildTemplateParams(formData) {
  return {
    customer_name: formData.get("name") || "Nao indicado",
    customer_email: formData.get("email") || "",
    customer_phone: formData.get("phone") || "Nao indicado",
    customer_location: formData.get("location") || "Nao indicado",
    service_type: formData.get("serviceType") || "Nao indicado",
    quantity: formData.get("quantity") || "Nao indicado",
    preferred_date: formData.get("date") || "Nao indicado",
    interests: getCheckedValues(formData, "interests"),
    details: formData.get("details") || "Nao indicado",
    inquiry_summary: buildInquirySummary(formData)
  };
}

async function sendInquiryToMysticLis(config, params) {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      access_key: config.web3formsKey,
      subject: "Novo pedido Mystic Lis",
      from_name: params.customer_name,
      name: params.customer_name,
      email: params.customer_email,
      phone: params.customer_phone,
      location: params.customer_location,
      service: params.service_type,
      quantity: params.quantity,
      date: params.preferred_date,
      interests: params.interests,
      details: params.details,
      message: params.inquiry_summary
    })
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Nao foi possivel enviar o pedido para a Mystic Lis.");
  }
}

async function sendCustomerAutoReply(config, params) {
  if (!window.emailjs) {
    throw new Error("EmailJS nao carregou.");
  }

  emailjs.init({ publicKey: config.emailjsPublicKey });

  await emailjs.send(config.emailjsServiceId, config.emailjsAutoTemplateId, {
    to_name: params.customer_name,
    to_email: params.customer_email,
    customer_name: params.customer_name,
    customer_email: params.customer_email,
    service_type: params.service_type,
    preferred_date: params.preferred_date,
    inquiry_summary: params.inquiry_summary
  });
}

function openMailtoFallback(config, summary) {
  const subject = encodeURIComponent("Pedido Mystic Lis");
  const body = encodeURIComponent(summary);
  window.location.href = `mailto:${config.contactEmail}?subject=${subject}&body=${body}`;
}

function setStatus(message, isWarning = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isWarning ? "#9c5b44" : "";
}

function applyServicePrefill(service) {
  if (!service || !serviceType) return;

  serviceType.value = service;
  serviceType.dispatchEvent(new Event("change", { bubbles: true }));
}

function getQuestionnaireUrl(service, productId) {
  const params = new URLSearchParams();

  if (service) params.set("servico", service);
  if (productId) params.set("produto", productId);

  const query = params.toString();
  const hash = "#questionario";

  if (form) {
    return query ? `?${query}${hash}` : hash;
  }

  return query ? `index.html?${query}${hash}` : `index.html${hash}`;
}

function applyProductPrefill(productId) {
  const catalog = window.MysticLisCatalog;
  const product = catalog?.getProductById(productId);

  if (!product) return;

  applyServicePrefill(product.service);

  if (detailsField) {
    const line = `Referencia: ${product.name} (${product.id}).`;
    const current = detailsField.value.trim();

    if (!current.includes(product.name)) {
      detailsField.value = current ? `${current}\n\n${line}` : line;
    }
  }
}

const pageParams = new URLSearchParams(window.location.search);
const urlServico = pageParams.get("servico");
const urlProduto = pageParams.get("produto");

if (urlServico) {
  applyServicePrefill(urlServico);
}

if (urlProduto) {
  applyProductPrefill(urlProduto);
}

serviceType?.addEventListener("change", (event) => {
  const prompt = detailPrompts[event.target.value];

  if (prompt && detailsField) {
    detailsField.placeholder = prompt;
  }
});

copyButton?.addEventListener("click", async () => {
  if (!form.reportValidity()) return;

  const summary = buildInquirySummary();

  try {
    await navigator.clipboard.writeText(summary);
    setStatus("Resumo copiado. Podes colar a mensagem num email, WhatsApp ou Instagram DM.");
  } catch {
    setStatus("Nao foi possivel copiar automaticamente. Seleciona e copia os dados manualmente.", true);
  }
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const config = getEmailIntegrationConfig();
  const formData = new FormData(form);
  const params = buildTemplateParams(formData);
  const submitButton = form.querySelector('button[type="submit"]');

  if (!isEmailIntegrationConfigured(config)) {
    if (isPlaceholderValue(config.contactEmail)) {
      setStatus("Configura o email da Mystic Lis e as chaves Web3Forms/EmailJS antes de publicar.", true);
      return;
    }

    openMailtoFallback(config, params.inquiry_summary);
    setStatus("Integracao ainda nao configurada. Abrimos o teu email como alternativa.");
    return;
  }

  submitButton.disabled = true;
  setStatus("A enviar o teu pedido...");

  try {
    await sendInquiryToMysticLis(config, params);

    let autoReplySent = true;

    try {
      await sendCustomerAutoReply(config, params);
    } catch {
      autoReplySent = false;
    }

    form.reset();

    if (autoReplySent) {
      setStatus("Pedido enviado. Receberas um email de confirmacao e a Mystic Lis entrara em contacto em breve.");
    } else {
      setStatus("Pedido recebido pela Mystic Lis. O email de confirmacao pode nao ter sido enviado.", true);
    }
  } catch {
    setStatus("Nao foi possivel enviar agora. Usa Copiar resumo ou contacta pelo Instagram.", true);
  } finally {
    submitButton.disabled = false;
  }
});

const galleryModal = document.querySelector("#gallery-modal");
const galleryCards = Array.from(document.querySelectorAll(".photo-card"));
const galleryModalImage = document.querySelector("#gallery-modal-image");
const galleryModalCategory = document.querySelector("#gallery-modal-category");
const galleryModalTitle = document.querySelector("#gallery-modal-title");
const galleryModalDescription = document.querySelector("#gallery-modal-description");
const galleryModalTags = document.querySelector("#gallery-modal-tags");
const galleryModalCta = document.querySelector("#gallery-modal-cta");
const galleryModalPrev = document.querySelector("#gallery-modal-prev");
const galleryModalNext = document.querySelector("#gallery-modal-next");
const serviceTypeField = document.querySelector("#service-type");
let galleryIndex = 0;
let lastFocusedElement = null;

const galleryTagMap = {
  "Velas artesanais": ["Feito a mao", "Aromas naturais", "Presentes"],
  "Lembrancas personalizadas": ["Eventos", "Embalagem personalizada", "Lembrancas"],
  "Decoracao de eventos": ["Casamentos", "Batizados", "Eventos especiais"]
};

function getGalleryItemData(card) {
  const image = card.querySelector("img");
  const src = image?.getAttribute("src") || "";
  const catalogProduct = window.MysticLisCatalog?.getProductByImage(src);

  return {
    src,
    alt: image?.getAttribute("alt") || "",
    title:
      card.dataset.title ||
      catalogProduct?.name ||
      card.querySelector("span")?.textContent?.trim() ||
      "Trabalho Mystic Lis",
    description:
      card.dataset.description || catalogProduct?.description || image?.getAttribute("alt") || "",
    priceLabel: card.dataset.price || catalogProduct?.priceLabel || "",
    productId: card.dataset.product || catalogProduct?.id || "",
    service: card.dataset.service || catalogProduct?.service || "Velas artesanais",
    tags: catalogProduct?.tags
  };
}

function renderGalleryModal(index) {
  const card = galleryCards[index];
  if (!card) return;

  const item = getGalleryItemData(card);
  galleryIndex = index;

  galleryModalImage.src = item.src;
  galleryModalImage.alt = item.alt;
  galleryModalCategory.textContent = item.priceLabel ? `${item.service} · ${item.priceLabel}` : item.service;
  galleryModalTitle.textContent = item.title;
  galleryModalDescription.textContent = item.description;

  galleryModalTags.innerHTML = "";
  const tagList = item.tags?.length ? item.tags : galleryTagMap[item.service] || ["Artesanal", "Personalizado"];
  tagList.forEach((tag) => {
    const listItem = document.createElement("li");
    listItem.textContent = tag;
    galleryModalTags.appendChild(listItem);
  });

  galleryModalCta.href = getQuestionnaireUrl(item.service, item.productId);
  galleryModalCta.dataset.service = item.service;
  if (item.productId) galleryModalCta.dataset.product = item.productId;
  else delete galleryModalCta.dataset.product;
  galleryModalPrev.disabled = index === 0;
  galleryModalNext.disabled = index === galleryCards.length - 1;
}

function renderProductModal(product) {
  if (!galleryModal || !product) return;

  galleryIndex = -1;
  galleryModalImage.src = product.image;
  galleryModalImage.alt = product.alt;
  galleryModalCategory.textContent = `${product.service} · ${product.priceLabel}`;
  galleryModalTitle.textContent = product.name;
  galleryModalDescription.textContent = product.description;

  galleryModalTags.innerHTML = "";
  (product.tags || []).forEach((tag) => {
    const listItem = document.createElement("li");
    listItem.textContent = tag;
    galleryModalTags.appendChild(listItem);
  });

  galleryModalCta.href = getQuestionnaireUrl(product.service, product.id);
  galleryModalCta.dataset.service = product.service;
  galleryModalCta.dataset.product = product.id;
  galleryModalPrev.disabled = true;
  galleryModalNext.disabled = true;
}

function openGalleryModal(index) {
  if (!galleryModal || !galleryCards.length) return;

  lastFocusedElement = document.activeElement;
  renderGalleryModal(index);
  galleryModal.hidden = false;
  document.body.classList.add("modal-open");
  galleryModal.querySelector(".gallery-modal-close")?.focus();
}

function openProductModal(product) {
  if (!galleryModal || !product) return;

  lastFocusedElement = document.activeElement;
  renderProductModal(product);
  galleryModal.hidden = false;
  document.body.classList.add("modal-open");
  galleryModal.querySelector(".gallery-modal-close")?.focus();
}

function closeGalleryModal() {
  if (!galleryModal) return;

  galleryModal.hidden = true;
  document.body.classList.remove("modal-open");
  galleryModalImage.removeAttribute("src");
  lastFocusedElement?.focus();
}

galleryCards.forEach((card, index) => {
  card.addEventListener("click", () => openGalleryModal(index));
});

galleryModal?.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeGalleryModal);
});

galleryModalPrev?.addEventListener("click", () => {
  if (galleryIndex > 0) renderGalleryModal(galleryIndex - 1);
});

galleryModalNext?.addEventListener("click", () => {
  if (galleryIndex < galleryCards.length - 1) renderGalleryModal(galleryIndex + 1);
});

galleryModalCta?.addEventListener("click", () => {
  const service = galleryModalCta.dataset.service;
  const productId = galleryModalCta.dataset.product;

  if (form && service) {
    applyServicePrefill(service);
    if (productId) applyProductPrefill(productId);
    closeGalleryModal();
  }
});

function buildProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card";
  article.dataset.category = product.category;

  const figure = document.createElement("figure");
  figure.className = "product-card-media";

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.alt;
  img.loading = "lazy";
  figure.appendChild(img);

  const body = document.createElement("div");
  body.className = "product-card-body";

  const meta = document.createElement("p");
  meta.className = "product-card-meta";
  meta.textContent = `${product.collection} · ${product.priceLabel}`;

  const title = document.createElement("h3");
  title.textContent = product.name;

  const copy = document.createElement("p");
  copy.className = "product-card-copy";
  copy.textContent = product.description;

  const actions = document.createElement("div");
  actions.className = "product-card-actions";

  const orderLink = document.createElement("a");
  orderLink.className = "button primary";
  orderLink.href = getQuestionnaireUrl(product.service, product.id);
  orderLink.textContent = "Pedir";

  const galleryLink = document.createElement("button");
  galleryLink.type = "button";
  galleryLink.className = "button ghost product-quick-view";
  galleryLink.textContent = "Ver foto";
  galleryLink.dataset.productImage = product.image;

  actions.append(orderLink, galleryLink);
  body.append(meta, title, copy, actions);
  article.append(figure, body);

  return article;
}

function initShopGrid(container, options = {}) {
  const catalog = window.MysticLisCatalog;
  if (!container || !catalog) return;

  const { featuredOnly = false, enableFilters = false } = options;
  let activeCategory = "todas";
  const urlCategory = new URLSearchParams(window.location.search).get("categoria");

  if (urlCategory && catalog.categories.some((entry) => entry.id === urlCategory)) {
    activeCategory = urlCategory;
  }

  const grid = container.querySelector("[data-shop-grid]") || container;
  const filterRoot = container.querySelector("[data-shop-filters]");

  function renderProducts() {
    let list = featuredOnly ? catalog.getFeaturedProducts() : catalog.products;

    if (activeCategory !== "todas") {
      list = list.filter((product) => product.category === activeCategory);
    }

    grid.innerHTML = "";
    list.forEach((product) => grid.appendChild(buildProductCard(product)));

    grid.querySelectorAll(".product-quick-view").forEach((button) => {
      button.addEventListener("click", () => {
        const src = button.dataset.productImage;
        const index = galleryCards.findIndex((card) => {
          const imgSrc = card.querySelector("img")?.getAttribute("src") || "";
          return imgSrc === src || imgSrc.endsWith(src);
        });

        if (index >= 0) {
          openGalleryModal(index);
          return;
        }

        const product = catalog.getProductByImage(src);
        if (product) openProductModal(product);
      });
    });
  }

  if (enableFilters && filterRoot) {
    filterRoot.innerHTML = "";
    catalog.categories.forEach((category) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "shop-filter";
      chip.dataset.filter = category.id;
      chip.textContent = category.label;
      chip.setAttribute("aria-pressed", category.id === activeCategory ? "true" : "false");

      chip.addEventListener("click", () => {
        activeCategory = category.id;
        filterRoot.querySelectorAll(".shop-filter").forEach((el) => {
          el.setAttribute("aria-pressed", el.dataset.filter === activeCategory ? "true" : "false");
        });
        renderProducts();
      });

      filterRoot.appendChild(chip);
    });
  }

  renderProducts();
}

initShopGrid(document.querySelector("#featured-shop"), { featuredOnly: true });
initShopGrid(document.querySelector("#velas-shop"), { enableFilters: true });

document.addEventListener("keydown", (event) => {
  if (galleryModal?.hidden) return;

  if (event.key === "Escape") {
    closeGalleryModal();
    return;
  }

  if (event.key === "ArrowLeft" && galleryIndex > 0) {
    renderGalleryModal(galleryIndex - 1);
  }

  if (event.key === "ArrowRight" && galleryIndex < galleryCards.length - 1) {
    renderGalleryModal(galleryIndex + 1);
  }
});
