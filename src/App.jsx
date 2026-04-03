import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  CalendarDays,
  CreditCard,
  Camera,
  Search,
  Plus,
  CheckCircle2,
  Clock3,
  Send,
  DollarSign,
  Droplets,
  ShieldCheck,
  MessageSquare,
  Phone,
  MapPin,
  ClipboardList,
} from "lucide-react";

const brand = {
  name: "PeakFlow Exterior Cleaning of Georgia",
  short: "PeakFlow",
  phone: "943-291-6430",
  tagline: "Premium exterior cleaning, streamlined from lead to payment.",
};

const initialCustomers = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "(555) 210-1144",
    email: "sarah@example.com",
    address: "Monroe, GA",
    service: "House Wash",
    status: "Quoted",
    value: 325,
    lastContact: "Today",
    notes: "Requested driveway upsell. Dog in backyard.",
  },
  {
    id: 2,
    name: "Mike Turner",
    phone: "(555) 410-9902",
    email: "mike@example.com",
    address: "Loganville, GA",
    service: "Driveway + Walkway",
    status: "New Lead",
    value: 240,
    lastContact: "Yesterday",
    notes: "Facebook lead. Prefers Saturday morning.",
  },
  {
    id: 3,
    name: "Oak Ridge Realty",
    phone: "(555) 300-8811",
    email: "office@oakridge.com",
    address: "Athens, GA",
    service: "Commercial Cleanup",
    status: "Scheduled",
    value: 1200,
    lastContact: "2 days ago",
    notes: "Needs COI before start. Multi-building property.",
  },
];

const initialJobs = [
  {
    id: 101,
    customer: "Sarah Johnson",
    service: "House Wash",
    date: "2026-04-05",
    address: "Monroe, GA",
    status: "Scheduled",
    crewNote: "Bring ladder and plant rinse hose.",
  },
  {
    id: 102,
    customer: "Oak Ridge Realty",
    service: "Commercial Cleanup",
    date: "2026-04-06",
    address: "Athens, GA",
    status: "Pending",
    crewNote: "Start rear lot first. Manager on-site at 8 AM.",
  },
];

const initialInvoices = [
  {
    id: "INV-1001",
    customer: "Sarah Johnson",
    amount: 325,
    status: "Sent",
    due: "2026-04-05",
  },
  {
    id: "INV-1002",
    customer: "Oak Ridge Realty",
    amount: 1200,
    status: "Draft",
    due: "2026-04-08",
  },
];

const servicePresets = [
  { name: "House Wash", base: 325 },
  { name: "Driveway Cleaning", base: 180 },
  { name: "Roof Wash", base: 525 },
  { name: "Commercial Cleanup", base: 950 },
  { name: "Gutter Brightening", base: 150 },
];

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "crm", label: "CRM", icon: Users },
  { id: "quotes", label: "Quotes", icon: FileText },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "field", label: "Field", icon: Camera },
];

const statuses = ["All", "New Lead", "Quoted", "Scheduled", "Paid"];

