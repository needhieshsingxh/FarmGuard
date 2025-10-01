import React from "react";
import Card from "../components/ui/Card";
import { DUMMY_FARM_STATS, DUMMY_ALERTS } from "../constants";
import AlertItem from "../components/ui/AlertItem";
import { GoogleGenAI } from "@google/genai";
import { useLanguage, LANGUAGES } from "../AppContext";
import { useState, useEffect } from "react";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
          {value}
        </p>
      </div>
      <div className={`p-2 sm:p-3 rounded-full ${color}`}>{icon}</div>
    </div>
  </Card>
);

const CameraFeed: React.FC<{
  title: string;
  status: "ok" | "warning";
  videoSrc: string;
}> = ({ title, status, videoSrc }) => {
  const { t } = useLanguage();
  return (
    <div className="relative aspect-video bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center overflow-hidden shadow-lg">
      <video
        key={videoSrc}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center gap-1 sm:gap-2 text-white text-xs font-bold bg-black/50 px-1.5 sm:px-2 py-1 rounded-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        LIVE
      </div>

      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white text-xs sm:text-sm font-semibold">
        {title}
      </div>
      <div
        className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
          status === "ok"
            ? "bg-green-500/80 text-white"
            : "bg-yellow-400/80 text-yellow-900 animate-pulse"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            status === "ok" ? "bg-green-300" : "bg-yellow-200"
          }`}
        ></span>
        {status === "ok" ? t("allClear") : t("alert")}
      </div>
    </div>
  );
};

interface RiskPoint {
  id: string;
  cx: number;
  cy: number;
  r: number;
  level: "High" | "Medium" | "Low";
  type: string;
  region: string;
}

const RegionalRiskMap = () => {
  const { t } = useLanguage();
  const [hoveredRisk, setHoveredRisk] = useState<RiskPoint | null>(null);

  const riskPoints: RiskPoint[] = [
    {
      id: "h1",
      cx: 200,
      cy: 110,
      r: 15,
      level: "High",
      type: "Avian Flu",
      region: "Punjab",
    },
    {
      id: "h2",
      cx: 220,
      cy: 125,
      r: 25,
      level: "High",
      type: "Avian Flu",
      region: "Haryana",
    },
    {
      id: "h3",
      cx: 330,
      cy: 170,
      r: 20,
      level: "High",
      type: "Classical Swine Fever",
      region: "West Bengal",
    },
    {
      id: "m1",
      cx: 120,
      cy: 200,
      r: 22,
      level: "Medium",
      type: "IBD",
      region: "Rajasthan",
    },
    {
      id: "m2",
      cx: 230,
      cy: 250,
      r: 30,
      level: "Medium",
      type: "IBD Hotspot",
      region: "Telangana",
    },
    {
      id: "l1",
      cx: 180,
      cy: 350,
      r: 25,
      level: "Low",
      type: "General",
      region: "Karnataka",
    },
  ];

  const getColorForLevel = (level: "High" | "Medium" | "Low") => {
    if (level === "High") return "rgba(239, 68, 68, 0.6)"; // red-500
    if (level === "Medium") return "rgba(250, 204, 21, 0.6)"; // yellow-400
    return "rgba(34, 197, 94, 0.6)"; // green-500
  };

  return (
    <div className="relative p-2 md:p-4 rounded-lg bg-gray-200 dark:bg-slate-800">
      {hoveredRisk && (
        <div
          className="absolute z-10 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl border dark:border-gray-700 text-xs pointer-events-none transition-opacity duration-200"
          style={{
            left: `${hoveredRisk.cx + 15}px`,
            top: `${hoveredRisk.cy - 15}px`,
            transform: "translateY(-100%)",
            opacity: 1,
          }}
        >
          <p className="font-bold text-gray-800 dark:text-gray-100">
            {hoveredRisk.region}
          </p>
          <p
            className={`font-semibold ${
              hoveredRisk.level === "High"
                ? "text-red-500"
                : hoveredRisk.level === "Medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {hoveredRisk.level} Risk
          </p>
          <p className="text-gray-500 dark:text-gray-400">{hoveredRisk.type}</p>
        </div>
      )}
      <svg
        viewBox="0 0 450 500"
        className="w-full h-auto"
        aria-labelledby="map-title"
        role="img"
      >
        <title id="map-title">{t("riskMapAlt")}</title>
        <defs>
          <filter
            id="heatmap-blur"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        <path
          d="M357.5,236.2c0,0-15.3,16.5-15.3,16.5s-23.7,28.8-23.7,28.8s-22,37-22,37s-3.7,11.3-3.7,11.3s-14.7,18-14.7,18s-13.8,11.7-13.8,11.7s-10.8,5.7-10.8,5.7s-20.8-2.3-20.8-2.3s-17.5-12.7-17.5-12.7s-13.3-15.3-13.3-15.3s-2.3-10.7-2.3-10.7s1.3-18.7,1.3-18.7s8.3-12.7,8.3-12.7s7-17,7-17s-2.7-14.7-2.7-14.7s-13-11.7-13-11.7s-18.3-3.3-18.3-3.3s-15.3-14-15.3-14s-3.7-21.3-3.7-21.3s-5.3-10.3-5.3-10.3s-9-11.7-9-11.7s-10.7-2.3-10.7-2.3s-10.7,5-10.7,5s-8.7,9-8.7,9s-5.7,10.7-5.7,10.7s-1.3,21-1.3,21s4.7,12,4.7,12s9.3,9.7,9.3,9.7s3.7,17.3,3.7,17.3s-8.7,14.7-8.7,14.7s-6.3,9.7-6.3,9.7s-10,13.7-10,13.7s-11.7,11.3-11.7,11.3s-13.7,11.7-13.7,11.7s-15.3,16-15.3,16s-10.3,18.3-10.3,18.3s-5.7,16-5.7,16s-1.3,11.3-1.3,11.3s1.7,10.7,1.7,10.7s8.7,10.3,8.7,10.3s6.7,1.7,6.7,1.7s11-6,11-6s7.3-6.7,7.3-6.7s10-1.7,10-1.7s14.3,2.7,14.3,2.7s10.3,6.3,10.3,6.3s10.3,8.3,10.3,8.3s12.3,14,12.3,14s14.3,13,14.3,13s10.3,3,10.3,3s13.7-4.3,13.7-4.3s8.7-6.3,8.7-6.3s8-3.7,8-3.7s17,2,17,2s12.3,8.3,12.3,8.3s12.3,13,12.3,13s5,12.3,5,12.3s-1,10-1,10s-5,10.3-5,10.3s-10.3,11-10.3,11s-9.3,13-9.3,13s-3.7,14.3-3.7,14.3s2.3,13.3,2.3,13.3s11.3,11.3,11.3,11.3s15.3,10.7,15.3,10.7s18,8.3,18,8.3s20.3,4,20.3,4s18.3-4.3,18.3-4.3s13-10,13-10s10.3-12.7,10.3-12.7s6.3-13.3,6.3-13.3s2.7-12,2.7-12s-1-11-1-11s-5-10.7-5-10.7s-6.3-10-6.3-10s-6.7-14.7-6.7-14.7s-1.7-22.3-1.7-22.3s6.7-11.7,6.7-11.7s10.7-11.7,10.7-11.7s10-14.7,10-14.7s5-15,5-15s-2.3-18-2.3-18s-13.3-16-13.3-16s-11-13.3-11-13.3s-14.3-25-14.3-25s-14.7-27.7-14.7-27.7s-10-23-10-23s-1.7-16.7-1.7-16.7s5-13.3,5-13.3s12.7-11,12.7-11s10.7-1.7,10.7-1.7s12.7,8,12.7,8s11,10.3,11,10.3s13.3,16,13.3,16s13,17,13,17s14.3,13.7,14.3,13.7s15.3,8.7,15.3,8.7s21.3-4.3,21.3-4.3s15.3-17,15.3-17s11-23.7,11-23.7s5.3-18,5.3-18s-2.3-17.3-2.3-17.3s-10-14.7-10-14.7s-12.7-10.7-12.7-10.7s-14-6.3-14-6.3s-14.3-2-14.3-2s-13.7,2.3-13.7,2.3s-13,6.3-13,6.3s-12.3,11.7-12.3,11.7s-10.3,16-10.3,16s-8.3,20-8.3,20s-5,19.3-5,19.3s-1.7,14.3-1.7,14.3s2.3,11.3,2.3,11.3s9.3,10,9.3,10s7,2.7,7,2.7s10.3-7,10.3-7s8.3-9,8.3-9s6.3-10.3,6.3-10.3s2-11.3,2-11.3s-3.7-10-3.7-10s-9.3-9-9.3-9s-12.7-6-12.7-6s-15-2-15-2s-14.3,1.7-14.3,1.7s-13,5.3-13,5.3s-11,9.7-11,9.7s-8.7,14.3-8.7,14.3s-5.3,18.3-5.3,18.3s-2,19-2,19s1,13.3,1,13.3s5.7,10,5.7,10s8.7,6.3,8.7,6.3s12,2,12,2s11.7-3.3,11.7-3.3s10.7-8.3,10.7-8.3s9.3-12,9.3-12s7-15,7-15s3.7-16,3.7-16s-1.3-13.7-1.3-13.7s-7.3-11.7-7.3-11.7s-11.3-8-11.3-8s-14.3-4.3-14.3-4.3s-15.3-0.3-15.3-0.3s-14.3,4-14.3,4s-12.7,8.7-12.7,8.7s-10,13-10,13s-6.7,16-6.7,16s-3,16-3,16s0.3,13.7,0.3,13.7s4,10.7,4,10.7s8.3,8,8.3,8s10.7,5.3,10.7,5.3s12,2.3,12,2.3s11.7-1,11.7-1s10.7-4.7,10.7-4.7s9.3-8.3,9.3-8.3s7.3-11,7.3-11s5-12.7,5-12.7s2-13.3,2-13.3s-2-12-2-12s-7-10.3-7-10.3s-10.7-7-10.7-7s-13.7-3-13.7-3s-15,1.7-15,1.7s-14,6.7-14,6.7s-12,11.7-12,11.7s-9.3,15.7-9.3,15.7s-6.7,18-6.7,18s-3.3,18.7-3.3,18.7s0.3,16.7,0.3,16.7s4.3,13.3,4.3,13.3s8.3,9,8.3,9s11.7,5,11.7,5s14,1,14,1s14.3-2,14.3-2s13.3-6,13.3-6s11.7-9,11.7-9s9.3-11.3,9.3-11.3s6.7-12.3,6.7-12.3s3.3-12,3.3-12s-0.3-10.7-0.3-10.7s-4.3-9.3-4.3-9.3s-8-6.7-8-6.7s-10.7-3.7-10.7-3.7s-12-0.3-12-0.3s-12.3,3.7-12.3,3.7s-11,7.3-11,7.3s-9,10.7-9,10.7s-6.3,13.3-6.3,13.3s-3.7,14-3.7,14s-0.7,13.3-0.7,13.3s2.3,11.3,2.3,11.3s6.3,9,6.3,9s9,6,9,6s11.3,2.3,11.3,2.3s12-1,12-1s11-5,11-5s9-8.7,9-8.7s6.3-11.3,6.3-11.3s3.7-12.7,3.7-12.7s0.7-12.7,0.7-12.7s-3-11.3-3-11.3s-7.3-9.3-7.3-9.3s-10.3-6-10.3-6s-12-2-12-2s-12.3,2-12.3,2s-11.3,6.3-11.3,6.3s-9,10.3-9,10.3s-6.3,13-6.3,13s-3.3,14-3.3,14s-0.3,13.3-0.3,13.3s2.7,11,2.7,11s6.3,8.7,6.3,8.7s9.3,5.7,9.3,5.7s11.3,2,11.3,2s12-1,12-1s11-5.3,11-5.3s8.7-9,8.7-9s6-11.7,6-11.7s3-13.3,3-13.3s-0.3-12.7-0.3-12.7s-4-11-4-11s-8-8.7-8-8.7s-11-5.7-11-5.7s-12.7-2-12.7-2s-13.3,2.3-13.3,2.3s-12,6.7-12,6.7s-9.7,11-9.7,11s-7,14.3-7,14.3s-4,16.3-4,16.3s-0.7,16,0.3,16s4.3,12.7,4.3,12.7s8.3,8.7,8.3,8.7s11.7,5.3,11.7,5.3s13.7,1.7,13.7,1.7s14-2.3,14-2.3s12.3-7,12.3-7s10-10.7,10-10.7s7-13.3,7-13.3s3.7-14.7,3.7-14.7s-0.3-14.3-0.3-14.3s-5-12.3-5-12.3s-9-9.7-9-9.7s-12-6.3-12-6.3s-13.7-2.3-13.7-2.3s-13.7,2-13.7,2s-12,6.3-12,6.3s-9.3,10.7-9.3,10.7s-6.7,14-6.7,14s-3.3,16-3.3,16s-0.3,16.3,0.7,16.3s4.3,13,4.3,13s8.3,9,8.3,9s11.3,5.3,11.3,5.3s13.3,1.7,13.3,1.7s13.7-2.3,13.7-2.3s12.3-7,12.3-7s10-11,10-11s7.3-13.7,7.3-13.7s4-15.3,4-15.3s-0.3-14.7-0.3-14.7s-4.7-13-4.7-13s-9-10.7-9-10.7s-12.3-7.3-12.3-7.3s-14-3.3-14-3.3s-14,2-14,2s-12,6.3-12,6.3s-9,10.7-9,10.7s-6.3,14-6.3,14s-3,16-3,16s0.3,16,0.3,16s4,13.3,4,13.3s8,9.3,8,9.3s11,5.7,11,5.7s13,2,13,2s13.3-2,13.3-2s12-6.3,12-6.3s10-10,10-10s7.3-12.3,7.3-12.3s4-13.7,4-13.7s-0.3-13-0.3-13s-4.3-11.3-4.3-11.3s-8.3-9-8.3-9s-11.3-6-11.3-6s-13-2.3-13-2.3s-13.3,2-13.3,2s-12,6.3-12,6.3s-9.7,10.3-9.7,10.3s-6.7,13.7-6.7,13.7s-3.7,15.7-3.7,15.7s-0.3,14.7,0.7,14.7s4.3,11.7,4.3,11.7s8.3,8,8.3,8s11.3,4.3,11.3,4.3s13.3,0.7,13.3,0.7s13.3-3,13.3-3s11.7-8,11.7-8s9.3-11.3,9.3-11.3s6.3-13.7,6.3-13.7s3-14.7,3-14.7s-0.7-14.3-0.7-14.3s-4.7-12.3-4.7-12.3s-8.7-10-8.7-10s-11.7-6.7-11.7-6.7s-13.3-2.7-13.3-2.7s-13.3,2.7-13.3,2.7s-11.7,7.7-11.7,7.7s-9.3,12-9.3,12s-6.3,15.3-6.3,15.3s-3,17.3-3,17.3s0.3,17.3,1.3,17.3s5,14,5,14s8.7,9.7,8.7,9.7s11.7,6,11.7,6s13.3,2.3,13.3,2.3s13.7-1.7,13.7-1.7s12.3-6.3,12.3-6.3s10-10,10-10s7.3-12.7,7.3-12.7s4-14,4-14s-0.3-13.3-0.3-13.3s-4.7-11.7-4.7-11.7s-8.7-9.3-8.7-9.3s-11.7-6-11.7-6s-13.3-2-13.3-2s-13.7,2.3-13.7,2.3s-12,7-12,7s-9.3,11-9.3,11s-6.3,14.3-6.3,14.3s-3,16-3,16s0.3,16.3,1.3,16.3s5,13.3,5,13.3s8.7,9.3,8.7,9.3s11.7,5.7,11.7,5.7s13.3,1.7,13.3,1.7s13.7-2.3,13.7-2.3s12-7.3,12-7.3s9.7-11.3,9.7-11.3s6.7-14.3,6.7-14.3s3.3-16,3.3-16s-0.3-15.7-0.3-15.7s-4.7-13.7-4.7-13.7s-8.7-11-8.7-11s-11.7-7.3-11.7-7.3s-13.3-3-13.3-3s-13.7,2.3-13.7,2.3s-12,7-12,7s-9.3,11.3-9.3,11.3s-6.3,14.7-6.3,14.7s-3,16.7-3,16.7s0.3,16.7,1.3,16.7s5,13.7,5,13.7s8.7,10,8.7,10s11.7,6.3,11.7,6.3s13.3,2.3,13.3,2.3s13.7-2,13.7-2s12-6.7,12-6.7s9.7-10.7,9.7-10.7s6.7-13.7,6.7-13.7s3-15.3,3-15.3s-0.3-15-0.3-15s-4.7-13-4.7-13s-8.7-10-8.7-10s-11.7-6.3-11.7-6.3s-13.3-2.3-13.3-2.3Z"
          className="fill-gray-300 dark:fill-slate-700 stroke-gray-400 dark:stroke-slate-600"
          strokeWidth="0.5"
        />

        <g filter="url(#heatmap-blur)">
          {riskPoints.map((p) => (
            <circle
              key={p.id}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={getColorForLevel(p.level)}
              className="cursor-pointer transition-transform duration-200"
              style={{
                transform: hoveredRisk?.id === p.id ? "scale(1.3)" : "scale(1)",
                transformOrigin: `${p.cx}px ${p.cy}px`,
              }}
              onMouseEnter={() => setHoveredRisk(p)}
              onMouseLeave={() => setHoveredRisk(null)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

const FarmerDashboard: React.FC = () => {
  const [aiTips, setAiTips] = useState<string | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    const generateTips = async () => {
      setAiTips(null);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const languageName =
          LANGUAGES.find((l) => l.code === language)?.name || "English";
        const prompt = `Generate three concise, actionable biosecurity improvement tips for a small-to-medium scale pig and poultry farm in India. Focus on practical, low-cost measures. Format the response as a markdown list with bolded titles for each tip. IMPORTANT: Respond in ${languageName}.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [{ parts: [{ text: prompt }] }],
        });

        const markdownText = response.text
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/ \*/g, "<br/>*");

        setAiTips(markdownText);
      } catch (error) {
        console.error("AI recommendations error:", error);
        setAiTips(t("chatbotError"));
      }
    };
    generateTips();
  }, [language, t]);

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("biosecurityScore")}
          value={`${DUMMY_FARM_STATS.biosecurityScore}%`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          }
          color="bg-green-500"
        />
        <StatCard
          title={t("activeCriticalAlerts")}
          value={DUMMY_ALERTS.filter((a) => a.severity === "Critical").length}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
          color="bg-red-500"
        />
        <StatCard
          title={t("predictedRisk")}
          value={t("mediumRisk")}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="bg-yellow-500"
        />
        <StatCard
          title="Mortality Rate"
          value={`${DUMMY_FARM_STATS.mortalityRate}%`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          }
          color="bg-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Camera and AI Tips */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {t("aiMonitoring")}
            </h2>
            <div className="space-y-4">
              <CameraFeed
                title={t("henHouse")}
                status="ok"
                videoSrc="https://videos.pexels.com/video-files/8066518/8066518-hd_1920_1080_25fps.mp4"
              />
              <CameraFeed
                title={t("pigPen")}
                status="warning"
                videoSrc="https://videos.pexels.com/video-files/8473426/8473426-hd_1920_1080_25fps.mp4"
              />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 border-l-4 border-green-500">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                  {t("aiRecommendations")}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Powered by AI
                </p>
              </div>
            </div>

            {aiTips ? (
              <div className="space-y-3 sm:space-y-4">
                {aiTips
                  .split("<br/>")
                  .filter((tip) => tip.trim())
                  .map((tip, index) => {
                    // Remove leading asterisk and bullet points
                    let cleanTip = tip
                      .replace(/^\*\s*/, "")
                      .replace(/^-\s*/, "")
                      .trim();
                    if (!cleanTip) return null;

                    // Parse title and description - title ends at first period or colon after <strong>
                    const strongMatch = cleanTip.match(
                      /<strong>(.*?)<\/strong>/
                    );
                    let title = "";
                    let description = "";

                    if (strongMatch) {
                      title = strongMatch[1].trim();
                      // Get everything after the </strong> tag
                      description = cleanTip.split("</strong>")[1].trim();
                      // Remove leading colon, dash, or period
                      description = description.replace(/^[:\-\.]\s*/, "");
                    } else {
                      // If no strong tag, try to find a title pattern (capital letter followed by text)
                      const titleMatch = cleanTip.match(
                        /^([A-Z][^\.!?]*?)[\.\:]\s*(.+)/s
                      );
                      if (titleMatch) {
                        title = titleMatch[1].trim();
                        description = titleMatch[2].trim();
                      } else {
                        title = `Tip ${index + 1}`;
                        description = cleanTip;
                      }
                    }

                    // Remove any remaining HTML tags
                    description = description.replace(/<[^>]*>/g, "").trim();

                    return (
                      <div key={index} className="group">
                        <div className="flex gap-3 sm:gap-4 p-3 sm:p-5 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 shadow-sm hover:shadow-md transition-all duration-300">
                          {/* Simple Number Badge - No yellow dot */}
                          <div className="flex-shrink-0">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm">
                              {index + 1}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-green-700 dark:text-green-400 mb-1.5 sm:mb-2">
                              {title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {t("generatingTips")}
                </p>
                <div className="mt-4 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right column: Map and Alerts */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {t("regionalRisk")}
            </h2>
            <RegionalRiskMap />
            <div className="flex justify-center items-center space-x-4 mt-2 text-sm">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                Low
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
                Medium
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                High
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {t("recentAlerts")}
            </h2>
            <div className="space-y-4">
              {DUMMY_ALERTS.slice(0, 3).map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
