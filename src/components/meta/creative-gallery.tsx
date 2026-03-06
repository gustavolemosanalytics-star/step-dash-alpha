"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CreativeData } from "@/hooks/use-meta-ads";
import { formatNumber, formatCurrency } from "@/lib/format";
import { X, Eye, MousePointerClick, ShoppingCart, DollarSign } from "lucide-react";

interface CreativeGalleryProps {
  creatives: CreativeData[];
}

export function CreativeGallery({ creatives }: CreativeGalleryProps) {
  const [selected, setSelected] = useState<CreativeData | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Galeria de Criativos</h3>
          <p className="text-xs text-muted-foreground">{creatives.length} criativos</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {creatives.map((creative, i) => (
            <motion.div
              key={creative.ad_name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              onClick={() => setSelected(creative)}
              className="group cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 bg-secondary/30"
            >
              <div className="relative aspect-square bg-secondary">
                {creative.thumbnail_url ? (
                  <Image
                    src={creative.thumbnail_url}
                    alt={creative.ad_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Eye size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-between text-[10px] text-white/90">
                    <span>{formatNumber(creative.impressions)} imp.</span>
                    <span>{formatNumber(creative.purchases)} compras</span>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <p className="text-[11px] text-foreground font-medium truncate">{creative.ad_name}</p>
                <p className="text-[10px] text-muted-foreground">{formatCurrency(creative.spend)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="relative aspect-video bg-secondary">
                {selected.thumbnail_url && (
                  <Image
                    src={selected.thumbnail_url}
                    alt={selected.ad_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 bg-black/50 rounded-full p-1.5 text-white hover:bg-black/70 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-foreground mb-4 text-sm">{selected.ad_name}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <MetricItem icon={Eye} label="Impressões" value={formatNumber(selected.impressions)} />
                  <MetricItem icon={MousePointerClick} label="Cliques" value={formatNumber(selected.clicks)} />
                  <MetricItem icon={ShoppingCart} label="Compras" value={formatNumber(selected.purchases)} />
                  <MetricItem icon={DollarSign} label="Receita" value={formatCurrency(selected.revenue)} />
                  <MetricItem icon={DollarSign} label="Investimento" value={formatCurrency(selected.spend)} />
                  <MetricItem icon={DollarSign} label="CPL" value={formatCurrency(selected.cpl)} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MetricItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon size={12} className="text-primary" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
