import React, {useEffect, useMemo, useState} from 'react';
import type {CatalogCourse, CourseCatalog} from '../../shared/courseCatalog';
import {filterCatalog, formatCoursePrice} from '../../shared/courseCatalog';
import {formatDonationAmount} from '../data/donations';
import {DonationSyncStatus, useDonationTotals} from '../hooks/useDonationTotals';
import savedCatalog from '../data/courseCatalog.generated.json';

interface CoursesViewProps {
  onOpenVolunteer: (type: 'teach' | 'sponsor') => void;
  onOpenDonation: (destination: string) => void;
}

export function CatalogProductCard({course}: {course: CatalogCourse}) {
  const combo = course.kind === 'combo';
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col border border-slate-200">
      <a href={course.detailsUrl} aria-label={`Ver detalhes de ${course.title}`} className="h-56 relative overflow-hidden group bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#166534] focus-visible:-outline-offset-2">
        {course.imageUrl ? <img alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={course.imageUrl} loading="lazy" /> : <div className="flex h-full items-center justify-center"><span aria-hidden="true" className="material-symbols-outlined text-[#166534]" style={{fontSize: 64}}>{combo ? 'local_offer' : 'school'}</span></div>}
        <span className={`absolute top-3 left-3 text-white font-sans text-xs px-3 py-1 rounded-lg font-bold shadow-xs ${combo ? 'bg-[#166534]' : 'bg-[#b45309]'}`}>{combo ? 'Combo promocional' : 'Curso EAD'}</span>
      </a>
      <div className="p-6 flex flex-col justify-between flex-1 gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600">{course.category}</p>
          <h3 className="font-serif text-xl text-slate-900 font-bold mb-2"><a href={course.detailsUrl} className="hover:text-[#b45309]">{course.title}</a></h3>
          {course.description && <p className="font-sans text-sm text-slate-600 line-clamp-3 leading-relaxed">{course.description}</p>}
        </div>
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-4">
          <dl className="flex items-center justify-between gap-3 text-sm">
            {combo ? <div><dt className="text-slate-600 text-xs mb-1">Oferta</dt><dd className="font-bold text-slate-900">Combinação de cursos</dd></div> : <div><dt className="text-slate-600 text-xs mb-1">Carga horária</dt><dd className="font-bold text-slate-900">{course.hours?.toLocaleString('pt-BR')} horas</dd></div>}
            <div className="text-right"><dt className="text-slate-600 text-xs mb-1">{combo ? 'Valor do combo' : 'Valor do curso'}</dt><dd className="text-[#b45309] font-bold text-lg">{formatCoursePrice(course.priceCents)}</dd></div>
          </dl>
          <a href={course.detailsUrl} className="w-full min-h-11 inline-flex items-center justify-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm py-3 px-4 rounded-xl shadow-xs transition-colors font-bold">{combo ? 'Ver detalhes do combo' : 'Ver detalhes do curso'} <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_forward</span></a>
        </div>
      </div>
    </article>
  );
}

