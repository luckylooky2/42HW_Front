import CallHistory from "@components/Profile/CallHistory";
import { ICallHistory } from "@typings/db";
import { API_URL } from "@utils/constant";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CallHistoryList = () => {
  const { t } = useTranslation("translation", { keyPrefix: "profile" });
  const [callHistory, setCallHistory] = useState<ICallHistory[]>([]);

  const getCallHistory = useCallback(async () => {
    const response = await axios.get(`${API_URL}/call/callHistory`);
    setCallHistory(response.data);
  }, []);

  useEffect(() => {
    getCallHistory();
  }, []);

  return (
    <div className="flex flex-col h-[60%] justify-between">
      <div className="h-[8%] text-xl">{t("history.title")}</div>
      <div className="h-[85%] overflow-auto bg-gray-200 rounded-md p-2 m-1 px-2">
        {callHistory.length === 0 ? (
          <div className="h-full flex justify-center items-center text-gray-500">
            {t("history.empty")}
          </div>
        ) : (
          callHistory.map((v) => (
            <CallHistory key={`${v.id}-${v.startTime}`} callData={v} />
          ))
        )}
      </div>
    </div>
  );
};

export default CallHistoryList;
