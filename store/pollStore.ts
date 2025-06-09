import { proxy, subscribe } from "valtio";

type PollState = {
  [pollId: string]: {
    hasVoted: boolean;
    selectedOption: string | null;
    voteResults: Record<string, number>;
    votersByOption: Record<
      string,
      Array<{ id: string; name: string; image?: string }>
    >;
    totalVotes: number;
  };
};

// --- Load from localStorage if available ---
const localStorageKey = "poll-store";

const loadInitialState = (): PollState => {
  try {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse poll store from localStorage:", e);
  }
  return {};
};

// --- Create reactive store ---
export const pollStore = proxy<PollState>(loadInitialState());

// --- Persist to localStorage on change ---
subscribe(pollStore, () => {
  localStorage.setItem(localStorageKey, JSON.stringify(pollStore));
});

// --- Helper functions ---
export const updatePollInStore = (
  pollId: string,
  data: Partial<PollState[string]>
) => {
  if (!pollStore[pollId]) {
    pollStore[pollId] = {
      hasVoted: false,
      selectedOption: null,
      voteResults: {},
      votersByOption: {},
      totalVotes: 0,
    };
  }
  Object.assign(pollStore[pollId], data);
};

export const getPollFromStore = (pollId: string) => {
  return (
    pollStore[pollId] || {
      hasVoted: false,
      selectedOption: null,
      voteResults: {},
      votersByOption: {},
      totalVotes: 0,
    }
  );
};
