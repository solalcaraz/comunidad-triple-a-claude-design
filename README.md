# Prácticas del módulo de Claude Design: Triple A

Casos de práctica del módulo de Claude Design de la comunidad Triple A, en 2026. Son casos ficticios, pero los trabajé como encargos reales: ordené lo que pedía cada cliente, armé un Design System con los datos de su marca, diseñé en Claude Design, tomé las decisiones de estructura y de tono, y dirigí a Claude Code, que pasó el diseño a código.

## Los casos

| Caso | Rubro | Problema que resuelve | Demo | Performance en celular |
|---|---|---|---|---|
| [Café Raíz](cafe-raiz/README.md) | Café de especialidad | Quien llega por primera vez no sabe qué elegir ni si puede confiar. Una landing cuenta el origen y una tienda arma el pedido y lo envía por WhatsApp. | [Ver web](https://cafe-raiz-especialidad.vercel.app) | Landing 99, tienda 93 |

Puntajes de Performance de Lighthouse, medidos en modo celular con Chrome sobre los links publicados. Las dos páginas sacaron 100 en Accesibilidad. Antes de ajustar la carga, la landing tenía 88 y la tienda 68.

El segundo caso del módulo (Crudo) todavía no está en este repo.

Los datos son de ejemplo y las fotos de las bolsas están generadas con IA. El README del caso lo aclara.

## Cómo trabajé

Claude Design no dibuja una imagen de la web: construye la web de verdad, en HTML. Por eso lo usé para las páginas y las fotos de las bolsas las generé aparte. El método, en el orden del módulo:

1. **Design System primero.** Cargué la paleta, las tipografías, los componentes y el tono de la marca, para que todo lo que diseñara saliera desde la misma base.
2. **Preparar la landing en cinco pasos.** Objetivo (una sola acción), referencias como norte visual y no como copia, el cliente y sus objeciones, estructura por bloques aprobada antes de diseñar, y revisión bloque por bloque.
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
