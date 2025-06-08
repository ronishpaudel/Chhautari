import { proxy } from "valtio";

const postFormState = proxy({
  content: "",
  location: "",
});

const jobFormState = proxy({
  title: "",
  description: "",
  category: "",
  location: "",
});

const pollFormState = proxy({
  question: "",
  options: ["", "", ""],
  expiresAt: "",
});
