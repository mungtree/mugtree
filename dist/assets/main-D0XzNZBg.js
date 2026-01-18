(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=e(n);fetch(n.href,i)}})();class f{constructor(t){this.canvas=document.getElementById(t),this.canvas&&(this.ctx=this.canvas.getContext("2d"),this.particles=[],this.mouse={x:0,y:0},this.windAngle=0,this.config={particleCount:100,minSize:.5,maxSize:3,minSpeed:2,maxSpeed:8,windStrength:.3,turbulence:.02,colors:["rgba(139, 37, 0, 0.4)","rgba(102, 0, 0, 0.3)","rgba(255, 69, 0, 0.2)","rgba(255, 107, 53, 0.15)","rgba(20, 20, 20, 0.5)","rgba(40, 30, 20, 0.4)"]},this.init())}init(){this.resize(),this.createParticles(),this.bindEvents(),this.animate()}resize(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}createParticles(){for(let t=0;t<this.config.particleCount;t++)this.particles.push(this.createParticle())}createParticle(t=!1){const e=this.random(this.config.minSize,this.config.maxSize),s=this.random(this.config.minSpeed,this.config.maxSpeed);return{x:t?-10:this.random(0,this.canvas.width),y:this.random(0,this.canvas.height),size:e,baseSpeed:s,speedX:s,speedY:this.random(-1,1),color:this.config.colors[Math.floor(Math.random()*this.config.colors.length)],opacity:this.random(.1,.6),noise:this.random(0,1e3),noiseSpeed:this.random(.01,.03),trail:[],maxTrail:Math.floor(this.random(3,8))}}random(t,e){return Math.random()*(e-t)+t}bindEvents(){window.addEventListener("resize",()=>this.resize()),window.addEventListener("mousemove",t=>{this.mouse.x=t.clientX,this.mouse.y=t.clientY})}noise(t){return Math.sin(t*.5)*Math.cos(t*.3)+Math.sin(t*.7)}update(){this.windAngle+=this.config.turbulence,this.particles.forEach((t,e)=>{t.trail.unshift({x:t.x,y:t.y}),t.trail.length>t.maxTrail&&t.trail.pop(),t.noise+=t.noiseSpeed;const s=this.noise(t.noise)*2,n=this.noise(t.noise+100)*1.5,i=Math.cos(this.windAngle)*this.config.windStrength,a=Math.sin(this.windAngle*.5)*this.config.windStrength*.3;t.x+=t.speedX+s+i,t.y+=t.speedY+n+a;const c=t.x-this.mouse.x,o=t.y-this.mouse.y,h=Math.sqrt(c*c+o*o);if(h<150){const l=(150-h)/150;t.x+=c/h*l*3,t.y+=o/h*l*3}t.x>this.canvas.width+20&&(this.particles[e]=this.createParticle(!0)),t.y<-20&&(t.y=this.canvas.height+20),t.y>this.canvas.height+20&&(t.y=-20)})}draw(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.particles.forEach(t=>{if(t.trail.length>1){this.ctx.beginPath(),this.ctx.moveTo(t.trail[0].x,t.trail[0].y);for(let e=1;e<t.trail.length;e++)this.ctx.lineTo(t.trail[e].x,t.trail[e].y);this.ctx.strokeStyle=t.color.replace(/[\d.]+\)$/,t.opacity*.3+")"),this.ctx.lineWidth=t.size*.5,this.ctx.stroke()}if(this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.size,0,Math.PI*2),this.ctx.fillStyle=t.color,this.ctx.fill(),t.size>2){const e=this.ctx.createRadialGradient(t.x,t.y,0,t.x,t.y,t.size*3);e.addColorStop(0,"rgba(255, 69, 0, 0.1)"),e.addColorStop(1,"transparent"),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.size*3,0,Math.PI*2),this.ctx.fillStyle=e,this.ctx.fill()}})}animate(){this.update(),this.draw(),requestAnimationFrame(()=>this.animate())}}class g{constructor(t){this.canvas=document.getElementById(t),this.canvas&&(this.ctx=this.canvas.getContext("2d"),this.embers=[],this.config={emberCount:20,spawnRate:.3,minSize:1,maxSize:4,riseSpeed:{min:.5,max:2},drift:1.5,colors:[{r:255,g:69,b:0},{r:255,g:107,b:53},{r:255,g:140,b:0},{r:255,g:87,b:34}]},this.init())}init(){this.resize(),this.bindEvents(),this.animate()}resize(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}createEmber(){const t=this.config.colors[Math.floor(Math.random()*this.config.colors.length)];return{x:Math.random()*this.canvas.width,y:this.canvas.height+10,size:this.random(this.config.minSize,this.config.maxSize),riseSpeed:this.random(this.config.riseSpeed.min,this.config.riseSpeed.max),drift:(Math.random()-.5)*this.config.drift,wobble:Math.random()*Math.PI*2,wobbleSpeed:this.random(.02,.08),color:t,life:1,decay:this.random(.002,.008),flicker:Math.random(),flickerSpeed:this.random(.1,.3)}}random(t,e){return Math.random()*(e-t)+t}bindEvents(){window.addEventListener("resize",()=>this.resize())}update(){Math.random()<this.config.spawnRate&&this.embers.length<this.config.emberCount&&this.embers.push(this.createEmber()),this.embers=this.embers.filter(t=>(t.wobble+=t.wobbleSpeed,t.flicker+=t.flickerSpeed,t.y-=t.riseSpeed,t.x+=t.drift+Math.sin(t.wobble)*.5,t.life-=t.decay,t.riseSpeed*=.999,t.life>0&&t.y>-50))}draw(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.embers.forEach(t=>{const e=.5+Math.sin(t.flicker)*.5,s=t.life*e,n=t.size*8,i=this.ctx.createRadialGradient(t.x,t.y,0,t.x,t.y,n);i.addColorStop(0,`rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, ${s*.4})`),i.addColorStop(.4,`rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, ${s*.1})`),i.addColorStop(1,"transparent"),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,n,0,Math.PI*2),this.ctx.fillStyle=i,this.ctx.fill(),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.size*t.life,0,Math.PI*2),this.ctx.fillStyle=`rgba(255, 255, 200, ${s})`,this.ctx.fill(),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.size*1.5*t.life,0,Math.PI*2),this.ctx.fillStyle=`rgba(${t.color.r}, ${t.color.g}, ${t.color.b}, ${s*.8})`,this.ctx.fill()})}animate(){this.update(),this.draw(),requestAnimationFrame(()=>this.animate())}}class x{constructor(t){this.canvas=t,this.ctx=t.getContext("2d"),this.active=!1,this.particles=[],this.center={x:0,y:0},this.radius=100,this.angle=0}spawn(t,e){if(!this.active){this.active=!0,this.center={x:t,y:e},this.particles=[],this.angle=0;for(let s=0;s<50;s++)this.particles.push({angle:Math.random()*Math.PI*2,radius:Math.random()*this.radius,speed:.05+Math.random()*.1,size:1+Math.random()*2,riseSpeed:.5+Math.random()*1,y:0});setTimeout(()=>{this.active=!1,this.particles=[]},5e3)}}update(){this.active&&(this.angle+=.02,this.particles.forEach(t=>{t.angle+=t.speed,t.y-=t.riseSpeed,t.radius+=.2}))}draw(){this.active&&this.particles.forEach(t=>{const e=this.center.x+Math.cos(t.angle)*t.radius,s=this.center.y+t.y+Math.sin(t.angle)*t.radius*.3;this.ctx.beginPath(),this.ctx.arc(e,s,t.size,0,Math.PI*2),this.ctx.fillStyle=`rgba(139, 37, 0, ${.5-Math.abs(t.y)/500})`,this.ctx.fill()})}}class p{constructor(t){this.container=document.getElementById(t),this.container&&(this.debris=[],this.init())}init(){for(let t=0;t<15;t++)this.createDebris()}createDebris(){const t=document.createElement("div"),e=2+Math.random()*8,s=Math.random()*100,n=Math.random()*100,i=10+Math.random()*20,a=Math.random()*10;t.style.cssText=`
            position: absolute;
            width: ${e}px;
            height: ${e}px;
            background: rgba(20, 20, 20, 0.8);
            border-radius: ${Math.random()>.5?"50%":"2px"};
            left: ${s}%;
            top: ${n}%;
            animation: float-debris ${i}s ease-in-out ${a}s infinite;
            box-shadow: 0 0 ${e}px rgba(255, 69, 0, 0.1);
        `,this.container.appendChild(t),this.debris.push(t)}}const d=document.createElement("style");d.textContent=`
    @keyframes float-debris {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.3;
        }
        25% {
            transform: translate(20px, -30px) rotate(90deg);
            opacity: 0.6;
        }
        50% {
            transform: translate(-10px, -50px) rotate(180deg);
            opacity: 0.4;
        }
        75% {
            transform: translate(30px, -20px) rotate(270deg);
            opacity: 0.5;
        }
    }
`;document.head.appendChild(d);document.addEventListener("DOMContentLoaded",()=>{const r=new f("sand-canvas"),t=new g("ember-canvas"),e=new p("debris-container");if(r.canvas){const s=new x(r.canvas);setInterval(()=>{if(Math.random()<.3){const n=Math.random()*window.innerWidth,i=window.innerHeight*.7;s.spawn(n,i)}},1e4)}window.desertEffects={sandstorm:r,embers:t,debris:e}});class y{constructor(){this.cursor=document.getElementById("cursor"),this.cursorDot=document.getElementById("cursor-dot"),this.pos={x:0,y:0},this.mouse={x:0,y:0},this.speed=.5,this.init()}init(){document.addEventListener("mousemove",t=>{this.mouse.x=t.clientX,this.mouse.y=t.clientY}),document.querySelectorAll("a, button, .interactive").forEach(t=>{t.addEventListener("mouseenter",()=>{this.cursor.style.width="50px",this.cursor.style.height="50px",this.cursor.style.borderColor="#ff6b35"}),t.addEventListener("mouseleave",()=>{this.cursor.style.width="20px",this.cursor.style.height="20px",this.cursor.style.borderColor="#ff4500"})}),this.animate()}animate(){this.pos.x+=(this.mouse.x-this.pos.x)*this.speed,this.pos.y+=(this.mouse.y-this.pos.y)*this.speed,this.cursor.style.left=this.pos.x-10+"px",this.cursor.style.top=this.pos.y-10+"px",this.cursorDot.style.left=this.mouse.x-2+"px",this.cursorDot.style.top=this.mouse.y-2+"px",requestAnimationFrame(()=>this.animate())}}class w{constructor(t){this.el=t,this.chars="!<>-_\\/[]{}—=+*^?#_______",this.update=this.update.bind(this)}setText(t){const e=this.el.innerText,s=Math.max(e.length,t.length),n=new Promise(i=>this.resolve=i);this.queue=[];for(let i=0;i<s;i++){const a=e[i]||"",c=t[i]||"",o=Math.floor(Math.random()*40),h=o+Math.floor(Math.random()*40);this.queue.push({from:a,to:c,start:o,end:h})}return cancelAnimationFrame(this.frameRequest),this.frame=0,this.update(),n}update(){let t="",e=0;for(let s=0,n=this.queue.length;s<n;s++){let{from:i,to:a,start:c,end:o,char:h}=this.queue[s];this.frame>=o?(e++,t+=a):this.frame>=c?((!h||Math.random()<.28)&&(h=this.randomChar(),this.queue[s].char=h),t+=`<span class="text-ember/40">${h}</span>`):t+=i}this.el.innerHTML=t,e===this.queue.length?this.resolve():(this.frameRequest=requestAnimationFrame(this.update),this.frame++)}randomChar(){return this.chars[Math.floor(Math.random()*this.chars.length)]}}class M{constructor(){this.active=!1,this.overlay=this.createOverlay()}createOverlay(){const t=document.createElement("div");return t.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            display: none;
        `,document.body.appendChild(t),t}trigger(){if(!this.active){this.active=!0,document.body.style.animation="screen-shake 0.3s ease",this.overlay.style.display="block",this.overlay.style.background=`rgba(255, 69, 0, ${Math.random()*.3})`;for(let t=0;t<5;t++){const e=document.createElement("div"),s=Math.random()*100,n=Math.random()*100;e.style.cssText=`
                position: absolute;
                left: 0;
                width: 100%;
                top: ${n}%;
                height: ${s}px;
                background: rgba(255, 69, 0, 0.1);
                transform: translateX(${(Math.random()-.5)*50}px);
            `,this.overlay.appendChild(e)}setTimeout(()=>{this.overlay.style.display="none",this.overlay.innerHTML="",document.body.style.animation="",this.active=!1},150)}}}const u=document.createElement("style");u.textContent=`
    @keyframes screen-shake {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        10% { transform: translate(-5px, -5px) rotate(-0.5deg); }
        20% { transform: translate(5px, -5px) rotate(0.5deg); }
        30% { transform: translate(-5px, 5px) rotate(-0.5deg); }
        40% { transform: translate(5px, 5px) rotate(0.5deg); }
        50% { transform: translate(-5px, -5px) rotate(-0.5deg); }
        60% { transform: translate(5px, -5px) rotate(0.5deg); }
        70% { transform: translate(-5px, 5px) rotate(-0.5deg); }
        80% { transform: translate(5px, 5px) rotate(0.5deg); }
        90% { transform: translate(-5px, -5px) rotate(-0.5deg); }
    }
`;document.head.appendChild(u);class v{constructor(){this.elements=[],this.sunOrb=null,this.mouseX=0,this.mouseY=0,this.targetMouseX=0,this.targetMouseY=0,this.scrollTicking=!1,this.mouseTicking=!1,this.init()}init(){this.sunOrb=document.getElementById("sun-orb"),this.sunOrb&&this.elements.push({el:this.sunOrb.parentElement.parentElement,speed:.3,type:"scroll"}),window.addEventListener("scroll",()=>this.onScroll(),{passive:!0}),window.addEventListener("mousemove",t=>this.onMouseMove(t),{passive:!0}),this.animateMouseParallax()}onScroll(){this.scrollTicking||(requestAnimationFrame(()=>{const t=window.pageYOffset;this.elements.forEach(e=>{if(e.type==="scroll"){const s=t*e.speed;e.el.style.transform=`translate(-50%, calc(-50% + ${s}px))`}}),this.scrollTicking=!1}),this.scrollTicking=!0)}onMouseMove(t){this.targetMouseX=(t.clientX/window.innerWidth-.5)*2,this.targetMouseY=(t.clientY/window.innerHeight-.5)*2}animateMouseParallax(){this.mouseX+=(this.targetMouseX-this.mouseX)*.1,this.mouseY+=(this.targetMouseY-this.mouseY)*.1,this.sunOrb&&(this.sunOrb.style.transform=`translate(${this.mouseX*10}px, ${this.mouseY*10}px)`),requestAnimationFrame(()=>this.animateMouseParallax())}}class b{constructor(t,e,s=2e3){this.element=t,this.target=e,this.duration=s,this.current=0}start(){const t=performance.now(),e=s=>{const n=s-t,i=Math.min(n/this.duration,1),a=1-Math.pow(1-i,3);this.current=Math.floor(a*this.target),this.element.textContent=this.current,i<1&&requestAnimationFrame(e)};requestAnimationFrame(e)}}class S{constructor(){this.init()}init(){const t=new IntersectionObserver(e=>{e.forEach(s=>{s.isIntersecting&&(s.target.classList.add("revealed"),s.target.classList.contains("glitch-on-reveal")&&this.triggerGlitch(s.target))})},{threshold:.2});document.querySelectorAll("section").forEach(e=>{t.observe(e)})}triggerGlitch(t){t.style.animation="glitch-reveal 0.5s ease forwards"}}class E{constructor(t){this.element=document.getElementById(t),this.element&&(this.baseTemp=127,this.fluctuate())}fluctuate(){setInterval(()=>{const t=Math.floor((Math.random()-.5)*10),e=this.baseTemp+t;this.element.textContent=e,e>130?(this.element.style.color="#ff4500",this.element.style.textShadow="0 0 10px #ff4500"):(this.element.style.color="",this.element.style.textShadow="")},2e3)}}class T{constructor(){this.scheduleNext()}scheduleNext(){const t=5e3+Math.random()*15e3;setTimeout(()=>{this.trigger(),this.scheduleNext()},t)}trigger(){document.body.style.filter=`
            hue-rotate(${Math.random()*30-15}deg)
            saturate(${1+Math.random()*.5})
        `,setTimeout(()=>{document.body.style.filter=""},100)}}class C{constructor(){this.messages=["MY DISCORD: meett","I CODE SOMETIMES","ॐ नमो नारायणाय","ॐ नमः शिवाय","The moon and sun are kind enough to shine indiscriminately","( ͡° ͜ʖ ͡°)","wassah dude"],this.scheduleMessage()}scheduleMessage(){const t=2e4+Math.random()*4e4;setTimeout(()=>{this.showMessage(),this.scheduleMessage()},t)}showMessage(){const t=this.messages[Math.floor(Math.random()*this.messages.length)],e=document.createElement("div");e.textContent=t,e.style.cssText=`
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Space Mono', monospace;
            font-size: 3vw;
            color: rgba(255, 69, 0, 0.15);
            pointer-events: none;
            z-index: 9994;
            letter-spacing: 0.5em;
            animation: creepy-fade 2s ease forwards;
        `,document.body.appendChild(e),setTimeout(()=>e.remove(),2e3)}}const m=document.createElement("style");m.textContent=`
    @keyframes creepy-fade {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1); }
    }

    @keyframes glitch-reveal {
        0% { transform: skew(0deg); filter: blur(10px); opacity: 0; }
        20% { transform: skew(-5deg); filter: blur(5px); }
        40% { transform: skew(3deg); filter: blur(2px); }
        60% { transform: skew(-2deg); filter: blur(1px); }
        80% { transform: skew(1deg); filter: blur(0); }
        100% { transform: skew(0deg); filter: blur(0); opacity: 1; }
    }
