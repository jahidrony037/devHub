// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

// ─── API Response Wrappers ─────────────────────────────────────────────────────

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

// ─── UI / Page Props ───────────────────────────────────────────────────────────

export interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string>>;
}
