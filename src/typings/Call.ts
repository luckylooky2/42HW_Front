export interface CallInfo {
  TYPE: string;
  TOTAL_NUM: number;
}

export interface OpponentInfo {
  initiator: boolean;
  opponentNickname: string;
  peerIndex: number;
}
