"use client";
// Swim Journal — Built for competitive swimmers
// Sport-psychology grounded · Coach-voice questions · Full persistence
import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// ─── PALETTE (pool at 5am — dark water, gold lane ropes, bright surface) ──────
const INK   = "#0D1B2A";   // deep pool dark
const NAVY  = "#0B2D59";   // competition navy
const POOL  = "#0891B2";   // water blue
const GOLD  = "#F59E0B";   // achievement gold
const MINT  = "#10B981";   // drop / completion
const RED   = "#EF4444";   // concern / add
const PURP  = "#8B5CF6";   // mental / goals
const bg    = "#F1F5F9";
const CARD  = "#FFFFFF";
const BDR   = "#E2E8F0";
const TL    = "#64748B";
const TM    = "#334155";
const TD    = "#0F172A";

const MOODS = [
  {e:"😴",l:"Wrecked"},
  {e:"😔",l:"Down"},
  {e:"😐",l:"Meh"},
  {e:"🙂",l:"OK"},
  {e:"😊",l:"Solid"},
  {e:"😄",l:"Great"},
  {e:"🔥",l:"On Fire"},
];

const COACH_QUOTES = [
  "Champions don't become champions in the ring. They're merely recognized there.",
  "Pain is temporary. Pride is forever.",
  "The water doesn't lie. Neither should your journal.",
  "Every great performance was built on a hundred invisible practices.",
  "Coachability is the fastest path from B to AA.",
  "The race you lose in your head is harder to fix than a bad turn.",
  "Log the practice. Even the bad ones. Especially the bad ones.",
  "Your competition is sleeping. You're journaling. That's the difference.",
  "One honest entry is worth ten dishonest ones.",
  "Gratitude isn't soft. It's the fastest way to reset your baseline.",
  "The swimmer who knows why they're slow can fix it. The one who doesn't can't.",
  "Reflection without honesty is just a story you're telling yourself.",
  "Every Olympic swimmer has bad practices. The great ones write about them.",
  "You can't negative split a race you haven't visualized first.",
  "Your streak is a promise to your future self.",
];

const ALL_EVENTS = [
  "50 Free","100 Free","200 Free","500 Free","1000 Free","1650 Free",
  "50 Back","100 Back","200 Back","50 Breast","100 Breast","200 Breast",
  "50 Fly","100 Fly","200 Fly","200 IM","400 IM"
];

const todayStr = () => new Date().toISOString().slice(0,10);
const fmtDate = d => {
  if (!d) return "";
  const [y,m,day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m,10)-1]} ${parseInt(day,10)}`;
};
const uid = () => "j" + Math.random().toString(36).slice(2,10);
const daysBetween = (d1, d2) => {
  const a = new Date(d1), b = new Date(d2);
  return Math.floor(Math.abs(b-a) / 86400000);
};

const calcStreak = entries => {
  if (!entries.length) return 0;
  const days = [...new Set(entries.map(e => e.date))].sort().reverse();
  const today = todayStr();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  const yStr = yesterday.toISOString().slice(0,10);
  if (days[0] !== today && days[0] !== yStr) return 0;
  let streak = 1;
  for (let i=1; i<days.length; i++) {
    if (daysBetween(days[i], days[i-1]) === 1) streak++;
    else break;
  }
  return streak;
};

const quoteOfDay = () => COACH_QUOTES[new Date().getDate() % COACH_QUOTES.length];

// ─── ATOMS ────────────────────────────────────────────────────────────────────
const Card = ({ children, style }) => (
  <div style={{background:CARD,borderRadius:14,border:`1px solid ${BDR}`,
    boxShadow:"0 1px 8px rgba(0,0,0,.07)",padding:22,...style}}>
    {children}
  </div>
);

const Btn = ({ children, onClick, v="primary", disabled, full, sm, icon }) => {
  const bgs = { primary:NAVY, gold:GOLD, ghost:"transparent", mint:MINT, pool:POOL, danger:RED };
  const cos = { primary:"#fff", gold:NAVY, ghost:NAVY, mint:"#fff", pool:"#fff", danger:"#fff" };
  const bg2 = disabled ? "#CBD5E0" : (bgs[v] || NAVY);
  const co  = disabled ? "#94A3B8" : (cos[v] || "#fff");
  return (
    <button onClick={disabled ? undefined : onClick} disabled={!!disabled}
      style={{background:bg2,color:co,
        border:v==="ghost" ? `1.5px solid ${BDR}` : "none",
        borderRadius:9,padding:sm?"7px 14px":"11px 22px",
        fontWeight:700,fontSize:sm?12:14,cursor:disabled?"not-allowed":"pointer",
        display:"inline-flex",alignItems:"center",gap:7,
        width:full?"100%":undefined,justifyContent:full?"center":undefined,
        boxShadow:v==="primary"&&!disabled?"0 3px 10px rgba(11,45,89,.3)":"none",
        transition:"opacity .15s"}}>
      {icon && <span>{icon}</span>}{children}
    </button>
  );
};

const RangeSlider = ({ value, onChange, min=1, max=10, color=POOL, label }) => (
  <div>
    {label && <div style={{fontSize:11,fontWeight:700,color:TM,marginBottom:6,
      textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</div>}
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(+e.target.value)}
        style={{flex:1,accentColor:color,height:6,cursor:"pointer"}}/>
      <div style={{width:52,height:52,borderRadius:12,background:color,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:22,fontWeight:900,color:"#fff",flexShrink:0}}>
        {value}
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:TL}}>
      <span>{min} — empty</span><span>{max} — peak</span>
    </div>
  </div>
);

const MoodGrid = ({ value, onChange }) => (
  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    {MOODS.map((m,i) => (
      <button key={i} onClick={() => onChange(i)}
        style={{background:value===i?GOLD:"#F8FAFC",border:`2px solid ${value===i?GOLD:BDR}`,
          borderRadius:10,padding:"10px 14px",cursor:"pointer",
          display:"flex",flexDirection:"column",alignItems:"center",gap:4,
          transition:"all .15s"}}>
        <span style={{fontSize:24}}>{m.e}</span>
        <span style={{fontSize:10,fontWeight:700,color:value===i?NAVY:TL}}>{m.l}</span>
      </button>
    ))}
  </div>
);

const CoachabilityPicker = ({ value, onChange }) => {
  const opts = [
    {k:"took",l:"Took it and tried it",e:"✅",c:MINT,  desc:"I applied the feedback immediately in practice"},
    {k:"heard",l:"Heard it, struggled to apply",e:"🤔",c:POOL,  desc:"The feedback landed but I couldn't execute it yet"},
    {k:"defended",l:"Defended or tuned it out",e:"🛑",c:RED, desc:"Honest answer — I pushed back or ignored it"},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {opts.map(o => (
        <button key={o.k} onClick={() => onChange(o.k)}
          style={{display:"flex",gap:14,alignItems:"center",padding:"13px 16px",
            borderRadius:10,border:`2px solid ${value===o.k?o.c:BDR}`,
            background:value===o.k?o.c+"18":"#F8FAFC",cursor:"pointer",textAlign:"left",
            transition:"all .15s"}}>
          <span style={{fontSize:22,flexShrink:0}}>{o.e}</span>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:value===o.k?o.c:TD}}>{o.l}</div>
            <div style={{fontSize:11,color:TL,marginTop:2}}>{o.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
};

const TA = ({ value, onChange, placeholder, rows=4 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    rows={rows} style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",
      borderRadius:10,border:`1.5px solid ${BDR}`,fontSize:14,fontFamily:"inherit",
      outline:"none",color:TD,lineHeight:1.7,resize:"vertical",
      background:"#FAFCFF"}}/>
);

const ProgressBar = ({ pct, color=GOLD }) => (
  <div style={{height:5,background:"#E2E8F0",borderRadius:3}}>
    <div style={{width:`${Math.min(pct,100)}%`,height:"100%",
      background:color,borderRadius:3,transition:"width .4s"}}/>
  </div>
);

// ─── SETUP SCREEN ─────────────────────────────────────────────────────────────
function SetupScreen({ onDone }) {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [events, setEvents] = useState(["100 Free","200 IM"]);
  const [gradYear, setGradYear] = useState("2030");

  const toggleEv = ev => setEvents(p => p.includes(ev) ? p.filter(x=>x!==ev) : [...p,ev]);

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(145deg,${INK} 0%,${NAVY} 100%)`,
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:520}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:44,marginBottom:10}}>🏊</div>
          <div style={{fontSize:32,fontWeight:900,color:"#fff",letterSpacing:"-0.8px",marginBottom:8}}>
            Swim Journal
          </div>
          <div style={{fontSize:14,color:"#93C5E8",lineHeight:1.6}}>
            30 seconds to set up. Built for serious competitive swimmers.<br/>
            Practice. Meets. Goals. And a place to ask what you can&apos;t ask anyone else.
          </div>
        </div>
        <Card>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:TM,marginBottom:5,
              textTransform:"uppercase",letterSpacing:"0.5px"}}>Your Name *</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="First name works great"
              style={{width:"100%",boxSizing:"border-box",padding:"11px 14px",borderRadius:9,
                border:`1.5px solid ${BDR}`,fontSize:14,fontFamily:"inherit",outline:"none",color:TD}}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:TM,marginBottom:5,
              textTransform:"uppercase",letterSpacing:"0.5px"}}>Club Team</label>
            <input value={team} onChange={e=>setTeam(e.target.value)} placeholder="e.g. AGS-GU, NCAP, NBAC"
              style={{width:"100%",boxSizing:"border-box",padding:"11px 14px",borderRadius:9,
                border:`1.5px solid ${BDR}`,fontSize:14,fontFamily:"inherit",outline:"none",color:TD}}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:TM,marginBottom:5,
              textTransform:"uppercase",letterSpacing:"0.5px"}}>Graduation Year</label>
            <input value={gradYear} onChange={e=>setGradYear(e.target.value)} placeholder="2030" type="number"
              style={{width:"100%",boxSizing:"border-box",padding:"11px 14px",borderRadius:9,
                border:`1.5px solid ${BDR}`,fontSize:14,fontFamily:"inherit",outline:"none",color:TD}}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:TM,marginBottom:8,
              textTransform:"uppercase",letterSpacing:"0.5px"}}>Your Primary Events (pick all that apply)</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {ALL_EVENTS.map(e => (
                <button key={e} onClick={()=>toggleEv(e)}
                  style={{padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,
                    border:`1.5px solid ${events.includes(e)?NAVY:BDR}`,
                    background:events.includes(e)?NAVY:"#F8FAFC",
                    color:events.includes(e)?"#fff":TM,cursor:"pointer"}}>
                  {e}
                </button>
              ))}
            </div>
          </div>
          <Btn full onClick={() => onDone({name:name.trim(),team,events,gradYear})}
            disabled={!name.trim()} icon="🏊">
            Start My Journal
          </Btn>
        </Card>
      </div>
    </div>
  );
}

