import { FC, useState, useEffect, useCallback } from "react";

interface Props {
  carouselList: any[];
  isMouseEnter: boolean;
}

let touchStartX: number;
let touchEndX: number;

const Carousel: FC<Props> = ({ carouselList, isMouseEnter }) => {
  const [currList, setCurrList] = useState<string[]>();
  const [currIndex, setCurrIndex] = useState(0);
  const [carouselTransition, setCarouselTransition] = useState(
    "transform 200ms ease-in-out"
  );
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    if (carouselList.length !== 0) {
      const startData = carouselList[0];
      const endData = carouselList[carouselList.length - 1];
      const newList = [endData, ...carouselList, startData];

      setCurrList(newList);
      setCurrIndex(1);
    }
  }, [carouselList]);

  const moveToNthSlide = useCallback(
    (index: number) => {
      setTimeout(() => {
        setCarouselTransition("");
        setCurrIndex(index);
      }, 200);
    },
    [currIndex, carouselTransition]
  );

  const handleSwipe = useCallback(
    (direction: number) => {
      const newIndex = currIndex + direction;

      if (newIndex === carouselList.length + 1) moveToNthSlide(1);
      else if (newIndex === 0) moveToNthSlide(carouselList.length);

      setCurrIndex((prev) => prev + direction);
      setCarouselTransition("transform 200ms ease-in-out");
    },
    [currIndex, carouselTransition]
  );

  const onClickDot = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLInputElement;
    setCurrIndex(parseInt(target.value, 10));
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      touchEndX = e.touches[0].clientX;
      const diff = touchStartX - touchEndX;
      // 화면 크기에 비례해야 함
      setTranslateX(diff / 256);
      setCarouselTransition("");
    },
    [currIndex, carouselTransition]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipeByTouch();
      setTranslateX(0);
    },
    [currIndex]
  );

  // 의존성 배열 설정하니 해결됨
  const handleSwipeByTouch = useCallback(() => {
    const touchDiff = touchStartX - touchEndX;
    if (touchDiff > 10) handleSwipe(1);
    else if (touchDiff < -10) handleSwipe(-1);
  }, [currIndex, carouselTransition]);

  return (
    <div
      className="flex items-center justify-center w-full h-full"
      id="container"
    >
      <div
        className="h-full w-full px-0 overflow-hidden"
        id="wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
              className="flex-none object-contain w-full px-2"
              key={`carouselList-${v}-${i}`}
              id="item"
              style={{
                transform: `translateX(-${(currIndex + translateX) * 100}%)`,
                transition: `${carouselTransition}`,
              }}
            >
              <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center overflow-hidden rounded-lg">
                <div>{`[${v.category}]`}</div>
                <div className="overflow-auto p-2 text-center">
                  {`Q${
                    i === 0
                      ? carouselList.length
                      : i === carouselList.length + 1
                      ? 1
                      : i
                  }. ${v.question}`}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <ul className="flex justify-center items-center h-[10%]">
          {carouselList.map((v, i) => (
            <button
              type="button"
              key={`carouselDot-${v}-${i}`}
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
