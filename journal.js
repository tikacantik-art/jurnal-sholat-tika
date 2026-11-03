const OBLIGATORY=["Subuh","Zuhur","Asar","Magrib","Isya"];
const SUNNAH=["Dhuha","Tahajud","Witir","Rawatib"];
function renderJournal(){
  const date=document.getElementById("journalDate").value||getDateKey();
  const journal=getJournal(date);const root=document.getElementById("obligatoryList");root.innerHTML="";
  OBLIGATORY.forEach(name=>{
    const item=journal.obligatory[name]||{status:"belum",time:"",note:""};
    root.appendChild(makePrayerRow(name,item,false));
  });
  updateJournalCount();
}
function renderSunnah(){
  const date=document.getElementById("sunnahDate").value||getDateKey();
  const journal=getJournal(date);const root=document.getElementById("sunnahList");root.innerHTML="";
  SUNNAH.forEach(name=>{
    const item=journal.sunnah[name]||{done:false,time:"",note:""};
    root.appendChild(makePrayerRow(name,item,true));
  });
}
function makePrayerRow(name,item,isSunnah){
  const row=document.createElement("div");row.className="prayer-row";row.dataset.name=name;
  const label=document.createElement("div");label.innerHTML=`<span class="prayer-name">${name}</span><span class="prayer-sub">${isSunnah?"Sholat sunnah":"Sholat wajib"}</span>`;
  const check=document.createElement("label");check.className="check-wrap";
  const checkbox=document.createElement("input");checkbox.type="checkbox";checkbox.className="done-check";
  checkbox.checked=isSunnah?!!item.done:item.status==="tepat"||item.status==="terlambat";
  const checkText=document.createElement("span");checkText.textContent=isSunnah?"Sudah dilaksanakan":"Sudah sholat";
  check.append(checkbox,checkText);
  const status=document.createElement("select");status.className="status-select";
  if(!isSunnah){
    [["belum","Belum dilaksanakan"],["tepat","Tepat waktu"],["terlambat","Terlambat"]].forEach(([v,t])=>{const o=document.createElement("option");o.value=v;o.textContent=t;status.append(o);});
    status.value=item.status||"belum";
    checkbox.addEventListener("change",()=>{if(checkbox.checked&&status.value==="belum")status.value="tepat";if(!checkbox.checked)status.value="belum";updateJournalCount();});
    status.addEventListener("change",()=>{checkbox.checked=status.value!=="belum";updateJournalCount();});
  }else{
    status.hidden=true;checkbox.addEventListener("change",()=>{});
  }
  const time=document.createElement("input");time.type="time";time.className="time-input";time.value=item.time||"";time.setAttribute("aria-label",`Waktu ${name}`);
  const note=document.createElement("input");note.type="text";note.className="note-input";note.placeholder="Catatan (opsional)";note.maxLength=180;note.value=item.note||"";
  row.append(label,check,status,time,note);return row;
}
function collectRows(rootId,isSunnah){
  const result={};document.querySelectorAll(`#${rootId} .prayer-row`).forEach(row=>{
    const name=row.dataset.name,done=row.querySelector(".done-check").checked;
    result[name]=isSunnah?{done,time:row.querySelector(".time-input").value,note:row.querySelector(".note-input").value.trim()}:
      {status:row.querySelector(".status-select").value,time:row.querySelector(".time-input").value,note:row.querySelector(".note-input").value.trim()};
  });return result;
}
function updateJournalCount(){
  const rows=[...document.querySelectorAll("#obligatoryList .prayer-row")];
  const count=rows.filter(r=>r.querySelector(".status-select").value!=="belum").length;
  const el=document.getElementById("journalCount");if(el)el.textContent=`${count} dari 5 selesai`;
}
function saveJournal(){
  const date=document.getElementById("journalDate").value;
  if(!date){showToast("Pilih tanggal jurnal terlebih dahulu.");return;}
  const obligatory=collectRows("obligatoryList",false);
  appData.journals[date]={...getJournal(date),obligatory};saveData();
  document.getElementById("journalSaveHint").textContent="Tersimpan pada "+new Date(date+"T12:00:00").toLocaleDateString("id-ID");
  showToast("Jurnal sholat berhasil disimpan.");refreshAll();
}
function saveSunnah(){
  const date=document.getElementById("sunnahDate").value;
  if(!date){showToast("Pilih tanggal jurnal terlebih dahulu.");return;}
  appData.journals[date]={...getJournal(date),sunnah:collectRows("sunnahList",true)};
  saveData();document.getElementById("sunnahSaveHint").textContent="Jurnal sunnah tersimpan.";
  showToast("Jurnal sunnah berhasil disimpan.");refreshAll();
}
function countDay(dateKey){
  const j=getJournal(dateKey);const vals=OBLIGATORY.map(n=>j.obligatory[n]?.status||"belum");
  return {done:vals.filter(v=>v!=="belum").length,onTime:vals.filter(v=>v==="tepat").length,late:vals.filter(v=>v==="terlambat").length,
    sunnah:SUNNAH.filter(n=>j.sunnah[n]?.done).length,percent:Math.round(vals.filter(v=>v!=="belum").length/5*100)};
}