export const CoursesView: React.FC<CoursesViewProps> = ({onOpenVolunteer, onOpenDonation}) => {
  const donations = useDonationTotals();
  const [catalog, setCatalog] = useState<CourseCatalog | null>(savedCatalog as CourseCatalog);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    void (async () => {
      try {
        const response = await fetch('/api/courses', {signal: controller.signal, headers: {Accept: 'application/json'}});
        if (!response.ok) throw new Error('catalog_unavailable');
        const data: CourseCatalog = await response.json();
        if (!Array.isArray(data.courses)) throw new Error('invalid_catalog');
        if (!controller.signal.aborted) setCatalog(data);
      } catch {
        if (!controller.signal.aborted) setError('Não foi possível carregar os cursos agora. Tente novamente em instantes.');
      }
    })();
    return () => controller.abort();
  }, [attempt]);
  const courses = useMemo(() => filterCatalog(catalog?.courses ?? [], search).filter(course => !category || course.category === category), [catalog, search, category]);
  const categories = useMemo(() => [...new Set((catalog?.courses ?? []).map(course => course.category))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR')), [catalog]);
  const individualCourses = courses.filter(course => course.kind !== 'combo');
  const combos = courses.filter(course => course.kind === 'combo');

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <section className="relative w-full bg-white pt-36 pb-16 lg:pt-44 lg:pb-24 border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-slate-900 mb-4 tracking-tight font-bold">Aprender para Transformar: <span className="text-[#b45309]">Cursos &amp; Capacitação</span></h1>
            <p className="font-sans text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed">Invista na sua formação e apoie o Instituto. Conheça nossos cursos EAD pagos e escolha o próximo passo da sua trajetória profissional.</p>
            <div className="mb-8 w-full rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left text-emerald-950">
              <p className="text-sm font-bold">Apoio aos cursos EAD: {formatDonationAmount(donations.eadCoursesCents)} recebidos em doações</p>
              <p className="mt-1 text-sm">Você também pode doar para apoiar a educação a distância do Instituto. As doações são contabilizadas separadamente da compra de cursos.</p>
              <DonationSyncStatus />
              <button type="button" onClick={() => onOpenDonation('cursos-ead')} className="mt-3 min-h-11 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">Apoiar os cursos EAD</button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-slate-800 font-sans text-sm">
              {[{icon: 'devices', text: 'Cursos Online'}, {icon: 'school', text: 'Formação Profissional'}, {icon: 'volunteer_activism', text: 'Sua Compra Apoia o Instituto'}].map(item => (
                <div key={item.text} className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-xl shadow-xs border border-slate-200"><span aria-hidden="true" className="material-symbols-outlined text-[#166534] text-[20px]">{item.icon}</span><span className="font-semibold">{item.text}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Catálogo de cursos EAD" className="w-full py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-xs mb-10 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between border border-slate-200">
            <div className="w-full lg:max-w-xl">
              <label htmlFor="course-search" className="block mb-2 font-sans text-sm font-bold text-slate-800">Encontre seu curso</label>
              <input id="course-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Busque pelo nome ou assunto do curso" className="w-full min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#166534]/40" />
            </div>
            <div className="w-full lg:max-w-xs"><label htmlFor="course-category" className="block mb-2 text-sm font-bold text-slate-800">Categoria</label><select id="course-category" value={category} onChange={event => setCategory(event.target.value)} className="w-full min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900"><option value="">Todas as categorias</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></div>
            <p className="max-w-sm text-sm text-slate-600">Confira os detalhes de cada curso na nossa loja. Cadastro, compra e aulas acontecem na plataforma de ensino.</p>
          </div>
          <p role="status" className="mb-5 text-sm text-slate-600">{error ? '' : catalog ? `${individualCourses.length} ${individualCourses.length === 1 ? 'curso' : 'cursos'}${combos.length ? ` • ${combos.length} ${combos.length === 1 ? 'combo promocional' : 'combos promocionais'}` : ''} • Ordem alfabética` : 'Carregando cursos…'}</p>
          {error && catalog && <div role="alert" className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700"><p>Não foi possível atualizar o catálogo agora. Confira os valores finais na plataforma de ensino.</p><button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-2 min-h-11 px-3 font-bold text-[#b45309]">Tentar novamente</button></div>}
          {error && !catalog ? (
            <div role="alert" className="rounded-2xl border border-slate-200 bg-white p-8 text-center"><p className="text-slate-700">{error}</p><button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-4 min-h-11 rounded-xl bg-[#b45309] px-5 py-3 text-sm font-bold text-white hover:bg-[#92400e]">Tentar novamente</button></div>
          ) : catalog && !courses.length ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <h2 className="font-serif text-xl font-bold text-slate-900">{catalog.courses.length ? 'Nenhum curso encontrado' : 'Novos cursos em breve'}</h2>
              <p className="mt-2 text-sm text-slate-600">{catalog.courses.length ? 'Tente outro nome ou assunto para encontrar seu curso.' : 'Estamos preparando o catálogo de cursos EAD do Instituto.'}</p>
              {(search || category) && <button type="button" onClick={() => {setSearch(''); setCategory('');}} className="mt-4 min-h-11 px-4 text-sm font-bold text-[#b45309]">Limpar busca</button>}
            </div>
          ) : (
            <div className="space-y-12">{[{title: 'Cursos individuais', items: individualCourses}, {title: 'Combos promocionais', items: combos}].filter(group => group.items.length).map(group => <section key={group.title} aria-label={group.title}><h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">{group.title}</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{group.items.map(course => <CatalogProductCard key={course.id} course={course} />)}</div></section>)}</div>
          )}
          <p className="mt-6 text-xs text-slate-600">O valor e as condições finais da compra são apresentados na plataforma de ensino.</p>
        </div>
      </section>

      <section className="w-full py-16 bg-white border-b border-slate-200">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12"><h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-slate-900 font-bold tracking-tight">Como adquirir seu curso</h2><p className="font-sans text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">Sua formação contribui para a captação de recursos que apoia os projetos do Instituto.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {num: '01', title: 'Escolha seu curso', desc: 'Explore o catálogo e confira a carga horária e o valor de cada curso.'},
              {num: '02', title: 'Leia os detalhes', desc: 'Clique no curso para conhecer o conteúdo e todas as condições na loja do Instituto.'},
              {num: '03', title: 'Faça sua inscrição', desc: 'Realize seu cadastro e conclua a compra diretamente na plataforma contratada.'},
              {num: '04', title: 'Comece a aprender', desc: 'Siga as orientações da plataforma para acessar as aulas e os materiais do seu curso.'},
            ].map(step => (
              <div key={step.num} className="bg-slate-50 p-6 rounded-2xl shadow-xs flex flex-col items-start border border-slate-200"><div aria-hidden="true" className="w-14 h-14 rounded-2xl text-[#b45309] bg-amber-50 border border-amber-200 flex items-center justify-center font-serif text-xl font-bold mb-4">{step.num}</div><h3 className="font-serif text-lg text-slate-900 font-bold mb-2">{step.title}</h3><p className="font-sans text-sm text-slate-600 leading-relaxed">{step.desc}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full py-16 bg-[#166534] text-white">
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl"><h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">Quer apoiar a formação da comunidade?</h2><p className="font-sans text-sm sm:text-base text-emerald-100 leading-relaxed">Compartilhe sua experiência como voluntário ou apoie as ações de capacitação do Instituto.</p></div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"><button onClick={() => onOpenVolunteer('teach')} className="min-h-11 bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-sm px-7 py-3.5 rounded-xl font-bold">Quero Ensinar</button><button onClick={() => onOpenVolunteer('sponsor')} className="min-h-11 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-sans text-sm px-7 py-3.5 rounded-xl font-bold">Apadrinhar uma Turma</button></div>
        </div>
      </section>
    </div>
  );
};
