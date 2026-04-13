export function Footer() {
  return (
    <footer className="py-12 bg-alabaster border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-terracotta flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-alabaster" />
          </div>
          <span className="font-serif font-medium text-lg tracking-tight text-charcoal">Atelier</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-charcoal/60 font-sans">
          <a href="/logo-with-text.svg" download="atelier-logo.svg" className="hover:text-charcoal transition-colors">Download Logo</a>
          <a href="#" className="hover:text-charcoal transition-colors">Twitter</a>
          <a href="#" className="hover:text-charcoal transition-colors">Instagram</a>
          <a href="#" className="hover:text-charcoal transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
