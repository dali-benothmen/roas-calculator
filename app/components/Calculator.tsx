"use client";

import { useState, useRef, useEffect } from "react";
import "./Calculator.style.css";

export default function Calculator() {
  const [adSpend, setAdSpend] = useState(200000);
  const [revenue, setRevenue] = useState(220000);
  const [isDraggingAdSpend, setIsDraggingAdSpend] = useState(false);
  const [isDraggingRevenue, setIsDraggingRevenue] = useState(false);
  const [isFocusedAdSpend, setIsFocusedAdSpend] = useState(false);
  const [isFocusedRevenue, setIsFocusedRevenue] = useState(false);

  const adSpendRef = useRef<HTMLInputElement>(null);
  const adSpendFillRef = useRef<HTMLDivElement>(null);
  const adSpendThumbRef = useRef<HTMLDivElement>(null);
  const revenueRef = useRef<HTMLInputElement>(null);
  const revenueFillRef = useRef<HTMLDivElement>(null);
  const revenueThumbRef = useRef<HTMLDivElement>(null);

  const currentRoas = 1.12;
  const improvedAdSpend = 166000;
  const improvedRevenueBase = 284350;
  const improvedRoas = 1.31;
  const adSpendSavings = 34000;
  const revenueGain = 64350;
  const totalSavings = 75000;

  const adSpendBarWidths = { currentWidth: "70%", improvedWidth: "55%" };
  const revenueBarWidths = { currentWidth: "55%", improvedWidth: "75%" };
  const roasBarWidths = { currentWidth: "50%", improvedWidth: "75%" };

  const snapPoints = [125000, 250000, 375000];

  const snapToPoint = (value: number): number => {
    for (const point of snapPoints) {
      if (Math.abs(value - point) < 5000) {
        return point;
      }
    }
    return value;
  };

  const updateSliderUI = () => {
    if (adSpendFillRef.current && adSpendThumbRef.current) {
      const percentage = (adSpend / 500000) * 100;
      adSpendFillRef.current.style.width = `${percentage}%`;
      adSpendThumbRef.current.style.left = `${percentage}%`;
    }

    if (revenueFillRef.current && revenueThumbRef.current) {
      const percentage = (revenue / 500000) * 100;
      revenueFillRef.current.style.width = `${percentage}%`;
      revenueThumbRef.current.style.left = `${percentage}%`;
    }
  };

  useEffect(() => {
    updateSliderUI();
  }, [adSpend, revenue]);

  const updateThumbPosition = (
    type: "adSpend" | "revenue",
    value: number,
    isDragging: boolean = false
  ) => {
    const percentage = (value / 500000) * 100;
    const fillRef = type === "adSpend" ? adSpendFillRef : revenueFillRef;
    const thumbRef = type === "adSpend" ? adSpendThumbRef : revenueThumbRef;
    const rangeRef = type === "adSpend" ? adSpendRef : revenueRef;

    if (fillRef.current && thumbRef.current && rangeRef.current) {
      fillRef.current.style.width = `${percentage}%`;
      thumbRef.current.style.left = `${percentage}%`;
      rangeRef.current.value = percentage.toString();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatRoas = (value: number) => {
    return value.toFixed(2);
  };

  const handleThumbMouseDown = (
    e: React.MouseEvent | React.TouchEvent,
    type: "adSpend" | "revenue"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const initialValue = type === "adSpend" ? adSpend : revenue;

    if (type === "adSpend") {
      setIsDraggingAdSpend(true);
    } else {
      setIsDraggingRevenue(true);
    }

    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const slider =
        type === "adSpend" ? adSpendRef.current : revenueRef.current;
      if (!slider) return;

      const sliderRect = slider.getBoundingClientRect();
      const offsetX =
        moveEvent instanceof MouseEvent
          ? moveEvent.clientX - sliderRect.left
          : (moveEvent as TouchEvent).touches[0].clientX - sliderRect.left;

      let percentage = Math.max(
        0,
        Math.min(100, (offsetX / sliderRect.width) * 100)
      );

      let newValue = Math.round((percentage / 100) * 500000);
      newValue = Math.round(newValue / 5000) * 5000;

      if (type === "adSpend") {
        setAdSpend(newValue);
        updateThumbPosition("adSpend", newValue, true);
      } else {
        setRevenue(newValue);
        updateThumbPosition("revenue", newValue, true);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);

      if (type === "adSpend") {
        const currentValue = adSpend;
        const snappedValue = snapToPoint(currentValue);

        setIsDraggingAdSpend(false);

        if (snappedValue !== currentValue) {
          setAdSpend(snappedValue);
          updateThumbPosition("adSpend", snappedValue);
        }
      } else {
        const currentValue = revenue;
        const snappedValue = snapToPoint(currentValue);

        setIsDraggingRevenue(false);

        if (snappedValue !== currentValue) {
          setRevenue(snappedValue);
          updateThumbPosition("revenue", snappedValue);
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    type: "adSpend" | "revenue"
  ) => {
    const step = 5000;
    const bigStep = 25000;

    const setValue = type === "adSpend" ? setAdSpend : setRevenue;
    const currentValue = type === "adSpend" ? adSpend : revenue;

    let newValue = currentValue;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        newValue = Math.min(currentValue + step, 500000);
        e.preventDefault();
        break;
      case "ArrowLeft":
      case "ArrowDown":
        newValue = Math.max(currentValue - step, 0);
        e.preventDefault();
        break;
      case "PageUp":
        newValue = Math.min(currentValue + bigStep, 500000);
        e.preventDefault();
        break;
      case "PageDown":
        newValue = Math.max(currentValue - bigStep, 0);
        e.preventDefault();
        break;
      case "Home":
        newValue = 0;
        e.preventDefault();
        break;
      case "End":
        newValue = 500000;
        e.preventDefault();
        break;
      default:
        return;
    }

    newValue = Math.round(newValue / 5000) * 5000;

    setValue(newValue);
    updateThumbPosition(type, newValue);
  };

  const handleAdSpendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    const scaledValue = (newValue / 100) * 500000;
    const roundedValue = Math.round(scaledValue / 5000) * 5000;
    const finalValue = isDraggingAdSpend
      ? roundedValue
      : snapToPoint(roundedValue);
    setAdSpend(finalValue);

    if (adSpendFillRef.current && adSpendThumbRef.current) {
      const percentage = (finalValue / 500000) * 100;
      adSpendFillRef.current.style.width = `${percentage}%`;
      adSpendThumbRef.current.style.left = `${percentage}%`;
    }
  };

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    const scaledValue = (newValue / 100) * 500000;
    const roundedValue = Math.round(scaledValue / 5000) * 5000;
    const finalValue = isDraggingRevenue
      ? roundedValue
      : snapToPoint(roundedValue);
    setRevenue(finalValue);

    if (revenueFillRef.current && revenueThumbRef.current) {
      const percentage = (finalValue / 500000) * 100;
      revenueFillRef.current.style.width = `${percentage}%`;
      revenueThumbRef.current.style.left = `${percentage}%`;
    }
  };

  return (
    <div className="gap-[15%] bg-[linear-gradient(119deg,#fff0_54%,#46a6ff),linear-gradient(124deg,#8581810d,#aaa3)] border border-[#6f6e6e] rounded-[6px] w-full p-[2rem_4%] flex flex-col lg:flex-row relative text-white max-w-[1000px] mx-auto overflow-visible font-[var(--font-montserrat)]">
      <div className="flex flex-col z-[2] relative w-full pr-0 lg:pr-6 max-w-full">
        <h3 className="text-[24px] lg:text-[32px] font-medium leading-[30px] lg:leading-[38px] mb-6 lg:mb-12 text-white">
          Your Ad Spend now
        </h3>

        <div className="mb-8">
          <div className="mb-4">
            <div className="text-[18.4px] font-normal leading-[28px] text-white mb-2">
              Current Monthly Ad Spend
            </div>
          </div>

          <div className="range-block py-3 lg:py-6" data-multiplier="5000">
            <div className="range-numbers flex justify-between mb-2">
              <div className="numbers-range text-[14px] lg:text-[16px] leading-5 lg:leading-6 font-normal text-white transition-opacity duration-200">
                $0
              </div>
              <div className="numbers-range text-[14px] lg:text-[16px] leading-5 lg:leading-6 font-normal text-white transition-opacity duration-200">
                $500,000
              </div>
            </div>
            <div className="range-content relative h-[14px] lg:h-[16px]">
              <div
                ref={adSpendFillRef}
                className={`range-slider-line absolute left-0 top-0 h-full bg-gradient-to-r from-[#46A6FF] to-[#007DF2] rounded-[64px] transition-none ${
                  isDraggingAdSpend || isFocusedAdSpend
                    ? "animate-pulse-light animate-wave"
                    : ""
                }`}
                style={{ width: `${(adSpend / 500000) * 100}%` }}
              ></div>
              <div className="range-slider h-full w-full bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.4)] rounded-[64px] shadow-inner relative overflow-hidden pointer-events-none"></div>
              <div
                ref={adSpendThumbRef}
                className={`range-thumb absolute -ml-3 lg:-ml-4 top-1/2 -translate-y-1/2 w-6 h-6 lg:w-8 lg:h-8 bg-[radial-gradient(70.71%_70.71%_at_50%_50%,#46A6FF_0%,#007DF2_100%)] rounded-full shadow-[0_2px_8px_rgba(0,125,242,0.5)] border-2 border-white flex items-center justify-center z-20 transition-none cursor-pointer ${
                  isDraggingAdSpend || isFocusedAdSpend
                    ? "scale-110 shadow-[0_2px_12px_rgba(0,125,242,0.7)]"
                    : "hover:scale-105"
                }`}
                style={{ left: `${(adSpend / 500000) * 100}%` }}
                onMouseDown={(e) => handleThumbMouseDown(e, "adSpend")}
                onTouchStart={(e) => handleThumbMouseDown(e, "adSpend")}
                tabIndex={0}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={500000}
                aria-valuenow={adSpend}
                aria-valuetext={`${formatCurrency(adSpend)}`}
                onKeyDown={(e) => handleKeyDown(e, "adSpend")}
                onFocus={() => setIsFocusedAdSpend(true)}
                onBlur={() => setIsFocusedAdSpend(false)}
              >
                <div
                  className={`range-value absolute -top-10 lg:-top-14 left-1/2 -translate-x-1/2 bg-[#007df2] text-white py-1 lg:py-2 px-2 lg:px-3 rounded-lg shadow-[0_3px_10px_rgba(0,0,0,0.3)] whitespace-nowrap transition-all duration-300 min-w-[90px] lg:min-w-[112.88px] text-center pointer-events-none ${
                    isDraggingAdSpend || isFocusedAdSpend ? "scale-110" : ""
                  }`}
                >
                  <div className="flex justify-center items-center">
                    <div className="dollar text-white mr-0.5">$</div>
                    <div className="range-value-number text-[16px] lg:text-[18.4px] leading-6 lg:leading-7 font-normal">
                      {adSpend.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <input
                ref={adSpendRef}
                type="range"
                min="0"
                max="100"
                step="1"
                value={(adSpend / 500000) * 100}
                className="calculator-range absolute top-0 left-0 w-full h-full opacity-0 z-10 pointer-events-none"
                onChange={handleAdSpendChange}
                aria-label="Ad Spend Slider"
                aria-valuemin={0}
                aria-valuemax={500000}
                aria-valuenow={adSpend}
                aria-valuetext={`${formatCurrency(adSpend)}`}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4">
            <div className="text-[18.4px] font-normal leading-[28px] text-white mb-2">
              Current Monthly Revenue
            </div>
          </div>

          <div className="range-block py-3 lg:py-6" data-multiplier="5000">
            <div className="range-numbers flex justify-between mb-2">
              <div className="numbers-range text-[14px] lg:text-[16px] leading-5 lg:leading-6 font-normal text-white transition-opacity duration-200">
                $0
              </div>
              <div className="numbers-range text-[14px] lg:text-[16px] leading-5 lg:leading-6 font-normal text-white transition-opacity duration-200">
                $500,000
              </div>
            </div>
            <div className="range-content relative h-[14px] lg:h-[16px]">
              <div className="range-slider h-full w-full bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.4)] rounded-[64px] shadow-inner relative overflow-hidden pointer-events-none">
                <div
                  ref={revenueFillRef}
                  className={`range-slider-line absolute left-0 top-0 h-full bg-gradient-to-r from-[#46A6FF] to-[#007DF2] rounded-[64px] transition-none ${
                    isDraggingRevenue || isFocusedRevenue
                      ? "animate-pulse-light animate-wave"
                      : ""
                  }`}
                  style={{ width: `${(revenue / 500000) * 100}%` }}
                ></div>
              </div>
              <div
                ref={revenueThumbRef}
                className={`range-thumb absolute -ml-3 lg:-ml-4 top-1/2 -translate-y-1/2 w-6 h-6 lg:w-8 lg:h-8 bg-[radial-gradient(70.71%_70.71%_at_50%_50%,#46A6FF_0%,#007DF2_100%)] rounded-full shadow-[0_2px_8px_rgba(0,125,242,0.5)] border-2 border-white flex items-center justify-center z-20 transition-none cursor-pointer ${
                  isDraggingRevenue || isFocusedRevenue
                    ? "scale-110 shadow-[0_2px_12px_rgba(0,125,242,0.7)]"
                    : "hover:scale-105"
                }`}
                style={{ left: `${(revenue / 500000) * 100}%` }}
                onMouseDown={(e) => handleThumbMouseDown(e, "revenue")}
                onTouchStart={(e) => handleThumbMouseDown(e, "revenue")}
                tabIndex={0}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={500000}
                aria-valuenow={revenue}
                aria-valuetext={`${formatCurrency(revenue)}`}
                onKeyDown={(e) => handleKeyDown(e, "revenue")}
                onFocus={() => setIsFocusedRevenue(true)}
                onBlur={() => setIsFocusedRevenue(false)}
              >
                <div
                  className={`range-value absolute -top-10 lg:-top-14 left-1/2 -translate-x-1/2 bg-[#007df2] text-white py-1 lg:py-2 px-2 lg:px-3 rounded-lg shadow-[0_3px_10px_rgba(0,0,0,0.3)] whitespace-nowrap transition-all duration-300 min-w-[90px] lg:min-w-[112.88px] text-center pointer-events-none ${
                    isDraggingRevenue || isFocusedRevenue ? "scale-110" : ""
                  }`}
                >
                  <div className="flex justify-center items-center">
                    <div className="dollar text-white mr-0.5">$</div>
                    <div className="range-value-number text-[16px] lg:text-[18.4px] leading-6 lg:leading-7 font-normal">
                      {revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <input
                ref={revenueRef}
                type="range"
                min="0"
                max="100"
                step="1"
                value={(revenue / 500000) * 100}
                className="calculator-range absolute top-0 left-0 w-full h-full opacity-0 z-10 pointer-events-none"
                onChange={handleRevenueChange}
                aria-label="Revenue Slider"
                aria-valuemin={0}
                aria-valuemax={500000}
                aria-valuenow={revenue}
                aria-valuetext={`${formatCurrency(revenue)}`}
              />
            </div>
          </div>
        </div>

        <div className="mb-8 relative mt-[20px] lg:mt-[30px]">
          <div className="w-[calc(100%-70%)] lg:w-[calc(100%-585.52px-51px)] ml-[30px] lg:ml-[51px] border-t border-[#6F6E6E]"></div>

          <div className="relative pl-0 h-[65px] lg:h-[81px] pt-[15px] lg:pt-[20px] border-t border-[#6F6E6E]">
            <div className="absolute left-0 top-[35px] lg:top-[45px] text-[16px] lg:text-[18.4px] font-normal leading-[20px] lg:leading-[28px] text-white flex items-center">
              Current Monthly ROAS
            </div>
            <div className="absolute h-[38px] lg:h-[48px] left-[80%] right-0 top-[calc(50%-20px+16.5px)] lg:top-[calc(50%-24px+16.5px)] bg-[#007DF2] rounded-[6px] flex justify-center items-center">
              <div className="w-[40px] lg:w-[40.35px] h-[20px] lg:h-[23px] text-[16px] lg:text-[18.4px] font-normal leading-[24px] lg:leading-[28px] text-white flex items-center justify-center text-center">
                {formatRoas(currentRoas)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute w-[60%] h-[101%] top-[-0.5%] z-[1] right-[-1px] hidden lg:block">
        <img
          src="https://cdn.prod.website-files.com/6596ccfbb3d9754c38fb8e60/6596da5dc1170c5d925c93d2_Group%209969.webp"
          loading="lazy"
          sizes="(max-width: 991px) 100vw, (max-width: 1439px) 54vw, 766.796875px"
          srcSet="https://cdn.prod.website-files.com/6596ccfbb3d9754c38fb8e60/6596da5dc1170c5d925c93d2_Group%25209969-p-500.webp 500w, https://cdn.prod.website-files.com/6596ccfbb3d9754c38fb8e60/6596da5dc1170c5d925c93d2_Group%209969.webp 749w"
          alt=""
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col justify-between z-[3] relative w-[100%] mt-8 lg:mt-0">
        <div className="flex items-center mb-3 lg:mb-5">
          <span className="mr-2 lg:mr-3 text-[24px] lg:text-[32px] font-medium leading-[30px] lg:leading-[38px] text-white">
            With
          </span>
          <img
            src="https://cdn.prod.website-files.com/6596ccfbb3d9754c38fb8e60/6596da5dc1170c5d925c93d1_brandmark%20logo.svg"
            alt="OneTrack"
            className="h-[20px] lg:h-[25px]"
          />
        </div>
        <div className="grid grid-rows-3 gap-2 w-full">
          <div className="relative h-[100px] lg:h-[121px] mb-2 w-full">
            <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-[rgba(133,129,129,0.05)] to-[rgba(170,170,170,0.25)] opacity-50 border border-[#6f6e6e] backdrop-filter backdrop-blur-[4px] rounded-[18px] lg:rounded-[24px]"></div>

            <div className="absolute inset-0 p-4 lg:p-[1rem_1.75rem] flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center">
                  Ad Spend
                  <span className="mx-1 lg:mx-2">-</span>
                  {formatCurrency(adSpendSavings)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div
                  className="h-[24px] lg:h-[25px] bg-gradient-to-r from-[#B3BDD0] to-[#707886] rounded-[5px] lg:rounded-[6.08px] flex items-center pl-[8px] lg:pl-[11.19px] shadow-md lg:shadow-lg relative"
                  style={{
                    width: adSpendBarWidths.currentWidth,
                  }}
                >
                  <span className="text-[12px] lg:text-[14px] leading-[18px] lg:leading-[21px] font-normal whitespace-nowrap overflow-hidden text-ellipsis text-white absolute">
                    Your current Ad Spend
                  </span>
                </div>

                <div className="w-[60px] lg:w-fit lg:w-[70.67px] h-[19px] text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center justify-center text-center">
                  {formatCurrency(adSpend)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div
                  className="h-[24px] lg:h-[25px] bg-[linear-gradient(268.76deg,#46A6FF_0%,#005FB8_100%)] rounded-[5px] lg:rounded-[6.08px] flex items-center relative"
                  style={{
                    width: adSpendBarWidths.improvedWidth,
                  }}
                >
                  <div className="h-full">
                    <img
                      src="https://cdn.prod.website-files.com/6596ccfbb3d9754c38fb8e60/6596da5dc1170c5d925c93d0_Group%209967.svg"
                      alt=""
                      className="h-full w-auto object-contain absolute left-0"
                    />
                  </div>
                </div>

                <div className="w-[60px] lg:w-fit lg:w-[71.89px] h-[19px] text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center justify-center text-center">
                  {formatCurrency(improvedAdSpend)}
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[100px] lg:h-[121px] mb-2 w-full">
            <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-[rgba(133,129,129,0.05)] to-[rgba(170,170,170,0.25)] opacity-50 border border-[#6f6e6e] backdrop-filter backdrop-blur-[4px] rounded-[18px] lg:rounded-[24px]"></div>

            <div className="absolute inset-0 p-4 lg:p-[1rem_1.75rem] flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center">
                  Revenue
                  <span className="mx-1 lg:mx-2">+</span>
                  {formatCurrency(revenueGain)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div
                  className="h-[24px] lg:h-[25px] bg-gradient-to-r from-[#B3BDD0] to-[#707886] rounded-[5px] lg:rounded-[6.08px] flex items-center pl-[8px] lg:pl-[11.19px] shadow-md lg:shadow-lg relative"
                  style={{
                    width: revenueBarWidths.currentWidth,
                  }}
                >
                  <span className="text-[12px] lg:text-[14px] leading-[18px] lg:leading-[21px] font-normal whitespace-nowrap overflow-hidden text-ellipsis text-white absolute">
                    Your current Revenue
                  </span>
                </div>

                <div className="w-[60px] lg:w-fit lg:w-[70.67px] h-[19px] text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center justify-center text-center">
                  {formatCurrency(revenue)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div
                  className="h-[24px] lg:h-[25px] bg-[linear-gradient(268.76deg,#46A6FF_0%,#005FB8_100%)] rounded-[5px] lg:rounded-[6.08px] flex items-center relative"
                  style={{
                    width: revenueBarWidths.improvedWidth,
                  }}
                >
                  <div className="h-full">
                    <img
                      src="https://cdn.prod.website-files.com/6596ccfbb3d9754c38fb8e60/6596da5dc1170c5d925c93d0_Group%209967.svg"
                      alt=""
                      className="h-full w-auto object-contain absolute left-0"
                    />
                  </div>
                </div>

                <div className="w-[60px] lg:w-fit lg:w-[71.89px] h-[19px] text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center justify-center text-center">
                  {formatCurrency(improvedRevenueBase)}
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[100px] lg:h-[121px] mb-2 w-full">
            <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-[rgba(133,129,129,0.05)] to-[rgba(170,170,170,0.25)] opacity-50 border border-[#6f6e6e] backdrop-filter backdrop-blur-[4px] rounded-[18px] lg:rounded-[24px]"></div>

            <div className="absolute inset-0 p-4 lg:p-[1rem_1.75rem] flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center">
                  ROAS
                  <span className="mx-1 lg:mx-2">+</span>
                  {(improvedRoas - currentRoas).toFixed(2)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div
                  className="h-[24px] lg:h-[25px] bg-gradient-to-r from-[#B3BDD0] to-[#707886] rounded-[5px] lg:rounded-[6.08px] flex items-center pl-[8px] lg:pl-[11.19px] shadow-md lg:shadow-lg relative"
                  style={{
                    width: roasBarWidths.currentWidth,
                  }}
                >
                  <span className="text-[12px] lg:text-[14px] leading-[18px] lg:leading-[21px] font-normal whitespace-nowrap overflow-hidden text-ellipsis text-white absolute">
                    Your current ROAS
                  </span>
                </div>

                <div className="w-[60px] lg:w-fit lg:w-[70.67px] h-[19px] text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center justify-center text-center">
                  {formatRoas(currentRoas)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div
                  className="h-[24px] lg:h-[25px] bg-[linear-gradient(268.76deg,#46A6FF_0%,#005FB8_100%)] rounded-[5px] lg:rounded-[6.08px] flex items-center relative"
                  style={{
                    width: roasBarWidths.improvedWidth,
                  }}
                >
                  <div className="h-full">
                    <img
                      src="https://cdn.prod.website-files.com/6596ccfbb3d9754c38fb8e60/6596da5dc1170c5d925c93d0_Group%209967.svg"
                      alt=""
                      className="h-full w-auto object-contain absolute left-0"
                    />
                  </div>
                </div>

                <div className="w-[60px] lg:w-fit lg:w-[71.89px] h-[19px] text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center justify-center text-center">
                  {formatRoas(improvedRoas)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center gap-6 mt-6 lg:mt-10 text-left">
          <h5 className="text-[22px] lg:text-[28.8px] font-bold leading-[30px] lg:leading-[40px] m-0 text-white">
            Monthly Savings
          </h5>
          <div className="bg-gradient-to-r from-[rgba(70,166,255,0.4)] to-[#46A6FF] text-white text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] font-extrabold py-2 lg:py-3 px-4 lg:px-7 rounded-[6.08px] border-none cursor-pointer transition-all duration-300 flex items-center justify-center shadow-[0px_2px_12px_rgba(0,0,0,0.75)]">
            {formatCurrency(totalSavings)}
          </div>
        </div>
      </div>
    </div>
  );
}
