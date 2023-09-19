export const API_URL = process.env.REACT_APP_API_URL;
export const FRONT_URL = process.env.REACT_APP_FRONT_URL;

export const COUNT = {
  MATCH: 3,
  READY: 1.5,
  VOTE: 10,
  HANG_UP: 3,
};
export const MILLISECOND = 1000;

export const SCREEN = { INIT: "INIT", TOPIC_SELECT: "TOPIC_SELECT" };

export const MIC_STATUS = {
  GRANTED: "granted",
  PROMPT: "prompt",
  DENIED: "denied",
};

export const TOPIC_LIST = [
  "shopping",
  "business",
  "travel",
  "sports",
  "home",
  "music",
  "food",
  "hobbies",
  "42",
];

export const ICE_SERVER = [
  {
    urls: [
      "stun:stun.l.google.com:19302",
      "stun:stun1.l.google.com:19302",
      "stun:stun2.l.google.com:19302",
      "stun:stun3.l.google.com:19302",
      "stun:stun4.l.google.com:19302",
    ],
  },
  {
    urls: `turn:${process.env.REACT_APP_TURN_URL}`,
    username: process.env.REACT_APP_TURN_USERNAME,
    credential: process.env.REACT_APP_TURN_PASSWORD,
  },
];
