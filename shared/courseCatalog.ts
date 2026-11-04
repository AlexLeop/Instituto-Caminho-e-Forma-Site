export interface CatalogCourse {
  id: string;
  title: string;
  kind: 'course' | 'combo';
  category: string;
  description: string;
  hours: number | null;
  imageUrl: string | null;
  priceCents: number;
  detailsUrl: string;
}

export interface CourseCatalog {
  courses: CatalogCourse[];
  updatedAt: string;
}

export const formatCoursePrice = (cents: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL',
}).format(cents / 100);

export function filterCatalog(courses: CatalogCourse[], search: string) {
  const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  const terms = normalize(search).trim().split(/\s+/).filter(Boolean);
  return courses.filter(course => terms.every(term => normalize(`${course.title} ${course.description}`).includes(term)))
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', {sensitivity: 'base', numeric: true}));
}
