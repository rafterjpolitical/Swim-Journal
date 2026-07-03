"use client";
// app/page.jsx — Public landing page
import { useState } from "react";
import Link from "next/link";

const INK  = "#0D1B2A";
const NAVY = "#0B2D59";
const POOL = "#0891B2";
const GOLD = "#F59E0B";
const MINT = "#10B981";
const TL   = "#64748B";
const TM   = "#334155";

const FEATURES = [
  {
    icon:"📝",
    title:"Practice Log That Actually Works",
    desc:"7 sport-psychology-backed questions in under 5 minutes. Energy. Headspace. Coachability score. The one thing you'll do differently tomorrow. Questions your coach never has time to ask — answered every single day.",
    color: POOL,
  },
  {
    icon:"🏁",
    title:"Complete Meet System",
    desc:"Write your race plan before you touch the water. Review your swims honestly after. And leave a message to yourself that appears before your next meet. The only journal that connects one meet to the next.",
    color: GOLD,
  },
  {
    icon:"🔒",
    title:"Private AI Mentor",
    desc:"Ask what you're too scared to ask your coach. Am I actually good enough for college? Is my coach right for me? Why do I choke in races? Brutally honest answers from an AI with 25 years of competitive swimming knowledge. Completely private. Never saved.",
    color: MINT,
  },
  {
    icon:"📊",
    title:"Insights That Surface Patterns",
    desc:"When your energy is low, do your times suffer 2 weeks later? Are you actually getting more coachable, or less? Your own data tells the story — if someone's tracking it.",
    color: "#8B5CF6",
  },
];

const QUESTIONS = [
  { q:"Am I too old to reach a high level?", category:"Potential" },
  { q:"Why do I choke in races when practice feels easy?", category:"Mental" },
  { q:"Is my coach actually good for my development?", category:"Coaching" },
  { q:"Am I good enough to swim in college?", category:"Recruiting" },
  { q:"What does overtraining feel like?", category:"Training" },
  { q:"Is it normal to want to quit sometimes?", category:"Mindset" },
];

const TESTIMONIALS = [
  { name:"Marcus R.", age:15, team:"NCAP",
    quote:"I've used paper journals, apps, everything. This is the first one where I actually look forward to filling it out. The AI question thing is unreal — I asked something I'd been thinking about for two years." },
  { name:"Coach Sarah T.", team:"AGS-GU",
    quote:"I was skeptical about the Ask AI section. Then one of my swimmers told me it helped them process something they'd never told me. That conversation changed how I coached them. Keep it." },
  { name:"Priya M.", age:17, team:"NBAC",
    quote:"The coachability question messed me up in a good way. I realized I was defending myself every practice. Seeing that pattern in the data made it impossible to ignore." },
];

