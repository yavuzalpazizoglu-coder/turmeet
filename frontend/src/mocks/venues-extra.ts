/*
 * OTOMATIK URETILDI — kaynak: Oteller_Tum_Liste_2026-07-10_180122.xlsx
 * (329 otellik gercek D Event envanteri; el yapimi 29 mock'taki oteller
 * ve blacklist kayitlari ayiklandi). Yeniden uretmek icin: /tmp/gen_extra.py
 * Backend baglaninca bu dosya da venues.ts ile birlikte devre disi kalir.
 */
import type { Venue, MiceEventType, BoardType, TransitAccess } from "@/types";

/** [name, city, district, lat, lng, stars, typeCode, rooms, halls, maxCap, airportKm, domain] */
type Row = [string, string, string, number, number, number, string, number, number, number, number, string];

const ROWS: Row[] = [
  ["Adana HiltonSA", "Adana", "Seyhan", 36.98815, 35.31145, 5, "c", 295, 16, 1000, 35, "hilton.com"],
  ["Divan Adana", "Adana", "Seyhan", 37.01026, 35.31695, 5, "c", 180, 9, 500, 27, "divanadana.com.tr"],
  ["İbis Adana", "Adana", "Seyhan", 36.99368, 35.31703, 3, "c", 165, 2, 60, 31, "all.accor.com"],
  ["Akrones Thermal SPA Convention Sport Hotel", "Afyonkarahisar", "Merkez", 38.74592, 30.53982, 5, "c", 317, 11, 2100, 45, "akroneshotel.com"],
  ["NG Hotels Afyon", "Afyonkarahisar", "Merkez", 38.74662, 30.54157, 5, "c", 428, 13, 1500, 55, "nghotels.com.tr"],
  ["Anemon Ankara Hotel", "Ankara", "Çankaya", 39.89699, 32.86825, 4, "c", 83, 4, 450, 29, "anemonhotels.com"],
  ["Ankara HiltonSA", "Ankara", "Çankaya", 39.90019, 32.85774, 5, "c", 310, 5, 500, 30, ""],
  ["Bilkent Otel ve Konferans Merkezi", "Ankara", "Çankaya", 39.90924, 32.84995, 5, "c", 235, 19, 1700, 40, "bilkentotel.com.tr"],
  ["Crowne Plaza Ankara", "Ankara", "Yenimahalle", 39.9595, 32.80976, 5, "c", 191, 12, 1000, 27, "crowneplazaankara.com.tr"],
  ["Devent Otel", "Ankara", "Çankaya", 39.89614, 32.85269, 5, "c", 10, 1, 10, 40, "devent-online.com"],
  ["Divan Ankara", "Ankara", "Çankaya", 39.90353, 32.84897, 5, "c", 150, 12, 1200, 45, "divan.com.tr"],
  ["Divan Çukurhan", "Ankara", "Altındağ", 39.95187, 32.86267, 3, "b", 19, 2, 80, 25, "divan.com.tr"],
  ["Grand Mercure Ankara", "Ankara", "Yenimahalle", 39.96307, 32.80535, 5, "c", 250, 7, 1500, 43, "all.accor.com"],
  ["Holiday Inn Çukurambar", "Ankara", "Çankaya", 39.89913, 32.86005, 5, "c", 140, 9, 500, 36, "hicukuambar.com"],
  ["Intercontinental Grand Ankara", "Ankara", "Çankaya", 39.90965, 32.85192, 5, "c", 339, 9, 1000, 31, "grandankara.com"],
  ["Limak Ambassadore Hotel Ankara", "Ankara", "Çankaya", 39.89854, 32.87085, 4, "c", 65, 7, 350, 34, "limakhotels.com"],
  ["Midi Hotel Ankara", "Ankara", "Çankaya", 39.89949, 32.86596, 4, "c", 73, 6, 250, 35, "midihotel.com"],
  ["Monec Hotel", "Ankara", "Çankaya", 39.90518, 32.86066, 3, "c", 60, 9, 300, 44, "hotelmonec.com.tr"],
  ["Mövenpick Ankara Hotel", "Ankara", "Yenimahalle", 39.96376, 32.81071, 5, "c", 176, 11, 340, 30, "movenpick.accor.com"],
  ["New Park Hotel", "Ankara", "Çankaya", 39.89708, 32.86966, 5, "c", 209, 4, 330, 25, "npankara.com"],
  ["Occidental Ankara Hotel", "Ankara", "Çankaya", 39.89597, 32.86204, 4, "c", 83, 3, 150, 34, "barcelo.com"],
  ["Park Inn By Radisson Ankara", "Ankara", "Çankaya", 39.90534, 32.85445, 4, "c", 114, 7, 350, 37, "radissonhotels.com"],
  ["Radisson Blu Çankaya", "Ankara", "Çankaya", 39.90838, 32.85795, 5, "c", 162, 7, 550, 35, "radissonhotels.com"],
  ["Sheraton Ankara", "Ankara", "Çankaya", 39.89732, 32.8582, 5, "c", 396, 24, 1650, 32, "marriott.com"],
  ["The Ankara Hotel", "Ankara", "Çankaya", 39.9009, 32.86353, 4, "c", 134, 13, 1200, 30, "theankarahotel.com"],
  ["Wyndham Ankara Hotel", "Ankara", "Yenimahalle", 39.95968, 32.80757, 5, "c", 140, 5, 450, 35, "wyndhamankara.com"],
  ["İbis Ankara Airport", "Ankara", "Akyurt", 39.92656, 32.85612, 3, "c", 147, 2, 180, 2, "all.accor.com"],
  ["Acanthus Cennet Barut Collection", "Antalya", "Manavgat", 36.78032, 31.44088, 5, "r", 260, 1, 450, 57, "barutacanthuscennet.com"],
  ["Akka Alinda", "Antalya", "Kemer", 36.60468, 30.55805, 5, "r", 400, 4, 240, 65, "akkahotels.com"],
  ["Akka Antedon", "Antalya", "Kemer", 36.60971, 30.55393, 5, "r", 507, 7, 750, 40, "akkahotels.com"],
  ["Akra Hotel Antalya", "Antalya", "Muratpaşa", 36.89044, 30.71015, 5, "c", 471, 12, 700, 13, "akrahotels.com"],
  ["Akra Kemer", "Antalya", "Kemer", 36.60759, 30.56614, 5, "r", 360, 5, 1300, 58, "akrahotels.com"],
  ["Arum Barut Collection", "Antalya", "Manavgat", 36.77384, 31.43909, 5, "r", 330, 1, 50, 65, "barutarum.com"],
  ["Balmy Foresta", "Antalya", "Kemer", 36.60898, 30.54917, 5, "r", 346, 4, 800, 40, "balmyforesta.com"],
  ["Barut B-Suites", "Antalya", "Manavgat", 36.77328, 31.4367, 4, "r", 254, 2, 135, 65, "barutbsuites.com"],
  ["Barut Goia", "Antalya", "Manavgat", 36.77918, 31.43906, 5, "r", 300, 3, 220, 61, "barutgoia.com"],
  ["Barut Hemera", "Antalya", "Manavgat", 36.7845, 31.44039, 5, "r", 376, 1, 80, 65, "baruthemera.com"],
  ["Calista Luxury Resort Hotel", "Antalya", "Serik", 36.86369, 31.05224, 5, "r", 535, 7, 800, 30, "calista.com.tr"],
  ["Concorde De Luxe Resort Hotel", "Antalya", "Aksu", 36.92249, 30.8743, 5, "r", 401, 7, 1000, 10, "concordehotels.com.tr"],
  ["Crowne Plaza Antalya", "Antalya", "Konyaaltı", 36.86068, 30.64023, 5, "c", 194, 4, 300, 20, "ihg.com"],
  ["Dobedan Beach Resort Comfort", "Antalya", "Manavgat", 36.77108, 31.44331, 5, "r", 308, 4, 400, 55, "dobedanhotels.com"],
  ["Dobedan Exclusive Hotel & Spa", "Antalya", "Serik", 36.86059, 31.0638, 5, "r", 724, 9, 500, 50, "dobedanhotels.com"],
  ["Dobedan World Palace", "Antalya", "Kemer", 36.59816, 30.5605, 5, "r", 816, 7, 900, 65, "dobedanhotels.com"],
  ["Ela Excellence Resort Hotel", "Antalya", "Serik", 36.86788, 31.05974, 5, "r", 500, 6, 700, 35, "elahotels.com"],
  ["Ethno Belek", "Antalya", "Serik", 36.85411, 31.06273, 5, "r", 499, 3, 1350, 35, "ethnohotels.com"],
  ["Gloria Golf Resort", "Antalya", "Serik", 36.85626, 31.0482, 5, "r", 515, 16, 1200, 40, "gloria.com.tr"],
  ["Gloria Serenity Resort", "Antalya", "Serik", 36.86694, 31.045, 5, "r", 367, 1, 160, 40, "gloria.com.tr"],
  ["Gloria Verde Resort", "Antalya", "Serik", 36.86617, 31.0631, 5, "r", 293, 1, 650, 40, "gloria.com.tr"],
  ["Granada Luxury Hotels", "Antalya", "Serik", 36.85818, 31.05165, 5, "r", 986, 29, 3500, 33, "granada.com.tr"],
  ["Kremlin Palace", "Antalya", "Aksu", 36.91699, 30.87132, 5, "r", 824, 11, 3072, 16, "kremlinpalace.com.tr"],
  ["Lara Barut Collection", "Antalya", "Muratpaşa", 36.88694, 30.72282, 5, "r", 467, 8, 840, 13, "barutlara.com"],
  ["Limak Limra Hotel", "Antalya", "Kemer", 36.60929, 30.5641, 5, "r", 700, 14, 1500, 70, "limakhotels.com"],
  ["Miracle Resort Antalya", "Antalya", "Muratpaşa", 36.89081, 30.718, 5, "r", 691, 9, 1000, 15, "miraclehotel.com"],
  ["NG Phaselis Bay", "Antalya", "Kemer", 36.60864, 30.54988, 5, "r", 480, 3, 300, 55, "ngphaselisbay.com"],
  ["Nest Convention Center", "Antalya", "Serik", 36.85558, 31.0541, 3, "g", 0, 29, 3300, 38, "nestconventioncenter.com"],
  ["Nirvana Cosmopolitan", "Antalya", "Muratpaşa", 36.88909, 30.72845, 5, "r", 622, 13, 1736, 15, "nirvanahotels.com.tr"],
  ["Nirvana Dolce Vita", "Antalya", "Kemer", 36.60482, 30.56856, 5, "r", 726, 6, 1480, 75, "nirvanahotels.com.tr"],
  ["Paloma Finesse Side", "Antalya", "Manavgat", 36.77332, 31.4438, 5, "r", 299, 2, 288, 75, "palomahotels.com"],
  ["Paloma Grida", "Antalya", "Serik", 36.86904, 31.05938, 5, "r", 529, 9, 620, 35, "palomahotels.com"],
  ["Paloma Oceana", "Antalya", "Manavgat", 36.77387, 31.43951, 5, "r", 482, 2, 750, 65, "palomahotels.com"],
  ["Paloma Perissia", "Antalya", "Manavgat", 36.7817, 31.42912, 5, "r", 352, 3, 500, 65, "palomahotels.com"],
  ["Paloma Sencia", "Antalya", "Serik", 36.86204, 31.05908, 5, "r", 358, 5, 465, 35, "palomahotels.com"],
  ["Papillon Ayscha Hotel Resort & SPA", "Antalya", "Serik", 36.85775, 31.06334, 5, "r", 363, 7, 750, 35, "papillon.com.tr"],
  ["Papillon Belvil Hotel Resort & SPA", "Antalya", "Serik", 36.86599, 31.05182, 4, "r", 495, 3, 500, 35, "papillon.com.tr"],
  ["Papillon Zeugma Relaxury", "Antalya", "Serik", 36.86241, 31.05256, 5, "r", 356, 4, 1000, 35, "papillon.com.tr"],
  ["Porto Bello Hotel Resort & Spa", "Antalya", "Konyaaltı", 36.85315, 30.62853, 5, "r", 346, 6, 500, 20, "sealifehotels.com"],
  ["Rixos Park Belek", "Antalya", "Serik", 36.86273, 31.0658, 5, "r", 360, 2, 350, 35, "rixos.com"],
  ["Rixos Premium Belek", "Antalya", "Serik", 36.85789, 31.05047, 5, "r", 622, 7, 1400, 35, "rixos.com"],
  ["Rixos Premium Tekirova", "Antalya", "Kemer", 36.60669, 30.55471, 5, "r", 622, 5, 600, 73, "rixos.com"],
  ["Rixos Sungate Hotel", "Antalya", "Kemer", 36.60908, 30.56578, 5, "r", 1044, 6, 2800, 50, "allinclusive-collection.com"],
  ["Royal Seginus", "Antalya", "Aksu", 36.91447, 30.86063, 5, "r", 796, 13, 2500, 17, "stonegroup.com.tr"],
  ["Sea Life Family Resort Hotel", "Antalya", "Konyaaltı", 36.8677, 30.6342, 5, "c", 0, 2, 110, 20, "sealifehotels.com"],
  ["Selectum Family Resort Belek", "Antalya", "Serik", 36.85788, 31.06468, 5, "r", 455, 2, 500, 35, "selectumhotels.com"],
  ["Selectum Family Resort Side", "Antalya", "Manavgat", 36.7811, 31.43055, 5, "r", 1030, 5, 1300, 75, "selectumhotels.com"],
  ["Selectum Luxury Resort Belek", "Antalya", "Serik", 36.85678, 31.05589, 5, "r", 410, 4, 980, 30, "selectumhotels.com"],
  ["Spice Hotel & SPA", "Antalya", "Serik", 36.86714, 31.05154, 5, "r", 546, 12, 1000, 35, "spice.com.tr"],
  ["Sueno Deluxe Belek", "Antalya", "Serik", 36.86982, 31.05852, 5, "r", 458, 22, 3000, 35, "sueno.com.tr"],
  ["Susesi Luxury Resort", "Antalya", "Serik", 36.85659, 31.0617, 5, "r", 554, 17, 2500, 35, "susesihotel.com"],
  ["Swandor Hotels & Resorts Topkapı Palace", "Antalya", "Aksu", 36.91556, 30.87698, 5, "r", 98, 1, 500, 15, "swandorhotels.com"],
  ["Talya Antalya", "Antalya", "Muratpaşa", 36.87823, 30.71543, 5, "c", 176, 9, 1200, 9, "talya.antalyahotel.org"],
  ["The Marmara Antalya", "Antalya", "Muratpaşa", 36.89159, 30.719, 5, "c", 232, 9, 1000, 34, "themarmarahotels.com"],
  ["Trendy Lara", "Antalya", "Aksu", 36.91633, 30.87364, 5, "r", 674, 7, 1200, 15, "trendy.com.tr"],
  ["Trendy Perge", "Antalya", "Aksu", 36.92588, 30.86344, 5, "r", 300, 11, 2000, 23, "trendy.com.tr"],
  ["Voyage Belek Golf & Spa", "Antalya", "Serik", 36.86058, 31.05656, 5, "r", 590, 4, 800, 35, "voyagehotel.com"],
  ["Voyage Kundu", "Antalya", "Aksu", 36.91198, 30.87237, 5, "r", 440, 3, 500, 18, "voyagehotel.com"],
  ["Xanadu Resort Hotel", "Antalya", "Serik", 36.86248, 31.04873, 5, "r", 421, 12, 1500, 35, "xanaduhotels.com.tr"],
  ["Akra Didim", "Aydın", "Didim", 37.36894, 27.26805, 5, "r", 359, 5, 700, 60, "akrahotels.com"],
  ["Anda Barut Collection", "Aydın", "Didim", 37.38023, 27.27103, 5, "r", 560, 8, 1075, 78, "barutanda.com"],
  ["Beks Premium Resort & Spa", "Aydın", "Kuşadası", 37.85476, 27.26008, 5, "r", 318, 4, 1000, 74, "bekshotels.com"],
  ["Double Tree By Hilton Kuşadası", "Aydın", "Kuşadası", 37.8607, 27.26024, 5, "c", 87, 6, 200, 66, "dtbyhiltonkusadasi.com"],
  ["Pine Bay Holiday Resort", "Aydın", "Kuşadası", 37.86329, 27.26085, 5, "r", 620, 10, 900, 45, "pinebay.com"],
  ["Büyük Abant Bolu", "Bolu", "Mudurnu", 40.74068, 31.61068, 5, "m", 202, 5, 900, 27, "buyukabantoteli.com"],
  ["Koru Hotel Bolu", "Bolu", "Merkez", 40.75385, 31.59559, 5, "m", 187, 6, 0, 230, "bolukoruhotels.com"],
  ["Almira Otel Bursa Thermal Spa Convention Center", "Bursa", "Osmangazi", 40.19349, 29.06994, 5, "c", 188, 13, 1000, 40, "almira.com.tr"],
  ["Aloft Bursa", "Bursa", "Nilüfer", 40.21193, 28.98289, 3, "c", 131, 2, 10, 55, "marriott.com"],
  ["Ceylan Splend'or Uludag, Autograph Collection", "Bursa", "İlçe Seçin", 40.1923, 29.0741, 5, "m", 87, 4, 90, 154, "ceylansplendor.com"],
  ["Crowne Plaza Bursa", "Bursa", "Nilüfer", 40.2064, 28.98686, 5, "c", 216, 7, 600, 27, "cpbursa.com"],
  ["Monte Baia Uludağ", "Bursa", "Osmangazi", 40.19771, 29.05228, 4, "c", 165, 3, 280, 95, "baiahotels.com"],
  ["Ramada By Wyndham Bursa Nilüfer", "Bursa", "Nilüfer", 40.21979, 28.98566, 4, "c", 84, 6, 650, 27, ""],
  ["Sheraton Bursa", "Bursa", "Nilüfer", 40.21526, 28.97894, 5, "c", 171, 7, 800, 55, "marriott.com"],
  ["Swissotel Uludağ Bursa", "Bursa", "Osmangazi", 40.18894, 29.05112, 5, "m", 173, 7, 500, 140, "swissoteluludagbursa.com"],
  ["İbis Hotel Bursa", "Bursa", "Osmangazi", 40.19777, 29.06439, 3, "c", 200, 1, 50, 27, "all.accor.com"],
  ["Park Dedeman Denizli", "Denizli", "Pamukkale", 37.7768, 29.08756, 4, "c", 120, 5, 350, 55, "dedeman.com"],
  ["Radisson Blu Diyarbakır", "Diyarbakır", "Kayapınar", 37.91715, 40.24809, 5, "c", 167, 9, 800, 6, "radissonbludiyarbakir.com"],
  ["Ramada By Wyndham Diyarbakır", "Diyarbakır", "Kayapınar", 37.92114, 40.2196, 4, "c", 93, 4, 90, 4, "ramadadiyarbakir.com"],
  ["Park Dedeman Elazığ", "Elazığ", "Merkez", 38.6863, 39.21861, 4, "c", 72, 3, 180, 13, "dedeman.com"],
  ["Hilton Garden Inn Erzurum", "Erzurum", "Yakutiye", 39.88993, 41.2558, 5, "c", 172, 4, 350, 10, "hilton.com"],
  ["Park Dedeman Eskişehir", "Eskişehir", "Odunpazarı", 39.77769, 30.54047, 5, "c", 123, 6, 250, 10, "dedeman.com"],
  ["Ramada Plaza by Wyndham Eskişehir", "Eskişehir", "Tepebaşı", 39.77751, 30.51788, 5, "c", 105, 7, 600, 8, "wyndhamhotels.com"],
  ["Tasigo  Otel Eskişehir", "Eskişehir", "Odunpazarı", 39.77658, 30.50475, 5, "c", 164, 5, 900, 27, "tasigoeskisehir.com"],
  ["İbis Eskişehir", "Eskişehir", "Tepebaşı", 39.75937, 30.52622, 3, "c", 108, 1, 75, 25, "ibishotel.com-"],
  ["Divan Gaziantep", "Gaziantep", "Şehitkamil", 37.05713, 37.36013, 5, "c", 182, 11, 900, 25, "divan.com.tr"],
  ["Novotel Gaziantep", "Gaziantep", "Şehitkamil", 37.08419, 37.39438, 4, "c", 92, 4, 730, 22, "novotelgaziantep.com"],
  ["Park Dedeman Gaziantep", "Gaziantep", "Şehitkamil", 37.0588, 37.39755, 4, "c", 125, 3, 60, 25, "dedeman.com"],
  ["Ramada By Wyndham Gaziantep", "Gaziantep", "Şehitkamil", 37.06694, 37.36517, 5, "c", 160, 6, 650, 40, "wyndhamhotels.com"],
  ["Shimall Deluxe Hotel & Kongre Merkezi", "Gaziantep", "Şahinbey", 37.07187, 37.37577, 5, "c", 321, 9, 2500, 19, "shimallhotel.com"],
  ["Ramada By Wyndham Giresun Piraziz", "Giresun", "Piraziz", 40.89833, 38.39508, 4, "c", 70, 3, 170, 5, "ramadagiresunpiraziz.com"],
  ["The Museum Antakya", "Hatay", "Antakya", 36.18896, 36.17102, 5, "c", 200, 5, 800, 26, "themuseumhotelantakya.com"],
  ["Address İstanbul Hotel", "Istanbul", "Üsküdar", 41.02837, 29.01292, 5, "c", 182, 7, 950, 30, "addresshotels.com"],
  ["Altunizade Suites İstanbul, Curio Collection by Hilton", "Istanbul", "Üsküdar", 41.02984, 29.00703, 5, "c", 238, 9, 100, 33, "hilton.com"],
  ["Avantgarde Urban Levent", "Istanbul", "Beşiktaş", 41.04951, 29.00801, 3, "c", 84, 4, 100, 38, "avantgardecollection.com"],
  ["Barcelo Istanbul", "Istanbul", "Beyoğlu", 41.02845, 28.98585, 4, "c", 273, 7, 590, 45, "barcelo.com"],
  ["Burdock Hotel Istanbul, Autograph Collection ( Marriott )", "Istanbul", "Beyoğlu", 41.03541, 28.98396, 4, "b", 100, 2, 100, 38, "marriott.com"],
  ["CVK Park Bosphorus Hotel İstanbul", "Istanbul", "Beyoğlu", 41.02971, 28.97083, 5, "c", 450, 19, 800, 40, "cvkhotelsandresorts.com"],
  ["Canopy by Hilton İstanbul Taksim", "Istanbul", "Beyoğlu", 41.03699, 28.98009, 3, "c", 110, 2, 25, 32, "hilton.com"],
  ["Crowne Plaza Old City", "Istanbul", "Fatih", 41.01612, 28.95414, 5, "c", 201, 3, 110, 40, "cpoldcity.com"],
  ["Crowne Plaza Ortaköy Bosphorus", "Istanbul", "Beşiktaş", 41.0451, 29.00892, 5, "c", 133, 4, 350, 48, "cportakoybosphorus.com"],
  ["Crowne Plaza İstanbul Asia Hotel & Convention Center", "Istanbul", "Pendik", 40.87236, 29.22924, 5, "c", 336, 26, 1700, 5, "cpistanbulasia.com"],
  ["Crowne Plaza İstanbul Florya", "Istanbul", "Bakırköy", 40.97282, 28.86356, 5, "c", 306, 5, 400, 52, "cpistanbulflorya.com"],
  ["Crowne Plaza İstanbul OryaPark", "Istanbul", "Ümraniye", 41.02069, 29.08855, 5, "c", 197, 15, 600, 29, "cporyapark.com"],
  ["Crowne Plaza İstanbul Tuzla Viaport Marina Hotel", "Istanbul", "Tuzla", 40.81662, 29.30725, 5, "c", 256, 3, 150, 16, "cpistanbulmarina.com"],
  ["Crowne Plaza İstanbul Zeytinburnu", "Istanbul", "Zeytinburnu", 40.9929, 28.89638, 4, "c", 124, 6, 245, 35, "crowneplaza.com"],
  ["Dedeman Bostancı Hotel and Convention Center", "Istanbul", "Ataşehir", 40.99477, 29.11338, 5, "c", 252, 13, 900, 27, "dedeman.com"],
  ["Dedeman İstanbul Hotel", "Istanbul", "Beşiktaş", 41.04387, 29.00175, 5, "c", 327, 16, 400, 36, "dedeman.com"],
  ["Delta Hotels by Marriott Istanbul Karakoy", "Istanbul", "Beyoğlu", 41.03004, 28.9718, 4, "c", 78, 2, 55, 40, "marriott.com"],
  ["Delta Hotels by Marriott Kağıthane", "Istanbul", "Kağıthane", 41.01103, 28.94294, 5, "c", 126, 2, 340, 30, "marriott.com"],
  ["Delta Hotels by Marriott Levent", "Istanbul", "Şişli", 41.06511, 28.98414, 5, "c", 232, 7, 110, 30, "marriott.com"],
  ["Divan İstanbul", "Istanbul", "Şişli", 41.06436, 28.99404, 5, "c", 190, 6, 250, 35, "divan.com.tr"],
  ["DoubleTree by Hilton Hotel İstanbul Topkapı", "Istanbul", "Bayrampaşa", 41.01831, 28.97231, 5, "c", 216, 5, 700, 27, "hilton.com"],
  ["DoubleTree by Hilton İstanbul Avcılar", "Istanbul", "Avcılar", 41.02871, 29.01126, 5, "c", 231, 10, 450, 27, "hilton.com"],
  ["DoubleTree by Hilton İstanbul Maçka", "Istanbul", "Beşiktaş", 41.04979, 29.00564, 4, "c", 109, 4, 40, 40, "hilton.com"],
  ["DoubleTree by Hilton İstanbul Ümraniye", "Istanbul", "Ümraniye", 41.02548, 29.09067, 5, "c", 240, 7, 300, 39, "hilton.com"],
  ["Doubletree by Hilton Moda", "Istanbul", "Kadıköy", 40.99455, 29.03711, 5, "c", 245, 14, 240, 45, "hilton.com"],
  ["Elite World Comfy Hotel", "Istanbul", "Beyoğlu", 41.02754, 28.974, 4, "c", 102, 3, 150, 27, "eliteworldhotels.com.tr"],
  ["Elite World Grand İstanbul Basın Ekspres", "Istanbul", "Küçükçekmece", 40.99713, 28.77407, 5, "c", 401, 8, 750, 34, "eliteworldhotels.com.tr"],
  ["Elite World Grand İstanbul Küçükyalı", "Istanbul", "Maltepe", 40.93687, 29.14117, 5, "c", 350, 6, 650, 30, "eliteworldhotels.com.tr"],
  ["Elite World İstanbul Florya", "Istanbul", "Küçükçekmece", 41.00568, 28.7695, 5, "c", 181, 11, 550, 33, "eliteworldhotels.com.tr"],
  ["Elite World İstanbul Taksim Hotel", "Istanbul", "Beyoğlu", 41.03114, 28.98229, 5, "c", 245, 7, 350, 27, "eliteworldhotels.com.tr"],
  ["Fairmont Quasar İstanbul", "Istanbul", "Şişli", 41.063, 28.98739, 5, "c", 209, 12, 500, 38, "fairmontquasaristanbul.com"],
  ["Feriye", "Istanbul", "Beşiktaş", 41.04955, 29.01553, 3, "g", 0, 8, 250, 46, "feriye.com"],
  ["Fişekhane", "Istanbul", "Zeytinburnu", 40.99035, 28.89265, 3, "g", 0, 2, 500, 43, "fisekhane.com"],
  ["Four Point by Sheraton İstanbul Pendik Hotel", "Istanbul", "Pendik", 40.87582, 29.24444, 4, "c", 160, 7, 300, 7, "marriott.com"],
  ["Grand Cevahir Hotel Convention Center", "Istanbul", "Şişli", 41.06656, 28.99025, 5, "c", 323, 22, 2500, 35, "gch.com.tr"],
  ["Grand Harilton Hotel", "Istanbul", "Bahçelievler", 40.99812, 28.85239, 5, "c", 208, 5, 700, 36, "grandhariltonhotel.com"],
  ["Grand Hyatt İstanbul", "Istanbul", "Şişli", 41.06621, 28.9946, 5, "c", 360, 17, 450, 37, "grandhyattistanbul.com"],
  ["Grand Pera", "Istanbul", "Beyoğlu", 41.02772, 28.97141, 3, "g", 0, 3, 500, 41, "grandpera.com"],
  ["Hilton Mall Of İstanbul", "Istanbul", "Başakşehir", 41.02315, 29.0005, 5, "c", 195, 11, 1100, 20, "hilton.com"],
  ["Hilton İstanbul Bakırköy", "Istanbul", "Bakırköy", 40.98338, 28.86748, 5, "c", 306, 17, 1000, 27, "istanbulbakırkoy.hilton.com"],
  ["Hilton İstanbul Bosphorus", "Istanbul", "Şişli", 41.05944, 28.99325, 5, "c", 470, 27, 1100, 40, "hilton.com"],
  ["Hilton İstanbul Kozyatağı", "Istanbul", "Kadıköy", 40.98295, 29.03259, 5, "c", 320, 17, 500, 28, "istanbulkozyatagi.hilton.com"],
  ["Hilton İstanbul Maslak", "Istanbul", "Sarıyer", 41.0987, 29.03584, 5, "c", 284, 22, 1200, 33, "hilton.com"],
  ["Holiday Inn İstanbul Şişli", "Istanbul", "Şişli", 41.05614, 28.99787, 5, "c", 168, 8, 150, 38, "hisisli.com"],
  ["Hyatt Centric Levent İstanbul", "Istanbul", "Beşiktaş", 41.03664, 29.01694, 3, "c", 79, 5, 200, 51, "hyatt.com"],
  ["Hyatt Regency İstanbul Ataköy", "Istanbul", "Bakırköy", 40.97754, 28.87126, 5, "c", 284, 11, 400, 50, "hyatt.com"],
  ["JW Marriott Hotel İstanbul Marmara Sea", "Istanbul", "Bakırköy", 40.97762, 28.87191, 5, "c", 241, 6, 350, 45, "marriott.com"],
  ["JW Marriott İstanbul Bosphorus", "Istanbul", "İlçe Seçin", 41.01078, 29.02096, 5, "c", 130, 3, 50, 42, "jwmarriottistanbulbosphorus.com"],
  ["Kalyon Hotel İstanbul", "Istanbul", "Fatih", 41.01446, 28.94418, 4, "c", 99, 2, 250, 43, "kalyonistanbul.com"],
  ["Lazzoni Hotel", "Istanbul", "Beyoğlu", 41.03261, 28.96826, 5, "c", 124, 7, 450, 28, "lazzonihotel.com"],
  ["Le Meridien İstanbul", "Istanbul", "Beşiktaş", 41.04731, 29.0091, 5, "c", 255, 11, 930, 30, "lemeridienistanbuletilerhotel.com"],
  ["Limak Eurasia Luxury Hotel", "Istanbul", "Beykoz", 41.02348, 28.96572, 5, "c", 197, 11, 650, 36, "limakeurasia.com"],
  ["Mandarin Oriental Bosphorus, İstanbul", "Istanbul", "Beşiktaş", 41.04908, 29.00732, 5, "c", 100, 12, 800, 45, "mandarinoriental.com"],
  ["Mercure Ümraniye", "Istanbul", "Ümraniye", 41.02007, 29.10406, 4, "c", 103, 7, 325, 30, "all.accor.com"],
  ["Mercure İstanbul Altunizade", "Istanbul", "Üsküdar", 41.01502, 29.00543, 4, "c", 140, 8, 320, 27, "mercureistanbulaltunizade.com"],
  ["Mola İstanbul", "Istanbul", "Silivri", 41.03706, 28.95218, 5, "r", 414, 4, 1000, 40, "molaistanbul.com"],
  ["Mövenpick Bosphorus İstanbul", "Istanbul", "Beşiktaş", 41.04363, 29.01367, 5, "c", 258, 5, 150, 60, "movenpick.com"],
  ["Mövenpick Hotel İstanbul Asia Airport", "Istanbul", "Pendik", 40.87112, 29.23321, 5, "a", 294, 23, 900, 3, "movenpick.com"],
  ["Mövenpick Living Saklıvadi", "Istanbul", "Sarıyer", 41.10199, 29.03095, 3, "c", 164, 1, 70, 17, "movenpick.accor.com"],
  ["Mövenpick Marmara Sea Zeytinburnu", "Istanbul", "Zeytinburnu", 40.98778, 28.89484, 5, "c", 229, 11, 270, 27, "movenpick.com"],
  ["Novotel Zeytinburnu", "Istanbul", "Zeytinburnu", 40.98712, 28.9131, 4, "c", 208, 7, 300, 50, "novotelistanbulzeytinburnu.com"],
  ["Novotel İstanbul Bosphorus", "Istanbul", "Beyoğlu", 41.02648, 28.97871, 5, "c", 200, 6, 300, 40, "novotelistanbulbosphorus.com"],
  ["Occidental Taksim", "Istanbul", "Beyoğlu", 41.03501, 28.97949, 4, "c", 162, 7, 710, 45, "barcelo.com"],
  ["Park Inn by Radisson İstanbul Asia Kavacik", "Istanbul", "Kadıköy", 40.99795, 29.03623, 4, "c", 110, 4, 560, 45, ""],
  ["Pera Palace", "Istanbul", "Beyoğlu", 41.02699, 28.96832, 5, "b", 115, 4, 220, 40, "htps:"],
  ["Point Hotel Barbaros", "Istanbul", "Beşiktaş", 41.03551, 29.01222, 5, "c", 202, 16, 450, 40, "www"],
  ["Point Hotel Taksim", "Istanbul", "Beyoğlu", 41.03054, 28.97607, 5, "c", 232, 6, 200, 40, "pointhotel.com"],
  ["Pullman & Mercure İstanbul Hotel & Convention Center", "Istanbul", "Bahçelievler", 40.99327, 28.85223, 5, "c", 790, 18, 6670, 35, "pullmanistanbul.com"],
  ["Radisson Blu Bosphorus", "Istanbul", "Beşiktaş", 41.0378, 29.01425, 5, "c", 139, 8, 120, 45, "radissonblu.com"],
  ["Radisson Blu Harbiye", "Istanbul", "Şişli", 41.06236, 28.99366, 4, "c", 90, 2, 20, 40, "radissonhotels.com"],
  ["Radisson Blu Hotel, İstanbul Asia Ataşehir", "Istanbul", "Ataşehir", 40.99573, 29.13004, 5, "c", 195, 16, 400, 19, "radissonhotels.com"],
  ["Radisson Blu Hotel, İstanbul Pera", "Istanbul", "Beyoğlu", 41.03014, 28.97391, 5, "c", 130, 5, 100, 27, "radissonhotels.com"],
  ["Radisson Blu Hotel, İstanbul Şişli", "Istanbul", "Şişli", 41.05745, 28.97898, 5, "c", 291, 21, 2000, 35, "radissonblu.com"],
  ["Radisson Collection Hotel, Vadistanbul", "Istanbul", "Sarıyer", 41.11049, 29.0228, 5, "c", 193, 9, 1010, 25, "radissonhotels.com"],
  ["Raffles İstanbul", "Istanbul", "İlçe Seçin", 41.0076, 28.95187, 5, "c", 185, 8, 1100, 45, "raffles.com"],
  ["Ramada Plaza By Wyndham İstanbul City Center", "Istanbul", "Şişli", 41.05398, 28.97792, 5, "c", 186, 6, 200, 33, "ramadaplazaistanbul.com"],
  ["Renaissance Polat Yeşilyurt", "Istanbul", "Bakırköy", 40.98034, 28.87192, 5, "c", 438, 12, 1000, 40, "marriott.com"],
  ["Renaissance İstanbul Polat Bosphorus Hotel", "Istanbul", "Beşiktaş", 41.05051, 29.01631, 5, "c", 213, 13, 550, 45, "marriott.com"],
  ["Ritz Carlton İstanbul", "Istanbul", "Şişli", 41.06627, 28.99583, 5, "c", 239, 7, 600, 34, "ritzcarlton.com"],
  ["Rixos Pera İstanbul", "Istanbul", "Beyoğlu", 41.0334, 28.97017, 5, "c", 116, 3, 90, 27, "rixos.com"],
  ["Rixos Tersane İstanbul", "Istanbul", "Beyoğlu", 41.02932, 28.97207, 5, "c", 364, 9, 2016, 38, "rixos.com"],
  ["Sait Halim Paşa Yalısı", "Istanbul", "Sarıyer", 41.10895, 29.02499, 3, "g", 0, 5, 420, 27, "saithalimpasa.com"],
  ["Selectum City Ataşehir", "Istanbul", "Ataşehir", 40.99159, 29.12101, 5, "c", 316, 17, 1500, 24, "selectumcity.com"],
  ["Shangri-La Bosphorus İstanbul", "Istanbul", "Beşiktaş", 41.03507, 28.9967, 5, "c", 186, 12, 800, 40, "shangri-la.com"],
  ["Sheraton Grand İstanbul Atasehir", "Istanbul", "Ataşehir", 40.99892, 29.11565, 5, "c", 160, 10, 750, 28, "sheratonistanbulatasehir.com"],
  ["Sheraton İstanbul Ataköy", "Istanbul", "Bakırköy", 40.97575, 28.87636, 5, "c", 285, 5, 550, 58, "sheratonatakoy.com"],
  ["Sheraton İstanbul City Center İstanbul", "Istanbul", "Beyoğlu", 41.03946, 28.98384, 5, "c", 254, 7, 700, 45, "sheraton.com"],
  ["Sheraton İstanbul Levent", "Istanbul", "Kağıthane", 41.04402, 28.9813, 5, "c", 248, 8, 300, 33, "marriott.com"],
  ["Sofitel İstanbul Taksim", "Istanbul", "Beyoğlu", 41.0305, 28.97877, 5, "c", 202, 6, 350, 40, "sofitel.accor.com"],
  ["St. Regis", "Istanbul", "Şişli", 41.06424, 28.98336, 5, "c", 118, 6, 280, 41, "marriott.com"],
  ["The Grand Tarabya Hotel", "Istanbul", "Sarıyer", 41.10225, 29.03816, 5, "c", 248, 14, 1200, 35, "thegrandtarabya.com"],
  ["The Marmara Pera", "Istanbul", "Beyoğlu", 41.03406, 28.98325, 4, "c", 205, 6, 180, 34, "themarmarahotels.com"],
  ["The Marmara Taksim", "Istanbul", "Beyoğlu", 41.03226, 28.98542, 5, "c", 388, 19, 600, 40, "themarmarahotels.com"],
  ["The Peninsula İstanbul", "Istanbul", "Beyoğlu", 41.0375, 28.97001, 5, "c", 177, 4, 600, 45, "peninsula.com"],
  ["Titanic Business Kartal", "Istanbul", "Kartal", 40.90192, 29.20032, 5, "c", 192, 20, 1000, 12, "titanic.com.tr"],
  ["Titanic Port Bakırköy", "Istanbul", "Bakırköy", 40.98171, 28.87736, 5, "c", 194, 4, 200, 46, "titanic.com.tr"],
  ["Wyndham Grand İstanbul Europe", "Istanbul", "Bağcılar", 41.03661, 28.85284, 5, "c", 307, 16, 500, 35, "wyndhamgrandistanbuleurope.com"],
  ["Wyndham Grand İstanbul Kalamış Marina Hotel", "Istanbul", "Kadıköy", 40.98732, 29.03828, 5, "c", 211, 16, 500, 30, "wyndhamgrandkalamis.com"],
  ["Wyndham Grand İstanbul Levent Hotel & Conference Center", "Istanbul", "Şişli", 41.06527, 28.98086, 5, "c", 387, 23, 1100, 32, "wyndhamgrandlevent.com"],
  ["İbis Styles İstanbul Ataşehir", "Istanbul", "Ataşehir", 40.98427, 29.11921, 4, "c", 76, 3, 130, 24, "all.accor.com"],
  ["İbis Tuzla", "Istanbul", "Tuzla", 40.81724, 29.30982, 3, "c", 200, 5, 135, 15, "ibisistanbultuzla.com"],
  ["İstanbul Marriott Hotel Asia Ataşehir", "Istanbul", "Ataşehir", 40.99183, 29.11155, 5, "c", 238, 11, 800, 27, "marriott.com"],
  ["İstanbul Marriott Hotel Pendik", "Istanbul", "Pendik", 40.88392, 29.23434, 5, "c", 231, 10, 1000, 13, "marriott.com"],
  ["İstanbul Marriott Hotel Sisli", "Istanbul", "Şişli", 41.05733, 28.97823, 5, "c", 267, 10, 850, 40, "marriott.com"],
  ["İstinye Üniversitesi Topkapı Kampüs Kongre Merkezi", "Istanbul", "Zeytinburnu", 40.99948, 28.91199, 3, "g", 0, 1, 411, 40, ""],
  ["İstinye Üniversitesi Vadi Ana Yerleşke Kongre Merkezi", "Istanbul", "Sarıyer", 41.09821, 29.02449, 3, "g", 0, 1, 1200, 35, ""],
  ["İstinye Üniversitesi Vadi H Yerleşke Konferans Salonu", "Istanbul", "Sarıyer", 41.11159, 29.0375, 3, "g", 0, 1, 250, 27, ""],
  ["Altın Yunus Resort & Thermal Hotel", "Izmir", "Çeşme", 38.32069, 26.30372, 5, "r", 440, 6, 1000, 90, "altinyunus.com.tr"],
  ["Anemon Ege Hotel", "Izmir", "Bornova", 38.46842, 27.22022, 4, "c", 98, 2, 300, 25, "anemonhotels.com"],
  ["Club Marvy", "Izmir", "Menderes", 38.24366, 27.13768, 5, "r", 342, 10, 500, 50, "clubmarvy.com"],
  ["Ege Palas Business Hotel", "Izmir", "Konak", 38.42004, 27.12174, 4, "c", 112, 5, 350, 15, ""],
  ["Four Points by Sheraton İzmir", "Izmir", "Konak", 38.42375, 27.13959, 4, "c", 110, 5, 50, 27, "marriott.com"],
  ["Grand Hyatt İzmir İstinyePark", "Izmir", "Balçova", 38.38942, 27.05936, 5, "c", 160, 10, 750, 18, "hyattregencyizmiristinyepark.com"],
  ["Hilton Garden Inn Bayraklı", "Izmir", "Bayraklı", 38.41496, 27.1435, 4, "c", 197, 3, 120, 30, "hilton.com"],
  ["Ilıca Hotel Spa & Wellness Thermal Resort", "Izmir", "Çeşme", 38.32383, 26.30858, 5, "r", 300, 16, 876, 90, "ilicahotel.com"],
  ["Kaya İzmir Thermal & Convention", "Izmir", "Narlıdere", 38.39374, 26.9963, 5, "c", 330, 14, 1400, 20, "kayahotels.com"],
  ["Key Hotel İzmir", "Izmir", "Konak", 38.41537, 27.13989, 3, "c", 31, 2, 100, 27, "keyhotel.com"],
  ["KoruMar Ephesus Beach & SPA Resort", "Izmir", "Selçuk", 37.95254, 27.35988, 5, "r", 388, 5, 780, 56, "korumarephesus.com.tr"],
  ["Mövenpick Hotel İzmir", "Izmir", "Konak", 38.42786, 27.13241, 5, "c", 185, 11, 250, 18, "movenpick.accor.com"],
  ["On'live Deluxe Çeşme", "Izmir", "Çeşme", 38.31545, 26.29997, 5, "r", 70, 1, 150, 95, "onlivehotel.com"],
  ["Ontur Hotel İzmir", "Izmir", "Konak", 38.42591, 27.12196, 4, "c", 80, 2, 170, 18, "izmir.onturhotels.com"],
  ["Paloma Pasha", "Izmir", "Menderes", 38.25519, 27.12718, 5, "r", 268, 5, 400, 50, "palomahotels.com"],
  ["Radisson Blu Resort & Spa Çeşme", "Izmir", "Çeşme", 38.32783, 26.30162, 5, "r", 317, 8, 600, 90, "radissonhotels.com"],
  ["Radisson Red Hotel İzmir Point Bornova", "Izmir", "Bornova", 38.46635, 27.22909, 5, "c", 204, 5, 200, 27, "radissonhotels.com"],
  ["Renaissance İzmir Hotel", "Izmir", "Konak", 38.41732, 27.13302, 5, "c", 110, 3, 130, 27, "renaissanceizmir.com"],
  ["Swissotel Çeşme", "Izmir", "Çeşme", 38.31881, 26.31534, 5, "r", 248, 13, 600, 87, "swissotelcesme.com"],
  ["Çeşme Grand Ontur Hotel", "Izmir", "Çeşme", 38.31474, 26.30177, 5, "r", 200, 4, 450, 95, "cesme.onturhotels.com"],
  ["İbis Alsancak", "Izmir", "Konak", 38.42299, 27.13769, 3, "c", 140, 1, 20, 30, "ibisizmir.com"],
  ["İzmir Marriott", "Izmir", "Konak", 38.4125, 27.11891, 5, "c", 149, 6, 150, 15, "marriott.com"],
  ["Park Dedeman Kastamonu", "Kastamonu", "Merkez", 41.39012, 33.79913, 4, "c", 150, 6, 600, 6, "dedeman.com"],
  ["Dedeman Kayseri", "Kayseri", "Melikgazi", 38.70725, 35.49042, 4, "c", 121, 4, 120, 7, "dedeman.com"],
  ["Novotel Kayseri", "Kayseri", "Kocasinan", 38.71747, 35.49171, 4, "c", 96, 3, 100, 4, "all.accor.com"],
  ["Dedeman Kartepe Kocaeli", "Kocaeli", "Kartepe", 40.73626, 30.14079, 5, "c", 166, 2, 400, 45, "dedeman.com"],
  ["Dedeman Konya Hotel & Convention Center", "Konya", "Selçuklu", 37.87736, 32.49758, 5, "c", 206, 12, 1500, 19, "dedeman.com"],
  ["Hilton Garden Inn Konya", "Konya", "Karatay", 37.86406, 32.49172, 5, "c", 228, 4, 270, 18, "hilton.com"],
  ["Novotel Konya", "Konya", "Selçuklu", 37.8809, 32.48944, 5, "c", 178, 5, 650, 15, "all.accor.com"],
  ["Hilton Garden Inn Kütahya", "Kütahya", "Merkez", 39.40725, 29.97561, 4, "c", 121, 5, 250, 36, "hilton.com"],
  ["Double Tree by Hilton Manisa", "Manisa", "Yunusemre", 38.6273, 27.4065, 5, "c", 215, 6, 400, 51, "hilton.com"],
  ["Hilton Garden Inn Mardin", "Mardin", "Artuklu", 37.30198, 40.73565, 5, "c", 162, 5, 350, 16, "hilton.com"],
  ["Ramada Plaza by Wyndham Mardin", "Mardin", "Artuklu", 37.29573, 40.74735, 5, "c", 220, 7, 400, 25, "ramadaplazamardin.com"],
  ["Divan Mersin", "Mersin", "Yenişehir", 36.82061, 34.62077, 5, "c", 170, 6, 500, 90, "divan.com.tr"],
  ["HiltonSA Mersin", "Mersin", "Yenişehir", 36.81979, 34.61049, 5, "c", 190, 7, 350, 45, "hilton.com"],
  ["Baia Bodrum", "Muğla", "Bodrum", 37.03852, 27.43505, 5, "r", 202, 4, 350, 47, "baiahotels.com"],
  ["DoubleTree by Hilton Bodrum Işıl Club Resort", "Muğla", "Bodrum", 37.03676, 27.42701, 5, "r", 277, 1, 120, 25, "hilton.com"],
  ["DoubleTree by Hilton Bodrum Marina Vista", "Muğla", "Bodrum", 37.02917, 27.43693, 4, "c", 85, 2, 119, 30, "hilton.com"],
  ["Hillstone Bodrum Hotel & Spa", "Muğla", "Bodrum", 37.0354, 27.44119, 3, "b", 96, 4, 110, 28, "hillstonebodrum.com"],
  ["Le Meridien Bodrum", "Muğla", "Bodrum", 37.0359, 27.43368, 5, "r", 112, 1, 90, 27, "marriott.com"],
  ["Liberty Hotels Lykia", "Muğla", "Fethiye", 36.64456, 29.11277, 5, "r", 645, 11, 950, 62, "info@libertyhotels.com"],
  ["Susona Bodrum, LXR Hotels & Resorts", "Muğla", "Bodrum", 37.03619, 27.42753, 5, "r", 70, 2, 60, 29, "susonabodrum.com"],
  ["The Marmara Bodrum", "Muğla", "Bodrum", 37.03496, 27.41897, 5, "b", 97, 3, 125, 34, "themarmarahotels.com"],
  ["Barcelo Cappadocia", "Nevşehir", "Ürgüp", 38.63752, 34.92146, 5, "c", 151, 4, 700, 44, "barcelo.com"],
  ["CCR Hotels & Spa", "Nevşehir", "Merkez", 38.61807, 34.72018, 5, "r", 115, 3, 500, 27, "ccr-hotels.com"],
  ["Cappadocia Marriott", "Nevşehir", "Merkez", 38.62343, 34.71348, 5, "c", 298, 11, 1150, 32, "marriott.com"],
  ["Crowne Plaza Cappadocia", "Nevşehir", "Merkez", 38.62314, 34.70486, 5, "c", 189, 6, 350, 25, "cpcappadocia.com"],
  ["Double Tree By Hilton Avanos", "Nevşehir", "Avanos", 38.71982, 34.84921, 5, "c", 126, 4, 200, 30, "hilton.com"],
  ["Fortuna of Cappadocia, Autograph Collection", "Nevşehir", "Merkez", 38.62042, 34.70678, 5, "c", 125, 6, 670, 27, "marriott.com"],
  ["Ramada By Wyndham Cappadocia", "Nevşehir", "Ürgüp", 38.62591, 34.92205, 5, "c", 211, 5, 420, 30, "ramadahotelcappadocia.com"],
  ["Sacred House", "Nevşehir", "Ürgüp", 38.63793, 34.91896, 3, "b", 23, 1, 20, 45, "sacredhouse.com.tr"],
  ["Utopia Cave Cappadocia", "Nevşehir", "Ürgüp", 38.63821, 34.90876, 3, "c", 75, 3, 100, 27, "utopiacave.com"],
  ["Uçhisar Kaya Otel Cappadocia", "Nevşehir", "Merkez", 38.62269, 34.71043, 4, "r", 77, 1, 80, 38, "uchisarkayaotel.com"],
  ["Ramada Plaza By Wyndham Ordu", "Ordu", "Altınordu", 40.99083, 37.88784, 5, "c", 113, 6, 1000, 17, "ramadaplazaordu.com"],
  ["Ramada Plaza by Wyndham Rize", "Rize", "Merkez", 41.02467, 40.52919, 5, "c", 290, 10, 665, 23, "ramadaplazarize.com"],
  ["Elite World Grand Sapanca", "Sakarya", "Sapanca", 40.69523, 30.2772, 5, "r", 501, 21, 1500, 90, "eliteworldhotels.com.tr"],
  ["NG Enjoy Hotel", "Sakarya", "Sapanca", 40.69756, 30.26641, 5, "r", 269, 10, 1000, 90, "nghotels.com.tr"],
  ["Ng Sapanca Hotel", "Sakarya", "Sapanca", 40.69312, 30.27211, 5, "r", 288, 14, 500, 90, "nghotels.com.tr"],
  ["Ramada By Wyndham Sapanca", "Sakarya", "Sapanca", 40.69333, 30.27262, 4, "r", 87, 1, 200, 27, "ramadaresortthermalsapanca.com"],
  ["Richmond Nua Sapanca", "Sakarya", "Sapanca", 40.6896, 30.26932, 5, "r", 131, 4, 280, 100, "richmondnua.com"],
  ["Sheraton Grand Samsun Hotel", "Samsun", "İlkadım", 41.28326, 36.33136, 5, "c", 221, 6, 650, 26, "sheratonsamsun.com"],
  ["Novotel Trabzon", "Trabzon", "Yomra", 41.00684, 39.70632, 5, "c", 200, 7, 400, 9, "novotel.com"],
  ["Double Tree By Hilton Van", "Van", "Edremit", 38.47913, 43.39979, 5, "c", 100, 6, 800, 5, "hilton.com"],
  ["Elite World Van", "Van", "İpekyolu", 38.49118, 43.39886, 5, "r", 230, 7, 400, 20, "ewhr.com"],
  ["Ramada By Wyndham Van", "Van", "Edremit", 38.48471, 43.37267, 4, "r", 74, 1, 75, 10, "ramadavan.com"],
  ["Dedeman Şanlıurfa", "Şanlıurfa", "Haliliye", 37.16548, 38.7974, 5, "c", 147, 3, 350, 37, "dedeman.com"],
  ["Hilton Garden Inn Şanlıurfa", "Şanlıurfa", "Eyyübiye", 37.15671, 38.79077, 5, "c", 159, 4, 400, 39, "hgi.com"]
];

