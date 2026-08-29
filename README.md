# Grupo MUTA — sitio web

Sitio de Grupo MUTA: las tres unidades (Club, Eventos y Barra) y un pedido de
presupuesto que arma el mensaje y lo abre en WhatsApp.

## Cómo está armado

Una sola página. Abre con un telón animado y después baja por escenas: cada
unidad ocupa una pantalla con su foto, el nombre grande y una línea. El detalle
vive en etiquetas, no en párrafos.

| Archivo | Qué tiene |
|---|---|
| `index.html` | Contenido y estructura |
| `styles.css` | Estilos. Colores, tipografías y curvas de animación arriba de todo, en `:root` |
| `main.js` | Datos de contacto, telón, menú, animaciones y armado del presupuesto |
| `assets/img/` | Fotos |
| `opcion-a/` | Versión anterior (más texto, consola de niveles interactiva). Queda archivada |

## Para verlo

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## Lo primero que hay que cambiar

**Datos de contacto** — en `main.js`, arriba de todo, el objeto `MUTA`: número de
WhatsApp (formato `549341XXXXXXX`, sin `+` ni espacios), Instagram, email,
dirección y link de Google Maps.

## Fotos

Están en `assets/img/`. Para cambiar una, se reemplaza el archivo con el mismo
nombre o se edita el `src` en el HTML. Siempre con `alt` descriptivo.

**Pendiente:** falta una foto buena de la barra. La escena `#barra` usa una
provisoria (`cena-roja.jpg`); está marcado con un comentario en el HTML.

## Tipografía

**Roboto Flex** (variable, se le mueve el ancho en los titulares), **Bodoni Moda**
itálica para las palabras acentuadas y **Chivo Mono** para etiquetas.

## Publicar

Sitio estático. Vercel lo sirve tal cual; `vercel.json` deja las URLs sin `.html`
y cachea las fotos.

## Próximos pasos posibles

- Presupuesto con precios y cálculo automático por cantidad de invitados.
- Bot de WhatsApp que responda consultas y tome los datos del evento.
- Calendario de fechas disponibles del salón.