// ─── PRACTICE ENTRY FLOW ──────────────────────────────────────────────────────
const PRACTICE_STEPS = [
  "energy", "mood", "hardest", "clicked", "coachability", "tomorrow", "gratitude"
];

function PracticeFlow({ onSave, onCancel, existing }) {
  const init = existing || {
    energy:7, mood:3, hardest:"", clicked:"", coachability:"", tomorrow:"", gratitude:""
  };
  const [step, setStep] = useState(0);
  const [d, setD] = useState(init);
  const up = (k,v) => setD(p => ({...p,[k]:v}));

  const canNext = () => {
    if (step===0) return d.energy > 0;
    if (step===1) return d.mood >= 0;
    if (step===2) return d.hardest.trim().length > 3;
    if (step===3) return d.clicked.trim().length > 3;
    if (step===4) return d.coachability !== "";
    if (step===5) return d.tomorrow.trim().length > 3;
    if (step===6) return d.gratitude.trim().length > 3;
    return true;
  };

  const totalSteps = PRACTICE_STEPS.length;
  const isLast = step === totalSteps - 1;

  const questions = [
    {
      num:"01", label:"Energy Check",
      q:"Rate your energy going INTO the water today.",
      sub:"Not your mood — your physical tank. Be honest with yourself.",
      render: () => <RangeSlider value={d.energy} onChange={v=>up("energy",v)} color={POOL}/>
    },
    {
      num:"02", label:"Headspace",
      q:"How would you describe where your head was at practice today?",
      sub:"Pick the one that fits best — no judgment either way.",
      render: () => <MoodGrid value={d.mood} onChange={v=>up("mood",v)}/>
    },
    {
      num:"03", label:"What Was Hard",
      q:"What was the most difficult part of today's practice?",
      sub:"Be specific — not 'it was hard' but what exactly, and why.",
      render: () => <TA value={d.hardest} onChange={v=>up("hardest",v)} placeholder="The 10x100s on 1:20 felt impossible after the first 4. My underwaters were dying..."/>
    },
    {
      num:"04", label:"What Clicked",
      q:"What felt good, clicked, or improved today?",
      sub:"There's always something. Even on a bad day, find the one thing.",
      render: () => <TA value={d.clicked} onChange={v=>up("clicked",v)} placeholder="My breaststroke pullout felt much more powerful in the second set..."/>
    },
    {
      num:"05", label:"Coachability",
      q:"When your coach gave feedback today, how did you actually receive it?",
      sub:"This single question predicts development more than almost anything else. Be ruthlessly honest.",
      render: () => <CoachabilityPicker value={d.coachability} onChange={v=>up("coachability",v)}/>
    },
    {
      num:"06", label:"Tomorrow's Focus",
      q:"Name one specific thing you will do differently at tomorrow's practice.",
      sub:"One thing. Not five. The more specific, the more likely you actually do it.",
      render: () => <TA value={d.tomorrow} onChange={v=>up("tomorrow",v)} rows={3} placeholder="I'm going to push through the pain on the back half of every fast swim instead of backing off..."/>
    },
    {
      num:"07", label:"Gratitude",
      q:"Name one thing about your swimming that you're genuinely grateful for today.",
      sub:"Not toxic positivity — a real anchor. Could be a teammate, a coach, your health, your training.",
      render: () => <TA value={d.gratitude} onChange={v=>up("gratitude",v)} rows={3} placeholder="I'm grateful my coach noticed my fly and took the time to work with me on it for 10 minutes..."/>
    },
  ];

  const q = questions[step];

  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"28px 24px"}}>
      {/* Progress */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
        <button onClick={onCancel} style={{background:"none",border:"none",color:TL,
          fontWeight:700,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:4}}>
          ← Cancel
        </button>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,
            color:TL,marginBottom:5}}>
            <span>Today's Practice Entry</span>
            <span>{step+1} of {totalSteps}</span>
          </div>
          <ProgressBar pct={(step+1)/totalSteps*100}/>
        </div>
      </div>

      {/* Question card */}
      <Card style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${NAVY},${POOL})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,fontWeight:900,color:"#fff",flexShrink:0,letterSpacing:"-0.5px"}}>
            {q.num}
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:POOL,textTransform:"uppercase",
              letterSpacing:"0.6px",marginBottom:2}}>{q.label}</div>
            <div style={{fontSize:17,fontWeight:800,color:TD,lineHeight:1.3}}>{q.q}</div>
          </div>
        </div>
        <div style={{fontSize:12,color:TL,marginBottom:18,paddingLeft:52,
          fontStyle:"italic",lineHeight:1.6}}>{q.sub}</div>
        <div style={{paddingLeft:52}}>
          {q.render()}
        </div>
      </Card>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          {step > 0 && (
            <Btn v="ghost" sm onClick={() => setStep(p=>p-1)}>← Back</Btn>
          )}
        </div>
        <Btn onClick={() => {
            if (isLast) onSave(d);
            else setStep(p=>p+1);
          }}
          disabled={!canNext()}
          v={isLast?"gold":"primary"}
          icon={isLast?"✓":undefined}>
          {isLast ? "Save Practice Entry" : "Next →"}
        </Btn>
      </div>
    </div>
  );
}

