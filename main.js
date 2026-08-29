/* =========================================================
   GRUPO MUTA — OPCIÓN C
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

/* Marca de que el JS arrancó: si algo falla, el CSS muestra todo
   igual en vez de dejar la página en negro. */
document.documentElement.classList.add("js");

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
  if (el.closest(".datos")) el.textContent = dato.txt;      // en el menú queda la etiqueta
  if (dato.href.startsWith("http")) { el.target = "_blank"; el.rel = "noopener"; }
});

const waFloat = document.getElementById("waFloat");
waFloat.href = waURL(saludo);
waFloat.target = "_blank";
waFloat.rel = "noopener";

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   3) Titulares partidos en palabras + listas escalonadas
   --------------------------------------------------------- */
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
        recorrer(n);
      }
    });
  };

  recorrer(el);
  el.querySelectorAll(".w").forEach((w, i) => w.style.setProperty("--i", i));
  el.classList.add("split");
}

function escalonar(grupo) {
  grupo.classList.add("stg");
  [...grupo.children].forEach((hijo, i) => hijo.style.setProperty("--i", i));
}

const titulares = [...document.querySelectorAll(".hero__t, .scene__t, .stmt, .big")];
const grupos = [...document.querySelectorAll(".tags, .modos, .datos, .niveles, .opts")];

if (!quieto) {
  titulares.forEach(partir);
  grupos.forEach(escalonar);
}

/* Todo lo que entra al hacer scroll.
   Se mide a mano en cada scroll en vez de usar IntersectionObserver:
   el observer no llegaba a disparar en algunos casos y las fotos
   quedaban invisibles, que es el peor final posible. Acá, si algo
   está arriba del borde de abajo de la pantalla, se muestra. */
const entradas = [...document.querySelectorAll(".rv, .stg, .scene__media, .shot")];

function revisarEntradas() {
  const limite = innerHeight * 0.92;
  for (let i = entradas.length - 1; i >= 0; i--) {
    if (entradas[i].getBoundingClientRect().top < limite) {
      entradas[i].classList.add("in");
      entradas.splice(i, 1);            // ya entró: no se mira más
    }
  }
}

if (quieto) {
  entradas.splice(0).forEach((el) => el.classList.add("in"));
}

/* ---------------------------------------------------------
   4) Apertura
   La cortina se va sola, o antes si tocás / scrolleás.
   Se muestra una vez por visita.
   --------------------------------------------------------- */
const intro = document.getElementById("intro");
const heroT = document.querySelector(".hero__t");

const yaVisto = () => {
  try { return sessionStorage.getItem("muta-intro") === "1"; } catch { return false; }
};
const marcarVisto = () => {
  try { sessionStorage.setItem("muta-intro", "1"); } catch { /* modo privado */ }
};

function abrirTelon() {
  if (!intro.isConnected) return;
  document.body.classList.remove("lock");
  document.body.classList.add("go");
  heroT.classList.add("in");
  intro.classList.add("up");
  intro.addEventListener("transitionend", () => intro.remove(), { once: true });
  setTimeout(() => intro.remove(), 2200);   // por si la transición no llega
}

if (quieto || yaVisto()) {
  intro.remove();
  document.body.classList.add("go");
  heroT.classList.add("in");
} else {
  marcarVisto();
  document.body.classList.add("lock");
  const solo = setTimeout(abrirTelon, 1400);
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach((ev) =>
    addEventListener(ev, () => { clearTimeout(solo); abrirTelon(); }, { once: true, passive: true })
  );
}

/* ---------------------------------------------------------
   5) Menú
   --------------------------------------------------------- */
const menu = document.getElementById("menu");
const mbtnFloat = document.getElementById("mbtnFloat");
const abridores = document.querySelectorAll("[data-menu-open]");

