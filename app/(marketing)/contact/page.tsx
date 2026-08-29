import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="marketing-wrap grid gap-8 py-16 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <p className="mt-3 text-text-secondary">Write to the THS LAB team. We reply during institute hours.</p>
        <form className="mt-8 space-y-4">
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
        <h2 className="font-semibold">THS LAB</h2>
        <p className="mt-2 text-sm text-text-secondary">IT Learning Laboratory · Academic campus</p>
        <p className="mt-4 text-sm text-text-secondary">hello@thslab.edu</p>
        <p className="text-sm text-text-secondary">Mon–Fri, 09:00–17:00</p>
        <div className="mt-6 h-48 rounded-xl bg-canvas" aria-label="Map placeholder" />
      </Card>
    </div>
  );
}
