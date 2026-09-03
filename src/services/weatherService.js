// Service Météo Local-First pour Vélococos avec Open-Meteo API & Cache Hors-ligne

const STAGE_COORDS = {
  1: { name: 'Rivière-à-Pierre / Lac Simon', lat: 46.989, lon: -72.180, dayOffset: 0 },
  2: { name: 'Lac Simon / Saint-Raymond', lat: 46.873, lon: -71.800, dayOffset: 1 },
  3: { name: 'Saint-Raymond / Val-Bélair', lat: 46.852, lon: -71.442, dayOffset: 2 },
  4: { name: 'Val-Bélair / Québec', lat: 46.849, lon: -71.209, dayOffset: 3 }
};

// Dictionnaire de décodage des codes météo WMO
export const WMO_CODES = {
  0: { label: 'Ensoleillé / Ciel dégagé', icon: '☀️', color: 'text-amber-400' },
  1: { label: 'Principalement dégagé', icon: '🌤️', color: 'text-amber-300' },
  2: { label: 'Éclaircies & passages nuageux', icon: '⛅', color: 'text-sky-300' },
  3: { label: 'Ciel couvert / Très nuageux', icon: '☁️', color: 'text-slate-400' },
  45: { label: 'Brouillard matinal', icon: '🌫️', color: 'text-slate-400' },
  48: { label: 'Brouillard givrant', icon: '🌫️', color: 'text-slate-400' },
  51: { label: 'Légère bruine', icon: '🌦️', color: 'text-sky-400' },
  53: { label: 'Bruine modérée', icon: '🌦️', color: 'text-sky-400' },
  55: { label: 'Forte bruine continue', icon: '🌧️', color: 'text-sky-500' },
  61: { label: 'Pluie faible', icon: '🌧️', color: 'text-sky-400' },
  63: { label: 'Pluie modérée', icon: '🌧️', color: 'text-blue-500' },
  65: { label: 'Forte pluie battante', icon: '⛈️', color: 'text-blue-600' },
  80: { label: 'Faibles averses intermittentes', icon: '🌦️', color: 'text-sky-400' },
  81: { label: 'Averses modérées', icon: '🌧️', color: 'text-blue-400' },
  82: { label: 'Violentes averses / Rafales', icon: '⛈️', color: 'text-purple-400' },
  95: { label: 'Orage électrique', icon: '⚡', color: 'text-amber-500' }
};

export const getWeatherDescription = (code) => {
  return WMO_CODES[code] || { label: 'Ciel variable', icon: '🌤️', color: 'text-slate-300' };
};

// Données de secours réalistes pour septembre (si 100% hors-ligne sans cache préalable)
const createFallbackDay = (dayNumber) => {
  const defaults = {
    1: { name: 'Rivière-à-Pierre / Lac Simon', tMax: 21, tMin: 9, tApp: 23, rainMm: 0.8, uv: 5, sunrise: '06:14', sunset: '19:26' },
    2: { name: 'Saint-Raymond', tMax: 22, tMin: 10, tApp: 24, rainMm: 1.2, uv: 6, sunrise: '06:15', sunset: '19:24' },
    3: { name: 'Saint-Raymond ➔ Val-Bélair', tMax: 20, tMin: 11, tApp: 21, rainMm: 3.5, uv: 5, sunrise: '06:16', sunset: '19:22' },
    4: { name: 'Québec (Arrivée)', tMax: 23, tMin: 12, tApp: 25, rainMm: 0.0, uv: 6, sunrise: '06:18', sunset: '19:20' }
  };
  const d = defaults[dayNumber] || defaults[1];

  const hourly = [];
  for (let h = 6; h <= 21; h++) {
    const isPeakHeat = h >= 12 && h <= 15;
    const temp = Math.round(d.tMin + ((d.tMax - d.tMin) * Math.sin(((h - 6) / 15) * Math.PI)));
    const apparent = isPeakHeat ? temp + 2 : temp;
    const isRainy = (dayNumber === 3 && h >= 14 && h <= 17) || (dayNumber === 2 && h >= 16 && h <= 17);
    const rainProb = isRainy ? 65 : (dayNumber === 1 && h === 13 ? 25 : 5);
    const rainMm = isRainy ? (dayNumber === 3 ? 1.6 : 0.6) : 0.0;

    hourly.push({
      time: `${h.toString().padStart(2, '0')}h00`,
      hour: h,
      temp,
      apparent,
      rainProb,
      rainMm,
      windKm: 12 + (h % 5),
      windGusts: 20 + (h % 8),
      uv: (h >= 11 && h <= 15) ? d.uv : Math.max(0, d.uv - 3),
      weather: isRainy ? WMO_CODES[81] : (isPeakHeat ? WMO_CODES[0] : WMO_CODES[1])
    });
  }

  return {
    day: dayNumber,
    locationName: d.name,
    tMax: d.tMax,
    tMin: d.tMin,
    tAppMax: d.tApp,
    sunrise: d.sunrise,
    sunset: d.sunset,
    rainSumMm: d.rainMm,
    uvMax: d.uv,
    hourly,
    isOfflineFallback: true,
    fetchedAt: new Date().toISOString()
  };
};

