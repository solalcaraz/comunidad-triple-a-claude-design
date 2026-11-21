# Prácticas del módulo de Claude Design: Triple A

Casos de práctica del módulo de Claude Design de la comunidad Triple A, en 2026. Son casos ficticios, pero los trabajé como encargos reales: ordené lo que pedía cada cliente, armé un Design System con los datos de su marca, diseñé en Claude Design, tomé las decisiones de estructura y de tono, y dirigí a Claude Code, que pasó el diseño a código.

## Los casos

| Caso | Rubro | Problema que resuelve | Demo | Performance en celular |
|---|---|---|---|---|
| [Café Raíz](cafe-raiz/README.md) | Café de especialidad | Quien llega por primera vez no sabe qué elegir ni si puede confiar. Una landing cuenta el origen y una tienda arma el pedido y lo envía por WhatsApp. | [Ver web](https://cafe-raiz-especialidad.vercel.app) | Landing 99, tienda 93 |
| [CRUDO](caso-crudo/README.md) | Ropa urbana de edición limitada | Una marca que vendía por Instagram necesita una web con actitud, que muestre las prendas y comunique que lo que hay hoy puede no estar mañana. Una landing con cuenta regresiva y una tienda con pago simulado, hechas desde cero, sin plantilla. | [Ver web](https://crudo-ropa-urbana.vercel.app) | Landing 88, tienda 86 |

Puntajes de Performance de Lighthouse, medidos en modo celular con Chrome sobre los links publicados. Las dos páginas sacaron 100 en Accesibilidad. La tienda sacó 100 también en Buenas prácticas y SEO; la landing, 77 en Buenas prácticas por el mapa de Google embebido. Antes de ajustar la carga, la landing tenía 88 y la tienda 68.

En Crudo, las dos páginas sacaron 100 en Accesibilidad y en Buenas prácticas, y 100 en SEO (la landing da 92 si se mide `/index.html` en lugar de la raíz, por el canonical). En Performance rondan los 3 segundos de primera carga por las fuentes de Google; lo dejé así a propósito y está anotado como mejora en su README.

Los datos de los dos casos son de ejemplo. En Café Raíz, las fotos de las bolsas están generadas con IA (Gemini); en Crudo, las de dos remeras. El README de cada caso lo aclara.

## Cómo trabajé

Claude Design no dibuja una imagen de la web: construye la web de verdad, en HTML. Por eso lo usé para las páginas, y las fotos que faltaban (las bolsas de Café Raíz y dos remeras de Crudo) las generé aparte, con Gemini. El método, en el orden del módulo:

1. **Design System primero.** Cargué la paleta, las tipografías, los componentes y el tono de la marca, para que todo lo que diseñara saliera desde la misma base.
2. **Preparar la landing en cinco pasos.** Objetivo (una sola acción), plantilla (en Crudo no había: la estructura la pensé yo), referencias como norte visual y no como copia, el cliente y sus objeciones, estructura por bloques aprobada antes de diseñar, y revisión bloque por bloque.
3. **Un pedido con estructura.** Qué es, para quién es, cómo se ve y qué lleva adentro.
4. **Prototipo y ajustes en ciclo.** El primer resultado era un punto de partida: lo pulía con vueltas cortas, señalando y comentando sobre el diseño.
5. **Pasar el diseño a código.** El handoff a Claude Code, que lo convirtió en la web publicada en Vercel.
6. **Verificar y documentar.** Probaba en el navegador y en celular simulado, repasaba los autochecks de la consigna, medía con Lighthouse y escribía un README por caso.

## Qué aprendí

- **Un Design System con los datos de la marca da una misma base para diseñar.** Así la landing y la tienda se ven como la misma marca.
- **Las plantillas se usan con un propósito.** Se elige la que mejor se adapta y se justifica por qué, no solo porque guste.
- **Ir más allá de la consigna está bien si es a propósito.** Armé una tienda aparte para experimentar cómo se desarrolla un pequeño e-commerce.
- **Lighthouse muestra información que no se ve a simple vista.**
- **Aunque los datos sean inventados, se mantiene lo que quiere el cliente:** la esencia de la marca, lo que busca y lo que entrega.
- **Diseñar desde cero es decidir la estructura y la jerarquía a partir del manual y del público**, en vez de adaptar una plantilla (Crudo).
- **Se puede traducir la actitud de una marca en movimiento, con límites:** estímulo para un público que scrollea rápido, respetando `prefers-reduced-motion` y el rendimiento en celular (Crudo).
- **Una landing y una tienda tienen que sentirse una sola web:** mismo encabezado, paleta, tipografías y textos que no se contradigan (Crudo).
