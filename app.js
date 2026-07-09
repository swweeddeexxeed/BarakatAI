// ===== data =====
const CROPS = ["Помидор","Огурец","Картофель","Пшеница","Яблоня"];

const DISEASES = {
  "Помидор":[
    {name:"Фитофтороз", latin:"Phytophthora infestans", symptoms:"Жёлтые пятна на листьях, белый налёт снизу", folk:"Настой чеснока 1:10 — опрыскивать каждые 5 дней", chem:"«Ридомил Голд» — 25 г на 10 л воды", confidence:92},
    {name:"Мозаика", latin:"Tomato mosaic virus", symptoms:"Пёстрые жёлто-зелёные пятна, скручивание листьев", folk:"Удалить поражённые листья, обработать молоком с йодом", chem:"«Фитоспорин-М» по инструкции", confidence:87},
  ],
  "Огурец":[
    {name:"Мучнистая роса", latin:"Erysiphe cichoracearum", symptoms:"Белый мучнистый налёт на листьях", folk:"Раствор кальцинированной соды с мылом", chem:"«Топаз» — 2 мл на 10 л воды", confidence:89},
    {name:"Пероноспороз", latin:"Pseudoperonospora cubensis", symptoms:"Жёлтые угловатые пятна, налёт снизу листа", folk:"Опрыскивание отваром хвоща", chem:"«Ордан» — 25 г на 5 л воды", confidence:84},
  ],
  "Картофель":[
    {name:"Фитофтороз", latin:"Phytophthora infestans", symptoms:"Бурые пятна на листьях и клубнях", folk:"Опрыскивание настоем крапивы", chem:"«Ридомил Голд МЦ»", confidence:91},
    {name:"Колорадский жук", latin:"Leptinotarsa decemlineata", symptoms:"Личинки объедают листья", folk:"Ручной сбор + настой полыни", chem:"«Актара» — 4 г на 10 л воды", confidence:95},
  ],
  "Пшеница":[
    {name:"Ржавчина", latin:"Puccinia recondita", symptoms:"Оранжево-бурые пустулы на листьях и стеблях", folk:"Севооборот, ранний посев", chem:"«Фалькон» — 0.6 л/га", confidence:88},
    {name:"Мучнистая роса", latin:"Blumeria graminis", symptoms:"Белый налёт на листьях", folk:"Соблюдение севооборота", chem:"«Альто Супер»", confidence:83},
  ],
  "Яблоня":[
    {name:"Парша", latin:"Venturia inaequalis", symptoms:"Тёмные пятна на листьях и плодах", folk:"Опрыскивание раствором золы", chem:"«Хорус» — 3 г на 10 л воды", confidence:90},
    {name:"Мучнистая роса", latin:"Podosphaera leucotricha", symptoms:"Белый войлочный налёт на побегах", folk:"Обрезка поражённых побегов", chem:"«Топаз»", confidence:86},
  ],
};

const PRICES = {
  "Помидор":[85,90,78,95,110,105],
  "Огурец":[60,55,50,65,70,68],
  "Картофель":[30,32,35,33,38,40],
  "Пшеница":[18,19,20,21,20,22],
  "Яблоня":[70,75,72,80,85,90],
};
const MONTHS = ["Фев","Мар","Апр","Май","Июн","Июл"];

const REGIONS = ["Центр России","Средняя Азия","СНГ (юг)"];
const PLANTING = {
  "Помидор":{"Центр России":"начало мая, после последних заморозков","Средняя Азия":"конец марта","СНГ (юг)":"середина апреля"},
  "Огурец":{"Центр России":"конец мая","Средняя Азия":"начало апреля","СНГ (юг)":"середина апреля"},
  "Картофель":{"Центр России":"начало мая","Средняя Азия":"март","СНГ (юг)":"март-апрель"},
  "Пшеница":{"Центр России":"конец августа (озимая)","Средняя Азия":"октябрь","СНГ (юг)":"сентябрь"},
  "Яблоня":{"Центр России":"апрель или октябрь","Средняя Азия":"март или ноябрь","СНГ (юг)":"март"},
};
const PHASES = ["Растущая луна","Полнолуние","Убывающая луна","Новолуние"];

