function renderReflections(){
  const root=document.getElementById("reflectionHistory");root.innerHTML="";
  const entries=Object.entries(appData.reflections).sort((a,b)=>b[0].localeCompare(a[0]));
  if(!entries.length){root.innerHTML='<div class="empty-state">Belum ada refleksi. Mulai tulis catatan pertamamu.</div>';return;}
  entries.forEach(([id,item])=>{
    const card=document.createElement("article");card.className="reflection-card";
    const title=document.createElement("h3");title.textContent=item.title;
    const date=document.createElement("small");date.textContent=new Date(item.date+"T12:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});
    const body=document.createElement("p");body.textContent=item.text;
    const actions=document.createElement("div");actions.className="card-actions";
    const edit=document.createElement("button");edit.className="small-btn";edit.textContent="Edit";edit.addEventListener("click",()=>editReflection(id));
    const del=document.createElement("button");del.className="small-btn delete";del.textContent="Hapus";del.addEventListener("click",()=>deleteReflection(id));
    actions.append(edit,del);card.append(title,date,body,actions);root.appendChild(card);
  });
}
function saveReflection(event){
  event.preventDefault();const id=document.getElementById("reflectionId").value||`r_${Date.now()}`;
  const date=document.getElementById("reflectionDate").value,title=document.getElementById("reflectionTitle").value.trim(),textValue=document.getElementById("reflectionText").value.trim();
  if(!date||!title||!textValue){showToast("Tanggal, judul, dan isi refleksi wajib diisi.");return;}
  appData.reflections[id]={date,title,text:textValue};saveData();resetReflectionForm();renderReflections();showToast("Refleksi berhasil disimpan.");
}
function editReflection(id){
  const item=appData.reflections[id];if(!item)return;
  document.getElementById("reflectionId").value=id;document.getElementById("reflectionDate").value=item.date;
  document.getElementById("reflectionTitle").value=item.title;document.getElementById("reflectionText").value=item.text;
  document.getElementById("reflectionSubmit").textContent="Perbarui refleksi";document.getElementById("cancelReflection").hidden=false;
  document.getElementById("reflectionForm").scrollIntoView({behavior:"smooth"});
}
function deleteReflection(id){if(!confirm("Hapus refleksi ini?"))return;delete appData.reflections[id];saveData();renderReflections();showToast("Refleksi dihapus.");}
function resetReflectionForm(){
  document.getElementById("reflectionForm").reset();document.getElementById("reflectionId").value="";
  document.getElementById("reflectionDate").value=getDateKey();document.getElementById("reflectionSubmit").textContent="Simpan refleksi";
  document.getElementById("cancelReflection").hidden=true;
}
