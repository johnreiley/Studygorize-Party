import { PartyState } from "./PartyState.enum";

interface Party {
  host: Host,
  users: User[],
  state: PartyState
};

export default Party;