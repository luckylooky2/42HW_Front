import { ICallHistory } from "@typings/db";
import { timeConverter } from "@utils/timeConverter";
import dayjs from "dayjs";
import { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
  callData: ICallHistory;
}

const CallHistory: FC<Props> = ({ callData }) => {
  const startDate = dayjs(callData.startTime).format("YYYY-MM-DD");
  const diffSeconds = dayjs(callData.endTime).diff(
    dayjs(callData.startTime),
    "s"
  );

  return (
    <div className={`flex flex-col bg-white rounded-md my-2`}>
      <div className="bg-orange-100">
        <div className="flex justify-between text-sm my-1.5 px-3">
          <div>{startDate}</div>
          <div>📞 {timeConverter(diffSeconds)}</div>
        </div>
      </div>
      <div
        className={`grow flex items-center h-[${
          callData.user.length <= 2 ? 30 : 60
        }px]`}
      >
        <div
          className={`grid grid-cols-${
            callData.user.length <= 1 ? 1 : 2
          } w-full h-full`}
        >
          {callData.user.map((v, i) => (
            <div key={i} className="px-[10%]">
              🇰🇷{" "}
              <Link
                to={`https://profile.intra.42.fr/users/${v.nickname}`}
                target="_blank"
                className="hover:text-blue-300 hover:underline"
              >
                {v.nickname}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallHistory;
