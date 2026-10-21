import type { NewsArticle } from '../types/news';

// Evergreen destination stories use user-supplied AI illustrations, not documentary photographs.
export const newsArticles: NewsArticle[] = [
  {
    slug: 'a-thoughtful-day-outdoors',
    title: {
      en: 'Matka Canyon: between cliffs and water',
      mk: 'Кањонот Матка: меѓу карпите и водата',
    },
    excerpt: {
      en: 'Discover Matka Canyon through its cliffs, waterside scenery and moments worth slowing down for.',
      mk: 'Запознајте го кањонот Матка низ неговите карпи, крајбрежни предели и мигови што заслужуваат поспокоен ритам.',
    },
    category: {
      en: 'Outdoor notes',
      mk: 'Белешки од природата',
    },
    cover: {
      src: '/images/news/matka-canyon.webp',
      alt: {
        en: 'AI-generated purple-and-cream illustration of Matka Canyon, with cliffs, water and a small boat',
        mk: 'Виолетово-крем илустрација генерирана со ВИ на кањонот Матка, со карпи, вода и мал чамец',
      },
    },
    sections: [
      {
        heading: {
          en: 'A landscape worth a pause',
          mk: 'Предел што заслужува пауза',
        },
        paragraphs: [
          {
            en: 'Matka Canyon lies southwest of Skopje, along the Treska River. Its cliffs and water offer a different perspective from the city. Leave time to notice the reflections, the shapes of the rock and the changing light.',
            mk: 'Кањонот Матка се наоѓа југозападно од Скопје, по течението на реката Треска. Карпите и водата нудат поинаков поглед од градскиот. Одвојте време за одразите, облиците на карпите и промените на светлината.',
          },
        ],
      },
      {
        heading: {
          en: 'Explore with care',
          mk: 'Истражувајте внимателно',
        },
        paragraphs: [
          {
            en: 'Plan your visit around the activities you want to enjoy, and check their current access arrangements before setting out. Follow local signs, keep to designated paths and take your litter with you. If joining an excursion, confirm its meeting point and included activities with the provider.',
            mk: 'Испланирајте ја посетата според активностите што ве интересираат и проверете ги тековните услови за пристап пред поаѓање. Следете ги локалните ознаки, движете се по означените патеки и понесете го отпадот со себе. Ако се приклучувате на излет, потврдете ги местото на средба и вклучените активности со организаторот.',
          },
        ],
      },
    ],
  },
  {
    slug: 'a-moment-by-lake-ohrid',
    title: {
      en: 'A moment by Lake Ohrid',
      mk: 'Миг покрај Охридското Езеро',
    },
    excerpt: {
      en: 'Lakeside walks, views towards Kaneo and a little time to discover Ohrid at your own pace.',
      mk: 'Прошетки покрај езерото, погледи кон Канео и време да го откриете Охрид со сопствен ритам.',
    },
    category: {
      en: 'Destination guide',
      mk: 'Водич за дестинација',
    },
    cover: {
      src: '/images/news/lake-ohrid.webp',
      alt: {
        en: 'AI-generated purple-and-cream illustration inspired by Lake Ohrid and the Church of St. John at Kaneo at sunset',
        mk: 'Виолетово-крем илустрација генерирана со ВИ, инспирирана од Охридското Езеро и црквата Свети Јован Канео на зајдисонце',
      },
    },
    sections: [
      {
        heading: {
          en: 'Take time to look around',
          mk: 'Одвојте време за разгледување',
        },
        paragraphs: [
          {
            en: 'Ohrid brings lakeside scenery and cultural heritage together. Make space in your day for both: a walk through the town and a pause beside the water. Notice how the light changes the view, and leave room for discoveries along the way.',
            mk: 'Охрид ги спојува езерските предели и културното наследство. Одвојте време и за двете: прошетка низ градот и пауза покрај водата. Забележете како светлината го менува погледот и оставете простор за откритија по патот.',
          },
        ],
      },
      {
        heading: {
          en: 'Make room for your own story',
          mk: 'Оставете простор за своја приказна',
        },
        paragraphs: [
          {
            en: 'A short walk, a photograph or a conversation can become the part of a journey you remember. When visiting churches or other cultural sites, respect posted guidance and people using the space. Check current opening arrangements for any places you hope to enter.',
            mk: 'Кратка прошетка, фотографија или разговор може да станат највпечатливиот дел од патувањето. При посета на цркви и други културни места, почитувајте ги истакнатите упатства и луѓето што го користат просторот. Проверете го тековното работно време на местата во кои сакате да влезете.',
          },
        ],
      },
    ],
  },
  {
    slug: 'skopje-stories-by-the-vardar',
    title: {
      en: 'Skopje: stories by the Vardar',
      mk: 'Скопје: приказни покрај Вардар',
    },
    excerpt: {
      en: 'Follow the Vardar, discover the Stone Bridge and see Skopje with fresh curiosity.',
      mk: 'Прошетајте покрај Вардар, откријте го Камениот мост и погледнете го Скопје со нова љубопитност.',
    },
    category: {
      en: 'City stories',
      mk: 'Градски приказни',
    },
    cover: {
      src: '/images/news/skopje.webp',
      alt: {
        en: 'AI-generated purple-and-cream illustration inspired by Skopje, with the Stone Bridge, Vardar River and fortress silhouette',
        mk: 'Виолетово-крем илустрација генерирана со ВИ, инспирирана од Скопје, со Камениот мост, реката Вардар и силуетата на тврдината',
      },
    },
    sections: [
      {
        heading: {
          en: 'A city seen from the river',
          mk: 'Град гледан од реката',
        },
        paragraphs: [
          {
            en: 'The Stone Bridge crosses the Vardar in central Skopje, while Kale is another familiar city landmark. Start with the river as a point of reference, then take time to notice the surrounding streets, rooftops and everyday life.',
            mk: 'Камениот мост го премостува Вардар во центарот на Скопје, а Калето е уште една препознатлива градска знаменитост. Нека реката ви биде почетна ориентација, а потоа одвојте време за околните улици, покривите и секојдневниот живот.',
          },
        ],
      },
      {
        heading: {
          en: 'Look beyond the postcard',
          mk: 'Погледнете подалеку од разгледницата',
        },
        paragraphs: [
          {
            en: 'A city visit need not be a list of landmarks. Leave time for a conversation or a pause beside the water, and choose a walking route that suits your interests. Check access information for individual sites rather than assuming every place is open.',
            mk: 'Посетата на градот не мора да биде само список на знаменитости. Оставете време за разговор или пауза покрај водата и изберете прошетка според вашите интереси. Проверете ги условите за пристап до поединечните места наместо да претпоставувате дека сите се отворени.',
          },
        ],
      },
    ],
  },
  {
    slug: 'a-pause-in-macedonian-nature',
    title: {
      en: 'A pause in Macedonian nature',
      mk: 'Пауза во македонската природа',
    },
    excerpt: {
      en: 'Mountain horizons, forest paths and thoughtful ways to enjoy time outdoors in North Macedonia.',
      mk: 'Планински хоризонти, шумски патеки и идеи за внимателно уживање во природата во Северна Македонија.',
    },
    category: {
      en: 'Outdoor inspiration',
      mk: 'Инспирација од природата',
    },
    cover: {
      src: '/images/news/macedonian-nature.webp',
      alt: {
        en: 'AI-generated purple-and-cream illustration of an imagined Macedonian mountain landscape, with forest, a lake and a rocky path',
        mk: 'Виолетово-крем илустрација генерирана со ВИ на замислен македонски планински предел, со шума, езеро и карпеста патека',
      },
    },
    sections: [
      {
        heading: {
          en: 'Leave space for the landscape',
          mk: 'Оставете простор за пределот',
        },
        paragraphs: [
          {
            en: 'An outdoor day can be as much about noticing small details as reaching a destination. Think about what you enjoy most: forest scenery, open views or a gentle pause along the way. Choose a marked route that suits your experience and the conditions.',
            mk: 'Денот во природа може да биде посветен на малите детали исто колку и на стигнувањето до целта. Размислете што најмногу ви годи: шумски предели, отворени погледи или спокојна пауза по патот. Изберете означена патека соодветна на вашето искуство и на условите.',
          },
        ],
      },
      {
        heading: {
          en: 'Plan with care',
          mk: 'Планирајте внимателно',
        },
        paragraphs: [
          {
            en: 'Before setting out, check the weather, route information and local guidance. Leave your plans with someone, take suitable equipment and carry your litter home. For an organized activity, confirm the route and requirements with the provider; an illustration is inspiration, not a route map.',
            mk: 'Пред поаѓање, проверете ги временската прогноза, информациите за патеката и локалните упатства. Известете некого за вашите планови, понесете соодветна опрема и вратете го отпадот со себе. За организирана активност, потврдете ги рутата и условите со организаторот; илустрацијата е инспирација, а не карта на патеката.',
          },
        ],
      },
    ],
  },
];
