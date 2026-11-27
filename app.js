const STORAGE_KEY = "houkago-board-posts-v1";
const samplePosts = [
  { nickname: "数学好き", category: "勉強", content: "数学の二次関数で、最大値・最小値の考え方が分かりません。おすすめの勉強方法はありますか？", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { nickname: "文化祭実行委員", category: "学校行事", content: "文化祭の企画を考えています！みんなが参加しやすいアイデアを募集中です。", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { nickname: "バスケ部", category: "部活動", content: "バスケ部は今週の金曜日、放課後に見学できます。初心者も大歓迎です！", createdAt: new Date(Date.now() - 86400000).toISOString() }
];

let posts = loadPosts();
let currentFilter = "すべて";

function loadPosts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : samplePosts;
  } catch {
    return samplePosts;
  }
}
function savePosts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}
function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}
function formatDate(value) {
  return new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}
function renderPosts() {
  const visible = currentFilter === "すべて" ? posts : posts.filter(post => post.category === currentFilter);
  document.querySelector("#post-count").textContent = `${visible.length} POSTS`;
  const area = document.querySelector("#posts");
  if (!visible.length) {
    area.innerHTML = '<div class="empty">このカテゴリにはまだ投稿がありません。</div>';
    return;
  }
  area.innerHTML = visible.map(post => `
    <article class="post-card">
      <div class="post-meta"><span class="category">${escapeHTML(post.category)}</span><span>${formatDate(post.createdAt)}</span></div>
      <h3>${escapeHTML(post.content)}</h3>
      <div class="post-author">投稿者：${escapeHTML(post.nickname)}</div>
    </article>
  `).join("");
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
    renderPosts();
  });
});

document.querySelector("#post-form").addEventListener("submit", event => {
  event.preventDefault();
  const nickname = document.querySelector("#nickname").value.trim();
  const category = document.querySelector("#category").value;
  const content = document.querySelector("#content").value.trim();
  const message = document.querySelector("#form-message");
  if (!nickname || !content) {
    message.textContent = "ニックネームと投稿内容を入力してください。";
    return;
  }
  if (content.length > 300) {
    message.textContent = "投稿内容は300文字以内にしてください。";
    return;
  }
  posts.unshift({ nickname, category, content, createdAt: new Date().toISOString() });
  savePosts();
  currentFilter = "すべて";
  document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item.dataset.filter === "すべて"));
  event.target.reset();
  message.textContent = "投稿しました！";
  renderPosts();
});
renderPosts();
