function configureTutorialNavigation() {
  if (!/\/tutorials(?:\/|$)/.test(window.location.pathname)) {
    return;
  }

  const toggle = document.querySelector(".md-sidebar--primary #__toc");
  const item = toggle?.closest(".md-nav__item--active");
  const label = item?.querySelector(':scope > label[for="__toc"]');
  const navigation = item?.querySelector(":scope > .md-nav--secondary");

  if (!toggle || !item || !label || !navigation) {
    return;
  }

  item.classList.add("tutorial-toc-collapsible");
  toggle.checked = false;
  label.tabIndex = 0;
  label.setAttribute("role", "button");

  const syncExpandedState = () => {
    const expanded = toggle.checked;
    label.setAttribute("aria-expanded", String(expanded));
    navigation.setAttribute("aria-hidden", String(!expanded));
  };

  if (!item.dataset.tutorialTocReady) {
    toggle.addEventListener("change", syncExpandedState);
    item.dataset.tutorialTocReady = "true";
  }

  syncExpandedState();
}

if (typeof document$ !== "undefined") {
  document$.subscribe(configureTutorialNavigation);
} else if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", configureTutorialNavigation);
} else {
  configureTutorialNavigation();
}
