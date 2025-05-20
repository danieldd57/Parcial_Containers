async function loadAll() {
  const res = await fetch("/api/posts");
  const data = await res.json();
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
}

async function loadById() {
  const id = document.getElementById("postId").value;
  if (!id) {
    alert("Por favor ingrese un ID");
    return;
  }
  const res = await fetch(`/api/posts/${id}`);
  const data = await res.json();
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
}