// Récupérer la météo pour un jour donné (1 à 4)
export async function getStageWeather(dayNumber, forceRefresh = false) {
  const stage = STAGE_COORDS[dayNumber] || STAGE_COORDS[1];
  const cacheKey = `velococos_weather_stage_${dayNumber}`;

  // 1. Tenter de lire le cache si non expiré (moins de 2 heures)
  if (!forceRefresh) {
    try {
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        const ageHours = (Date.now() - new Date(cached.fetchedAt).getTime()) / (1000 * 60 * 60);
        if (ageHours < 3) {
          return cached;
        }
      }
    } catch (e) {
      console.warn('Erreur lecture cache météo:', e);
    }
  }

  // 2. Si en ligne, appeler l'API Open-Meteo
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${stage.lat}&longitude=${stage.lon}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,uv_index&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max&timezone=America%2FToronto`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Choisir l'index du jour dans les prévisions (J1 = aujourd'hui ou index 0, etc.)
      const dayIndex = Math.min(stage.dayOffset, (data.daily?.time?.length || 1) - 1);

      // Sunrise & sunset format HH:MM
      const formatTimeOnly = (isoStr) => {
        if (!isoStr) return '--:--';
        return isoStr.split('T')[1]?.slice(0, 5) || isoStr;
      };

      const sunrise = formatTimeOnly(data.daily.sunrise[dayIndex]);
      const sunset = formatTimeOnly(data.daily.sunset[dayIndex]);
      const tMax = Math.round(data.daily.temperature_2m_max[dayIndex]);
      const tMin = Math.round(data.daily.temperature_2m_min[dayIndex]);
      const rainSum = parseFloat((data.daily.precipitation_sum[dayIndex] || 0).toFixed(1));
      const uvMax = Math.round(data.daily.uv_index_max[dayIndex] || 5);

      // Extraire les tranches horaires pour ce jour (de 06h00 à 21h00)
      const hourly = [];
      const startHourIdx = dayIndex * 24;

      for (let h = 6; h <= 21; h++) {
        const idx = startHourIdx + h;
        if (idx < data.hourly.time.length) {
          const rainProb = data.hourly.precipitation_probability ? data.hourly.precipitation_probability[idx] : 0;
          const rainMm = data.hourly.precipitation ? parseFloat(data.hourly.precipitation[idx].toFixed(1)) : 0;
          const temp = Math.round(data.hourly.temperature_2m[idx]);
          const apparent = Math.round(data.hourly.apparent_temperature[idx]);
          const wCode = data.hourly.weather_code[idx];

          hourly.push({
            time: `${h.toString().padStart(2, '0')}h00`,
            hour: h,
            temp,
            apparent,
            rainProb,
            rainMm,
            windKm: Math.round(data.hourly.wind_speed_10m[idx] || 0),
            windGusts: Math.round(data.hourly.wind_gusts_10m[idx] || 0),
            uv: Math.round(data.hourly.uv_index[idx] || 0),
            weather: getWeatherDescription(wCode)
          });
        }
      }

      // Calcul du ressenti maximal
      const tAppMax = Math.max(...hourly.map((h) => h.apparent), tMax);

      const parsedResult = {
        day: dayNumber,
        locationName: stage.name,
        tMax,
        tMin,
        tAppMax,
        sunrise,
        sunset,
        rainSumMm: rainSum,
        uvMax,
        hourly,
        isOfflineFallback: false,
        fetchedAt: new Date().toISOString()
      };

      // Sauvegarder dans le cache local
      try {
        localStorage.setItem(cacheKey, JSON.stringify(parsedResult));
      } catch (err) {
        console.warn('Erreur écriture cache météo:', err);
      }

      return parsedResult;
    } catch (err) {
      console.warn('Échec appel Open-Meteo, utilisation du cache ou fallback:', err);
    }
  }

  // 3. Fallback : Cache existant ou simulation réaliste
  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      return JSON.parse(cachedStr);
    }
  } catch (e) {
    // Ignorer
  }

  return createFallbackDay(dayNumber);
}

// Analyser la journée pour générer les alertes course / chariot / enfants
export function analyzeExpeditionWeather(weatherData) {
  if (!weatherData || !weatherData.hourly) return [];

  const alerts = [];

  // 1. Analyse Pluie & Heures d'eau
  const rainHours = weatherData.hourly.filter((h) => h.rainProb >= 40 || h.rainMm > 0.3);
  if (rainHours.length > 0) {
    const maxRainHour = rainHours.reduce((max, h) => (h.rainMm > max.rainMm ? h : max), rainHours[0]);
    const startH = rainHours[0].time;
    const endH = rainHours[rainHours.length - 1].time;

    alerts.push({
      type: 'rain',
      level: maxRainHour.rainMm >= 2.5 ? 'danger' : 'warning',
      title: `Créneau de pluie : ${startH} ➔ ${endH}`,
      message: `Pic d'eau attendu à ${maxRainHour.time} avec ${maxRainHour.rainMm} mm/h (${maxRainHour.rainProb}% proba). Déployez la housse de pluie du chariot et les vestes étanches.`,
      icon: '🌧️'
    });
  } else {
    alerts.push({
      type: 'dry',
      level: 'success',
      title: 'Piste sèche sans pluie notable',
      message: 'Conditions idéales pour le roulement de poussière de pierre et la toile de tente.',
      icon: '✨'
    });
  }

  // 2. Analyse Fortes Chaleurs
  const hotHours = weatherData.hourly.filter((h) => h.apparent >= 25);
  if (hotHours.length > 0) {
    const peakH = hotHours.reduce((max, h) => (h.apparent > max.apparent ? h : max), hotHours[0]);
    alerts.push({
      type: 'heat',
      level: peakH.apparent >= 28 ? 'danger' : 'warning',
      title: `Forte chaleur : Ressenti ${peakH.apparent}°C à ${peakH.time}`,
      message: 'Mouillez régulièrement les casquettes des enfants, favorisez les haltes ombragées et prévoyez des électrolytes dans les gourdes.',
      icon: '🔥'
    });
  }

  // 3. Nuit sous la tente (Bivouac J1 / J2)
  if (weatherData.tMin <= 11) {
    alerts.push({
      type: 'cold_night',
      level: 'info',
      title: `Nuit fraîche sous la tente : ${weatherData.tMin}°C min`,
      message: 'Nuit sous tente fraîche. Prévoyez les pulls polaires chauds et les tuques pour Jojo et Gusto avant le coucher.',
      icon: '⛺'
    });
  }

  // 4. Vent & Rafales face au chariot
  const windyHours = weatherData.hourly.filter((h) => h.windGusts >= 30);
  if (windyHours.length > 0) {
    const maxGust = Math.max(...windyHours.map((h) => h.windGusts));
    alerts.push({
      type: 'wind',
      level: 'warning',
      title: `Rafales de vent jusqu'à ${maxGust} km/h`,
      message: 'Résistance accrue pour pousser le chariot de course. Ajustez l\'allure et assurez les sangles.',
      icon: '💨'
    });
  }

  return alerts;
}
