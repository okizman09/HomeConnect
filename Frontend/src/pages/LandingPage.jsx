import React from "react";
import {
  Search,
  Home,
  ShieldCheck,
  Bot,
  FileText,
  Wrench,
  Bell,
  BadgeCheck,
  CheckCircle,
} from "lucide-react";
import logo from "../assets/logo.png";

const tenantPoints = [
  "Browse verified listings with clear prices and locations",
  "Filter homes by price range, property type, and area",
  "Save favourites and pick up where you left off",
  "Chat directly with landlords in real time",
];

const landlordPoints = [
  "Post properties in minutes with photo uploads",
  "AI checks every photo so listings stay trustworthy",
  "Get instant alerts and emails when tenants message you",
  "Track maintenance requests sorted by urgency",
];

const aiFeatures = [
  {
    icon: ShieldCheck,
    title: "Photo verification",
    text: "Every listing photo is checked to confirm it shows a real property, not a selfie or a blurry shot.",
  },
  {
    icon: Bot,
    title: "24/7 chat assistant",
    text: "Tenants get instant answers about renting, drawn from the platform's tenant handbook.",
  },
  {
    icon: Wrench,
    title: "Maintenance triage",
    text: "Repair requests are classified by category and urgency so landlords fix what matters first.",
  },
  {
    icon: FileText,
    title: "Lease review",
    text: "Upload a lease PDF and the AI pulls out the rent, duration, deposit, and risky clauses.",
  },
];

const steps = [
  {
    n: "1",
    title: "Create your account",
    text: "Sign up in under a minute as a tenant or a landlord.",
  },
  {
    n: "2",
    title: "Connect and chat",
    text: "Tenants browse and message landlords directly; landlords respond in real time.",
  },
  {
    n: "3",
    title: "Move in and manage",
    text: "Agree terms, then handle maintenance and documents inside the app.",
  },
];

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Top bar */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <img src={logo} alt="HomeConnect Logo" className="h-12 w-auto object-contain" />
        <button
          onClick={() => onNavigate("login")}
          className="text-indigo-700 font-semibold px-5 py-2 rounded-lg hover:bg-white transition"
        >
          Sign In
        </button>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto pt-10 pb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find a home you can trust
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            HomeConnect brings landlords and tenants together in one place: verified
            listings, direct messaging, and AI tools that make renting transparent
            for everyone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => onNavigate("register")}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 shadow-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 shadow-lg border-2 border-indigo-600"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* For tenants / landlords */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-14">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-5">
              <Search className="w-8 h-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">For Tenants</h2>
            </div>
            <ul className="space-y-3">
              {tenantPoints.map((point) => (
                <li key={point} className="flex items-start text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-5">
              <Home className="w-8 h-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">For Landlords</h2>
            </div>
            <ul className="space-y-3">
              {landlordPoints.map((point) => (
                <li key={point} className="flex items-start text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI features */}
        <div className="max-w-5xl mx-auto mb-14">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Built-in AI assistance</h2>
            <p className="text-gray-600">
              Practical tools that remove guesswork from renting.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {aiFeatures.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white p-6 rounded-xl shadow-md flex">
                <Icon className="w-10 h-10 text-indigo-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-5xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.n} className="text-center px-4">
                <div className="w-12 h-12 bg-indigo-600 text-white text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.n}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust + messaging strip */}
        <div className="max-w-5xl mx-auto mb-14 bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center md:w-1/2">
            <BadgeCheck className="w-10 h-10 text-indigo-600 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Secure by design</h3>
              <p className="text-gray-600">
                Protected accounts, role-based dashboards, and verified listing content.
              </p>
            </div>
          </div>
          <div className="flex items-center md:w-1/2">
            <Bell className="w-10 h-10 text-indigo-600 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Never miss a message</h3>
              <p className="text-gray-600">
                Real-time chat with instant alerts plus email notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Ready to find your next home?
          </h2>
          <p className="text-gray-600 mb-6">
            Join landlords and tenants already connecting on HomeConnect.
          </p>
          <button
            onClick={() => onNavigate("register")}
            className="bg-indigo-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 shadow-lg"
          >
            Create Free Account
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-16">
          HomeConnect — connecting landlords and tenants.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
