import React, { useState, useMemo, useRef } from 'react';
import { MarketProduct } from '../types';
import { MARKET_PRODUCTS, MARKET_HERO_IMAGE, CLEUSA_PORTRAIT } from '../data/mockData';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

interface MarketViewProps {
  onSelectProduct: (product: MarketProduct) => void;
  onOpenProducerModal: () => void;
}

export const MarketView: React.FC<MarketViewProps> = ({ onSelectProduct, onOpenProducerModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'popular'>('recent');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const heroParallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const categories = [
    { id: 'all', label: 'Tudo' },
    { id: 'decoracao', label: 'Artesanato & Decoração' },
    { id: 'moda', label: 'Moda & Acessórios' },
    { id: 'alimentos', label: 'Alimentos & Quitutes' },
    { id: 'hortifruti', label: 'Hortifruti Orgânico' },
    { id: 'cestas', label: 'Cestas Presente' },
  ];

  const filteredProducts = useMemo(() => {
    let list = MARKET_PRODUCTS.filter((prod) => {
      const matchCategory = 
        selectedCategory === 'all' || 
        prod.category === selectedCategory ||
        (selectedCategory === 'cestas' && (prod.id.includes('cesta') || prod.id.includes('kit')));

      const matchSearch = 
        !searchQuery || 
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.producer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section: Feira Virtual Solidária */}
      <section ref={heroRef} className="relative w-full bg-white overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-24 border-b border-slate-200">
        {/* Atmospheric decorative gradient backdrops */}
        <motion.div 
          style={{ y: heroParallaxY }}
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" 
        />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            {/* Left Column: Copy & Badges */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-7/12 flex flex-col gap-5"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#166534] font-sans text-xs sm:text-sm px-4 py-1.5 rounded-full w-fit shadow-xs font-bold border border-emerald-200">
                <span className="material-symbols-outlined text-[18px] text-[#166534]">verified</span>
                <span>100% do lucro vai para quem produz • Comércio justo garantido</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight font-bold">
                Feira Virtual <span className="text-[#b45309]">Solidária:</span> Compre com Propósito.
              </h1>

              <p className="font-sans text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed">
                Cada produto carrega uma história de superação e gera renda direta para as famílias, costureiras, agricultores e jovens formados nos projetos comunitários de Itaguaí.
              </p>

              {/* Key Stats Counters Row */}
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200">
                <div className="flex flex-col">
                  <span className="font-serif text-3xl sm:text-4xl text-[#166534] font-bold">+140</span>
                  <span className="font-sans text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Famílias Beneficiadas
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-3xl sm:text-4xl text-[#b45309] font-bold">100%</span>
                  <span className="font-sans text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Repasse Direto
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-3xl sm:text-4xl text-slate-900 font-bold">4.9/5</span>
                  <span className="font-sans text-xs text-slate-500 uppercase tracking-wider font-bold">
                    Avaliação Média
                  </span>
                </div>
              </div>

              {/* Quick Action Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.a 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm sm:text-base px-8 py-4 rounded-xl shadow-md transition-all cursor-pointer font-bold" 
                  href="#catalogo"
                >
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  <span>Explorar Produtos</span>
                </motion.a>
                <button 
                  onClick={onOpenProducerModal}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-sans text-sm sm:text-base px-6 py-4 rounded-xl transition-all cursor-pointer font-semibold border border-slate-200 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#166534]">handshake</span>
                  <span>Sou Produtor e Quero Vender</span>
                </button>
              </div>
            </motion.div>

            {/* Right Column: Hero Visual with Artisan Photo */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-5/12 flex flex-col items-center"
            >
              <div className="relative w-full max-w-[460px] aspect-4/3 rounded-3xl overflow-hidden shadow-xl group border border-slate-200">
                <img 
                  alt="Dona Cleusa tecendo tapete de tear artesanal" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" 
                  src={MARKET_HERO_IMAGE} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <img 
                      alt="Dona Cleusa" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#b45309]" 
                      src={CLEUSA_PORTRAIT} 
                    />
                    <div>
                      <span className="font-sans text-sm text-slate-900 font-bold block">
                        Dona Cleusa, 58 anos
                      </span>
                      <span className="font-sans text-xs text-slate-500 block">
                        Artesã e Produtora do Tear Comunitário de Itaguaí
                      </span>
                    </div>
                  </div>
                  <p className="font-serif text-xs text-slate-800 italic mt-2 leading-relaxed">
                    "Antes da feira, dependia de bicos incertos. Hoje compro meus remédios e apoio meus netos com meu trabalho artesanal valorizado."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section className="w-full py-12 bg-slate-50 border-b border-slate-200" id="catalogo">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls: Search and Filters Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 bg-white p-4 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos, produtores ou categorias..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:bg-white border border-slate-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
              <span className="font-sans text-xs text-slate-600 font-semibold">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-slate-50 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:bg-white"
              >
                <option value="recent">Mais Recentes</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl font-sans text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer font-bold ${
                  selectedCategory === cat.id
                    ? 'bg-[#b45309] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl p-8 border border-slate-200">
              <span className="material-symbols-outlined text-[48px] text-slate-400 mb-2" aria-hidden="true">{MARKET_PRODUCTS.length === 0 ? 'storefront' : 'search_off'}</span>
              <h3 className="font-serif text-xl text-slate-900 font-bold">{MARKET_PRODUCTS.length === 0 ? 'Produtos em breve' : 'Nenhum produto encontrado'}</h3>
              <p className="font-sans text-sm text-slate-600 mt-1">
                {MARKET_PRODUCTS.length === 0 ? 'Os produtos reais serão adicionados gradualmente à nossa feira solidária.' : 'Tente ajustar os termos de busca ou selecione outra categoria.'}
              </p>
              {MARKET_PRODUCTS.length > 0 && <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#b45309] text-white font-sans text-sm font-bold cursor-pointer hover:bg-[#92400e] transition-colors"
              >
                Ver todos os produtos
              </button>}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              <AnimatePresence>
                {filteredProducts.map((prod) => (
                  <motion.article
                    key={prod.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -6 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col border border-slate-200 group"
                  >
                    {/* Image Container */}
                    <div className="h-60 w-full relative overflow-hidden">
                      <img
                        alt={prod.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        src={prod.image}
                      />
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg font-sans text-xs text-slate-900 font-bold shadow-xs border border-slate-200">
                        {prod.categoryTag}
                      </span>
                      {prod.badge && (
                        <span className="absolute top-3 right-3 bg-[#166534] text-white font-sans text-xs px-2.5 py-1 rounded-lg font-bold shadow-xs">
                          {prod.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-[#b45309] font-bold mb-1">
                          <span className="material-symbols-outlined text-[16px]">person</span>
                          <span>{prod.producer}</span>
                        </div>
                        <h3 className="font-serif text-lg text-slate-900 font-bold mb-1 group-hover:text-[#b45309] transition-colors">
                          {prod.title}
                        </h3>
                        <p className="font-sans text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-sans text-[11px] text-slate-500 block">Preço Solidário</span>
                          <span className="font-serif text-xl text-slate-900 font-bold">
                            {prod.priceFormatted}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onSelectProduct(prod)}
                          className="px-4 py-2.5 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                          <span>Comprar</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* How Logistics Work Section */}
      <section className="w-full py-16 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-sans text-xs text-[#b45309] uppercase font-bold tracking-wider block mb-1">
              Logística Solidária
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 font-bold tracking-tight">
              Como Sua Compra Chega até Você
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Criamos uma cadeia logística comunitária simples, justa e com frete acessível para todo o país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-7 rounded-2xl shadow-xs flex flex-col items-center text-center border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-[#b45309] mb-4">
                <span className="material-symbols-outlined text-[32px]">touch_app</span>
              </div>
              <h3 className="font-serif text-lg text-slate-900 font-bold mb-2">1. Escolha &amp; Pedido</h3>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                Você seleciona o item na vitrine e o pedido vai diretamente para o painel do artesão com suporte de nossa equipe de Itaguaí.
              </p>
            </div>

            <div className="bg-slate-50 p-7 rounded-2xl shadow-xs flex flex-col items-center text-center border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#166534] mb-4">
                <span className="material-symbols-outlined text-[32px]">inventory_2</span>
              </div>
              <h3 className="font-serif text-lg text-slate-900 font-bold mb-2">2. Embalagem Afetuosa</h3>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                Cada item é preparado com carinho, acompanhado de uma carta escrita à mão pela família produtora.
              </p>
            </div>

            <div className="bg-slate-50 p-7 rounded-2xl shadow-xs flex flex-col items-center text-center border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
                <span className="material-symbols-outlined text-[32px]">local_shipping</span>
              </div>
              <h3 className="font-serif text-lg text-slate-900 font-bold mb-2">3. Retirada ou Entrega</h3>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">
                Retire gratuitamente em nossa sede em Itaguaí/RJ ou receba via Correios/transportadora na sua residência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action: Cadastre Seu Produto */}
      <section className="w-full py-16 bg-[#166534] text-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="bg-white/15 px-3.5 py-1 rounded-md font-sans text-xs uppercase font-bold tracking-wider inline-block mb-2">
              Produtores Locais
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2 leading-tight">
              Você mora em Itaguaí e região e tem um produto artesanal ou receita de família?
            </h2>
            <p className="font-sans text-sm sm:text-base text-emerald-100 leading-relaxed">
              Junte-se à nossa feira virtual! Oferecemos fotos profissionais dos produtos, embalagens ecológicas gratuitas e mentoria de precificação.
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenProducerModal}
            className="shrink-0 bg-[#b45309] hover:bg-[#92400e] text-white px-8 py-4 rounded-xl font-sans text-sm sm:text-base font-bold shadow-xl transition-all cursor-pointer"
          >
            Quero Cadastrar Meus Produtos
          </motion.button>
        </div>
      </section>
    </div>
  );
};
