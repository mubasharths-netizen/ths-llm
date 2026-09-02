import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThsMark } from "@/components/ui/logo";
import { THS_ORG } from "@/lib/ths-org";

export const metadata = { title: "About" };

const stats = [
  ["300+", "Students in our schools"],
  ["500+", "FEHM cases supported since 2018"],
  ["~50M PKR", "Invested under FEHM"],
  ["2016", "Year our journey began"],
];

const enrollment = [
  ["2016", "25"],
  ["2017", "120"],
  ["2018", "145"],
  ["2019", "180"],
  ["2020", "185"],
  ["2021", "203"],
  ["2022", "250"],
  ["2023", "275"],
  ["2024", "300+"],
];

export default function AboutPage() {
  return (
    <div className="marketing-wrap py-16">
      <ThsMark size="lg" />
      <p className="mt-6 text-sm font-medium tracking-[0.12em] text-text-muted uppercase">{THS_ORG.short}</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">About Taleem-o-Hunar Society</h1>
      <p className="mt-4 max-w-3xl text-text-secondary leading-7">
        A non-profit, non-commercial, non-political welfare organization focused on education and skill
        development — registered, certified, and community-led. THS LAB LMS is the IT learning platform of
        this society.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/contact">Get in touch</Button>
        <Button href={THS_ORG.site} variant="secondary">
          Official website
        </Button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <Card key={label}>
            <p className="text-2xl font-semibold text-primary">{value}</p>
            <p className="mt-1 text-sm text-text-secondary">{label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12 space-y-8">
        <section>
          <h2 className="text-[28px] font-semibold tracking-tight">Our story</h2>
          <p className="mt-3 max-w-3xl text-text-secondary leading-7">
            We started in 2016 to bring street children to school — beginning with 25 students. Today more
            than 300 students are enrolled. Education alone was not enough without food and shelter, so we
            launched the <strong>FEHM</strong> program: financial support, employment and small business,
            healthcare, and marriage support for families below the poverty line.
          </p>
          <p className="mt-3 max-w-3xl text-text-secondary leading-7">
            As students moved to higher classes, we built the <strong>Empowerment Center</strong> for skill
            development so men and women can earn respectfully. We also run an IT skill center in Lahore,
            a stitching training center for girls, and a study hall / library for high school students who
            live in crowded single-room homes.
          </p>
        </section>

        <section>
          <h2 className="text-[28px] font-semibold tracking-tight">Who we are</h2>
          <p className="mt-3 max-w-3xl text-text-secondary leading-7">
            THS was started by a group of friends (professionals) in 2016. Colleagues, university and college
            friends, family members, and others in our social circle have joined along the way. In short, we
            and our families are running this society — with gratitude for partners who supply shoes, milk,
            and more.
          </p>
        </section>

        <section>
          <h2 className="text-[28px] font-semibold tracking-tight">How we operate</h2>
          <p className="mt-3 max-w-3xl text-text-secondary leading-7">
            We run our own primary section with 180+ students and partner with three local schools nearby.
            Most students are enrolled, sponsored, and supervised by us. We take part in school policy,
            academic, and operational matters through our permanent office at school.
          </p>
          <p className="mt-3 max-w-3xl text-text-secondary leading-7">
            Every class 7 and above student receives Rs. 100/day for attending school — to discourage child
            labor.
          </p>
        </section>

        <section>
          <h2 className="text-[28px] font-semibold tracking-tight">How we enroll students</h2>
          <ul className="mt-3 max-w-3xl list-disc space-y-1 pl-5 text-text-secondary">
            <li>
              <strong>P1</strong> — Orphans (walk-in throughout the year)
            </li>
            <li>
              <strong>P2</strong> — Single parent
            </li>
            <li>
              <strong>P3</strong> — Disability in parent(s)
            </li>
            <li>
              <strong>P4</strong> — Child doing labor
            </li>
            <li>
              <strong>P5–P7</strong> — All others based on financial situation (if one seat per family,
              daughters are enrolled first)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[28px] font-semibold tracking-tight">Center of Modern Education & IT</h2>
          <p className="mt-3 max-w-3xl text-text-secondary leading-7">
            We run a program covering programming, design, e-commerce, and modern tools at{" "}
            <strong>{THS_ORG.subOfficeName}</strong>, {THS_ORG.subOffice} The institution educates over 400
            children, with more than 100 in the hostel; most come from underprivileged backgrounds. This
            helps students pursue dignified careers and break dependence on donations.
          </p>
        </section>

        <section>
          <h2 className="text-[28px] font-semibold tracking-tight">FEHM program</h2>
          <p className="mt-1 text-sm text-text-muted">Financial · Employment · Healthcare · Marriage</p>
          <p className="mt-3 max-w-3xl text-text-secondary leading-7">
            Access to school is not enough when families lack food and stability. FEHM supports students’
            families so children can remain in school. We have served more than 500 cases and spent
            approximately 50 million PKR under FEHM since 2018.
          </p>
        </section>

        <section>
          <h2 className="text-[28px] font-semibold tracking-tight">Empowerment Center (Jathol)</h2>
          <p className="mt-3 max-w-3xl text-text-secondary leading-7">
            THS purchased land (7 marlas) and built an Empowerment Center — now about 90% complete. It
            includes:
          </p>
          <ul className="mt-3 max-w-3xl list-disc space-y-1 pl-5 text-text-secondary">
            <li>
              <strong>Tailoring training</strong> — training underprivileged women and helping them sell
              products.
            </li>
            <li>
              <strong>IT labs for teenagers</strong> — inaugurated October 2024; 15+ students, for youth who
              leave school early to earn for their families.
            </li>
            <li>
              <strong>Study hall & library</strong> — inaugurated June 2024; a quiet place for high school
              students from crowded homes facing load shedding and water shortages.
            </li>
          </ul>
        </section>
      </div>

      <h2 className="mt-14 text-[28px] font-semibold tracking-tight">Student enrollment growth</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Year</th>
              <th className="px-4 py-3 font-medium">Number of students</th>
            </tr>
          </thead>
          <tbody>
            {enrollment.map(([year, count]) => (
              <tr key={year} className="border-t border-border">
                <td className="px-4 py-3">{year}</td>
                <td className="px-4 py-3">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 text-[28px] font-semibold tracking-tight">Registered & compliant</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-text-muted">PCP Certified</p>
          <p className="mt-2 text-sm text-text-secondary">Certification No: {THS_ORG.pcp}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-text-muted">Punjab Charity Commission</p>
          <p className="mt-2 text-sm text-text-secondary">Reg. No: {THS_ORG.pcc}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-text-muted">FBR NPO</p>
          <p className="mt-2 text-sm text-text-secondary">NTN: {THS_ORG.ntn}</p>
        </Card>
      </div>
      <p className="mt-4 text-sm text-text-muted">
        Government of Punjab (Societies Act, 1860) — Reg. No: {THS_ORG.societiesAct}
      </p>

      <p className="mt-10 text-sm text-text-secondary">
        Full story on the official site:{" "}
        <Link href={THS_ORG.about} className="font-medium text-primary hover:underline">
          taleem-o-hunar.com/about
        </Link>
      </p>

      <Card className="mt-14 text-center">
        <ThsMark size="md" />
        <p className="mt-4 text-base text-text-secondary">
          An educational learning course by Taleem-o-Hunar Society.
        </p>
        <p className="mt-3 text-sm font-medium text-text">Designed &amp; Developed by Mubashar Ali</p>
        <p className="mt-3 text-sm text-text-muted">© 2026 THS LAB LMS. All Rights Reserved.</p>
      </Card>
    </div>
  );
}
