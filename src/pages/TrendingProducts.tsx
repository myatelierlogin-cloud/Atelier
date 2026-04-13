import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Search, TrendingUp, ExternalLink } from 'lucide-react'

export default function TrendingProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.products.trending()
      .then(({ products }) => setProducts(products || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="pt-24 pb-16 min-h-screen bg-alabaster">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-4">Trending Products</h1>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">Discover what's popular right now across all creator storefronts.</p>
        </div>

        <div className="relative max-w-md mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-charcoal/40" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-charcoal/60">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-charcoal/60">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:shadow-md transition-all">
                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover rounded-xl mb-4" />}
                <div className="text-xs font-medium text-charcoal/40 mb-1 uppercase tracking-wider">{p.category}</div>
                <h3 className="text-lg font-medium text-charcoal mb-2">{p.name}</h3>
                <p className="text-sm text-charcoal/60 mb-4 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-charcoal">${p.price}</span>
                  {p.buy_link && (
                    <a href={p.buy_link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors">
                      Shop Now <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
