/* Penyimpanan lokal terpusat. Semua data berada di browser pengguna. */
const STORAGE_KEY = "myPrayerJournal_v1";
const DEFAULT_DATA = {
  journals: {}, reflections: {}, targets: [
    {id:"five",label:"Menyelesaikan lima sholat wajib",description:"Subuh, Zuhur, Asar, Magrib, dan Isya.",enabled:true},
    {id:"sunnah",label:"Melaksanakan minimal satu sholat sunnah",description:"Dhuha, Tahajud, Witir, atau Rawatib.",enabled:true},
    {id:"ontime",label:"Menjaga sholat tepat waktu",description:"Usahakan seluruh sholat wajib tepat waktu.",enabled:true}
  ],
  reminders: [
    {name:"Subuh",time:"04:30",enabled:false},{name:"Zuhur",time:"12:00",enabled:false},
    {name:"Asar",time:"15:15",enabled:false},{name:"Magrib",time:"17:30",enabled:false},
    {name:"Isya",time:"19:00",enabled:false}
  ]
};
function clone(value){return JSON.parse(JSON.stringify(value));}
function loadData(){
  try {
    const saved=localStorage.getItem(STORAGE_KEY);
    if(!saved)return clone(DEFAULT_DATA);
    const parsed=JSON.parse(saved);
    return {...clone(DEFAULT_DATA),...parsed,
      journals:parsed.journals||{}, reflections:parsed.reflections||{},
      targets:Array.isArray(parsed.targets)?parsed.targets:clone(DEFAULT_DATA.targets),
      reminders:Array.isArray(parsed.reminders)?parsed.reminders:clone(DEFAULT_DATA.reminders)};
  } catch(error){console.error("Gagal membaca data lokal:",error);return clone(DEFAULT_DATA);}
}
let appData=loadData();
function saveData(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(appData));return true;}
  catch(error){console.error("Gagal menyimpan data:",error);showToast("Penyimpanan gagal. Periksa ruang browser.");return false;}
}
function getDateKey(date=new Date()){
  const d=typeof date==="string"?new Date(date+"T12:00:00"):date;
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function getJournal(dateKey){return appData.journals[dateKey]||{obligatory:{},sunnah:{}};}
function showToast(message){
  const el=document.getElementById("toast");if(!el)return;
  el.textContent=message;el.classList.add("show");
  clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.classList.remove("show"),2600);
}
function exportBackup(){
  const blob=new Blob([JSON.stringify(appData,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");
  a.href=url;a.download=`my-prayer-journal-${getDateKey()}.json`;a.click();URL.revokeObjectURL(url);
}
function importBackup(file){
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const incoming=JSON.parse(reader.result);
      if(!incoming||typeof incoming!=="object"||!incoming.journals||!incoming.reflections)throw new Error("Format tidak sesuai");
      appData={...clone(DEFAULT_DATA),...incoming};saveData();location.reload();
    }catch(error){showToast("File JSON tidak valid atau bukan cadangan jurnal.");}
  };reader.readAsText(file);
}
