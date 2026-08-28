# Grupo MUTA — sitio web

Sitio de Grupo MUTA: las tres unidades (Club, Eventos y Barra) y un pedido de
presupuesto que arma el mensaje y lo abre en WhatsApp.

Hay tres versiones en el repo para elegir. Cuando esté decidida, la que quede pasa
a la raíz y las otras se borran.

| Versión | Dónde | Cómo es |
|---|---|---|
| **A — editorial** | `index.html` (raíz) | La más completa. Fotos con máscara, titulares que suben palabra por palabra, consola de niveles interactiva y galería grande. |
| **B — primera propuesta** | `opcion-b/` | Versión previa, sin fotos. Queda como referencia. |
| **C — visual** | `opcion-c/` | Menos texto, apertura animada (telón) y cada unidad como una escena a pantalla completa. El detalle vive en etiquetas, no en párrafos. |

En las tres: menú hamburguesa a pantalla completa, nada fijo arriba y scroll nativo.

## Archivos de cada versión

| Archivo | Qué tiene |
|---|---|
| `index.html` | Contenido y estructura |
| `styles.css` | Estilos. Colores, tipografías y curvas de animación arriba de todo, en `:root` |
| `main.js` | Datos de contacto, menú, animaciones y armado del presupuesto |
| `assets/img/` | Fotos (compartidas por las tres versiones) |

## Para verlo

```bash
python3 -m http.server 8000
# A: http://localhost:8000
# B: http://localhost:8000/opcion-b/
# C: http://localhost:8000/opcion-c/
```

## Lo primero que hay que cambiar

**Datos de contacto** — en `main.js`, arriba de todo, el objeto `MUTA`: número de
WhatsApp (formato `549341XXXXXXX`, sin `+` ni espacios), Instagram, email,
dirección y link de Google Maps. Hay que hacerlo en cada versión que se use.

## Fotos

Están en `assets/img/`. Para cambiar una, se reemplaza el archivo con el mismo
nombre o se edita el `src` en el HTML. Siempre con `alt` descriptivo.

**Pendiente:** falta una foto buena de la barra. En la opción C la sección
*MUTA Barra* está resuelta sin foto a propósito; cuando haya una, se arma igual
que las otras dos escenas (ver el bloque `#club` en `opcion-c/index.html`).

## Tipografía

**Roboto Flex** (variable, se le mueve el ancho en los titulares), **Bodoni Moda**
itálica para las palabras acentuadas y **Chivo Mono** para etiquetas. Se cargan
desde Google Fonts.

## Publicar

Es un sitio estático: sirve cualquier hosting. En Vercel se sube la carpeta tal
cual y queda online; después se le apunta el dominio.

## Próximos pasos posibles

- Presupuesto con precios y cálculo automático por cantidad de invitados.
- Bot de WhatsApp que responda consultas frecuentes y tome los datos del evento.
- Calendario de fechas disponibles del salón.
