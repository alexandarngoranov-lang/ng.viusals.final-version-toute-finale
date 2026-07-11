document.getElementById("year").textContent = new Date().getFullYear();

const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", (e) => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

const revealItems = document.querySelectorAll(
  ".services-grid article, .project, .why-panel, .process-list article, .contact-panel, .reviews-shell"
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate(
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        {
          duration: 700,
          easing: "cubic-bezier(.2,.7,.2,1)",
          fill: "forwards"
        }
      );
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => {
  item.style.opacity = "0";
  observer.observe(item);
});

/* Review carousel */
const track = document.getElementById("reviewsTrack");
const cards = Array.from(track.children);
const prev = document.querySelector(".review-arrow.prev");
const next = document.querySelector(".review-arrow.next");
let reviewIndex = 0;

function visibleReviews() {
  if (window.innerWidth <= 590) return 1;
  if (window.innerWidth <= 920) return 2;
  return 3;
}

function updateReviews() {
  const visible = visibleReviews();
  const maxIndex = Math.max(0, cards.length - visible);
  reviewIndex = Math.min(reviewIndex, maxIndex);
  const gap = 18;
  const cardWidth = (track.parentElement.clientWidth - gap * (visible - 1)) / visible;
  track.style.transform = `translateX(-${reviewIndex * (cardWidth + gap)}px)`;
}

prev.addEventListener("click", () => {
  reviewIndex = Math.max(0, reviewIndex - 1);
  updateReviews();
});

next.addEventListener("click", () => {
  const maxIndex = Math.max(0, cards.length - visibleReviews());
  reviewIndex = Math.min(maxIndex, reviewIndex + 1);
  updateReviews();
});

window.addEventListener("resize", updateReviews);
updateReviews();

/*
  Zero-cost assistant:
  This assistant works entirely inside the browser, so it is safe for GitHub Pages.
  A real ChatGPT/OpenAI assistant requires a backend and an API key. Never put an API
  key directly in public JavaScript.
*/
const assistantToggle = document.getElementById("assistantToggle");
const assistantPanel = document.getElementById("assistantPanel");
const assistantClose = document.getElementById("assistantClose");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const assistantMessages = document.getElementById("assistantMessages");

assistantToggle.addEventListener("click", () => {
  assistantPanel.classList.toggle("open");
  if (assistantPanel.classList.contains("open")) assistantInput.focus();
});

assistantClose.addEventListener("click", () => assistantPanel.classList.remove("open"));

document.querySelectorAll(".quick-questions button").forEach((button) => {
  button.addEventListener("click", () => sendQuestion(button.dataset.question));
});

assistantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = assistantInput.value.trim();
  if (!value) return;
  sendQuestion(value);
  assistantInput.value = "";
});

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = type === "user" ? "user-message" : "bot-message";
  message.textContent = text;
  assistantMessages.appendChild(message);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function getAssistantReply(question) {
  const q = question.toLowerCase();

  if (/(price|cost|how much|tarif|prix)/.test(q)) {
    return "Pricing depends on the number of pages and features. Send a short description of your project to receive a clear quote with no obligation.";
  }
  if (/(delivery|how long|time|delay|days|délai|combien de temps)/.test(q)) {
    return "Most standard websites are delivered in 1 to 2 days. Larger or more complex projects may take longer.";
  }
  if (/(service|offer|website|redesign|landing|seo|mobile)/.test(q)) {
    return "NG Visuals creates custom business websites, redesigns, landing pages, portfolios and mobile-optimized, SEO-ready websites.";
  }
  if (/(revision|change|modify|modification)/.test(q)) {
    return "Yes. Revisions are included so the design, content and structure can be adjusted to your needs.";
  }
  if (/(contact|email|message|whatsapp|book|start)/.test(q)) {
    return "You can email alexandar.ngoranov@gmail.com or contact NG Visuals through the Message and WhatsApp buttons on this page.";
  }
  if (/(free|proposal|concept)/.test(q)) {
    return "You can request a free initial proposal with no obligation. Describe your business, preferred style and the main goal of the website.";
  }
  if (/(who|about|ng visuals|company)/.test(q)) {
    return "NG Visuals is an independent web design studio in Belgium focused on premium, modern websites for small businesses and independent professionals.";
  }

  return "I can help with pricing, delivery time, services, revisions, the free proposal and contact details. For a specific project, email alexandar.ngoranov@gmail.com.";
}

function sendQuestion(question) {
  addMessage(question, "user");
  window.setTimeout(() => addMessage(getAssistantReply(question), "bot"), 280);
}