function abrirMenu(abrir) {
  menu.hidden = !abrir;
  document.body.classList.toggle("lock", abrir);
  abridores.forEach((b) => b.setAttribute("aria-expanded", String(abrir)));
  if (abrir) {
    requestAnimationFrame(() => menu.classList.add("open"));
    menu.querySelector("[data-menu-close]").focus();
  } else {
    menu.classList.remove("open");
  }
}

abridores.forEach((b) => b.addEventListener("click", () => abrirMenu(menu.hidden)));
menu.addEventListener("click", (e) => {
  if (e.target.closest("[data-menu-close]") || e.target.closest("a") || e.target === menu) {
    abrirMenu(false);
  }
});
addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) abrirMenu(false); });

/* ---------------------------------------------------------
   6) Parallax de las fotos (scroll nativo, sin trucos)
   --------------------------------------------------------- */
const parallax = [...document.querySelectorAll("[data-parallax]")];
let pendiente = false;

function pintar() {
  revisarEntradas();

  if (!quieto) {
    parallax.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.setProperty("--photo-y", `${Math.max(-70, Math.min(2, -38 - p * 30))}px`);
    });
  }
  pendiente = false;
}

function alScrollear() {
  // Mostrar lo que entró se hace acá mismo, sin esperar a un frame:
  // es lo único que no puede fallar. El parallax sí puede esperar.
  revisarEntradas();
  mbtnFloat.classList.toggle("is-on", scrollY > 400);
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(pintar);
}

addEventListener("scroll", alScrollear, { passive: true });
addEventListener("resize", alScrollear, { passive: true });
addEventListener("load", revisarEntradas);
pintar();

/* Las fotos cargan tarde y mueven todo: durante los primeros segundos
   se vuelve a revisar cada tanto, por si algo quedó atrás. */
const vigilar = setInterval(revisarEntradas, 400);
setTimeout(() => clearInterval(vigilar), 8000);

/* Arrastre del lookbook con mouse */
const lookbook = document.querySelector(".lookbook");
if (lookbook && matchMedia("(pointer:fine)").matches) {
  let down = false, x0 = 0, s0 = 0;
  lookbook.addEventListener("pointerdown", (e) => {
    down = true; x0 = e.clientX; s0 = lookbook.scrollLeft;
    lookbook.setPointerCapture(e.pointerId);
  });
  lookbook.addEventListener("pointermove", (e) => {
    if (down) lookbook.scrollLeft = s0 - (e.clientX - x0) * 1.15;
  });
  lookbook.addEventListener("pointerup", () => { down = false; });
  lookbook.addEventListener("pointercancel", () => { down = false; });
}

/* ---------------------------------------------------------
   7) Armá tu evento
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
  wizStep.textContent = `${n} de ${pasos.length}`;
  wizFill.style.width = `${(n / pasos.length) * 100}%`;
  wizMsg.textContent = "";
  pasos[n - 1].querySelectorAll(".stg").forEach((g) => g.classList.add("in"));
}

btnNext.addEventListener("click", () => {
  if (paso === 1 && !wiz.querySelector("input[name='unidad']:checked")) {
    wizMsg.textContent = "Elegí al menos una cosa.";
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
    "",
    `Necesita: ${v.unidad || "a definir"}`,
    `Dónde: ${v.lugar || "a definir"}`,
    `Qué festeja: ${v.tipo || "a definir"}`,
    `Fecha: ${v.fecha || "a definir"}`,
    `Invitados: ${v.invitados || "a definir"}`,
    v.mensaje ? `\nComentarios: ${v.mensaje}` : "",
  ].filter((l) => l !== "").join("\n");
}

wiz.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = datos();
  if (!v.nombre || !v.tel) {
    wizMsg.textContent = "Completá tu nombre y tu WhatsApp.";
    (v.nombre ? wiz.tel : wiz.nombre).focus();
    return;
  }
  wizMsg.textContent = "Abriendo WhatsApp…";
  window.open(waURL(mensaje()), "_blank", "noopener");
});

verPaso(1);
pintarFicha();
