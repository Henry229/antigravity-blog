export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: "draft" | "published";
  author_id: string;
  author_name?: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  read_time?: number;
}

export interface PostInput {
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  status?: "draft" | "published";
}
