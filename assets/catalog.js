(function () {
  const MYSTIC_LIS_CATALOG = [
  {
    id: "canela-citrico",
    name: "Vela taça Canela & Cítrico",
    category: "velas",
    collection: "Soft Rituals",
    image: "assets/gallery/work-01.jpeg",
    alt: "Vela artesanal em taça branca com canela, laranja seca e pó aromático.",
    description:
      "Vela decorativa em cera de soja, com toppings naturais de canela e citrinos. Ideal para presentes acolhedores ou mesas de inverno.",
    service: "Velas artesanais",
    priceLabel: "Sob consulta",
    tags: ["Cera de soja", "Aromática", "Presente"],
    featured: true
  },
  {
    id: "botanical-cloves",
    name: "Vela cerâmica Botanical",
    category: "velas",
    collection: "Soft Rituals",
    image: "assets/gallery/work-07.jpeg",
    alt: "Vela em jarra cerâmica bege com cravos e bunny tail.",
    description:
      "Peça minimalista em recipiente cerâmico, decorada com elementos botânicos secos. Fragrâncias veganas e acabamento artesanal.",
    service: "Velas artesanais",
    priceLabel: "Sob consulta",
    tags: ["Botanical", "Feito à mão", "Vegan"],
    featured: true
  },
  {
    id: "embalagem-mystic",
    name: "Embalagem presente Mystic Lis",
    category: "embalagem",
    collection: "Seasonal Glow",
    image: "assets/gallery/work-08.jpeg",
    alt: "Caixa kraft Mystic Lis com laço branco e etiqueta da marca.",
    description:
      "Caixa de cartão kraft com fita e identidade Mystic Lis — pronta para oferecer ou enviar via CTT.",
    service: "Velas artesanais",
    priceLabel: "Incluída / sob consulta",
    tags: ["Marca Mystic Lis", "Presente", "Entrega"],
    featured: true
  },
  {
    id: "cabaz-presente",
    name: "Cabaz aromático para presente",
    category: "presentes",
    collection: "Seasonal Glow",
    image: "assets/gallery/work-05.jpeg",
    alt: "Caixa de presente aberta com vela, melts e produtos de banho.",
    description:
      "Composição personalizável: velas, wax melts, saquinhos aromáticos e detalhes sazonais. Perfeito para datas especiais.",
    service: "Velas artesanais",
    priceLabel: "Sob consulta",
    tags: ["Cabaz", "Sazonal", "Personalizável"],
    featured: true
  },
  {
    id: "pack-especial",
    name: "Pack especial Mystic Lis",
    category: "presentes",
    collection: "Seasonal Glow",
    image: "assets/gallery/work-09.jpeg",
    alt: "Pack de presente com vela, laço e produtos aromáticos.",
    description:
      "Conjunto curado com apresentação cuidada — aromas, cores e mensagem adaptados ao destinatário.",
    service: "Velas artesanais",
    priceLabel: "Sob consulta",
    tags: ["Pack", "Oferta", "Personalizado"]
  },
  {
    id: "anjo-comunhao",
    name: "Vela anjo — comunhão / batizado",
    category: "eventos",
    collection: "Event Minis",
    image: "assets/gallery/work-15.jpeg",
    alt: "Vela em forma de anjo com coração e cruz dourada.",
    description:
      "Lembrança em cera com formato anjo, coração vazado e detalhe de cruz. Tags e embalagem personalizáveis por evento.",
    service: "Lembrancas personalizadas",
    priceLabel: "Sob consulta",
    tags: ["Comunhão", "Batizado", "Personalizado"],
    featured: true
  },
  {
    id: "lembrancas-quantidade",
    name: "Lembranças em quantidade",
    category: "eventos",
    collection: "Event Minis",
    image: "assets/gallery/work-16.jpeg",
    alt: "Cesto com velas anjo embaladas individualmente para convidados.",
    description:
      "Produção coordenada para convidados: embalagem individual, etiquetas com nome e data, prazos alinhados ao evento.",
    service: "Lembrancas personalizadas",
    priceLabel: "Orçamento por quantidade",
    tags: ["Eventos", "Etiquetas", "Encomenda"]
  },
  {
    id: "formato-especial",
    name: "Velas formato especial",
    category: "velas",
    collection: "Event Minis",
    image: "assets/gallery/work-13.jpeg",
    alt: "Vela decorativa com forma e detalhes únicos.",
    description:
      "Peças moldadas e decorativas para ocasiões simbólicas, mesas temáticas ou coleções limitadas.",
    service: "Velas artesanais",
    priceLabel: "Sob consulta",
    tags: ["Formato especial", "Decorativa"]
  },
  {
    id: "colecoes-encomenda",
    name: "Coleções & encomendas",
    category: "velas",
    collection: "Soft Rituals",
    image: "assets/gallery/work-12.jpeg",
    alt: "Várias velas artesanais Mystic Lis em composição.",
    description:
      "Linhas para lojas, cabazes corporativos ou coleções privadas — quantidades e aromas definidos contigo.",
    service: "Velas artesanais",
    priceLabel: "Orçamento",
    tags: ["Quantidade", "Marca", "Coleção"]
  },
  {
    id: "evento-mesa",
    name: "Detalhes para mesas de evento",
    category: "eventos",
    collection: "Event Minis",
    image: "assets/gallery/work-17.jpeg",
    alt: "Peça artesanal preparada para decoração de evento.",
    description:
      "Elementos aromáticos e visuais para casamentos, batizados e celebrações — coordenados com o estilo do dia.",
    service: "Decoracao de eventos",
    priceLabel: "Sob consulta",
    tags: ["Decoração", "Mesa", "Evento"]
  },
  {
    id: "detalhes-naturais",
    name: "Velas com detalhes naturais",
    category: "velas",
    collection: "Soft Rituals",
    image: "assets/gallery/work-02.jpeg",
    alt: "Vela artesanal com composição natural delicada.",
    description:
      "Acabamentos com botanicals, madeira e tecidos neutros — estética calma para casa ou spa em casa.",
    service: "Velas artesanais",
    priceLabel: "Sob consulta",
    tags: ["Natural", "Casa", "Autocuidado"]
  },
  {
    id: "pronto-oferecer",
    name: "Pronto a oferecer",
    category: "presentes",
    collection: "Seasonal Glow",
    image: "assets/gallery/work-11.jpeg",
    alt: "Conjunto artesanal embalado para oferta.",
    description:
      "Peças finalizadas com laço, cartão ou mensagem — entrega em Aveiro, Leiria, Torres Novas ou CTT.",
    service: "Velas artesanais",
    priceLabel: "Sob consulta",
    tags: ["Entrega", "Presente", "CTT"]
  }
  ];

  const SHOP_CATEGORIES = [
  { id: "todas", label: "Todas" },
  { id: "velas", label: "Velas" },
  { id: "presentes", label: "Presentes" },
  { id: "eventos", label: "Eventos" },
  { id: "embalagem", label: "Embalagem" }
  ];

  window.MysticLisCatalog = {
    products: MYSTIC_LIS_CATALOG,
    categories: SHOP_CATEGORIES,
    getFeaturedProducts() {
      return MYSTIC_LIS_CATALOG.filter((p) => p.featured);
    },
    getProductById(id) {
      return MYSTIC_LIS_CATALOG.find((p) => p.id === id);
    },
    getProductByImage(src) {
      const normalized = src?.replace(/^\.\//, "") || "";
      return MYSTIC_LIS_CATALOG.find((p) => p.image === normalized || normalized.endsWith(p.image));
    }
  };
})();
