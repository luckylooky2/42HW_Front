import { ICallHistory } from "@typings/db";
import { FC } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

interface Props {
  callData: ICallHistory;
}

const CallHistory: FC<Props> = ({ callData }) => {
  const startDate = dayjs(callData.startTime).format("YYYY-MM-DD HH:mm");
  const diffSeconds = dayjs(callData.endTime).diff(
    dayjs(callData.startTime),
    "s"
  );

  function timeConverter(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <div className="flex items-center bg-white rounded-md h-[50px] my-1">
      <div className="mx-2">{startDate}</div>
      <div className="mx-2">{timeConverter(diffSeconds)}</div>
      <div> | </div>
      <div
        className={`grid grid-cols-${callData.user.length <= 1 ? 1 : 2} w-full`}
      >
        {callData.user.map((v, i) => (
          <div key={i} className="mx-auto">
            <Link
              to={`https://profile.intra.42.fr/users/${v.nickname}`}
              target="_blank"
              className="hover:text-blue-300 hover:underline"
            >
              🇰🇷 {v.nickname}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallHistory;
