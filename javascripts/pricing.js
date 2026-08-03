function updateQuantpylibOffer() {
  const offer = document.getElementById("quantpylib-offer");
  const countdown = document.getElementById("quantpylib-offer-countdown");
  const buyLink = document.getElementById("quantpylib-buy");
  const originalPrice = document.getElementById("quantpylib-original-price");
  const offerPrice = document.getElementById("quantpylib-offer-price");

  if (!offer || !countdown || !buyLink || !originalPrice || !offerPrice) {
    return;
  }

  const deadline = new Date(offer.dataset.deadline).getTime();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.max(0, Math.ceil((deadline - Date.now()) / millisecondsPerDay));

  if (daysLeft === 0) {
    offer.hidden = true;
    buyLink.href = buyLink.dataset.baseHref;
    originalPrice.style.color = "var(--md-typeset-color)";
    originalPrice.style.fontSize = "28px";
    originalPrice.style.textDecoration = "none";
    offerPrice.hidden = true;
    return;
  }

  offer.hidden = false;
  countdown.textContent = `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`;
}

updateQuantpylibOffer();
