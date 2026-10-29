# Agenda El Ancla · Demo instalable (PWA)

Una sola app web que se instala en **iPhone y Android** con su propio ícono.
Es la demo con datos de ejemplo: las citas se guardan solo en el teléfono donde se usa.
La versión real con Flask + MySQL guardará todo en el servidor.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app: reservar cita y panel del negocio |
| `manifest.json` | Nombre, colores e íconos. Android lo usa para instalarla |
| `sw.js` | Service worker: guarda la app para abrir rápido y sin internet |
| `offline.html` | Pantalla de "Sin conexión" |
| `icons/` | Íconos (Android usa 192/512; iPhone usa `apple-touch-icon.png`) |

## Importante: hay que abrirla desde una dirección web (https)

Si abres `index.html` desde la app Archivos del iPhone o como adjunto, solo verás el encabezado:
esa vista previa no ejecuta JavaScript. Además, el service worker solo funciona en `https://`
(o en `localhost` para pruebas).

## Publicarla gratis en GitHub Pages

1. En GitHub crea un repositorio público, por ejemplo `agenda-demo`.
2. Sube **todo el contenido** de esta carpeta (que `index.html` quede en la raíz del repo).
   - Desde la web: *Add file → Upload files* y arrastra los archivos y la carpeta `icons`.
   - O con Git:
     ```bash
     git init
     git add .
     git commit -m "Demo agenda El Ancla (PWA)"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/agenda-demo.git
     git push -u origin main
     ```
3. En el repo: *Settings → Pages → Build and deployment → Source: Deploy from a branch*,
   rama `main`, carpeta `/ (root)`, *Save*.
4. Espera 1–2 minutos. Tu liga queda así: `https://TU_USUARIO.github.io/agenda-demo/`

## Instalarla en el teléfono

**iPhone (Safari):**
1. Abre la liga en **Safari** (no desde Archivos ni otra app).
2. Toca **Compartir** (cuadro con flecha hacia arriba).
3. Elige **Agregar a inicio** → **Agregar**.

**Android (Chrome):**
1. Abre la liga en **Chrome**.
2. Toca **Instalar** en el aviso azul de la app, o menú ⋮ → **Instalar app** / **Agregar a pantalla principal**.

## Probarla en tu computadora

```bash
cd agenda-pwa
python -m http.server 8000
```
Abre `http://localhost:8000` en Chrome. En *DevTools → Application* puedes ver el manifest y el service worker.

## Cuando cambies algo

Sube el número de `VERSION` en `sw.js` (por ejemplo `v1` → `v2`) para que los teléfonos descarguen la versión nueva.

## Notas por sistema

- **iPhone:** no muestra botón automático de instalar; la app enseña un aviso con los pasos.
  Los campos de texto usan 16 px para que Safari no haga zoom al escribir.
- **Android:** Chrome avisa que se puede instalar y la app muestra el botón **Instalar**.
- En ambos, la app instalada abre a pantalla completa, sin la barra del navegador.
