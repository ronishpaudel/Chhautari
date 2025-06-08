import { proxy } from "valtio";

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

export const pollStore = proxy<PollState>({});

// Helper functions for poll store
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
