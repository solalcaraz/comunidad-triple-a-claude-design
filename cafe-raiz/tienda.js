// Café Raíz: tienda. Grilla con filtros, ventana de detalle, pedido y envío por WhatsApp.

(function () {
  "use strict";

  // ---- Datos ----
  var WHATSAPP = "5490000000000";   // Número de ejemplo, igual que en la landing.
  var GRATIS_DESDE = 45000;         // Envío gratis a domicilio desde este total.
  var CLAVE = "cafe-raiz-pedido";

  // p = [precio 250 g, precio 500 g]. Los tueste "medio claro" y "medio oscuro" entran en dos filtros.
  var CAFES = [
    { id: "aniba", name: "Don Aníbal", origen: "Misiones, Argentina", pais: "Argentina", tueste: "medio claro", lvl: 2, notas: "Miel y almendra", p: [16500, 30500], img: "packaging-don-anibal.jpg" },
    { id: "elvira", name: "Doña Elvira", origen: "Caranavi, Yungas, Bolivia", pais: "Bolivia", tueste: "medio", lvl: 3, notas: "Durazno y panela", p: [15500, 28500], img: "packaging-dona-elvira.jpg" },
    { id: "silveira", name: "Familia Silveira", origen: "Sul de Minas, Brasil", pais: "Brasil", tueste: "medio oscuro", lvl: 4, notas: "Chocolate y avellana", p: [13900, 25500], img: "packaging-familia-silveira.jpg" },
    { id: "rosa", name: "Doña Rosa", origen: "Salta, Argentina", pais: "Argentina", tueste: "medio", lvl: 3, notas: "Mandarina y caramelo", p: [16900, 31000], img: "packaging-dona-rosa.jpg" },
    { id: "julian", name: "Don Julián", origen: "Cajamarca, Perú", pais: "Perú", tueste: "medio oscuro", lvl: 4, notas: "Cacao y nuez", p: [15800, 29000], img: "packaging-don-julian.jpg" },
    { id: "mejia", name: "Familia Mejía", origen: "Huila, Colombia", pais: "Colombia", tueste: "medio", lvl: 3, notas: "Caramelo y naranja", p: [15200, 28000], img: "packaging-familia-mejia.jpg" },
    { id: "blend", name: "Blend de la casa", origen: "Mezcla de orígenes", pais: "Mezclas", tueste: "medio", lvl: 3, notas: "Chocolate, dulce de leche y frutos secos", p: [12900, 23500], img: "packaging.jpg" },
    { id: "ceferino", name: "Don Ceferino", origen: "Jujuy, Argentina", pais: "Argentina", tueste: "medio claro", lvl: 2, notas: "Flores y miel", p: [17500, 32000], img: "packaging-don-ceferino.jpg" },
    { id: "beatriz", name: "Doña Beatriz", origen: "Nariño, Colombia", pais: "Colombia", tueste: "medio", lvl: 3, notas: "Panela y frutos rojos", p: [15900, 29500], img: "packaging-dona-beatriz.jpg" },
    { id: "quispe", name: "Familia Quispe", origen: "Chanchamayo, Perú", pais: "Perú", tueste: "medio oscuro", lvl: 4, notas: "Cacao y naranja", p: [14500, 26500], img: "packaging-familia-quispe.jpg" },
    { id: "descafe", name: "Descafeinado de la casa", origen: "Mezcla de orígenes", pais: "Mezclas", tueste: "medio", lvl: 3, notas: "Cacao y vainilla", p: [16200, 29800], img: "packaging-descafeinado-de-la-casa.jpg" },
    { id: "espresso", name: "Blend espresso", origen: "Mezcla de orígenes", pais: "Mezclas", tueste: "oscuro", lvl: 5, notas: "Chocolate amargo y especias", p: [13500, 24500], img: "packaging-blend-espresso.jpg" }
  ];
  var CATEGORIAS = { "medio claro": ["Claro", "Medio"], "medio": ["Medio"], "medio oscuro": ["Medio", "Oscuro"], "oscuro": ["Oscuro"] };

  var PACKS = [
    { id: "degustacion", name: "Pack Degustación", rotulo: "Para probar", lema: "Probá sin elegir.", desc: "3 bolsas de 100 g: Don Aníbal, Doña Elvira y Familia Silveira.", precio: 19900, aparte: 0 },
    { id: "desayuno", name: "Pack Desayuno", rotulo: "Para el desayuno", lema: "Cafés suaves, para tomar con leche.", desc: "Descafeinado de la casa y Don Aníbal, 250 g cada uno.", precio: 27900, aparte: 32700 },
    { id: "sobremesa", name: "Pack Sobremesa", rotulo: "Para la sobremesa", lema: "Cafés oscuros, para después de comer.", desc: "Don Julián y Familia Silveira, 250 g cada uno.", precio: 27900, aparte: 29700 },
    { id: "regalo", name: "Pack Regalo", rotulo: "Para regalar", lema: "Listo para dar.", desc: "Don Aníbal y Doña Elvira, 250 g cada uno, en caja kraft con tarjeta.", precio: 31900, aparte: "$32.000 más la caja" }
  ];

  // ---- Utilidades ----
  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $$(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }
  function fmt(n) { return "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function cafe(id) { return CAFES.filter(function (c) { return c.id === id; })[0]; }
  function precioCafe(c, size) { return size === "500" ? c.p[1] : c.p[0]; }
  function etiquetaMol(m) { return m === "molido" ? "Molido" : "En grano"; }
  function capitalizar(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function puntos(n) {
    var h = "";
    for (var i = 1; i <= 5; i++) h += '<i class="' + (i <= n ? "on" : "") + '"></i>';
    return h;
  }

  // ---- Estado ----
  var filtros = { tueste: [], origen: [] };
  var elegidos = {};          // tamaño y molienda elegidos en cada tarjeta
  var pedido = cargar();      // [{ id, name, det, price, q }]
  var cafeAbierto = null;     // café que muestra la ventana de detalle

  function cargar() {
    try {
      var r = JSON.parse(localStorage.getItem(CLAVE));
      if (!Array.isArray(r)) return [];
      return r.filter(function (it) {
        return it && typeof it.id === "string" && typeof it.name === "string" && typeof it.det === "string" &&
          isFinite(it.price) && it.price > 0 && Math.floor(it.q) === it.q && it.q > 0 && it.q < 100;
      });
    } catch (e) { return []; }
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(pedido)); } catch (e) { /* sin almacenamiento: el pedido vive en la página */ }
  }

  // ---- Menú del celular ----
  (function () {
    var boton = $(".menu-btn");
    var menu = $("#menu");
    if (!boton || !menu) return;
    function abrir(abierto) {
      menu.classList.toggle("open", abierto);
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
      boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    }
    boton.addEventListener("click", function () { abrir(!menu.classList.contains("open")); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) abrir(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) { abrir(false); boton.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("open") && !e.target.closest(".site-header")) abrir(false);
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (e) { if (e.matches) abrir(false); });
  })();

  // ---- Grilla de cafés ----
  var grilla = $("#grid");

  function tarjeta(c) {
    var s = elegidos[c.id] || { size: "250", mol: "grano" };
    return '<li><article class="card" data-id="' + c.id + '" aria-label="' + esc(c.name) + '">' +
      '<div class="ph"><img src="img/' + c.img + '" alt="Bolsa de ' + esc(c.name) + '" loading="lazy"></div>' +
      '<div class="body">' +
      '<div class="eb">' + esc(c.origen) + '</div>' +
      '<h3 class="h3">' + esc(c.name) + '</h3>' +
      '<div class="line"><span>Tueste ' + c.tueste + '</span><span class="dots" role="img" aria-label="Tueste ' + c.lvl + ' de 5">' + puntos(c.lvl) + '</span></div>' +
      '<p class="notas"><span>Notas: </span>' + esc(c.notas) + '</p>' +
      '<div class="compra">' +
      '<div class="selects">' +
      '<div class="campo"><label for="t-' + c.id + '">Tamaño</label><div class="sel"><select id="t-' + c.id + '" data-campo="size">' +
      '<option value="250"' + (s.size === "250" ? " selected" : "") + '>250 g</option><option value="500"' + (s.size === "500" ? " selected" : "") + '>500 g</option></select>' +
      '<svg width="16" height="16" aria-hidden="true"><use href="#i-chev"/></svg></div></div>' +
      '<div class="campo"><label for="m-' + c.id + '">Molienda</label><div class="sel"><select id="m-' + c.id + '" data-campo="mol">' +
      '<option value="grano"' + (s.mol === "grano" ? " selected" : "") + '>En grano</option><option value="molido"' + (s.mol === "molido" ? " selected" : "") + '>Molido</option></select>' +
      '<svg width="16" height="16" aria-hidden="true"><use href="#i-chev"/></svg></div></div>' +
      '</div>' +
      '<div class="fila-precio"><span class="precio-g" data-precio aria-live="polite">' + fmt(precioCafe(c, s.size)) + '</span>' +
      '<button class="link-btn" type="button" data-detalle>Ver detalle<span class="sr-only"> de ' + esc(c.name) + '</span></button></div>' +
      '<button class="gbtn block" type="button" data-agregar><span class="gin">Agregar al pedido</span></button>' +
      '</div></div></article></li>';
  }

  function dibujarGrilla() {
    var lista = CAFES.filter(function (c) {
      var okT = !filtros.tueste.length || CATEGORIAS[c.tueste].some(function (t) { return filtros.tueste.indexOf(t) > -1; });
      var okO = !filtros.origen.length || filtros.origen.indexOf(c.pais) > -1;
      return okT && okO;
    });
    grilla.innerHTML = lista.map(tarjeta).join("");
    $("#conteo").textContent = lista.length === 1 ? "1 café" : lista.length + " cafés";
    $("#vacio").hidden = lista.length > 0;
    $("#limpiar").hidden = !(filtros.tueste.length || filtros.origen.length);
  }

  // Flechas para deslizar los filtros cuando no entran todos (celular).
  var FLECHA = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  $$(".chips").forEach(function (chips) {
    var wrap = document.createElement("div");
    wrap.className = "chips-wrap";
    chips.parentNode.insertBefore(wrap, chips);
    wrap.appendChild(chips);
    var ant = document.createElement("button"), sig = document.createElement("button");
    ant.type = sig.type = "button";
    ant.className = "chips-flecha chips-ant"; sig.className = "chips-flecha chips-sig";
    ant.setAttribute("aria-label", "Ver filtros anteriores"); sig.setAttribute("aria-label", "Ver más filtros");
    ant.innerHTML = FLECHA; sig.innerHTML = FLECHA;
    wrap.appendChild(ant); wrap.appendChild(sig);
    function actualizar() {
      var max = chips.scrollWidth - chips.clientWidth;
      ant.hidden = chips.scrollLeft < 4;
      sig.hidden = max < 4 || chips.scrollLeft > max - 4;
    }
    function mover(dir) {
      var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      chips.scrollBy({ left: dir * chips.clientWidth * 0.7, behavior: reducido ? "auto" : "smooth" });
    }
    ant.addEventListener("click", function () { mover(-1); });
    sig.addEventListener("click", function () { mover(1); });
    chips.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    actualizar();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(actualizar);
  });

  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var lista = filtros[chip.dataset.grupo];
      var i = lista.indexOf(chip.dataset.val);
      if (i > -1) lista.splice(i, 1); else lista.push(chip.dataset.val);
      chip.setAttribute("aria-pressed", i > -1 ? "false" : "true");
      dibujarGrilla();
    });
  });

  function limpiarFiltros() {
    filtros.tueste = [];
    filtros.origen = [];
    $$(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
    dibujarGrilla();
  }
  $("#limpiar").addEventListener("click", function () { limpiarFiltros(); $(".chip").focus(); });
  $("[data-limpiar]").addEventListener("click", function () { limpiarFiltros(); $(".chip").focus(); });

  function marcarAgregado(boton, texto) {
    var original = boton.dataset.original || boton.querySelector(".gin").textContent;
    boton.dataset.original = original;
    boton.classList.add("ok");
    boton.querySelector(".gin").innerHTML = '<svg width="18" height="18" aria-hidden="true"><use href="#i-tick"/></svg>' + esc(texto);
    boton.setAttribute("aria-live", "polite");
    clearTimeout(boton._t);
    boton._t = setTimeout(function () {
      boton.classList.remove("ok");
      boton.querySelector(".gin").textContent = original;
    }, 2000);
  }

  grilla.addEventListener("change", function (e) {
    var sel = e.target.closest("select");
    var card = e.target.closest(".card");
    if (!sel || !card) return;
    var id = card.dataset.id;
    var s = elegidos[id] = elegidos[id] || { size: "250", mol: "grano" };
    s[sel.dataset.campo] = sel.value;
    $("[data-precio]", card).textContent = fmt(precioCafe(cafe(id), s.size));
  });

  grilla.addEventListener("click", function (e) {
    var card = e.target.closest(".card");
    if (!card) return;
    var c = cafe(card.dataset.id);
    var s = elegidos[c.id] || { size: "250", mol: "grano" };
    if (e.target.closest("[data-agregar]")) {
      agregar(c.id + "-" + s.size + "-" + s.mol, c.name, s.size + " g · " + etiquetaMol(s.mol), precioCafe(c, s.size), 1);
      marcarAgregado(e.target.closest("[data-agregar]"), "Agregado al pedido");
    } else if (e.target.closest("[data-detalle]")) {
      abrirDetalle(c, s);
    }
  });

  // ---- Packs: uno grande a la izquierda y un carrusel con el resto ----
  var wrapPacks = $("#packs-wrap");
  var cantPacks = {};

  function tarjetaPack(p, grande) {
    cantPacks[p.id] = 1;
    var aparte = p.aparte ? '<span class="pack-aparte">Por separado, ' + (typeof p.aparte === "string" ? p.aparte : fmt(p.aparte)) + '</span>' : "";
    var cantidad = '<div class="cantidad" role="group" aria-label="Cantidad de ' + esc(p.name) + '">' +
      '<button class="qb" type="button" data-menos aria-label="Restar uno">−</button><output aria-live="polite">1</output>' +
      '<button class="qb" type="button" data-mas aria-label="Sumar uno">+</button></div>';
    var boton = '<button class="gbtn block" type="button" data-agregar-pack><span class="gin">Agregar al pedido</span></button>';
    return '<article class="card' + (grande ? " grande" : "") + '" data-pack="' + p.id + '" aria-label="' + esc(p.name) + '">' +
      '<div class="ph"><img src="img/packaging-pack-' + p.id + '.jpg" alt="' + esc(p.name) + ': bolsas de café Café Raíz" ' + (grande ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"') + '></div>' +
      '<div class="body">' +
      '<div class="eb">' + esc(p.rotulo) + '</div>' +
      '<h3 class="h3">' + esc(p.name) + '</h3>' +
      '<p class="pack-lema">' + esc(p.lema) + '</p>' +
      '<p class="pack-desc">' + esc(p.desc) + '</p>' +
      '<p class="pack-precio"><span class="precio-g">' + fmt(p.precio) + '</span>' + aparte + '</p>' +
      '<div class="compra">' +
      '<fieldset class="seg"><legend>Molienda (para todo el pack)</legend><div class="seg-fila">' +
      '<label><input type="radio" name="mol-' + p.id + '" value="grano" checked>En grano</label>' +
      '<label><input type="radio" name="mol-' + p.id + '" value="molido">Molido</label></div></fieldset>' +
      (grande
        ? '<div class="pack-fila">' + cantidad + boton + '</div>'
        : '<div class="fila-precio"><span class="lab">Cantidad</span>' + cantidad + '</div>' + boton) +
      '</div></div></article>';
  }

  wrapPacks.innerHTML =
    '<div class="pack-feat">' + tarjetaPack(PACKS[0], true) + '</div>' +
    '<div class="pack-car" role="region" aria-roledescription="carrusel" aria-label="Más packs">' +
    '<div class="pack-area">' +
    '<ul class="pack-slides" id="pack-slides">' + PACKS.slice(1).map(function (p) { return '<li>' + tarjetaPack(p, false) + '</li>'; }).join("") + '</ul>' +
    '<button class="car-btn pack-prev" type="button" aria-label="Pack anterior"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>' +
    '<button class="car-btn pack-next" type="button" aria-label="Pack siguiente"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>' +
    '</div><div class="car-dots" id="pack-dots"></div></div>';

  wrapPacks.addEventListener("click", function (e) {
    var card = e.target.closest(".card");
    if (!card) return;
    var id = card.dataset.pack;
    if (e.target.closest("[data-mas]")) cantPacks[id] = Math.min(99, cantPacks[id] + 1);
    else if (e.target.closest("[data-menos]")) cantPacks[id] = Math.max(1, cantPacks[id] - 1);
    else if (e.target.closest("[data-agregar-pack]")) {
      var p = PACKS.filter(function (x) { return x.id === id; })[0];
      var mol = $("input:checked", card).value;
      agregar("pack-" + id + "-" + mol, p.name, etiquetaMol(mol), p.precio, cantPacks[id]);
      marcarAgregado(e.target.closest("[data-agregar-pack]"), "Agregado al pedido");
      return;
    } else return;
    $("output", card).textContent = cantPacks[id];
  });

  // Carrusel de packs: flechas y puntos.
  (function () {
    var pista = $("#pack-slides"), puntos = $("#pack-dots");
    var prev = $(".pack-prev"), next = $(".pack-next");
    var slides = $$("li", pista);
    var suave = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    var paso = 0, paginas = 1;
    pista.setAttribute("tabindex", "0");
    pista.setAttribute("aria-label", "Packs: deslizá para ver más");

    function medir() {
      var gap = parseFloat(getComputedStyle(pista).columnGap) || 0;
      paso = slides[0].offsetWidth + gap;
      var visibles = Math.max(1, Math.floor((pista.clientWidth + gap) / paso + 0.01));
      paginas = Math.max(1, slides.length - visibles + 1);
      puntos.innerHTML = "";
      for (var i = 0; i < paginas; i++) {
        var d = document.createElement("button");
        d.type = "button"; d.className = "car-dot"; d.dataset.i = i;
        d.setAttribute("aria-label", "Ver pack " + (i + 1) + " de " + paginas);
        puntos.appendChild(d);
      }
      puntos.hidden = paginas < 2;
    }
    function actualizar() {
      var max = pista.scrollWidth - pista.clientWidth;
      prev.disabled = pista.scrollLeft <= 2;
      next.disabled = pista.scrollLeft >= max - 2;
      var activo = pista.scrollLeft >= max - 2 ? paginas - 1 : Math.min(paginas - 1, Math.round(pista.scrollLeft / paso));
      $$(".car-dot", puntos).forEach(function (d, i) {
        if (i === activo) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
    }
    prev.addEventListener("click", function () { pista.scrollBy({ left: -paso, behavior: suave }); });
    next.addEventListener("click", function () { pista.scrollBy({ left: paso, behavior: suave }); });
    puntos.addEventListener("click", function (e) {
      var d = e.target.closest(".car-dot");
      if (d) pista.scrollTo({ left: Number(d.dataset.i) * paso, behavior: suave });
    });
    pista.addEventListener("scroll", function () { requestAnimationFrame(actualizar); }, { passive: true });
    var t;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(function () { medir(); actualizar(); }, 150); });
    medir(); actualizar();
  })();

  // ---- Ventana de detalle ----
  var detalle = $("#detalle");

  function precioDetalle() {
    return precioCafe(cafeAbierto, $("#d-size").value);
  }
  function abrirDetalle(c, s) {
    cafeAbierto = c;
    var img = $("#d-img");
    img.src = "img/" + c.img;
    img.alt = "Bolsa de " + c.name;
    $("#d-origen").textContent = c.origen;
    $("#d-titulo").textContent = c.name;
    $("#d-prod-row").hidden = c.pais === "Mezclas";
    $("#d-prod").textContent = c.name + ", " + c.origen.split(",")[0];
    $("#d-tueste").textContent = capitalizar(c.tueste);
    var d = $("#d-dots");
    d.innerHTML = puntos(c.lvl);
    d.setAttribute("aria-label", "Tueste " + c.lvl + " de 5");
    $("#d-notas").textContent = c.notas;
    $("#d-size").value = s.size;
    $("#d-mol").value = s.mol;
    $("#d-precio").textContent = fmt(precioDetalle());
    var ayuda = $("#d-ayuda-btn");
    ayuda.setAttribute("aria-expanded", "false");
    $("#d-ayuda").hidden = true;
    var add = $("#d-add");
    clearTimeout(add._t);
    add.classList.remove("ok");
    add.querySelector(".gin").textContent = "Agregar al pedido";
    detalle.showModal();
  }

  $("#d-size").addEventListener("change", function () { $("#d-precio").textContent = fmt(precioDetalle()); });
  $("#d-ayuda-btn").addEventListener("click", function () {
    var abierto = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", abierto ? "false" : "true");
    $("#d-ayuda").hidden = abierto;
  });
  $("#d-add").addEventListener("click", function () {
    var size = $("#d-size").value, mol = $("#d-mol").value;
    agregar(cafeAbierto.id + "-" + size + "-" + mol, cafeAbierto.name, size + " g · " + etiquetaMol(mol), precioCafe(cafeAbierto, size), 1);
    marcarAgregado(this, "Agregado al pedido");
  });

  // Las dos ventanas se cierran con Esc (lo hace <dialog>), con la X o tocando afuera.
  $$("dialog").forEach(function (dlg) {
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.closest("[data-cerrar]")) dlg.close();
    });
  });

  // ---- Pedido ----
  var carrito = $("#carrito");
  var inputNombre = $("#c-nombre");
  var inputCiudad = $("#c-ciudad");
  var inputCom = $("#c-com");

  function agregar(id, name, det, price, q) {
    var ya = pedido.filter(function (it) { return it.id === id; })[0];
    if (ya) ya.q = Math.min(99, ya.q + q);
    else pedido.push({ id: id, name: name, det: det, price: price, q: q });
    guardar();
    dibujarPedido();
  }

  function entregaElegida() { return $("input[name='entrega']:checked").value; }

  function armarMensaje(total, envio, gratis) {
    var nombre = inputNombre.value.trim();
    var ciudad = inputCiudad.value.trim();
    var com = inputCom.value.trim();
    var l = ["Hola, quiero hacer este pedido en Café Raíz:"];
    pedido.forEach(function (it) {
      l.push("• " + it.name + " · " + it.det.toLowerCase() + " · x" + it.q + " · " + fmt(it.price * it.q));
    });
    l.push("Total: " + fmt(total) + (envio ? (gratis ? " (envío gratis)" : " (sin envío)") : ""));
    l.push("Nombre: " + (nombre || "(falta tu nombre)"));
    if (envio) l.push("Entrega: envío a domicilio" + (ciudad ? " en " + ciudad : "") + (gratis ? "" : ". Me confirman el costo, por favor"));
    else l.push("Entrega: retiro en la feria de Plaza Armenia (sábados de 10 a 18 h)");
    if (com) l.push("Comentario: " + com);
    return l.join("\n");
  }

  function dibujarPedido(foco) {
    var unidades = pedido.reduce(function (a, it) { return a + it.q; }, 0);
    var total = pedido.reduce(function (a, it) { return a + it.price * it.q; }, 0);
    var envio = entregaElegida() === "envio";
    var gratis = total >= GRATIS_DESDE;
    var hayNombre = inputNombre.value.trim().length > 0;
    var puedeEnviar = pedido.length > 0 && hayNombre;

    // Encabezado
    var contador = $("#cart-count");
    contador.textContent = unidades;
    contador.hidden = unidades === 0;
    var etiqueta = "Ver pedido, " + (unidades === 0 ? "sin productos" : unidades === 1 ? "1 producto" : unidades + " productos");
    $$(".cart-btn").forEach(function (b) { b.setAttribute("aria-label", etiqueta); });

    // Panel
    $("#c-conteo").textContent = unidades === 1 ? "1 producto" : unidades + " productos";
    $("#c-vacio").hidden = pedido.length > 0;
    $("#c-lleno").hidden = pedido.length === 0;
    $("#c-items").innerHTML = pedido.map(function (it, i) {
      return '<li class="citem"><div class="citem-top"><div><p class="citem-n">' + esc(it.name) + '</p><p class="citem-d">' + esc(it.det) + '</p></div>' +
        '<p class="citem-s">' + fmt(it.price * it.q) + '</p></div>' +
        '<div class="citem-bot"><div class="cantidad" role="group" aria-label="Cantidad de ' + esc(it.name) + '">' +
        '<button class="qb" type="button" data-i="' + i + '" data-acc="menos" aria-label="Restar uno">−</button><output aria-live="polite">' + it.q + '</output>' +
        '<button class="qb" type="button" data-i="' + i + '" data-acc="mas" aria-label="Sumar uno">+</button></div>' +
        '<button class="link-btn" type="button" data-i="' + i + '" data-acc="quitar" aria-label="Quitar ' + esc(it.name) + '">Quitar</button></div></li>';
    }).join("");

    // Entrega y total
    $("#c-ciudad-wrap").hidden = !envio;
    var t, s;
    if (!envio) { t = "Retirás en la feria."; s = "No hay costo de envío."; }
    else if (gratis) { t = "Tu pedido tiene envío gratis."; s = "Es gratis desde " + fmt(GRATIS_DESDE) + "."; }
    else { t = "Te faltan " + fmt(GRATIS_DESDE - total) + " para el envío gratis."; s = "Si no, el costo te lo confirmamos por WhatsApp."; }
    $("#c-envio-t").textContent = t;
    $("#c-envio-s").textContent = s;
    $("#c-total").textContent = fmt(total);

    // Botón de envío
    $("#c-enviar").disabled = !puedeEnviar;
    $("#c-falta").hidden = puedeEnviar;
    inputNombre.classList.toggle("falta-nombre", !hayNombre);
    if (puedeEnviar) $("#c-enviado").hidden = true;

    if (pedido.length) $("#c-msg").textContent = armarMensaje(total, envio, gratis);

    if (foco) {
      var b = $("[data-i='" + foco.i + "'][data-acc='" + foco.acc + "']") || $("[data-acc='" + foco.acc + "']");
      if (b) b.focus();
    }
  }

  $("#c-items").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var i = Number(b.dataset.i), acc = b.dataset.acc;
    if (acc === "mas") pedido[i].q = Math.min(99, pedido[i].q + 1);
    else if (acc === "menos") pedido[i].q = Math.max(1, pedido[i].q - 1);
    else if (acc === "quitar") pedido.splice(i, 1);
    guardar();
    // Tras quitar, el foco pasa al botón del producto que quedó en ese lugar.
    dibujarPedido(acc === "quitar" ? { i: Math.min(i, pedido.length - 1), acc: "quitar" } : { i: i, acc: acc });
  });

  [inputNombre, inputCiudad, inputCom].forEach(function (el) { el.addEventListener("input", function () { dibujarPedido(); }); });
  $$("input[name='entrega']").forEach(function (r) { r.addEventListener("change", function () { dibujarPedido(); }); });

  $("#c-prev-btn").addEventListener("click", function () {
    var abierto = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", abierto ? "false" : "true");
    $("#c-msg").hidden = abierto;
  });

  $("#c-enviar").addEventListener("click", function () {
    if (!pedido.length || !inputNombre.value.trim()) return;
    var total = pedido.reduce(function (a, it) { return a + it.price * it.q; }, 0);
    var envio = entregaElegida() === "envio";
    var texto = armarMensaje(total, envio, total >= GRATIS_DESDE);
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
    $("#c-enviado").hidden = false;
  });

  $$("[data-open-cart]").forEach(function (b) {
    b.addEventListener("click", function () {
      $("#c-enviado").hidden = true;
      dibujarPedido();
      carrito.showModal();
    });
  });

  // ---- Arranque ----
  dibujarGrilla();
  dibujarPedido();
})();
