"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Slider from "@/app/lib/components/Slider";
import MetricsCard from "./MetricsCard";
import RoasDisplay from "./RoasDisplay";
import MonthlySavings from "./MonthlySavings";
import { formatCurrency, formatRoas } from "@/app/utils/formatters";
import {
  calculateImprovedAdSpend,
  calculateImprovedRevenue,
  calculateImprovedRoas,
  calculateAdSpendSavings,
  calculateRevenueGain,
  calculateTotalSavings,
} from "@/app/utils/calculatorUtils";
import "./styles.css";

export default function Calculator() {
  const [adSpend, setAdSpend] = useState(200000);
  const [revenue, setRevenue] = useState(220000);
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const currentRoas = useMemo(() => {
    if (adSpend === 0) return 0;
    const rawRoas = revenue / adSpend;
    return Math.round(rawRoas * 100) / 100;
  }, [revenue, adSpend]);

  const improvedAdSpend = useMemo(() => {
    return calculateImprovedAdSpend(adSpend);
  }, [adSpend]);

  const improvedRevenueBase = useMemo(() => {
    return calculateImprovedRevenue(revenue);
  }, [revenue]);

  const improvedRoas = useMemo(() => {
    return calculateImprovedRoas(currentRoas);
  }, [currentRoas]);

  const adSpendSavings = useMemo(() => {
    return calculateAdSpendSavings(adSpend, improvedAdSpend);
  }, [adSpend, improvedAdSpend]);

  const revenueGain = useMemo(() => {
    return calculateRevenueGain(revenue, improvedRevenueBase);
  }, [revenue, improvedRevenueBase]);

  const totalSavings = useMemo(() => {
    return calculateTotalSavings(adSpendSavings, revenueGain);
  }, [adSpendSavings, revenueGain]);

  const adSpendBarWidths = useMemo(() => {
    return { currentWidth: "70%", improvedWidth: "55%" };
  }, []);

  const revenueBarWidths = useMemo(() => {
    return { currentWidth: "55%", improvedWidth: "75%" };
  }, []);

  const roasBarWidths = useMemo(() => {
    return { currentWidth: "50%", improvedWidth: "75%" };
  }, []);

  const snapPoints = [125000, 250000, 375000];

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

          <Slider
            value={adSpend}
            onChange={setAdSpend}
            min={0}
            max={500000}
            step={5000}
            label="Ad Spend Slider"
            formatValue={(val) => val.toLocaleString()}
            snapPoints={snapPoints}
          />
        </div>

        <div className="mb-8">
          <div className="mb-4">
            <div className="text-[18.4px] font-normal leading-[28px] text-white mb-2">
              Current Monthly Revenue
            </div>
          </div>

          <Slider
            value={revenue}
            onChange={setRevenue}
            min={0}
            max={500000}
            step={5000}
            label="Revenue Slider"
            formatValue={(val) => val.toLocaleString()}
            snapPoints={snapPoints}
          />
        </div>

        <RoasDisplay currentRoas={currentRoas} />
      </div>

      <div className="absolute w-[60%] h-[101%] top-[-0.5%] z-[1] right-[-1px] hidden lg:block">
        {!imageError ? (
          <Image
            src="https://cdn.prod.website-files.com/6596ccfbb3d9754c38fb8e60/6596da5dc1170c5d925c93d2_Group%209969.webp"
            alt="ROAS Calculator visualization"
            fill
            sizes="(max-width: 991px) 100vw, (max-width: 1439px) 54vw, 766px"
            priority
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#46A6FF] to-[#005FB8] opacity-60 rounded-r-md"></div>
        )}
      </div>

      <div className="flex flex-col justify-between z-[3] relative w-[100%] mt-8 lg:mt-0">
        <div className="flex items-center mb-3 lg:mb-5">
          <span className="mr-2 lg:mr-3 text-[24px] lg:text-[32px] font-medium leading-[30px] lg:leading-[38px] text-white">
            With
          </span>
          {!logoError ? (
            <Image
              src="https://cdn.prod.website-files.com/6596ccfbb3d9754c38fb8e60/6596da5dc1170c5d925c93d1_brandmark%20logo.svg"
              alt="OneTrack"
              width={100}
              height={25}
              className="h-[20px] lg:h-[25px] w-auto"
              onError={() => setLogoError(true)}
              unoptimized
            />
          ) : (
            <span className="text-[20px] font-bold text-white">OneTrack</span>
          )}
        </div>

        <div className="grid grid-rows-3 gap-2 w-full">
          <MetricsCard
            title="Ad Spend"
            difference={formatCurrency(adSpendSavings)}
            isPositive={false}
            currentLabel="Your current Ad Spend"
            currentValue={formatCurrency(adSpend)}
            currentWidth={adSpendBarWidths.currentWidth}
            improvedValue={formatCurrency(improvedAdSpend)}
            improvedWidth={adSpendBarWidths.improvedWidth}
          />

          <MetricsCard
            title="Revenue"
            difference={formatCurrency(revenueGain)}
            isPositive={true}
            currentLabel="Your current Revenue"
            currentValue={formatCurrency(revenue)}
            currentWidth={revenueBarWidths.currentWidth}
            improvedValue={formatCurrency(improvedRevenueBase)}
            improvedWidth={revenueBarWidths.improvedWidth}
          />

          <MetricsCard
            title="ROAS"
            difference={(improvedRoas - currentRoas).toFixed(2)}
            isPositive={true}
            currentLabel="Your current ROAS"
            currentValue={formatRoas(currentRoas)}
            currentWidth={roasBarWidths.currentWidth}
            improvedValue={formatRoas(improvedRoas)}
            improvedWidth={roasBarWidths.improvedWidth}
          />
        </div>

        <MonthlySavings totalSavings={totalSavings} />
      </div>
    </div>
  );
}