// ─── PRE-MEET FLOW ────────────────────────────────────────────────────────────
function PreMeetFlow({ onSave, onCancel, lastMessage }) {
  const [d, setD] = useState({
    meetName:"", readiness:7, feelingWord:"", racePlans:[{event:"100 Free",target:"",strategy:""}],
    swimmingFor:"", iControl:"", coachToSee:"", greatDay:""
  });
  const [step, setStep] = useState(0);
  const up = (k,v) => setD(p=>({...p,[k]:v}));
  const updPlan = (i,k,v) => setD(p=>({...p,racePlans:p.racePlans.map((r,j)=>j===i?{...r,[k]:v}:r)}));
  const addPlan = () => setD(p=>({...p,racePlans:[...p.racePlans,{event:"100 Free",target:"",strategy:""}]}));
  const delPlan = i => setD(p=>({...p,racePlans:p.racePlans.filter((_,j)=>j!==i)}));

  const steps = [
    {
      num:"01", label:"Meet & Readiness",
      q:"What meet is this, and how ready do you ACTUALLY feel right now?",
      sub:"Not how you want to feel. Your real number. Coaches can read the difference.",
      can: () => d.meetName.trim().length>2,
      render: () => (
        <div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:TM,marginBottom:6,
              textTransform:"uppercase",letterSpacing:"0.5px"}}>Meet Name</label>
            <input value={d.meetName} onChange={e=>up("meetName",e.target.value)}
              placeholder="e.g. BATS June Invitational"
              style={{width:"100%",boxSizing:"border-box",padding:"11px 14px",borderRadius:9,
                border:`1.5px solid ${BDR}`,fontSize:14,fontFamily:"inherit",outline:"none",color:TD}}/>
          </div>
          <RangeSlider value={d.readiness} onChange={v=>up("readiness",v)}
            color={d.readiness>=7?MINT:d.readiness>=5?GOLD:RED}
            label="Readiness Right Now (1 = flat, 10 = peaked)"/>
          <div style={{marginTop:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:TM,marginBottom:6,
              textTransform:"uppercase",letterSpacing:"0.5px"}}>In one word — how are you feeling?</label>
            <input value={d.feelingWord} onChange={e=>up("feelingWord",e.target.value)}
              placeholder="Nervous / Fired up / Flat / Confident / Anxious / Ready..."
              style={{width:"100%",boxSizing:"border-box",padding:"11px 14px",borderRadius:9,
                border:`1.5px solid ${BDR}`,fontSize:14,fontFamily:"inherit",outline:"none",color:TD}}/>
          </div>
        </div>
      )
    },
    {
      num:"02", label:"Race Plans",
      q:"Write your race plan for each event you're swimming today.",
      sub:"Include target splits, strategy, what you're focusing on technically. Vague plans produce vague races.",
      can: () => d.racePlans.every(r=>r.strategy.trim().length>5),
      render: () => (
        <div>
          {d.racePlans.map((r,i) => (
            <div key={i} style={{marginBottom:18,paddingBottom:18,
              borderBottom:i<d.racePlans.length-1?`1px solid ${BDR}`:"none"}}>
              <div style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-end"}}>
                <div style={{flex:1}}>
                  {i===0 && <label style={{display:"block",fontSize:10,fontWeight:700,color:TL,
                    marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Event</label>}
                  <select value={r.event} onChange={e=>updPlan(i,"event",e.target.value)}
                    style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${BDR}`,
                      fontSize:13,background:"#fff",outline:"none",color:TD}}>
                    {ALL_EVENTS.map(e=><option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div style={{width:110}}>
                  {i===0 && <label style={{display:"block",fontSize:10,fontWeight:700,color:TL,
                    marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Goal Time</label>}
                  <input value={r.target} onChange={e=>updPlan(i,"target",e.target.value)}
                    placeholder="1:05.00"
                    style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",borderRadius:8,
                      border:`1.5px solid ${BDR}`,fontSize:13,fontFamily:"inherit",outline:"none",color:TD}}/>
                </div>
                <button onClick={()=>delPlan(i)}
                  style={{background:"none",border:"none",color:"#CBD5E0",
                    cursor:"pointer",fontSize:18,paddingBottom:2}}>✕</button>
              </div>
              <TA value={r.strategy} onChange={v=>updPlan(i,"strategy",v)} rows={2}
                placeholder={`Race strategy for ${r.event}: splits, focal point, how to handle pain in the back half...`}/>
            </div>
          ))}
          <button onClick={addPlan}
            style={{background:"none",border:`1.5px dashed ${BDR}`,color:POOL,fontWeight:700,
              borderRadius:9,padding:"9px 16px",width:"100%",cursor:"pointer",
              fontSize:12,marginTop:4}}>
            + Add Another Event
          </button>
        </div>
      )
    },
    {
      num:"03", label:"Your Why",
      q:"Who or what are you swimming for today?",
      sub:"The swimmers who race best connect performance to intrinsic motivation. Think beyond the time.",
      can: () => d.swimmingFor.trim().length>5,
      render: () => <TA value={d.swimmingFor} onChange={v=>up("swimmingFor",v)} rows={3}
        placeholder="Today I'm swimming for the version of me who showed up to 5am practice when I didn't feel like it..."/>
    },
    {
      num:"04", label:"What You Control",
      q:"Name one thing you have complete control over today — and it cannot be your time.",
      sub:"Times are outputs. They follow the inputs you control. Name an input.",
      can: () => d.iControl.trim().length>5,
      render: () => <TA value={d.iControl} onChange={v=>up("iControl",v)} rows={3}
        placeholder="I control my underwater on every turn. Every one, every race, no exceptions today."/>
    },
    {
      num:"05", label:"What Your Coach Should See",
      q:"What do you want your coach to notice about you today — beyond the times?",
      sub:"Great meets are when the work shows. What work are you showing?",
      can: () => d.coachToSee.trim().length>5,
      render: () => (
        <div>
          <TA value={d.coachToSee} onChange={v=>up("coachToSee",v)} rows={3}
            placeholder="I want Coach to see my breaststroke pullout on every turn. We've drilled it for 3 weeks. Today it shows."/>
          <div style={{marginTop:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:TM,marginBottom:6,
              textTransform:"uppercase",letterSpacing:"0.5px"}}>What does a great day look like tonight?</label>
            <TA value={d.greatDay} onChange={v=>up("greatDay",v)} rows={2}
              placeholder="By tonight I'll have raced with full commitment, no matter what the clock says."/>
          </div>
        </div>
      )
    },
  ];

  const cur = steps[step];
  const isLast = step === steps.length-1;

  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"28px 24px"}}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
        <button onClick={onCancel} style={{background:"none",border:"none",color:TL,
          fontWeight:700,cursor:"pointer",fontSize:13}}>← Cancel</button>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:TL,marginBottom:5}}>
            <span>Pre-Meet Journal</span>
            <span style={{color:GOLD,fontWeight:700}}>🏁 Meet Day</span>
          </div>
          <ProgressBar pct={(step+1)/steps.length*100} color={GOLD}/>
        </div>
      </div>

      {/* Last message from past self */}
      {step===0 && lastMessage && (
        <div style={{background:`linear-gradient(135deg,${INK},${NAVY})`,borderRadius:14,
          padding:"18px 20px",marginBottom:20,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",
            fontSize:50,opacity:0.08,userSelect:"none"}}>✉️</div>
          <div style={{fontSize:11,fontWeight:800,color:GOLD,letterSpacing:"0.6px",
            textTransform:"uppercase",marginBottom:8}}>📬 A Message From Past You</div>
          <div style={{fontSize:13.5,color:"#CBD5E0",lineHeight:1.75,fontStyle:"italic"}}>
            &ldquo;{lastMessage}&rdquo;
          </div>
          <div style={{fontSize:10,color:"#64748B",marginTop:8}}>Written before your last meet</div>
        </div>
      )}

      <Card style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:20}}>
          <div style={{width:40,height:40,borderRadius:10,
            background:`linear-gradient(135deg,#92400E,${GOLD})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,fontWeight:900,color:"#fff",flexShrink:0}}>
            {cur.num}
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:GOLD,textTransform:"uppercase",
              letterSpacing:"0.6px",marginBottom:2}}>{cur.label}</div>
            <div style={{fontSize:17,fontWeight:800,color:TD,lineHeight:1.3}}>{cur.q}</div>
          </div>
        </div>
        <div style={{fontSize:12,color:TL,marginBottom:18,paddingLeft:52,
          fontStyle:"italic",lineHeight:1.6}}>{cur.sub}</div>
        <div style={{paddingLeft:52}}>{cur.render()}</div>
      </Card>

      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div>{step>0 && <Btn v="ghost" sm onClick={()=>setStep(p=>p-1)}>← Back</Btn>}</div>
        <Btn onClick={() => { if(isLast) onSave(d); else setStep(p=>p+1); }}
          disabled={!cur.can()} v={isLast?"gold":"primary"}
          icon={isLast?"🏁":undefined}>
          {isLast?"Save Pre-Meet Entry":"Next →"}
        </Btn>
      </div>
    </div>
  );
}

// ─── POST-MEET FLOW ────────────────────────────────────────────────────────────
function PostMeetFlow({ onSave, onCancel, preMeet }) {
  const [d, setD] = useState({
    moodNow:5, swims:preMeet?.racePlans?.map(r=>({event:r.event,seed:r.target,final:"",proud:"",improve:""})) || [{event:"100 Free",seed:"",final:"",proud:"",improve:""}],
    proudOf:"", concern:"", lesson:"", messageFutureMe:"", rating:7
  });
  const [step, setStep] = useState(0);
  const up = (k,v) => setD(p=>({...p,[k]:v}));
  const updSwim = (i,k,v) => setD(p=>({...p,swims:p.swims.map((s,j)=>j===i?{...s,[k]:v}:s)}));

  const steps = [
    {
      num:"01", label:"Right Now",
      q:"How are you feeling in this exact moment? Be honest.",
      sub:"Not how you want to feel — your real emotional state coming off the pool deck.",
      can: () => true,
      render: () => (
        <div>
          <RangeSlider value={d.moodNow} onChange={v=>up("moodNow",v)}
            color={d.moodNow>=7?MINT:d.moodNow>=5?GOLD:RED}
            label="Emotional state right now (1 = rough, 10 = elated)"/>
          <div style={{marginTop:20}}>
            <div style={{fontSize:11,fontWeight:700,color:TM,marginBottom:8,
              textTransform:"uppercase",letterSpacing:"0.5px"}}>Overall meet rating</div>
            <RangeSlider value={d.rating} onChange={v=>up("rating",v)} color={PURP}/>
          </div>
        </div>
      )
    },
    {
      num:"02", label:"Swim Breakdown",
      q:"Break down each swim — times and one honest reflection per event.",
      sub:"The seed is what you expected. The final is what happened. The reflection is what you take home.",
      can: () => d.swims.every(s=>s.final.trim()),
      render: () => (
        <div>
          {d.swims.map((s,i)=>(
            <div key={i} style={{marginBottom:20,padding:"16px",background:"#F8FAFC",
              borderRadius:10,border:`1px solid ${BDR}`}}>
              <div style={{fontSize:13,fontWeight:800,color:NAVY,marginBottom:12}}>
                {s.event}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                {[["Seed / Goal",s.seed,"seed"],["Final Time",s.final,"final"]].map(([l,v,k])=>(
                  <div key={k}>
                    <label style={{display:"block",fontSize:10,fontWeight:700,color:TL,
                      marginBottom:4,textTransform:"uppercase",letterSpacing:"0.4px"}}>{l}</label>
                    <input value={v} onChange={e=>updSwim(i,k,e.target.value)}
                      placeholder="1:07.04"
                      style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",borderRadius:8,
                        border:`1.5px solid ${BDR}`,fontSize:13,fontFamily:"inherit",
                        outline:"none",color:TD,background:"#fff"}}/>
                  </div>
                ))}
              </div>
              <div style={{marginBottom:8}}>
                <label style={{display:"block",fontSize:10,fontWeight:700,color:MINT,
                  marginBottom:4,textTransform:"uppercase",letterSpacing:"0.4px"}}>What you're proud of in this swim</label>
                <input value={s.proud} onChange={e=>updSwim(i,"proud",e.target.value)}
                  placeholder="Find something — even if it was a rough swim..."
                  style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",borderRadius:8,
                    border:`1.5px solid ${BDR}`,fontSize:13,fontFamily:"inherit",
                    outline:"none",color:TD,background:"#fff"}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:10,fontWeight:700,color:GOLD,
                  marginBottom:4,textTransform:"uppercase",letterSpacing:"0.4px"}}>One thing to improve before the next meet</label>
                <input value={s.improve} onChange={e=>updSwim(i,"improve",e.target.value)}
                  placeholder="Specific and technical..."
                  style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",borderRadius:8,
                    border:`1.5px solid ${BDR}`,fontSize:13,fontFamily:"inherit",
                    outline:"none",color:TD,background:"#fff"}}/>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      num:"03", label:"Non-Negotiable Pride",
      q:"What are you proud of from today? Find something — even if every time was a miss.",
      sub:"This is a requirement, not optional. A great coach finds the win in every meet. So do elite swimmers.",
      can: () => d.proudOf.trim().length>5,
      render: () => <TA value={d.proudOf} onChange={v=>up("proudOf",v)} rows={4}
        placeholder="I raced the 200 Free with the exact strategy I wrote this morning. I went out controlled and came home fast. The time was a 2:32 instead of 2:29 — but the race was mine from start to finish..."/>
    },
    {
      num:"04", label:"Honest Concern",
      q:"One honest concern or area to work on before your next meet.",
      sub:"One. Not a list. The most important thing. Be specific enough that your coach could act on it.",
      can: () => d.concern.trim().length>5,
      render: () => <TA value={d.concern} onChange={v=>up("concern",v)} rows={3}
        placeholder="My turns on the 200 IM are giving away time I'm earning in the middle. Specifically the fly-to-back turn — I'm not getting enough push..."/>
    },
    {
      num:"05", label:"What Today Taught You",
      q:"What did this meet teach you about yourself as a swimmer?",
      sub:"The athletes who improve fastest are the ones who extract learning from every competition — not just the good ones.",
      can: () => d.lesson.trim().length>5,
      render: () => <TA value={d.lesson} onChange={v=>up("lesson",v)} rows={4}
        placeholder="I learned that my mental game falls apart when I watch other swimmers in warmup. I need to lock in early and stop comparing. My preparation was there — the racing mind wasn't."/>
    },
    {
      num:"06", label:"Message to Future You",
      q:"Write a note to yourself that you'll read before your NEXT meet.",
      sub:"This will show up at the top of your pre-meet journal next time. Write it to the version of you that's nervous on deck in 4 weeks.",
      can: () => d.messageFutureMe.trim().length>10,
      render: () => (
        <div>
          <div style={{background:`linear-gradient(135deg,${INK},${NAVY})`,borderRadius:10,
            padding:"12px 16px",marginBottom:14}}>
            <div style={{fontSize:11,color:"#93C5E8",fontWeight:600}}>
              📬 This message appears at the top of your next pre-meet journal
            </div>
          </div>
          <TA value={d.messageFutureMe} onChange={v=>up("messageFutureMe",v)} rows={5}
            placeholder="Hey — you've done the work. Whatever you're feeling right now on deck, the training was real. Your underwaters are better than they were. Trust the 5am practices. Trust your coach. Race YOUR race from the first stroke. You've got this..."/>
        </div>
      )
    },
  ];

  const cur = steps[step];
  const isLast = step === steps.length-1;

  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"28px 24px"}}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
        <button onClick={onCancel} style={{background:"none",border:"none",color:TL,
          fontWeight:700,cursor:"pointer",fontSize:13}}>← Cancel</button>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:TL,marginBottom:5}}>
            <span>Post-Meet Journal</span>
            <span style={{color:MINT,fontWeight:700}}>✓ Meet Complete</span>
          </div>
          <ProgressBar pct={(step+1)/steps.length*100} color={MINT}/>
        </div>
      </div>

      <Card style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:20}}>
          <div style={{width:40,height:40,borderRadius:10,
            background:`linear-gradient(135deg,#065F46,${MINT})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,fontWeight:900,color:"#fff",flexShrink:0}}>
            {cur.num}
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:MINT,textTransform:"uppercase",
              letterSpacing:"0.6px",marginBottom:2}}>{cur.label}</div>
            <div style={{fontSize:17,fontWeight:800,color:TD,lineHeight:1.3}}>{cur.q}</div>
          </div>
        </div>
        <div style={{fontSize:12,color:TL,marginBottom:18,paddingLeft:52,
          fontStyle:"italic",lineHeight:1.6}}>{cur.sub}</div>
        <div style={{paddingLeft:52}}>{cur.render()}</div>
      </Card>

      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div>{step>0 && <Btn v="ghost" sm onClick={()=>setStep(p=>p-1)}>← Back</Btn>}</div>
        <Btn onClick={()=>{ if(isLast) onSave(d); else setStep(p=>p+1); }}
          disabled={!cur.can()} v={isLast?"mint":"primary"}
          icon={isLast?"✓":undefined}>
          {isLast?"Save Post-Meet Entry":"Next →"}
        </Btn>
      </div>
    </div>
  );
}

// ─── GOALS HUB ────────────────────────────────────────────────────────────────
function GoalsHub({ goals, onSave }) {
  const [g, setG] = useState(goals);
  const [editing, setEditing] = useState(!goals.headline);
  const up = (k,v) => setG(p=>({...p,[k]:v}));
  const upT = (i,k,v) => setG(p=>({...p,times:p.times.map((t,j)=>j===i?{...t,[k]:v}:t)}));
  const addT = () => setG(p=>({...p,times:[...p.times,{event:"100 Free",target:"",meet:"",achieved:false}]}));

  if (!editing && goals.headline) return (
    <div style={{maxWidth:680,margin:"0 auto",padding:"28px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <div style={{fontSize:24,fontWeight:900,color:NAVY,letterSpacing:"-0.4px"}}>
            Season Goals
          </div>
          <div style={{fontSize:13,color:TL,marginTop:3}}>Your commitments for this season.</div>
        </div>
        <Btn v="ghost" sm onClick={()=>setEditing(true)}>Edit Goals</Btn>
      </div>

      <Card style={{marginBottom:16,background:`linear-gradient(135deg,${INK},${NAVY})`,border:"none"}}>
        <div style={{fontSize:11,fontWeight:700,color:GOLD,letterSpacing:"0.6px",
          textTransform:"uppercase",marginBottom:8}}>🎯 Season Headline Goal</div>
        <div style={{fontSize:18,fontWeight:800,color:"#fff",lineHeight:1.4}}>
          {goals.headline}
        </div>
      </Card>

      <Card style={{marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:800,color:NAVY,marginBottom:14,borderBottom:`2px solid ${GOLD}`,paddingBottom:8}}>
          ⏱ Time Goals
        </div>
        {goals.times.filter(t=>t.target).map((t,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,
            padding:"12px 14px",borderRadius:10,
            background:t.achieved?"#DCFCE7":"#F8FAFC",border:`1px solid ${t.achieved?"#BBF7D0":BDR}`}}>
            <span style={{fontSize:20}}>{t.achieved?"✅":"🎯"}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:TD}}>{t.event}</div>
              <div style={{fontSize:12,color:TL}}>{t.meet || "Any meet"}</div>
            </div>
            <div style={{fontWeight:900,fontSize:18,color:t.achieved?MINT:NAVY}}>{t.target}</div>
            <button onClick={() => {
              const newT = goals.times.map((x,j)=>j===i?{...x,achieved:!x.achieved}:x);
              onSave({...goals,times:newT});
            }} style={{background:"none",border:`1px solid ${BDR}`,borderRadius:7,
              padding:"5px 10px",cursor:"pointer",fontSize:11,fontWeight:700,color:TL}}>
              {t.achieved?"Unmark":"✓ Hit it"}
            </button>
          </div>
        ))}
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {l:"Technique Goal",v:goals.technique,icon:"🏊",c:POOL},
          {l:"Mental Goal",v:goals.mental,icon:"🧠",c:PURP},
          {l:"Academic Goal",v:goals.academic,icon:"📚",c:GOLD},
        ].map(r => r.v ? (
          <Card key={r.l} style={{borderTop:`3px solid ${r.c}`}}>
            <div style={{fontSize:10,fontWeight:800,color:r.c,textTransform:"uppercase",
              letterSpacing:"0.5px",marginBottom:8}}>{r.icon} {r.l}</div>
            <div style={{fontSize:13,color:TM,lineHeight:1.6}}>{r.v}</div>
          </Card>
        ) : null)}
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:640,margin:"0 auto",padding:"28px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div style={{fontSize:22,fontWeight:900,color:NAVY}}>Set Season Goals</div>
        {goals.headline && <Btn v="ghost" sm onClick={()=>setEditing(false)}>Cancel</Btn>}
      </div>

      <Card style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:12,fontWeight:800,color:NAVY,marginBottom:6}}>
          🎯 Season Headline Goal
        </label>
        <div style={{fontSize:12,color:TL,marginBottom:10,fontStyle:"italic"}}>
          One ambitious but achievable headline. Specific. Time-bound. Yours.
        </div>
        <TA value={g.headline} onChange={v=>up("headline",v)} rows={2}
          placeholder="Drop under 1:05 in the 100 Free at BATS Invite and earn my BB standard by June 2026..."/>
      </Card>

      <Card style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:800,color:NAVY,marginBottom:14}}>⏱ Time Goals (up to 3)</div>
        {g.times.map((t,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1.2fr 32px",
            gap:8,marginBottom:10,alignItems:"flex-end"}}>
            <div>
              {i===0&&<label style={{display:"block",fontSize:10,fontWeight:700,color:TL,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.4px"}}>Event</label>}
              <select value={t.event} onChange={e=>upT(i,"event",e.target.value)}
                style={{width:"100%",padding:"9px 10px",borderRadius:8,border:`1.5px solid ${BDR}`,fontSize:12,background:"#fff",outline:"none",color:TD}}>
                {ALL_EVENTS.map(e=><option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              {i===0&&<label style={{display:"block",fontSize:10,fontWeight:700,color:TL,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.4px"}}>Target Time</label>}
              <input value={t.target} onChange={e=>upT(i,"target",e.target.value)}
                placeholder="1:05.00"
                style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",borderRadius:8,border:`1.5px solid ${BDR}`,fontSize:12,fontFamily:"inherit",outline:"none",color:TD}}/>
            </div>
            <div>
              {i===0&&<label style={{display:"block",fontSize:10,fontWeight:700,color:TL,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.4px"}}>Target Meet</label>}
              <input value={t.meet} onChange={e=>upT(i,"meet",e.target.value)}
                placeholder="BATS June Invite"
                style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",borderRadius:8,border:`1.5px solid ${BDR}`,fontSize:12,fontFamily:"inherit",outline:"none",color:TD}}/>
            </div>
            <button onClick={()=>setG(p=>({...p,times:p.times.filter((_,j)=>j!==i)}))}
              style={{background:"none",border:"none",color:"#CBD5E0",cursor:"pointer",fontSize:18}}>✕</button>
          </div>
        ))}
        {g.times.length<3 && (
          <button onClick={addT}
            style={{background:"none",border:`1.5px dashed ${BDR}`,color:POOL,fontWeight:700,
              borderRadius:8,padding:"8px",width:"100%",cursor:"pointer",fontSize:12,marginTop:4}}>
            + Add Time Goal
          </button>
        )}
      </Card>

      {[{k:"technique",l:"🏊 Technique Goal",ph:"The one technical thing you're committed to fixing this season..."},
        {k:"mental",l:"🧠 Mental / Character Goal",ph:"What mental skill are you building? Coachability? Composure? Consistency?"},
        {k:"academic",l:"📚 Academic Goal",ph:"Your GPA target or academic achievement this season..."}].map(f=>(
        <Card key={f.k} style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:12,fontWeight:800,color:NAVY,marginBottom:6}}>{f.l}</label>
          <TA value={g[f.k]} onChange={v=>up(f.k,v)} rows={2} placeholder={f.ph}/>
        </Card>
      ))}

      <Btn full v="gold" onClick={()=>{onSave(g);setEditing(false);}} disabled={!g.headline.trim()}>
        Save Season Goals
      </Btn>
    </div>
  );
}

// ─── INSIGHTS ─────────────────────────────────────────────────────────────────
function Insights({ entries }) {
  const practices = entries.filter(e=>e.type==="practice");
  const posts = entries.filter(e=>e.type==="post_meet");

  const energyData = practices.slice(-14).map((e,i)=>({
    day:`D${i+1}`,energy:e.energy,mood:e.mood+1
  }));

  const coachMap = { took:0, heard:0, defended:0 };
  practices.forEach(e=>{ if(e.coachability&&coachMap[e.coachability]!==undefined) coachMap[e.coachability]++; });
  const coachData = [
    {name:"Took It",count:coachMap.took,fill:MINT},
    {name:"Heard It",count:coachMap.heard,fill:GOLD},
    {name:"Defended",count:coachMap.defended,fill:RED},
  ];

  const avgE = practices.length ? (practices.reduce((a,e)=>a+e.energy,0)/practices.length).toFixed(1) : "—";
  const pct = practices.length ? Math.round(practices.filter(e=>e.coachability==="took").length/practices.length*100) : 0;

  const meetRatings = posts.map((e,i)=>({meet:`M${i+1}`,rating:e.rating||7,mood:e.moodNow||5}));

  if (!practices.length) return (
    <div style={{textAlign:"center",padding:"60px 24px",color:TL}}>
      <div style={{fontSize:48,marginBottom:16}}>📊</div>
      <div style={{fontSize:18,fontWeight:700,color:NAVY,marginBottom:8}}>No Data Yet</div>
      <div style={{fontSize:13}}>Log 3+ practices to start seeing patterns in your training.</div>
    </div>
  );

  return (
    <div style={{maxWidth:780,margin:"0 auto",padding:"28px 24px"}}>
      <div style={{fontSize:24,fontWeight:900,color:NAVY,marginBottom:4}}>Your Insights</div>
      <div style={{fontSize:13,color:TL,marginBottom:24}}>
        Patterns from {practices.length} practice {practices.length===1?"entry":"entries"}. Data builds over time.
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[
          {l:"Avg Energy",v:avgE,icon:"⚡",c:POOL},
          {l:"Coachability",v:`${pct}%`,icon:"✅",c:MINT,sub:"took feedback"},
          {l:"Meets Logged",v:posts.length,icon:"🏁",c:GOLD},
        ].map(s=>(
          <Card key={s.l} style={{textAlign:"center",padding:"18px 14px"}}>
            <div style={{fontSize:28,marginBottom:6}}>{s.icon}</div>
            <div style={{fontSize:28,fontWeight:900,color:s.c}}>{s.v}</div>
            <div style={{fontSize:11,color:TL,fontWeight:600}}>{s.l}</div>
            {s.sub&&<div style={{fontSize:10,color:TL}}>{s.sub}</div>}
          </Card>
        ))}
      </div>

      {energyData.length>2 && (
        <Card style={{marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:800,color:NAVY,marginBottom:14}}>
            ⚡ Energy &amp; Mood — Last 14 Practices
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={energyData} margin={{top:4,right:4,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:10,fill:TL}} axisLine={false} tickLine={false}/>
              <YAxis domain={[1,10]} tick={{fontSize:10,fill:TL}} axisLine={false} tickLine={false} width={22}/>
              <Tooltip contentStyle={{borderRadius:8,border:`1px solid ${BDR}`,fontSize:12}}/>
              <Line type="monotone" dataKey="energy" stroke={POOL} strokeWidth={2.5}
                dot={{r:3,fill:POOL,stroke:"#fff",strokeWidth:2}} name="Energy"/>
              <Line type="monotone" dataKey="mood" stroke={GOLD} strokeWidth={2}
                dot={{r:3,fill:GOLD,stroke:"#fff",strokeWidth:2}} strokeDasharray="4 3" name="Mood"/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
        <Card>
          <div style={{fontSize:13,fontWeight:800,color:NAVY,marginBottom:14}}>
            🎯 Coachability Breakdown
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={coachData} margin={{top:4,right:4,bottom:0,left:0}}>
              <XAxis dataKey="name" tick={{fontSize:10,fill:TL}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:TL}} axisLine={false} tickLine={false} width={22}/>
              <Tooltip contentStyle={{borderRadius:8,border:`1px solid ${BDR}`,fontSize:12}}/>
              <Bar dataKey="count" fill={POOL} radius={[6,6,0,0]}>
                {coachData.map((d,i)=>(
                  <rect key={i} fill={d.fill}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{fontSize:13,fontWeight:800,color:NAVY,marginBottom:14}}>
            📋 What Your Data Says
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {[
              {
                show: avgE !== "—" && parseFloat(avgE)<6,
                icon:"⚡",c:RED,
                text:"Your average energy is below 6. Talk to your coach about training load and recovery."
              },
              {
                show: pct>=70,
                icon:"✅",c:MINT,
                text:`${pct}% coachability rate — elite level. Keep this and your development compounds.`
              },
              {
                show: pct<50 && practices.length>=5,
                icon:"🔑",c:GOLD,
                text:"Under 50% coachability. This is the single highest-leverage thing to change in your training."
              },
              {
                show: practices.length>=7,
                icon:"🔥",c:POOL,
                text:`${practices.length} entries logged. You're building the data set — patterns will emerge.`
              },
            ].filter(x=>x.show).map((x,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"10px 12px",
                background:"#F8FAFC",borderRadius:9,border:`1px solid ${BDR}`,
                borderLeft:`3px solid ${x.c}`}}>
                <span style={{fontSize:16,flexShrink:0}}>{x.icon}</span>
                <span style={{fontSize:12,color:TM,lineHeight:1.6}}>{x.text}</span>
              </div>
            ))}
            {practices.length<5 && (
              <div style={{fontSize:12,color:TL,fontStyle:"italic",textAlign:"center",padding:10}}>
                Log {5-practices.length} more {practices.length===1?"entry":"entries"} to unlock pattern analysis
              </div>
            )}
          </div>
        </Card>
      </div>

      {meetRatings.length>1 && (
        <Card>
          <div style={{fontSize:13,fontWeight:800,color:NAVY,marginBottom:14}}>
            🏁 Meet Performance Self-Ratings
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={meetRatings} margin={{top:4,right:4,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
              <XAxis dataKey="meet" tick={{fontSize:10,fill:TL}} axisLine={false} tickLine={false}/>
              <YAxis domain={[1,10]} tick={{fontSize:10,fill:TL}} axisLine={false} tickLine={false} width={22}/>
              <Tooltip contentStyle={{borderRadius:8,border:`1px solid ${BDR}`,fontSize:12}}/>
              <Line type="monotone" dataKey="rating" stroke={PURP} strokeWidth={2.5}
                dot={{r:4,fill:PURP,stroke:"#fff",strokeWidth:2}} name="Meet Rating"/>
              <Line type="monotone" dataKey="mood" stroke={GOLD} strokeWidth={2}
                dot={{r:3,fill:GOLD,stroke:"#fff",strokeWidth:2}} strokeDasharray="4 3" name="Mood After"/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}

// ─── HOME DASHBOARD ────────────────────────────────────────────────────────────
function Home({ profile, entries, goals, streak, onStart }) {
  const today = todayStr();
  const hasToday = entries.some(e=>e.date===today&&e.type==="practice");
  const recentPractices = entries.filter(e=>e.type==="practice").slice(-7);
  const weekDays = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-6+i);
    return d.toISOString().slice(0,10);
  });

  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"28px 24px"}}>
      {/* Hero streak banner */}
      <div style={{background:`linear-gradient(145deg,${INK},${NAVY})`,borderRadius:18,
        padding:"28px 32px",marginBottom:22,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-10,top:-10,fontSize:130,opacity:0.05,
          userSelect:"none",lineHeight:1}}>🔥</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,color:"#93C5E8",fontWeight:600,marginBottom:4}}>
              Good {new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"},
            </div>
            <div style={{fontSize:26,fontWeight:900,color:"#fff",letterSpacing:"-0.5px"}}>
              {profile.name} {profile.team&&<span style={{fontSize:14,color:"#93C5E8",fontWeight:400}}>· {profile.team}</span>}
            </div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:56,fontWeight:900,color:GOLD,lineHeight:1,letterSpacing:"-2px"}}>
              {streak}
            </div>
            <div style={{fontSize:11,color:"#93C5E8",fontWeight:700,letterSpacing:"0.5px"}}>
              DAY STREAK 🔥
            </div>
          </div>
        </div>
        {/* Week grid */}
        <div style={{display:"flex",gap:6,marginTop:20}}>
          {weekDays.map(d=>{
            const has = entries.some(e=>e.date===d);
            const isT = d===today;
            return (
              <div key={d} style={{flex:1,height:8,borderRadius:3,
                background:has?GOLD:isT?"rgba(255,255,255,.15)":"rgba(255,255,255,.07)",
                border:isT?"1.5px solid rgba(245,158,11,.5)":"none"}}>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,
          color:"rgba(255,255,255,.3)",marginTop:4}}>
          <span>7 days ago</span><span>Today</span>
        </div>
      </div>

      {/* Quote */}
      <div style={{background:"#F8FAFC",border:`1px solid ${BDR}`,borderRadius:12,
        padding:"14px 18px",marginBottom:20,borderLeft:`3px solid ${POOL}`}}>
        <div style={{fontSize:12,fontStyle:"italic",color:TM,lineHeight:1.7}}>
          &ldquo;{quoteOfDay()}&rdquo;
        </div>
      </div>

      {/* Action cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
        <div style={{background:hasToday?MINT:NAVY,borderRadius:14,padding:"20px 22px",
          cursor:hasToday?"default":"pointer",
          boxShadow:hasToday?"none":"0 4px 18px rgba(11,45,89,.35)"}}>
          {hasToday ? (
            <div>
              <div style={{fontSize:22,marginBottom:8}}>✅</div>
              <div style={{fontSize:15,fontWeight:800,color:"#fff"}}>Practice Logged</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.7)",marginTop:4}}>
                Today&apos;s entry is saved. Great work.
              </div>
            </div>
          ) : (
            <div onClick={()=>onStart("practice")}>
              <div style={{fontSize:22,marginBottom:8}}>📝</div>
              <div style={{fontSize:15,fontWeight:800,color:"#fff"}}>Log Today&apos;s Practice</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.7)",marginTop:4}}>
                5-7 minutes · 7 focused questions
              </div>
            </div>
          )}
        </div>

        <div style={{background:"rgba(245,158,11,.12)",border:`1.5px solid rgba(245,158,11,.3)`,
          borderRadius:14,padding:"20px 22px"}}>
          <div style={{fontSize:22,marginBottom:8}}>🏁</div>
          <div style={{fontSize:15,fontWeight:800,color:NAVY}}>Meet Journal</div>
          <div style={{fontSize:11,color:TL,marginTop:4,marginBottom:14}}>
            Pre-race plan · Post-race review · Letter to future you
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>onStart("pre_meet")}
              style={{flex:1,background:GOLD,color:NAVY,border:"none",borderRadius:8,
                padding:"8px",fontWeight:700,fontSize:11,cursor:"pointer"}}>Pre-Meet</button>
            <button onClick={()=>onStart("post_meet")}
              style={{flex:1,background:"#fff",color:NAVY,border:`1.5px solid ${BDR}`,borderRadius:8,
                padding:"8px",fontWeight:700,fontSize:11,cursor:"pointer"}}>Post-Meet</button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      {entries.length>0 && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
          {[
            {l:"Total Entries",v:entries.length,c:NAVY},
            {l:"Practices",v:entries.filter(e=>e.type==="practice").length,c:POOL},
            {l:"Meet Entries",v:entries.filter(e=>e.type==="post_meet").length,c:GOLD},
            {l:"Day Streak",v:streak,c:MINT},
          ].map(s=>(
            <Card key={s.l} style={{padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
              <div style={{fontSize:10,color:TL,fontWeight:600,marginTop:2}}>{s.l}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Goals preview */}
      {goals.headline && (
        <Card>
          <div style={{fontSize:12,fontWeight:800,color:NAVY,marginBottom:10,
            borderBottom:`2px solid ${GOLD}`,paddingBottom:8}}>🎯 Season Goal</div>
          <div style={{fontSize:13,color:TM,lineHeight:1.6,marginBottom:12}}>{goals.headline}</div>
          {goals.times.filter(t=>t.target).length>0 && (
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {goals.times.filter(t=>t.target).map((t,i)=>(
                <span key={i} style={{background:t.achieved?"#DCFCE7":"#F0F9FF",
                  border:`1px solid ${t.achieved?"#BBF7D0":BDR}`,
                  borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,
                  color:t.achieved?MINT:NAVY}}>
                  {t.achieved?"✓ ":""}{t.event} {t.target}
                </span>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ─── ASK AI ───────────────────────────────────────────────────────────────────
const STARTER_QS = [
  "Am I too old to reach a high level?",
  "How do I know if I have real potential?",
  "What if I secretly hate racing?",
  "Is it normal to want to quit sometimes?",
  "How do I know if my coach is actually good for me?",
  "Am I good enough to swim in college?",
  "How do I stop being intimidated by faster swimmers?",
  "What does overtraining feel like?",
  "How honest should I be with my coach?",
  "Why do I choke in races when practice feels easy?",
  "Is my training volume too much or not enough?",
  "How do I deal with a teammate who gets under my skin?",
];

const AI_SYSTEM = `You are a trusted private mentor for competitive swimmers — a former D1 All-American and national-level age group coach with 25 years of experience. You have coached swimmers at every level from 10-year-old beginners to NCAA champions and Olympic Trials qualifiers. Swimmers come to you with questions they are afraid to ask their coaches, parents, or teammates.

Your core commitment: Tell the truth. Swimmers deserve honesty, not comfortable lies. Don't sugarcoat reality to make someone feel better in the moment — that's condescension, not kindness. Be direct and honest, while also being warm. These are young people who love a demanding sport.

Your deep knowledge includes:
- USA Swimming time standards and what times actually mean at every age group and level
- College recruiting realities at D1 P5, D1 mid-major, D2, D3, NAIA, and JUCO — specific, named programs
- What genuine potential looks like vs. late development vs. early peaking
- How to evaluate whether a coach is actually developing a swimmer or holding them back
- The psychology of racing, performance anxiety, and why technically strong swimmers choke
- Overtraining signs, recovery science, and when rest outperforms more yardage
- Team dynamics, jealousy between teammates, and how to mentally compete with friends
- What burnout actually is vs. normal fatigue vs. the wrong sport
- The difference between a bad stretch and a fundamental ceiling
- Weight and body image in swimming — handle with care and honesty, never shame
- Specialization vs. versatility decisions and when to make them

Rules you never break:
- Never lie to protect someone's feelings when honesty serves them better
- Never be cruel — there is always a way to be honest and kind at the same time
- If a question touches on mental health crisis, eating disorders, abuse, or self-harm: take it seriously, be compassionate, and clearly recommend talking to a trusted adult, counselor, or the SafeSport hotline
- Keep answers focused: 150-250 words unless the question genuinely needs more
- Use specific swimming knowledge — no generic life-coach advice
- If someone's times or situation means they are unlikely to reach a goal, say so clearly — and then explain what IS realistic and what factors could change the outcome
- Acknowledge when something is genuinely hard or unfair in the sport, rather than always defending the system`;

function AskAI({ profile }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  const send = async (text) => {
    if (!text.trim() || thinking) return;
    const msg = text.trim();
    setInput("");
    setThinking(true);
    setStarted(true);
    setMsgs(p => [...p, { r:"user", t:msg }]);

    try {
      const history = msgs.map(m => ({
        role: m.r === "ai" ? "assistant" : "user",
        content: m.t
      }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:600,
          system: AI_SYSTEM,
          messages:[...history,{role:"user",content:msg}]
        })
      });
      const data = await res.json();
      const reply = (data.content||[]).find(b=>b.type==="text")?.text
        || "Something went wrong — please try again.";
      setMsgs(p => [...p, { r:"ai", t:reply }]);
    } catch(_) {
      setMsgs(p => [...p, { r:"ai", t:"Connection issue. Check your internet and try again." }]);
    }
    setThinking(false);
    setTimeout(() => bottomRef.current && bottomRef.current.scrollIntoView({behavior:"smooth"}), 100);
  };

  return (
    <div style={{minHeight:"calc(100vh - 58px)",background:`linear-gradient(160deg,${INK} 0%,#0F2744 60%,#1A3A5C 100%)`,
      display:"flex",flexDirection:"column"}}>

      {!started && msgs.length === 0 ? (
        /* Landing state */
        <div style={{maxWidth:680,margin:"0 auto",padding:"40px 24px",flex:1}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{fontSize:48,marginBottom:12}}>🔒</div>
            <div style={{fontSize:26,fontWeight:900,color:"#fff",letterSpacing:"-0.5px",marginBottom:10}}>
              Ask What You Can&apos;t Ask Anyone Else
            </div>
            <div style={{fontSize:14,color:"#93C5E8",lineHeight:1.75,maxWidth:460,margin:"0 auto"}}>
              This is private. Just you and an AI that spent 25 years in competitive swimming.
              No judgment. No gossip. No soft answers to protect your feelings.
              Ask the real questions.
            </div>
          </div>

          <div style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",
            borderRadius:14,padding:"20px 22px",marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:700,color:GOLD,letterSpacing:"0.7px",
              textTransform:"uppercase",marginBottom:14}}>
              Questions swimmers are actually afraid to ask
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {STARTER_QS.map((q,i) => (
                <button key={i} onClick={() => send(q)}
                  style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",
                    borderRadius:20,padding:"8px 14px",fontSize:12,color:"#CBD5E0",
                    cursor:"pointer",fontFamily:"inherit",textAlign:"left",
                    transition:"all .15s"}}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div style={{display:"flex",gap:10}}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send(input)}
              placeholder="Or type your own question..."
              style={{flex:1,padding:"13px 16px",borderRadius:10,
                border:"1.5px solid rgba(255,255,255,.15)",
                background:"rgba(255,255,255,.07)",fontSize:14,
                fontFamily:"inherit",outline:"none",color:"#fff"}}/>
            <button onClick={()=>send(input)} disabled={!input.trim()||thinking}
              style={{background:GOLD,color:NAVY,border:"none",borderRadius:10,
                padding:"13px 20px",fontWeight:800,fontSize:13,cursor:"pointer",
                opacity:!input.trim()?0.5:1}}>
              Ask
            </button>
          </div>

          <div style={{textAlign:"center",marginTop:16,fontSize:11,color:"rgba(255,255,255,.25)",lineHeight:1.6}}>
            Your conversations here are not saved or shared with anyone.<br/>
            If something is seriously wrong, please talk to a trusted adult or counselor.
          </div>
        </div>
      ) : (
        /* Chat state */
        <div style={{flex:1,display:"flex",flexDirection:"column",maxWidth:720,
          margin:"0 auto",width:"100%",padding:"0 16px"}}>
          <div style={{flex:1,overflowY:"auto",padding:"24px 0",
            display:"flex",flexDirection:"column",gap:16}}>
            {msgs.map((m,i) => (
              <div key={i} style={{display:"flex",
                justifyContent:m.r==="user"?"flex-end":"flex-start",
                alignItems:"flex-end",gap:10}}>
                {m.r==="ai" && (
                  <div style={{width:32,height:32,borderRadius:8,background:GOLD,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:16,flexShrink:0,marginBottom:2}}>🏊</div>
                )}
                <div style={{maxWidth:"82%",
                  background:m.r==="user"
                    ? `linear-gradient(135deg,${NAVY},#1565C0)`
                    : "rgba(255,255,255,.08)",
                  border:m.r==="ai"?"1px solid rgba(255,255,255,.1)":"none",
                  borderRadius:m.r==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                  padding:"13px 16px",fontSize:14,
                  color:m.r==="user"?"#fff":"#CBD5E0",
                  lineHeight:1.75,whiteSpace:"pre-wrap"}}>
                  {m.t}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{display:"flex",alignItems:"flex-end",gap:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:GOLD,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏊</div>
                <div style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",
                  borderRadius:"14px 14px 14px 4px",padding:"13px 16px"}}>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    {[0,1,2].map(i=>(
                      <div key={i} style={{width:6,height:6,borderRadius:"50%",
                        background:"#93C5E8",opacity:0.6,
                        animation:`pulse ${0.9+i*0.15}s ease-in-out infinite`}}/>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          <div style={{padding:"16px 0 24px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
            <div style={{display:"flex",gap:10}}>
              <input value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send(input)}
                placeholder="Ask anything about swimming..."
                style={{flex:1,padding:"13px 16px",borderRadius:10,
                  border:"1.5px solid rgba(255,255,255,.15)",
                  background:"rgba(255,255,255,.07)",fontSize:14,
                  fontFamily:"inherit",outline:"none",color:"#fff"}}/>
              <button onClick={()=>send(input)} disabled={!input.trim()||thinking}
                style={{background:GOLD,color:NAVY,border:"none",borderRadius:10,
                  padding:"13px 20px",fontWeight:800,fontSize:13,
                  cursor:!input.trim()||thinking?"not-allowed":"pointer",
                  opacity:!input.trim()||thinking?0.5:1}}>
                Send
              </button>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",
              marginTop:10,fontSize:10,color:"rgba(255,255,255,.2)"}}>
              <span>Conversation is private and not saved</span>
              <button onClick={()=>{setMsgs([]);setStarted(false);}}
                style={{background:"none",border:"none",color:"rgba(255,255,255,.25)",
                  cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>
                New conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function SwimJournal() {
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [goals, setGoals] = useState({ headline:"", times:[], technique:"", mental:"", academic:"" });
  const [view, setView] = useState("home");
  const [flow, setFlow] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(()=>{
    const load = async () => {
      try {
        const p = await window.storage.get("swj_profile");
        const e = await window.storage.get("swj_entries");
        const g = await window.storage.get("swj_goals");
        if (p&&p.value) setProfile(JSON.parse(p.value));
        if (e&&e.value) setEntries(JSON.parse(e.value));
        if (g&&g.value) setGoals(JSON.parse(g.value));
      } catch(_) {}
      setReady(true);
    };
    load();
  },[]);

  const sv = async (k,v) => { try { await window.storage.set(k,JSON.stringify(v)); } catch(_) {} };

  const setupDone = p => {
    setProfile(p); sv("swj_profile",p);
  };

  const savePractice = d => {
    const entry = {...d, id:uid(), date:todayStr(), type:"practice"};
    const ne = [...entries, entry];
    setEntries(ne); sv("swj_entries",ne);
    setFlow(null); setView("home");
  };

  const savePreMeet = d => {
    const entry = {...d, id:uid(), date:todayStr(), type:"pre_meet"};
    const ne = [...entries, entry];
    setEntries(ne); sv("swj_entries",ne);
    setFlow(null); setView("home");
  };

  const savePostMeet = d => {
    const entry = {...d, id:uid(), date:todayStr(), type:"post_meet"};
    const ne = [...entries, entry];
    setEntries(ne); sv("swj_entries",ne);
    setFlow(null); setView("home");
  };

  const saveGoals = g => {
    setGoals(g); sv("swj_goals",g);
  };

  if (!ready) return (
    <div style={{minHeight:"100vh",background:`linear-gradient(145deg,${INK},${NAVY})`,
      display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontSize:14,color:"#93C5E8"}}>Loading your journal...</div>
    </div>
  );

  if (!profile) return <SetupScreen onDone={setupDone}/>;

  if (flow==="practice") return (
    <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:bg}}>
      <NavBar view="practice" setView={setView} profile={profile}/>
      <PracticeFlow onSave={savePractice} onCancel={()=>setFlow(null)}/>
    </div>
  );

  if (flow==="pre_meet") {
    const lastPost = [...entries].filter(e=>e.type==="post_meet").reverse()[0];
    return (
      <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:bg}}>
        <NavBar view="meet" setView={setView} profile={profile}/>
        <PreMeetFlow onSave={savePreMeet} onCancel={()=>setFlow(null)}
          lastMessage={lastPost?.messageFutureMe}/>
      </div>
    );
  }

  if (flow==="post_meet") {
    const lastPre = [...entries].filter(e=>e.type==="pre_meet").reverse()[0];
    return (
      <div style={{fontFamily:"system-ui,sans-serif",minHeight:"100vh",background:bg}}>
        <NavBar view="meet" setView={setView} profile={profile}/>
        <PostMeetFlow onSave={savePostMeet} onCancel={()=>setFlow(null)} preMeet={lastPre}/>
      </div>
    );
  }

  const streak = calcStreak(entries);

  const NAV = [
    {id:"home",    icon:"🏠",l:"Home"},
    {id:"practice",icon:"📝",l:"Practice"},
    {id:"meet",    icon:"🏁",l:"Meet"},
    {id:"goals",   icon:"🎯",l:"Goals"},
    {id:"insights",icon:"📊",l:"Insights"},
    {id:"ask",     icon:"🔒",l:"Ask AI"},
  ];

  return (
    <div style={{fontFamily:"system-ui,-apple-system,sans-serif",minHeight:"100vh",background:bg}}>
      <NavBar view={view} setView={v=>{
        if (v==="practice") { setFlow("practice"); return; }
        if (v==="meet") { setFlow("pre_meet"); return; }
        setView(v);
      }} profile={profile} streak={streak} nav={NAV}/>

      {view==="home" && (
        <Home profile={profile} entries={entries} goals={goals} streak={streak}
          onStart={t=>setFlow(t)}/>
      )}
      {view==="goals" && <GoalsHub goals={goals} onSave={saveGoals}/>}
      {view==="insights" && <Insights entries={entries}/>}
      {view==="ask" && <AskAI profile={profile}/>}
    </div>
  );
}

function NavBar({ view, setView, profile, streak, nav }) {
  const NAV = nav || [
    {id:"home",icon:"🏠",l:"Home"},{id:"practice",icon:"📝",l:"Practice"},
    {id:"meet",icon:"🏁",l:"Meet"},{id:"goals",icon:"🎯",l:"Goals"},
    {id:"insights",icon:"📊",l:"Insights"},{id:"ask",icon:"🔒",l:"Ask AI"},
  ];
  return (
    <div style={{background:`linear-gradient(135deg,${INK},${NAVY})`,height:58,
      display:"flex",alignItems:"center",padding:"0 24px",gap:4,
      boxShadow:"0 4px 20px rgba(6,18,34,.5)",position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginRight:20}}>
        <div style={{width:36,height:36,borderRadius:10,background:GOLD,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏊</div>
        <div>
          <div style={{fontSize:13,fontWeight:900,color:"#fff",letterSpacing:"-0.3px"}}>
            Swim Journal
          </div>
          {profile && <div style={{fontSize:10,color:"#7DD3FC"}}>{profile.name}{streak>0?` · 🔥${streak} day streak`:""}</div>}
        </div>
      </div>
      {NAV.map(n=>(
        <button key={n.id} onClick={()=>setView(n.id)}
          style={{background:view===n.id?"rgba(255,255,255,.15)":"transparent",
            color:view===n.id?"#fff":"rgba(255,255,255,.5)",
            border:view===n.id?"1px solid rgba(255,255,255,.2)":"none",
            borderRadius:7,padding:"6px 12px",fontWeight:700,fontSize:11,
            cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
          <span>{n.icon}</span>{n.l}
        </button>
      ))}
    </div>
  );
}
