const $ = id => document.getElementById(id);
const STORE = "hingeCopilotProfilesV1";
let profiles = load();
let currentPrompt = "";
let deferredInstall = null;

function load(){try{return JSON.parse(localStorage.getItem(STORE)||"[]")}catch{return []}}
function persist(){localStorage.setItem(STORE,JSON.stringify(profiles));renderSaved()}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2100)}
function showView(name){document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));$("view-"+name).classList.remove("hidden");document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.view===name));if(name==="saved")renderSaved();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>showView(t.dataset.view)));

function makePrompt(nickname,prompts,details){
return `You are my thoughtful, socially intelligent dating copilot. Help me decide how to engage authentically; do not pretend to know someone's inner personality from a dating profile.

MY PREFERENCES
- Intent: casual dating.
- Conversation style: adapt naturally; use a mixture of witty, thoughtful, playful and lightly flirty approaches when appropriate.
- Tone: adapt to her demonstrated communication style and profile energy. Never force flirtation.
- Approval: draft only. I personally review and approve every like, comment and message.
- Compatibility priorities (equal weight): shared interests, intellectual compatibility, sense of humour.

PROFILE CONTEXT
${nickname ? "My private nickname for this profile: "+nickname : "No nickname supplied."}
Her voluntarily shared Hinge prompts:
${prompts}
Additional non-sensitive context:
${details || "None supplied."}

TASK
1. Extract explicit interests and themes. Separate evidence from cautious interpretation.
2. Identify 2-3 natural points of connection or thoughtful questions.
3. Give a compatibility assessment across my three priorities. Use a qualitative low / medium / high rating with a brief evidence-based explanation; do not invent a precise scientific score.
4. Suggest a like/pass recommendation with reasoning, but leave the decision to me.
5. Draft 3 distinct opening comments tied to a specific prompt: (a) witty, (b) curious/intellectual, (c) playful/lightly flirty. Keep each concise, specific and easy to answer.
6. Explain which opener best fits her apparent profile tone and why.
7. Avoid generic compliments, manipulative tactics, assumptions about appearance, and claims about her personality that the prompts do not support.
8. Keep my voice confident, relaxed and authentic. Do not fabricate shared experiences or interests.

Return clear headings and ready-to-copy drafts. Do not send anything or interact with Hinge.`;
}

$("profileForm").addEventListener("submit",e=>{
 e.preventDefault();
 const prompts=$("prompts").value.trim();
 if(!prompts){toast("Add at least one profile prompt.");return}
 currentPrompt=makePrompt($("nickname").value.trim(),prompts,$("details").value.trim());
 $("analysisPrompt").textContent=currentPrompt;
 $("promptResult").classList.remove("hidden");
 $("saveProfile").disabled=false;
 toast("Your analysis prompt is ready.");
 $("promptResult").scrollIntoView({behavior:"smooth",block:"start"});
});
$("clearForm").addEventListener("click",()=>{
 $("profileForm").reset();$("promptResult").classList.add("hidden");$("aiResult").value="";$("saveProfile").disabled=true;currentPrompt="";toast("Form cleared.");
});
$("copyPrompt").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(currentPrompt);toast("Prompt copied. Paste it into ChatGPT or Gemini.");}catch{toast("Select and copy the prompt manually.");}});
$("openChatGPT").addEventListener("click",()=>window.open("https://chatgpt.com/","_blank","noopener"));
$("saveProfile").addEventListener("click",()=>{
 const result=$("aiResult").value.trim();
 if(!result){toast("Paste the AI response before saving.");return}
 const item={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),nickname:$("nickname").value.trim()||"Untitled profile",prompts:$("prompts").value.trim(),details:$("details").value.trim(),result,createdAt:new Date().toISOString()};
 profiles.unshift(item);persist();$("aiResult").value="";$("saveProfile").disabled=true;toast("Profile saved on this device.");showView("saved");
});
function renderSaved(){
 $("savedCount").textContent=profiles.length;
 $("emptySaved").classList.toggle("hidden",profiles.length>0);
 $("profileList").innerHTML="";
 profiles.forEach(p=>{
  const b=document.createElement("button");b.className="profile-card";
  const left=document.createElement("span");const strong=document.createElement("strong");strong.textContent=p.nickname;const small=document.createElement("small");small.textContent=new Date(p.createdAt).toLocaleDateString()+" · "+p.prompts.slice(0,65)+(p.prompts.length>65?"…":"");left.append(strong,small);
  const arrow=document.createElement("span");arrow.textContent="↗";b.append(left,arrow);b.addEventListener("click",()=>showDetail(p.id));$("profileList").append(b);
 });
}
function showDetail(id){
 const p=profiles.find(x=>x.id===id);if(!p)return;const box=$("profileDetail");box.classList.remove("hidden");box.innerHTML="";
 const title=document.createElement("h3");title.textContent=p.nickname;
 const date=document.createElement("p");date.className="muted small";date.textContent="Saved "+new Date(p.createdAt).toLocaleString();
 const h=document.createElement("p");h.className="eyebrow";h.textContent="AI ANALYSIS";
 const body=document.createElement("div");body.className="detail-text";body.textContent=p.result;
 const actions=document.createElement("div");actions.className="detail-actions";
 const copy=document.createElement("button");copy.className="btn btn-secondary";copy.textContent="Copy analysis";copy.onclick=()=>navigator.clipboard.writeText(p.result).then(()=>toast("Analysis copied."));
 const del=document.createElement("button");del.className="btn btn-danger";del.textContent="Delete profile";del.onclick=()=>{if(confirm("Delete this saved profile from this device?")){profiles=profiles.filter(x=>x.id!==id);persist();box.classList.add("hidden");toast("Profile deleted.");}};
 actions.append(copy,del);box.replaceChildren(title,date,h,body,actions);box.scrollIntoView({behavior:"smooth",block:"start"});
}
$("exportData").addEventListener("click",()=>{
 const blob=new Blob([JSON.stringify(profiles,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="hinge-copilot-data.json";a.click();URL.revokeObjectURL(url);toast("Export prepared.");
});
$("deleteData").addEventListener("click",()=>{if(confirm("Permanently delete all saved profiles from this browser? This cannot be undone.")){profiles=[];persist();$("profileDetail").classList.add("hidden");toast("Local data deleted.");}});
renderSaved();

if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;$("installBtn").classList.remove("hidden")});
$("installBtn").addEventListener("click",async()=>{if(!deferredInstall){toast("Use your browser menu and choose Add to Home screen.");return}deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$("installBtn").classList.add("hidden")});
