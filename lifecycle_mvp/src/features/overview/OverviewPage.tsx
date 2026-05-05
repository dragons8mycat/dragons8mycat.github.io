import { Link } from "react-router-dom";
import { fixtureRepository } from "@/data/repository";
import { getDatasetsNeedingClassification, getVisibleDatasets, scoreGapDatasets } from "@/lib/catalogue";

const entryPoints = [
  {
    title: "Sales",
    to: "/sales",
    eyebrow: "Client conversations",
    description:
      "Start with the lifecycle touchpoint view to answer what data is used at each stage and how it supports the conversation.",
  },
  {
    title: "Data",
    to: "/data",
    eyebrow: "Catalogue stewardship",
    description:
      "Browse the governed catalogue, improve records in edit mode, and commit cleaner lifecycle metadata with less clutter.",
  },
  {
    title: "Leadership",
    to: "/leadership",
    eyebrow: "Portfolio insight",
    description:
      "Review strategic gaps, prioritise desired data candidates, and understand where lifecycle coverage remains weak.",
  },
];

export function OverviewPage() {
  const datasets = getVisibleDatasets(fixtureRepository.getDatasets(), "sales");
  const gapDatasets = scoreGapDatasets(datasets);
  const needsClassification = getDatasetsNeedingClassification(datasets);
  const projectTypes = fixtureRepository.getProjectTypes();

  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="panel p-8">
          <p className="eyebrow">Overview</p>
          <h2 className="mt-3 text-3xl font-extrabold text-brand-heading">Geospatial data lifecycle catalogue</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            This MVP helps teams understand which geospatial datasets matter at each stage of a project lifecycle,
            where the governed catalogue is strong, and where new data should be proposed and curated.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">What it answers</p>
              <p className="mt-3 text-lg font-bold text-brand-heading">
                What data is used at each stage, how it is used, and where the gaps remain.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Important rule</p>
              <p className="mt-3 text-lg font-bold text-brand-heading">
                Client-specific datasets stay out of normal user-facing views by default.
              </p>
            </div>
          </div>
        </article>

        <article className="panel p-8">
          <p className="eyebrow">Current snapshot</p>
          <div className="mt-4 grid gap-4">
            <div className="rounded-3xl border border-brand-grey bg-white p-5">
              <p className="text-sm text-slate-500">Governed and visible datasets</p>
              <p className="mt-2 text-4xl font-extrabold text-brand-heading">{datasets.length}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-brand-grey bg-white p-5">
                <p className="text-sm text-slate-500">Desired / gap datasets</p>
                <p className="mt-2 text-3xl font-extrabold text-brand-heading">{gapDatasets.length}</p>
              </div>
              <div className="rounded-3xl border border-brand-grey bg-white p-5">
                <p className="text-sm text-slate-500">Needs classification</p>
                <p className="mt-2 text-3xl font-extrabold text-brand-heading">{needsClassification.length}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-brand-grey bg-white p-5">
              <p className="text-sm text-slate-500">Project lifecycle templates covered</p>
              <p className="mt-2 text-3xl font-extrabold text-brand-heading">{projectTypes.length}</p>
            </div>
          </div>
        </article>
      </section>

      <section>
        <div className="mb-4">
          <p className="eyebrow">Choose a journey</p>
          <h3 className="mt-2 text-2xl font-extrabold text-brand-heading">Open the view that matches the user</h3>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {entryPoints.map((entryPoint) => (
            <Link
              key={entryPoint.to}
              to={entryPoint.to}
              className="panel group p-6 transition hover:-translate-y-0.5 hover:border-brand-sky hover:shadow-lg"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">{entryPoint.eyebrow}</p>
              <h4 className="mt-3 text-2xl font-extrabold text-brand-heading group-hover:text-brand-blue">
                {entryPoint.title}
              </h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">{entryPoint.description}</p>
              <span className="mt-6 inline-flex rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white">
                Open {entryPoint.title} view
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
