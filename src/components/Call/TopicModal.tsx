import { useState, useCallback, FC } from "react";
import Carousel from "@utils/Carousel";

interface Props {
  contents: any[];
}

const TopicModal: FC<Props> = ({ contents }) => {
  const [isMouseEnter, SetIsMouseEnter] = useState<boolean>(false);

  const onMouseOver = useCallback(() => {
    SetIsMouseEnter(true);
  }, []);

  const onMouseOut = useCallback(() => {
    SetIsMouseEnter(false);
  }, []);

  return (
    <div className="w-full h-full p-5">
      <div className="w-full h-full max-w-[350px] mx-auto overflow-auto relative ">
        <div
          className="p-5 h-full w-full"
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
        >
          <Carousel carouselList={contents} isMouseEnter={isMouseEnter} />
        </div>
      </div>
    </div>
  );
};

export default TopicModal;
