import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getProducts, getSales, addSale, deleteSale } from "@/lib/storage";
import { Sale, PLATFORMS } from "@/types/inventory";
import { Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

const Vendite = () => {
  const [sales, setSales] = useState<Sale[]>(getSales());
  const [showForm, setShowForm] = useState(false);
  const products = getProducts();

  const [form, setForm] = useState({
    productId: "",
    quantity: 1,
    salePrice: 0,
    platform: "StockX",
  });

  const refreshSales = () => setSales(getSales());

  const selectedProduct = products.find((p) => p.id === form.productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !selectedProduct) return;

    addSale({
      productId: form.productId,
      productName: selectedProduct.name,
      quantity: Number(form.quantity),
      salePrice: Number(form.salePrice),
      purchasePrice: selectedProduct.purchasePrice,
      platform: form.platform,
    });

    setForm({ productId: "", quantity: 1, salePrice: 0, platform: "StockX" });
    setShowForm(false);
    refreshSales();
  };

  const handleDelete = (id: string) => {
    if (confirm("Eliminare questa vendita? La quantità verrà ripristinata.")) {
      deleteSale(id);
      refreshSales();
    }
  };

  const sortedSales = [...sales].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalRevenue = sales.reduce((s, sale) => s + sale.salePrice * sale.quantity, 0);
  const totalProfit = sales.reduce((s, sale) => s + (sale.salePrice - sale.purchasePrice) * sale.quantity, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vendite</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {sales.length} vendite · Ricavi {formatCurrency(totalRevenue)} · Profitto{" "}
              <span className={cn("font-semibold", totalProfit >= 0 ? "text-success" : "text-destructive")}>
                {formatCurrency(totalProfit)}
              </span>
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            disabled={products.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> Registra Vendita
          </button>
        </div>

        {products.length === 0 && (
          <div className="bg-card rounded-xl border border-border px-5 py-8 text-center text-muted-foreground text-sm">
            Aggiungi prima dei prodotti nell'inventario per registrare vendite.
          </div>
        )}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowForm(false)} />
            <form
              onSubmit={handleSubmit}
              className="relative bg-card rounded-xl border border-border p-6 w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Nuova Vendita</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Prodotto *</label>
                  <select
                    required
                    value={form.productId}
                    onChange={(e) => {
                      const p = products.find((pr) => pr.id === e.target.value);
                      setForm({ ...form, productId: e.target.value, salePrice: p?.sellingPrice || 0 });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option value="">Seleziona prodotto</option>
                    {products.filter((p) => p.quantity > 0).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.brand ? `(${p.brand})` : ""} — {p.quantity} disponibili
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Quantità *</label>
                    <input
                      required
                      type="number"
                      min="1"
                      max={selectedProduct?.quantity || 1}
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Prezzo Vendita (€) *</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.salePrice}
                      onChange={(e) => setForm({ ...form, salePrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Piattaforma</label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                {selectedProduct && (
                  <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Costo acquisto:</span>
                      <span className="font-mono">{formatCurrency(selectedProduct.purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profitto stimato:</span>
                      <span className={cn("font-mono font-semibold", (form.salePrice - selectedProduct.purchasePrice) >= 0 ? "text-success" : "text-destructive")}>
                        {formatCurrency((form.salePrice - selectedProduct.purchasePrice) * form.quantity)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity">
                Registra Vendita
              </button>
            </form>
          </div>
        )}

        {/* Sales table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {sortedSales.length === 0 && products.length > 0 ? (
            <div className="px-5 py-12 text-center text-muted-foreground text-sm">
              Nessuna vendita registrata
            </div>
          ) : sortedSales.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="px-5 py-3 font-medium">Prodotto</th>
                    <th className="px-5 py-3 font-medium">Qtà</th>
                    <th className="px-5 py-3 font-medium">Prezzo</th>
                    <th className="px-5 py-3 font-medium">Costo</th>
                    <th className="px-5 py-3 font-medium">Profitto</th>
                    <th className="px-5 py-3 font-medium">Piattaforma</th>
                    <th className="px-5 py-3 font-medium">Data</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSales.map((sale) => {
                    const profit = (sale.salePrice - sale.purchasePrice) * sale.quantity;
                    return (
                      <tr key={sale.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="px-5 py-3 font-medium">{sale.productName}</td>
                        <td className="px-5 py-3">{sale.quantity}</td>
                        <td className="px-5 py-3 font-mono">{formatCurrency(sale.salePrice)}</td>
                        <td className="px-5 py-3 font-mono text-muted-foreground">{formatCurrency(sale.purchasePrice)}</td>
                        <td className={cn("px-5 py-3 font-mono font-medium", profit >= 0 ? "text-success" : "text-destructive")}>
                          {formatCurrency(profit)}
                        </td>
                        <td className="px-5 py-3">{sale.platform}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {new Date(sale.createdAt).toLocaleDateString("it-IT")}
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => handleDelete(sale.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Vendite;
