import { useContext } from "react";
import { CallActionType, CallContext } from "@contexts/CallProvider";
import { CallType, RoomType, SetRoomType } from "@typings/front";

export function useRoomType(): [RoomType, SetRoomType] {
  const { callInfo, dispatch } = useContext(CallContext);

  const setRoomType = (callType: CallType) => {
    dispatch({
      type: CallActionType.SET_ROOMTYPE,
      payload: callType.TYPE,
    });
  };

  return [callInfo.roomType, setRoomType];
}
