import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThsMark } from "@/components/ui/logo";
import { THS_ORG } from "@/lib/ths-org";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="marketing-wrap py-16">
      <ThsMark size="lg" />
      <h1 className="mt-6 text-4xl font-bold tracking-tight">Contact us</h1>
      <p className="mt-3 max-w-2xl text-text-secondary">
        Reach Taleem-o-Hunar Society by phone, email, or visit our locations in Lahore.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Phone & email</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-text-muted">Landline</dt>
              <dd>
                <a className="font-medium text-primary hover:underline" href={THS_ORG.landlineHref}>
                  {THS_ORG.landline}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Mobile</dt>
              <dd>
                <a className="font-medium text-primary hover:underline" href={THS_ORG.mobileHref}>
                  {THS_ORG.mobile}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Email</dt>
              <dd>
                <a className="font-medium text-primary hover:underline" href={`mailto:${THS_ORG.email}`}>
                  {THS_ORG.email}
                </a>
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="font-semibold">Mailing address</h2>
          <p className="mt-4 text-sm leading-7 text-text-secondary">
            {THS_ORG.mailing.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="mt-4 text-sm text-text-muted">
            Registered with PCP, Punjab Charity Commission & FBR, Pakistan.
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">THS Head Office & Empowerment Center</h2>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{THS_ORG.headOffice}</p>
          <div className="mt-4">
            <Button href={THS_ORG.maps} variant="secondary">
              Open in Google Maps
            </Button>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">THS sub-office & Center of Modern Education</h2>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            <strong>{THS_ORG.subOfficeName}</strong>, {THS_ORG.subOffice}
          </p>
        </Card>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight">Message THS LAB LMS</h2>
          <p className="mt-2 text-sm text-text-secondary">
            For LMS login or lab questions, send a note. For donations and school programs, use the official
            contacts above.
          </p>
          <form className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="name">
                Full name
              </label>
              <input id="name" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="subject">
                Subject
              </label>
              <input id="subject" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="message">
                Message
              </label>
              <textarea id="message" className="input h-32 py-3" />
            </div>
            <Button type="button">Send message</Button>
          </form>
        </div>
        <Card>
          <p className="text-sm text-text-secondary">
            More on the official website:{" "}
            <a className="font-medium text-primary hover:underline" href={THS_ORG.contact}>
              taleem-o-hunar.com/contact
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}
