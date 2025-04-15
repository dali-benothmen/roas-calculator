import React from "react";
import { formatCurrency } from "@/app/utils/formatters";

interface MonthlySavingsProps {
  totalSavings: number;
}

const MonthlySavings: React.FC<MonthlySavingsProps> = ({ totalSavings }) => {
  return (
    <div className="grid grid-cols-2 items-center gap-6 mt-6 lg:mt-10 text-left">
      <h5 className="text-[22px] lg:text-[28.8px] font-bold leading-[30px] lg:leading-[40px] m-0 text-white">
        Monthly Savings
      </h5>
      <div className="bg-gradient-to-r from-[rgba(70,166,255,0.4)] to-[#46A6FF] text-white text-[24px] lg:text-[32px] leading-[36px] lg:leading-[48px] font-extrabold py-2 lg:py-3 px-4 lg:px-7 rounded-[6.08px] border-none cursor-pointer transition-all duration-300 flex items-center justify-center shadow-[0px_2px_12px_rgba(0,0,0,0.75)]">
        {formatCurrency(totalSavings)}
      </div>
    </div>
  );
};

export default MonthlySavings;
