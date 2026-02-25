import { sl } from './utils'

const YANDEX_MAP_KEY = process.env.YANDEX_MAP
export const MAP_URL = `https://api-maps.yandex.ru/2.1/?lang=en&amp;apikey=${YANDEX_MAP_KEY}`
export const OPEN_WEATHER_KEY = process.env.OPENWEATHER
export const UNIT = '°C'
export const REQUEST_INTERVAL = 30 * (60 * 1000) // 30 minutes
export const LOADING_DELAY = 200 // ms
export const LOADING_TRANSITION_DELAY = 500 // ms
export const PORTAL_MODAL_DELAY = 2500 // 2.5s
export const CREATE_MAP_DELAY = 3000 // 3s
export const SPEED_DETECTION_DELAY = 20000 // 20s;
export const DEFAILT_CITY = "Tehran"
export const TO_FIXED = 2
export const els = {
  pModal: sl('.portal-model'),
  pModalC: sl('.portal-model .close'),
  pModelTxt: sl('.portal-model .text'),
  mOverlayB: sl('.map-overlay .bottom'),
  mOverlayC: sl('.map-overlay .cover'),
  fColor: sl('#favcolor'),
  lSvgP: sl('main header form.search .location-icon svg path'),
  lUpdate: sl('main .weather .map-overlay .content-wrapper .weather-data .info .last-update'),
  Winfo: sl('main .weather .map-overlay .content-wrapper .weather-data .info'),
  header: sl('header'),
  cList: sl('main header .city-list-wrapper'),
  weather: sl('main .weather'),
  pSettings: sl('.portal-settings'),
  sButton: sl('.setting-button'),
  sActionB1: sl('.portal-settings .action-wrapper button:nth-of-type(1)'),
  sActionB2: sl('.portal-settings .action-wrapper button:nth-of-type(2)'),
  main: sl('main'),
  video: sl('#video'),
  videoV: sl('#video video'),
  mOpacity: sl('#mapOpacity'),
  fScreen: sl('#fullScreenImage'),
  mOverlay: sl('main .weather .map-overlay'),
  copyright: sl('main .weather .bottom-overlay .image-copyright'),
  mOverlayTitle: sl('main .weather .map-overlay .content-wrapper h1 b'),
  mOverlaySpan: sl('main .weather .map-overlay .content-wrapper h1 span'),
  wSvgIcon: sl('main .weather .map-overlay .content-wrapper .weather-data .current-weather-icon div.svg-icon'),
  input: sl('main header form.search input'),
  wTemperatureV: sl('main .weather .map-overlay .content-wrapper .weather-data .temperature .value'),
  wTemperatureU: sl('main .weather .map-overlay .content-wrapper .weather-data .temperature .unit'),
  wFeelsT: sl('main .weather .map-overlay .content-wrapper .weather-data .feels_like .text'),
  wFeelsV: sl('main .weather .map-overlay .content-wrapper .weather-data .feels_like .value'),
  wFeelsU: sl('main .weather .map-overlay .content-wrapper .weather-data .feels_like .unit'),
  wWindT: sl('main .weather .map-overlay .content-wrapper .weather-data .wind-speed .text'),
  wWindV: sl('main .weather .map-overlay .content-wrapper .weather-data .wind-speed .value'),
  wCurrentI: sl('.map-overlay .content-wrapper .weather-data .current-weather-icon span'),
  wMaxV: sl('main .weather .map-overlay .content-wrapper .weather-data .temp_max .value'),
  wMaxV: sl('main .weather .map-overlay .content-wrapper .weather-data .temp_max .value'),
  wMaxU: sl('main .weather .map-overlay .content-wrapper .weather-data .temp_max .unit'),
  wMinV: sl('main .weather .map-overlay .content-wrapper .weather-data .temp_min .value'),
  wMinU: sl('main .weather .map-overlay .content-wrapper .weather-data .temp_min .unit'),
  wHumidityV: sl('main .weather .map-overlay .content-wrapper .weather-data .humidity .value'),
  dClockH: sl('.digital-clock .time-wrapper .hour'),
  dClockS: sl('.digital-clock .time-wrapper .second'),
  dClockM: sl('.digital-clock .time-wrapper .minutes'),
  usdt: sl('.usdt-price'),
  gold: sl('.gold-price'),
  usdtW: sl('.usdt-price-widget'),
  ISpeed: sl('.internet-speed'),
  FScreen: sl('main header button.full-screen'),
  Sreset: sl('.portal-settings .reset'),
  SSubmit: sl(".portal-settings .submit"),
  NewsC: sl(".news-container span"),
  animationD: sl('#animationDuration'),
}

