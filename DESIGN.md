# Design System — Instituto Caminho e Forma

## Visual Identity & Philosophy
O design visual do Instituto Caminho e Forma reflete a união entre acolhimento comunitário humanista e rigor de governança institucional. Evita clichês de templates pré-fabricados de IA ou o visual pasteurizado de landing pages genéricas.

## Color System (Palette & Tokens)
- **Canvas / Background**: `#fbf9f5` (Linho acolhedor de alta respirabilidade)
- **Superfícies de Cartões / Containers**: `#ffffff` (Cartão puro com borda sutil)
- **Superfícies Secundárias / Neutras**: `#f5f1ea` e `#ede7dc` (Acabamento térmico natural)
- **Bordas & Linhas Divisórias**: `#e7e2da` e `#d6cec2`
- **Tipografia Principal (Ink)**: `#1c1917` (Stone 900 — contraste 15:1 sobre o canvas)
- **Tipografia Secundária**: `#44403c` / `#57534e` (Stone 700 / 600 — contraste > 6:1)
- **Acento Primário (Terracota)**: `#b45309` (Amber 700 — calor artesanal e ação voluntária)
- **Acento Primário Hover**: `#92400e` (Amber 800)
- **Acento Secundário (Verde Floresta / Cidadania)**: `#166534` (Green 800 — aprovação, auditoria, impacto ecológico)
- **WhatsApp Oficial**: `#25D366`

## Typography Hierarchy
- **Display & Títulos**: *Literata* (Google Fonts Serif, pesos 600, 700, 800)
  - `h1`: `text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-wrap: balance`
  - `h2`: `text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-wrap: balance`
  - `h3`: `text-xl sm:text-2xl font-serif font-bold`
- **Interface & Textos Corridos**: *Manrope* (Google Fonts Sans, pesos 400, 500, 600, 700)
  - Corpo: `text-sm sm:text-base text-[#44403c] leading-relaxed max-w-[70ch]`
  - Legendas / Badges: `text-xs font-sans font-bold tracking-wide`

## Spacing & Container Hierarchy
- **Largura Máxima do Conteúdo**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1280px para leitura ideal) ou `max-w-[1440px]` em headers institucionais.
- **Ritmo de Seção**: `py-16 sm:py-24` entre grandes blocos narrativos.
- **Raios de Borda**:
  - `rounded-xl` (12px) para botões, inputs e badges
  - `rounded-2xl` (16px) para cards de projetos e produtos
  - `rounded-3xl` (24px) para grandes seções de destaque e hero containers

## Motion & Micro-interactions
- Transições de página suaves via Framer Motion (`opacity` e `y: 6` suave com `easeOut`).
- Sem animações saltitantes (`bounce` ou `elastic` abolidos).
- Respeito integral a `prefers-reduced-motion`.
- Elevação sutil em hover (`-translate-y-1` com `shadow-md` e transição de borda).
