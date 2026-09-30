import type { Experience, LocationId, TravelImage } from '../types/experience';
import { localized as text } from '../i18n/types.ts';
const image = (
  folder: string,
  file: string,
  en: string,
  mk: string,
  position?: string,
): TravelImage => ({ src: `/images/experiences/${folder}/${file}`, alt: text(en, mk), position });
// These are supplied activity assets, kept in their original folders and formats.
const heritage = image(
  'macedonian-heritage',
  'image2.avif',
  'Matka Canyon with its lakeside monastery and rocky slopes',
  'Кањонот Матка со манастирот покрај езерото и карпестите падини',
);
const matka = image(
  'vodno-matka',
  'image1.avif',
  'A boat on the green water of Matka Canyon',
  'Чамец на зелената вода во кањонот Матка',
);
const ohrid = image(
  'skopje-ohrid-2-day',
  'image7.avif',
  'The Church of St. John at Kaneo above Lake Ohrid',
  'Црквата Свети Јован Канео над Охридското Езеро',
);
const lake = image(
  'lake-ohrid',
  'image2.avif',
  'Lake Ohrid and the surrounding hills framed by tree branches',
  'Охридското Езеро и околните ридови низ гранките на дрвјата',
);
const bitola = image(
  'ohrid-bitola-debar',
  'image13.avif',
  'Historic buildings along Širok Sokak in Bitola',
  'Историски градби на Широк Сокак во Битола',
);
const debar = image(
  'ohrid-bitola-debar',
  'image5.avif',
  'Debar Lake surrounded by green hills',
  'Дебарското Езеро опкружено со зелени ридови',
);
const skopje = image(
  'vodno-matka',
  'image9.avif',
  'Panoramic view of Skopje from Vodno',
  'Панорамски поглед на Скопје од Водно',
);
export const photos = { hero: heritage, inspiration: matka, about: ohrid };
const english = text('English', 'Англиски');
const meeting = text(
  'The Museum of the Macedonian Struggle for Independence in Skopje. Check the activity listing and booking instructions for the agreed meeting details.',
  'Музејот на македонската борба за самостојност во Скопје. Провери ги информациите за активноста и упатствата за резервација за договореното место на средба.',
);
export const experiences: Experience[] = [
  {
    id: 'macedonian-heritage',
    slug: 'macedonia-heritage-vodno-matka',
    title: text(
      'Macedonia Heritage, Vodno & Matka Canyon Experience',
      'Македонско наследство, Водно и кањонот Матка',
    ),
    destination: 'skopje',
    locations: ['skopje', 'vodno', 'matka'],
    category: 'culture-nature',
    categories: ['culture-nature'],
    duration: text('7 hours', '7 часа'),
    priceFrom: 20,
    currency: 'EUR',
    featured: true,
    sourceChecked: '2026-09-30',
    languages: english,
    getYourGuideUrl:
      'https://www.getyourguide.com/gorno-nerezi-l166380/see-skopje-feel-macedonia-discover-matka-t1460272/',
    shortDescription: text(
      'Panoramic views, Macedonian traditions and the quiet beauty of Matka Canyon.',
      'Панорамски погледи, македонски традиции и мирната убавина на кањонот Матка.',
    ),
    description: text(
      'Discover the landscapes and traditions around Skopje in one day. The public itinerary brings together a Vodno viewpoint, Saint Panteleimon in Gorno Nerezi, a traditional village and home, and time at Matka Canyon. Check the listing for optional visits and their costs.',
      'Откриј ги пределите и традициите околу Скопје во еден ден. Објавената програма ги поврзува видиковецот на Водно, Свети Пантелејмон во Горно Нерези, традиционално село и куќа, и кањонот Матка. Провери ги незадолжителните посети и нивните трошоци на страницата за активноста.',
    ),
    highlights: [
      text('Views over Skopje from Vodno', 'Поглед кон Скопје од Водно'),
      text('Macedonian village life and heritage', 'Македонски селски живот и наследство'),
      text('Scenic paths beside Matka Canyon', 'Живописни патеки покрај кањонот Матка'),
    ],
    itinerary: [
      {
        title: text('Vodno & Gorno Nerezi', 'Водно и Горно Нерези'),
        description: text(
          'Panoramic views and a visit to Saint Panteleimon.',
          'Панорамски погледи и посета на Свети Пантелејмон.',
        ),
      },
      {
        title: text('Macedonian traditions', 'Македонски традиции'),
        description: text(
          'Explore a traditional village, home and heritage exhibits.',
          'Истражи традиционално село, куќа и изложби за наследството.',
        ),
      },
      {
        title: text('Matka Canyon', 'Кањонот Матка'),
        description: text(
          'Walk beside the water; a boat ride is optional.',
          'Прошетка покрај водата; возењето со чамец е незадолжително.',
        ),
      },
    ],
    included: [
      text(
        'Local guide and heritage museum visit',
        'Локален водич и посета на музејот за наследство',
      ),
    ],
    notIncluded: [text('Optional Matka boat ride', 'Незадолжително возење со чамец на Матка')],
    meetingPoint: text(
      'The guide contacts guests the day before the activity to confirm meeting information. Check your booking instructions.',
      'Водичот ги контактира гостите еден ден пред активноста за да ги потврди деталите за средбата. Провери ги упатствата за резервација.',
    ),
    heroImage: heritage,
    gallery: [
      image(
        'macedonian-heritage',
        'image3.webp',
        'Kayakers beside the rocky cliffs at Matka',
        'Кајакари покрај карпите на Матка',
      ),
      image(
        'macedonian-heritage',
        'image5.avif',
        'Saint Panteleimon Church in Gorno Nerezi',
        'Црквата Свети Пантелејмон во Горно Нерези',
      ),
      image(
        'macedonian-heritage',
        'image4.avif',
        'Traditional stone buildings and craft displays',
        'Традиционални камени градби и занаетчиски изложби',
      ),
      image(
        'macedonian-heritage',
        'image1.webp',
        'Women wearing traditional Macedonian clothing',
        'Жени во традиционална македонска носија',
      ),
    ],
  },
  {
    id: 'vodno-matka',
    slug: 'vodno-to-matka-journey',
    title: text(
      'From Vodno to Matka - A Journey Through the Heart of Skopje',
      'Од Водно до Матка — патување низ срцето на Скопје',
    ),
    destination: 'skopje',
    locations: ['skopje', 'vodno', 'matka'],
    category: 'culture-nature',
    categories: ['culture-nature', 'nature-adventure'],
    duration: text('8 hours 30 minutes', '8 часа и 30 минути'),
    priceFrom: 140,
    currency: 'EUR',
    featured: true,
    sourceChecked: '2026-09-30',
    languages: english,
    getYourGuideUrl:
      'https://www.getyourguide.com/gorno-nerezi-l166380/from-vodno-to-matka-a-journey-through-the-heart-of-skopje-t1454429/',
    shortDescription: text(
      'Culture, village traditions and a canyon journey in the heart of the Skopje region.',
      'Култура, селски традиции и кањонска авантура во срцето на скопскиот регион.',
    ),
    description: text(
      'Explore Skopje’s surroundings through views from Vodno, Saint Panteleimon, and Macedonian village traditions. The experience combines heritage, traditional clothing, a craft workshop and lunch before continuing to Matka Canyon. Review the full booking details for the day’s arrangements.',
      'Истражи ја околината на Скопје преку погледите од Водно, Свети Пантелејмон и македонските селски традиции. Доживувањето ги поврзува наследството, народните носии, занаетчиската работилница и ручекот, а потоа продолжува до кањонот Матка. Провери ги сите детали за организацијата пред резервација.',
    ),
    highlights: [
      text('Vodno panoramas and Saint Panteleimon', 'Панорами од Водно и Свети Пантелејмон'),
      text('Traditional clothing and a craft workshop', 'Народни носии и занаетчиска работилница'),
      text('Village lunch and Matka scenery', 'Ручек во селото и пределите на Матка'),
    ],
    itinerary: [
      {
        title: text('Vodno & Saint Panteleimon', 'Водно и Свети Пантелејмон'),
        description: text(
          'Begin with city views and cultural heritage.',
          'Започни со градски погледи и културно наследство.',
        ),
      },
      {
        title: text('Village traditions', 'Селски традиции'),
        description: text(
          'Coffee, heritage displays, costumes, crafts and lunch.',
          'Кафе, изложби за наследството, носии, занаети и ручек.',
        ),
      },
      {
        title: text('Matka Canyon', 'Кањонот Матка'),
        description: text(
          'Continue to the canyon for waterside scenery.',
          'Продолжи до кањонот за погледи покрај водата.',
        ),
      },
    ],
    included: [
      text('Transport and local guide', 'Превоз и локален водич'),
      text(
        'Traditional coffee, craft workshop and lunch',
        'Традиционално кафе, занаетчиска работилница и ручек',
      ),
    ],
    meetingPoint: meeting,
    heroImage: matka,
    gallery: [
      image(
        'vodno-matka',
        'image3.webp',
        'Saint Panteleimon Church surrounded by trees',
        'Црквата Свети Пантелејмон опкружена со дрвја',
      ),
      image(
        'vodno-matka',
        'image7.avif',
        'Traditional village architecture and stone courtyard',
        'Традиционална селска архитектура и камен двор',
      ),
      image(
        'vodno-matka',
        'image2.avif',
        'Macedonian traditional clothing displayed during the activity',
        'Македонски народни носии прикажани во активноста',
      ),
      skopje,
    ],
  },
  {
    id: 'ohrid-bitola-debar',
    slug: 'three-day-ohrid-bitola-debar',
    title: text(
      '3-Day Ohrid, Bitola & Debar Luxury Macedonia Tour',
      'Тридневно луксузно патување: Охрид, Битола и Дебар',
    ),
    destination: 'ohrid',
    locations: ['ohrid', 'lake-ohrid', 'bitola', 'debar'],
    category: 'multi-day',
    categories: ['multi-day', 'culture-heritage'],
    duration: text('3 days', '3 дена'),
    priceFrom: 286,
    currency: 'EUR',
    featured: true,
    sourceChecked: '2026-09-30',
    getYourGuideUrl:
      'https://www.getyourguide.com/ohrid-l2416/3-day-ohrid-bitola-debar-luxury-macedonia-tour-t1464351/',
    shortDescription: text(
      'Three days connecting lakeside heritage, mountain landscapes and Bitola’s city streets.',
      'Три дена што ги поврзуваат езерското наследство, планинските предели и улиците на Битола.',
    ),
    description: text(
      'Discover Ohrid, Bitola and the Debar region on a three-day journey. Highlights include Ohrid’s old town, the Bay of Bones, Bigorski Monastery, Heraclea and Širok Sokak. The listing includes two nights in Ohrid; sunset boat and Galičica activities are optional.',
      'Откриј ги Охрид, Битола и дебарскиот регион на тридневно патување. Меѓу истакнатите места се стариот град на Охрид, Заливот на коските, Бигорскиот манастир, Хераклеја и Широк Сокак. Понудата вклучува две ноќевања во Охрид; активностите со чамец на зајдисонце и на Галичица се незадолжителни.',
    ),
    highlights: [
      text('Ohrid old town and the Bay of Bones', 'Стариот град на Охрид и Заливот на коските'),
      text('Bigorski Monastery and the Debar region', 'Бигорскиот манастир и дебарскиот регион'),
      text('Heraclea and Bitola’s Širok Sokak', 'Хераклеја и битолскиот Широк Сокак'),
    ],
    included: [
      text(
        'Transport throughout the tour and local guide',
        'Превоз за време на патувањето и локален водич',
      ),
      text('Two nights’ accommodation in Ohrid', 'Две ноќевања во Охрид'),
      text(
        'Guided cultural visits listed on GetYourGuide',
        'Културни посети со водич наведени на GetYourGuide',
      ),
    ],
    meetingPoint: meeting,
    heroImage: image(
      'ohrid-bitola-debar',
      'image1.avif',
      'St. John at Kaneo and Lake Ohrid at dusk',
      'Свети Јован Канео и Охридското Езеро во самрак',
    ),
    gallery: [
      debar,
      image(
        'ohrid-bitola-debar',
        'image6.avif',
        'Bigorski Monastery above a mountain valley',
        'Бигорскиот манастир над планинска долина',
      ),
      image(
        'ohrid-bitola-debar',
        'image2.avif',
        'The Bay of Bones reconstruction on Lake Ohrid',
        'Реконструкцијата на Заливот на коските на Охридското Езеро',
      ),
      bitola,
      image(
        'ohrid-bitola-debar',
        'image12.avif',
        'Ancient stone reliefs at Heraclea',
        'Антички камени релјефи во Хераклеја',
      ),
    ],
  },
  {
    id: 'skopje-ohrid-2-day',
    slug: 'two-day-ohrid-boat-hotel',
    title: text(
      'From Skopje: 2-Day Ohrid Tour with Boat Ride & Hotel Stay',
      'Од Скопје: дводневно патување во Охрид со чамец и хотел',
    ),
    destination: 'ohrid',
    locations: ['skopje', 'ohrid', 'lake-ohrid'],
    category: 'multi-day',
    categories: ['multi-day', 'culture-heritage'],
    duration: text('2 days', '2 дена'),
    priceFrom: 184,
    currency: 'EUR',
    featured: false,
    sourceChecked: '2026-09-30',
    getYourGuideUrl:
      'https://www.getyourguide.com/ohrid-l2416/from-skopje-2-day-ohrid-tour-with-boat-ride-hotel-stay-t1464555/',
    shortDescription: text(
      'Take more time for Ohrid’s old town, the lakeshore and a stay by the water.',
      'Одвој повеќе време за стариот град на Охрид, езерскиот брег и престој покрај водата.',
    ),
    description: text(
      'Travel from Skopje for two days in Ohrid, with hotel accommodation and a guide. Explore the old town, enjoy the lakeside and discover the Bay of Bones and Saint Naum. The activity features a boat ride; check the current listing for the full arrangements and any additional costs.',
      'Патувај од Скопје за два дена во Охрид, со хотелско сместување и водич. Истражи го стариот град, уживај покрај езерото и откриј ги Заливот на коските и Свети Наум. Активноста опфаќа возење со чамец; провери ја актуелната понуда за сите услови и дополнителни трошоци.',
    ),
    highlights: [
      text('Guided discovery of Ohrid’s old town', 'Откривање на стариот град на Охрид со водич'),
      text('Bay of Bones and Saint Naum', 'Заливот на коските и Свети Наум'),
      text('A lakeside journey with an overnight stay', 'Езерско патување со ноќевање'),
    ],
    included: [
      text('Return transport from Skopje', 'Повратен превоз од Скопје'),
      text('Hotel accommodation in Ohrid', 'Хотелско сместување во Охрид'),
      text('Accompanying guide and walking tours', 'Водич и пешачки разгледувања'),
    ],
    heroImage: ohrid,
    gallery: [
      image(
        'skopje-ohrid-2-day',
        'image1.avif',
        'Ohrid rooftops and the lakeside harbor',
        'Покривите на Охрид и езерското пристаниште',
      ),
      image(
        'skopje-ohrid-2-day',
        'image3.avif',
        'Bay of Bones beside the lake',
        'Заливот на коските покрај езерото',
      ),
      image(
        'skopje-ohrid-2-day',
        'image6.avif',
        'Ohrid’s waterfront and townscape',
        'Охридскиот брег и градскиот пејзаж',
      ),
      image(
        'skopje-ohrid-2-day',
        'image8.avif',
        'A peacock in the Saint Naum monastery grounds',
        'Паун во дворот на манастирот Свети Наум',
      ),
    ],
  },
  {
    id: 'lake-ohrid',
    slug: 'lake-ohrid-legends-from-skopje',
    title: text(
      'Lake Ohrid: Legends, Love & Hidden Treasures from Skopje',
      'Охридско Езеро: легенди, љубов и скриени богатства од Скопје',
    ),
    destination: 'ohrid',
    locations: ['skopje', 'ohrid', 'lake-ohrid'],
    category: 'culture-heritage',
    categories: ['culture-heritage'],
    duration: text('13 hours', '13 часа'),
    priceFrom: 56,
    currency: 'EUR',
    featured: false,
    sourceChecked: '2026-09-30',
    getYourGuideUrl:
      'https://www.getyourguide.com/ohrid-l2416/lake-ohrid-legends-love-hidden-treasures-from-skopje-t1469969/',
    shortDescription: text(
      'A full day of lake views, old-town stories and Ohrid’s cultural treasures.',
      'Цел ден со езерски погледи, приказни од стариот град и културните богатства на Охрид.',
    ),
    description: text(
      'Set out from Skopje to discover Lake Ohrid’s landscapes and stories. The experience visits the Bay of Bones, the old town, Plaošnik and Kaneo, with time for local flavors and the waterfront. Boat experiences and entrance costs should be checked in the current booking details.',
      'Тргни од Скопје за да ги откриеш пределите и приказните на Охридското Езеро. Доживувањето ги опфаќа Заливот на коските, стариот град, Плаошник и Канео, со време за локални вкусови и езерскиот брег. Провери ги условите за возење со чамец и влезниците во актуелните детали за резервација.',
    ),
    highlights: [
      text('Bay of Bones and Ohrid’s old town', 'Заливот на коските и стариот град на Охрид'),
      text('Plaošnik and the Church of St. John at Kaneo', 'Плаошник и црквата Свети Јован Канео'),
      text('Local flavors and lakeside time', 'Локални вкусови и време покрај езерото'),
    ],
    heroImage: lake,
    gallery: [
      image(
        'lake-ohrid',
        'image1.avif',
        'A quiet wooden pier on Lake Ohrid',
        'Мирно дрвено пристаниште на Охридското Езеро',
      ),
      image(
        'lake-ohrid',
        'image3.avif',
        'Wooden houses at the Bay of Bones',
        'Дрвени куќи во Заливот на коските',
      ),
      image(
        'lake-ohrid',
        'image4.avif',
        'Lake Ohrid and the Bay of Bones from above',
        'Охридското Езеро и Заливот на коските од височина',
      ),
    ],
  },
];
const locations: Record<LocationId, { name: ReturnType<typeof text>; image: TravelImage }> = {
  skopje: { name: text('Skopje', 'Скопје'), image: skopje },
  vodno: { name: text('Vodno', 'Водно'), image: skopje },
  matka: { name: text('Matka Canyon', 'Кањонот Матка'), image: matka },
  ohrid: { name: text('Ohrid', 'Охрид'), image: ohrid },
  'lake-ohrid': { name: text('Lake Ohrid', 'Охридско Езеро'), image: lake },
  bitola: { name: text('Bitola', 'Битола'), image: bitola },
  debar: { name: text('Debar', 'Дебар'), image: debar },
};
// A location appears only if it belongs to the real catalog. Stable IDs keep filters language-independent.
export const destinations = Object.entries(locations)
  .filter(([id]) => experiences.some((e) => e.locations.includes(id as LocationId)))
  .map(([id, location]) => ({
    id: id as LocationId,
    ...location,
    count: experiences.filter((e) => e.locations.includes(id as LocationId)).length,
  }));
export const destinationName = (id: LocationId) => locations[id].name;
export const categories = [...new Set(experiences.flatMap((e) => e.categories))];
