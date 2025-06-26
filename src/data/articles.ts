export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  date: string;
};

const articles: Article[] = [
  {
    id: '1',
    title: 'The James Webb Space Telescope: A New Era in Astronomy',
    slug: 'james-webb-space-telescope',
    content: 'NASA\'s James Webb Space Telescope is revolutionizing our understanding of the universe...',
    category: 'Space',
    date: '2024-06-01',
  },
  {
    id: '2',
    title: 'CRISPR: The Gene Editing Revolution',
    slug: 'crispr-gene-editing',
    content: 'CRISPR technology is making gene editing faster, cheaper, and more accurate than ever before...',
    category: 'Biology',
    date: '2024-05-20',
  },
  {
    id: '3',
    title: 'AI in Everyday Life: How Machine Learning is Changing the World',
    slug: 'ai-in-everyday-life',
    content: 'From voice assistants to self-driving cars, AI is becoming a part of our daily routines...',
    category: 'Technology',
    date: '2024-05-15',
  },
];

export default articles; 