// Centralny katalog elementów strony. Aby dodać nowy element, dopisz tylko
// rekord tutaj i dodaj plik graficzny do assets/ — układ strony zostaje bez zmian.

export const navigation = [
  ['Odkrywaj', '#odkrywaj'], ['Graj', '#gry'], ['Twórz', '#kreator'],
  ['Czytaj', '#opowiadania'], ['Słuchaj', '#muzyka'], ['Kolekcja', '#sklep']
];

const driveImage = id => `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;

// Dane i nazwy zgodne z „Wielką Księgą Bohaterów Dorszolandii”.
// Atlas dworu jest odrębnym światem, nie miesza fabuł Borysa i Dorszusia.
export const court = [
  ['krol','Król Koralis I','Władca Dorszolandii','Rozważny władca, który po Wielkiej Burzy zjednoczył mieszkańców i do dziś słucha ich głosu.','1EcTTzoxD5tbmxRx7YvXrDpt9sZCnzuON'],
  ['krolowa','Królowa Perlena','Królowa i główna dyplomatka','Mądra dyplomatka, która wierzy, że rozmowa i współpraca są silniejsze niż spór.','1JXvHObwXW0fg3gdisabQtPP5Go-u0GvG'],
  ['rycerz','Sir Mieczopłetw','Rycerz Królewskiej Straży','Niezawodny obrońca pałacu i szlaków. Jego siłą są odwaga, honor i dotrzymane słowo.','17hgC6qrJ1hT4PDR7FLAN4KWbEAlm6KQK'],
  ['czarodziej','Mistrz Bąblomir','Czarodziej Głębin','Badacz magii bąbelków; z ciekawością testuje zaklęcia i szuka rozsądnych rozwiązań.','1vn43bqNGK8JuTtT108bDdOvKTx_SCSvM'],
  ['lucznik','Robin Wodorost','Leśny łucznik i obrońca szlaków','Czuwa nad Lasami Wodorostowymi i pomaga każdemu, kto zgubi drogę.','1fmkpM-U7oz6BnFBIltzEPQjOtCfWMGZh'],
  ['blazen','Plumcio Rozbawiony','Nadworny błazen','Rozładowuje napięcie dowcipem i przypomina, że śmiech może łączyć, a nie ranić.','1sig_30I5Ze2HGUJ6y5tCHt9FWYMf7w4U'],
  ['mnich','Brat Kapturion','Mnich i opiekun dawnych zapisów','Strzeże kronik i uczy, że cierpliwość pomaga zobaczyć to, czego inni nie zauważają.','1yCH2Y8mkZywhhRByNCLiyAXlRBZAwdwk'],
  ['kowal','Młotopłetwy','Królewski kowal i konstruktor','Naprawia narzędzia, buduje wynalazki i udowadnia, że dobry pomysł wymaga pracy.','1cTKydfFuUTji2yH60d0kBmmxOLlEeVJJ'],
  ['minstrel','Lutniak Czerwonopłetwy','Bard i wędrowny pieśniarz','Zbiera opowieści z całej krainy i zmienia je w pieśni, które pamięta cały dwór.','12BRlGT7vPouwnkmIzZtxWHA45rRALCXS'],
  ['zielarka','Siostra Muszelina','Zielarka i uzdrowicielka','Zna rośliny rafy, lecz przede wszystkim potrafi słuchać i spokojnie pomagać.','1-Uza2j3UYed4OG-DTjA2QHep61ndymdo'],
  ['pisarz','Profesor Atramentor','Kronikarz i uczony','Porządkuje wiedzę, sprawdza zapisy i przypomina, że historia jest wspólną pamięcią.','1RKxGL85l1Q7fZ7-LfvDijVwkHSSrdrdT'],
  ['kupiec','Sakiewiusz Złotobrzuch','Kupiec i handlarz dalekich mórz','Zna porty, szlaki i uczciwe zasady wymiany; zawsze pamięta, że zaufanie jest najcenniejsze.','1tgpIZUceVINtrsUPztj2Ul2ysdO9tBbt'],
  ['straznik','Wartownik Rafgard','Strażnik głównej bramy','Pilnuje bezpieczeństwa przy bramie zamku i wita gości z rozwagą oraz życzliwością.','1T-kkt9yCvn01o3mr0s6aK3Z3_jqAMzgQ'],
  ['wojownik','Jarl Śledziobrody','Wojownik i podróżnik Północnych Mórz','Doświadczony podróżnik, który dzieli się wiedzą o odległych morzach i odwadze w drodze.','1aQSD-mFG9Kk_mCNWKfb87eTNFXUOi2nP'],
  ['zwiadowca','Cień Fali','Zwiadowca i tajny posłaniec','Porusza się cicho, dostrzega szczegóły i przekazuje ważne wiadomości tam, gdzie trzeba.','1bB_lcnDKK3dWqy0udjrNJ25LrlANHAmb'],
  ['mysliwy','Rogalik Zielonopióry','Strażnik Lasów Wodorostowych','Zna ścieżki lasu wodorostów i dba, by przyroda oraz podróżnicy byli bezpieczni.','1Jr8P-RiNqNRdv9a-YkA5Tz2WjfhmXrlY'],
  ['krzyzowiec','Sir Białopłetwy','Strażnik Zakonu Białej Rafy','Wytrwały opiekun Białej Rafy, zawsze gotów wyruszyć z pomocą.','1_oeH2OAMCTbrikI94DVI8QaMrztNqOb2'],
  ['pogromca-smokow','Drakoryn i Pyrtek','Opiekun smoka morskiego i jego towarzysz','Opiekuje się morskim smokiem Pyrtkiem i uczy, że odwaga idzie w parze z troską.','13qfeqCQkVdG4UaZv-IniQvnK8WSQTQe2']
].map(([id, name, role, description, imageId]) => ({ id, name, role, description, category: 'Dwór Królewski', art: driveImage(imageId) }));

// Katalog źródłowy obejmuje 36 pozycji. Grafiki są podpinane w kolejnym kroku
// wyłącznie z osobnych plików źródłowych, bez automatycznego wycinania z arkusza.
const propArt = {
  ksiazka: driveImage('1ziobV72LPKSubv0L047V3bwFapRUPpwc'),
  plecak: driveImage('1pXDnvG_fiHFalhEaQzquy9elMLKFNQpC'),
  helm: driveImage('1cv_wTQD7bWP9Lw3sTRRR86qm2NDrml3X'),
  pilka: driveImage('1B-oAjeHoa77XuYUTmUJLqUBp4JSZlspW'),
  stetoskop: driveImage('1vPxwlDBLH4HOqKfWPCIT-BKwSBKk_zxU'),
  kontroler: driveImage('1fZ_YK6xqM7Fy6-aGEiEnMN6YDvH-myAZ'),
  czapka: driveImage('1NXOGJuK74ft-ksWc04RVKOjFYr9XaIbL'),
  aparat: driveImage('1gwjIRLcn80nB6se_gv8Pd5CdVELjuUxs')
};

export const creatorProps = [
  ['czapka','Czapka'],['korona','Korona'],['helm','Hełm'],['czapka-kapitana','Czapka kapitana'],['okulary','Okulary'],['maska-nurka','Maska nurka'],['sluchawki','Słuchawki'],['mucha','Mucha'],['plecak','Plecak'],['pilka','Piłka'],['lupa','Lupa'],['stetoskop','Stetoskop'],['ksiazka','Książka'],['mapa','Mapa'],['kompas','Kompas'],['aparat','Aparat'],['gitara','Gitara'],['pedzel','Pędzel'],['paleta','Paleta'],['latarka','Latarka'],['tablet','Tablet'],['mikroskop','Mikroskop'],['roslinka','Roślinka'],['odznaka','Odznaka'],['flaga','Flaga'],['gwizdek','Gwizdek'],['dzwonek','Dzwonek szkolny'],['bilet','Bilet na meduzotram'],['chronobabel','Chronobąbel'],['latarnia','Latarnia'],['puchar','Puchar'],['rakieta','Rakieta Koral-1'],['meduza','Świecąca meduza'],['ksiezyc','Nocny księżyc'],['narzedzia','Narzędzia Torpedy'],['stara-mapa','Stara mapa']
].map(([id, label]) => ({ id, label, src: propArt[id] || '', defaultSize: 112 }));

export const games = [
  { id: 'memory', title: 'Memory mieszkańców', icon: '🫧', description: 'Cel: odkryj sześć par bohaterów.' },
  { id: 'quiz', title: 'Jaki to zawód?', icon: '❔', description: 'Cel: dopasuj opis do właściwej ryby.' },
  { id: 'goal', title: 'Bramkarz Dorsz', icon: '⚽', description: 'Cel: obroń jak najwięcej piłek w 15 sekund.' },
  { id: 'detective', title: 'Detektyw Muszla', icon: '🔎', description: 'Cel: wybierz rekwizyt potrzebny w misji.' },
  { id: 'code', title: 'Kod bąbelków', icon: '🔵', description: 'Cel: odtwórz sekwencję bąbelków.' },
  { id: 'treasure', title: 'Skarby rafy', icon: '⭐', description: 'Cel: znajdź cztery ukryte skarby.' }
];

export const collection = [
  { id: 'koszulka', title: 'Koszulka Dorszolandia', type: 'odzież', art: '👕', note: 'Wzór przygotowany do kolekcji.' },
  { id: 'kubek', title: 'Kubek Borysa i Dorszusia', type: 'dom', art: '☕', note: 'Dla porannych planów i dobrych żartów.' },
  { id: 'przypinki', title: 'Przypinki mieszkańców', type: 'gadżety', art: '🫧', note: 'Zbierz ulubione postacie.' },
  { id: 'plakat', title: 'Plakat Dworu Króla', type: 'dekoracje', art: '👑', note: 'Pełny dwór: 18 postaci.' }
];

export const storyVolumeLabels = {
  1: { title: 'Tom 1', subtitle: 'Pierwsze przygody' },
  2: { title: 'Tom 2', subtitle: 'Nowe wyprawy Dorszusia i Borysa' }
};
