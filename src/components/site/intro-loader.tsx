import { imageMeta, imageSrc, imageSrcSet } from "@/lib/images";

/*
  Écran de chargement, une fois par session (à l'ouverture du lien).
  Il ne dépend pas de React : deux scripts en ligne le pilotent dès le
  premier affichage, avant l'hydratation.
  1. Dans <head> : pose html[data-intro="loading"] si l'intro n'a pas
     encore été vue dans la session (sinon rien ne s'affiche).
  2. Après le balisage : compteur 000 → 100 % qui suit le vrai chargement
     (événement `load` : polices, logo, image du hero), avec une durée
     minimale pour que l'animation se voie et un plafond de 4 s.
  Le logo s'écrit au rythme du compteur, un reflet le balaie à 100 %, puis :
  - sur l'accueil, il vient se poser à sa place dans le hero pendant que
    le noir s'efface sur l'image spatiale ;
  - ailleurs, le rideau remonte avec un bord arrondi.
  Non passable. Sans JavaScript : rien ne s'affiche. Filet CSS à 6 s.
*/

export const introHeadScript = `try{if(!sessionStorage.getItem("nt-intro"))document.documentElement.setAttribute("data-intro","loading")}catch(e){}`;

const introBodyScript = `(function(){
var d=document.documentElement;
if(d.getAttribute("data-intro")!=="loading")return;
var root=document.getElementById("intro"),logo=document.getElementById("intro-logo");
if(!root||!logo){d.removeAttribute("data-intro");return}
var digits=root.querySelectorAll("[data-digit]"),prev=[0,0,0];
var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var MIN=reduce?800:2400,MAX=4000,start=performance.now(),loaded=document.readyState==="complete",shown=0,done=false;
if(!loaded)window.addEventListener("load",function(){loaded=true});
function ease(t){return t*t*(3-2*t)}
function paint(v){
root.style.setProperty("--p",v.toFixed(2));
var s=("00"+Math.floor(v)).slice(-3);
for(var i=0;i<3;i++){var n=+s.charAt(i),el=digits[i];
if(n<prev[i]){el.style.transition="none";el.style.setProperty("--d",n);void el.offsetHeight;el.style.transition=""}
else el.style.setProperty("--d",n);prev[i]=n}
}
function tick(now){
var t=now-start,target;
if(t>=MAX||(loaded&&t>=MIN))target=100;
else target=Math.min(loaded?99:88,100*ease(Math.min(t/MIN,1)));
if(shown<target)shown=Math.min(target,shown+Math.max(0.25,(target-shown)*0.12));
paint(shown);
if(shown>=100)finish();else requestAnimationFrame(tick);
}
function end(){
d.removeAttribute("data-intro");d.setAttribute("data-intro-played","");
root.style.display="none";
}
function finish(){
if(done)return;done=true;
try{sessionStorage.setItem("nt-intro","1")}catch(e){}
d.setAttribute("data-intro","exit");
setTimeout(function(){
var hero=document.querySelector("[data-hero-logo]"),r=hero&&hero.getBoundingClientRect();
var onScreen=r&&r.width>0&&r.bottom>0&&r.top<window.innerHeight;
var easing="cubic-bezier(0.7,0,0.2,1)";
if(reduce){root.animate([{opacity:1},{opacity:0}],{duration:400,fill:"forwards"});setTimeout(end,400);return}
if(onScreen){
var l=logo.getBoundingClientRect();
var dx=r.left+r.width/2-(l.left+l.width/2),dy=r.top+r.height/2-(l.top+l.height/2),k=r.width/l.width;
root.querySelector(".intro-logo-wrap").animate([{transform:"none"},{transform:"translate("+dx+"px,"+dy+"px) scale("+k+")"}],{duration:1100,easing:easing,fill:"forwards"});
root.animate([{backgroundColor:"rgba(4,5,8,1)"},{backgroundColor:"rgba(4,5,8,0)"}],{duration:1100,easing:"ease-in-out",fill:"forwards"});
root.querySelectorAll(".intro-stars,.intro-meta,.intro-bar").forEach(function(el){el.animate([{opacity:1},{opacity:0}],{duration:500,fill:"forwards"})});
setTimeout(end,1100);
}else{
root.animate([{transform:"none",borderRadius:"0 0 0 0"},{transform:"translateY(-100%)",borderRadius:"0 0 50% 50% / 0 0 14vh 14vh"}],{duration:950,easing:easing,fill:"forwards"});
setTimeout(end,950);
}
},700);
}
paint(0);requestAnimationFrame(tick);
})();`;

const digitStrip = Array.from({ length: 10 }, (_, i) => i);

function Digit({ units = false }: { units?: boolean }) {
  return (
    <span className="intro-digit" data-digit="" data-units={units ? "" : undefined} suppressHydrationWarning>
      <span>
        {digitStrip.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </span>
    </span>
  );
}

export function IntroLoader() {
  const { w, h } = imageMeta("brand/logo-chrome");
  return (
    <>
      <div
        id="intro"
        className="intro"
        aria-hidden
        suppressHydrationWarning
        style={{ "--logo": `url("${imageSrc("brand/logo-chrome", 800)}")` } as React.CSSProperties}
      >
        <div className="intro-stars" />
        <div className="intro-logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="intro-logo"
            className="intro-logo"
            src={imageSrc("brand/logo-chrome", 800)}
            srcSet={imageSrcSet("brand/logo-chrome")}
            sizes="(min-width: 48rem) 36rem, 80vw"
            width={w}
            height={h}
            alt=""
            fetchPriority="high"
          />
          <span className="intro-shine" />
        </div>
        <div className="intro-meta">
          <p className="intro-label">Nathan Togolo · Portfolio 2026</p>
          <p className="intro-count">
            <Digit />
            <Digit />
            <Digit units />
            <span className="intro-percent">%</span>
          </p>
        </div>
        <div className="intro-bar">
          <span />
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: introBodyScript }} />
    </>
  );
}
