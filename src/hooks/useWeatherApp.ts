import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, KeyboardEvent, RefObject } from 'react'
import { translate } from '../lib/translate'
import {
  NumbersToPersian,
  debounce,
  checkPersianCharacters,
  createJsFile,
  checkExistJsFile,
  randomIntFromInterval,
  InitiateSpeedDetection,
  MeasureConnectionSpeed,
  timeAgo,
  arrayMove,
  dynamicTranslateKeyframe,
  updateTime,
  formatNumber,
  assetUrl
} from '../lib/utils'
import { CITY_HAVE_IMAGE, CITY_HAVE_VIDEO } from '../lib/cities'
import { playHourChime } from '../lib/chime'
import {
  CREATE_MAP_DELAY,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_CITY,
  DEFAULT_COLOR,
  DEFAULT_OPACITY,
  LOADING_DELAY,
  MAP_URL,
  MARKET_REFRESH_INTERVAL,
  OPEN_WEATHER_KEY,
  PORTAL_MODAL_DELAY,
  REQUEST_INTERVAL,
  SPEED_DETECTION_DELAY
} from '../lib/constants'
import { cityFromStorage, parseHistory } from '../lib/storage'
import { applyTheme, clearBodyBlur, setBodyBlurred, setBodyLoaded, setBodyLoading, setBodyRtl } from '../lib/theme'
import type {
  ClockState,
  Lang,
  OpenWeatherResponse,
  PortalModalState,
  PricesState,
  SettingsLabels,
  WeatherSnapshot
} from '../lib/types'

function cityHasImage(id: number): boolean {
  return CITY_HAVE_IMAGE.some((item) => (typeof item.id === 'number' ? item.id === id : item.id.includes(id)))
}

function resolveCityName(city: string): string {
  try {
    const parsed: unknown = JSON.parse(city)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return String(parsed[parsed.length - 1])
    }
    return city
  } catch {
    return city
  }
}