`;document.head.appendChild(m);class k{constructor(){this.sun=document.getElementById("sun-orb"),this.sun&&this.breathe()}breathe(){let t=1,e=!0;const s=.95,n=1.05,i=.001,a=()=>{e?(t+=i,t>=n&&(e=!1)):(t-=i,t<=s&&(e=!0)),this.sun.style.transform=`scale(${t})`,requestAnimationFrame(a)};a()}}document.addEventListener("DOMContentLoaded",()=>{const r=new y,t=new v,e=new M;new S,new E("temp-counter"),new T,new C,new k;const s=document.getElementById("tagline");if(s){const c=new w(s),o=["// ॐ नमो नारायणाय //","// THE MIND IS A WONDERFUL SERVANT BUT A TERRIBLE MASTER //","// ( ͡° ͜ʖ ͡°) //","// DISCORD: meett //","// ॐ नमः शिवाय //"];let h=0;const l=()=>{c.setText(o[h]).then(()=>{setTimeout(l,5e3)}),h=(h+1)%o.length};setTimeout(l,3e3)}const n=document.getElementById("counter-days");if(n){const c=new IntersectionObserver(o=>{o[0].isIntersecting&&(new b(n,2847,3e3).start(),c.disconnect())});c.observe(n)}document.addEventListener("click",()=>{Math.random()<.3&&e.trigger()});let i=0;const a=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];document.addEventListener("keydown",c=>{if(c.key===a[i]){if(i++,i===a.length){for(let o=0;o<10;o++)setTimeout(()=>e.trigger(),o*100);i=0}}else i=0}),window.mugtree={cursor:r,parallax:t,glitchBurst:e,triggerGlitch:()=>e.trigger()},console.log("%c MUGTREE ","background: #ff4500; color: #000; font-size: 20px; font-weight: bold;"),console.log("%c Welcome to the wasteland... ","color: #ff6b35; font-style: italic;")});
