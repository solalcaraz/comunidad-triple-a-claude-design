# Prácticas del módulo de Claude Design: Triple A

Casos de práctica del módulo de Claude Design de la comunidad Triple A, en 2026. Son casos ficticios, pero los trabajé como encargos reales: ordené lo que pedía cada cliente, armé un Design System con los datos de su marca, diseñé en Claude Design, tomé las decisiones de estructura y de tono, y dirigí a Claude Code, que pasó el diseño a código.

## Los casos

| Caso | Rubro | Problema que resuelve | Demo |
|---|---|---|---|
| [Café Raíz](cafe-raiz/README.md) | Café de especialidad | Quien llega por primera vez no sabe qué elegir ni si puede confiar. Una landing cuenta el origen y una tienda arma el pedido y lo envía por WhatsApp. | [Ver web](https://cafe-raiz-especialidad.vercel.app) |

El segundo caso del módulo (Crudo) todavía no está en este repo.

Los datos de contacto, los precios, los productores y la feria son de ejemplo, y las fotos de las bolsas son maquetas generadas. El README del caso lo aclara.

## Cómo trabajé

1. **Ordenar antes de diseñar.** Leía la consigna y el manual de marca, y definía el objetivo, la plantilla y por qué la elegía, las referencias, el cliente y la estructura de la página, antes de pedir algo.
2. **Un Design System primero.** Armaba la base con los colores, las tipografías y el tono de la marca, para diseñar siempre desde lo mismo.
3. **Diseñar en Claude Design y pasar el diseño a código.** Con un prompt aprobado por mí, Claude Design hacía el diseño y Claude Code lo llevaba a HTML, CSS y JavaScript.
4. **Decidir yo.** Para cada decisión de diseño o de texto, Claude proponía opciones y yo elegía.
5. **Verificar.** Probaba en el navegador y en celular simulado, repasaba los autochecks de la consigna y medía con Lighthouse.
6. **Documentar.** Un README por caso, con las decisiones y qué mejoraría.

## Qué aprendí

- **Un Design System con los datos de la marca da una misma base para diseñar.** Así la landing y la tienda se ven como la misma marca.
- **Las plantillas se usan con un propósito.** Se elige la que mejor se adapta y se justifica por qué, no solo porque guste.
- **Ir más allá de la consigna está bien si es a propósito.** Armé una tienda aparte para experimentar cómo se desarrolla un pequeño e-commerce.
- **Lighthouse muestra información que no se ve a simple vista.**
- **Aunque los datos sean inventados, se mantiene lo que quiere el cliente:** la esencia de la marca, lo que busca y lo que entrega.
