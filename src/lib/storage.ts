import { Product, Sale } from "@/types/inventory";

const PRODUCTS_KEY = "resell-products";
const SALES_KEY = "resell-sales";

export function getProducts(): Product[] {
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function addProduct(product: Omit<Product, "id" | "createdAt">): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
  }
}

export function deleteProduct(id: string) {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

export function getSales(): Sale[] {
  const data = localStorage.getItem(SALES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSales(sales: Sale[]) {
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
}

export function addSale(sale: Omit<Sale, "id" | "createdAt">): Sale {
  const sales = getSales();
  const newSale: Sale = {
    ...sale,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  sales.push(newSale);
  saveSales(sales);

  // Update product quantity
  const products = getProducts();
  const product = products.find((p) => p.id === sale.productId);
  if (product) {
    product.quantity -= sale.quantity;
    saveProducts(products);
  }

  return newSale;
}

export function deleteSale(id: string) {
  const sales = getSales();
  const sale = sales.find((s) => s.id === id);
  if (sale) {
    // Restore product quantity
    const products = getProducts();
    const product = products.find((p) => p.id === sale.productId);
    if (product) {
      product.quantity += sale.quantity;
      saveProducts(products);
    }
  }
  saveSales(sales.filter((s) => s.id !== id));
}
