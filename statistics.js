let dashboardChart=null,trendChart=null,statusChart=null;
function lastDateKeys(days){const out=[];for(let i=days-1;i>=0;i--){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-i);out.push(getDateKey(d));}return out;}
function drawChart(canvasId,oldChart,config){const canvas=document.getElementById(canvasId);if(!canvas||typeof Chart==="undefined")return oldChart;if(oldChart)oldChart.destroy();return new Chart(canvas,{...config,options:{responsive:true,maintainAspectRatio:false,...config.options}});}
function renderDashboardChart(){
  const keys=lastDateKeys(7),values=keys.map(k=>countDay(k).done);
  dashboardChart=drawChart("dashboardChart",dashboardChart,{type:"line",data:{labels:keys.map(k=>new Date(k+"T12:00:00").toLocaleDateString("id-ID",{weekday:"short"})),datasets:[{label:"Sholat wajib",data:values,borderColor:"#2563eb",backgroundColor:"rgba(37,99,235,.12)",fill:true,tension:.35,pointRadius:3}]},options:{scales:{y:{beginAtZero:true,max:5,ticks:{stepSize:1}},x:{grid:{display:false}}},plugins:{legend:{display:false}}}});
}
function renderStatistics(){
  const days=Number(document.getElementById("statsPeriod").value||7),keys=lastDateKeys(days),counts=keys.map(countDay);
  const total=counts.reduce((s,c)=>s+c.done,0),ontime=counts.reduce((s,c)=>s+c.onTime,0),late=counts.reduce((s,c)=>s+c.late,0),sunnah=counts.reduce((s,c)=>s+c.sunnah,0);
  document.getElementById("statTotal").textContent=total;document.getElementById("statOnTime").textContent=ontime;
  document.getElementById("statLate").textContent=late;document.getElementById("statSunnah").textContent=sunnah;
  const labels=keys.map(k=>new Date(k+"T12:00:00").toLocaleDateString("id-ID",{day:"numeric",month:days>7?"short":undefined}));
  trendChart=drawChart("trendChart",trendChart,{type:"bar",data:{labels,datasets:[{label:"Sholat wajib",data:counts.map(c=>c.done),backgroundColor:"#60a5fa",borderRadius:5}]},options:{scales:{y:{beginAtZero:true,max:5,ticks:{stepSize:1}},x:{grid:{display:false}}},plugins:{legend:{display:false}}}});
  statusChart=drawChart("statusChart",statusChart,{type:"doughnut",data:{labels:["Tepat waktu","Terlambat","Belum"],datasets:[{data:[ontime,late,Math.max(0,days*5-total)],backgroundColor:["#2563eb","#f59e0b","#e5e7eb"],borderWidth:0}]},options:{cutout:"68%",plugins:{legend:{position:"bottom",labels:{usePointStyle:true,padding:16}}}}});
}
