import React, { useState } from 'react';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'teach' | 'sponsor';
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose, type }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Tecnologia & Informática');
  const [company, setCompany] = useState('');
  const [availability, setAvailability] = useState('Sábados pela manhã (2h a 4h)');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

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
          <div className="flex items-center gap-2.5 text-[#b45309]">
            <span className="material-symbols-outlined text-[26px]">
              {type === 'teach' ? 'volunteer_activism' : 'handshake'}
            </span>
            <span className="font-serif text-2xl text-slate-900 font-bold tracking-tight">
              {type === 'teach' ? 'Seja um Mentor Voluntário' : 'Apadrinhe uma Turma'}
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
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Inscrição Solidária Recebida!
              </h3>
              <p className="font-sans text-sm text-slate-600 mt-2">
                Muito obrigado, <strong>{name}</strong>! Nossa coordenação pedagógica entrará em contato em breve pelo telefone <strong>{phone}</strong> para apresentar a grade e o calendário de oficinas.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-[#b45309] hover:bg-[#92400e] text-white font-bold rounded-xl transition-all shadow-sm"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
            <p className="font-sans text-sm text-slate-600">
              {type === 'teach' 
                ? 'Compartilhe seu ofício e vivência de mercado com alunos de áreas vulneráveis. Você pode atuar presencialmente em nossos polos ou online em mentorias individuais de carreira.'
                : 'Sua empresa ou grupo pode custear os insumos, equipamentos e transporte de uma turma completa por um ciclo letivo, com relatórios de impacto ESG.'
              }
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Área de Interesse
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                  >
                    <option value="Tecnologia & Informática">Tecnologia &amp; Informática</option>
                    <option value="Gastronomia & Panificação">Gastronomia &amp; Panificação</option>
                    <option value="Corte, Costura & Upcycling">Corte, Costura &amp; Upcycling</option>
                    <option value="Gestão & Finanças">Gestão &amp; Finanças</option>
                    <option value="Mentoria de Currículo / RH">Mentoria de Currículo / RH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Empresa / Profissão
                  </label>
                  <input
                    type="text"
                    placeholder="Onde trabalha ou atua"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Disponibilidade Estimada
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
                >
                  <option value="Sábados pela manhã (2h a 4h)">Sábados pela manhã (2h a 4h)</option>
                  <option value="Dias de semana à noite (19h às 21h)">Dias de semana à noite (19h às 21h)</option>
                  <option value="Mentorias pontuais 1h quinzenal (online)">Mentorias pontuais 1h quinzenal (online)</option>
                  <option value="Apoio Corporativo / ESG Institucional">Apoio Corporativo / ESG Institucional</option>
                </select>
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
                className="w-2/3 py-3 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-white font-bold shadow-md transition-all text-sm cursor-pointer"
              >
                Enviar Candidatura
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
