import React, { useState } from 'react';
import { Course } from '../types';

interface CourseEnrollModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CourseEnrollModal: React.FC<CourseEnrollModalProps> = ({ course, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('Ensino Médio Incompleto/Completo');
  const [submitted, setSubmitted] = useState(false);

  if (!course) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5 text-[#166534]">
            <span className="material-symbols-outlined text-[26px]">school</span>
            <span className="font-serif text-2xl text-slate-900 font-bold tracking-tight">
              Inscrição para Curso de Capacitação
            </span>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-6 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#166534] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Pré-Inscrição Realizada com Sucesso!
              </h3>
              <p className="font-sans text-sm text-slate-600 mt-2">
                Parabéns, <strong>{name}</strong>! Recebemos sua solicitação para a turma de <strong>{course.title}</strong>.
              </p>
              <p className="font-sans text-xs text-slate-500 mt-2">
                Nossa equipe de coordenação entrará em contato via WhatsApp no número <strong>{phone}</strong> nos próximos dias para orientações de matrícula, cronograma e formas de contribuição social solidária.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl w-full text-left font-sans text-sm text-slate-600 border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span>Carga Horária:</span>
                <strong className="text-slate-900">{course.hours}</strong>
              </div>
              <div className="flex justify-between">
                <span>Turno:</span>
                <strong className="text-slate-900">{course.shift}</strong>
              </div>
              <div className="flex justify-between">
                <span>Previsão de Início:</span>
                <strong className="text-[#166534]">{course.startDate}</strong>
              </div>
              <div className="flex justify-between">
                <span>Investimento Social:</span>
                <strong className="text-[#b45309]">{course.investment}</strong>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-200">
                <span className="text-slate-500">Destinação:</span>
                <span className="text-[#166534] font-semibold">100% revertido aos projetos assistenciais</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-[#166534] hover:bg-[#14532d] text-white font-bold rounded-xl transition-all shadow-sm"
            >
              Fechar &amp; Continuar Navegando
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3.5 border border-slate-200">
              <img
                src={course.image}
                alt={course.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-[#b45309] block truncate">
                  {course.categoryLabel}
                </span>
                <h4 className="font-serif text-base font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">
                  {course.title}
                </h4>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="font-semibold text-[#166534]">
                    {course.hours} • {course.shift}
                  </span>
                  <span className="font-bold text-[#b45309]">
                    {course.investment}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(21) 98742-8647"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Escolaridade
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#166534]/30"
                >
                  <option value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</option>
                  <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
                  <option value="Ensino Médio Incompleto/Completo">Ensino Médio Incompleto/Completo</option>
                  <option value="Ensino Superior">Ensino Superior em andamento ou concluído</option>
                </select>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl flex items-start gap-2.5 border border-amber-200">
                <span className="material-symbols-outlined text-[#b45309] text-[20px] shrink-0 mt-0.5">volunteer_activism</span>
                <p className="font-sans text-xs text-[#92400e] leading-relaxed">
                  <strong>Investimento Social Sustentável:</strong> As contribuições mensais dos cursos são 100% revertidas para sustentar as despesas operacionais do Instituto e financiar as ações de acolhimento e alimentação às famílias do território.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors font-semibold text-sm cursor-pointer border border-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white font-bold shadow-md transition-all text-sm cursor-pointer"
              >
                Garantir Minha Pré-Inscrição
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
