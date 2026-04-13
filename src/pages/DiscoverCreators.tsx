import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Search, Users, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DiscoverCreators() {
  const [creators, setCreators] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.profile.creators()
      .then(({ creators }) => setCreators(creators || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = creators.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.niche?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="pt-24 pb-16 min-h-screen bg-alabaster">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-4">Discover Creators</h1>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">Find tastemakers and curators that match your aesthetic.</p>
        </div>

        <div className="relative max-w-md mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-charcoal/40" />
          </div>
          <input
            type="text"
            placeholder="Search creators by name or niche..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-charcoal/60">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-charcoal/60">No creators found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(c => {
              const slug = c.username || c.name?.toLowerCase().replace(/\s+/g, '') || c.uid
              return (
                <Link key={c.uid} to={`/${slug}`} state={{ fromDiscover: true }}
                  className="bg-white rounded-2xl border border-black/5 overflow-hidden group hover:shadow-md transition-all">
                  <div className="h-24 bg-gradient-to-br from-terracotta/20 to-charcoal/10" />
                  <div className="px-5 pb-5 relative">
                    <div className="w-14 h-14 rounded-full border-4 border-white bg-alabaster overflow-hidden -mt-7 mb-3 relative z-10">
                      {c.avatarUrl ? (
                        <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-charcoal/40 font-serif text-xl">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-medium text-charcoal mb-1">{c.name}</h3>
                    <p className="text-xs text-charcoal/60 line-clamp-2">{c.niche || c.bio || 'Content Creator'}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-charcoal/40">
                      <Star className="w-3 h-3" /> Creator
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
