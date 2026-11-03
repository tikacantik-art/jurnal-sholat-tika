let calendarCursor=new Date();let selectedCalendarDate=getDateKey();
function renderCalendar(){
  const year=calendarCursor.getFullYear(),month=calendarCursor.getMonth();
  document.getElementById("calendarMonth").textContent=calendarCursor.toLocaleDateString("id-ID",{month:"long",year:"numeric"});
  const root=document.getElementById("calendarDays");root.innerHTML="";
  const first=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate(),prevDays=new Date(year,month,0).getDate();
  for(let i=0;i<42;i++){
    let day,dt,muted=false;
    if(i<first){day=prevDays-first+i+1;dt=new Date(year,month-1,day);muted=true;}
    else if(i>=first+days){day=i-first-days+1;dt=new Date(year,month+1,day);muted=true;}
    else{day=i-first+1;dt=new Date(year,month,day);}
    const key=getDateKey(dt),btn=document.createElement("button");btn.className="day-cell"+(muted?" muted":"");
    if(key===getDateKey())btn.classList.add("today");if(key===selectedCalendarDate)btn.classList.add("selected");
    const c=countDay(key);if(c.done||c.sunnah)btn.classList.add("has-data");
    btn.textContent=day;btn.addEventListener("click",()=>{selectedCalendarDate=key;renderCalendar();renderCalendarSummary();});
    root.appendChild(btn);
  }
  renderCalendarSummary();
}
function renderCalendarSummary(){
  const c=countDay(selectedCalendarDate),date=new Date(selectedCalendarDate+"T12:00:00");
  document.getElementById("selectedDateTitle").textContent=date.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const root=document.getElementById("calendarSummary");
  root.innerHTML=`<div class="summary-number">${c.percent}%</div><div class="summary-caption">${c.done} dari 5 sholat wajib dilaksanakan</div>
    <div class="summary-line"><span>Tepat waktu</span><strong>${c.onTime}</strong></div>
    <div class="summary-line"><span>Terlambat</span><strong>${c.late}</strong></div>
    <div class="summary-line"><span>Sholat sunnah</span><strong>${c.sunnah}</strong></div>`;
}
function changeCalendarMonth(delta){calendarCursor.setMonth(calendarCursor.getMonth()+delta);renderCalendar();}
