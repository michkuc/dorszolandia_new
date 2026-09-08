// Centralny katalog elementów strony. Aby dodać nowy element, dopisz tylko
// rekord tutaj i dodaj plik graficzny do assets/ — układ strony zostaje bez zmian.

export const navigation = [
  ['Odkrywaj', '#odkrywaj'], ['Graj', '#gry'], ['Twórz', '#kreator'],
  ['Czytaj', '#opowiadania'], ['Słuchaj', '#muzyka'], ['Kolekcja', '#sklep']
];

export const court = [
  ['krol', 'Król Dorsz', 'Król', '00', 'Czuwa nad pokojem i odwagą całej Dorszolandii.'],
  ['krolowa', 'Królowa Perła', 'Królowa', '01', 'Przypomina, że mądrość idzie w parze z życzliwością.'],
  ['rycerz', 'Sir Łuskarz', 'Rycerz', '02', 'Broni słabszych i dotrzymuje danego słowa.'],
  ['czarodziej', 'Mag Bąbel', 'Czarodziej', '03', 'Łączy magię z ciekawością i rozsądkiem.'],
  ['lucznik', 'Strzałka', 'Łucznik', '04', 'Trafia do celu, bo najpierw uważnie patrzy.'],
  ['blazen', 'Błazen Fikołek', 'Błazen', '05', 'Rozśmiesza dwór, lecz nigdy cudzym kosztem.'],
  ['mnich', 'Brat Muszel', 'Mnich', '06', 'Uczy spokoju i cierpliwego słuchania.'],
  ['kowal', 'Kowal Iskra', 'Kowal', '07', 'Naprawia to, co ważne, i tworzy nowe narzędzia.'],
  ['minstrel', 'Minstrel Nuta', 'Minstrel', '08', 'Pamięta melodie wszystkich wielkich wypraw.'],
  ['zielarka', 'Zielarka Koralka', 'Zielarka', '09', 'Zna podwodne rośliny i pomaga nimi mądrze.'],
  ['pisarz', 'Pisarz Atrament', 'Pisarz', '10', 'Zapisuje historie, aby żadna nie zniknęła.'],
  ['kupiec', 'Kupiec Muszla', 'Kupiec', '11', 'Wymienia się uczciwie i zawsze liczy dwa razy.'],
  ['straznik', 'Strażnik Rafa', 'Strażnik', '12', 'Pilnuje bram zamku i bezpieczeństwa gości.'],
  ['wojownik', 'Wojownik Grom', 'Wojownik', '13', 'Ćwiczy siłę po to, by chronić innych.'],
  ['zwiadowca', 'Zwiadowca Cień', 'Zwiadowca', '14', 'Pierwszy odkrywa nowe ścieżki i ostrzega drużynę.'],
  ['mysliwy', 'Myśliwy Trop', 'Myśliwy', '15', 'Tropi zagadki i zawsze dba o naturę.'],
  ['krzyzowiec', 'Krzyżowiec Fala', 'Krzyżowiec', '16', 'Jest wytrwały, pomocny i gotowy do drogi.'],
  ['pogromca-smokow', 'Pogromca Smoków Żar', 'Pogromca Smoków', '17', 'Stawia czoła smokom i własnym obawom.']
].map(([id, name, role, number, description]) => ({
  id, name, role, description, category: 'Dwór Króla',
  art: `generated/sredniowieczny-${number}.png`
}));

export const creatorProps = [
  ['korona', 'Korona', 'korona.webp', 82], ['helm', 'Hełm rycerza', 'helm.webp', 92],
  ['kapelusz-czarodzieja', 'Kapelusz czarodzieja', 'kapelusz-czarodzieja.webp', 96],
  ['kapelusz-pirata', 'Kapelusz pirata', 'kapelusz-pirata.webp', 94],
  ['czapka-kapitana', 'Czapka kapitana', 'czapka-kapitana.webp', 88],
  ['gogle', 'Gogle nurka', 'gogle.webp', 106], ['miecz', 'Miecz', 'miecz.webp', 105],
  ['tarcza', 'Tarcza', 'tarcza.webp', 100], ['luk', 'Łuk', 'luk.webp', 110],
  ['rozczka', 'Różdżka', 'rozdzka.webp', 98], ['pilka', 'Piłka', 'pilka.webp', 72],
  ['gitara', 'Gitara', 'gitara.webp', 116], ['bebnek', 'Bębenek', 'bebnek.webp', 100],
  ['trabka', 'Trąbka', 'trabka.webp', 104], ['aparat', 'Aparat', 'aparat.webp', 90],
  ['lornetka', 'Lornetka', 'lornetka.webp', 100], ['kotwica', 'Kotwica', 'kotwica.webp', 98],
  ['kolo', 'Koło ratunkowe', 'kolo.webp', 118], ['luneta', 'Luneta', 'luneta.webp', 110]
].map(([id, label, file, defaultSize]) => ({ id, label, src: `assets/props/${file}`, defaultSize }));

export const games = [
  { id: 'memory', title: 'Memory mieszkańców', icon: '🫧', description: 'Odkrywaj pary bohaterów.' },
  { id: 'quiz', title: 'Jaki to zawód?', icon: '❔', description: 'Dopasuj opis do mieszkańca.' },
  { id: 'goal', title: 'Bramkarz Dorsz', icon: '⚽', description: 'Obroń jak najwięcej strzałów.' },
  { id: 'detective', title: 'Detektyw Muszla', icon: '🔎', description: 'Wybierz przydatny rekwizyt.' },
  { id: 'code', title: 'Kod bąbelków', icon: '🔵', description: 'Zapamiętaj rosnącą sekwencję.' },
  { id: 'treasure', title: 'Skarby rafy', icon: '⭐', description: 'Odnajdź ukryte skarby.' }
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
