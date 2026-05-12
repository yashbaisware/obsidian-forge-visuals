export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const CATEGORIES = ["Carousel Ads", "AI Visuals", "Social Media Creatives"] as const;
export type Category = (typeof CATEGORIES)[number];
