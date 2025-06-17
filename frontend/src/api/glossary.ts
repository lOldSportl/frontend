import { GlossaryItem, GlossaryItemCreate } from '../types.tsx';

const STORAGE_KEY = 'glossary_terms_v1';

function loadTerms(): GlossaryItem[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTerms(terms: GlossaryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
}

export async function getGlossary(): Promise<GlossaryItem[]> {
  return Promise.resolve(loadTerms());
}

export async function addGlossaryItem(item: GlossaryItemCreate): Promise<void> {
  const terms = loadTerms();
  const newId = terms.length > 0 ? Math.max(...terms.map(t => t.id)) + 1 : 1;
  const newItem: GlossaryItem = {
    id: newId,
    term: item.term,
    definition: item.definition,
    project: item.project
  };
  saveTerms([...terms, newItem]);
}

export async function updateGlossaryItem(updatedItem: GlossaryItem): Promise<void> {
  const terms = loadTerms().map((item) =>
    item.id === updatedItem.id ? { ...updatedItem } : item
  );
  saveTerms(terms);
}

export async function deleteGlossaryItem(id: number): Promise<void> {
  const terms = loadTerms().filter((item) => item.id !== id);
  saveTerms(terms);
}
