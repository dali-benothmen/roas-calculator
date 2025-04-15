"use client";

import React, { useRef, useEffect, useState } from "react";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  formatValue?: (value: number) => string;
  snapPoints?: number[];
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 500000,
  step = 5000,
  label,
  formatValue = (val) => val.toLocaleString(),
  snapPoints = [],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const rangeRef = useRef<HTMLInputElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const snapToPoint = (val: number): number => {
    for (const point of snapPoints) {
      if (Math.abs(val - point) < step) {
        return point;
      }
    }
    return val;
  };

  const updateThumbPosition = (newValue: number) => {
    const percentage = ((newValue - min) / (max - min)) * 100;

    if (fillRef.current && thumbRef.current && rangeRef.current) {
      fillRef.current.style.width = `${percentage}%`;
      thumbRef.current.style.left = `${percentage}%`;
      rangeRef.current.value = percentage.toString();
    }
  };

  useEffect(() => {
    updateThumbPosition(value);
  }, [value]);

  const handleThumbMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const slider = rangeRef.current;
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

      let newValue = Math.round(min + (percentage / 100) * (max - min));
      newValue = Math.round(newValue / step) * step;

      onChange(newValue);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);

      setIsDragging(false);

      if (snapPoints.length > 0) {
        const snappedValue = snapToPoint(value);
        if (snappedValue !== value) {
          onChange(snappedValue);
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const normalStep = step;
    const bigStep = step * 5;

    let newValue = value;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        newValue = Math.min(value + normalStep, max);
        e.preventDefault();
        break;
      case "ArrowLeft":
      case "ArrowDown":
        newValue = Math.max(value - normalStep, min);
        e.preventDefault();
        break;
      case "PageUp":
        newValue = Math.min(value + bigStep, max);
        e.preventDefault();
        break;
      case "PageDown":
        newValue = Math.max(value - bigStep, min);
        e.preventDefault();
        break;
      case "Home":
        newValue = min;
        e.preventDefault();
        break;
      case "End":
        newValue = max;
        e.preventDefault();
        break;
      default:
        return;
    }

    newValue = Math.round(newValue / step) * step;
    onChange(newValue);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    const scaledValue = min + (newValue / 100) * (max - min);
    const roundedValue = Math.round(scaledValue / step) * step;
    const finalValue = isDragging ? roundedValue : snapToPoint(roundedValue);

    onChange(finalValue);
  };

  return (
    <div className="range-block py-3 lg:py-6" data-multiplier={step}>
      <div className="range-numbers flex justify-between mb-2">
        <div className="numbers-range text-[14px] lg:text-[16px] leading-5 lg:leading-6 font-normal text-white transition-opacity duration-200">
          ${min.toLocaleString()}
        </div>
        <div className="numbers-range text-[14px] lg:text-[16px] leading-5 lg:leading-6 font-normal text-white transition-opacity duration-200">
          ${max.toLocaleString()}
        </div>
      </div>
      <div className="range-content relative h-[14px] lg:h-[16px]">
        <div
          ref={fillRef}
          className={`range-slider-line absolute left-0 top-0 h-full bg-gradient-to-r from-[#46A6FF] to-[#007DF2] rounded-[64px] transition-none ${
            isDragging || isFocused ? "animate-pulse-light animate-wave" : ""
          }`}
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        ></div>
        <div className="range-slider h-full w-full bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.4)] rounded-[64px] shadow-inner relative overflow-hidden pointer-events-none"></div>
        <div
          ref={thumbRef}
          className={`range-thumb absolute -ml-3 lg:-ml-4 top-1/2 -translate-y-1/2 w-6 h-6 lg:w-8 lg:h-8 bg-[radial-gradient(70.71%_70.71%_at_50%_50%,#46A6FF_0%,#007DF2_100%)] rounded-full shadow-[0_2px_8px_rgba(0,125,242,0.5)] border-2 border-white flex items-center justify-center z-20 transition-none cursor-pointer ${
            isDragging || isFocused
              ? "scale-110 shadow-[0_2px_12px_rgba(0,125,242,0.7)]"
              : "hover:scale-105"
          }`}
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
          onMouseDown={handleThumbMouseDown}
          onTouchStart={handleThumbMouseDown}
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue(value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <div
            className={`range-value absolute -top-10 lg:-top-14 left-1/2 -translate-x-1/2 bg-[#007df2] text-white py-1 lg:py-2 px-2 lg:px-3 rounded-lg shadow-[0_3px_10px_rgba(0,0,0,0.3)] whitespace-nowrap transition-all duration-300 min-w-[90px] lg:min-w-[112.88px] text-center pointer-events-none ${
              isDragging || isFocused ? "scale-110" : ""
            }`}
          >
            <div className="flex justify-center items-center">
              <div className="dollar text-white mr-0.5">$</div>
              <div className="range-value-number text-[16px] lg:text-[18.4px] leading-6 lg:leading-7 font-normal">
                {formatValue(value)}
              </div>
            </div>
          </div>
        </div>
        <input
          ref={rangeRef}
          type="range"
          min="0"
          max="100"
          step="1"
          value={((value - min) / (max - min)) * 100}
          className="calculator-range absolute top-0 left-0 w-full h-full opacity-0 z-10 pointer-events-none"
          onChange={handleRangeChange}
          aria-label={label || "Slider"}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formatValue(value)}
        />
      </div>
    </div>
  );
};

export default Slider;
