import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { filterDonationDestinations, findDonationDestination } from '../../shared/donationDestinations';

interface Props {id: string; value: string; onChange: (id: string) => void; disabled?: boolean}

export function DonationDestinationPicker({id, value, onChange, disabled = false}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState({left: 0, top: 0, width: 0, maxHeight: 240});
  const field = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const listId = useId();
  const options = filterDonationDestinations(query);
  const selected = findDonationDestination(value);

  useEffect(() => {
    if (!open || disabled) return;
    const place = () => {
      const rect = field.current!.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - 12;
      const above = below < 150 && rect.top > below;
      const maxHeight = Math.max(80, Math.min(260, above ? rect.top - 12 : below));
      setPosition({left: rect.left, top: above ? rect.top - maxHeight - 6 : rect.bottom + 6, width: rect.width, maxHeight});
    };
    const outside = (event: PointerEvent) => {if (!field.current?.contains(event.target as Node) && !list.current?.contains(event.target as Node)) setOpen(false);};
    place(); window.addEventListener('resize', place); window.addEventListener('scroll', place, true); document.addEventListener('pointerdown', outside);
    return () => {window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); document.removeEventListener('pointerdown', outside);};
  }, [open, disabled]);

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({block: 'nearest'});
  }, [open, active, listId, query]);

  function choose(id: string) {
    onChange(id); input.current?.focus({preventScroll: true}); setQuery(''); setOpen(false);
  }
  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape' && open) {event.preventDefault(); event.stopPropagation(); setOpen(false); return;}
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {setQuery(''); setActive(0); setOpen(true);}
      else setActive(index => Math.max(0, Math.min(options.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))));
    }
    if (event.key === 'Enter' && open) {event.preventDefault(); if (options[active]) choose(options[active].id);}
  }

  return <>
    <div ref={field} className="relative">
      <input ref={input} id={id} role="combobox" aria-autocomplete="list" aria-expanded={open && !disabled} aria-controls={listId}
        aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined} aria-describedby={`${id}-hint`}
        type="text" autoComplete="off" required={!value} disabled={disabled} placeholder="Digite para buscar um destino" value={open ? query : selected?.title ?? ''}
        onFocus={() => {setQuery(''); setActive(0); setOpen(true);}}
        onClick={() => {if (!open) {setQuery(''); setActive(0); setOpen(true);}}}
        onChange={event => {setQuery(event.target.value); onChange(''); setActive(0); setOpen(true);}}
        onKeyDown={handleKey}
        onBlur={event => {if (!list.current?.contains(event.relatedTarget as Node) && !field.current?.contains(event.relatedTarget as Node)) setOpen(false);}}
        className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-12 pl-3 text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 disabled:opacity-60" />
      <button type="button" disabled={disabled} tabIndex={-1} aria-label="Mostrar destinos" onMouseDown={event => event.preventDefault()}
        onClick={() => {if (open) setOpen(false); else {input.current?.focus(); setQuery(''); setActive(0); setOpen(true);}}}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-slate-700 hover:bg-slate-50">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
    </div>
    <p id={`${id}-hint`} className="mt-1 text-xs text-slate-600">Busque pelo nome e selecione uma opção. Destinos em ordem alfabética.</p>
    {open && !disabled && createPortal(<div ref={list} id={listId} role="listbox" aria-label="Destinos da doação" data-lenis-prevent
      className="fixed z-[60] overflow-y-auto overscroll-contain rounded-xl border border-slate-300 bg-white py-1 shadow-sm" style={position}>
      {options.map((option, index) => <button type="button" role="option" aria-selected={value === option.id} id={`${listId}-${index}`} key={option.id} tabIndex={-1}
        onMouseDown={event => event.preventDefault()} onClick={() => choose(option.id)}
        className={`flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm leading-relaxed text-slate-900 ${active === index ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}>
        <span>{option.title}</span>{value === option.id && <span aria-hidden="true" className="text-emerald-800">✓</span>}
      </button>)}
      {options.length === 0 && <p role="status" className="px-3 py-4 text-sm text-slate-700">Nenhum destino encontrado. Tente outro nome.</p>}
    </div>, document.body)}
  </>;
}
