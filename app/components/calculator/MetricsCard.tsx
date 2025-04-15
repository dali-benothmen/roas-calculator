import React from "react";

export interface MetricsCardProps {
  title: string;
  difference: string;
  isPositive: boolean;
  currentLabel: string;
  currentValue: string;
  currentWidth: string;
  improvedValue: string;
  improvedWidth: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  difference,
  isPositive,
  currentLabel,
  currentValue,
  currentWidth,
  improvedValue,
  improvedWidth,
}) => {
  return (
    <div className="relative h-[100px] lg:h-[121px] mb-2 w-full">
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-[rgba(133,129,129,0.05)] to-[rgba(170,170,170,0.25)] opacity-50 border border-[#6f6e6e] backdrop-filter backdrop-blur-[4px] rounded-[18px] lg:rounded-[24px]"></div>

      <div className="absolute inset-0 p-4 lg:p-[1rem_1.75rem] flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center">
            {title}
            <span className="mx-1 lg:mx-2">{isPositive ? "+" : "-"}</span>
            {difference}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div
            className="h-[24px] lg:h-[25px] bg-gradient-to-r from-[#B3BDD0] to-[#707886] rounded-[5px] lg:rounded-[6.08px] flex items-center pl-[8px] lg:pl-[11.19px] shadow-md lg:shadow-lg relative"
            style={{
              width: currentWidth,
            }}
          >
            <span className="text-[12px] lg:text-[14px] leading-[18px] lg:leading-[21px] font-normal whitespace-nowrap overflow-hidden text-ellipsis text-white absolute">
              {currentLabel}
            </span>
          </div>

          <div className="w-[60px] lg:w-fit lg:w-[70.67px] h-[19px] text-[14px] lg:text-[16px] leading-[20px] lg:leading-[24px] font-normal text-white flex items-center justify-center text-center">
            {currentValue}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div
            className="h-[24px] lg:h-[25px] bg-[linear-gradient(268.76deg,#46A6FF_0%,#005FB8_100%)] rounded-[5px] lg:rounded-[6.08px] flex items-center relative"
            style={{
              width: improvedWidth,
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
            {improvedValue}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
