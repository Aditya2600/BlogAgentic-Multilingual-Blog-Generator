const form = document.getElementById("blog-form");
const topicInput = document.getElementById("topic");
const languageSelect = document.getElementById("language");
const statusEl = document.getElementById("status");
const generateBtn = document.getElementById("generate");
const outputTitle = document.getElementById("output-title");
const outputContent = document.getElementById("output-content");
const copyBtn = document.getElementById("copy");
const resetBtn = document.getElementById("reset");
const chips = document.querySelectorAll(".chip");
const studioOpenBtn = document.getElementById("studio-open");
const studioEmbedToggle = document.getElementById("studio-embed-toggle");
const studioBaseInput = document.getElementById("studio-base");
const studioFrame = document.getElementById("studio-frame");
const studioPlaceholder = document.getElementById("studio-placeholder");

const setStatus = (message, state = "") => {
  statusEl.textContent = message;
  if (state) {
    statusEl.dataset.state = state;
  } else {
    delete statusEl.dataset.state;
  }
};

const setLoading = (isLoading) => {
  generateBtn.disabled = isLoading;
  if (isLoading) {
    generateBtn.dataset.loading = "true";
  } else {
    delete generateBtn.dataset.loading;
  }
};

const normalizeBlog = (payload) => {
  if (!payload) {
    return { title: "", content: "" };
  }

  const data = payload.data || payload;
  const blog = data.blog || data;

  let title = blog.title || data.title || "";
  let content = blog.content || data.content || "";

  if (content && typeof content === "object") {
    title = title || content.title || "";
    content = content.content || "";
  }

  if (title && typeof title === "object") {
    title = title.title || "";
  }

  return { title, content };
};

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const topic = chip.dataset.topic || "";
    topicInput.value = topic;
    topicInput.focus();
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const topic = topicInput.value.trim();
  const language = languageSelect.value.trim();

  if (!topic) {
    setStatus("Add a topic to generate your blog.", "error");
    topicInput.focus();
    return;
  }

  setStatus("Generating your blog. This can take a few seconds.");
  setLoading(true);

  try {
    const response = await fetch("/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, language }),
    });

    if (!response.ok) {
      throw new Error(`Server error (${response.status})`);
    }

    const result = await response.json();
    const { title, content } = normalizeBlog(result);

    outputTitle.textContent = title || "Blog title will appear here.";
    outputContent.textContent = content || "Blog content will appear here.";

    setStatus("Blog generated. You are ready to copy or refine.", "success");
  } catch (error) {
    console.error(error);
    setStatus("Something went wrong. Check the server logs and try again.", "error");
  } finally {
    setLoading(false);
  }
});

copyBtn.addEventListener("click", async () => {
  const title = outputTitle.textContent.trim();
  const content = outputContent.textContent.trim();
  const text = [title, content].filter(Boolean).join("\n\n");

  if (!text) {
    setStatus("Nothing to copy yet.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus("Copied to clipboard.", "success");
  } catch (error) {
    console.error(error);
    setStatus("Unable to copy. Please copy manually.", "error");
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  outputTitle.textContent = "Your title will appear here.";
  outputContent.textContent = "Your content will appear here. Markdown formatting will be preserved.";
  setStatus("");
});

const buildStudioUrl = () => {
  const baseUrl = studioBaseInput ? studioBaseInput.value.trim() : "";
  if (!baseUrl) {
    if (studioPlaceholder) {
      studioPlaceholder.textContent = "Add a Studio base URL to continue.";
    }
    return "";
  }
  return `https://smith.langchain.com/studio/?baseUrl=${encodeURIComponent(baseUrl)}`;
};

const setStudioEmbed = (isActive) => {
  if (!studioFrame || !studioPlaceholder) {
    return;
  }

  if (!isActive) {
    studioFrame.src = "";
    studioFrame.classList.remove("is-visible");
    studioPlaceholder.classList.remove("is-hidden");
    return;
  }

  const studioUrl = buildStudioUrl();
  if (!studioUrl) {
    return;
  }

  studioFrame.src = studioUrl;
  studioFrame.classList.add("is-visible");
  studioPlaceholder.classList.add("is-hidden");
};

if (studioOpenBtn) {
  studioOpenBtn.addEventListener("click", () => {
    const studioUrl = buildStudioUrl();
    if (studioUrl) {
      window.open(studioUrl, "_blank", "noopener,noreferrer");
    }
  });
}

if (studioEmbedToggle) {
  let isEmbedded = false;
  studioEmbedToggle.addEventListener("click", () => {
    isEmbedded = !isEmbedded;
    setStudioEmbed(isEmbedded);
    studioEmbedToggle.textContent = isEmbedded ? "Hide Embed" : "Embed Studio";
  });
}
