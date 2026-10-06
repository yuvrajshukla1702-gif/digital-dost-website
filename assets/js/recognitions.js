(function () {
  var box = document.createElement("div");
  box.className = "dd-cert-lightbox";
  box.hidden = true;
  box.innerHTML = '<button type="button" class="dd-cert-close" aria-label="Close">&times;</button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(box);

  var photo = box.querySelector("img");
  var caption = box.querySelector("figcaption");

  function openCert(src, alt, label) {
    photo.src = src;
    photo.alt = alt || "";
    caption.textContent = label || "";
    box.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeCert() {
    box.hidden = true;
    photo.removeAttribute("src");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest(".dd-certs a");
    if (link) {
      event.preventDefault();
      var title = link.querySelector("strong");
      var number = link.querySelector("em");
      var image = link.querySelector("img");
      var label = "";
      if (title) label = title.textContent;
      if (number) label = label ? label + " · " + number.textContent : number.textContent;
      openCert(link.getAttribute("href"), image ? image.getAttribute("alt") : "", label);
      return;
    }
    if (event.target === box || event.target.closest(".dd-cert-close")) closeCert();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !box.hidden) closeCert();
  });
})();