export function useWeatherApp() {
  const [mainVisible, setMainVisible] = useState(false)
  const [headerDir, setHeaderDir] = useState<'left' | 'right'>('left')
  const [headerVisible, setHeaderVisible] = useState(true)
  const [cityListActive, setCityListActive] = useState(false)
  const [history, setHistory] = useState(() => parseHistory(localStorage.getItem('last_search')))
  const [inputValue, setInputValue] = useState('')
  const [placeholder, setPlaceholder] = useState(translate.en.TypeCity)
  const [color, setColor] = useState(() => localStorage.getItem('color') || DEFAULT_COLOR)
  const [mapOpacity, setMapOpacity] = useState(() => +(localStorage.getItem('opacity') || DEFAULT_OPACITY))
  const [animationDuration, setAnimationDuration] = useState(
    () => +(localStorage.getItem('animation-duration') || DEFAULT_ANIMATION_DURATION)
  )
  const [fullScreenImage, setFullScreenImage] = useState(() => localStorage.getItem('fsi') === 'true')
  const [simpleMode, setSimpleMode] = useState(false)
  const [clockSound, setClockSound] = useState(() => localStorage.getItem('clock_sound') === 'true')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [portalModal, setPortalModal] = useState<PortalModalState>({
    active: false,
    text: ''
  })
  const [blurred, setBlurred] = useState(false)
  const [mapOverlayInterval, setMapOverlayInterval] = useState(false)
  const [showMapOverlayBottom, setShowMapOverlayBottom] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [weatherBg, setWeatherBg] = useState<string | null>(null)
  const [weatherOpacity, setWeatherOpacity] = useState(1)
  const [weatherStyle, setWeatherStyle] = useState<CSSProperties>({})
  const [cityTitle, setCityTitle] = useState('')
  const [flagSrc, setFlagSrc] = useState<string | null>(null)
  const [iconSrc, setIconSrc] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null)
  const [lastUpdateLabel, setLastUpdateLabel] = useState('')
  const [clock, setClock] = useState<ClockState>({
    hour: '',
    second: '',
    midday: '',
    date: ''
  })
  const [news, setNews] = useState('')
  const [newsTransform, setNewsTransform] = useState('')
  const [prices, setPrices] = useState<PricesState>({
    usdt: '-',
    btc: '-',
    gold: '-'
  })
  const [settingsLabels, setSettingsLabels] = useState<SettingsLabels>({
    reset: 'Reset',
    submit: 'Submit'
  })
  const [mainBlur, setMainBlur] = useState(false)

  const lastUpdateRef = useRef(new Date())
  const cacheDataRef = useRef<{ lat: number; lon: number }>({
    lat: 53.4106,
    lon: -2.9779
  })
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<YMapsMap | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const speedRef = useRef<HTMLSpanElement | null>(null)
  const settingsRef = useRef<HTMLDivElement | null>(null)
  const settingsBtnRef = useRef<HTMLButtonElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const blurRef = useRef(false)
  const simpleModeRef = useRef(false)
  const clockSoundRef = useRef(clockSound)
  const lastChimeKeyRef = useRef('')
  const searchWeatherRef = useRef<(city: string, interval: boolean) => void>(() => {})

  useEffect(() => {
    blurRef.current = blurred
  }, [blurred])

  useEffect(() => {
    clockSoundRef.current = clockSound
  }, [clockSound])

  const markLoaded = useCallback((delay = true) => {
    setMainVisible(true)
    const finish = () => {
      setBlurred(false)
      setBodyLoaded()
    }
    if (delay) setTimeout(finish, LOADING_DELAY)
    else finish()
  }, [])

  const markLoading = useCallback(() => {
    setBlurred(true)
    setBodyLoading()
  }, [])

  const showPortalModal = useCallback((text: string) => {
    setBlurred(true)
    setBodyBlurred()
    setPortalModal({ active: true, text })
    setTimeout(() => {
      setPortalModal({ active: false, text: '' })
      clearBodyBlur()
      setBlurred(false)
    }, PORTAL_MODAL_DELAY)
  }, [])

  const closePortalModal = useCallback(() => {
    clearBodyBlur()
    setPortalModal({ active: false, text: '' })
    setBlurred(false)
  }, [])

  const clearMap = useCallback(() => {
    if (mapRef.current) mapRef.current.innerHTML = ''
    mapInstanceRef.current = null
  }, [])

  const createMap = useCallback(
    (lat?: number, lon?: number) => {
      clearMap()
      if (!checkExistJsFile('yandex')) createJsFile(MAP_URL)

      setTimeout(() => {
        try {
          window.ymaps.ready(() => {
            mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
              center: lat && lon ? [lat, lon] : [cacheDataRef.current.lat, cacheDataRef.current.lon],
              zoom: 13,
              controls: []
            })
            markLoaded()
          })
        } catch {
          clearMap()
          markLoaded()
          const isPersian = checkPersianCharacters(cityFromStorage(localStorage.getItem('last_search') || DEFAULT_CITY))
          showPortalModal(isPersian ? translate.fa.ErrorLoadMap : translate.en.ErrorLoadMap)
        }
      }, CREATE_MAP_DELAY)
    },
    [clearMap, markLoaded, showPortalModal]
  )

  const updateWeatherDisplay = useCallback((result: OpenWeatherResponse, isPersian: boolean) => {
    const main = result.main
    const wind = result.wind
    const weather0 = result.weather?.[0]
    if (!main || !wind || !weather0) return

    setWeather({
      temp: main.temp,
      feels: main.feels_like,
      wind: wind.speed,
      description: weather0.description,
      max: main.temp_max,
      min: main.temp_min,
      humidity: main.humidity,
      isPersian
    })
  }, [])

  const setupVideoBackground = useCallback((cityId: number, cityVideoData: (typeof CITY_HAVE_VIDEO)[number]) => {
    setShowVideo(true)
    const videoCount = cityVideoData.videos?.length || 1
    const randomNumber = randomIntFromInterval(0, cityVideoData.videos?.length) || 1
    const key = `last_video_index_${cityId}`
    let index = parseInt(localStorage.getItem(key) || '0', 10)
    index = (index + 1) % videoCount
    localStorage.setItem(key, String(index))
    setVideoSrc(assetUrl(`static/videos/${cityId}-${randomNumber}.mp4`))
  }, [])

  const updateSearchHistory = useCallback((cityName: string) => {
    setHistory((prev: string[]) => {
      let next = [...prev]
      if (next.includes(cityName)) {
        arrayMove(next, next.indexOf(cityName), next.length - 1)
      } else {
        if (next.length > 5) next = next.slice(1)
        next = [...next, cityName]
      }
      localStorage.setItem('last_search', JSON.stringify(next))
      return next
    })
  }, [])

  const computeUI = useCallback(
    (result: OpenWeatherResponse, city: string, interval: boolean) => {
      const isPersian = checkPersianCharacters(city)
      const cityVideo = CITY_HAVE_VIDEO.find((item) => item.id === result.id)

      if (cityVideo) {
        setupVideoBackground(result.id!, cityVideo)
        clearMap()
        setShowMapOverlayBottom(false)
      } else {
        setShowVideo(false)
        setVideoSrc(null)
        setShowMapOverlayBottom(true)
      }

      setMapOverlayInterval(false)
      lastUpdateRef.current = new Date()

      if (!interval) {
        if (result && city && !result.message) {
          setCityTitle(isPersian ? city : (result.name ?? ''))

          if (result.coord?.lat) {
            const hasVideo = CITY_HAVE_VIDEO.some((i) => i.id === result.id)
            if (hasVideo) {
              clearMap()
              setShowMapOverlayBottom(false)
              markLoaded()
            } else if (!cityHasImage(result.id!)) {
              cacheDataRef.current = {
                lat: result.coord.lat,
                lon: result.coord.lon
              }
              setShowMapOverlayBottom(true)
              setWeatherBg(null)
              createMap(result.coord.lat, result.coord.lon)
            } else {
              const cityImageData = CITY_HAVE_IMAGE.find((item) =>
                typeof item.id === 'number' ? item.id === result.id : item.id.includes(result.id!)
              )
              const imageCount = cityImageData?.images?.length
              const randomIndex = randomIntFromInterval(0, imageCount !== undefined ? imageCount - 1 : Number.NaN) || 0
              const imageId = Array.isArray(cityImageData?.id) ? cityImageData.id[0] : cityImageData?.id
              setWeatherBg(assetUrl(`static/image/${imageId}-${randomIndex + 1}.jpg`))
              setShowMapOverlayBottom(true)
              clearMap()
              markLoaded()
            }
          }

          if (result.sys?.country && result.weather?.[0]) {
            setFlagSrc(assetUrl(`static/flags/${result.sys.country.toLowerCase()}.svg`))
            setIconSrc(assetUrl(`static/icons/openweathermap/${result.weather[0].icon}.svg`))
          }

          updateSearchHistory(isPersian ? city : (result.name ?? ''))
          updateWeatherDisplay(result, isPersian)
          localStorage.setItem('last_search_id', String(result.id))
          setTimeout(() => setMapOverlayInterval(true), 250)
        } else if (result?.message && city) {
          markLoaded()
          showPortalModal(isPersian ? translate.fa.CityNotFound : translate.en.CityNotFound)
          setTimeout(() => {
            searchWeatherRef.current(localStorage.getItem('last_search') || DEFAULT_CITY, false)
          }, 2500)
        }
      } else if (result?.main) {
        updateWeatherDisplay(result, isPersian)
      }
    },
    [clearMap, createMap, markLoaded, setupVideoBackground, showPortalModal, updateSearchHistory, updateWeatherDisplay]
  )

  const searchWeather = useCallback(
    (city: string, interval: boolean) => {
      const cityNameParam = resolveCityName(city)
      const isPersian = checkPersianCharacters(cityNameParam)
      const lang: Lang = isPersian ? 'fa' : 'en'

      if (!interval) {
        const nextColor = localStorage.getItem('color') || DEFAULT_COLOR
        setColor(nextColor)
        applyTheme(nextColor)
        setMapOpacity(+(localStorage.getItem('opacity') || DEFAULT_OPACITY))
        setAnimationDuration(+(localStorage.getItem('animation-duration') || DEFAULT_ANIMATION_DURATION))

        setBodyRtl(isPersian)
        if (isPersian) {
          setPlaceholder('اسم شهر را وارد کنید و Enter بزنید.')
          setSettingsLabels({ reset: 'تنظیم مجدد', submit: 'ذخیره' })
        } else {
          setPlaceholder('type City and hit Enter')
          setSettingsLabels({ reset: 'Reset', submit: 'Submit' })
        }
      }

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lang=${lang}&q=${cityNameParam}&APPID=${OPEN_WEATHER_KEY}&units=metric`
      )
        .then((res) => res.json() as Promise<OpenWeatherResponse>)
        .then((result) => computeUI(result, cityNameParam, interval))
    },
    [computeUI]
  )

  useEffect(() => {
    searchWeatherRef.current = searchWeather
  }, [searchWeather])

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('https://htmliha.ir/get/')
      const data = (await res.json()) as {
        data?: Array<{ source: string; title: string }>
      }
      if (!data?.data) return
      const newsText = data.data.map((item) => `${item.source}: ${item.title}`).join('  \u0020   |    \u0020  ')
      setNews(newsText)
      const newsLength = newsText.length * 3.41
      setNewsTransform(`translate3d(-${newsLength}px, 0px, 0px)`)
      dynamicTranslateKeyframe('news', `-${newsLength}px, 0px, 0px`, `${newsLength}px, 0px, 0px`)
    } catch (error) {
      console.error('Error fetching news:', error)
    }
  }, [])

  const fetchMarketPrices = useCallback(async () => {
    const isFa = checkPersianCharacters(cityFromStorage(localStorage.getItem('last_search')))
    try {
      const res = await fetch('https://apiv2.nobitex.ir/market/stats?srcCurrency=usdt,btc&dstCurrency=rls,usdt')
      const data = (await res.json()) as {
        stats?: Record<string, { latest: number }>
      }
      if (!data?.stats?.['usdt-rls']) return
      setPrices((p: PricesState) => ({
        ...p,
        usdt: formatNumber(Math.round(data.stats!['usdt-rls'].latest / 10)),
        btc: formatNumber(data.stats!['btc-usdt'].latest)
      }))
    } catch {
      setPrices((p: PricesState) => ({ ...p, usdt: isFa ? 'خطا' : 'error' }))
    }
  }, [])

  const fetchGoldPrices = useCallback(async () => {
    const isFa = checkPersianCharacters(cityFromStorage(localStorage.getItem('last_search')))
    const setGoldError = () => setPrices((p: PricesState) => ({ ...p, gold: isFa ? 'خطا' : 'error' }))

    try {
      const res = await fetch('https://azard.net/gold/')
      const data = (await res.json()) as { average?: number }
      if (data?.average) {
        setPrices((p: PricesState) => ({
          ...p,
          gold: formatNumber(data.average!)
        }))
        return
      }
      setGoldError()
    } catch {
      try {
        const res2 = await fetch('https://api.wallgold.ir/api/v1/price?symbol=GLD_18C_750TMN&side=buy')
        const data2 = (await res2.json()) as {
          result?: { price?: number }
        }
        if (data2?.result?.price) {
          setPrices((p: PricesState) => ({
            ...p,
            gold: formatNumber(data2.result!.price!)
          }))
        } else {
          setGoldError()
        }
      } catch {
        setGoldError()
      }
    }
  }, [])

  useEffect(() => {
    applyTheme(color)
    setTimeout(() => InitiateSpeedDetection(speedRef.current), 400)
    searchWeather(localStorage.getItem('last_search') || DEFAULT_CITY, false)
    fetchMarketPrices()
    fetchGoldPrices()
    fetchNews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const weatherTimer = setInterval(() => {
      searchWeatherRef.current(localStorage.getItem('last_search') || DEFAULT_CITY, true)
    }, REQUEST_INTERVAL)

    const speedTimer = setInterval(() => {
      MeasureConnectionSpeed(speedRef.current)
    }, SPEED_DETECTION_DELAY)

    const marketTimer = setInterval(() => {
      fetchMarketPrices()
      fetchGoldPrices()
      fetchNews()
    }, MARKET_REFRESH_INTERVAL)

    const clockTimer = setInterval(() => {
      const cityName = cityFromStorage(localStorage.getItem('last_search') || DEFAULT_CITY)
      const isPersian = checkPersianCharacters(cityName)
      const now = new Date()
      const midday = now.getHours() >= 12 ? 'PM' : 'AM'
      const hour12 = updateTime(now.getHours() % 12 || 12)
      const minStr = updateTime(now.getMinutes())
      const secStr = updateTime(now.getSeconds())

      if (
        clockSoundRef.current &&
        now.getMinutes() === 0 &&
        now.getSeconds() === 0
      ) {
        const chimeKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`
        if (lastChimeKeyRef.current !== chimeKey) {
          lastChimeKeyRef.current = chimeKey
          playHourChime()
        }
      }

      setClock({
        hour: `${isPersian ? NumbersToPersian(hour12) : hour12}:${isPersian ? NumbersToPersian(minStr) : minStr}`,
        second: `:${isPersian ? NumbersToPersian(secStr) : secStr}`,
        midday,
        date: ` ${now.toLocaleDateString('fa-ir', {
          weekday: 'long',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        })} `
      })
    }, 1000)

    return () => {
      clearInterval(weatherTimer)
      clearInterval(speedTimer)
      clearInterval(marketTimer)
      clearInterval(clockTimer)
    }
  }, [fetchGoldPrices, fetchMarketPrices, fetchNews])

  useEffect(() => {
    if (!videoRef.current || !videoSrc) return
    videoRef.current.load()
    videoRef.current.play().catch(() => {})
  }, [videoSrc])

  const handleColorChange = useMemo(
    () =>
      debounce((value: string) => {
        setColor(value)
        applyTheme(value)
        localStorage.setItem('color', value)
      }, 40),
    []
  )

  const handleOpacityChange = useMemo(
    () =>
      debounce((value: string) => {
        setMapOpacity(+value)
        localStorage.setItem('opacity', value)
      }, 40),
    []
  )

  const handleAnimationChange = useMemo(
    () =>
      debounce((value: string) => {
        setAnimationDuration(+value)
        localStorage.setItem('animation-duration', value)
      }, 40),
    []
  )

  useEffect(() => {
    const onWindowClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        settingsRef.current &&
        !settingsRef.current.contains(target) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(target)
      ) {
        setMainBlur(false)
        setSettingsOpen(false)
      }
    }

    const onFullScreenChange = () => {
      if (document.fullscreenElement) return

      if (simpleModeRef.current) {
        simpleModeRef.current = false
        setSimpleMode(false)
        document.body.classList.remove('simple-mode-active')
        return
      }

      setHeaderVisible(true)
      setShowMapOverlayBottom(true)
      setWeatherStyle({
        marginTop: '10px',
        width: '80vw',
        height: 'calc(80vh + 40px)'
      })
      const lastId = +(localStorage.getItem('last_search_id') || 0)
      if (!cityHasImage(lastId)) createMap()
    }

    window.addEventListener('click', onWindowClick)
    document.addEventListener('fullscreenchange', onFullScreenChange)
    return () => {
      window.removeEventListener('click', onWindowClick)
      document.removeEventListener('fullscreenchange', onFullScreenChange)
    }
  }, [createMap])

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key, code } = event
    const ignoreKeys = ['Backspace', 'Control', 'Alt', 'Shift', 'CapsLock', 'Tab', 'Enter']

    if (!ignoreKeys.includes(key) && code !== 'Space') {
      const isPersian = checkPersianCharacters(key)
      setHeaderDir(isPersian ? 'right' : 'left')
      setPlaceholder(isPersian ? translate.fa.TypeCity : translate.en.TypeCity)
    }

    if (key !== 'Enter') return
    event.preventDefault()
    setCityListActive(false)
    inputRef.current?.blur()
    if (blurRef.current) return

    const city = inputValue.trim()
    if (city.length > 1 && city.length < 22) {
      markLoading()
      setTimeout(() => searchWeather(city, false), 120)
      setTimeout(() => setWeatherOpacity(1), LOADING_DELAY)
    } else {
      showPortalModal('invalid city')
    }
  }

  const onHistorySelect = (city: string) => {
    markLoading()
    setInputValue(city)
    searchWeather(city, false)
  }

  const onOpenSettings = () => {
    setSettingsOpen(true)
    setMainBlur(true)
    setFullScreenImage(localStorage.getItem('fsi') === 'true')
    setMapOpacity(+(localStorage.getItem('opacity') || DEFAULT_OPACITY))
    setAnimationDuration(+(localStorage.getItem('animation-duration') || 160))
  }

  const onFullscreen = () => {
    setHeaderVisible(false)
    if (localStorage.getItem('fsi') === 'true') {
      setShowMapOverlayBottom(false)
      setWeatherStyle({
        marginTop: '0px',
        width: '100vw',
        height: '100vh'
      })
    } else {
      setWeatherStyle({
        width: 'calc(100vw - 160px)',
        height: 'calc(100vh - 110px)'
      })
    }
    document.documentElement.requestFullscreen()
  }

  const exitSimpleMode = useCallback(() => {
    simpleModeRef.current = false
    setSimpleMode(false)
    document.body.classList.remove('simple-mode-active')
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  const enterSimpleMode = useCallback(() => {
    setSettingsOpen(false)
    setMainBlur(false)
    simpleModeRef.current = true
    setSimpleMode(true)
    document.body.classList.add('simple-mode-active')
    document.documentElement.requestFullscreen().catch(() => {})
  }, [])

  const onSimpleModeChange = (checked: boolean) => {
    if (checked) enterSimpleMode()
    else exitSimpleMode()
  }

  const onSettingsReset = () => {
    setColor(DEFAULT_COLOR)
    applyTheme(DEFAULT_COLOR)
    setMapOpacity(DEFAULT_OPACITY)
    setAnimationDuration(160)
    setMainBlur(false)
    setSettingsOpen(false)
    setFullScreenImage(false)
    setClockSound(false)
    localStorage.setItem('color', DEFAULT_COLOR)
    localStorage.setItem('opacity', String(DEFAULT_OPACITY))
    localStorage.setItem('fsi', 'false')
    localStorage.setItem('clock_sound', 'false')
  }

  const onLastUpdateHover = () => {
    const hist = parseHistory(localStorage.getItem('last_search'))
    const isPersian = checkPersianCharacters([...hist].reverse()[0])
    const lang: Lang = isPersian ? 'fa' : 'en'
    setLastUpdateLabel(`${translate[lang].lastUpdate} ${timeAgo(lastUpdateRef.current, lang)}`)
  }

  return {
    mainVisible,
    mainBlur,
    simpleMode,
    header: {
      visible: headerVisible,
      direction: headerDir,
      color,
      placeholder,
      inputValue,
      inputRef: inputRef as RefObject<HTMLInputElement | null>,
      history,
      cityListActive,
      settingsBtnRef: settingsBtnRef as RefObject<HTMLButtonElement | null>,
      onInputChange: (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value),
      onInputKeyDown,
      onFocus: () => setCityListActive(true),
      onBlur: () => setTimeout(() => setCityListActive(false), 100),
      onHistorySelect,
      onOpenSettings,
      onFullscreen
    },
    weatherSection: {
      opacity: weatherOpacity,
      backgroundImage: weatherBg,
      style: weatherStyle,
      showVideo,
      videoRef: videoRef as RefObject<HTMLVideoElement | null>,
      videoSrc,
      mapRef: mapRef as RefObject<HTMLDivElement | null>,
      speedRef: speedRef as RefObject<HTMLSpanElement | null>,
      news,
      newsTransform,
      animationDuration,
      prices,
      mapOverlayInterval,
      color,
      showMapOverlayBottom,
      mapOpacity,
      flagSrc,
      cityTitle,
      weather,
      iconSrc,
      lastUpdateLabel,
      onLastUpdateHover,
      clock
    },
    portalModal: {
      active: portalModal.active,
      text: portalModal.text,
      onClose: closePortalModal
    },
    settings: {
      open: settingsOpen,
      settingsRef: settingsRef as RefObject<HTMLDivElement | null>,
      color,
      mapOpacity,
      animationDuration,
      fullScreenImage,
      simpleMode,
      clockSound,
      labels: settingsLabels,
      onColorChange: handleColorChange,
      onOpacityChange: handleOpacityChange,
      onAnimationChange: handleAnimationChange,
      onFullScreenImageChange: (checked: boolean) => {
        setFullScreenImage(checked)
        localStorage.setItem('fsi', String(checked))
      },
      onSimpleModeChange,
      onClockSoundChange: (checked: boolean) => {
        setClockSound(checked)
        localStorage.setItem('clock_sound', String(checked))
        // Unlock audio on user gesture so the next hour chime can play.
        if (checked) playHourChime()
      },
      onReset: onSettingsReset,
      onSubmit: () => {
        setMainBlur(false)
        setSettingsOpen(false)
      }
    }
  }
}
