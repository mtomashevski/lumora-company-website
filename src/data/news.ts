import type { NewsArticle } from '../types/news';

// User-supplied AI artwork illustrates undated academic editorial examples, not business announcements.
export const newsArticles: NewsArticle[] = [
  {
    slug: 'a-thoughtful-day-outdoors',
    title: {
      en: 'Matka Canyon: between cliffs and water',
      mk: 'Кањонот Матка: меѓу карпите и водата',
    },
    excerpt: {
      en: 'An illustrated editorial example about the still water, dramatic cliffs and unhurried moments of Matka Canyon.',
      mk: 'Илустриран уреднички пример за мирната вода, впечатливите карпи и спокојните мигови во кањонот Матка.',
    },
    category: {
      en: 'Outdoor notes',
      mk: 'Белешки од природата',
    },
    demonstration: true,
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
            en: 'Tall cliffs and quiet water shape this imagined view of Matka Canyon. The illustration invites a slower look at reflections, trees and the path of a small boat, rather than a packed schedule.',
            mk: 'Високи карпи и мирна вода го обликуваат овој замислен поглед кон кањонот Матка. Илустрацијата повикува на спокојно набљудување на одразите, дрвјата и движењето на мал чамец, наместо на преполн распоред.',
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
            en: 'Respect local signs and paths, take your litter with you and give other visitors space. For a real excursion, check the current activity listing and follow its instructions. This AI-generated artwork is an artistic interpretation, not a photograph, a trip report or a promise of a particular view.',
            mk: 'Почитувајте ги локалните ознаки и патеки, понесете го отпадот со себе и оставете простор за другите посетители. За вистински излет, проверете ја актуелната страница на активноста и следете ги упатствата. Ова дело генерирано со ВИ е уметничка интерпретација, а не фотографија, извештај од патување или ветување за одреден поглед.',
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
      en: 'An illustrated editorial example about lakeside light, the silhouette of Kaneo and leaving space for discovery.',
      mk: 'Илустриран уреднички пример за езерската светлина, силуетата на Канео и оставањето простор за откривање.',
    },
    category: {
      en: 'Travel journal',
      mk: 'Патепис',
    },
    demonstration: true,
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
            en: 'A lakeside view can be a reason to pause. This editorial example imagines a quiet moment beside Lake Ohrid: noticing the water, the church silhouette and the changing evening light.',
            mk: 'Погледот кон езерото може да биде причина за пауза. Овој уреднички пример замислува мирен миг покрај Охридското Езеро: набљудување на водата, силуетата на црквата и променливата вечерна светлина.',
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
            en: 'A short walk, a photograph or a conversation can become the part of a journey you remember. The accompanying AI-generated illustration is an artistic interpretation of Ohrid, not a record of a Lumora trip or a promised itinerary.',
            mk: 'Кратка прошетка, фотографија или разговор може да станат највпечатливиот дел од патувањето. Придружната илустрација генерирана со ВИ е уметничка интерпретација на Охрид, а не запис од патување на Lumora или ветена програма.',
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
      en: 'An illustrated editorial example about the Stone Bridge, city silhouettes and seeing familiar streets with fresh curiosity.',
      mk: 'Илустриран уреднички пример за Камениот мост, градските силуети и гледањето на познатите улици со нова љубопитност.',
    },
    category: {
      en: 'City stories',
      mk: 'Градски приказни',
    },
    demonstration: true,
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
            en: 'Bridges, rooftops and river reflections give a city many different faces. This imagined view of Skopje brings the Stone Bridge and a fortress silhouette into one warm evening composition.',
            mk: 'Мостовите, покривите и одразите во реката му даваат на градот многу различни лица. Овој замислен поглед кон Скопје ги спојува Камениот мост и силуетата на тврдината во една топла вечерна композиција.',
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
            en: 'The details of a city are often found in everyday moments: a walk, a conversation or a pause beside the water. This AI-generated illustration combines landmarks creatively; it is not a geographically exact photograph or an announcement of a new Lumora service.',
            mk: 'Деталите на градот често се наоѓаат во секојдневните мигови: прошетка, разговор или пауза покрај водата. Оваа илустрација генерирана со ВИ креативно ги спојува знаменитостите; таа не е географски прецизна фотографија или најава за нова услуга на Lumora.',
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
      en: 'An illustrated editorial example about mountain horizons, forest paths and appreciating the outdoors without rushing.',
      mk: 'Илустриран уреднички пример за планинските хоризонти, шумските патеки и спокојното уживање во природата.',
    },
    category: {
      en: 'Nature journal',
      mk: 'Природен дневник',
    },
    demonstration: true,
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
            en: 'A mountain horizon can change the pace of a day. In this artistic scene, a rocky path leads past forest and water towards distant peaks. It is an imagined landscape inspired by Macedonian nature, not an identified trail or a named lake.',
            mk: 'Планинскиот хоризонт може да го промени ритамот на денот. Во оваа уметничка сцена, карпеста патека води покрај шума и вода кон далечни врвови. Тоа е замислен предел инспириран од македонската природа, а не означена патека или именувано езеро.',
          },
        ],
      },
      {
        heading: {
          en: 'Let curiosity travel with care',
          mk: 'Нека љубопитноста оди со внимание',
        },
        paragraphs: [
          {
            en: 'Enjoy outdoor places respectfully and follow local guidance. For an actual trip, confirm the route, conditions and activity details with its provider. The AI-generated illustration supports this editorial example; it does not document a Lumora event or establish a hiking route.',
            mk: 'Уживајте во природата со почит и следете ги локалните упатства. За вистинско патување, потврдете ги рутата, условите и деталите за активноста со организаторот. Илустрацијата генерирана со ВИ го придружува овој уреднички пример; таа не документира настан на Lumora и не утврдува планинарска рута.',
          },
        ],
      },
    ],
  },
];
