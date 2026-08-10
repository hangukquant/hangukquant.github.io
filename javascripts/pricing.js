function updatePricingOffer(product) {
  const offer = document.getElementById(`${product}-offer`);
  const countdown = document.getElementById(`${product}-offer-countdown`);
  const buyLink = document.getElementById(`${product}-buy`);
  const originalPrice = document.getElementById(`${product}-original-price`);
  const offerPrice = document.getElementById(`${product}-offer-price`);

  if (!offer || !countdown || !buyLink || !originalPrice || !offerPrice) {
    return;
  }

  const deadline = new Date(offer.dataset.deadline).getTime();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.max(0, Math.ceil((deadline - Date.now()) / millisecondsPerDay));

  if (daysLeft === 0) {
    offer.hidden = false;
    offer.style.visibility = "hidden";
    offer.setAttribute("aria-hidden", "true");
    buyLink.href = buyLink.dataset.baseHref;
    originalPrice.style.color = "var(--md-typeset-color)";
    originalPrice.style.fontSize = "28px";
    originalPrice.style.textDecoration = "none";
    offerPrice.hidden = true;
    return;
  }

  offer.hidden = false;
  offer.style.visibility = "visible";
  offer.removeAttribute("aria-hidden");
  originalPrice.style.color = "#888";
  originalPrice.style.fontSize = "20px";
  originalPrice.style.textDecoration = "line-through";
  offerPrice.hidden = false;
  countdown.textContent = `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`;
}

function updatePricingOffers() {
  updatePricingOffer("quantpylib");
  updatePricingOffer("quantterminal");
}

updatePricingOffers();
