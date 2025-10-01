import React from "react";
import { Link } from "react-router-dom";
import FarmGuardLogo from "../components/icons/FarmGuardLogo";
import { useTheme, useLanguage, Language, LANGUAGES } from "../AppContext";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const PublicNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 dark:bg-gray-900/80 dark:shadow-gray-700/50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FarmGuardLogo className="h-7 w-7 sm:h-8 sm:w-8 text-green-700" />
            <span className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t("farmGuard")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a
              href="#home"
              className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              {t("home")}
            </a>
            <a
              href="#features"
              className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              {t("features")}
            </a>
            <a
              href="#solutions"
              className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              {t("solutions")}
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              {t("aboutUs")}
            </a>
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent dark:bg-gray-800 border-0 rounded-md py-1 px-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-0 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>

            <Link
              to="/auth"
              className="px-4 lg:px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm lg:text-base"
            >
              {t("signIn")}
            </Link>
          </div>

          {/* Mobile Menu Button & Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <nav className="flex flex-col space-y-3">
              <a
                href="#home"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 py-2 transition-colors"
              >
                {t("home")}
              </a>
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 py-2 transition-colors"
              >
                {t("features")}
              </a>
              <a
                href="#solutions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 py-2 transition-colors"
              >
                {t("solutions")}
              </a>
              <a
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 py-2 transition-colors"
              >
                {t("aboutUs")}
              </a>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                {t("signIn")}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <section id="home" className="relative pt-12 sm:pt-16 pb-16 sm:pb-24">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1560015439-741718502646?q=80&w=1920)`,
          }}
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 text-center relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight">
          {t("heroTitle")}
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
          {t("heroSubtitle")}
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-x-6 sm:gap-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <CheckIcon />
            <span>{t("feature1")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon />
            <span>{t("feature2")}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon />
            <span>{t("feature3")}</span>
          </div>
        </div>
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
          <Link
            to="/auth?action=signup"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg text-center"
          >
            {t("getStarted")}
          </Link>
          <Link
            to="/auth"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-transform transform hover:scale-105 border border-gray-300 dark:border-gray-600 shadow-lg text-center"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </section>
  );
};
const PortalCard = ({
  icon,
  titleKey,
  descriptionKey,
  color,
  link,
}: {
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
  color: string;
  link: string;
}) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:shadow-xl dark:hover:shadow-gray-700/50 transition-shadow duration-300">
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4 sm:mt-6">
        {t(titleKey)}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 flex-grow">
        {t(descriptionKey)}
      </p>
      <Link
        to={link}
        className={`mt-6 sm:mt-8 w-full py-2.5 sm:py-3 font-semibold text-white text-sm sm:text-base rounded-lg transition-colors duration-300 ${color} hover:opacity-90`}
      >
        {t("accessPortal")} &rarr;
      </Link>
    </div>
  );
};

const PortalsSection = () => {
  const { t } = useLanguage();
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-100 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 px-4">
          {t("unifiedPlatform")}
        </h2>
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          <PortalCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            }
            titleKey="farmerPortal"
            descriptionKey="farmerPortalDesc"
            color="bg-green-500"
            link="/auth"
          />
          <PortalCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
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
            titleKey="consumerPortal"
            descriptionKey="consumerPortalDesc"
            color="bg-yellow-500"
            link="/auth"
          />
          <PortalCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            titleKey="govtDashboard"
            descriptionKey="govtDashboardDesc"
            color="bg-blue-500"
            link="/auth"
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon,
  titleKey,
  descriptionKey,
}: {
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
}) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className="p-2.5 sm:p-3 bg-green-100 dark:bg-green-900/50 rounded-full flex-shrink-0">
          {icon}
        </div>
        <h3 className="ml-3 sm:ml-4 text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
          {t(titleKey)}
        </h3>
      </div>
      <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
        {t(descriptionKey)}
      </p>
    </div>
  );
};

const FeaturesSection = () => {
  const { t } = useLanguage();
  return (
    <section
      id="features"
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 px-4">
          {t("featuresTitle")}
        </h2>
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            }
            titleKey="feature1Title"
            descriptionKey="feature1Desc"
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            }
            titleKey="feature2Title"
            descriptionKey="feature2Desc"
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
            titleKey="feature3Title"
            descriptionKey="feature3Desc"
          />
        </div>
      </div>
    </section>
  );
};

const SolutionsSection = () => {
  const { t } = useLanguage();
  return (
    <section
      id="solutions"
      className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 px-4">
          {t("solutionsTitle")}
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
          Empowering stakeholders with AI-driven insights for healthier
          livestock and safer food products.
        </p>
        <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-12">
          {/* Farmer Solution */}
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 p-5 sm:p-8 rounded-2xl">
            <div className="md:w-1/2">
              <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
                For Farmers
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-3 sm:mb-4">
                {t("solutionFarmerTitle")}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {t("solutionFarmerDesc")}
              </p>
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                <span className="px-2.5 sm:px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs sm:text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                  AI Monitoring
                </span>
                <span className="px-2.5 sm:px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs sm:text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                  Biosecurity Checklists
                </span>
                <span className="px-2.5 sm:px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs sm:text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                  Community Support
                </span>
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="relative group overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop"
                  alt="Farmer using technology on farm"
                  className="w-full h-60 sm:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          {/* Government Solution */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-6 sm:gap-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-5 sm:p-8 rounded-2xl">
            <div className="md:w-1/2">
              <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
                For Government
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
                {t("solutionGovtTitle")}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {t("solutionGovtDesc")}
              </p>
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                <span className="px-2.5 sm:px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs sm:text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                  Regional Analytics
                </span>
                <span className="px-2.5 sm:px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs sm:text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                  Compliance Tracking
                </span>
                <span className="px-2.5 sm:px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-xs sm:text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                  Policy Insights
                </span>
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="relative group overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
                  alt="Government data analysis and monitoring"
                  className="w-full h-60 sm:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const { t } = useLanguage();
  return (
    <section
      id="about"
      className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 px-4">
          {t("aboutTitle")}
        </h2>
        <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">
          {t("aboutDesc")}
        </p>
      </div>
    </section>
  );
};

