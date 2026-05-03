import { useState, useRef } from "react";

// ── BRAND COLORS ─────────────────────────────────────────────────────────────
const GOLD  = "#C9A84C";
const GOLD2 = "#F0D060";
const RED   = "#C41820";
const RED2  = "#8B0F15";
const BG    = "#070605";
const CREAM = "#EDE0C4";

// ── ROUNDEL PATH (horizontal oval, 4 V-notches at cardinal points) ─────────
const RD = "M94,14 C100,14 112,22 120,26 C128,22 140,14 146,14 C164,10 180,8 194,10 C208,12 224,28 228,38 C228,44 220,52 216,60 C220,68 228,76 228,82 C224,92 208,108 194,110 C180,112 164,110 146,106 C140,106 128,98 120,94 C112,98 100,106 94,106 C80,110 64,112 46,110 C32,108 16,92 12,82 C12,76 20,68 24,60 C20,52 12,44 12,38 C16,28 32,12 46,10 C64,8 80,10 94,14Z";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{display:none}
  @keyframes rdPulse{0%,100%{filter:drop-shadow(0 0 4px ${GOLD}44)}50%{filter:drop-shadow(0 0 16px ${GOLD}99)}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{0%{transform:scale(.45);opacity:0}70%{transform:scale(1.07)}100%{transform:scale(1);opacity:1}}
  @keyframes rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes floatDrift{0%,100%{transform:translateY(0) rotate(0deg);opacity:.1}50%{transform:translateY(-18px) rotate(3deg);opacity:.18}}
  @keyframes scanLine{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
  @keyframes particleOut{0%{transform:translate(0,0) scale(1);opacity:.8}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
`;

// ── ALL SUB-COMPONENTS DEFINED OUTSIDE — prevents remount on parent re-render ─

const Roundel = ({ w=200, h=100, sw=1.5, glow=false, fill=false, double=true }) => (
  <svg width={w} height={h} viewBox="0 0 240 120" style={{display:"block",flexShrink:0}}>
    <defs>
      {glow && <>
        <filter id="rglow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="rlg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={GOLD}/>
          <stop offset="45%" stopColor={GOLD2}/>
          <stop offset="100%" stopColor={GOLD}/>
        </linearGradient>
      </>}
    </defs>
    {fill && <path d={RD} fill={`${GOLD}14`}/>}
    <path d={RD} fill="none"
      stroke={glow?"url(#rlg)":GOLD} strokeWidth={sw}
      filter={glow?"url(#rglow)":undefined}/>
    {double && <path d={RD} fill="none" stroke={GOLD} strokeWidth={sw*0.4} opacity={0.38}
      transform="translate(120,60) scale(0.80) translate(-120,-60)"/>}
  </svg>
);

const GoldBtn = ({ children, onClick, disabled, outline, full, red: isRed }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: full ? "100%" : "auto",
    background: disabled ? "#0D0C0B"
      : isRed  ? `linear-gradient(135deg,${RED},${RED2})`
      : outline ? "transparent"
      : `linear-gradient(135deg,${GOLD},${GOLD2},${GOLD})`,
    backgroundSize: (!disabled && !outline && !isRed) ? "200% 100%" : "auto",
    border: outline ? `1px solid ${GOLD}77` : "none",
    color: disabled ? "#242220" : outline ? GOLD : isRed ? "#fff" : "#000",
    padding: "16px 36px", fontSize: 11, letterSpacing: ".2em",
    cursor: disabled ? "default" : "pointer",
    fontFamily: "inherit", fontWeight: 600, textTransform: "uppercase",
    transition: "all .3s",
    animation: (!disabled && !outline && !isRed) ? "shimmer 2.5s linear infinite" : "none",
  }}>{children}</button>
);

const TopBar = ({ pts, setScreen, fileRef }) => (
  <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:10,
    background:`${BG}EE`,backdropFilter:"blur(16px)",
    borderBottom:`0.5px solid ${GOLD}22`,position:"sticky",top:0,zIndex:50}}>
    <div style={{cursor:"pointer"}} onClick={()=>setScreen("feed")}>
      <Roundel w={52} h={26} sw={1.2} glow double/>
    </div>
    <span style={{fontFamily:'"Cormorant Garamond",serif',fontSize:17,flex:1,letterSpacing:".04em"}}>
      Gold Mark
    </span>
    <div style={{background:RED,padding:"3px 10px",fontSize:10,letterSpacing:".12em",color:"#fff",fontWeight:600}}>
      {pts} PTS
    </div>
  </div>
);

const BottomNav = ({ active, setScreen, fileRef }) => (
  <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
    width:"100%",maxWidth:430,display:"flex",zIndex:100,
    background:"rgba(5,4,3,.97)",borderTop:`0.5px solid ${GOLD}28`,backdropFilter:"blur(24px)"}}>
    {[["feed","◉","Discover"],["upload","⊕","Upload"],["leaderboard","▦","Ranks"],["profile","◌","Me"]].map(([sc,ic,lb])=>(
      <button key={sc}
        onClick={()=> sc==="upload" ? fileRef.current.click() : setScreen(sc)}
        style={{flex:1,padding:"10px 0 16px",background:"none",border:"none",cursor:"pointer",
          color:active===sc?GOLD:"#282828",fontSize:9,display:"flex",flexDirection:"column",
          alignItems:"center",gap:4,letterSpacing:".1em",textTransform:"uppercase",
          fontFamily:"inherit",transition:"color .2s",
          filter:active===sc?`drop-shadow(0 0 8px ${GOLD}88)`:"none"}}>
        <span style={{fontSize:20,lineHeight:1}}>{ic}</span>{lb}
      </button>
    ))}
  </div>
);

const FloatRoundels = () => (
  <>
    {[{l:"8%",t:"18%",w:70,d:"0s"},{l:"70%",t:"55%",w:50,d:"1.2s"},{l:"35%",t:"78%",w:60,d:"0.6s"}].map((o,i)=>(
      <div key={i} style={{position:"absolute",left:o.l,top:o.t,pointerEvents:"none",
        animation:`floatDrift ${4+i*.8}s ease-in-out ${o.d} infinite`}}>
        <Roundel w={o.w} h={Math.round(o.w/2)} sw={.7} double={false}/>
      </div>
    ))}
  </>
);

const CITIES = ["Mumbai","Delhi","Kolkata","Chennai","Bengaluru","Hyderabad","Ahmedabad","Pune","Jaipur","Lucknow","Other"];
const FEED = [
  {u:"priya_m",   city:"Mumbai",    votes:87,  bg1:"#1E0D00",bg2:"#5C2800",label:"Coffee Ring"},
  {u:"rk_spots",  city:"Kolkata",   votes:124, bg1:"#001608",bg2:"#004D1A",label:"Lotus Pond"},
  {u:"delhi_eye", city:"Delhi",     votes:63,  bg1:"#050515",bg2:"#10104A",label:"Chandelier"},
  {u:"sun_seeker",city:"Chennai",   votes:198, bg1:"#1C0500",bg2:"#581400",label:"Temple Arch"},
  {u:"anu.finds", city:"Pune",      votes:41,  bg1:"#111100",bg2:"#333300",label:"Manhole Art"},
  {u:"vijay_v",   city:"Hyderabad", votes:156, bg1:"#130010",bg2:"#400035",label:"Bangles Stack"},
];

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function GoldMarkApp() {
  const [screen,  setScreen]  = useState("landing");
  const [denied,  setDenied]  = useState(false);
  const [name,    setName]    = useState("");
  const [city,    setCity]    = useState("");
  const [imgSrc,  setImgSrc]  = useState(null);
  const [cat,     setCat]     = useState("");
  const [pts,     setPts]     = useState(320);
  const [won,     setWon]     = useState(0);
  const [lbTab,   setLbTab]   = useState("global");
  const [step,    setStep]    = useState(0);
  const [sparks,  setSparks]  = useState([]);
  const fileRef = useRef();

  const LB = {
    global:[
      {r:1,u:"sun_seeker",city:"Chennai",   p:4820,v:1240},
      {r:2,u:"rk_spots",  city:"Kolkata",   p:4410,v:1124},
      {r:3,u:"vijay_v",   city:"Hyderabad", p:3960,v:987},
      {r:4,u:name||"you", city:city||"—",   p:pts, v:87, me:true},
      {r:5,u:"anu.finds", city:"Pune",      p:1900,v:412},
    ],
    city:[
      {r:1,u:"rk_spots",  city,p:4410,v:1124},
      {r:2,u:"priya_m",   city,p:2340,v:578},
      {r:3,u:name||"you", city,p:pts, v:87, me:true},
      {r:4,u:"finder_99", city,p:280, v:61},
      {r:5,u:"spot_life", city,p:190, v:42},
    ],
    weekly:[
      {r:1,u:"vijay_v",   city:"Hyderabad",p:460,v:156},
      {r:2,u:"sun_seeker",city:"Chennai",  p:420,v:140},
      {r:3,u:name||"you", city:city||"—",  p:pts,v:87, me:true},
      {r:4,u:"delhi_eye", city:"Delhi",    p:280,v:63},
      {r:5,u:"anu.finds", city:"Pune",     p:190,v:42},
    ],
  };

  const onFile = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { setImgSrc(ev.target.result); setScreen("preview"); };
    r.readAsDataURL(f); e.target.value = "";
  };

  const burst = () => {
    const s = [...Array(16)].map((_,i) => ({
      id: Date.now()+i,
      tx: `${(Math.random()-.5)*280}px`,
      ty: `${-(Math.random()*220+50)}px`,
      bg: i%3===0 ? RED : i%3===1 ? GOLD : GOLD2,
      size: Math.random()*7+3,
      dur: `${Math.random()*.7+.5}s`,
    }));
    setSparks(s); setTimeout(() => setSparks([]), 1600);
  };

  // Shared wrapper div — NOT a component, just a style object used inline
  const wrapStyle = {
    background:BG, minHeight:"100vh", maxWidth:430, margin:"0 auto",
    fontFamily:'"DM Sans",sans-serif', color:CREAM,
    position:"relative", overflow:"hidden",
  };

  // ── LANDING ─────────────────────────────────────────────────
  if (screen === "landing") return (
    <div style={wrapStyle}>
      <style>{CSS}</style>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={onFile}/>
      <FloatRoundels/>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 42%,${GOLD}14 0%,transparent 68%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",left:0,right:0,height:1,
        background:`linear-gradient(90deg,transparent,${RED}55,transparent)`,
        top:"50%",pointerEvents:"none",animation:"scanLine 6s linear infinite",zIndex:1}}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        minHeight:"100vh",padding:"0 32px",textAlign:"center",position:"relative",zIndex:2}}>
        <div style={{animation:"rdPulse 3s ease-in-out infinite",marginBottom:30}}>
          <Roundel w={280} h={140} sw={2} glow fill/>
        </div>
        <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:11,letterSpacing:".5em",
          background:`linear-gradient(90deg,${GOLD},${GOLD2},${GOLD})`,backgroundSize:"200%",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          textTransform:"uppercase",marginBottom:14,animation:"shimmer 2.5s linear infinite"}}>
          Gold Mark
        </p>
        <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:34,fontWeight:300,
          lineHeight:1.45,marginBottom:6,animation:"fadeUp .8s ease .35s both"}}>
          Once you see it,<br/><em>you can't unsee it.</em>
        </p>
        <div style={{display:"inline-block",background:RED,padding:"5px 16px",
          fontSize:10,letterSpacing:".16em",color:"#fff",fontWeight:600,
          marginBottom:44,animation:"fadeUp .8s ease .5s both"}}>#FINDYOURGOLDMARK</div>
        <div style={{width:"100%",animation:"fadeUp .8s ease .65s both"}}>
          <GoldBtn full onClick={() => setScreen("age")}>Enter the Hunt</GoldBtn>
        </div>
        <p style={{marginTop:20,fontSize:10,color:"#181614",letterSpacing:".1em",
          animation:"fadeUp .8s ease .8s both"}}>For adults 18 and above only</p>
      </div>
    </div>
  );

  // ── AGE GATE ─────────────────────────────────────────────────
  if (screen === "age") return (
    <div style={wrapStyle}>
      <style>{CSS}</style>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={onFile}/>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 50%,${GOLD}0D,transparent 65%)`,pointerEvents:"none"}}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        minHeight:"100vh",padding:"0 40px",textAlign:"center",position:"relative",zIndex:2}}>
        <div style={{animation:"rdPulse 3s ease-in-out infinite",marginBottom:36}}>
          <Roundel w={180} h={90} sw={1.8} glow/>
        </div>
        <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:34,fontWeight:300,
          marginBottom:12,animation:"fadeUp .5s ease both"}}>Are you 18 or above?</p>
        <p style={{fontSize:13,color:"#2A2622",lineHeight:1.8,marginBottom:44,
          animation:"fadeUp .5s ease .1s both"}}>This experience is for adults only.</p>
        {!denied ? (
          <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",
            animation:"fadeUp .5s ease .2s both"}}>
            <GoldBtn full onClick={() => setScreen("name")}>Yes, I am 18+</GoldBtn>
            <GoldBtn full outline onClick={() => setDenied(true)}>No, I am not</GoldBtn>
          </div>
        ) : (
          <div style={{padding:24,background:"#100000",border:`0.5px solid ${RED}44`,width:"100%"}}>
            <p style={{fontSize:14,color:`${RED}99`,lineHeight:1.8}}>
              Sorry — this experience is only available to adults aged 18 and above.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // ── NAME ─────────────────────────────────────────────────────
  // Uses plain div wrapper (NOT a sub-component) so no remount on keystroke
  if (screen === "name") return (
    <div style={wrapStyle}>
      <style>{CSS}</style>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={onFile}/>
      <div style={{position:"absolute",inset:0,
        background:`radial-gradient(ellipse at 50% 60%,${GOLD}09,transparent 65%)`,
        pointerEvents:"none"}}/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",minHeight:"100vh",padding:"0 40px",
        textAlign:"center",position:"relative",zIndex:2}}>
        <div style={{display:"inline-block",background:RED,padding:"4px 14px",
          fontSize:10,letterSpacing:".2em",color:"#fff",fontWeight:600,marginBottom:40}}>
          STEP 1 OF 2
        </div>
        <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:36,fontWeight:300,
          marginBottom:12}}>What's your name?</p>
        <p style={{fontSize:13,color:"#2A2622",marginBottom:44}}>
          This is how you'll appear on the leaderboard.
        </p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={28}
          style={{
            display:"block", width:"100%",
            background:"transparent", border:"none",
            borderBottom:`1px solid #2A2420`,
            padding:"13px 0", marginBottom:52,
            fontFamily:'"Cormorant Garamond",serif',
            fontSize:28, color:CREAM, textAlign:"center",
            outline:"none", caretColor:GOLD, letterSpacing:".03em",
          }}
          onFocus={e  => { e.target.style.borderBottomColor = GOLD; }}
          onBlur={e   => { e.target.style.borderBottomColor = "#2A2420"; }}
        />
        <div style={{width:"100%"}}>
          <GoldBtn full disabled={!name.trim()} onClick={() => setScreen("location")}>
            Continue
          </GoldBtn>
        </div>
      </div>
    </div>
  );

  // ── LOCATION ─────────────────────────────────────────────────
  if (screen === "location") return (
    <div style={wrapStyle}>
      <style>{CSS}</style>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={onFile}/>
      <FloatRoundels/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",minHeight:"100vh",padding:"0 36px",
        textAlign:"center",position:"relative",zIndex:2}}>
        <div style={{display:"inline-block",background:RED,padding:"4px 14px",
          fontSize:10,letterSpacing:".2em",color:"#fff",fontWeight:600,marginBottom:40}}>
          STEP 2 OF 2
        </div>
        <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:34,fontWeight:300,
          marginBottom:12,animation:"fadeUp .5s ease both"}}>Where are you hunting?</p>
        <p style={{fontSize:13,color:"#2A2622",marginBottom:44,
          animation:"fadeUp .5s ease .1s both"}}>Compete city-wide and on the global board.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,
          width:"100%",marginBottom:48}}>
          {CITIES.map(c => (
            <button key={c} onClick={() => setCity(c)} style={{
              padding:"13px 8px",
              background: city===c ? `${GOLD}18` : "#0C0A08",
              border: `0.5px solid ${city===c ? GOLD : "#1E1A16"}`,
              color: city===c ? GOLD : "#383028",
              fontSize:13, cursor:"pointer", fontFamily:"inherit",
              transition:"all .2s",
              boxShadow: city===c ? `inset 0 0 0 1px ${GOLD}33,0 0 12px ${GOLD}1A` : "none",
            }}>{c}</button>
          ))}
        </div>
        <div style={{width:"100%"}}>
          <GoldBtn full disabled={!city} onClick={() => setScreen("onboard")}>
            Let's Hunt
          </GoldBtn>
        </div>
      </div>
    </div>
  );

  // ── ONBOARDING ───────────────────────────────────────────────
  if (screen === "onboard") {
    const steps = [
      {t:"Spot the Shape",
       s:"Find the Gold Mark form anywhere — architecture, food, nature, objects, light. Once you notice it, it appears everywhere."},
      {t:"Photograph It",
       s:"Capture your find exactly as it is. No staging. The most unexpected, creative angle earns the most community votes."},
      {t:"Upload & Compete",
       s:"Submit your find. Earn points. Climb the leaderboard. Top voted finds get featured. #FindYourGoldMark"},
    ];
    return (
      <div style={wrapStyle}>
        <style>{CSS}</style>
        <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={onFile}/>
        <FloatRoundels/>
        <div style={{position:"absolute",inset:0,
          background:`radial-gradient(ellipse at 50% 40%,${GOLD}0A,transparent 60%)`,
          pointerEvents:"none"}}/>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",minHeight:"100vh",padding:"0 40px",
          textAlign:"center",position:"relative",zIndex:2}}>
          <div key={step+"r"} style={{animation:"popIn .5s ease both",marginBottom:32}}>
            <Roundel w={170} h={85} sw={1.8} glow fill/>
          </div>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:20}}>
            <div style={{width:28,height:28,background:RED,display:"flex",
              alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>
              {step+1}
            </div>
            <span style={{fontSize:10,letterSpacing:".2em",color:`${GOLD}88`,textTransform:"uppercase"}}>of 3</span>
          </div>
          <p key={step+"t"} style={{fontFamily:'"Cormorant Garamond",serif',fontSize:36,
            fontWeight:300,marginBottom:18,animation:"fadeUp .35s ease both"}}>
            {steps[step].t}
          </p>
          <p key={step+"s"} style={{fontSize:14,color:"#383028",lineHeight:1.9,
            marginBottom:52,animation:"fadeUp .35s ease .07s both"}}>
            {steps[step].s}
          </p>
          <div style={{display:"flex",gap:8,marginBottom:44}}>
            {steps.map((_,i) => (
              <div key={i} style={{
                width:i===step?32:6, height:6, borderRadius:3,
                background:i===step?RED:i<step?`${GOLD}55`:"#1E1A16",
                transition:"all .35s",
                boxShadow:i===step?`0 0 8px ${RED}`:"none",
              }}/>
            ))}
          </div>
          <div style={{width:"100%"}}>
            <GoldBtn full onClick={() => step<2 ? setStep(s=>s+1) : setScreen("feed")}>
              {step < 2 ? "Next" : "Start Hunting"}
            </GoldBtn>
          </div>
          {step > 0 && (
            <button onClick={() => setStep(s=>s-1)}
              style={{marginTop:14,background:"none",border:"none",color:"#282420",
                cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Back</button>
          )}
        </div>
      </div>
    );
  }

  // ── FEED ─────────────────────────────────────────────────────
  if (screen === "feed") return (
    <div style={wrapStyle}>
      <style>{CSS}</style>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={onFile}/>
      <TopBar pts={pts} setScreen={setScreen} fileRef={fileRef}/>
      <div style={{padding:"7px 20px",background:RED,textAlign:"center"}}>
        <span style={{fontSize:10,color:"#fff",letterSpacing:".2em",fontWeight:600}}>#FINDYOURGOLDMARK</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3,paddingBottom:80}}>
        {FEED.map((item,i) => (
          <div key={i} style={{position:"relative",aspectRatio:"1",
            background:`linear-gradient(135deg,${item.bg1},${item.bg2})`,
            overflow:"hidden",cursor:"pointer"}}>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{animation:`floatDrift ${3.5+i*.4}s ease-in-out ${i*.3}s infinite`}}>
                <Roundel w={120} h={60} sw={1} double/>
              </div>
            </div>
            <div style={{position:"absolute",top:7,right:7,opacity:.4}}>
              <Roundel w={30} h={15} sw={.7} double={false}/>
            </div>
            <div style={{position:"absolute",bottom:0,left:0,right:0,
              padding:"30px 10px 10px",background:"linear-gradient(transparent,rgba(0,0,0,.96))"}}>
              <p style={{fontSize:12,color:`${GOLD}DD`,marginBottom:4,letterSpacing:".02em"}}>{item.label}</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:10,color:"#2E2A24"}}>@{item.u}</span>
                <span style={{fontSize:11,color:RED,fontWeight:600}}>♥ {item.votes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="feed" setScreen={setScreen} fileRef={fileRef}/>
    </div>
  );

  // ── PREVIEW ───────────────────────────────────────────────────
  if (screen === "preview") return (
    <div style={wrapStyle}>
      <style>{CSS}</style>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={onFile}/>
      <div style={{padding:"18px 20px 14px",display:"flex",alignItems:"center",gap:12,
        borderBottom:`0.5px solid ${GOLD}18`,background:`${BG}EE`}}>
        <button onClick={() => setScreen("feed")}
          style={{background:"none",border:"none",color:GOLD,cursor:"pointer",fontSize:22,padding:0,lineHeight:1}}>←</button>
        <Roundel w={44} h={22} sw={1} double={false}/>
        <span style={{fontFamily:'"Cormorant Garamond",serif',fontSize:18}}>New Find</span>
      </div>
      <div style={{background:"#050403",display:"flex",alignItems:"center",
        justifyContent:"center",minHeight:320,position:"relative"}}>
        {imgSrc
          ? <img src={imgSrc} alt="find" style={{maxWidth:"100%",maxHeight:360,objectFit:"contain"}}/>
          : <div style={{opacity:.12,animation:"rdPulse 3s ease-in-out infinite"}}>
              <Roundel w={180} h={90} sw={1.5}/>
            </div>
        }
      </div>
      <div style={{padding:24}}>
        <p style={{fontSize:10,color:"#2A2622",letterSpacing:".14em",
          textTransform:"uppercase",marginBottom:10}}>Category</p>
        <div style={{position:"relative",marginBottom:24}}>
          <select value={cat} onChange={e => setCat(e.target.value)} style={{
            background:"#0C0A08",border:`0.5px solid ${cat?"#3A3028":"#1E1A16"}`,
            color:cat?CREAM:"#302820",width:"100%",
            padding:"14px 40px 14px 16px",fontSize:14,
            fontFamily:"inherit",appearance:"none",cursor:"pointer",outline:"none",
          }}>
            <option value="">Choose a category</option>
            {["Nature","Food","Objects","Light","Architecture","Everyday Life"].map(c=>(
              <option key={c}>{c}</option>
            ))}
          </select>
          <span style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",
            color:GOLD,fontSize:10,pointerEvents:"none"}}>▾</span>
        </div>
        <GoldBtn full disabled={!cat} onClick={() => {
          const p = Math.floor(Math.random()*41)+10;
          setWon(p); setPts(pp=>pp+p); setCat(""); burst(); setScreen("success");
        }}>Submit Find</GoldBtn>
      </div>
    </div>
  );

  // ── SUCCESS ───────────────────────────────────────────────────
  if (screen === "success") return (
    <div style={wrapStyle}>
      <style>{CSS}</style>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={onFile}/>
      {sparks.map(s => (
        <div key={s.id} style={{
          position:"fixed",left:"50%",bottom:"38%",
          width:s.size,height:s.size,borderRadius:"50%",
          background:s.bg,pointerEvents:"none",zIndex:300,
          ["--tx"]:s.tx,["--ty"]:s.ty,
          animation:`particleOut ${s.dur} ease-out forwards`,
        }}/>
      ))}
      <div style={{position:"absolute",inset:0,
        background:`radial-gradient(ellipse at 50% 42%,${GOLD}12,transparent 65%)`,
        pointerEvents:"none"}}/>
      <div style={{padding:"7px 20px",background:RED,textAlign:"center"}}>
        <span style={{fontSize:10,color:"#fff",letterSpacing:".2em",fontWeight:600}}>#FINDYOURGOLDMARK</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",minHeight:"calc(100vh - 36px)",
        padding:"0 32px",textAlign:"center",position:"relative",zIndex:2}}>
        <div style={{animation:"popIn .9s cubic-bezier(.34,1.56,.64,1)",marginBottom:32}}>
          <Roundel w={260} h={130} sw={2.2} glow fill/>
        </div>
        <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:54,fontWeight:300,
          animation:"rise .5s ease .3s both",marginBottom:4}}>Nice find.</p>
        <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:82,lineHeight:1,
          background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          animation:"rise .5s ease .45s both"}}>+{won}</p>
        <p style={{fontSize:10,color:"#1E1C18",letterSpacing:".2em",textTransform:"uppercase",
          marginBottom:36,animation:"rise .5s ease .55s both"}}>points earned</p>
        <div style={{display:"flex",gap:8,marginBottom:36,animation:"rise .5s ease .6s both"}}>
          {[["Observer",GOLD],["Spotter",RED]].map(([b,c]) => (
            <div key={b} style={{border:`0.5px solid ${c}66`,padding:"6px 14px",
              fontSize:10,color:c,letterSpacing:".1em",textTransform:"uppercase"}}>{b}</div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",
          animation:"rise .5s ease .7s both"}}>
          <GoldBtn full onClick={() => setScreen("feed")}>Keep Hunting</GoldBtn>
          <GoldBtn full red onClick={() => setScreen("leaderboard")}>See Leaderboard</GoldBtn>
        </div>
      </div>
    </div>
  );

  // ── LEADERBOARD ───────────────────────────────────────────────
  if (screen === "leaderboard") return (
    <div style={wrapStyle}>
      <style>{CSS}</style>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={onFile}/>
      <TopBar pts={pts} setScreen={setScreen} fileRef={fileRef}/>
      <div style={{padding:"7px 20px",background:RED,textAlign:"center"}}>
        <span style={{fontSize:10,color:"#fff",letterSpacing:".2em",fontWeight:600}}>#FINDYOURGOLDMARK</span>
      </div>
      <div style={{padding:"20px 20px 100px"}}>
        <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:32,
          fontWeight:300,marginBottom:16}}>Rankings</p>
        <div style={{display:"flex",gap:2,marginBottom:24}}>
          {["global","city","weekly"].map(t => (
            <button key={t} onClick={() => setLbTab(t)} style={{
              flex:1,padding:"10px 0",
              background:lbTab===t?RED:"transparent",
              border:`0.5px solid ${lbTab===t?RED:"#1E1A16"}`,
              cursor:"pointer",color:lbTab===t?"#fff":"#282420",
              fontSize:11,letterSpacing:".12em",textTransform:"capitalize",
              fontFamily:"inherit",transition:"all .2s",
            }}>{t==="city"?(city||"City"):t}</button>
          ))}
        </div>
        {LB[lbTab].map((item,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",
            padding:"14px 0",borderBottom:`0.5px solid ${GOLD}09`,
            background:item.me?`${GOLD}07`:"none",
            paddingLeft:item.me?10:0,transition:"background .2s"}}>
            <span style={{width:28,fontFamily:'"Cormorant Garamond",serif',
              fontSize:item.r<=3?24:15,flexShrink:0,
              color:item.r===1?GOLD:item.r===2?"#A08030":item.r===3?RED:"#1E1A16",
              filter:item.r===1?`drop-shadow(0 0 6px ${GOLD}88)`:"none"}}>
              {item.r}
            </span>
            <div style={{marginRight:10}}>
              <Roundel w={36} h={18} sw={.8} double={false}/>
            </div>
            <div style={{flex:1}}>
              <p style={{fontSize:14,color:item.me?GOLD:"#787060"}}>{item.me&&"★ "}@{item.u}</p>
              <p style={{fontSize:10,color:"#1E1A16",marginTop:2}}>{item.city}</p>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:15,
                color:item.me?GOLD:"#302820"}}>{item.p.toLocaleString()}</p>
              <p style={{fontSize:10,color:RED,marginTop:2}}>♥ {item.v}</p>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="leaderboard" setScreen={setScreen} fileRef={fileRef}/>
    </div>
  );

  // ── PROFILE ───────────────────────────────────────────────────
  if (screen === "profile") return (
    <div style={wrapStyle}>
      <style>{CSS}</style>
      <input type="file" accept="image/*" ref={fileRef} style={{display:"none"}} onChange={onFile}/>
      <div style={{paddingBottom:80}}>
        <div style={{padding:"44px 24px 28px",textAlign:"center",
          background:`linear-gradient(180deg,${RED}12 0%,transparent 80%)`,
          borderBottom:`0.5px solid ${GOLD}18`}}>
          <div style={{margin:"0 auto 20px",display:"inline-block",
            animation:"rdPulse 3s ease-in-out infinite"}}>
            <Roundel w={200} h={100} sw={2} glow fill/>
          </div>
          <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:28,marginBottom:4}}>{name||"Hunter"}</p>
          <p style={{fontSize:12,color:"#252018",letterSpacing:".08em",marginBottom:24}}>{city}</p>
          <p style={{fontFamily:'"Cormorant Garamond",serif',fontSize:64,lineHeight:1,
            background:`linear-gradient(135deg,${GOLD},${GOLD2})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            {pts.toLocaleString()}
          </p>
          <p style={{fontSize:10,color:"#1E1A16",letterSpacing:".2em",
            textTransform:"uppercase",marginBottom:24}}>Total Points</p>
          <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
            {[["Observer",GOLD],["Spotter",RED],["Curator",GOLD]].map(([b,c]) => (
              <div key={b} style={{border:`0.5px solid ${c}44`,padding:"6px 14px",
                fontSize:10,color:c,letterSpacing:".1em",textTransform:"uppercase"}}>{b}</div>
            ))}
          </div>
          <p style={{fontSize:10,color:RED,letterSpacing:".14em"}}>#FindYourGoldMark</p>
        </div>
        <p style={{padding:"18px 20px 12px",fontSize:10,color:"#1A1816",
          letterSpacing:".14em",textTransform:"uppercase"}}>Your Finds</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:3}}>
          {FEED.map((item,i) => (
            <div key={i} style={{aspectRatio:"1",
              background:`linear-gradient(135deg,${item.bg1},${item.bg2})`,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{animation:`floatDrift ${3+i*.5}s ease-in-out ${i*.4}s infinite`}}>
                <Roundel w={58} h={29} sw={.8} double={false}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="profile" setScreen={setScreen} fileRef={fileRef}/>
    </div>
  );

  return null;
}
