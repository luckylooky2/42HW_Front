import { FC, useState, useEffect, useCallback } from "react";

interface Props {
  carouselList: any[];
  isMouseEnter: boolean;
}

const Carousel: FC<Props> = ({ carouselList, isMouseEnter }) => {
  const [currList, setCurrList] = useState<string[]>();
  const [currIndex, setCurrIndex] = useState(0);
  const [carouselTransition, setCarouselTransition] = useState(
    "transform 200ms ease-in-out"
  );

  useEffect(() => {
    if (carouselList.length !== 0) {
      const startData = carouselList[0];
      const endData = carouselList[carouselList.length - 1];
      const newList = [endData, ...carouselList, startData];

      setCurrList(newList);
      setCurrIndex(1);
    }
  }, [carouselList]);

  const moveToNthSlide = useCallback((index: number) => {
    setTimeout(() => {
      setCarouselTransition("");
      setCurrIndex(index);
    }, 200);
  }, []);

  const handleSwipe = useCallback(
    (direction: number) => {
      const newIndex = currIndex + direction;

      if (newIndex === carouselList.length + 1) moveToNthSlide(1);
      else if (newIndex === 0) moveToNthSlide(carouselList.length);

      setCurrIndex((prev) => prev + direction);

      setCarouselTransition("transform 200ms ease-in-out");
    },
    [currIndex]
  );

  const onClickDot = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLInputElement;
    setCurrIndex(parseInt(target.value, 10));
  }, []);

  return (
    <div
      className="flex items-center justify-center w-full h-full"
      id="container"
    >
      <div className="h-full w-full px-0 overflow-hidden" id="wrapper">
        <ul className="flex w-full h-[90%]" id="carousel">
          {isMouseEnter && (
            <div className="flex justify-center">
              <button
                className="absolute left-0 bg-gray-300 px-1 py-2 rounded-md top-[40%]"
                type="button"
                id="swipe-left"
                onClick={() => handleSwipe(-1)}
              >
                &lt;
              </button>
              <button
                className="absolute right-0 bg-gray-300 px-1 py-2 rounded-md top-[40%]"
                type="button"
                id="swipe-right"
                onClick={() => handleSwipe(1)}
              >
                &gt;
              </button>
            </div>
          )}
          {currList?.map((v: any, i) => (
            <li
              className="flex-none object-contain flex flex-col items-center justify-center w-full bg-gray-100 overflow-hidden rounded-lg"
              key={`${v}-${i}`}
              id="item"
              style={{
                transform: `translateX(-${currIndex * 100}%)`,
                transition: `${carouselTransition}`,
              }}
            >
              <div>{`[${v.category}]`}</div>
              <div className="overflow-auto p-2 text-center">
                {`Q${i}. ${v.question}`}
              </div>
            </li>
          ))}
        </ul>
        <ul className="flex justify-center items-center h-[10%]">
          {carouselList.map((v, i) => (
            <button
              type="button"
              key={`${v}-${i}`}
              value={i + 1}
              onClick={onClickDot}
              className={`w-2 h-2 mx-0.5 rounded-md bg-gray-${
                (currIndex - 1 + carouselList.length) % carouselList.length ===
                i
                  ? "500"
                  : "200"
              }`}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Carousel;