const VOICE_QA = [
  {keys:["пшениц"], text:"Судя по последнему фото — похоже на ржавчину. Откройте «Диагностику» для лечения."},
  {keys:["огурц","сажать","когда"], text:"По лунному календарю — 15 июля, после полнолуния."},
  {keys:["картошк","картофел","стоит","цена","сколько"], text:"Последняя цена: 38 рублей за килограмм. Обновите через Wi-Fi для точных данных."},
];
function answerFor(q){
  const low = q.toLowerCase();
  for(const a of VOICE_QA){ if(a.keys.some(k=>low.includes(k))) return a.text; }
  return "Пока не понял вопрос. Попробуйте: «Когда сажать...», «Сколько стоит...», «Что с моей...»";
}
function speak(text){
  try{
    if(!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ru-RU"; u.rate = 0.98;
    window.speechSynthesis.speak(u);
  }catch(e){}
}

// ===== navigation =====
function goto(name){
  document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active", s.dataset.screen===name));
  document.querySelectorAll(".tabbtn").forEach(b=>b.classList.toggle("active", b.dataset.goto===name));
}
document.querySelectorAll("[data-goto]").forEach(el=>{
  el.addEventListener("click", ()=>goto(el.dataset.goto));
});

// ===== status bar clock + network =====
function tickClock(){
  const d = new Date();
  document.getElementById("clock").textContent =
    d.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});
}
tickClock(); setInterval(tickClock, 30000);
function updateNet(){
  const el = document.getElementById("netStatus");
  el.textContent = navigator.onLine ? "● сеть" : "● офлайн";
}
updateNet();
window.addEventListener("online", updateNet);
window.addEventListener("offline", updateNet);

// ===== DIAGNOSIS =====
const diagCropsEl = document.getElementById("diagCrops");
const diagScanning = document.getElementById("diagScanning");
const diagScanCrop = document.getElementById("diagScanCrop");
const diagResult = document.getElementById("diagResult");

CROPS.forEach(c=>{
  const b = document.createElement("button");
  b.className = "chip diag-chip";
  b.textContent = "📷 "+c;
  b.addEventListener("click", ()=>scanCrop(c));
  diagCropsEl.appendChild(b);
});

function scanCrop(crop){
  diagCropsEl.classList.add("hidden");
  diagResult.classList.add("hidden");
  diagScanning.classList.remove("hidden");
  diagScanCrop.textContent = crop + " — анализирую офлайн…";
  setTimeout(()=>{
    const options = DISEASES[crop];
    const pick = options[Math.floor(Math.random()*options.length)];
    renderDiagResult(crop, pick);
    diagScanning.classList.add("hidden");
    diagResult.classList.remove("hidden");
  }, 1300);
}

function renderDiagResult(crop, r){
  let activeTab = "folk";
  function render(){
    diagResult.innerHTML = `
      <div class="result-block">
        <div class="result-top">
          <div>
            <p class="muted small">${crop} · уверенность ${r.confidence}%</p>
            <p class="result-name">${r.name}</p>
            <p class="result-latin">${r.latin}</p>
          </div>
          <button class="speak-btn" id="speakBtn">🔊</button>
        </div>
        <p class="result-symptoms">${r.symptoms}</p>
      </div>
      <div class="chip-grid">
        <button class="chip ${activeTab==='folk'?'active':''}" data-tab="folk">🌿 Народное</button>
        <button class="chip ${activeTab==='chem'?'active':''}" data-tab="chem">⚗️ Препарат</button>
      </div>
      <div class="treat-box">${activeTab==='folk'?r.folk:r.chem}</div>
      <button class="link-btn" id="resetBtn">↻ Новое фото</button>
    `;
    diagResult.querySelectorAll("[data-tab]").forEach(btn=>{
      btn.addEventListener("click", ()=>{ activeTab = btn.dataset.tab; render(); });
    });
    document.getElementById("speakBtn").addEventListener("click", ()=>{
      speak(`${r.name}. ${r.symptoms}. ${activeTab==='folk'?r.folk:r.chem}`);
    });
    document.getElementById("resetBtn").addEventListener("click", resetDiag);
  }
  render();
}

function resetDiag(){
  diagResult.classList.add("hidden");
  diagScanning.classList.add("hidden");
  diagCropsEl.classList.remove("hidden");
}

// ===== VOICE =====
const micBtn = document.getElementById("micBtn");
const micHint = document.getElementById("micHint");
const voiceQ = document.getElementById("voiceQ");
const voiceA = document.getElementById("voiceA");
const voiceChips = document.getElementById("voiceChips");

["Что с моей пшеницей?","Когда сажать огурцы?","Сколько стоит картошка?"].forEach(q=>{
  const b = document.createElement("button");
  b.innerHTML = `<span>${q}</span><span>›</span>`;
  b.addEventListener("click", ()=>askVoice(q));
  voiceChips.appendChild(b);
});

