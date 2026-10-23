export type Article = {
  slug: string
  title: string
  author: string
  publishedAt: string
  summary: string
  content: string[]
}

export const articles: Article[] = [
  {
    slug: 'metricas-clave-dashboard-esports',
    title: 'Las métricas clave de un dashboard de esports',
    author: 'Equipo DashboardEsports',
    publishedAt: '2026-09-02',
    summary:
      'Qué datos de jugadores, equipos y partidas vale la pena mostrar para entender el rendimiento competitivo.',
    content: [
      'Un dashboard de esports no sirve de mucho si solo acumula números. Lo importante es elegir métricas que respondan preguntas concretas: ¿quién está rindiendo mejor?, ¿qué equipo crece más?, ¿cómo le va a cada organización en sus enfrentamientos?',
      'A nivel de jugador, las victorias, el rol que desempeña y las ganancias acumuladas dan una primera imagen de su trayectoria. A nivel de equipo, los seguidores y el país de origen ayudan a medir alcance e influencia.',
      'A nivel de partida, el historial de enfrentamientos entre equipos permite ver rivalidades y tendencias. Con estas tres capas, el dashboard cuenta una historia completa en lugar de mostrar datos aislados.',
    ],
  },
  {
    slug: 'como-se-organiza-un-equipo-profesional',
    title: 'Cómo se organiza un equipo profesional de esports',
    author: 'Equipo DashboardEsports',
    publishedAt: '2026-09-16',
    summary:
      'Una mirada a la estructura de una organización: jugadores, roles y la relación con sus partidas oficiales.',
    content: [
      'Detrás de cada equipo profesional hay una estructura clara. Una organización agrupa a varios jugadores, y cada jugador cumple un rol específico dentro de la plantilla, como líder de línea, apoyo o selvático.',
      'Esa relación entre equipos y jugadores es la base de un buen modelo de datos: un equipo tiene muchos jugadores, y un jugador pertenece a un solo equipo a la vez. Representarla bien evita inconsistencias al mostrar información.',
      'Las partidas, por su parte, conectan a dos equipos en un mismo evento. Entender esta organización ayuda a diseñar pantallas más útiles, donde navegar de un equipo a sus jugadores o a sus partidas sea natural.',
    ],
  },
  {
    slug: 'visualizar-datos-para-decidir-mejor',
    title: 'Visualizar datos para decidir mejor',
    author: 'Equipo DashboardEsports',
    publishedAt: '2026-10-01',
    summary:
      'Por qué las gráficas y las tablas filtrables ayudan a analistas y entrenadores a tomar decisiones.',
    content: [
      'Los analistas y entrenadores rara vez tienen tiempo para revisar hojas de cálculo enormes. Una gráfica bien elegida permite comparar equipos en segundos y detectar patrones que una tabla esconde.',
      'Las tablas filtrables complementan las gráficas: permiten acotar la información por país, rol o equipo y llegar al detalle que se necesita en cada momento.',
      'La clave está en combinar ambas herramientas con una interfaz sencilla. Un dashboard útil no muestra todo a la vez, sino lo necesario para pasar del dato a la decisión.',
    ],
  },
]

export function findArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}
