const posts = [
  {
    id: "post-1",
    title: "Design systems that scale for teams",
    excerpt: "A practical guide for building a design system with consistency, accessibility, and real-world team workflows.",
    date: "Jun 20, 2026",
    category: "Design",
    tags: ["UI", "Design systems", "Productivity"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    body: `<p>Design systems help teams build faster by reusing components, shared language, and consistent interaction patterns. When the system evolves with the product, it becomes a reliable source of brand and product truth.</p><p>In this post, we cover how to audit components, structure tokens, and onboard contributors so every release stays aligned and polished.</p>`,
  },
  {
    id: "post-2",
    title: "Writing engaging content for modern readers",
    excerpt: "Techniques for making long-form articles clear, scannable, and compelling for people who read on the go.",
    date: "Jun 14, 2026",
    category: "Writing",
    tags: ["Copywriting", "Storytelling", "SEO"],
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
    body: `<p>Good writing is about empathy and structure. Start with an idea, follow through with evidence, and make it easy for the reader to navigate with headings, lists, and short paragraphs.</p><p>When readers can scan an article quickly, they stay longer and absorb more value. In this article, we share five patterns that boost clarity and retention.</p>`,
  },
  {
    id: "post-3",
    title: "How to build a product roadmap with confidence",
    excerpt: "A step-by-step approach for planning releases, prioritizing features, and keeping stakeholders aligned.",
    date: "Jun 08, 2026",
    category: "Product",
    tags: ["Roadmap", "Strategy", "Prioritization"],
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    body: `<p>Roadmaps should communicate direction without overpromising. Focus on outcomes, not just features, and use customer research to inform when and why work is prioritized.</p><p>We also explore how to share progress effectively with teams and executives while maintaining flexibility.</p>`,
  },
  {
    id: "post-4",
    title: "Responsive layouts that adapt beautifully",
    excerpt: "Designing interfaces that feel native on desktop, tablet, and mobile with minimal overhead.",
    date: "May 30, 2026",
    category: "Development",
    tags: ["Responsive", "CSS", "UX"],
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
    body: `<p>Responsive design is a discipline of priorities. Start with content, then let layouts adapt using fluid spacing, breakpoints, and meaningful hierarchy.</p><p>We cover responsive cards, navigation, and grid strategies you can apply today.</p>`,
  },
  {
    id: "post-5",
    title: "Improving page speed without sacrificing style",
    excerpt: "A modern performance checklist for fast loading experiences on desktop and mobile.",
    date: "May 20, 2026",
    category: "Performance",
    tags: ["Speed", "Optimization", "Web"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    body: `<p>Pages should feel fast from first paint to interactive. Use smart image sizes, caching, and lightweight components so content is available quickly.</p><p>This article shares practical improvements you can deploy without losing your current visual polish.</p>`,
  },
  {
    id: "post-6",
    title: "Community-driven feature discovery",
    excerpt: "How to capture user feedback as a source of new ideas and stronger product decisions.",
    date: "May 12, 2026",
    category: "Community",
    tags: ["Feedback", "Product", "Growth"],
    image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80",
    body: `<p>Listening to your users is essential for building features people want. Learn how to validate ideas, collect feedback, and use community signals to shape your roadmap.</p><p>We also discuss moderation, prioritization, and transparent follow-up so contributors feel heard.</p>`,
  },
];

const categories = [
  { name: "Design", count: 8 },
  { name: "Writing", count: 5 },
  { name: "Development", count: 7 },
  { name: "Product", count: 6 },
  { name: "Performance", count: 4 },
  { name: "Community", count: 3 },
];

const state = {
  filter: "",
  visibleCount: 3,
  activePost: null,
  theme: localStorage.getItem("blogTheme") || "light",
  comments: {},
};

const postGrid = document.getElementById("postGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const matchCount = document.getElementById("matchCount");
const categoryList = document.getElementById("categoryList");
const postDetail = document.getElementById("postDetail");
const closeDetail = document.getElementById("closeDetail");
const detailTitle = document.getElementById("detailTitle");
const detailExcerpt = document.getElementById("detailExcerpt");
const detailImage = document.getElementById("detailImage");
const detailMeta = document.getElementById("detailMeta");
const detailBody = document.getElementById("detailBody");
const detailTags = document.getElementById("detailTags");
const relatedGrid = document.getElementById("relatedGrid");
const commentList = document.getElementById("commentList");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const darkToggle = document.getElementById("darkToggle");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.querySelector(".site-nav");
const shareTwitter = document.getElementById("shareTwitter");
const shareLinkedIn = document.getElementById("shareLinkedIn");
const shareEmail = document.getElementById("shareEmail");

function renderCategories() {
  categoryList.innerHTML = categories
    .map(
      (category) => `
        <div class="category-pill">
          <strong>${category.name}</strong>
          <span>${category.count} articles</span>
        </div>`
    )
    .join("");
}

function getFilteredPosts() {
  const query = state.filter.trim().toLowerCase();
  return posts.filter((post) => {
    if (!query) return true;
    return [post.title, post.excerpt, post.category, ...post.tags].some((value) =>
      value.toLowerCase().includes(query)
    );
  });
}

function renderPosts() {
  const filtered = getFilteredPosts();
  const visible = filtered.slice(0, state.visibleCount);
  postGrid.innerHTML = visible
    .map(
      (post) => `
      <article class="post-card" data-id="${post.id}">
        <img src="${post.image}" alt="${post.title}" />
        <div class="card-content">
          <span class="card-tag">${post.category}</span>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="card-actions">
            <span class="meta">${post.date}</span>
            <button class="button button-secondary open-detail" data-id="${post.id}">Read more</button>
          </div>
        </div>
      </article>`
    )
    .join("");

  matchCount.textContent = `${filtered.length} article${filtered.length === 1 ? "" : "s"} found`;
  loadMoreBtn.style.display = filtered.length > state.visibleCount ? "inline-flex" : "none";
  attachDetailTriggers();
}

function attachDetailTriggers() {
  document.querySelectorAll(".open-detail").forEach((button) => {
    button.addEventListener("click", (event) => {
      openDetail(event.currentTarget.dataset.id);
    });
  });
}

function openDetail(postId) {
  const post = posts.find((item) => item.id === postId);
  if (!post) return;
  state.activePost = post;
  detailTitle.textContent = post.title;
  detailExcerpt.textContent = post.excerpt;
  detailImage.src = post.image;
  detailMeta.textContent = `${post.date} • ${post.category}`;
  detailBody.innerHTML = post.body;
  detailTags.innerHTML = post.tags.map((tag) => `<span>${tag}</span>`).join("");
  relatedGrid.innerHTML = posts
    .filter((item) => item.id !== post.id && item.category === post.category)
    .slice(0, 2)
    .map(
      (item) => `
        <div class="related-card">
          <h4>${item.title}</h4>
          <p>${item.excerpt}</p>
          <button class="button button-secondary open-detail" data-id="${item.id}">View article</button>
        </div>`
    )
    .join("");

  commentList.innerHTML = (state.comments[post.id] || [])
    .map(
      (comment) => `
        <div class="comment-item">
          <strong>${comment.date}</strong>
          <p>${comment.text}</p>
        </div>`
    )
    .join("");

  updateShareLinks(post);
  postDetail.classList.add("active");
  postDetail.setAttribute("aria-hidden", "false");
}

function closeDetailView() {
  postDetail.classList.remove("active");
  postDetail.setAttribute("aria-hidden", "true");
  state.activePost = null;
}

function updateShareLinks(post) {
  const pageUrl = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`${post.title} — Read this article on BlogHub.`);
  shareTwitter.href = `https://twitter.com/intent/tweet?text=${text}&url=${pageUrl}`;
  shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
  shareEmail.href = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`${post.excerpt}\n\nRead more at ${window.location.href}`)}`;
}

function setTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark-mode");
    darkToggle.textContent = "Light";
  } else {
    document.documentElement.classList.remove("dark-mode");
    darkToggle.textContent = "Dark";
  }
  state.theme = theme;
  localStorage.setItem("blogTheme", theme);
}

function setupEvents() {
  searchInput.addEventListener("input", () => {
    state.filter = searchInput.value;
    state.visibleCount = 3;
    renderPosts();
  });

  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    state.filter = "";
    state.visibleCount = 3;
    renderPosts();
  });

  loadMoreBtn.addEventListener("click", () => {
    state.visibleCount += 3;
    renderPosts();
  });

  closeDetail.addEventListener("click", closeDetailView);
  postDetail.addEventListener("click", (event) => {
    if (event.target === postDetail) closeDetailView();
  });

  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!state.activePost) return;
    const text = commentInput.value.trim();
    if (!text) return;
    const now = new Date();
    const entry = {
      text,
      date: now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    };
    state.comments[state.activePost.id] = [...(state.comments[state.activePost.id] || []), entry];
    commentInput.value = "";
    openDetail(state.activePost.id);
  });

  darkToggle.addEventListener("click", () => {
    setTheme(state.theme === "dark" ? "light" : "dark");
  });

  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("expanded");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.activePost) closeDetailView();
  });
}

function init() {
  renderCategories();
  renderPosts();
  setupEvents();
  setTheme(state.theme);
}

init();
