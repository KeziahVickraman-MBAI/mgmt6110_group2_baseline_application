// View toggle behavior for #panel-publish
document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("panel-publish");
  if (!panel) return;

  const btnConsumer = panel.querySelector('.toggle-btn[data-view="consumer"]');
  const btnIndustry = panel.querySelector('.toggle-btn[data-view="industry"]');
  const viewConsumer = document.getElementById("publish-view-consumer");
  const viewIndustry = document.getElementById("publish-view-industry");

  if (!btnConsumer || !btnIndustry || !viewConsumer || !viewIndustry) return;

  function setView(targetView) {
    const isConsumer = targetView === "consumer";

    // Update aria-pressed
    btnConsumer.setAttribute("aria-pressed", isConsumer ? "true" : "false");
    btnIndustry.setAttribute("aria-pressed", isConsumer ? "false" : "true");

    // Instant swap without animation and without losing scroll position
    if (isConsumer) {
      viewConsumer.style.display = "block";
      viewIndustry.style.display = "none";
    } else {
      viewConsumer.style.display = "none";
      viewIndustry.style.display = "block";
    }
  }

  btnConsumer.addEventListener("click", () => setView("consumer"));
  btnIndustry.addEventListener("click", () => setView("industry"));

  // Keyboard navigation support
  [btnConsumer, btnIndustry].forEach(btn => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const nextTarget = btn === btnConsumer ? "industry" : "consumer";
        setView(nextTarget);
        if (nextTarget === "industry") btnIndustry.focus();
        else btnConsumer.focus();
      }
    });
  });

  // Default to consumer view
  setView("consumer");
});
