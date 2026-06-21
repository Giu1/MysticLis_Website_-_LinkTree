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

function buildInquirySummary() {
  const formData = new FormData(form);

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

function setStatus(message, isWarning = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isWarning ? "#9c5b44" : "";
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

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const contactEmail = getContactEmail();
  const summary = buildInquirySummary();
  const subject = encodeURIComponent("Pedido Mystic Lis");
  const body = encodeURIComponent(summary);

  if (contactEmail.includes("example.com")) {
    setStatus("Antes de publicar, substitui mysticlis@example.com pelo email real da empresa.", true);
    return;
  }

  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  setStatus("Email preparado. Se o teu navegador nao abrir o email, usa o botao Copiar resumo.");
});
