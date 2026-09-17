import { Link } from 'react-router-dom';
import {
  Radio,
  ShieldAlert,
  Link as LinkIcon,
  Brain,
  Leaf,
  BarChart3,
  FileCheck,
  Globe,
  Cpu,
  ArrowRight,
  Zap,
  Lock,
  EyeOff,
  TrendingUp,
} from 'lucide-react';

const problems = [
  {
    icon: EyeOff,
    title: 'Data Opacity in Environmental Reporting',
    description:
      'Organizations self-report environmental metrics with no independent verification, leading to greenwashing and stakeholder mistrust.',
  },
  {
    icon: Radio,
    title: 'No Real-Time Monitoring',
    description:
      'Traditional environmental audits are periodic snapshots, missing critical pollution events and compliance violations as they happen.',
  },
  {
    icon: ShieldAlert,
    title: 'Unverifiable Environmental Claims',
    description:
      'Without a tamper-proof record, there is no way to independently verify whether sustainability commitments are actually being met.',
  },
];

const steps = [
  {
    num: 1,
    icon: Radio,
    title: 'IoT Sensors Collect Data',
    description:
      'Networked environmental sensors continuously measure air quality, water purity, soil health, energy consumption, and emissions in real time.',
  },
  {
    num: 2,
    icon: LinkIcon,
    title: 'Blockchain Records & Verifies',
    description:
      'Every reading is hashed and recorded on-chain, creating an immutable, auditable trail that no single party can alter after the fact.',
  },
  {
    num: 3,
    icon: Brain,
    title: 'AI Analyzes & Recommends',
    description:
      'Machine-learning models detect anomalies, forecast trends, and generate actionable recommendations for reducing environmental impact.',
  },
  {
    num: 4,
    icon: Leaf,
    title: 'Green Index Scores Organizations',
    description:
      'A composite Green Index aggregates verified data into a transparent score that rates each organization\'s environmental performance.',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Real-Time Monitoring',
    description:
      'Live sensor feeds stream environmental metrics to dashboards so teams can respond to anomalies within seconds.',
  },
  {
    icon: Lock,
    title: 'Blockchain Verification',
    description:
      'Immutable on-chain records ensure every data point is tamper-proof and independently auditable by regulators and the public.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description:
      'Intelligent analysis surfaces hidden patterns, predicts risks, and recommends optimisation strategies automatically.',
  },
  {
    icon: BarChart3,
    title: 'ESG Reporting',
    description:
      'Automated ESG report generation aligned with global frameworks such as GRI, SASB, and TCFD for seamless compliance.',
  },
  {
    icon: FileCheck,
    title: 'Green Accounting',
    description:
      'Track environmental assets, liabilities, and carbon credits with the same rigour as financial accounting.',
  },
  {
    icon: Globe,
    title: 'Public Transparency',
    description:
      'Publicly accessible dashboards and verified proofs let anyone validate an organisation\'s environmental claims.',
  },
];

const techStack = [
  { icon: Cpu, label: 'IoT Sensors' },
  { icon: LinkIcon, label: 'Blockchain' },
  { icon: Brain, label: 'Artificial Intelligence' },
  { icon: TrendingUp, label: 'ESG Analytics' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-900/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-emerald-600" />
            <span className="text-xl font-bold text-emerald-900">EnviroChain</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32 bg-emerald-950">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-600">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/40 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-300/30 via-transparent to-transparent" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-emerald-100 backdrop-blur-sm">
            <Cpu className="h-4 w-4" />
            Powered by IoT + Blockchain + AI
          </span>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Environmental Monitoring &amp; Green Accounting on the{' '}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Blockchain
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-emerald-100/90 sm:text-xl">
            Real-Time Environmental Monitoring &amp; Green Accounting
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-800/30 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-emerald-700/40"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              The Environmental Transparency Crisis
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Current systems for tracking and reporting environmental impact are broken.
              Here is why a new approach is needed.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {problems.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                  <p.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-emerald-950 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">How EnviroChain Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-200/70">
              From raw sensor readings to verified environmental intelligence in four steps.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.num} className="relative rounded-2xl border border-emerald-800 bg-emerald-900/50 p-8 backdrop-blur">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <s.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-emerald-200/60">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Platform Capabilities</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
              Everything you need to monitor, verify, and report environmental performance on a single platform.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:border-emerald-300 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 transition group-hover:bg-emerald-100">
                  <f.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-y border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Technology Stack</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            EnviroChain integrates four core technologies into a unified environmental intelligence platform.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            {techStack.map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 shadow-sm">
                  <t.icon className="h-7 w-7 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 px-8 py-16 shadow-xl sm:px-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Start Your Environmental Intelligence Journey
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-emerald-100/80">
              Join EnviroChain to gain verified, real-time insights into your organisation's
              environmental impact.
            </p>
            <Link
              to="/register"
              className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-900">EnviroChain</span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Prototype / Demo
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/login" className="transition hover:text-emerald-600">
              Sign In
            </Link>
            <Link to="/register" className="transition hover:text-emerald-600">
              Register
            </Link>
            <span className="text-gray-300">|</span>
            <span>© {new Date().getFullYear()} EnviroChain</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
