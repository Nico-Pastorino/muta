/* =========================================================
   GRUPO MUTA — EXPERIENCIA EDITORIAL
   ========================================================= */

/* ---------------------------------------------------------
   1) DATOS DEL NEGOCIO — editar solo acá
   --------------------------------------------------------- */
const MUTA = {
  whatsapp: "5493410000000",              // internacional, sin + ni espacios
  whatsappVisible: "+54 9 341 000 0000",
  instagram: "https://instagram.com/grupomuta",
  instagramVisible: "@grupomuta",
  email: "eventos@grupomuta.com",
  direccion: "Av. Ejemplo 1234, Rosario",
  maps: "https://maps.google.com/?q=Av.+Ejemplo+1234+Rosario",
};

const waURL = (texto = "") =>
  `https://wa.me/${MUTA.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;

const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Línea de progreso: convierte el recorrido de la página en una secuencia. */
const progress = document.createElement("div");
progress.className = "progress";
progress.setAttribute("aria-hidden", "true");
document.body.prepend(progress);

/* ---------------------------------------------------------
   2) Enlaces de contacto
   --------------------------------------------------------- */
const saludo = "Hola MUTA, quiero consultar por un evento.";

document.querySelectorAll("[data-cfg]").forEach((el) => {
  const dato = {
    wa:   { href: waURL(saludo), txt: MUTA.whatsappVisible },
    ig:   { href: MUTA.instagram, txt: MUTA.instagramVisible },
    mail: { href: `mailto:${MUTA.email}`, txt: MUTA.email },
    maps: { href: MUTA.maps, txt: MUTA.direccion },
  }[el.dataset.cfg];

  if (!dato) return;
  el.href = dato.href;
  // En la lista de contacto se muestra el dato; en el menú queda la etiqueta
  if (el.closest(".datos")) el.textContent = dato.txt;
  if (dato.href.startsWith("http")) { el.target = "_blank"; el.rel = "noopener"; }
});

const waFloat = document.getElementById("waFloat");
waFloat.href = waURL(saludo);
waFloat.target = "_blank";
waFloat.rel = "noopener";

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   3) Menú
   --------------------------------------------------------- */
const menu = document.getElementById("menu");
const mbtnFloat = document.getElementById("mbtnFloat");
const abridores = document.querySelectorAll("[data-menu-open]");

function abrirMenu(abrir) {
  menu.hidden = !abrir;
  document.body.classList.toggle("lock", abrir);
  abridores.forEach((b) => b.setAttribute("aria-expanded", String(abrir)));
  // La clase llega un frame después para que los links puedan entrar animados
  if (abrir) {
    requestAnimationFrame(() => menu.classList.add("open"));
    menu.querySelector("[data-menu-close]").focus();
  } else {
    menu.classList.remove("open");
  }
}

abridores.forEach((b) => b.addEventListener("click", () => abrirMenu(menu.hidden)));
menu.addEventListener("click", (e) => {
  // Cierra con el botón, al elegir una sección o tocando el fondo
  if (e.target.closest("[data-menu-close]") || e.target.closest("a") || e.target === menu) {
    abrirMenu(false);
  }
});
addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) abrirMenu(false); });

addEventListener("scroll", () => {
  mbtnFloat.classList.toggle("is-on", scrollY > 400);
}, { passive: true });

/* Progreso, parallax de fotos y desplazamiento suave del hero en un solo frame. */
const parallax = [...document.querySelectorAll("[data-parallax]")];
const heroMedia = document.querySelector(".hero__media");
let scrollTick = false;

function pintarScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.setProperty("--scroll", max > 0 ? Math.min(scrollY / max, 1) : 0);

  if (!quieto) {
    if (heroMedia) heroMedia.style.transform = `translate3d(0,${Math.min(scrollY * .16, 100)}px,0)`;
    parallax.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.setProperty("--photo-y", `${Math.max(-62, Math.min(2, -32 - p * 28))}px`);
    });
  }
  scrollTick = false;
}

addEventListener("scroll", () => {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(pintarScroll);
}, { passive: true });
pintarScroll();

/* Arrastre horizontal del lookbook con mouse, conservando el scroll táctil nativo. */
const lookbook = document.querySelector(".lookbook");
if (lookbook && matchMedia("(pointer:fine)").matches) {
  let down = false, startX = 0, startScroll = 0;
  lookbook.addEventListener("pointerdown", (e) => {
    down = true; startX = e.clientX; startScroll = lookbook.scrollLeft;
    lookbook.setPointerCapture(e.pointerId);
  });
  lookbook.addEventListener("pointermove", (e) => {
    if (down) lookbook.scrollLeft = startScroll - (e.clientX - startX) * 1.15;
  });
  lookbook.addEventListener("pointerup", () => { down = false; });
  lookbook.addEventListener("pointercancel", () => { down = false; });
}

/* ---------------------------------------------------------
   4) Luz que sigue al cursor + color de la sección activa
   --------------------------------------------------------- */
const spot = document.getElementById("spot");

if (matchMedia("(pointer:fine)").matches && !quieto) {
  let px = 0, py = 0, pendiente = false;
  addEventListener("pointermove", (e) => {
    px = e.clientX; py = e.clientY;
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      spot.style.setProperty("--mx", `${px}px`);
      spot.style.setProperty("--my", `${py}px`);
      pendiente = false;
    });
  }, { passive: true });
}

const conCue = document.querySelectorAll("[style*='--cue']");
const cueSpy = new IntersectionObserver((es) => {
  es.forEach((e) => {
    if (!e.isIntersecting) return;
    const c = getComputedStyle(e.target).getPropertyValue("--cue");
    if (c) spot.style.setProperty("--cue", c.trim());
  });
}, { rootMargin: "-40% 0px -40% 0px" });
conCue.forEach((s) => { if (s.tagName === "SECTION") cueSpy.observe(s); });

/* ---------------------------------------------------------
   5) Hero: bola de espejos + haces de luz (canvas)
   --------------------------------------------------------- */
const cv = document.getElementById("lights");
const ctx = cv.getContext("2d");
const PALETA = ["#FF1D6C", "#2E5BFF", "#E8D9A8", "#FFFFFF"];

let W = 0, H = 0, puntos = [], activo = true;

function medir() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = Math.round(W * dpr);
  cv.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  sembrar();
}

/* Cada punto es un reflejo de la bola: gira alrededor del centro
   en una órbita propia, como los destellos sobre la pared. */
function sembrar() {
  const n = W < 700 ? 55 : 110;
  puntos = Array.from({ length: n }, () => ({
    ang: Math.random() * Math.PI * 2,
    rx: (0.25 + Math.random() * 0.75) * W * 0.62,
    ry: (0.2 + Math.random() * 0.9) * H * 0.55,
    dy: (Math.random() - 0.5) * H * 0.5,
    vel: (0.00018 + Math.random() * 0.00042) * (Math.random() < 0.5 ? -1 : 1),
    r: 1 + Math.random() * 3.4,
    col: PALETA[(Math.random() * PALETA.length) | 0],
    fase: Math.random() * Math.PI * 2,
  }));
}

function dibujar(t) {
  ctx.clearRect(0, 0, W, H);
  const cx = W * 0.52, cy = H * 0.42;

  // Haces de luz de fondo
  ctx.globalCompositeOperation = "lighter";
  const haces = [
    { c: "#FF1D6C", x: cx - W * 0.3 + Math.sin(t * 0.00013) * W * 0.1, y: cy - H * 0.2, r: W * 0.42, a: 0.5 },
    { c: "#2E5BFF", x: cx + W * 0.32 + Math.cos(t * 0.00011) * W * 0.12, y: cy + H * 0.05, r: W * 0.46, a: 0.45 },
    { c: "#E8D9A8", x: cx + Math.sin(t * 0.00007) * W * 0.2, y: cy + H * 0.42, r: W * 0.3, a: 0.16 },
  ];
  haces.forEach((h) => {
    const g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.r);
    g.addColorStop(0, `${h.c}${Math.round(h.a * 90).toString(16).padStart(2, "0")}`);
    g.addColorStop(1, `${h.c}00`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  });

  // Destellos de la bola de espejos
  puntos.forEach((p) => {
    const a = p.ang + t * p.vel;
    const x = cx + Math.cos(a) * p.rx;
    const y = cy + Math.sin(a) * p.ry * 0.42 + p.dy;
    const brillo = 0.25 + 0.75 * Math.abs(Math.sin(a * 0.5 + p.fase));
    const r = p.r * (0.6 + brillo * 0.7);

    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
    g.addColorStop(0, p.col);
    g.addColorStop(0.22, `${p.col}66`);
    g.addColorStop(1, `${p.col}00`);
    ctx.globalAlpha = brillo * 0.6;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

function bucle(t) {
  if (activo) dibujar(t);
  requestAnimationFrame(bucle);
}

medir();
addEventListener("resize", medir);

if (quieto) {
  dibujar(0);
} else {
  requestAnimationFrame(bucle);
  // No gastar batería cuando el hero no está a la vista
  new IntersectionObserver(([e]) => { activo = e.isIntersecting; })
    .observe(document.querySelector(".hero"));
}

/* ---------------------------------------------------------
   6) Aparición al scroll
   --------------------------------------------------------- */

/* 6.a) Titulares que suben palabra por palabra.
   Cada palabra viaja dentro de su propia máscara; el índice --i
   hace que arranquen una atrás de otra. */
function partir(el) {
  if (el.classList.contains("split")) return;

  const recorrer = (nodo) => {
    [...nodo.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        if (!n.textContent.trim()) return;
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((parte) => {
          if (!parte) return;
          if (!parte.trim()) { frag.append(parte); return; }
          const caja = document.createElement("span");
          caja.className = "w";
          const palabra = document.createElement("i");
          palabra.textContent = parte;
          caja.append(palabra);
          frag.append(caja);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") {
        recorrer(n);   // conserva los <em> y su tipografía
      }
    });
  };

  recorrer(el);
  el.querySelectorAll(".w").forEach((w, i) => w.style.setProperty("--i", i));
  el.classList.add("split");
}

/* 6.b) Listas que entran escalonadas */
function escalonar(grupo) {
  grupo.classList.remove("rv");
  grupo.classList.add("stg");
  [...grupo.children].forEach((hijo, i) => hijo.style.setProperty("--i", i));
}

const titulares = [...document.querySelectorAll(".hero__t, .stmt, .big")];
const grupos = [...document.querySelectorAll(".chips, .listado, .datos, .opts")];

if (!quieto) {
  titulares.forEach(partir);
  grupos.forEach(escalonar);
}

const entradas = document.querySelectorAll(".rv, .stg");
if (quieto) {
  entradas.forEach((el) => el.classList.add("in"));
} else {
  const io = new IntersectionObserver((es, obs) => {
    es.forEach((e, i) => {
      if (!e.isIntersecting) return;
      e.target.style.transitionDelay = `${Math.min(i * 80, 320)}ms`;
      e.target.classList.add("in");
      obs.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });
  entradas.forEach((el) => io.observe(el));

  // El titular del hero no espera al scroll: entra apenas cargan las fuentes
  const heroT = document.querySelector(".hero__t");
  const arrancarHero = () => requestAnimationFrame(() => heroT.classList.add("in"));
  if (document.fonts?.ready) document.fonts.ready.then(arrancarHero);
  else arrancarHero();
}

/* 6.c) La foto de cada unidad asoma junto al cursor */
const conPeek = document.querySelectorAll("[data-peek]");
if (conPeek.length && matchMedia("(pointer:fine)").matches && !quieto) {
  const peek = document.createElement("div");
  peek.className = "peek";
  peek.setAttribute("aria-hidden", "true");
  const foto = document.createElement("img");
  foto.alt = "";
  peek.append(foto);
  document.body.append(peek);

  let x = 0, y = 0, cx = 0, cy = 0, siguiendo = false;

  const seguir = () => {
    cx += (x - cx) * 0.13;
    cy += (y - cy) * 0.13;
    peek.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    if (siguiendo) requestAnimationFrame(seguir);
  };

  conPeek.forEach((el) => {
    el.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      foto.src = el.dataset.peek;
      x = cx = e.clientX;
      y = cy = e.clientY;
      peek.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      peek.classList.add("on");
      if (!siguiendo) { siguiendo = true; requestAnimationFrame(seguir); }
    });
    el.addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; });
    el.addEventListener("pointerleave", () => {
      peek.classList.remove("on");
      siguiendo = false;
    });
  });
}

/* ---------------------------------------------------------
   7) Consola de niveles (MUTA Club)
   --------------------------------------------------------- */
const tabs = [...document.querySelectorAll(".lvls button")];
const feats = [...document.querySelectorAll("#feats li")];
const lvlDesc = document.getElementById("lvlDesc");

const DESC = {
  1: "El espacio en exclusiva durante el horario contratado, listo para que armes tu evento.",
  2: "El espacio funcionando como fiesta: DJ, técnica con operador, barra y tapeo.",
  3: "Propuesta integral con coordinación de una party planner de punta a punta.",
};

function nivel(n) {
  tabs.forEach((t) => t.setAttribute("aria-selected", String(+t.dataset.lvl === n)));
  feats.forEach((li, i) => {
    const prende = +li.dataset.min <= n;
    // Escalonado: las nuevas se encienden una atrás de otra
    li.style.transitionDelay = prende ? `${Math.min(i * 45, 400)}ms` : "0ms";
    li.classList.toggle("on", prende);
  });
  lvlDesc.textContent = DESC[n];
}

tabs.forEach((t) => {
  t.addEventListener("click", () => nivel(+t.dataset.lvl));
  t.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(t);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") tabs[(i + 1) % tabs.length].focus();
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") tabs[(i - 1 + tabs.length) % tabs.length].focus();
  });
});
nivel(1);

/* ---------------------------------------------------------
   8) Armá tu evento: 3 pasos + ficha en vivo + WhatsApp
   --------------------------------------------------------- */
const wiz = document.getElementById("wiz");
const pasos = [...wiz.querySelectorAll(".step")];
const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");
const btnSend = document.getElementById("send");
const wizStep = document.getElementById("wizStep");
const wizFill = document.getElementById("wizFill");
const wizMsg = document.getElementById("wizMsg");

let paso = 1;

function verPaso(n) {
  paso = n;
  pasos.forEach((p) => (p.hidden = +p.dataset.step !== n));
  btnPrev.hidden = n === 1;
  btnNext.hidden = n === pasos.length;
  btnSend.hidden = n !== pasos.length;
  wizStep.textContent = `Paso ${n} de ${pasos.length}`;
  wizFill.style.width = `${(n / pasos.length) * 100}%`;
  wizMsg.textContent = "";
  // Las opciones del paso que se muestra entran escalonadas
  pasos[n - 1].querySelectorAll(".stg").forEach((g) => g.classList.add("in"));
}

btnNext.addEventListener("click", () => {
  if (paso === 1 && !wiz.querySelector("input[name='unidad']:checked")) {
    wizMsg.textContent = "Elegí al menos una cosa que necesites.";
    return;
  }
  verPaso(Math.min(paso + 1, pasos.length));
});
btnPrev.addEventListener("click", () => verPaso(Math.max(paso - 1, 1)));

const fmtFecha = (v) => (v ? v.split("-").reverse().join("/") : "");

function datos() {
  const d = new FormData(wiz);
  return {
    unidad: d.getAll("unidad").join(", "),
    lugar: d.get("lugar") || "",
    tipo: d.get("tipo") || "",
    fecha: fmtFecha(d.get("fecha")),
    invitados: d.get("invitados") || "",
    nombre: (d.get("nombre") || "").trim(),
    tel: (d.get("tel") || "").trim(),
    email: (d.get("email") || "").trim(),
    mensaje: (d.get("mensaje") || "").trim(),
  };
}

function pintarFicha() {
  const v = datos();
  const campos = {
    unidad: v.unidad,
    lugar: v.lugar,
    tipo: v.tipo,
    fecha: v.fecha,
    invitados: v.invitados ? `${v.invitados} personas` : "",
    contacto: [v.nombre, v.tel].filter(Boolean).join(" · "),
  };
  Object.entries(campos).forEach(([k, val]) => {
    const dd = document.querySelector(`[data-f="${k}"]`);
    dd.textContent = val || "—";
    dd.classList.toggle("set", Boolean(val));
  });
}

wiz.addEventListener("input", pintarFicha);
wiz.addEventListener("change", pintarFicha);

function mensaje() {
  const v = datos();
  return [
    "*Pedido de presupuesto — Grupo MUTA*",
    "",
    `Nombre: ${v.nombre}`,
    `Contacto: ${v.tel}`,
    v.email ? `Email: ${v.email}` : "",
    "",
    `Necesita: ${v.unidad || "a definir"}`,
    `Dónde: ${v.lugar || "a definir"}`,
    `Tipo de evento: ${v.tipo || "a definir"}`,
    `Fecha: ${v.fecha || "a definir"}`,
    `Invitados: ${v.invitados || "a definir"}`,
    v.mensaje ? `\nComentarios: ${v.mensaje}` : "",
  ].filter((l) => l !== "").join("\n");
}

wiz.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = datos();
  if (!v.nombre || !v.tel) {
    wizMsg.textContent = "Completá tu nombre y tu WhatsApp para poder responderte.";
    (v.nombre ? wiz.tel : wiz.nombre).focus();
    return;
  }
  wizMsg.textContent = "Abriendo WhatsApp con tu pedido…";
  window.open(waURL(mensaje()), "_blank", "noopener");
});

verPaso(1);
pintarFicha();