function askVoice(q){
  voiceQ.textContent = "«"+q+"»";
  voiceQ.classList.remove("hidden");
  const a = answerFor(q);
  voiceA.innerHTML = "🔊 "+a;
  voiceA.classList.remove("hidden");
  speak(a);
}

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognizer = null, listening = false;
if(SR){
  recognizer = new SR();
  recognizer.lang = "ru-RU";
  recognizer.onresult = (e)=>{
    const text = e.results[0][0].transcript;
    askVoice(text);
  };
  recognizer.onend = ()=>{ listening=false; micBtn.classList.remove("listening"); micHint.textContent="Нажмите и говорите"; };
}else{
  micHint.textContent = "Голосовой ввод недоступен — выберите вопрос ниже";
}
micBtn.addEventListener("click", ()=>{
  if(!recognizer) return;
  voiceQ.classList.add("hidden"); voiceA.classList.add("hidden");
  listening = true;
  micBtn.classList.add("listening");
  micHint.textContent = "Слушаю…";
  try{ recognizer.start(); }catch(e){}
});

// ===== CALENDAR =====
const calCropsEl = document.getElementById("calCrops");
const calRegionsEl = document.getElementById("calRegions");
const calResult = document.getElementById("calResult");
const calUpcoming = document.getElementById("calUpcoming");
let calCrop = "Помидор", calRegion = "Центр России";

function renderCalChips(){
  calCropsEl.innerHTML = "";
  CROPS.forEach(c=>{
    const b = document.createElement("button");
    b.className = "chip"+(c===calCrop?" active":"");
    b.textContent = c;
    b.addEventListener("click", ()=>{ calCrop=c; renderCalChips(); renderCal(); });
    calCropsEl.appendChild(b);
  });
  calRegionsEl.innerHTML = "";
  REGIONS.forEach(r=>{
    const b = document.createElement("button");
    b.className = "chip"+(r===calRegion?" active":"");
    b.textContent = r;
    b.addEventListener("click", ()=>{ calRegion=r; renderCalChips(); renderCal(); });
    calRegionsEl.appendChild(b);
  });
}
function renderCal(){
  calResult.innerHTML = `<strong>${calCrop}</strong> в регионе «${calRegion}»: сажать ${PLANTING[calCrop][calRegion]}.`;
  calUpcoming.innerHTML = "";
  const today = new Date();
  [3,10,17].forEach((d,i)=>{
    const dt = new Date(today.getTime()+d*86400000);
    const dateStr = dt.toLocaleDateString("ru-RU",{day:"numeric",month:"long"});
    const div = document.createElement("div");
    div.className = "upcoming-item";
    div.innerHTML = `<span>🌙</span><div><p class="u-date">${dateStr}</p><p class="u-phase">${PHASES[i%PHASES.length]}</p></div>`;
    calUpcoming.appendChild(div);
  });
}
renderCalChips(); renderCal();

// ===== PRICES =====
const priceCropsEl = document.getElementById("priceCrops");
const priceNow = document.getElementById("priceNow");
const priceTrend = document.getElementById("priceTrend");
const chartEl = document.getElementById("priceChart");
let priceCrop = "Картофель";

function renderPriceChips(){
  priceCropsEl.innerHTML = "";
  CROPS.forEach(c=>{
    const b = document.createElement("button");
    b.className = "chip"+(c===priceCrop?" active":"");
    b.textContent = c;
    b.addEventListener("click", ()=>{ priceCrop=c; renderPriceChips(); renderPrices(); });
    priceCropsEl.appendChild(b);
  });
}
function renderPrices(){
  const data = PRICES[priceCrop];
  const last = data[data.length-1], prev = data[data.length-2];
  const up = last>=prev;
  priceNow.textContent = last+"₽";
  priceTrend.textContent = (up?"▲":"▼")+" за кг сегодня";
  priceTrend.style.color = up ? "var(--sprout)" : "var(--clay)";

  const max = Math.max(...data), min = Math.min(...data);
  const w=300, h=130, padX=10, padY=14;
  const stepX = (w-padX*2)/(data.length-1);
  const pts = data.map((v,i)=>{
    const x = padX + i*stepX;
    const y = padY + (1-(v-min)/(max-min || 1))*(h-padY*2);
    return [x,y];
  });
  const path = pts.map((p,i)=>(i===0?"M":"L")+p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
  const dots = pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#D9A441"/>`).join("");
  const labels = MONTHS.map((m,i)=>`<text x="${pts[i][0]}" y="${h-1}" font-size="8" fill="#93A48C" text-anchor="middle">${m}</text>`).join("");
  chartEl.innerHTML = `
    <line x1="${padX}" y1="${h-padY}" x2="${w-padX}" y2="${h-padY}" stroke="#33452F"/>
    <path d="${path}" fill="none" stroke="#D9A441" stroke-width="2.5"/>
    ${dots}${labels}
  `;
}
document.getElementById("syncBtn").addEventListener("click", function(){
  const btn = this;
  btn.textContent = "⏳ Синхронизация…";
  setTimeout(()=>{ btn.textContent = "📶 Обновить по Wi-Fi"; }, 1200);
});
renderPriceChips(); renderPrices();

// ===== service worker =====
if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("service-worker.js").catch(()=>{});
  });
}
