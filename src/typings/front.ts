export type RoomType = "single" | "group" | null;
export type SetRoomType = Function;

export interface CallType {
  TYPE: string;
  TOTAL_NUM: number;
}

export interface OpponentInfo {
  initiator: boolean;
  opponentNickname: string;
  peerIndex: number;
}

export interface CallInfo {
  roomName: string | null;
  roomType: RoomType;
  opponent: OpponentInfo[] | null;
  currNum: number | null;
  myIndex: number | null;
}

export interface AudioInfo {
  stream: MediaStream | null;
  deviceId: string | null;
  audioList: MediaDeviceInfo[];
}
