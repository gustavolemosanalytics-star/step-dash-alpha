export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return new Intl.NumberFormat("pt-BR", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatCurrency(value: number): string {
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(2).replace(".", ",");
    return `R$ ${formatted} mil`;
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2).replace(".", ",")}%`;
}

export function formatVariation(current: number, previous: number): { value: string; positive: boolean } {
  if (previous === 0) return { value: "—", positive: true };
  const variation = ((current - previous) / previous) * 100;
  return {
    value: `${variation > 0 ? "" : ""}${variation.toFixed(1).replace(".", ",")}%`,
    positive: variation >= 0,
  };
}