const TYPE_OF: Record<string, Venue["type"]> = {
  c: "city_hotel", r: "resort", g: "congress_center",
  b: "boutique", m: "mountain_resort", a: "airport_hotel",
};

/* Isimden deterministik sayi — her calistirmada ayni sonuc */
function hashNum(s: string, lo: number, hi: number): number {
  let x = 0;
  for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0;
  return lo + ((x % 10000) / 10000) * (hi - lo);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ışğçöü]/g, (c) => ({ ı: "i", ş: "s", ğ: "g", ç: "c", ö: "o", ü: "u" })[c] ?? c)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const HOTEL_IMGS = ["hotel-1", "hotel-2", "hotel-3", "hotel-4", "hotel-5", "hotel-6", "hotel-7", "hotel-8"];
const HALL_IMGS = ["meeting-1", "meeting-2", "meeting-3", "meeting-4"];
const ROOM_IMGS = ["room-1", "room-2", "room-3", "room-4"];

const FEATURE_POOL = [
  "Free WiFi", "Business center", "Airport shuttle", "Spa & wellness",
  "Outdoor pool", "Fitness center", "On-site restaurant", "Parking",
  "Terrace", "Concierge", "Laundry service", "Sea view",
];

const seenSlugs = new Set<string>();

export const EXTRA_VENUES: Venue[] = ROWS.map((row, idx) => {
  const [name, city, district, lat, lng, starsRaw, tCode, rooms, halls, maxCap, airportKm, domain] = row;
  const type = TYPE_OF[tCode];
  const stars = (starsRaw >= 3 && starsRaw <= 5 ? starsRaw : 4) as Venue["stars"];
  let slug = slugify(name);
  while (seenSlugs.has(slug)) slug += "-2";
  seenSlugs.add(slug);

  const isResort = type === "resort" || type === "mountain_resort";
  const isCongress = type === "congress_center";
  const metroCity = ["Istanbul", "Ankara", "Izmir", "Bursa"].includes(city);

  const eventTypes: MiceEventType[] = ["corporate_meeting", "one_day", "workshop"];
  if (maxCap >= 500) eventTypes.push("congress");
  if (maxCap >= 200) eventTypes.push("symposium");
  if (isResort) eventTypes.push("incentive");
  if (maxCap >= 300 || isResort) eventTypes.push("gala");
  if (isCongress || maxCap >= 1200) eventTypes.push("exhibition");
  if (hashNum(name + "hy", 0, 1) < 0.3) eventTypes.push("hybrid");

  const transit: TransitAccess = isResort
    ? "transfer_only"
    : metroCity && !isCongress && hashNum(name + "tr", 0, 1) < 0.55
      ? "metro"
      : hashNum(name + "tr2", 0, 1) < 0.6
        ? "bus"
        : "taxi_only";

  const boardTypes: BoardType[] = isCongress
    ? []
    : isResort
      ? ["AI", "FB", "HB"]
      : ["BB", "HB"];

  const priceBase = isCongress
    ? null
    : stars === 5
      ? Math.round(hashNum(name + "pr", isResort ? 150 : 130, isResort ? 260 : 220))
      : stars === 4
        ? Math.round(hashNum(name + "pr", 85, 150))
        : Math.round(hashNum(name + "pr", 55, 95));

  const inspectionScore = Math.round(hashNum(name + "sc", 68, 93));
  const imgPool = isCongress ? HALL_IMGS : HOTEL_IMGS;
  const cover = imgPool[idx % imgPool.length];

  const meetingRooms: Venue["meetingRooms"] = [];
  if (halls > 0 && maxCap > 0) {
    meetingRooms.push({
      id: `x${idx}-m1`,
      name: "Main Hall",
      areaSqm: Math.max(60, Math.round(maxCap * 1.1)),
      ceilingHeight: maxCap >= 800 ? 7 : maxCap >= 300 ? 5 : 3.5,
      theatre: maxCap,
      classroom: Math.round(maxCap * 0.55),
      uShape: Math.min(80, Math.round(maxCap * 0.15)),
      banquet: Math.round(maxCap * 0.6),
      cocktail: Math.round(maxCap * 1.1),
      divisible: halls >= 4,
      features: ["Screen", "WiFi", "Sound system"],
    });
    if (halls >= 3) {
      meetingRooms.push({
        id: `x${idx}-m2`,
        name: "Meeting Room A",
        areaSqm: Math.max(40, Math.round(maxCap * 0.2)),
        ceilingHeight: 3,
        theatre: Math.round(maxCap * 0.2),
        classroom: Math.round(maxCap * 0.12),
        uShape: Math.min(40, Math.round(maxCap * 0.06)),
        banquet: Math.round(maxCap * 0.12),
        cocktail: Math.round(maxCap * 0.2),
        divisible: false,
        features: ["Screen", "WiFi"],
      });
    }
  }

  const featureCount = 4 + Math.floor(hashNum(name + "fc", 0, 3));
  const featStart = Math.floor(hashNum(name + "fs", 0, FEATURE_POOL.length));
  const features = Array.from({ length: featureCount }, (_, i) => FEATURE_POOL[(featStart + i) % FEATURE_POOL.length]);

  const desc = isCongress
    ? `Purpose-built meeting venue in ${district || city} with ${halls} halls and a capacity of up to ${maxCap.toLocaleString("en-US")} delegates.`
    : `${stars}-star ${isResort ? "resort" : "hotel"} in ${district ? `${district}, ` : ""}${city} with ${rooms} rooms${halls ? `, ${halls} meeting ${halls === 1 ? "room" : "rooms"}` : ""}${maxCap ? ` and space for up to ${maxCap.toLocaleString("en-US")} guests in its largest hall` : ""}.`;

  return {
    id: `x${idx + 1}`,
    slug,
    name,
    city,
    district: district || city,
    address: `${district ? `${district}, ` : ""}${city}, Türkiye`,
    domain,
    lat,
    lng,
    stars,
    type,
    boardTypes,
    totalRooms: rooms,
    meetingRoomCount: halls,
    maxTheatreCapacity: maxCap,
    airportDistanceKm: airportKm,
    cityCenterDistanceKm: Math.round(hashNum(name + "cc", 1, isResort ? 35 : 12)),
    referencePrice: priceBase,
    rating: Math.round(hashNum(name + "rt", 3.9, 4.8) * 10) / 10,
    reviewCount: Math.round(hashNum(name + "rc", 12, 220)),
    responseTimeHours: Math.round(hashNum(name + "rh", 6, 36)),
    isSponsored: false,
    isPopular: false,
    showcaseTags: [],
    specialOffer: null,
    description: desc,
    imageUrl: `/images/${cover}.jpg`,
    gallery: [
      `/images/${ROOM_IMGS[idx % ROOM_IMGS.length]}.jpg`,
      `/images/${HALL_IMGS[(idx + 1) % HALL_IMGS.length]}.jpg`,
    ],
    meetingRooms,
    roomTypes: [],
    features,
    // MICE inspection profili — deterministik heuristik
    budgetSegment: stars === 5 ? (hashNum(name + "bg", 0, 1) < 0.45 ? "luxury" : "upper") : stars === 4 ? "mid" : "economy",
    supportedEventTypes: eventTypes,
    transitAccess: transit,
    nearestMetro: null,
    inspectionScore,
    sustainabilityCertified: hashNum(name + "su", 0, 1) < 0.3,
    hybridStudio: hashNum(name + "hs", 0, 1) < 0.25,
    accessibleRooms: hashNum(name + "ac", 0, 1) < 0.7,
  };
});
