import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getProducts, addProduct, deleteProduct, updateProduct } from "@/lib/storage";
import { Product, CATEGORIES } from "@/types/inventory";
import { Plus, Trash2, Edit2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

const emptyForm = { name: "", brand: "", sku: "", purchasePrice: 0, sellingPrice: 0, quantity: 1, category: "Sneakers", notes: "" };

const Inventario = () => {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

  const refreshProducts = () => setProducts(getProducts());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editId) {
      updateProduct(editId, {
        name: form.name.trim(),
        brand: form.brand.trim(),
        sku: form.sku.trim(),
        purchasePrice: Number(form.purchasePrice),
        sellingPrice: Number(form.sellingPrice),
        quantity: Number(form.quantity),
        category: form.category,
        notes: form.notes.trim(),
      });
    } else {
      addProduct({
        name: form.name.trim(),
        brand: form.brand.trim(),
        sku: form.sku.trim(),
        purchasePrice: Number(form.purchasePrice),
        sellingPrice: Number(form.sellingPrice),
        quantity: Number(form.quantity),
        category: form.category,
        notes: form.notes.trim(),
      });
    }
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
    refreshProducts();
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name,
      brand: p.brand,
      sku: p.sku,
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      quantity: p.quantity,
      category: p.category,
      notes: p.notes,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Eliminare questo prodotto?")) {
      deleteProduct(id);
      refreshProducts();
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventario</h1>
            <p className="text-muted-foreground text-sm mt-1">{products.length} prodotti in magazzino</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Aggiungi Prodotto
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cerca prodotti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowForm(false)} />
            <form
              onSubmit={handleSubmit}
              className="relative bg-card rounded-xl border border-border p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{editId ? "Modifica Prodotto" : "Nuovo Prodotto"}</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Nome *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Brand</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">SKU / Taglia</label>
                  <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Prezzo Acquisto (€) *</label>
                  <input required type="number" step="0.01" min="0" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Prezzo Vendita (€)</label>
                  <input type="number" step="0.01" min="0" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantità *</label>
                  <input required type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Categoria</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Note</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" />
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity">
                {editId ? "Salva Modifiche" : "Aggiungi Prodotto"}
              </button>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-muted-foreground text-sm">
              {products.length === 0 ? "Nessun prodotto. Aggiungi il tuo primo prodotto!" : "Nessun risultato"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="px-5 py-3 font-medium">Prodotto</th>
                    <th className="px-5 py-3 font-medium">SKU</th>
                    <th className="px-5 py-3 font-medium">Categoria</th>
                    <th className="px-5 py-3 font-medium">Acquisto</th>
                    <th className="px-5 py-3 font-medium">Vendita</th>
                    <th className="px-5 py-3 font-medium">Qtà</th>
                    <th className="px-5 py-3 font-medium">Margine</th>
                    <th className="px-5 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const margin = p.sellingPrice > 0 ? ((p.sellingPrice - p.purchasePrice) / p.purchasePrice * 100) : 0;
                    return (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="px-5 py-3">
                          <div className="font-medium">{p.name}</div>
                          {p.brand && <div className="text-xs text-muted-foreground">{p.brand}</div>}
                        </td>
                        <td className="px-5 py-3 font-mono text-xs">{p.sku || "–"}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono">{formatCurrency(p.purchasePrice)}</td>
                        <td className="px-5 py-3 font-mono">{p.sellingPrice > 0 ? formatCurrency(p.sellingPrice) : "–"}</td>
                        <td className="px-5 py-3">
                          <span className={cn("font-semibold", p.quantity <= 0 ? "text-destructive" : p.quantity <= 2 ? "text-warning" : "")}>
                            {p.quantity}
                          </span>
                        </td>
                        <td className={cn("px-5 py-3 font-mono font-medium", margin > 0 ? "text-success" : margin < 0 ? "text-destructive" : "")}>
                          {p.sellingPrice > 0 ? `${margin.toFixed(0)}%` : "–"}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEdit(p)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
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

export default Inventario;
