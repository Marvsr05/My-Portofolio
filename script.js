function copyText(t){
  navigator.clipboard.writeText(t);
  showToast("Email copied to clipboard!");
}

function openWA(){
  window.open("https://wa.me/6283854485889");
}

function toggleDark(){
  document.body.classList.toggle('light-theme');
  const icon = document.querySelector('nav span');
  if(document.body.classList.contains('light-theme')){
    icon.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  } else {
    icon.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  }
}

function showToast(message){
  let toast = document.querySelector(".toast");
  if(!toast){
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toast.hideTimeout);
  toast.hideTimeout = setTimeout(()=> toast.classList.remove("visible"), 2600);
}

function editAbout(){
  const p = document.getElementById("aboutText");
  const ta = document.createElement("textarea");
  ta.id = "aboutInput";
  ta.value = p.innerText;
  p.replaceWith(ta);
}

function saveAbout(){
  const ta = document.getElementById("aboutInput");
  const p = document.createElement("p");
  p.id = "aboutText";
  p.innerText = ta.value;
  ta.replaceWith(p);
  showToast("Saved successfully");
}

async function loadProjects(){
  const { data } = await client.from("projects").select("*");
  const list = document.getElementById("projectList");
  if(!list) return;

  list.innerHTML = "";

  data.forEach(p=>{
    list.innerHTML += `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <button class="delete" onclick="deleteProject(${p.id})">Delete</button>
      </div>
    `;
  });
}

async function addProject(){
  const title = document.getElementById("title").value;
  const description = document.getElementById("desc").value;

  await client.from("projects").insert([{ title, description }]);
  await loadProjects();
  showToast("Saved successfully");
}

async function deleteProject(id){
  await client.from("projects").delete().eq("id",id);
  loadProjects();
}

window.onload = ()=>{
  loadProjects();
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme === 'light'){
    document.body.classList.add('light-theme');
    document.querySelector('nav span').textContent = '☀️';
  } else {
    document.querySelector('nav span').textContent = '🌙';
  }
};