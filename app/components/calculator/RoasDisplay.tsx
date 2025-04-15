import React from "react";
import { formatRoas } from "@/app/utils/formatters";

interface RoasDisplayProps {
  currentRoas: number;
}

const RoasDisplay: React.FC<RoasDisplayProps> = ({ currentRoas }) => {
  return (
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
  );
};

export default RoasDisplay;