export default function LandingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div style={{background:"#fff",color:TM}}>
      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:"rgba(13,27,42,.97)",
        borderBottom:"1px solid rgba(255,255,255,.08)",padding:"0 32px",
        display:"flex",alignItems:"center",height:62,gap:32}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginRight:"auto"}}>
          <div style={{width:34,height:34,borderRadius:9,background:GOLD,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏊</div>
          <span style={{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:"-0.3px"}}>
            Swim Journal
          </span>
        </div>
        <Link href="/login" style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.6)",
          textDecoration:"none"}}>Sign In</Link>
        <Link href="/login?signup=true"
          style={{background:GOLD,color:INK,borderRadius:8,padding:"8px 18px",
            fontWeight:800,fontSize:13,textDecoration:"none"}}>
          Start Free Trial
        </Link>
      </nav>

      {/* HERO */}
      <section style={{background:`linear-gradient(155deg,${INK} 0%,${NAVY} 50%,#1A3A5C 100%)`,
        padding:"90px 24px 100px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,
          background:"radial-gradient(ellipse at 50% 120%,rgba(8,145,178,.15),transparent 70%)",
          pointerEvents:"none"}}/>
        <div style={{maxWidth:720,margin:"0 auto",position:"relative"}}>
          <div style={{display:"inline-block",background:"rgba(245,158,11,.12)",
            border:"1px solid rgba(245,158,11,.3)",borderRadius:20,
            padding:"5px 16px",marginBottom:24,fontSize:12,fontWeight:700,color:GOLD}}>
            Built for competitive swimmers aged 11–18
          </div>
          <h1 style={{fontSize:"clamp(34px,6vw,58px)",fontWeight:900,color:"#fff",
            margin:"0 0 22px",lineHeight:1.1,letterSpacing:"-1.5px"}}>
            Train Smarter.<br/>Race Braver.<br/>
            <span style={{color:GOLD}}>Know Yourself.</span>
          </h1>
          <p style={{fontSize:"clamp(15px,2vw,18px)",color:"#93C5E8",lineHeight:1.75,
            maxWidth:560,margin:"0 auto 36px"}}>
            The only journal built for competitive swimmers — grounded in sport psychology,
            powered by an AI mentor who tells you the truth, and designed to be used in 5 minutes.
          </p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <Link href="/login?signup=true"
              style={{background:GOLD,color:INK,borderRadius:10,padding:"14px 32px",
                fontWeight:900,fontSize:15,textDecoration:"none",display:"inline-block",
                boxShadow:"0 8px 30px rgba(245,158,11,.35)"}}>
              Start Your Free 14-Day Trial
            </Link>
            <a href="#features"
              style={{background:"rgba(255,255,255,.08)",color:"#fff",
                border:"1px solid rgba(255,255,255,.15)",borderRadius:10,
                padding:"14px 28px",fontWeight:700,fontSize:15,textDecoration:"none",
                display:"inline-block"}}>
              See How It Works
            </a>
          </div>
          <p style={{fontSize:12,color:"rgba(255,255,255,.3)",marginTop:16}}>
            No credit card required · Cancel anytime · Swimmer data is always private
          </p>
        </div>

        {/* Floating stat cards */}
        <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:60,flexWrap:"wrap"}}>
          {[
            {n:"7",l:"Focused questions\nper practice"},
            {n:"5 min",l:"Average time\nto complete"},
            {n:"100%",l:"Private — never\nshared with coaches"},
          ].map(s=>(
            <div key={s.n} style={{background:"rgba(255,255,255,.06)",
              border:"1px solid rgba(255,255,255,.1)",borderRadius:14,
              padding:"18px 28px",textAlign:"center",minWidth:140}}>
              <div style={{fontSize:28,fontWeight:900,color:GOLD}}>{s.n}</div>
              <div style={{fontSize:11,color:"#93C5E8",marginTop:4,lineHeight:1.5,
                whiteSpace:"pre-line"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:"90px 24px",background:"#F8FAFC"}}>
        <div style={{maxWidth:1080,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div style={{fontSize:12,fontWeight:800,color:POOL,letterSpacing:"1px",
              textTransform:"uppercase",marginBottom:12}}>What Makes This Different</div>
            <h2 style={{fontSize:"clamp(26px,4vw,40px)",fontWeight:900,color:INK,
              margin:0,letterSpacing:"-0.8px"}}>
              Everything a serious swimmer needs.<br/>Nothing a serious swimmer doesn&apos;t.
            </h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
            gap:24}}>
            {FEATURES.map(f=>(
              <div key={f.title} style={{background:"#fff",borderRadius:16,padding:"28px 24px",
                border:"1px solid #E2E8F0",boxShadow:"0 1px 8px rgba(0,0,0,.06)"}}>
                <div style={{width:52,height:52,borderRadius:14,
                  background:`${f.color}18`,display:"flex",
                  alignItems:"center",justifyContent:"center",
                  fontSize:26,marginBottom:18}}>
                  {f.icon}
                </div>
                <h3 style={{fontSize:17,fontWeight:800,color:INK,margin:"0 0 10px",
                  lineHeight:1.3}}>{f.title}</h3>
                <p style={{fontSize:13.5,color:TL,lineHeight:1.8,margin:0}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASK AI SPOTLIGHT */}
      <section style={{background:`linear-gradient(135deg,${INK},${NAVY})`,padding:"80px 24px"}}>
        <div style={{maxWidth:900,margin:"0 auto",
          display:"grid",gridTemplateColumns:"1fr 1fr",gap:52,alignItems:"center"}}>
          <div>
            <div style={{fontSize:12,fontWeight:800,color:GOLD,letterSpacing:"1px",
              textTransform:"uppercase",marginBottom:14}}>🔒 Private AI Mentor</div>
            <h2 style={{fontSize:"clamp(24px,3.5vw,36px)",fontWeight:900,color:"#fff",
              margin:"0 0 18px",lineHeight:1.25,letterSpacing:"-0.6px"}}>
              Ask what you&apos;re too scared to ask anyone else.
            </h2>
            <p style={{fontSize:14,color:"#93C5E8",lineHeight:1.8,marginBottom:24}}>
              Swimmers have questions burning in them that they&apos;d never ask their coach,
              their parents, or their teammates. This is the place where those questions
              get honest answers — from an AI with 25 years of competitive swimming knowledge.
              No judgment. No softening. No adults in the room.
            </p>
            <p style={{fontSize:12,color:"rgba(255,255,255,.3)",margin:0}}>
              Conversations are never saved. Nothing is stored. Between you and the water.
            </p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {QUESTIONS.map(q=>(
              <div key={q.q} style={{background:"rgba(255,255,255,.05)",
                border:"1px solid rgba(255,255,255,.1)",borderRadius:10,
                padding:"12px 16px",display:"flex",justifyContent:"space-between",
                alignItems:"center",gap:12}}>
                <span style={{fontSize:13,color:"#CBD5E0"}}>{q.q}</span>
                <span style={{background:"rgba(245,158,11,.15)",color:GOLD,
                  borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,
                  whiteSpace:"nowrap"}}>{q.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COACHABILITY SPOTLIGHT */}
      <section style={{padding:"80px 24px",background:"#fff"}}>
        <div style={{maxWidth:760,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:12,fontWeight:800,color:MINT,letterSpacing:"1px",
            textTransform:"uppercase",marginBottom:14}}>The Question That Changes Everything</div>
          <h2 style={{fontSize:"clamp(24px,3.5vw,38px)",fontWeight:900,color:INK,
            margin:"0 0 20px",lineHeight:1.25,letterSpacing:"-0.6px"}}>
            &ldquo;When your coach gave feedback today, how did you actually receive it?&rdquo;
          </h2>
          <p style={{fontSize:15,color:TL,lineHeight:1.8,maxWidth:580,margin:"0 auto 36px"}}>
            Most journals ask how hard you worked. We ask if you were coachable. Because research
            on elite athletic development consistently shows that coachability — not talent,
            not training volume, not natural ability — is the single highest-leverage variable
            in long-term swimmer development.
          </p>
          <p style={{fontSize:14,fontWeight:700,color:INK,fontStyle:"italic"}}>
            Log it for 30 days. Look at the pattern. It will surprise you.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"80px 24px",background:"#F8FAFC"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <h2 style={{fontSize:"clamp(22px,3vw,34px)",fontWeight:900,color:INK,
              margin:0,letterSpacing:"-0.5px"}}>What swimmers and coaches say</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
            {TESTIMONIALS.map(t=>(
              <div key={t.name} style={{background:"#fff",borderRadius:14,padding:"24px",
                border:"1px solid #E2E8F0",boxShadow:"0 1px 6px rgba(0,0,0,.05)"}}>
                <div style={{fontSize:22,marginBottom:14}}>⭐⭐⭐⭐⭐</div>
                <p style={{fontSize:14,color:TM,lineHeight:1.8,margin:"0 0 18px",
                  fontStyle:"italic"}}>&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div style={{fontSize:13,fontWeight:800,color:INK}}>{t.name}</div>
                  <div style={{fontSize:12,color:TL}}>
                    {t.age ? `Age ${t.age} · ` : ""}{t.team}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"80px 24px",background:"#fff"}}>
        <div style={{maxWidth:580,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:12,fontWeight:800,color:POOL,letterSpacing:"1px",
            textTransform:"uppercase",marginBottom:14}}>Pricing</div>
          <h2 style={{fontSize:"clamp(24px,4vw,38px)",fontWeight:900,color:INK,
            margin:"0 0 8px",letterSpacing:"-0.6px"}}>One swimmer. One price.</h2>
          <p style={{fontSize:14,color:TL,marginBottom:32}}>
            Less than one meet entry fee per month. And it runs on any device.
          </p>

          {/* Toggle */}
          <div style={{display:"flex",gap:0,background:"#F1F5F9",borderRadius:10,
            padding:4,marginBottom:36,width:280,margin:"0 auto 36px"}}>
            {[["Monthly","monthly"],[`Annual — Save 34%`,"annual"]].map(([l,k])=>(
              <button key={k} onClick={()=>setAnnual(k==="annual")}
                style={{flex:1,padding:"9px 14px",borderRadius:8,border:"none",
                  background:annual===(k==="annual")?"#fff":"transparent",
                  color:annual===(k==="annual")?INK:TL,
                  fontWeight:700,fontSize:12,cursor:"pointer",
                  boxShadow:annual===(k==="annual")?"0 1px 4px rgba(0,0,0,.1)":"none"}}>
                {l}
              </button>
            ))}
          </div>

          <div style={{background:`linear-gradient(135deg,${INK},${NAVY})`,borderRadius:20,
            padding:"36px 32px",textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:48,fontWeight:900,color:"#fff",lineHeight:1,letterSpacing:"-2px"}}>
              {annual?"$6.59":"$9.99"}
              <span style={{fontSize:18,fontWeight:400,color:"#93C5E8"}}>/mo</span>
            </div>
            {annual && (
              <div style={{fontSize:13,color:GOLD,marginTop:4,fontWeight:700}}>
                $79/year — save $41 vs monthly
              </div>
            )}
            <div style={{fontSize:13,color:"#93C5E8",margin:"20px 0 28px",lineHeight:1.8}}>
              Full journal access · Private AI mentor · Insights dashboard<br/>
              All future features included · Cancel anytime
            </div>
            <Link href="/login?signup=true"
              style={{display:"block",background:GOLD,color:INK,borderRadius:10,
                padding:"14px",fontWeight:900,fontSize:15,textDecoration:"none",
                boxShadow:"0 4px 16px rgba(245,158,11,.35)"}}>
              Start 14-Day Free Trial
            </Link>
            <p style={{fontSize:11,color:"rgba(255,255,255,.3)",margin:"12px 0 0"}}>
              No credit card required to start
            </p>
          </div>

          <div style={{fontSize:13,color:TL,lineHeight:1.8}}>
            Need multiple swimmers?{" "}
            <a href="mailto:hello@swimjournal.com"
              style={{color:POOL,fontWeight:700}}>
              Contact us for family and team plans.
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"80px 24px",background:`linear-gradient(135deg,${INK},${NAVY})`,
        textAlign:"center"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <div style={{fontSize:44,marginBottom:16}}>🏊</div>
          <h2 style={{fontSize:"clamp(24px,4vw,38px)",fontWeight:900,color:"#fff",
            margin:"0 0 16px",letterSpacing:"-0.6px"}}>
            The swimmers who journal outlast the ones who don&apos;t.
          </h2>
          <p style={{fontSize:14,color:"#93C5E8",lineHeight:1.8,marginBottom:32}}>
            14 days free. 5 minutes a day. Start tonight.
          </p>
          <Link href="/login?signup=true"
            style={{display:"inline-block",background:GOLD,color:INK,borderRadius:10,
              padding:"15px 36px",fontWeight:900,fontSize:15,textDecoration:"none",
              boxShadow:"0 8px 30px rgba(245,158,11,.3)"}}>
            Start Free — No Card Required
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:INK,padding:"32px 24px",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:20}}>🏊</span>
          <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)"}}>Swim Journal</span>
        </div>
        <div style={{display:"flex",gap:24}}>
          {[["Privacy Policy","#"],["Terms","#"],["Contact","mailto:hello@swimjournal.com"]].map(([l,h])=>(
            <a key={l} href={h}
              style={{fontSize:12,color:"rgba(255,255,255,.3)",textDecoration:"none"}}>{l}</a>
          ))}
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.2)"}}>
          &copy; {new Date().getFullYear()} Swim Journal
        </div>
      </footer>
    </div>
  );
}
