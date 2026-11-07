// Café Raíz: interacciones de la página.

// Menú del celular: panel debajo del encabezado.
(function () {
  var boton = document.querySelector(".menu-btn");
  var menu = document.getElementById("menu");
  if (!boton || !menu) return;

  function abrir(abierto) {
    menu.classList.toggle("open", abierto);
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  }

  boton.addEventListener("click", function () {
    abrir(!menu.classList.contains("open"));
  });

  // Se cierra al elegir un enlace.
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) abrir(false);
  });

  // Se cierra con Esc y devuelve el foco al botón.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      abrir(false);
      boton.focus();
    }
  });

  // Se cierra al tocar afuera.
  document.addEventListener("click", function (e) {
    if (menu.classList.contains("open") && !e.target.closest(".site-header")) abrir(false);
  });

  // Si la pantalla pasa a escritorio, vuelve al estado normal.
  window.matchMedia("(min-width: 901px)").addEventListener("change", function (e) {
    if (e.matches) abrir(false);
  });
})();

// Carrusel de cafés: flechas y puntos. Sin JavaScript se desliza igual, con scroll.
(function () {
  var pista = document.getElementById("cafes-slides");
  if (!pista) return;
  var slides = pista.querySelectorAll(".slide");
  if (slides.length < 2) return;

  var reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var suave = reducir ? "auto" : "smooth";

  pista.setAttribute("tabindex", "0");
  pista.setAttribute("aria-label", "Cafés: deslizá para ver más");

  var ctrl = document.createElement("div");
  ctrl.className = "car-ctrl";
  var prev = crearBoton("car-btn", "Cafés anteriores", '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>');
  var next = crearBoton("car-btn", "Cafés siguientes", '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>');
  var puntos = document.createElement("div");
  puntos.className = "car-dots";
  var contador = document.createElement("span");
  contador.className = "car-count";
  contador.setAttribute("aria-hidden", "true");
  ctrl.appendChild(prev);
  ctrl.appendChild(puntos);
  ctrl.appendChild(contador);
  ctrl.appendChild(next);
  // Los controles van arriba, junto al título, para que se vean sin bajar.
  var cabecera = document.querySelector(".cafes-head") || pista.parentNode;
  cabecera.appendChild(ctrl);

  var visibles = 1;
  var paso = 0;
  var paginas = 1;

  function crearBoton(clase, etiqueta, html) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = clase;
    b.setAttribute("aria-label", etiqueta);
    if (html) b.innerHTML = html;
    return b;
  }

  function medir() {
    var gap = parseFloat(getComputedStyle(pista).columnGap) || 0;
    paso = slides[0].offsetWidth + gap;
    visibles = Math.max(1, Math.floor((pista.clientWidth + gap) / paso));
    paginas = Math.ceil(slides.length / visibles);
  }

  function armarPuntos() {
    puntos.innerHTML = "";
    for (var i = 0; i < paginas; i++) {
      var d = crearBoton("car-dot", "Ir al grupo " + (i + 1) + " de " + paginas);
      d.dataset.i = i;
      puntos.appendChild(d);
    }
    puntos.hidden = paginas < 2;
  }

  function actualizar() {
    var max = pista.scrollWidth - pista.clientWidth;
    var alInicio = pista.scrollLeft <= 2;
    var alFinal = pista.scrollLeft >= max - 2;
    prev.disabled = alInicio;
    next.disabled = alFinal;
    var indice = Math.round(pista.scrollLeft / paso);
    // En celular se muestra "1 / 7" en lugar de los puntos.
    contador.textContent = (alFinal ? slides.length : Math.min(slides.length, indice + 1)) + " / " + slides.length;
    var activo = alFinal ? paginas - 1 : Math.min(paginas - 1, Math.floor(indice / visibles));
    Array.prototype.forEach.call(puntos.children, function (d, i) {
      if (i === activo) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
  }

  function ir(pagina) {
    pista.scrollTo({ left: pagina * visibles * paso, behavior: suave });
  }

  prev.addEventListener("click", function () {
    pista.scrollBy({ left: -visibles * paso, behavior: suave });
  });
  next.addEventListener("click", function () {
    pista.scrollBy({ left: visibles * paso, behavior: suave });
  });
  puntos.addEventListener("click", function (e) {
    var d = e.target.closest(".car-dot");
    if (d) ir(Number(d.dataset.i));
  });

  var pendiente = false;
  pista.addEventListener("scroll", function () {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () { pendiente = false; actualizar(); });
  }, { passive: true });

  var temporizador;
  window.addEventListener("resize", function () {
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { medir(); armarPuntos(); actualizar(); }, 150);
  });

  medir();
  armarPuntos();
  actualizar();
})();