export const CITY_HAVE_IMAGE = [
  {
    name: 'liverpool',
    id: 2644210,
    images: [
      {
        photographer: 'Neil Martin',
        link: 'https://unsplash.com/@anagoge'
      },
      {
        photographer: 'Fleur',
        link: 'https://unsplash.com/@yer_a_wizard'
      },
      {
        photographer: 'Phil Kiel',
        link: 'https://unsplash.com/@pk_drone'
      }
    ]
  },
  {
    name: 'ahvāz',
    id: 144448,
    images: [
      {
        photographer: 'Ashkan Forouzani',
        link: 'https://unsplash.com/@ashkfor121'
      },
      {
        photographer: 'ariyan Dv',
        link: 'https://unsplash.com/@ariyandv'
      }
    ]
  },
  {
    name: 'tehran',
    id: 112931,
    images: [
      {
        photographer: 'Amirreza Kimiyaei',
        link: 'https://unsplash.com/@amirrezakm'
      },
      {
        photographer: 'Amirreza Kimiyaei',
        link: 'https://unsplash.com/@amirrezakm'
      },
      {
        photographer: 'Amirreza Amouie',
        link: 'https://unsplash.com/@amuuu'
      },
      {
        photographer: 'Khashayar Kouchpeydeh',
        link: 'https://unsplash.com/@kouchpeydeh'
      },
      {
        photographer: 'fatemeh momtaz',
        link: 'https://unsplash.com/@fatemehhmomtazz'
      },
      {
        photographer: 'Omid Armin',
        link: 'https://unsplash.com/@omidarmin'
      }
    ]
  },
  {
    name: 'āmol',
    id: 143534,
    images: [
      {
        photographer: 'dash masoud',
        link: 'https://unsplash.com/@dashmasoud'
      }
    ]
  },
  {
    name: 'bābolsar',
    id: 142358,
    images: [
      {
        photographer: 'Mehdi MeSSrro',
        link: 'https://unsplash.com/@messrro'
      }
    ]
  },
  {
    name: 'rasht',
    id: 118743,
    images: [
      {
        photographer: 'Mostafa Yekrangi',
        link: 'https://unsplash.com/@mostafa'
      },
      {
        photographer: 'Ali Kokab',
        link: 'https://unsplash.com/@_alikokab_'
      }
    ]
  },
  {
    name: 'isfahan',
    id: 418863,
    images: [
      {
        photographer: 'Yasin Abbasi',
        link: 'https://unsplash.com/@yasinabbasi'
      },
      {
        photographer: 'mostafa meraji',
        link: 'https://unsplash.com/@mostafa_meraji'
      }
    ]
  },
  {
    name: 'yazd',
    id: 111822,
    images: [
      {
        photographer: 'Hasan Almasi',
        link: 'https://unsplash.com/@hasanalmasi'
      }
    ]
  },
  {
    name: 'amsterdam',
    id: 2759794,
    images: [
      {
        photographer: 'Azhar J',
        link: 'https://unsplash.com/@azhrjl'
      }
    ]
  },
  {
    name: 'tabriz',
    id: 113646,
    images: [
      {
        photographer: 'Mohammad Mohammadpour',
        link: 'https://unsplash.com/@m_mohammadpour'
      }
    ]
  },
  {
    name: 'sari',
    id: 116996,
    images: [
      {
        photographer: '',
        link: ''
      },
      {
        photographer: 'Danial soheyli',
        link: 'https://unsplash.com/@es1992'
      }
    ]
  },
  {
    name: 'Karaj',
    id: 128747,
    images: [
      {
        photographer: 'MHossein Hosseini',
        link: 'https://unsplash.com/@hosseiin'
      }
    ]
  },
  {
    name: 'Torin',
    id: 3165524,
    images: [
      {
        photographer: 'cristiano caligaris',
        link: 'https://unsplash.com/@cristianocaligaris'
      }
    ]
  },
  {
    name: 'London',
    id: 2643743,
    images: [
      {
        photographer: 'Benjamin Davies',
        link: 'https://unsplash.com/@bendavisual'
      }
    ]
  },
  {
    name: 'Dubai',
    id: 292223,
    images: [
      {
        photographer: 'ZQ Lee',
        link: 'https://unsplash.com/@zqlee'
      }
    ]
  },
  {
    name: 'Yerevan',
    id: 616052,
    images: [
      {
        photographer: 'Venyamin Koretskiy',
        link: 'https://unsplash.com/@bennjeck'
      },
      {
        photographer: 'Davit Simonyan',
        link: 'https://unsplash.com/@neodavit'
      }
    ]
  },
  {
    name: 'Tbilisi',
    id: 611717,
    images: [
      {
        photographer: 'Kent Tupas',
        link: 'https://unsplash.com/@zplits'
      }
    ]
  },
  {
    name: 'Batumi',
    id: 615532,
    images: [
      {
        photographer: 'Andrei Miranchuk',
        link: 'https://unsplash.com/@manuel_pirate'
      }
    ]
  },
  {
    name: 'Seattle',
    id: 5809844,
    images: [
      {
        photographer: 'Thom Milkovic',
        link: 'https://unsplash.com/@thommilkovic'
      }
    ]
  },
  {
    name: 'Abu Dhabi',
    id: 292968,
    images: [
      {
        photographer: 'Kevin JD',
        link: 'https://unsplash.com/@kevinjd123'
      }
    ]
  },
  {
    name: 'Cairo',
    id: 360630,
    images: [
      {
        photographer: 'Spencer Davis',
        link: 'https://unsplash.com/@spencerdavis'
      }
    ]
  },
  {
    name: 'Riyadh',
    id: 108410,
    images: [
      {
        photographer: 'ekrem osmanoglu',
        link: 'https://unsplash.com/@konevi'
      }
    ]
  },
  {
    name: 'Saint Petersburg',
    id: 498817,
    images: [
      {
        photographer: 'Hu Chen',
        link: 'https://unsplash.com/@huchenme'
      }
    ]
  },
  {
    name: 'New York',
    id: 5128581,
    images: [
      {
        photographer: 'Thomas Habr',
        link: 'https://unsplash.com/@thomashabr'
      }
    ]
  },
  {
    name: 'Washington D.C.',
    id: 4140963,
    images: [
      {
        photographer: 'Duane Lempke',
        link: ''
      }
    ]
  },
  {
    name: 'Strasbourg',
    id: 2973783,
    images: [
      {
        photographer: 'Patrick Robert Doyle',
        link: 'https://unsplash.com/@teapowered'
      }
    ]
  },
  {
    name: 'Santa Monica',
    id: 5393212,
    images: [
      {
        photographer: 'Matthew LeJune',
        link: 'https://unsplash.com/@matthewlejune'
      }
    ]
  },
  {
    name: 'Tokyo',
    id: [1850144, 1850147],
    images: [
      {
        photographer: 'Jezael Melgoza',
        link: 'https://unsplash.com/@jezar'
      }
    ]
  },
  {
    name: 'Paris',
    id: [2988507],
    images: [
      {
        photographer: 'Chris Karidis',
        link: 'https://unsplash.com/@chriskaridis'
      }
    ]
  },
  {
    name: 'Anzali Port',
    id: [141679],
    images: [
      {
        photographer: 'MohammadReza Jelveh',
        link: 'https://unsplash.com/@mrjelveh'
      },
      {
        photographer: 'sara moezzi',
        link: 'https://unsplash.com/@sara_macha'
      }
    ]
  },
    {
    name: 'Leipzig',
    id: [6548737],
    images: [
      {
        photographer: 'MediaEcke',
        link: 'https://unsplash.com/@mediaecke'
      },
    ]
  },
]
export const CITY_HAVE_VIDEO = [
  {
    name: 'liverpool',
    id: 2644210,
    videos: [
      {
        channel: 'Expedia',
        link: 'https://www.youtube.com/watch?v=ojrHLXj8GJA'
      }
    ]
  },
  {
    name: 'tehran',
    id: 112931,
    videos: [
      {
        channel: 'Exploropia',
        link: 'https://www.youtube.com/watch?v=7DkoPGGdKAA'
      },
      {
        channel: 'Exploropia',
        link: 'https://www.youtube.com/watch?v=7DkoPGGdKAA'
      }
    ]
  },
  {
    name: 'ahvāz',
    id: 144448,
    videos: [
      {
        channel: 'pooyanartwork',
        link: 'https://www.youtube.com/watch?v=wXGU-2-36xo'
      },
    ]
  },
  {
    name: 'arak',
    id: 143127,
    videos: [
      {
        channel: 'Exploropia',
        link: 'https://www.youtube.com/watch?v=7DkoPGGdKAA'
      },
      {
        channel: 'Exploropia',
        link: 'https://www.youtube.com/watch?v=7DkoPGGdKAA'
      }
    ]
  }
]