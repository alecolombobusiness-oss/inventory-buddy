import { useMemo } from "react";
import { Package, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import { getProducts, getSales } from "@/lib/storage";
import { StatCard } from "@/components/StatCard";
import { AppLayout } from "@/components/AppLayout";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

const Dashboard = () => {
  const products = getProducts();
  const sales = getSales();

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalItems = products.reduce((s, p) => s + p.quantity, 0);
    const inventoryValue = products.reduce((s, p) => s + p.purchasePrice * p.quantity, 0);
    const totalRevenue = sales.reduce((s, sale) => s + sale.salePrice * sale.quantity, 0);
    const totalCost = sales.reduce((s, sale) => s + sale.purchasePrice * sale.quantity, 0);
    const totalProfit = totalRevenue - totalCost;
    const totalSales = sales.length;

    return { totalProducts, totalItems, inventoryValue, totalRevenue, totalProfit, totalSales };
  }, [products, sales]);

  const recentSales = useMemo(() => {
    return [...sales].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }, [sales]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Panoramica del tuo business</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Prodotti" value={stats.totalProducts} icon={Package} trend={`${stats.totalItems} pezzi in stock`} trendUp />
          <StatCard label="Valore Magazzino" value={formatCurrency(stats.inventoryValue)} icon={DollarSign} />
          <StatCard label="Vendite Totali" value={stats.totalSales} icon={ShoppingCart} />
          <StatCard label="Profitto Totale" value={formatCurrency(stats.totalProfit)} icon={TrendingUp} trendUp={stats.totalProfit > 0} trend={stats.totalProfit >= 0 ? "In positivo" : "In negativo"} />
        </div>

        {/* Recent sales */}
        <div className="bg-card rounded-xl border border-border">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Ultime Vendite</h2>
          </div>
          {recentSales.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted-foreground text-sm">
              Nessuna vendita registrata
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="px-5 py-3 font-medium">Prodotto</th>
                    <th className="px-5 py-3 font-medium">Qtà</th>
                    <th className="px-5 py-3 font-medium">Prezzo</th>
                    <th className="px-5 py-3 font-medium">Profitto</th>
                    <th className="px-5 py-3 font-medium">Piattaforma</th>
                    <th className="px-5 py-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale) => {
                    const profit = (sale.salePrice - sale.purchasePrice) * sale.quantity;
                    return (
                      <tr key={sale.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="px-5 py-3 font-medium">{sale.productName}</td>
                        <td className="px-5 py-3">{sale.quantity}</td>
                        <td className="px-5 py-3 font-mono">{formatCurrency(sale.salePrice)}</td>
                        <td className={`px-5 py-3 font-mono font-medium ${profit >= 0 ? "text-success" : "text-destructive"}`}>
                          {formatCurrency(profit)}
                        </td>
                        <td className="px-5 py-3">{sale.platform}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {new Date(sale.createdAt).toLocaleDateString("it-IT")}
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

export default Dashboard;
