// cards-binder.js
// Populates concept and exercise cards from graphs-data.json.

async function bindGraphCards() {
  const cards = document.querySelectorAll(
    ".graph-card[data-graph-id]"
  );

  if (!cards.length) {
    return;
  }

  const DATA_URL =
    "/intermediate-microeconomics-project/assets/graphs-data.json?v=16";

  let registry;

  try {
    const response = await fetch(DATA_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(
        "cards-binder.js: Failed to load graphs-data.json:",
        response.status,
        response.statusText
      );
      return;
    }

    registry = await response.json();
  } catch (error) {
    console.warn(
      "cards-binder.js: Error loading graphs-data.json:",
      error
    );
    return;
  }

  cards.forEach((card) => {
    const id = card.dataset.graphId;
    const entry = registry[id];

    if (!entry) {
      console.warn(
        "cards-binder.js: No entry for graph-id:",
        id
      );
      return;
    }

    const title =
      entry.display_title ||
      id.replace(/-/g, " ");

    // Title
    const titleElement = card.querySelector(
      '[data-fill="card-title"]'
    );

    if (titleElement) {
      titleElement.textContent = title;
    }

    // Brief introduction
    const introElement = card.querySelector(
      '[data-fill="card-intro"]'
    );

    if (introElement) {
      introElement.textContent =
        entry.card_intro || "";
    }

    // Prompt
    const promptRow = card.querySelector(
      ".graph-prompt"
    );

    const promptLabel = card.querySelector(
      '[data-fill="prompt-label"]'
    );

    const promptElement = card.querySelector(
      '[data-fill="card-prompt"]'
    );

    if (entry.card_prompt) {
      if (promptLabel) {
        promptLabel.textContent =
          entry.page_type === "exercise"
            ? "Task:"
            : "Try:";
      }

      if (promptElement) {
        promptElement.textContent =
          entry.card_prompt;
      }
    } else if (promptRow) {
      promptRow.hidden = true;
    }

    // Button
    const linkElement = card.querySelector(
      '[data-fill="card-link"]'
    );

    if (linkElement) {
      linkElement.textContent =
        entry.page_type === "exercise"
          ? "Open exercise"
          : "Open graph";
    }

    // Image alternative text
    const image = card.querySelector(
      ".graph-thumb"
    );

    if (image) {
      image.alt = title;
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => void bindGraphCards()
  );
} else {
  void bindGraphCards();
}

const graphId = card.dataset.graphId;

if (!graphId) {
  console.warn("Graph card is missing data-graph-id:", card);
  return;
}

// Generate thumbnail path
const image = card.querySelector(".graph-thumb img");

if (image) {
  image.src = `../assets/pictures/${graphId}.png`;
}

// Generate graph-page link
const link = card.querySelector('[data-fill="card-link"]');

if (link) {
  link.href = `${graphId}.html`;
}