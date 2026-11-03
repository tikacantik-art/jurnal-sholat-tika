let reminderTimer=null,lastReminderMinute="";
function renderReminders(){
  const root=document.getElementById("reminderList");root.innerHTML="";
  appData.reminders.forEach((item,index)=>{
    const row=document.createElement("div");row.className="reminder-row";
    const name=document.createElement("strong");name.textContent=item.name;
    const time=document.createElement("input");time.type="time";time.className="date-input reminder-time";time.value=item.time;time.dataset.index=index;
    const label=document.createElement("label");label.className="toggle";const toggle=document.createElement("input");toggle.type="checkbox";toggle.className="reminder-toggle";toggle.checked=!!item.enabled;toggle.dataset.index=index;
    label.append(toggle,document.createTextNode("Aktif"));row.append(name,time,label);root.appendChild(row);
  });
}
function saveReminders(){
  const times=[...document.querySelectorAll(".reminder-time")],toggles=[...document.querySelectorAll(".reminder-toggle")];
  times.forEach((input,i)=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.value)){throw new Error("Format waktu tidak valid.");}
    appData.reminders[i].time=input.value;appData.reminders[i].enabled=toggles[i].checked;});
  saveData();startReminderWatcher();showToast("Pengaturan pengingat disimpan.");
}
async function requestNotificationPermission(){
  if(!("Notification" in window)){document.getElementById("notificationStatus").textContent="Browser ini tidak mendukung Notification API.";return;}
  const permission=await Notification.requestPermission();
  document.getElementById("notificationStatus").textContent=permission==="granted"?"Izin notifikasi diberikan.":"Izin notifikasi belum diberikan.";
  if(permission==="granted")showToast("Notifikasi browser diizinkan.");
}
function startReminderWatcher(){
  if(reminderTimer)clearInterval(reminderTimer);
  reminderTimer=setInterval(()=>{
    const now=new Date(),minute=`${getDateKey()}-${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    if(minute===lastReminderMinute)return;
    appData.reminders.filter(r=>r.enabled&&r.time===minute.slice(-5)).forEach(r=>{
      if("Notification" in window&&Notification.permission==="granted")new Notification(`Waktu sholat ${r.name}`,{body:`Sekarang ${r.time}. Yuk tunaikan sholat.`,tag:`prayer-${r.name}-${minute}`});
      else showToast(`Pengingat: waktu sholat ${r.name} (${r.time}).`);
    });lastReminderMinute=minute;
  },15000);
}
