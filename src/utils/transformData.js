const categoryMapping = {
  electronics: "investment",
  jewelery: "savings",
  "men's clothing": "insurance",
  "women's clothing": "crypto"
};

const riskMapping = {
  investment: "medium",
  savings: "low",
  insurance: "low",
  crypto: "high"
};

const liquidityMapping = {
  savings: "easy",
  investment: "moderate",
  insurance: "locked",
  crypto: "easy"
};

const timeHorizonMapping = {
  savings: "short",
  investment: "long",
  insurance: "long",
  crypto: "long"
};

const fallbackApiProducts = [
  {
    id: 1,
    title: "Precision Wireless Headphones",
    category: "electronics",
    description: "Noise-canceling headphones with long battery life.",
    price: 189.99,
    image: "https://via.placeholder.com/300x300?text=Electronics+1"
  },
  {
    id: 2,
    title: "Premium Silver Necklace",
    category: "jewelery",
    description: "Minimalist silver necklace for everyday wear.",
    price: 79.5,
    image: "https://via.placeholder.com/300x300?text=Jewelery+1"
  },
  {
    id: 3,
    title: "Classic Men Jacket",
    category: "men's clothing",
    description: "Water-resistant jacket for all seasons.",
    price: 129,
    image: "https://via.placeholder.com/300x300?text=Mens+1"
  },
  {
    id: 4,
    title: "Women's Athleisure Set",
    category: "women's clothing",
    description: "Breathable matching top and leggings set.",
    price: 99,
    image: "https://via.placeholder.com/300x300?text=Womens+1"
  },
  {
    id: 5,
    title: "Smart Home Hub",
    category: "electronics",
    description: "Voice-enabled automation hub for connected devices.",
    price: 149,
    image: "https://via.placeholder.com/300x300?text=Electronics+2"
  },
  {
    id: 6,
    title: "Gold Tone Bracelet",
    category: "jewelery",
    description: "Elegant bracelet with polished finish.",
    price: 64,
    image: "https://via.placeholder.com/300x300?text=Jewelery+2"
  },
  {
    id: 7,
    title: "Men Formal Shirt",
    category: "men's clothing",
    description: "Wrinkle-resistant shirt for office and events.",
    price: 45,
    image: "https://via.placeholder.com/300x300?text=Mens+2"
  },
  {
    id: 8,
    title: "Women's Long Coat",
    category: "women's clothing",
    description: "Tailored coat with soft interior lining.",
    price: 159,
    image: "https://via.placeholder.com/300x300?text=Womens+2"
  }
];

function deterministicReturn(riskLevel, id) {
  const seed = id % 10;
  if (riskLevel === "low") return parseFloat((3 + (seed / 10) * 4).toFixed(2));
  if (riskLevel === "medium") return parseFloat((7 + (seed / 10) * 5).toFixed(2));
  if (riskLevel === "high") return parseFloat((12 + (seed / 10) * 15).toFixed(2));
  return 0;
}

export function transformToFinancialProduct(apiProduct) {
  const category = categoryMapping[apiProduct.category] || "investment";
  const riskLevel = riskMapping[category];
  const expectedReturn = deterministicReturn(riskLevel, apiProduct.id);
  const minInvestment = Math.round(apiProduct.price * 1000);

  return {
    id: apiProduct.id,
    name: apiProduct.title,
    category,
    description: apiProduct.description,
    expectedReturn,
    riskLevel,
    liquidity: liquidityMapping[category],
    timeHorizon: timeHorizonMapping[category],
    minInvestment,
    image: apiProduct.image
  };
}

export async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error("API fetch failed");
    const data = await res.json();
    return data.map(transformToFinancialProduct);
  } catch {
    return fallbackApiProducts.map(transformToFinancialProduct);
  }
}
