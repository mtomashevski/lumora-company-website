import type { NewsArticle } from '../types/news';
import { photos } from './experiences.ts';

// No owner-approved announcements were supplied. These undated examples are visibly
// labelled on the website; replace them with verified bilingual articles before publication as news.
export const newsArticles: NewsArticle[] = [
  {
    slug: 'a-moment-by-lake-ohrid',
    title: { en: 'A moment by Lake Ohrid', mk: 'Миг покрај Охридското Езеро' },
    excerpt: {
      en: 'An example travel journal about slowing down, looking around and leaving space for discovery.',
      mk: 'Пример за патепис за забавување на темпото, набљудување и оставање простор за откривање.',
    },
    category: { en: 'Travel journal', mk: 'Патепис' },
    demonstration: true,
    cover: photos.about,
    sections: [
      {
        heading: { en: 'Take time to look around', mk: 'Одвојте време за разгледување' },
        paragraphs: [
          {
            en: 'A lakeside view can be a reason to pause. This example journal imagines a quiet moment beside Lake Ohrid: noticing the water, the rooftops and the shape of the shore.',
            mk: 'Погледот кон езерото може да биде причина за пауза. Овој пример за патепис замислува мирен миг покрај Охридското Езеро: набљудување на водата, покривите и обликот на брегот.',
          },
        ],
      },
      {
        heading: { en: 'Make room for your own story', mk: 'Оставете простор за своја приказна' },
        paragraphs: [
          {
            en: 'A memorable journey does not need a packed schedule. A short walk, a photograph or a conversation can become the part you remember. This is illustrative editorial content, not a report of a Lumora trip or a promised itinerary.',
            mk: 'Патувањето што се памети не мора да има преполн распоред. Кратка прошетка, фотографија или разговор може да станат највпечатливиот дел. Ова е илустративна уредничка содржина, а не извештај од патување на Lumora или ветена програма.',
          },
        ],
      },
    ],
  },
  {
    slug: 'a-thoughtful-day-outdoors',
    title: { en: 'A thoughtful day outdoors', mk: 'Внимателно поминат ден во природа' },
    excerpt: {
      en: 'An example field note about enjoying landscapes with curiosity and care.',
      mk: 'Пример за белешка за уживање во пределите со љубопитност и внимание.',
    },
    category: { en: 'Outdoor notes', mk: 'Белешки од природата' },
    demonstration: true,
    cover: photos.inspiration,
    sections: [
      {
        heading: { en: 'Notice the small details', mk: 'Забележете ги малите детали' },
        paragraphs: [
          {
            en: 'Cliffs, reflections and changing light offer different ways to experience a landscape. This sample article uses a supplied photograph of Matka Canyon to show how a future editorial story could look.',
            mk: 'Карпите, одразите и променливата светлина нудат различни начини за доживување на пределот. Оваа пример-статија користи доставена фотографија од кањонот Матка за да прикаже како би изгледала идна уредничка приказна.',
          },
        ],
      },
      {
        heading: {
          en: 'Leave the landscape as you found it',
          mk: 'Оставете го пределот како што го затекнавте',
        },
        paragraphs: [
          {
            en: 'Respect local signs and paths, take your litter with you and give other visitors space. For an actual excursion, check the current activity listing and follow the instructions provided for that trip. This example does not announce an event or a new service.',
            mk: 'Почитувајте ги локалните ознаки и патеки, понесете го отпадот со себе и оставете простор за другите посетители. За вистински излет, проверете ја актуелната страница на активноста и следете ги упатствата за тоа патување. Овој пример не најавува настан или нова услуга.',
          },
        ],
      },
    ],
  },
];
