const PAGE_TITLES={dashboard:"Dashboard",journal:"Jurnal Sholat",sunnah:"Sholat Sunnah",calendar:"Kalender Jurnal",statistics:"Statistik Ibadah",reflection:"Catatan & Refleksi",targets:"Target Ibadah",reminders:"Pengingat Sholat",reports:"Rekap Laporan"};
function navigate(page){
  if(!PAGE_TITLES[page])return;
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  document.getElementById("pageTitle").textContent=PAGE_TITLES[page];document.getElementById("sidebar").classList.remove("open");
  if(page==="calendar")renderCalendar();if(page==="statistics")renderStatistics();if(page==="reflection")renderReflections();
  if(page==="targets")renderTargets();if(page==="reports")generateReport();
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderDashboard(){
  const today=getDateKey(),c=countDay(today),j=getJournal(today);
  document.getElementById("dashObligatory").innerHTML=`${c.done}<span>/5</span>`;
  document.getElementById("dashSunnah").textContent=c.sunnah;document.getElementById("dashPercent").textContent=c.percent+"%";document.getElementById("dashOnTime").textContent=c.onTime;
  document.getElementById("dashTargetPercent").textContent=targetProgress().percent+"%";
  document.getElementById("dashProgressRing").style.background=`conic-gradient(#2563eb ${targetProgress().percent}%,#eaf0f8 0)`;
  const targetRoot=document.getElementById("dashTargetList");targetRoot.innerHTML="";
  targetProgress().items.forEach(x=>{const row=document.createElement("div");row.className="target-mini-row";row.innerHTML=`<span>${x.label}</span><b>${x.done?"✓":"—"}</b>`;targetRoot.appendChild(row);});
  const activity=document.getElementById("dashActivity");activity.innerHTML="";
  OBLIGATORY.forEach(name=>{const status=j.obligatory[name]?.status||"belum";const row=document.createElement("div");row.className="activity-item";
    const left=document.createElement("div");left.innerHTML=`<strong>${name}</strong><small>${j.obligatory[name]?.time||"Waktu belum dicatat"}</small>`;
    const pill=document.createElement("span");pill.className="status-pill"+(status!=="belum"?" done":"");pill.textContent=status==="tepat"?"Tepat waktu":status==="terlambat"?"Terlambat":"Belum";
    row.append(left,pill);activity.appendChild(row);});
  const now=new Date();document.getElementById("dashboardDate").textContent=now.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  renderDashboardChart();
}
function targetProgress(){
  const enabled=appData.targets.filter(t=>t.enabled),c=countDay(getDateKey());
  const items=enabled.map(t=>({label:t.label,done:t.id==="five"?c.done===5:t.id==="sunnah"?c.sunnah>0:c.done===5&&c.onTime===5}));
  const done=items.filter(i=>i.done).length;return {items,percent:items.length?Math.round(done/items.length*100):0};
}
function renderTargets(){
  const root=document.getElementById("targetSettings");root.innerHTML="";
  appData.targets.forEach(t=>{const label=document.createElement("label");label.className="target-option";
    const cb=document.createElement("input");cb.type="checkbox";cb.checked=t.enabled;cb.dataset.id=t.id;
    const text=document.createElement("span");text.innerHTML=`<strong>${t.label}</strong><small>${t.description}</small>`;
    label.append(cb,text);root.appendChild(label);});
  updateTargetProgress();
}
function updateTargetProgress(){
  const p=targetProgress();document.getElementById("targetProgressText").textContent=p.percent+"%";
  document.getElementById("targetProgressBar").style.width=p.percent+"%";
  const details=document.getElementById("targetProgressDetails");details.textContent=p.items.length?`${p.items.filter(i=>i.done).length} dari ${p.items.length} target tercapai`:"Belum ada target aktif.";
}
function saveTargets(){
  document.querySelectorAll("#targetSettings input").forEach(cb=>{const t=appData.targets.find(x=>x.id===cb.dataset.id);if(t)t.enabled=cb.checked;});
  saveData();renderTargets();showToast("Target ibadah diperbarui.");renderDashboard();
}
function generateReport(){
  const start=document.getElementById("reportStart").value,end=document.getElementById("reportEnd").value;
  const root=document.getElementById("reportContent");if(!start||!end){root.innerHTML='<div class="empty-state">Pilih tanggal awal dan akhir untuk membuat rekap.</div>';return;}
  if(start>end){root.innerHTML='<div class="empty-state">Tanggal awal tidak boleh melewati tanggal akhir.</div>';return;}
  const keys=Object.keys(appData.journals).filter(k=>k>=start&&k<=end).sort();
  let total=0,ontime=0,late=0,sunnah=0;
  const rows=keys.map(k=>{const c=countDay(k);total+=c.done;ontime+=c.onTime;late+=c.late;sunnah+=c.sunnah;
    return `<tr><td>${new Date(k+"T12:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"})}</td><td>${c.done}/5</td><td>${c.onTime}</td><td>${c.late}</td><td>${c.sunnah}</td><td>${c.percent}%</td></tr>`;});
  const possible=keys.length*5,percent=possible?Math.round(total/possible*100):0;
  root.innerHTML=`<h3>Ringkasan ${new Date(start+"T12:00:00").toLocaleDateString("id-ID")} – ${new Date(end+"T12:00:00").toLocaleDateString("id-ID")}</h3>
    <div class="stats-grid"><div class="stat-card"><div class="stat-label">Sholat wajib</div><div class="stat-value">${total}</div></div><div class="stat-card"><div class="stat-label">Tepat waktu</div><div class="stat-value">${ontime}</div></div><div class="stat-card"><div class="stat-label">Terlambat</div><div class="stat-value">${late}</div></div><div class="stat-card"><div class="stat-label">Sholat sunnah</div><div class="stat-value">${sunnah}</div></div></div>
    <p>Persentase pelaksanaan dari hari yang memiliki jurnal: <strong>${percent}%</strong>. Hari tercatat: ${keys.length}.</p>
    <table class="report-table"><thead><tr><th>Tanggal</th><th>Wajib</th><th>Tepat</th><th>Terlambat</th><th>Sunnah</th><th>Capaian</th></tr></thead><tbody>${rows.join("")||'<tr><td colspan="6">Belum ada jurnal pada rentang tanggal ini.</td></tr>'}</tbody></table>`;
}
function refreshAll(){renderDashboard();if(document.getElementById("page-calendar").classList.contains("active"))renderCalendar();if(document.getElementById("page-statistics").classList.contains("active"))renderStatistics();updateTargetProgress();}
function initApp(){
  const today=getDateKey();
  document.getElementById("headerDate").textContent=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
  ["journalDate","sunnahDate","reflectionDate"].forEach(id=>document.getElementById(id).value=today);
  document.getElementById("reportEnd").value=today;const week=new Date();week.setDate(week.getDate()-6);document.getElementById("reportStart").value=getDateKey(week);
  document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
  document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.goto)));
  document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
  document.getElementById("journalDate").addEventListener("change",renderJournal);document.getElementById("sunnahDate").addEventListener("change",renderSunnah);
  document.getElementById("saveJournal").addEventListener("click",saveJournal);document.getElementById("saveSunnah").addEventListener("click",saveSunnah);
  document.getElementById("prevMonth").addEventListener("click",()=>changeCalendarMonth(-1));document.getElementById("nextMonth").addEventListener("click",()=>changeCalendarMonth(1));
  document.getElementById("openSelectedJournal").addEventListener("click",()=>{document.getElementById("journalDate").value=selectedCalendarDate;renderJournal();navigate("journal");});
  document.getElementById("statsPeriod").addEventListener("change",renderStatistics);
  document.getElementById("reflectionForm").addEventListener("submit",saveReflection);document.getElementById("cancelReflection").addEventListener("click",resetReflectionForm);
  document.getElementById("saveTargets").addEventListener("click",saveTargets);
  document.getElementById("notificationPermission").addEventListener("click",requestNotificationPermission);
  document.getElementById("saveReminders").addEventListener("click",()=>{try{saveReminders();}catch(e){showToast(e.message);}});
  document.getElementById("generateReport").addEventListener("click",generateReport);document.getElementById("printReport").addEventListener("click",()=>{generateReport();window.print();});
  document.getElementById("exportData").addEventListener("click",exportBackup);
  document.getElementById("importData").addEventListener("change",event=>importBackup(event.target.files[0]));
  renderJournal();renderSunnah();renderReminders();renderTargets();renderReflections();renderDashboard();startReminderWatcher();
}
document.addEventListener("DOMContentLoaded",initApp);