const PublicFooter = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-gray-800 text-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <FarmGuardLogo className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />
              <span className="text-xl sm:text-2xl font-bold">
                {t("farmGuard")}
              </span>
            </div>
            <p className="mt-3 sm:mt-4 text-gray-400 text-xs sm:text-sm">
              {t("footerSlogan")}
            </p>
          </div>
          <div>
            <h4 className="font-bold tracking-wider uppercase text-sm sm:text-base">
              {t("quickLinks")}
            </h4>
            <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white">
                  {t("home")}
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-white">
                  {t("features")}
                </a>
              </li>
              <li>
                <a href="#solutions" className="text-gray-400 hover:text-white">
                  {t("solutions")}
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white">
                  {t("aboutUs")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold tracking-wider uppercase text-sm sm:text-base">
              {t("resources")}
            </h4>
            <ul className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  {t("documentation")}
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  {t("apiReference")}
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  {t("support")}
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  {t("privacyPolicy")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold tracking-wider uppercase text-sm sm:text-base">
              {t("contactUs")}
            </h4>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-center space-x-2 text-gray-400">
                <span>📧</span>
                <span className="break-all">support@farmguard.gov.in</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <span>📞</span>
                <span>1800-123-FARM</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <span>📍</span>
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 dark:bg-black/50 py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <p>{t("footerRights")}</p>
          <a href="/" className="hover:text-white">
            {t("termsOfService")}
          </a>
        </div>
      </div>
    </footer>
  );
};

const HomePage: React.FC = () => {
  return (
    <>
      <PublicNavbar />
      <main>
        <HeroSection />
        <PortalsSection />
        <FeaturesSection />
        <SolutionsSection />
        <AboutSection />
      </main>
      <PublicFooter />
    </>
  );
};

export default HomePage;
