export interface IUser {
  id: number;
  nickname: string;
  avatar: string;
  campus: string;
  level: number;
  preferredLang: string;
}

export interface ICallHistory {
  id: number;
  startTime: string;
  endTime: string;
  user: IUser[];
}

export interface ITopicDTO {
  id: number;
  category: string;
  question: string;
  hint: string[];
}
