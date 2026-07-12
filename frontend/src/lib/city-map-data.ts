/*
 * ŞEHİR HARİTA KATMANLARI — mekan haritasında gösterilen
 * merkezi noktalar, metro/tramvay istasyonları ve yoğun bölgeler.
 * Backend aşamasında GET /api/v1/cities/{city}/map-layers'dan gelecek;
 * şimdilik gerçek koordinatlarla statik tutulur.
 */

export interface MapPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface MapHotspot extends MapPoint {
  /** Yoğun bölge yarıçapı (metre) */
  radiusM: number;
}

export interface CityMapLayers {
  /** Merkezi noktalar: meydanlar, kongre merkezleri, iş bölgeleri */
  centers: MapPoint[];
  /** Metro / tramvay istasyonları */
  metro: MapPoint[];
  /** Yoğun bölgeler (turizm/iş yoğunluğu) — yarı saydam daire */
  hotspots: MapHotspot[];
}

export const CITY_MAP_LAYERS: Record<string, CityMapLayers> = {
  Istanbul: {
    centers: [
      { name: "Taksim Square", lat: 41.037, lng: 28.985 },
      { name: "Sultanahmet (Old City)", lat: 41.0055, lng: 28.9769 },
      { name: "Levent Business District", lat: 41.0819, lng: 29.0111 },
      { name: "Istanbul Congress Center", lat: 41.0413, lng: 28.9862 },
    ],
    metro: [
      { name: "Taksim — M2", lat: 41.0369, lng: 28.984 },
      { name: "Osmanbey — M2", lat: 41.0475, lng: 28.9846 },
      { name: "Şişhane — M2", lat: 41.0289, lng: 28.9722 },
      { name: "Vezneciler — M2", lat: 41.0116, lng: 28.9558 },
      { name: "Levent — M2", lat: 41.0781, lng: 29.0136 },
      { name: "Gayrettepe — M2", lat: 41.0686, lng: 29.0069 },
      { name: "Kabataş — T1 / F1", lat: 41.0316, lng: 28.9928 },
      { name: "Sultanahmet — T1", lat: 41.0067, lng: 28.9757 },
    ],
    hotspots: [
      { name: "Taksim – Beyoğlu (nightlife & hotels)", lat: 41.0335, lng: 28.9812, radiusM: 850 },
      { name: "Levent – Maslak (business district)", lat: 41.0845, lng: 29.0125, radiusM: 1100 },
      { name: "Sultanahmet (historic peninsula)", lat: 41.0072, lng: 28.9768, radiusM: 750 },
      { name: "Nişantaşı – Osmanbey (shopping)", lat: 41.048, lng: 28.9925, radiusM: 600 },
    ],
  },
  Ankara: {
    centers: [
      { name: "Kızılay Square", lat: 39.9208, lng: 32.8541 },
      { name: "ATO Congresium", lat: 39.9179, lng: 32.7981 },
    ],
    metro: [
      { name: "Kızılay — M1/M2", lat: 39.9208, lng: 32.8541 },
      { name: "Necatibey — M2", lat: 39.9179, lng: 32.8449 },
      { name: "Söğütözü — M2", lat: 39.9106, lng: 32.7982 },
      { name: "MTA — M2", lat: 39.9078, lng: 32.7756 },
    ],
    hotspots: [
      { name: "Kızılay (city center)", lat: 39.9208, lng: 32.8541, radiusM: 700 },
      { name: "Söğütözü (business & congress)", lat: 39.9125, lng: 32.799, radiusM: 650 },
    ],
  },
  Antalya: {
    centers: [
      { name: "Kaleiçi (Old Town)", lat: 36.8841, lng: 30.7056 },
      { name: "Antalya Expo Center", lat: 36.8918, lng: 30.8035 },
    ],
    metro: [
      { name: "İsmetpaşa — AntRay", lat: 36.8859, lng: 30.7071 },
      { name: "Muratpaşa — AntRay", lat: 36.8888, lng: 30.7168 },
      { name: "Expo — AntRay", lat: 36.8927, lng: 30.7995 },
    ],
    hotspots: [
      { name: "Kaleiçi & marina", lat: 36.8846, lng: 30.7043, radiusM: 600 },
      { name: "Lara hotel zone", lat: 36.8571, lng: 30.7789, radiusM: 1500 },
      { name: "Belek resort zone", lat: 36.8565, lng: 31.0555, radiusM: 2500 },
    ],
  },
  Izmir: {
    centers: [
      { name: "Konak Square", lat: 38.4189, lng: 27.1287 },
      { name: "Kültürpark Fair Area", lat: 38.431, lng: 27.144 },
    ],
    metro: [
      { name: "Konak — M1", lat: 38.4189, lng: 27.1276 },
      { name: "Çankaya — M1", lat: 38.4237, lng: 27.1355 },
      { name: "Basmane — M1", lat: 38.4222, lng: 27.1401 },
      { name: "Halkapınar — M1", lat: 38.4478, lng: 27.165 },
    ],
    hotspots: [
      { name: "Alsancak – Kordon (waterfront)", lat: 38.4372, lng: 27.1428, radiusM: 800 },
      { name: "Konak (city center)", lat: 38.4189, lng: 27.1287, radiusM: 600 },
    ],
  },
  Bursa: {
    centers: [{ name: "Heykel (city center)", lat: 40.1885, lng: 29.061 }],
    metro: [
      { name: "Şehreküstü — BursaRay", lat: 40.19, lng: 29.058 },
      { name: "Kültürpark — BursaRay", lat: 40.1955, lng: 29.043 },
      { name: "Acemler — BursaRay", lat: 40.2094, lng: 29.0244 },
    ],
    hotspots: [{ name: "Heykel & bazaar district", lat: 40.1885, lng: 29.061, radiusM: 650 }],
  },
  Adana: {
    centers: [{ name: "5 Ocak Square", lat: 36.9857, lng: 35.3308 }],
    metro: [
      { name: "İstiklal — Adana Metro", lat: 36.9915, lng: 35.3236 },
      { name: "Vilayet — Adana Metro", lat: 36.9967, lng: 35.3161 },
    ],
    hotspots: [{ name: "Seyhan center", lat: 36.9877, lng: 35.3266, radiusM: 700 }],
  },
  Nevşehir: {
    centers: [
      { name: "Göreme", lat: 38.6431, lng: 34.8283 },
      { name: "Ürgüp", lat: 38.6323, lng: 34.913 },
    ],
    metro: [],
    hotspots: [{ name: "Göreme (balloon & cave hotels)", lat: 38.6431, lng: 34.8283, radiusM: 900 }],
  },
};
