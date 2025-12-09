import React from "react";
import { motion } from "framer-motion";

const PakistanInsights: React.FC = () => {
  // Terminals comparison data
  const columns = ["KICT", "KGTL", "SAPT", "QICT"] as const;
  const columnAccents: Record<(typeof columns)[number], string> = {
    KICT: "bg-blue-500",
    KGTL: "bg-emerald-500",
    SAPT: "bg-violet-500",
    QICT: "bg-amber-500",
  };
  const rows = [
    {
      label: "Ownership",
      values: [
        "Hutchinson Whampoa",
        "AD Port",
        "Hutchinson Whampoa",
        "DP World",
      ],
    },
    {
      label: "Location",
      values: [
        "KPT West Wharf",
        "KPT East Wharf",
        "Karachi City",
        "50 Km from Karachi City",
      ],
    },
    {
      label: "Permissible Draft",
      values: ["13.5 M", "13 M", "16 M", "12.0 M TO 13 M"],
    },
    {
      label: "Loading Per GC",
      values: ["20~22", "22~24", "20~24", "22~24"],
    },
    {
      label: "Discharging per GC",
      values: ["20~22", "22~24", "20~24", "22~24"],
    },
    { label: "No. of Berths", values: ["3", "4", "4", "5"] },
    {
      label: "Length of Berth",
      values: ["321 M", "160 M", "370 M", "200 M"],
    },
    { label: "Gantry Crane", values: ["11", "6", "14", "11"] },
    { label: "Mobile Crane", values: ["2", "2", "nil", "nil"] },
  ] as const;

  return (
    <div className="bg-slate-50">
      {/* Redesigned Hero: split layout with featured image card */}
      <header className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm">
              INSIGHTS
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Pakistan — Opportunity at the Crossroads of Trade
            </h1>

            <p className="text-slate-600 max-w-xl">
              A concise briefing on Pakistan’s strategic logistics strengths,
              trade corridors, and infrastructure initiatives that shape
              regional connectivity and business opportunities.
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <a
                href="#overview"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm text-sm"
              >
                Explore Insights
              </a>
              <a
                href="#terminals"
                className="inline-flex items-center border border-slate-300 hover:bg-white/60 text-slate-700 px-4 py-2 rounded-md shadow-sm text-sm bg-white"
              >
                Terminals Table
              </a>

              <div className="hidden sm:flex gap-3">
                <div className="text-sm text-slate-500">•</div>
                <div className="text-sm text-slate-700">
                  Gwadar · Karachi · CPEC
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3 flex-wrap">
              <div className="px-3 py-2 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-slate-400">Population</div>
                <div className="font-semibold">241M+</div>
              </div>
              <div className="px-3 py-2 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-slate-400">Imports</div>
                <div className="font-semibold">~USD 36B</div>
              </div>
              <div className="px-3 py-2 bg-white rounded-lg shadow-sm">
                <div className="text-xs text-slate-400">Coastline</div>
                <div className="font-semibold">1,046 km</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="relative flex justify-center md:justify-end"
          >
            {/* Decorative layered image card using /images/p1.jpeg */}
            <div className="relative w-full max-w-md">
              <div className="absolute -left-6 -top-6 w-full h-full rounded-3xl bg-gradient-to-tr from-blue-50 to-white shadow-lg transform rotate-3" />

              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/p1.png"
                  alt="Pakistan infrastructure and coast"
                  className="w-full h-72 object-cover sm:h-80 md:h-96"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-90" />

                <div className="absolute left-4 bottom-4 text-white">
                  <div className="text-sm font-semibold">Pakistan</div>
                  <div className="text-xs opacity-90">
                    Strategic ports & corridors
                  </div>
                </div>
              </div>

              {/* small floating card
              <div className="absolute -right-8 -bottom-8 w-40 bg-white rounded-xl p-3 shadow-md">
                <div className="text-xs text-slate-400">Port Throughput</div>
                <div className="font-bold">Growth +18% YoY</div>
              </div> */}
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-16">
        {/* Feature grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-6 mb-8">
          {[
            { title: "Ports & Terminals", desc: "SAPT, Gwadar, QICT, KICT" },
            { title: "Corridors", desc: "CPEC, north-south road, rail links" },
            { title: "Resources", desc: "Minerals, agriculture, textiles" },
            {
              title: "Opportunities",
              desc: "Logistics, manufacturing, energy",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="text-sm text-slate-500">{f.title}</div>
              <div className="mt-2 font-semibold text-slate-900">{f.desc}</div>
            </motion.div>
          ))}
        </section>

        <div id="overview" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Overview of Pakistan
            </h2>

            <div className="prose prose-sm md:prose-base text-slate-700 max-w-none">
              {/* Lead section with subtle card + dropcap */}
              <div className="not-prose rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/60 to-white p-4">
                <p className="m-0 first-letter:text-3xl md:first-letter:text-4xl first-letter:font-extrabold first-letter:text-blue-700 first-letter:mr-1 first-letter:leading-none">
                  Pakistan is strategically located in South Asia, sharing
                  borders with Iran, Afghanistan, China, and India. It shares a
                  1,046-kilometer long coastline along the Arabian Sea,
                  providing direct access to global trade routes, including
                  South Asia, Central Asia, and the Middle East. The capital
                  city is Islamabad, and the country is divided into four
                  provinces — Punjab, Sindh, Khyber Pakhtunkhwa, and
                  Balochistan.
                </p>
              </div>

              {/* Quick facts & provinces chips */}
              <div className="not-prose mt-3 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                  Capital: Islamabad
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                  Coastline: 1,046 km
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                  Provinces: 4
                </span>
              </div>
              <div className="not-prose mt-2 flex flex-wrap gap-2">
                {["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan"].map(
                  (p) => (
                    <span
                      key={p}
                      className="px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs shadow-sm"
                    >
                      {p}
                    </span>
                  )
                )}
              </div>

              <p>
                With a population exceeding 241 million, Pakistan represents one
                of the world’s largest consumer markets and has a growing,
                young, and dynamic workforce. The national economy is diverse,
                supported by agriculture, manufacturing, services, and trade,
                contributing to a GDP growth rate of around 3.5%. The Pakistani
                Rupee (PKR) is the official currency.
              </p>

              <p>
                Pakistan’s major exports include textiles, cotton yarn, rice,
                maize, seafood, leather goods, sports equipment, with the
                textile sector alone accounting for nearly 60% of total exports.
                Key import items include petroleum products, industrial
                machinery, vehicles, electronics, and raw materials, reflecting
                the country’s growing industrial and consumer demand. The total
                export value stands at approximately USD 32 billion, while
                imports amount to around USD 56 billion, indicating a trade
                deficit but also strong import-driven economic activity.
              </p>
              {/* Export categories */}
              <div className="not-prose mt-2 flex flex-wrap gap-2">
                {[
                  "Textiles",
                  "Cotton yarn",
                  "Rice",
                  "Maize",
                  "Seafood",
                  "Leather goods",
                  "Sports equipment",
                ].map((i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-100"
                  >
                    {i}
                  </span>
                ))}
              </div>
              <div className="not-prose mt-2 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-100">
                  Exports ≈ USD 32B
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs border border-rose-100">
                  Imports ≈ USD 56B
                </span>
              </div>

              <p>
                The country’s economic strengths lie in its strategic location,
                abundant natural resources, and large domestic market. Pakistan
                is rich in coal, gas, copper, gold, limestone, chromite, and
                rock salt reserves, providing a solid foundation for industrial
                development. The agriculture sector remains a major contributor,
                that support both domestic consumption and exports.
              </p>
              {/* Resources chips */}
              <div className="not-prose mt-2 flex flex-wrap gap-2">
                {[
                  "Coal",
                  "Gas",
                  "Copper",
                  "Gold",
                  "Limestone",
                  "Chromite",
                  "Rock salt",
                ].map((r) => (
                  <span
                    key={r}
                    className="px-3 py-1 rounded-md bg-white text-slate-700 text-xs border border-slate-200 shadow-sm"
                  >
                    {r}
                  </span>
                ))}
              </div>

              {/* CPEC callout */}
              <div className="not-prose mt-4 rounded-xl border-l-4 border-blue-600 bg-blue-50/60 p-4">
                <p className="m-0">
                  Recent infrastructure developments under the China–Pakistan
                  Economic Corridor (CPEC) have further enhanced the country’s
                  connectivity, energy capacity, and trade potential. These
                  projects aim to transform Pakistan into a regional logistics
                  and transportation hub by linking its ports — particularly
                  Gwadar Port — with Western China and Central Asia.
                </p>
              </div>

              <p>
                Despite challenges such as trade imbalances and infrastructure
                constraints, Pakistan’s economy holds significant potential for
                growth, particularly in manufacturing, logistics, IT services,
                renewable energy, and value-added exports. With an expanding
                industrial base, improving transport infrastructure, and an
                increasingly skilled workforce, Pakistan continues to emerge as
                a key player in regional trade and investment.
              </p>
            </div>
          </article>

          <aside className="space-y-6">
            {/* Large image card 1: Karachi Port Cluster (p2) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100"
            >
              <img
                src="/images/p2.jpeg"
                alt="Karachi Port Cluster"
                className="w-full h-56 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-md bg-white/90 text-[10px] font-semibold text-slate-900 shadow">
                  Featured
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-lg font-bold drop-shadow">
                  Karachi Port Cluster
                </div>
                <div className="text-xs opacity-90">
                  KICT · KGTL · SAPT · QICT
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href="#terminals"
                    className="inline-flex px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs shadow"
                  >
                    Terminals
                  </a>
                  <a
                    href="#overview"
                    className="inline-flex px-3 py-1.5 rounded-md bg-white/90 hover:bg-white text-slate-900 text-xs shadow"
                  >
                    Overview
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Large image card 2: Harbor Operations (p3) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100"
            >
              <img
                src="/images/p3.png"
                alt="Harbor Operations"
                className="w-full h-56 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-lg font-bold drop-shadow">
                  Harbor Operations
                </div>
                <div className="text-xs opacity-90">
                  Berths, cranes & yard throughput
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Berths", "Crane ops", "Yard"].map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded-md bg-white/90 text-slate-900 text-[11px] shadow"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Large image card 3: Coastal Logistics Corridor (p4) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100"
            >
              <img
                src="/images/p4.jpg"
                alt="Coastal Logistics Corridor"
                className="w-full h-56 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-lg font-bold drop-shadow">
                  Coastal Logistics Corridor
                </div>
                <div className="text-xs opacity-90">
                  Gwadar – Karachi connectivity
                </div>
                <div className="mt-3 flex gap-2">
                  {["Road", "Rail", "Sea"].map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded-md bg-white/90 text-slate-900 text-[11px] shadow"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stat cards to finish the column visually */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-sm">
                <div className="text-[10px] uppercase tracking-wide text-slate-400">
                  GDP Growth
                </div>
                <div className="text-lg font-bold text-slate-900">~3.5%</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-sm">
                <div className="text-[10px] uppercase tracking-wide text-slate-400">
                  Ports
                </div>
                <div className="text-lg font-bold text-slate-900">
                  Karachi · Gwadar
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-sm">
                <div className="text-[10px] uppercase tracking-wide text-slate-400">
                  Exports
                </div>
                <div className="text-lg font-bold text-slate-900">~USD 32B</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-sm">
                <div className="text-[10px] uppercase tracking-wide text-slate-400">
                  Workforce
                </div>
                <div className="text-lg font-bold text-slate-900">
                  Young & Growing
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Terminals comparison table */}
        <motion.section
          id="terminals"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-slate-900">
              Terminals comparison
            </h3>
            <p className="text-sm text-slate-600">KICT · KGTL · SAPT · QICT</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {columns.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${columnAccents[c]}`}
                  />
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-sm min-w-[880px]">
              <thead className="bg-slate-100/80 backdrop-blur supports-[backdrop-filter]:bg-slate-100/60 sticky top-0 z-10">
                <tr className="text-left text-slate-700">
                  <th className="py-3 pr-4 pl-4 font-semibold text-xs uppercase tracking-wide sticky left-0 z-20 bg-slate-100/80">
                    Particulars
                  </th>
                  {columns.map((c) => (
                    <th
                      key={c}
                      className="py-3 px-3 font-semibold text-xs uppercase tracking-wide"
                    >
                      <div>{c}</div>
                      <div
                        className={`mt-2 h-1.5 rounded-full ${columnAccents[c]}`}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, idx) => {
                  const rowBg = idx % 2 === 0 ? "bg-slate-50/50" : "bg-white";
                  return (
                    <tr
                      key={row.label}
                      className={`hover:bg-blue-50/50 transition-colors ${rowBg} divide-x divide-slate-100`}
                    >
                      <th
                        scope="row"
                        className={`py-3 pr-4 pl-4 text-slate-900 font-semibold whitespace-nowrap align-top sticky left-0 z-10 ${rowBg}`}
                      >
                        {row.label}
                      </th>
                      {row.values.map((v, i) => (
                        <td
                          key={i}
                          className="py-3 px-3 text-slate-700 align-top"
                        >
                          {typeof v === "string" &&
                          v.toLowerCase() === "nil" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                              nil
                            </span>
                          ) : (
                            v
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* CTA band
        <section className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold">
              Want a tailored logistics brief?
            </h4>
            <p className="text-sm opacity-90">
              Contact our team for port-specific analysis and route
              optimization.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium"
              href="#contact"
            >
              Get in touch
            </a>
            <a
              className="border border-white px-4 py-2 rounded-md"
              href="#reports"
            >
              Download report
            </a>
          </div>
        </section> */}
      </main>
    </div>
  );
};

export default PakistanInsights;
