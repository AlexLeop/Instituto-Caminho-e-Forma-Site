import { PROJECTS } from './data/mockData';

export const SITE_URL = 'https://institutocaminhoeforma.org.br';
export const projectPath = (id: string) => `/projetos/${encodeURIComponent(id)}`;
const pages: Record<string, [string, string]> = {
  '/': ['Instituto Caminho e Forma | Projetos sociais em Itaguaí', 'Conheça o Instituto Caminho e Forma, em Brisamar, Itaguaí: apoio às famílias, esporte, educação, acolhimento comunitário e transparência nas doações.'],
  '/projetos': ['Projetos sociais', 'Conheça os projetos de esporte, cultura, saúde e acolhimento do Instituto Caminho e Forma em Itaguaí. Veja horários e informações para participar.'],
  '/cursos-e-capacitacao': ['Cursos e capacitação', 'Conheça os cursos e oportunidades de formação e capacitação do Instituto Caminho e Forma.'],
  '/feira-virtual': ['Feira solidária', 'Conheça a feira solidária e os produtos das famílias e produtores da comunidade do Instituto Caminho e Forma.'],
  '/seja-parceiro': ['Seja parceiro', 'Apoie os projetos sociais do Instituto Caminho e Forma em Itaguaí. Conheça as possibilidades de parceria e participação.'],
  '/transparencia': ['Portal da Transparência', 'Acompanhe as doações e consulte o estatuto social e os documentos disponíveis do Instituto Caminho e Forma.'],
  '/portal-do-apoiador': ['Portal do Apoiador', 'Acesse seu histórico de doações com segurança.'],
};
export function pageMetadata(path: string) {
  const clean = path.replace(/\/$/, '') || '/';
  const project = PROJECTS.find(item => projectPath(item.id) === clean);
  const [name, description] = project ? [project.title, `Conheça o projeto ${project.title} do Instituto Caminho e Forma, em Itaguaí. Confira as atividades e informações para participar e apoiar.`] : pages[clean] ?? pages['/'];
  return {title: clean === '/' ? name : `${name} | Instituto Caminho e Forma`, description, canonical: `${SITE_URL}${clean}`, private: clean === '/portal-do-apoiador' || clean.startsWith('/gestao')};
}
export const PUBLIC_PATHS = [...Object.keys(pages).filter(path => path !== '/portal-do-apoiador'), ...PROJECTS.map(project => projectPath(project.id))];
export function updatePageMetadata(path: string) {
  const meta = pageMetadata(path);
  document.title = meta.title;
  const setMeta = (selector: string, attribute: string, value: string) => {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
      const identity = selector.match(/\[(name|property|rel)="([^"]+)"\]/)!;
      element.setAttribute(identity[1], identity[2]); document.head.appendChild(element);
    }
    element.setAttribute(attribute, value);
  };
  setMeta('meta[name="description"]', 'content', meta.description);
  setMeta('meta[property="og:title"]', 'content', meta.title);
  setMeta('meta[property="og:description"]', 'content', meta.description);
  setMeta('meta[property="og:url"]', 'content', meta.canonical);
  setMeta('link[rel="canonical"]', 'href', meta.canonical);
  setMeta('meta[name="robots"]', 'content', meta.private ? 'noindex, nofollow' : 'index, follow');
}