function Card({ title, description, action, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      {(title || description || action) && (
        <div className="card-head">
          <div>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="stat-card">
      <div>
        <div className="muted">{label}</div>
        <div className="stat-value">{value}</div>
        <div className="tiny">{helper}</div>
      </div>
      <div className="icon-pill">
        <Icon size={18} />
      </div>
    </div>
  );
}

function Badge({ children, dark = false }) {
  return <span className={dark ? "badge badge-dark" : "badge"}>{children}</span>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [customers, setCustomers] = useState(initialCustomers);
  const [jobs, setJobs] = useState(initialJobs);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [quoteForm, setQuoteForm] = useState({
    customer: "",
    address: "",
    service: "House Wash",
    sqFt: "2200",
    condition: "Standard",
    addons: "Driveway cleaning",
  });
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: "",
    value: "",
    notes: "",
  });
  const [fieldNote, setFieldNote] = useState("");
  const [fieldShots, setFieldShots] = useState([]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const haystack = [
        customer.name,
        customer.phone,
        customer.email,
        customer.address,
        customer.service,
        customer.notes,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" ? true : customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const metrics = useMemo(() => {
    const totalPipeline = customers.reduce((sum, c) => sum + Number(c.value || 0), 0);
    const quoted = customers.filter((c) => c.status === "Quoted").length;
    const scheduled = customers.filter((c) => c.status === "Scheduled").length;
    const paid = customers.filter((c) => c.status === "Paid").length;
    return {
      leads: customers.length,
      quoted,
      scheduled,
      paid,
      totalPipeline,
    };
  }, [customers]);

  const todayRevenue = useMemo(() => {
    return invoices
      .filter((invoice) => invoice.status === "Paid")
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  }, [invoices]);

  const quotePrice = useMemo(() => {
    const preset = servicePresets.find((s) => s.name === quoteForm.service);
    const base = preset?.base || 250;
    const sqFtFactor = Math.max(0, Number(quoteForm.sqFt || 0) - 2000) * 0.04;
    const conditionFactor =
      quoteForm.condition === "Heavy Buildup" ? 85 : quoteForm.condition === "Light" ? -20 : 0;
    const addonFactor = quoteForm.addons ? 95 : 0;
    return Math.round(base + sqFtFactor + conditionFactor + addonFactor);
  }, [quoteForm]);

  const addLead = () => {
    if (!leadForm.name || !leadForm.phone || !leadForm.service) return;
    setCustomers((prev) => [
      {
        id: Date.now(),
        name: leadForm.name,
        phone: leadForm.phone,
        email: leadForm.email,
        address: leadForm.address,
        service: leadForm.service,
        status: "New Lead",
        value: Number(leadForm.value || 0),
        lastContact: "Just now",
        notes: leadForm.notes,
      },
      ...prev,
    ]);
    setLeadForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      service: "",
      value: "",
      notes: "",
    });
    setActiveTab("crm");
  };

  const advanceCustomer = (id) => {
    const order = ["New Lead", "Quoted", "Scheduled", "Paid"];
    setCustomers((prev) =>
      prev.map((customer) => {
        if (customer.id !== id) return customer;
        const currentIndex = order.indexOf(customer.status);
        const nextStatus = order[Math.min(currentIndex + 1, order.length - 1)];
        return { ...customer, status: nextStatus, lastContact: "Updated just now" };
      })
    );
  };

  const markInvoicePaid = (id) => {
    setInvoices((prev) =>
      prev.map((invoice) => (invoice.id === id ? { ...invoice, status: "Paid" } : invoice))
    );
  };

  const createInvoiceFromQuote = () => {
    if (!quoteForm.customer) return;
    setInvoices((prev) => [
      {
        id: `INV-${1000 + prev.length + 1}`,
        customer: quoteForm.customer,
        amount: quotePrice,
        status: "Draft",
        due: "2026-04-10",
      },
      ...prev,
    ]);
    setCustomers((prev) => {
      const match = prev.some(
        (customer) => customer.name.toLowerCase() === quoteForm.customer.toLowerCase()
      );
      if (match) {
        return prev.map((customer) =>
          customer.name.toLowerCase() === quoteForm.customer.toLowerCase()
            ? { ...customer, status: "Quoted", value: quotePrice, lastContact: "Quote created" }
            : customer
        );
      }
      return [
        {
          id: Date.now(),
          name: quoteForm.customer,
          phone: "",
          email: "",
          address: quoteForm.address,
          service: quoteForm.service,
          status: "Quoted",
          value: quotePrice,
          lastContact: "Quote created",
          notes: `Auto-created from quote builder. ${quoteForm.addons ? `Add-ons: ${quoteForm.addons}` : ""}`,
        },
        ...prev,
      ];
    });
    setActiveTab("payments");
  };

  const completeJob = (id) => {
    setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, status: "Complete" } : job)));
  };

  const handleShotUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const fileNames = files.map((f) => f.name);
    setFieldShots((prev) => [...fileNames, ...prev].slice(0, 8));
  };

  return (
    <div className="app-shell">
      <motion.header
        className="hero"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="hero-left">
          <div className="brand-row">
            <div className="logo-box">
              <Droplets size={24} />
            </div>
            <div>
              <div className="brand-name">{brand.short}</div>
              <div className="tiny hero-sub">Exterior Cleaning Business App</div>
            </div>
          </div>
          <h1>{brand.name}</h1>
          <p>{brand.tagline}</p>
          <div className="badge-row">
            <Badge dark>{brand.phone}</Badge>
            <Badge dark>Georgia Service Business</Badge>
            <Badge dark>Lead → Quote → Job → Payment</Badge>
          </div>
        </div>
        <div className="hero-grid">
          <div className="hero-metric">
            <div className="tiny">Open Pipeline</div>
            <div className="hero-value">${metrics.totalPipeline.toLocaleString()}</div>
          </div>
          <div className="hero-metric">
            <div className="tiny">Paid Invoices</div>
            <div className="hero-value">${todayRevenue.toLocaleString()}</div>
          </div>
          <div className="hero-metric">
            <div className="tiny">Scheduled Jobs</div>
            <div className="hero-value">{metrics.scheduled}</div>
          </div>
          <div className="hero-metric">
            <div className="tiny">Quoted Leads</div>
            <div className="hero-value">{metrics.quoted}</div>
          </div>
        </div>
      </motion.header>

      <div className="main-grid">
        <aside className="sidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={active ? "nav-btn active" : "nav-btn"}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        <main className="content">
          {activeTab === "dashboard" && (
            <>
              <div className="stats-grid">
                <StatCard icon={Users} label="Leads" value={metrics.leads} helper="Customers and prospects" />
                <StatCard icon={FileText} label="Quotes" value={metrics.quoted} helper="Awaiting approval" />
                <StatCard icon={CalendarDays} label="Jobs Booked" value={metrics.scheduled} helper="Ready to complete" />
                <StatCard icon={DollarSign} label="Pipeline" value={`$${metrics.totalPipeline.toLocaleString()}`} helper="Open opportunity value" />
              </div>

              <div className="two-col">
                <Card title="Today's Focus" description="The most important actions to keep PeakFlow moving.">
                  <div className="stack">
                    {[
                      "Follow up on 2 quoted leads before noon",
                      "Confirm tomorrow's house wash and send reminder text",
                      "Send invoice after completion",
                      "Capture before/after photos for social proof",
                    ].map((item) => (
                      <div key={item} className="todo">
                        <CheckCircle2 size={18} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Quick Actions" description="Built for fast use from your phone in the field.">
                  <div className="quick-grid">
                    {[
                      { icon: Plus, label: "New Lead", tab: "crm" },
                      { icon: FileText, label: "New Quote", tab: "quotes" },
                      { icon: CalendarDays, label: "Book Job", tab: "schedule" },
                      { icon: CreditCard, label: "Take Payment", tab: "payments" },
                      { icon: Camera, label: "Upload Photos", tab: "field" },
                      { icon: MessageSquare, label: "Send Text", tab: "crm" },
                    ].map((action) => {
                      const Icon = action.icon;
                      return (
                        <button key={action.label} className="quick-btn" onClick={() => setActiveTab(action.tab)}>
                          <Icon size={18} />
                          <div>{action.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </>
          )}

          {activeTab === "crm" && (
            <div className="two-col">
              <Card
                title="Customer CRM"
                description="Track every lead from first contact to paid job."
                action={
                  <div className="search-box">
                    <Search size={16} />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads" />
                  </div>
                }
              >
                <div className="filter-row">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? "chip active" : "chip"}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <div className="stack">
                  {filteredCustomers.map((customer) => (
                    <motion.div
                      key={customer.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="lead-card"
                    >
                      <div className="lead-main">
                        <div className="lead-left">
                          <div className="lead-head">
                            <h4>{customer.name}</h4>
                            <Badge>{customer.status}</Badge>
                          </div>
                          <div className="service-line">{customer.service}</div>
                          <div className="detail"><Phone size={14} /> {customer.phone || "No phone yet"}</div>
                          <div className="detail"><MapPin size={14} /> {customer.address || "No address yet"}</div>
                          <div className="detail"><Clock3 size={14} /> {customer.lastContact}</div>
                          <p className="notes">{customer.notes}</p>
                        </div>
                        <div className="lead-right">
                          <div className="money">${Number(customer.value || 0).toLocaleString()}</div>
                          <div className="btn-row">
                            <button className="btn secondary">Call</button>
                            <button className="btn" onClick={() => advanceCustomer(customer.id)}>Advance</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card title="Add Lead" description="Fast intake for new calls, messages, and referrals.">
                <div className="form-grid">
                  <input placeholder="Customer name" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} />
                  <input placeholder="Phone" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} />
                  <input placeholder="Email" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} />
                  <input placeholder="Address" value={leadForm.address} onChange={(e) => setLeadForm({ ...leadForm, address: e.target.value })} />
                  <input placeholder="Service requested" value={leadForm.service} onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })} />
                  <input placeholder="Estimated value" type="number" value={leadForm.value} onChange={(e) => setLeadForm({ ...leadForm, value: e.target.value })} />
                  <textarea placeholder="Notes" value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })} />
                  <button className="btn full" onClick={addLead}>
                    <Plus size={16} /> Add Lead
                  </button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "quotes" && (
            <div className="two-col">
              <Card title="Quote Builder" description="Generate consistent estimates right from your phone.">
                <div className="form-grid">
                  <input placeholder="Customer name" value={quoteForm.customer} onChange={(e) => setQuoteForm({ ...quoteForm, customer: e.target.value })} />
                  <input placeholder="Property address" value={quoteForm.address} onChange={(e) => setQuoteForm({ ...quoteForm, address: e.target.value })} />
                  <select value={quoteForm.service} onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })}>
                    {servicePresets.map((service) => (
                      <option key={service.name} value={service.name}>{service.name}</option>
                    ))}
                  </select>
                  <input placeholder="Square footage" value={quoteForm.sqFt} onChange={(e) => setQuoteForm({ ...quoteForm, sqFt: e.target.value })} />
                  <select value={quoteForm.condition} onChange={(e) => setQuoteForm({ ...quoteForm, condition: e.target.value })}>
                    <option>Light</option>
                    <option>Standard</option>
                    <option>Heavy Buildup</option>
                  </select>
                  <input placeholder="Add-ons" value={quoteForm.addons} onChange={(e) => setQuoteForm({ ...quoteForm, addons: e.target.value })} />
                </div>
                <div className="btn-row top-gap">
                  <button className="btn" onClick={createInvoiceFromQuote}><FileText size={16} /> Save Quote</button>
                  <button className="btn secondary"><Send size={16} /> Send Quote</button>
                </div>
              </Card>

              <Card title="Quote Preview" description="Branded customer-facing estimate summary.">
                <div className="quote-preview">
                  <div className="quote-top">
                    <div>
                      <div className="quote-title">{brand.short} Quote</div>
                      <div className="tiny">{brand.phone}</div>
                    </div>
                    <ShieldCheck size={28} />
                  </div>
                  <div className="preview-line"><span>Customer</span><strong>{quoteForm.customer || "Customer name"}</strong></div>
                  <div className="preview-line"><span>Address</span><strong>{quoteForm.address || "Property address"}</strong></div>
                  <div className="preview-line"><span>Service</span><strong>{quoteForm.service}</strong></div>
                  <div className="preview-line"><span>Condition</span><strong>{quoteForm.condition}</strong></div>
                  <div className="preview-line"><span>Add-ons</span><strong>{quoteForm.addons || "None"}</strong></div>
                  <div className="quote-total">${quotePrice.toLocaleString()}</div>
                  <div className="quote-footer">Soft wash safe process • Mobile-friendly estimate • Fast booking</div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "schedule" && (
            <Card title="Job Schedule" description="Upcoming work orders and crew notes.">
              <div className="stack">
                {jobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <div>
                      <div className="lead-head">
                        <h4>{job.customer}</h4>
                        <Badge>{job.status}</Badge>
                      </div>
                      <div className="service-line">{job.service}</div>
                      <div className="detail"><CalendarDays size={14} /> {job.date}</div>
                      <div className="detail"><MapPin size={14} /> {job.address}</div>
                      <p className="notes">{job.crewNote}</p>
                    </div>
                    <div className="btn-row">
                      <button className="btn secondary">Navigate</button>
                      <button className="btn" onClick={() => completeJob(job.id)}>Complete</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "payments" && (
            <div className="two-col">
              <Card title="Invoices & Payments" description="Track drafts, sent invoices, and paid jobs.">
                <div className="stack">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="pay-card">
                      <div>
                        <div className="lead-head">
                          <h4>{invoice.id}</h4>
                          <Badge>{invoice.status}</Badge>
                        </div>
                        <div className="service-line">{invoice.customer}</div>
                        <div className="detail"><DollarSign size={14} /> ${invoice.amount.toLocaleString()}</div>
                        <div className="detail"><Clock3 size={14} /> Due {invoice.due}</div>
                      </div>
                      <div className="btn-row">
                        <button className="btn secondary">Send Link</button>
                        <button className="btn" onClick={() => markInvoicePaid(invoice.id)}>Mark Paid</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Payment Workflow" description="Recommended setup for your real version.">
                <div className="stack">
                  {[
                    "Connect Square payment links for card acceptance",
                    "Text invoice link before leaving the driveway",
                    "Mark paid automatically after Square confirmation",
                    "Store receipts under each customer profile",
                  ].map((item) => (
                    <div key={item} className="todo">
                      <ClipboardList size={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "field" && (
            <div className="two-col">
              <Card title="Field Notes" description="Use this tab for jobsite notes and before/after tracking.">
                <div className="form-grid">
                  <textarea
                    placeholder="Example: Pre-wet plants, north wall has heavy buildup, customer approved driveway add-on."
                    value={fieldNote}
                    onChange={(e) => setFieldNote(e.target.value)}
                  />
                  <div className="note-preview">
                    <div className="muted">Saved field note preview</div>
                    <p>{fieldNote || "Your field notes will show here."}</p>
                  </div>
                </div>
              </Card>

              <Card title="Photo Upload Placeholder" description="This demo stores file names only. Real app version can save actual images.">
                <label className="upload-box">
                  <Camera size={22} />
                  <span>Tap to choose before/after photos</span>
                  <input type="file" multiple onChange={handleShotUpload} />
                </label>
                <div className="stack top-gap">
                  {fieldShots.length === 0 ? (
                    <div className="empty-state">No photos selected yet.</div>
                  ) : (
                    fieldShots.map((name, idx) => (
                      <div key={`${name}-${idx}`} className="file-pill">{name}</div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
