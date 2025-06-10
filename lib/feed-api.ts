export async function fetchFeedItems() {
  const res = await fetch("/api/feed", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch feed items");
  return res.json();
}

export async function createPost(data: { content: string; location?: string }) {
  const res = await fetch("/api/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function createJob(data: {
  title: string;
  description: string;
  category?: string;
  location?: string;
}) {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
}

export async function createPoll(data: {
  question: string;
  options: string[];
  expiresAt?: string;
}) {
  const res = await fetch("/api/polls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create poll");
  return res.json();
}

export async function likePost(postId: string) {
  const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to like post");
  return res.json();
}

export async function PollVote(pollId: string, option: string) {
  const res = await fetch(`/api/polls/${pollId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ option }),
  });
  return res.json();
}

export async function fetchJobs() {
  const res = await fetch("/api/jobs", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

export async function fetchPost() {
  const res = await fetch("/api/post", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch feed items");
  return res.json();
}

export async function fetchPoll() {
  const res = await fetch("/api/polls", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch feed items");
  return res.json();
}
