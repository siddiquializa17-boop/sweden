import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Check, ChevronDown,
  CircleHelp, Globe2, Layers3, Menu, MousePointer2, ShieldCheck, Sparkles,
  Target, TrendingUp, Users, X, Zap, ShoppingBag, CreditCard, MapPin, Mail,
  Phone, Send, Github, Linkedin, Instagram, Activity, PackageCheck, Filter
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import salesData from "./data/sales-data.json";
import "./styles.css";

const money = n => new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(Number(n || 0));
const compact = n => new Intl.NumberFormat("en-IN", { notation:"compact", maximumFractionDigits:1 }).format(Number(n || 0));
const safe = v => v == null || v === "" ? "Not provided" : String(v);
const nav = [{id:"overview",label:"Overview"},{id:"insights",label:"Insights"},{id:"services",label:"Capabilities"},{id:"work",label:"Our approach"},{id:"contact",label:"Contact"}];
const palette = ["#77e4c5","#8ea9ff","#f5c777","#e7a1fa","#83d4ee","#f28e8e"];

function Logo({light=false}) {
  return <a className={`brand ${light?"brand-light":""}`} href="#home" aria-label="TCS home">
    <span className="brand-mark"><span></span><span></span><span></span></span>
    <span className="brand-word">TCS<span className="brand-dot">.</span><small>SALES INTELLIGENCE</small></span>
  </a>;
}
function Reveal({children, delay=0, className=""}) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced?false:{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.16}} transition={{duration:reduced?0:.65,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
function Counter({value, format, label, icon:Icon, note}) {
  const [shown,setShown] = useState(0);
  useEffect(()=> {
    let start = 0, raf;
    const duration=1000, begin=performance.now();
    const tick = now => {
      const p=Math.min(1,(now-begin)/duration);
      const eased=1-Math.pow(1-p,3);
      setShown(Math.round(value*eased));
      if(p<1) raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(raf);
  },[value]);
  return <div className="metric-card">
    <div className="metric-top"><span className="metric-icon"><Icon size={18}/></span><span className="metric-note">{note}</span></div>
    <div className="metric-value">{format?format(shown):shown.toLocaleString("en-IN")}</div>
    <div className="metric-label">{label}</div>
  </div>;
}
function App() {
  const reduced = useReducedMotion();
  const [loading,setLoading]=useState(true);
  const [menuOpen,setMenuOpen]=useState(false);
  const [category,setCategory]=useState("All");
  const [status,setStatus]=useState("All");
  const [form,setForm]=useState({name:"",email:"",subject:"",message:""});
  const [formState,setFormState]=useState({kind:"",text:""});
  const [activeFilter,setActiveFilter]=useState("All");
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),reduced?0:700);return()=>clearTimeout(t)},[reduced]);
  useEffect(()=> {
    const onScroll=()=>document.body.classList.toggle("scrolled",window.scrollY>24);
    window.addEventListener("scroll",onScroll,{passive:true}); return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  const analytics=useMemo(()=>{
    const rows=salesData.filter(r=>r && r.Order_ID);
    const totalOrders=rows.length;
    const netSales=rows.reduce((s,r)=>s+Number(r.Net_Sales||0),0);
    const delivered=rows.filter(r=>String(r.Order_Status).toLowerCase()==="delivered").length;
    const cancelled=rows.filter(r=>/cancel|return/i.test(String(r.Order_Status||""))).length;
    const avgOrder=totalOrders?netSales/totalOrders:0;
    const categories=[...new Set(rows.map(r=>r.Product_Category).filter(Boolean))].sort();
    const statuses=[...new Set(rows.map(r=>r.Order_Status).filter(Boolean))].sort();
    const monthly=Object.values(rows.reduce((a,r)=>{
      const m=r.Month || (r.Order_Date||"").slice(0,7) || "Unknown";
      a[m]??={month:m,orders:0,sales:0};a[m].orders++;a[m].sales+=Number(r.Net_Sales||0);return a;
    },{})).sort((a,b)=>a.month.localeCompare(b.month));
    const byCategory=Object.values(rows.reduce((a,r)=>{
      const k=r.Product_Category||"Uncategorised";a[k]??={name:k,orders:0,sales:0,units:0};
      a[k].orders++;a[k].sales+=Number(r.Net_Sales||0);a[k].units+=Number(r.Quantity||0);return a;
    },{})).sort((a,b)=>b.sales-a.sales);
    const byRegion=Object.values(rows.reduce((a,r)=>{
      const k=r.Region||"Unspecified";a[k]??={name:k,orders:0,sales:0};a[k].orders++;a[k].sales+=Number(r.Net_Sales||0);return a;
    },{})).sort((a,b)=>b.sales-a.sales);
    const byStatus=Object.values(rows.reduce((a,r)=>{
      const k=r.Order_Status||"Unspecified";a[k]??={name:k,orders:0,sales:0};a[k].orders++;a[k].sales+=Number(r.Net_Sales||0);return a;
    },{})).sort((a,b)=>b.orders-a.orders);
    const byPayment=Object.values(rows.reduce((a,r)=>{
      const k=r.Payment_Method||"Unspecified";a[k]??={name:k,orders:0,sales:0};a[k].orders++;a[k].sales+=Number(r.Net_Sales||0);return a;
    },{})).sort((a,b)=>b.orders-a.orders);
    const byCity=Object.values(rows.reduce((a,r)=>{
      const k=r.City||"Unspecified";a[k]??={name:k,orders:0,sales:0};a[k].orders++;a[k].sales+=Number(r.Net_Sales||0);return a;
    },{})).sort((a,b)=>b.sales-a.sales).slice(0,8);
    return {rows,totalOrders,netSales,delivered,cancelled,avgOrder,categories,statuses,monthly,byCategory,byRegion,byStatus,byPayment,byCity};
  },[]);
  const filteredRows=useMemo(()=>analytics.rows.filter(r=>(category==="All"||r.Product_Category===category)&&(status==="All"||r.Order_Status===status)),[analytics,category,status]);
  const filteredTotals=useMemo(()=>({orders:filteredRows.length,sales:filteredRows.reduce((s,r)=>s+Number(r.Net_Sales||0),0),units:filteredRows.reduce((s,r)=>s+Number(r.Quantity||0),0)}),[filteredRows]);
  const submitForm=e=>{
    e.preventDefault();
    if(!form.name.trim()||!form.email.trim()||!form.message.trim()){setFormState({kind:"error",text:"Please complete your name, email and message."});return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){setFormState({kind:"error",text:"Please enter a valid email address."});return}
    setFormState({kind:"success",text:"Thanks — your message passed validation. Connect this form to your email or backend service to receive submissions."});
    setForm({name:"",email:"",subject:"",message:""});
  };
  const scrollTo=id=>{setMenuOpen(false);document.getElementById(id)?.scrollIntoView({behavior:reduced?"auto":"smooth"})};

  return <>
    <AnimatePresence>{loading&&<motion.div className="loader" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:.45}}><Logo light/><div className="loader-line"><motion.span initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:.65,ease:"easeInOut"}}/></div><p>INTELLIGENCE IN MOTION</p></motion.div>}</AnimatePresence>
    <header className="header">
      <div className="nav-shell"><Logo/>
        <nav className={`nav-links ${menuOpen?"nav-open":""}`} aria-label="Main navigation">
          {nav.map(n=><a key={n.id} href={`#${n.id}`} onClick={()=>setMenuOpen(false)}>{n.label}</a>)}
          <a className="nav-cta" href="#contact" onClick={()=>setMenuOpen(false)}>Let’s talk <ArrowUpRight size={15}/></a>
        </nav>
        <button className="menu-toggle" aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button>
      </div>
    </header>

    <main>
      <section className="hero section-wrap" id="home">
        <div className="hero-glow glow-one"></div><div className="hero-glow glow-two"></div>
        <div className="hero-grid"></div>
        <div className="hero-content">
          <Reveal><div className="eyebrow"><span className="pulse-dot"></span> DATA-LED DECISIONS · BUSINESS INTELLIGENCE</div></Reveal>
          <Reveal delay={.08}><h1>Clarity for the<br/><span className="gradient-text">next move.</span></h1></Reveal>
          <Reveal delay={.16}><p className="hero-copy">Turn sales data into a sharper view of performance. Explore the signals behind every order, market, and product — in one considered experience.</p></Reveal>
          <Reveal delay={.24}><div className="hero-actions"><a className="button button-primary" href="#overview">Explore the dashboard <ArrowRight size={17}/></a><a className="button button-quiet" href="#services">Discover capabilities <ArrowDownRight size={17}/></a></div></Reveal>
          <Reveal delay={.32}><div className="hero-proof"><div className="proof-avatars"><span>T</span><span>C</span><span>S</span></div><div><strong>One dataset. Clearer decisions.</strong><small>Interactive sales analysis · Excel-powered</small></div></div></Reveal>
        </div>
        <motion.div className="hero-art" initial={reduced?false:{opacity:0,scale:.92,rotate:2}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:1,ease:[.22,1,.36,1],delay:.15}}>
          <div className="orbit orbit-a"></div><div className="orbit orbit-b"></div><div className="orbit orbit-c"></div>
          <div className="orb-core"><div className="core-mark"><span></span><span></span><span></span></div><small>DATA / INSIGHT</small></div>
          <div className="float-card float-card-top"><span className="float-icon"><TrendingUp size={16}/></span><div><small>NET SALES</small><strong>{money(analytics.netSales)}</strong></div><span className="mini-spark">↗</span></div>
          <div className="float-card float-card-bottom"><div className="float-card-heading"><span>ORDER MOMENTUM</span><Activity size={14}/></div><div className="spark-bars">{[26,39,32,55,43,70,50,82,65,96,73,100].map((h,i)=><i key={i} style={{height:`${h}%`,animationDelay:`${i*55}ms`}}/>)}</div><div className="float-card-foot"><span>Across recorded periods</span><span className="green-dot"></span></div></div>
          <div className="orbit-label label-one"><span></span> ANALYSE</div><div className="orbit-label label-two"><span></span> ACT</div>
        </motion.div>
        <a className="scroll-cue" href="#overview"><span className="scroll-wheel"></span> SCROLL TO EXPLORE</a>
      </section>

      <section className="overview section-pad" id="overview">
        <div className="section-heading section-wrap">
          <Reveal><div className="eyebrow">01 / PERFORMANCE SNAPSHOT</div><h2>See the business<br/><span className="muted-heading">behind the numbers.</span></h2></Reveal>
          <Reveal delay={.1}><p className="section-intro">A live, browser-side view of the supplied workbook. Metrics are calculated from the 800 order records included with this project.</p></Reveal>
        </div>
        <div className="metrics-grid section-wrap">
          <Reveal><Counter value={analytics.totalOrders} label="Total orders" icon={ShoppingBag} note="RECORD COUNT"/></Reveal>
          <Reveal delay={.06}><Counter value={Math.round(analytics.netSales)} label="Net sales" icon={TrendingUp} format={compact} note="INR · ESTIMATED"/></Reveal>
          <Reveal delay={.12}><Counter value={Math.round(analytics.avgOrder)} label="Average order value" icon={CreditCard} format={compact} note="INR / ORDER"/></Reveal>
          <Reveal delay={.18}><Counter value={analytics.totalOrders?Math.round(analytics.delivered/analytics.totalOrders*100):0} label="Delivered orders" icon={PackageCheck} format={v=>`${v}%`} note="OF ALL ORDERS"/></Reveal>
        </div>
        <div className="dashboard section-wrap">
          <div className="dashboard-top"><div><div className="eyebrow">SALES OVERVIEW</div><h3>Performance, at a glance</h3><p>Filter the dataset to explore specific product categories and order statuses.</p></div><div className="data-badge"><span className="green-dot"></span> DATA LOADED <span className="badge-divider">/</span> {analytics.totalOrders} ROWS</div></div>
          <div className="filter-row"><div className="filter-label"><Filter size={15}/> FILTER VIEW</div><label><span>Category</span><select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option>{analytics.categories.map(c=><option key={c}>{c}</option>)}</select></label><label><span>Order status</span><select value={status} onChange={e=>setStatus(e.target.value)}><option>All</option>{analytics.statuses.map(s=><option key={s}>{s}</option>)}</select></label><button className="reset-filter" onClick={()=>{setCategory("All");setStatus("All")}}>Reset filters</button></div>
          <div className="filtered-strip"><div><small>FILTERED ORDERS</small><strong>{filteredTotals.orders.toLocaleString("en-IN")}</strong></div><div><small>FILTERED NET SALES</small><strong>{money(filteredTotals.sales)}</strong></div><div><small>UNITS SOLD</small><strong>{filteredTotals.units.toLocaleString("en-IN")}</strong></div></div>
          <div className="chart-grid">
            <div className="chart-panel chart-wide"><div className="chart-heading"><div><h4>Monthly sales trend</h4><p>Net sales · INR</p></div><span className="chart-chip"><span className="legend-dot"></span> NET SALES</span></div>
              <div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={analytics.monthly} margin={{top:10,right:8,left:0,bottom:0}}><defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#77e4c5" stopOpacity={.28}/><stop offset="100%" stopColor="#77e4c5" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#273647" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="month" tick={{fill:"#8190a1",fontSize:11}} axisLine={false} tickLine={false}/><YAxis tickFormatter={v=>compact(v)} tick={{fill:"#8190a1",fontSize:11}} axisLine={false} tickLine={false} width={42}/><Tooltip contentStyle={{background:"#101d2b",border:"1px solid #2a3a4b",borderRadius:12,color:"#fff"}} formatter={v=>money(v)}/><Area type="monotone" dataKey="sales" stroke="#77e4c5" strokeWidth={2.5} fill="url(#salesFill)" activeDot={{r:5,stroke:"#07111f",strokeWidth:2}}/></AreaChart></ResponsiveContainer></div>
            </div>
            <div className="chart-panel"><div className="chart-heading"><div><h4>Category performance</h4><p>Net sales by category</p></div></div>
              <div className="chart-area"><ResponsiveContainer width="100%" height="100%"><BarChart data={analytics.byCategory} layout="vertical" margin={{top:4,right:8,left:4,bottom:4}}><CartesianGrid stroke="#273647" strokeDasharray="3 5" horizontal={false}/><XAxis type="number" tickFormatter={v=>compact(v)} tick={{fill:"#8190a1",fontSize:10}} axisLine={false} tickLine={false}/><YAxis type="category" dataKey="name" width={88} tick={{fill:"#aab6c3",fontSize:10}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:"#101d2b",border:"1px solid #2a3a4b",borderRadius:12,color:"#fff"}} formatter={v=>money(v)}/><Bar dataKey="sales" radius={[0,5,5,0]}>{analytics.byCategory.map((e,i)=><Cell key={e.name} fill={palette[i%palette.length]}/>)}</Bar></BarChart></ResponsiveContainer></div>
            </div>
            <div className="chart-panel"><div className="chart-heading"><div><h4>Order status mix</h4><p>Distribution of recorded orders</p></div></div><div className="status-chart"><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={analytics.byStatus} dataKey="orders" nameKey="name" innerRadius="68%" outerRadius="90%" paddingAngle={3} stroke="none">{analytics.byStatus.map((e,i)=><Cell key={e.name} fill={palette[i%palette.length]}/>)}</Pie><Tooltip contentStyle={{background:"#101d2b",border:"1px solid #2a3a4b",borderRadius:12,color:"#fff"}}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{analytics.totalOrders}</strong><small>ORDERS</small></div></div><div className="legend-list">{analytics.byStatus.map((s,i)=><div key={s.name}><span className="legend-name"><i style={{background:palette[i%palette.length]}}></i>{s.name}</span><strong>{s.orders}</strong></div>)}</div></div></div>
          </div>
          <div className="dashboard-foot"><span><ShieldCheck size={14}/> Calculated from the supplied workbook in your browser.</span><span>Amounts shown in INR · No live backend connection</span></div>
        </div>
      </section>

      <section className="insights section-pad" id="insights"><div className="section-wrap">
        <div className="section-heading"><Reveal><div className="eyebrow">02 / EXPLORE THE SIGNALS</div><h2>Every angle.<br/><span className="muted-heading">One clear picture.</span></h2></Reveal><Reveal delay={.1}><p className="section-intro">Move beyond a single headline metric. Understand where orders come from, which markets contribute, and how customers pay.</p></Reveal></div>
        <div className="insight-grid">
          <Reveal className="insight-card insight-dark"><div className="insight-icon"><Globe2/></div><div className="insight-overline">REGIONAL PERFORMANCE</div><h3>Markets with<br/>momentum.</h3><div className="horizontal-bars">{analytics.byRegion.map((r,i)=><div className="hbar-row" key={r.name}><div><span>{r.name}</span><b>{money(r.sales)}</b></div><div className="hbar-track"><i style={{width:`${analytics.byRegion[0]?.sales? r.sales/analytics.byRegion[0].sales*100:0}%`,background:palette[i%palette.length]}}/></div></div>)}</div><a href="#overview" className="text-link">Explore dashboard <ArrowRight size={15}/></a></Reveal>
          <Reveal delay={.08} className="insight-card insight-light"><div className="insight-icon"><CreditCard/></div><div className="insight-overline">PAYMENT BEHAVIOUR</div><h3>How customers<br/>check out.</h3><div className="payment-list">{analytics.byPayment.slice(0,5).map((p,i)=><div className="payment-row" key={p.name}><span className="payment-symbol">{i+1}</span><span>{p.name}</span><strong>{p.orders}</strong></div>)}</div><div className="insight-footnote">Order counts from the workbook</div></Reveal>
          <Reveal delay={.16} className="insight-card insight-accent"><div className="insight-icon"><Target/></div><div className="insight-overline">CITY PERFORMANCE</div><h3>Local signals.<br/>Bigger picture.</h3><div className="city-list">{analytics.byCity.slice(0,5).map((c,i)=><div key={c.name}><span className="city-rank">0{i+1}</span><span>{c.name}</span><strong>{money(c.sales)}</strong></div>)}</div><div className="insight-footnote">Top cities ranked by net sales</div></Reveal>
        </div>
      </div></section>

      <section className="services section-pad" id="services"><div className="section-wrap">
        <div className="section-heading"><Reveal><div className="eyebrow">03 / CAPABILITIES</div><h2>Built for insight.<br/><span className="muted-heading">Designed for action.</span></h2></Reveal><Reveal delay={.1}><p className="section-intro">A thoughtful analytics experience makes complex data easier to understand, share, and act on.</p></Reveal></div>
        <div className="capability-grid">
          {[{n:"01",icon:BarChart3,title:"Performance analytics",desc:"Track sales, order volume, average order value, and fulfilment status from a single view."},{n:"02",icon:Layers3,title:"Category intelligence",desc:"Compare product categories and identify where recorded revenue is concentrated."},{n:"03",icon:MapPin,title:"Regional insights",desc:"Explore performance by region and city to bring geographic patterns into focus."},{n:"04",icon:Zap,title:"Decision-ready design",desc:"Turn spreadsheet outputs into a polished interface with filters, clear hierarchy, and responsive charts."}].map((c,i)=><Reveal delay={i*.06} key={c.n}><article className="capability-card"><div className="capability-top"><span>{c.n}</span><c.icon size={21}/></div><h3>{c.title}</h3><p>{c.desc}</p><span className="capability-arrow"><ArrowUpRight size={18}/></span></article></Reveal>)}
        </div>
      </div></section>

      <section className="approach section-pad" id="work"><div className="section-wrap approach-layout">
        <div className="approach-intro"><Reveal><div className="eyebrow">04 / OUR APPROACH</div><h2>From raw data<br/>to <span className="gradient-text">clear direction.</span></h2><p>Good analytics is more than charts. It is a disciplined process that preserves context and makes the next step easier to see.</p><a className="button button-primary" href="#contact">Start a conversation <ArrowRight size={16}/></a></Reveal></div>
        <div className="timeline">{[{n:"01",title:"Understand",desc:"Review the source workbook, fields, quality notes, and intended business questions."},{n:"02",title:"Structure",desc:"Standardise the data model and calculate key measures consistently."},{n:"03",title:"Visualise",desc:"Present trends and comparisons through accessible, interactive charts."},{n:"04",title:"Improve",desc:"Connect feedback, validate outcomes, and evolve the dashboard over time."}].map((s,i)=><Reveal key={s.n} delay={i*.07}><div className="timeline-item"><div className="timeline-marker">{s.n}</div><div><h3>{s.title}</h3><p>{s.desc}</p></div><ArrowUpRight className="timeline-arrow" size={18}/></div></Reveal>)}</div>
      </div></section>

      <section className="about-band section-pad"><div className="section-wrap"><Reveal><div className="about-card"><div className="about-orb"></div><div className="about-copy"><div className="eyebrow">A MORE USEFUL VIEW OF YOUR DATA</div><h2>Less noise.<br/><span className="gradient-text">More perspective.</span></h2><p>This experience is a customizable starting point for a corporate analytics website. Replace the brand copy, connect your preferred backend, and adapt the measures to your business.</p><a href="#contact" className="button button-primary">Make it yours <ArrowRight size={16}/></a></div><div className="about-stats"><div><span>01</span><strong>Clear</strong><small>Data storytelling</small></div><div><span>02</span><strong>Connected</strong><small>Interactive exploration</small></div><div><span>03</span><strong>Responsive</strong><small>Across every screen</small></div></div></div></Reveal></div></section>

      <section className="contact section-pad" id="contact"><div className="section-wrap contact-layout">
        <div className="contact-copy"><Reveal><div className="eyebrow">05 / CONTACT</div><h2>Have a question?<br/><span className="muted-heading">Let’s make it clear.</span></h2><p>Use the form to draft an inquiry. Connect a form endpoint or email service before publishing to receive real submissions.</p><div className="contact-note"><span className="contact-note-icon"><CircleHelp size={18}/></span><div><strong>Before you go live</strong><small>Replace the placeholder company contact details and wire the form to your chosen service.</small></div></div></Reveal></div>
        <Reveal delay={.1}><form className="contact-form" onSubmit={submitForm} noValidate><div className="form-head"><h3>Send an inquiry</h3><span><span className="green-dot"></span> WE’RE LISTENING</span></div><div className="form-row"><label>Your name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Jane Smith" autoComplete="name"/></label><label>Email address<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="jane@company.com" autoComplete="email"/></label></div><label>Subject <span className="optional">(optional)</span><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="What would you like to discuss?"/></label><label>Message<textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us a little about your project..." rows="4"/></label>
          <AnimatePresence>{formState.text&&<motion.div className={`form-feedback ${formState.kind}`} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}} role="status">{formState.kind==="success"?<Check size={16}/>:<CircleHelp size={16}/>} {formState.text}</motion.div>}</AnimatePresence>
          <button className="button button-primary form-submit" type="submit">Validate inquiry <Send size={16}/></button><p className="form-privacy"><ShieldCheck size={13}/> Front-end validation only. No data is sent or stored.</p>
        </form></Reveal>
      </div></section>
    </main>

    <footer className="footer"><div className="section-wrap"><div className="footer-main"><div><Logo light/><p className="footer-tagline">A clearer view of performance.<br/>A more confident next move.</p></div><div className="footer-links"><div><small>EXPLORE</small><a href="#overview">Overview</a><a href="#insights">Insights</a><a href="#services">Capabilities</a></div><div><small>COMPANY</small><a href="#work">Our approach</a><a href="#contact">Contact</a><a href="#home">Back to top ↑</a></div></div><a className="back-top" href="#home" aria-label="Back to top"><ArrowUpRight/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} TCS · Sales Intelligence concept website</span><span>Built to make data more useful.</span></div></div></footer>
  </>;
}
createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
