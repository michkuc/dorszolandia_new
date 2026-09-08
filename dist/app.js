import { residents, places, adventures, categoryOrder } from './data.js';
import { storyLibrary } from './stories.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const shuffle = array => [...array].sort(() => Math.random() - .5);

const modal = $('#modal');
const modalContent = $('#modalContent');
const toast = $('#toast');
let toastTimer;

const courtMembers = [
  { artIndex: 0, name: 'Król Dorsz Wielki', role: 'Gospodarz miasta', tagline: 'Prowadzi Radę Rafy i pyta mieszkańców, czego potrzebują.', story: 'Król codziennie spotyka się z mieszkańcami przy Placu Bąbelkowym. W jego zamku działa otwarta rada: można przynieść pomysł, prośbę albo dobrą wiadomość dla miasta.' },
  { artIndex: 1, name: 'Królowa Perła', role: 'Opiekunka miejskich świąt', tagline: 'Łączy tradycję, sztukę i wspólne działanie.', story: 'Królowa Perła organizuje koncerty, czytanie opowieści i akcje sąsiedzkie. Uważa, że miasto najlepiej działa wtedy, gdy każdy czuje, że jego głos jest ważny.' },
  { artIndex: 2, name: 'Kapitan Łuska', role: 'Koordynator bezpieczeństwa', tagline: 'Pilnuje bezpieczeństwa podczas wypraw i miejskich wydarzeń.', story: 'Kapitan Łuska ćwiczy z ekipą ratunkową i strażakami. Jego tarcza jest symbolem pomocy, a nie straszenia — najważniejsze jest zawsze spokojne działanie.' },
  { artIndex: 3, name: 'Doktor Bąbel', role: 'Doradca nauki', tagline: 'W zamkowej pracowni zamienia pytania w eksperymenty.', story: 'Doktor Bąbel nie rzuca zaklęć — sprawdza pomysły razem z Naukowcem Bąblem, aby mogły ułatwić życie w mieście i chronić ocean.' },
  { artIndex: 4, name: 'Kronikarz Atrament', role: 'Redaktor kroniki miasta', tagline: 'Zapisuje historie miasta i ważne pomysły mieszkańców.', story: 'Atrament prowadzi Kronikę Dorszolandii. Zapisuje w niej sukcesy, pytania i zabawne pomyłki, żeby każda kolejna ekipa mogła uczyć się z doświadczeń poprzedniej.' },
  { artIndex: 5, name: 'Gospodarz Muszelka', role: 'Opiekun Placu Bąbelkowego', tagline: 'Dba, by spotkania, wymiany i dostawy były uczciwe.', story: 'Muszelka zna mieszkańców po imieniu. Na placu pomaga znaleźć potrzebne rzeczy, wspiera młode pomysły Dorszusiów i pilnuje, by każdy handlował uczciwie.' }
];

const cityStories = [
  {
    id: 'pecherzyk', icon: '🫧', title: 'Wielka Afera z Pęcherzykiem',
    teaser: 'Król Dorsz traci Złoty Pęcherz, a Dorszuś, Borys i mówiący bąbel ruszają jego tropem.',
    people: ['Dorszuś', 'Borys', 'Bąbel Maksymalny', 'Król Dorsz', 'Krab Szczękacz', 'Rekin Filozof'],
    chapters: [
      ['Bąbel, który miał pomysł', 'Dorszuś budował w pracowni bąbelkową maszynę, gdy jeden z bąbli nagle przemówił. Przedstawił się bardzo poważnie jako Bąbel Maksymalny i od razu ogłosił, że miasto potrzebuje jego pomocy.', 'Na Placu Bąbelkowym czekał zmartwiony Król Dorsz. Z jego korony zniknął Złoty Pęcherz — pamiątka po pierwszym dniu Dorszolandii. Król poprosił przyjaciół o spokojne śledztwo, a Borys od razu sprawdził, czy da się to zrobić szybko.', '„Najpierw ustalimy, co wiemy” — powiedział Dorszuś i wyciągnął notes. Bąbel Maksymalny zrobił przy tym tak poważną minę, jak tylko może zrobić okrągły bąbel, a Borys obiecał pilnować, żeby śledztwo miało też odrobinę tempa.'],
      ['Trop z błyszczącej muszli', 'Bąbel Maksymalny zauważył błyszczący ślad prowadzący ku Zatoce Tajemnic. Po drodze Dorszuś zapisywał wskazówki, a Borys wypatrywał ich między wodorostami, żeby nie przeoczyć żadnej drobinki.', 'W zatoce spotkali Kraba Szczękacza. Krab przyznał, że znalazł pęcherz i zabrał go na chwilę do obejrzenia, lecz bąbel sam wypłynął z jego szczypiec. Ostatni raz widział go, jak leciał w stronę Rekina Filozofa.', 'Krab nie chciał zatrzymywać cudzej pamiątki — po prostu nie wiedział, do kogo należy. Dorszuś podziękował mu za szczerość, a Krab wskazał przyjaciołom spokojniejszy tunel przez wodorosty. To był pierwszy dowód, że pytanie bez oskarżania pomaga szybciej niż gniew.'],
      ['Rekin Filozof kicha', 'Rekin Filozof rzeczywiście miał Złoty Pęcherz, ale trzymał go wyłącznie dlatego, że podobał mu się jego blask. Dorszuś wyjaśnił, dlaczego pamiątka jest ważna dla całego miasta, a Borys zaproponował, by zamiast się kłócić, urządzić pokaz niezwykłych bąbli.', 'Rekin tak się roześmiał, że kichnął ogromną, całkiem bezpieczną chmurą bąbelków. Złoty Pęcherz wrócił prosto w płetwy Dorszusiów, a Bąbel Maksymalny oznajmił, że to był jego najlepiej zaplanowany przypadek.', 'Rekin Filozof przeprosił i zaproponował, że przygotuje dla miasta własną ozdobę: migoczący wianek z muszelek. „Najładniejsze rzeczy są lepsze, kiedy można się nimi dzielić” — zauważył. Borys przyznał, że to całkiem rozsądna myśl jak na rybę z tak wielkim kichnięciem.'],
      ['Oficjalni Bohaterowie Dorszolandii', 'Na zamkowym dziedzińcu Król Dorsz przypiął Dorszusowi i Borysowi małe odznaki Bohaterów Miasta. Krab Szczękacz dostał zaproszenie na spotkanie o uczciwym pożyczaniu skarbów, a Rekin Filozof obiecał przynosić własne dekoracje.', 'Od tego dnia Dorszuś i Borys wiedzieli, że dobra przygoda zaczyna się od pytania, a kończy wtedy, gdy każdy może wrócić do domu z uśmiechem. Bąbel Maksymalny uniósł się wyżej i powiedział: „Następna sprawa może być jeszcze bardziej bąbelkowa!”', 'Wieczorem na Placu Bąbelkowym zawisła tabliczka: „Znalezione? Zapytaj. Pożyczone? Oddaj. Wątpisz? Porozmawiaj”. Mieszkańcy uznali, że to świetna rada nie tylko dla skarbów, ale dla wszystkich ważnych spraw w Dorszolandii.']
    ]
  },
  {
    id: 'plecaki', icon: '🎒', title: 'Zagadka Znikających Plecaków',
    teaser: 'W Szkole Muszelka znikają plecaki. Trop prowadzi do Przystani Ucieczki i ważnej rozmowy.',
    people: ['Dorszuś', 'Borys', 'Pani Świecikora', 'Krab Krabiewicz', 'Zipperius Maximus'],
    chapters: [
      ['Alarm w Szkole Muszelka', 'Pani Świecikora, dyrektorka Szkoły Muszelka, wezwała Dorszusiów, gdy z szatni zaczęły znikać plecaki. Nie zginęły książki ani śniadania — zniknęły właśnie całe plecaki, jeden po drugim.', 'Dorszuś znalazł przy ostatniej ławce nitkę od zamka, a Borys zauważył małe ślady prowadzące ku Przystani Ucieczki. Wskazówka była prosta, ale zagadka wcale nie: dlaczego plecaki chciałyby uciekać ze szkoły?', 'Na tablicy w szatni ktoś zostawił wiadomość: „Nie jesteśmy magazynem wszystkiego!”. Pani Świecikora odczytała ją na głos, a uczniowie zaczęli przeglądać swoje torby. W kilku zmieściły się naraz książki, zabawki, trzy muszle i zupełnie niepotrzebny garnek do gotowania.'],
      ['Przystań Ucieczki', 'W ukrytej zatoce czekały dziesiątki plecaków. Przewodził im Zipperius Maximus, czerwony plecak z bardzo poważnym suwakiem. Powiedział, że plecaki nie chcą przeszkadzać rybkom — po prostu są zmęczone noszeniem zbyt wielu rzeczy naraz.', 'Dorszuś wysłuchał go bez przerywania. Borys chciał od razu wszystko spakować z powrotem, lecz zamiast tego zapytał, co można zrobić lepiej. To pytanie zadziałało mocniej niż najgłośniejszy rozkaz.', 'Zipperius wyjaśnił, że jego kieszenie były tak pełne, iż nie dało się już znaleźć nawet ołówka. Inne plecaki przytaknęły suwakami. Borys przyznał, że też czasem bierze za dużo „na wszelki wypadek”, a Dorszuś zapisał nową wskazówkę: dobra organizacja zaczyna się od sprawdzenia, co jest naprawdę potrzebne.'],
      ['Debata rybek i toreb', 'Do Przystani przypłynęli uczniowie, nauczyciele i nawet Krab Krabiewicz, który znał się na porządkowaniu rzeczy. Wspólnie ustalili, że do szkoły warto brać tylko potrzebne przedmioty, a resztę zostawić w klasowej półce wymiany.', 'Zipperius Maximus zgodził się na próbę. Dorszuś przygotował listę „mało, ale mądrze”, a Borys zaproponował dzień bez ciężkiego plecaka, podczas którego wszyscy sprawdzą, co naprawdę jest im potrzebne.', 'Krab Krabiewicz podzielił klasę na małe zespoły. Jedne układały rzeczy według dni, drugie oznaczały kieszenie kolorowymi muszelkami, a trzecie wymyślały, jak poprosić o pomoc, gdy zamek się zatnie. Nikt nie musiał być idealny — wszyscy mogli spróbować nowego sposobu.'],
      ['Medal za dobrą rozmowę', 'Nowy sposób zadziałał. Plecaki wróciły do szkoły lżejsze, uczniowie łatwiej znajdowali rzeczy, a w klasach było więcej miejsca na pomysły. Król Dorsz nazwał to Wielką Umową o Rozsądnym Pakowaniu.', 'Dorszuś i Borys nie dostali tym razem złotego pęcherza, lecz medal z napisem: „Najpierw słuchaj”. Borys uznał, że medal jest świetny, jeśli nie trzeba go nosić w plecaku. Zipperius Maximus zapiął suwak i roześmiał się pierwszy.', 'Od tamtej pory przy wejściu do Szkoły Muszelka stoi mały kosz na rzeczy do oddania i tablica z listą na jutro. Plecaki już nie uciekają, a kiedy któryś robi się za ciężki, uczniowie wiedzą, że zamiast się z nim złościć, można wspólnie znaleźć rozwiązanie.']
    ]
  },
  {
    id: 'algoria', icon: '🌊', title: 'Algoria Powraca',
    teaser: 'Trzy zakończone rozdziały o tajemniczej Aligorii, zbuntowanym pomniku i najdziwniejszym antytrendzie rafy.',
    people: ['Dorszuś', 'Borys', 'Księżniczka Algorytma', 'Pomnik Bąbel', 'Król Dorsz'],
    chapters: [
      ['Ryba z misją', 'Pewnego dnia Dorszuś i Borys znaleźli wiadomość podpisaną przez Algorię — krainę, która potrafi podsuwać pomysły szybciej niż prąd morski. Wiadomość zapraszała ich do rozwiązania zagadki, ale ostrzegała: nie każdy świetny pomysł jest dobry dla wszystkich.', 'Przyjaciele ruszyli razem, bo Dorszuś lubił rozumieć zasady, a Borys umiał zauważyć, kiedy zasady zaczynają przeszkadzać. Właśnie ta różnica miała uratować całe miasto.', 'List kończył się mapą z trzema migającymi punktami i dopiskiem: „Przyjdźcie bez gotowych odpowiedzi”. Dorszuś wziął notes, Borys latarkę, a Król Dorsz poprosił ich tylko o jedno: aby po drodze zapamiętali, co naprawdę chcą powiedzieć mieszkańcom po powrocie.'],
      ['Księżniczka Algorytma i zbuntowany pomnik', 'W centrum Algorii czekała Księżniczka Algorytma oraz Pomnik Bąbel, który otrzymał zbyt dużo poleceń naraz. Pomnik mówił bez przerwy, pokazywał wszystkim, co mają robić, i nie potrafił już zatrzymać własnego programu.', 'Dorszuś poprosił o instrukcję, Borys o przycisk pauzy, a księżniczka o chwilę ciszy. Kiedy połączyli te trzy rzeczy, Pomnik Bąbel usłyszał najważniejszą komendę: „Sprawdź, czy to pomaga”.', 'Pomnik zamilkł, a potem przeprosił za to, że zagłuszał cudze pomysły. Księżniczka Algorytma wyjaśniła, że jej wynalazki uczą się z poleceń, więc trzeba im dawać jasne i życzliwe zasady. Dorszuś dopisał do notesu: „Szybka odpowiedź nie zawsze jest mądrą odpowiedzią”.'],
      ['Algoria przejmuje śmiech', 'Po powrocie do Dorszolandii algorytm zaczął podpowiadać mieszkańcom te same mody, te same żarty i te same obrazki. Na początku wszyscy się śmiali, ale po chwili nikt nie miał już własnego pomysłu na zabawę.', 'Król Dorsz poprosił Dorszusiów o pomoc. Przyjaciele zrozumieli, że nie trzeba walczyć z technologią — trzeba nauczyć się korzystać z niej mądrze, z miejscem na rozmowę, twórczość i własne zdanie.', 'Na Placu Bąbelkowym rybki przestały pytać „co jest teraz najpopularniejsze?”, a zaczęły pytać „co nas naprawdę ciekawi?”. Naukowiec Bąbel przygotował prosty znak przy miejskich ekranach: zatrzymaj się, sprawdź źródło, porozmawiaj z kimś obok.'],
      ['Najdziwniejszy antytrend rafy', 'Borys wymyślił plan tak dziwny, że algorytm nie umiał go powtórzyć: Dzień Zupełnie Własnego Pomysłu. Jedni śpiewali pod wodą bez słów, inni budowali domki z muszli, a ktoś urządził konkurs na najwolniejszy taniec płetw.', 'Dorszuś dodał prostą zasadę: zanim coś udostępnisz, sprawdź, czy jest prawdziwe, życzliwe i czy naprawdę chcesz to powiedzieć. Algoria zwolniła, a w mieście znowu było słychać różne głosy.', 'Największe brawa dostała mała rybka, która zamiast kopiować cudzy pokaz, zaprosiła sąsiada do wspólnego rysowania mapy rafy. Borys uznał, że to lepsze niż tysiąc identycznych nagród, bo od jednego dobrego pomysłu może zacząć się prawdziwa przyjaźń.'],
      ['Dorszolandia po swojemu', 'Księżniczka Algorytma podziękowała Dorszusowi i Borysowi. Obiecała, że jej wynalazki będą pomagały, a nie decydowały za mieszkańców. Pomnik Bąbel otrzymał nowy, lepszy napis: „Myśl, pytaj, wybieraj”.', 'Historia skończyła się przy wspólnym pikniku na Placu Bąbelkowym. Borys wyłączył wszystkie powiadomienia na godzinę, Dorszuś zostawił sobie jedno pytanie na później, a Król Dorsz ogłosił, że najlepszy trend to taki, w którym każdy może być sobą.', 'Kiedy zapadł wieczór, Algoria wysłała ostatni, spokojny komunikat: „Dziękuję za lekcję”. Dorszuś i Borys wrócili do domu z przekonaniem, że narzędzia mogą być świetnymi pomocnikami, ale kierunek zawsze wybierają mieszkańcy Dorszolandii.']
    ]
  },
  {
    id: 'dzwon-portu', icon: '🔔', title: 'Dzwon, który nie chciał milczeć',
    teaser: 'W Porcie Muszelka dzwon wybija tajemnicze sygnały, a Dorszuś i Borys odkrywają, że miasto trzeba najpierw dobrze usłyszeć.',
    people: ['Dorszuś', 'Borys', 'Kapitan Fok', 'Listonosz Kropelka', 'Doktor Bąbel', 'Gospodarz Muszelka'],
    chapters: [
      ['Dwanaście dźwięków o świcie', 'O świcie nad Portem Muszelka rozległo się dwanaście dźwięków dzwonu. Nie oznaczały ani przypływu, ani przyjazdu statku, ani rozpoczęcia święta. Kapitan Fok sprawdził listę sygnałów i pokręcił płetwą: żadnego z nich nie powinno być o tej porze.', 'Dorszuś i Borys przypłynęli, gdy dzwon zadźwięczał po raz trzynasty. Listonosz Kropelka podał im trzy listy, które przez noc wypadły ze skrzynki: każdy miał na kopercie narysowaną małą nutę. „To nie przypadek” — uznał Dorszuś.', 'Borys chciał od razu wejść na wieżę, lecz najpierw spytał mieszkańców, co słyszeli. Piekarz Bułeczka usłyszał rytm podobny do przepisu, Pilot Wiatr — do sygnału startu, a Gospodarz Muszelka — do stukania muszli podczas zebrania rady.'],
      ['Wieża, która zbierała echa', 'Na szczycie wieży przyjaciele znaleźli nie zepsuty dzwon, ale małe urządzenie Doktora Bąbla. Miało ono wzmacniać ważne miejskie ogłoszenia, żeby każdy usłyszał je także w dalszej dzielnicy. Przez noc urządzenie zaczęło jednak zbierać wszystkie dźwięki portu naraz.', 'W szklanej kuli wirowały echa: śmiech, stukot skrzynek, ćwiczenie orkiestry i szept Kropelki, który próbował ułożyć listy według kolorów. Dzwon nie umiał zdecydować, który sygnał jest najważniejszy, więc powtarzał je wszystkie.', 'Dorszuś zauważył, że nuty na kopertach tworzą kolejność: najpierw informacja, potem pytanie, na końcu odpowiedź. Borys dodał, że nie każdą wiadomość trzeba ogłaszać całemu miastu. Niektóre lepiej przekazać spokojnie, jednej osobie lub małej grupie.'],
      ['Rada ciszy i dobrych wiadomości', 'Kapitan Fok zwołał krótkie spotkanie na molo. Mieszkańcy ustalili trzy proste sygnały: jeden dla bezpieczeństwa, jeden dla ważnej wspólnej wiadomości i jeden dla radosnego święta. Wszystkie inne informacje miały wracać do listów, rozmów i tablicy przy porcie.', 'Doktor Bąbel przeprogramował urządzenie, a Dorszuś sprawdzał każdy dźwięk w notesie. Borys prowadził próbę tak zabawnie, że nawet dzwon zdawał się czekać na kolejną komendę. Gdy sygnały brzmiały jasno, nikt nie musiał zgadywać, co się dzieje.', 'Najtrudniejsze okazało się zaplanowanie chwili ciszy. Gospodarz Muszelka przypomniał, że po ważnej wiadomości warto zostawić czas na pytania. Wtedy mieszkańcy nie tylko słyszą dźwięk, ale naprawdę rozumieją, co oznacza.'],
      ['Najpiękniejszy dźwięk portu', 'Wieczorem dzwon zadźwięczał raz, krótko i ciepło. To nie był alarm, lecz zaproszenie na wspólne podziękowanie dla wszystkich, którzy pomogli w zagadce. Kapitan Fok powiedział, że port działa najlepiej nie wtedy, gdy jest najgłośniejszy, ale kiedy każdy wie, gdzie znaleźć potrzebną wiadomość.', 'Kropelka rozdał mieszkańcom nowe znaczniki do listów, a Doktor Bąbel przyczepił do urządzenia tabliczkę: „Najpierw pomyśl, kto potrzebuje tej wiadomości”. Borys uznał, że tabliczka powinna mieć też drugi wers: „i czy na pewno trzeba dzwonić trzynaście razy”.', 'Dorszuś zapisał w kronice, że dobre komunikaty są krótkie, jasne i życzliwe. Potem wraz z Borysem usiedli na końcu molo. Tym razem słychać było tylko spokojne fale, pracę portu i ciche „dziękuję” płynące z wielu stron.']
    ]
  },
  {
    id: 'nocna-mapa', icon: '✨', title: 'Nocna Mapa Lasu Wodorostów',
    teaser: 'Świetliki z planktonu układają nad Lasem Wodorostów mapę, która prowadzi Dorszusia i Borysa do zapomnianego ogrodu.',
    people: ['Dorszuś', 'Borys', 'Ekolog Zielonek', 'Ogrodniczka Zielinka', 'Nurek Kropel', 'Królowa Perła'],
    chapters: [
      ['Światła między liśćmi', 'Pewnej spokojnej nocy Ekolog Zielonek zauważył, że plankton w Lesie Wodorostów świeci inaczej niż zwykle. Małe punkty światła nie tańczyły przypadkowo, tylko układały się w linie, łuki i strzałki. Zielonek poprosił Dorszusia i Borysa, aby pomogli odczytać niezwykłą mapę.', 'Dorszuś przyniósł przezroczystą kartkę, na której można było zaznaczać światła, a Borys przypiął do płetwy małą lampkę. Nurek Kropel ostrzegł ich tylko, aby płynęli powoli i nie dotykali roślin — nocni mieszkańcy lasu potrzebują spokoju.', 'Po chwili światła ułożyły pierwszą wskazówkę: „Nie szukaj najkrótszej drogi, szukaj drogi, po której nikt nie ucierpi”. Borys spojrzał na wąski skrót między młodymi wodorostami i bez wahania wybrał dłuższy, szeroki korytarz.'],
      ['Ogród, którego nie było na mapie', 'Świetlna trasa zaprowadziła przyjaciół do miejsca zasłoniętego wysokimi liśćmi. Za nimi znajdował się niewielki ogród koralowy, o którym nie wiedziała nawet Ogrodniczka Zielinka. Rosły w nim stare gatunki roślin, a między nimi pływały małe, przezroczyste rybki.', 'Na środku ogrodu stała kamienna misa z napisem: „Dla tych, którzy umieją obserwować”. Dorszuś zauważył, że rośliny są piękne, ale kilka z nich potrzebuje więcej światła. Borys znalazł w piasku ślady ciężkich skrzynek, które kiedyś zasłoniły wejście do ogrodu.', 'Zielinka wyjaśniła, że nie wolno po prostu przenieść wszystkiego bez planu. Trzeba najpierw sprawdzić, które rośliny są delikatne, którędy mogą przepłynąć mieszkańcy i jak ochronić małe rybki. Dorszuś zapisał kolejne pytania, a Borys zaczął liczyć bezpieczne miejsca na skrzynki.'],
      ['Plan dla żywego ogrodu', 'Następnego dnia mieszkańcy Lasu Wodorostów zebrali się na spokojnej akcji porządkowej. Nurek Kropel oznaczył trasę, którą można było przesunąć skrzynki, Ekolog Zielonek sprawdził, co da się wykorzystać ponownie, a Ogrodniczka Zielinka przygotowała nowe podpórki dla roślin.', 'Dorszuś prowadził listę zadań: najpierw odsunąć przeszkody, potem sprawdzić wodę, na końcu zostawić ogród w ciszy. Borys zajmował się zespołem małych pomocników i pilnował, aby każdy robił tyle, ile umie. Nikt nie ścigał się z czasem, bo ważniejsze było bezpieczeństwo ogrodu.', 'Gdy ostatnia skrzynka odpłynęła, promień księżyca dotarł do misy. Plankton rozbłysnął tak jasno, że mapa z poprzedniej nocy pojawiła się jeszcze raz. Tym razem zamiast strzałek pokazała rysunek wielu płetw trzymających się razem.'],
      ['Święto małych świateł', 'Królowa Perła zaprosiła mieszkańców na ciche Święto Małych Świateł. Nie było głośnych fajerwerków ani tłumu w ogrodzie — każdy przypłynął małą grupą, obejrzał rośliny z daleka i zostawił na tablicy jedną obietnicę dla oceanu.', 'Borys napisał: „Zanim wybiorę skrót, sprawdzę, komu może przeszkodzić”. Dorszuś dopisał: „Będę pytać, zanim coś zmienię”. Zielonek uśmiechnął się, bo właśnie o to chodziło w nocnej mapie: nie prowadziła do skarbu, tylko do lepszego sposobu wspólnego działania.', 'Od tamtej pory ogród ma nowe miejsce na Mapie Krainy. Kiedy plankton świeci nocą, mieszkańcy wiedzą, że przypomina im o uważności. A Dorszuś i Borys, wracając do domu, zgodnie uznali, że niektóre najcenniejsze odkrycia nie mieszczą się w kieszeni, tylko zostają w mieście na długo.']
    ]
  }
];

const residentProfileDetails = {
  lekarz: { day: 'Rano sprawdza szpitalną listę wizyt i rozmawia z każdym pacjentem po kolei.', team: 'Najczęściej współpracuje z Pielęgniarką Perłą i Ratownikiem Prądem.', favourite: 'Lubi spokojne herbatki z alg i dokładne pytania.' },
  pielegniarka: { day: 'Przygotowuje gabinet, przypomina o odpoczynku i zauważa, gdy ktoś potrzebuje dobrego słowa.', team: 'Tworzy z Doktorem Łuską zespół, który najpierw słucha, a potem działa.', favourite: 'Jej ulubione hasło brzmi: „Troska jest mała, ale bardzo ważna”.' },
  strazak: { day: 'Ćwiczy bezpieczne akcje ratunkowe, sprawdza sprzęt i odwiedza szkołę z lekcją o spokoju.', team: 'W Zatoce Tajemnic działa razem z Policjantem Falą i Ratownikiem Prądem.', favourite: 'Zbiera odblaskowe muszelki, bo dobrze widać je w ciemnej wodzie.' },
  policjant: { day: 'Pilnuje bezpiecznych tras, pomaga zagubionym rybkom i kieruje ruchem przy wielkich wydarzeniach.', team: 'Zna każdego strażnika rafy, a Kapitan Łuska uczy go nowych sygnałów.', favourite: 'Ma kieszonkową mapę wszystkich spokojnych skrótów.' },
  nauczyciel: { day: 'Zaczyna zajęcia od pytania dnia i zamienia odpowiedzi dzieci w małe badania.', team: 'Zaprasza do klasy Naukowca Bąbla, Artystkę Kropkę i każdego mieszkańca z ciekawą pracą.', favourite: 'Najbardziej lubi słowa: „Jeszcze nie umiem, ale spróbuję”.' },
  kucharz: { day: 'W porcie układa bezpieczne menu, gotuje dla załogi i nie marnuje żadnego dobrego składnika.', team: 'Rolnik Ziarenko przywozi mu rośliny, a Piekarz Bułeczka pomaga podczas świąt.', favourite: 'Prowadzi zeszyt z przepisami, w którym każda potrawa ma historię.' },
  astronauta: { day: 'Obserwuje niebo, naprawia małe modele rakiet i opowiada klasom o odległych planetach.', team: 'Z Naukowcem Bąblem sprawdza pomiary, a Pilot Wiatr pomaga mu planować wyprawy.', favourite: 'Przechowuje kamyk z meteorytu w pudełku po muszli.' },
  pilot: { day: 'Przed każdą trasą sprawdza mapę prądów, pogodę i listę bezpieczeństwa.', team: 'W porcie pracuje z Kapitanem Fokiem i Listonoszem Kopertką.', favourite: 'Kolekcjonuje małe chorągiewki z każdej odwiedzonej rafy.' },
  kapitan: { day: 'Prowadzi załogę, rozdziela zadania i zawsze pyta, czy każdy rozumie plan rejsu.', team: 'Pilot Wiatr planuje z nim trasę, a Ratownik Prąd dba o ćwiczenia bezpieczeństwa.', favourite: 'Mówi, że najlepszy kurs wybiera się wspólnie z załogą.' },
  budowlaniec: { day: 'Mierzy mosty, ogląda rafowe domy i sprawdza, czy wszystkie konstrukcje są wygodne oraz bezpieczne.', team: 'Inżynier Trybik rysuje z nim plany, a Architektka Plania podpowiada rozwiązania.', favourite: 'Ma pudełko z próbkami kamieni, muszli i wodoodpornych farb.' },
  inzynier: { day: 'Rozwiązuje techniczne zagadki i zamienia szkic w plan, który można naprawdę zbudować.', team: 'Pracuje z Budowniczym Rafą, Mechanikiem Śrubkiem i Programistką Bitką.', favourite: 'Zawsze nosi ołówek za płetwą, bo dobry pomysł może przypłynąć nagle.' },
  naukowiec: { day: 'Bada wodę, zapisuje wyniki i tłumaczy trudne odkrycia tak, aby każdy mógł je zrozumieć.', team: 'W Laboratorium Bąbel eksperymentuje z Astro Dorszem i Wynalazczynią Iskrą.', favourite: 'Jego najlepsze narzędzie to lupa i zdanie: „Sprawdźmy to”.' },
  programista: { day: 'Tworzy proste programy, testuje je krok po kroku i poprawia je, gdy coś nie działa.', team: 'Z Inżynierem Trybikiem buduje pomocne urządzenia dla miasta.', favourite: 'Cieszy go każdy błąd, który podpowiada, co można ulepszyć.' },
  artysta: { day: 'Maluję miejskie plakaty, dekoruje święta i zaprasza mieszkańców do wspólnego tworzenia.', team: 'Muzyk Rytmik dobiera melodie do jej wystaw, a Kronikarz Atrament zapisuje pomysły.', favourite: 'W jej pracowni wolno pobrudzić płetwy, jeśli potem się po sobie posprząta.' },
  muzyk: { day: 'Ćwiczy melodie, prowadzi rytmiczne zabawy i gra na miejskich spotkaniach.', team: 'Artystka Kropka projektuje scenę, a Tancerka Figa układa kroki do muzyki.', favourite: 'Potrafi usłyszeć rytm nawet w stukaniu muszelek o kamień.' },
  fotograf: { day: 'Dokumentuje ważne chwile, robi zdjęcia rafie i uczy, jak pytać o zgodę przed zrobieniem fotografii.', team: 'Reporterka Fala opisuje wydarzenia, a Kronikarz Atrament wybiera fotografie do kroniki.', favourite: 'Najbardziej lubi zdjęcia, na których ktoś pomaga komuś innemu.' },
  weterynarz: { day: 'Ogląda zwierzęta z rafy, uczy jak je obserwować i pomaga, gdy są osłabione.', team: 'Doktor Łuska konsultuje z nim trudniejsze sprawy, a Ekolog Zielonek dba o ich dom.', favourite: 'Zna imiona wielu małych morskich stworzeń mieszkających przy porcie.' },
  rolnik: { day: 'Pielęgnuje podwodne ogrody, zbiera plony i pilnuje, by nic się nie marnowało.', team: 'Kucharz Koral wykorzystuje jego zbiory, a Ogrodniczka Flora podpowiada nowe sadzonki.', favourite: 'Zawsze zostawia trochę roślin dla najmniejszych mieszkańców rafy.' },
  zolnierz: { day: 'Uczy odpowiedzialności, współpracy i spokojnego reagowania w trudnej sytuacji.', team: 'Podczas miejskich ćwiczeń działa z Kapitanem Łuską i Strażakiem Iskierką.', favourite: 'Lubi marsze w równym rytmie, po których jest czas na wspólne opowieści.' },
  sportowiec: { day: 'Trenuje na Płetwa Arenie i pokazuje młodszym rybkom, że ćwiczenie ma być bezpieczne oraz radosne.', team: 'Bramkarz Strzałek i Pływak Plusk pomagają mu prowadzić otwarte treningi.', favourite: 'Na końcu każdego meczu przypomina o podaniu płetwy rywalowi.' },
  podroznik: { day: 'Zbiera opowieści z różnych raf i zaznacza na mapie miejsca, których warto posłuchać, a nie tylko zobaczyć.', team: 'Kapitan Fok zabiera go w rejsy, a Reporterka Fala pyta o najciekawsze odkrycia.', favourite: 'Ma mapę, na której zamiast krzyżyków są małe dobre wspomnienia.' },
  fryzjer: { day: 'Pomaga mieszkańcom przygotować się do świąt i uczy, że wygląd ma dodawać odwagi, a nie odbierać swobodę.', team: 'Współpracuje z Artystką Kropką przy paradach i przedstawieniach.', favourite: 'Zna dziesięć sposobów na ozdobę z bezpiecznej wstążki z alg.' },
  ekolog: { day: 'Sprawdza czystość rafy, prowadzi akcje sprzątania i wyjaśnia, jak ograniczać odpady.', team: 'Nurek Kropel szuka śmieci w głębszej wodzie, a Rolnik Ziarenko opiekuje się roślinami.', favourite: 'Jego torba wielokrotnego użycia ma naszyty znaczek zielonej muszli.' },
  nurek: { day: 'Odwiedza głębsze zakątki oceanu, sprawdza rafę i przywozi ważne wieści dla miasta.', team: 'Ekolog Zielonek planuje z nim czyszczenie, a Ratownik Prąd ćwiczy bezpieczne sygnały.', favourite: 'Najbardziej ufa dobrej latarce, partnerowi i spokojnemu planowi.' },
  pilkarz: { day: 'Trenuje podania, pracę zespołową i pomaga młodszym rybkom poczuć radość z ruchu.', team: 'Bramkarz Strzałek i Sportowiec Fikołek organizują z nim turnieje fair play.', favourite: 'Liczy nie tylko gole, ale też udane podania do kolegi.' },
  koszykarz: { day: 'Ćwiczy celność i wymyśla zadania ruchowe, które można zrobić nawet na małej rafie.', team: 'Na Arenie spotyka Siatkarkę Falę i Pływaka Pluska.', favourite: 'Ma zwyczaj przed treningiem mówić: „Dziś spróbuję o jeden raz więcej”.' },
  siatkarka: { day: 'Prowadzi siatkarskie zabawy i pokazuje, że komunikacja w drużynie jest ważniejsza od wyniku.', team: 'Ćwiczy z Koszykarzem Obręczką i Sportowcem Fikołkiem.', favourite: 'Jej ulubiony sygnał to podniesiona płetwa oznaczająca: „Jestem gotowa pomóc”.' },
  tenisistka: { day: 'Ćwiczy refleks, uczy cierpliwości i przygotowuje krótkie mecze dla początkujących.', team: 'Trenuje na zmianę z Kolarzem Pędkiem, aby każdy mógł spróbować innego sportu.', favourite: 'Lubi, gdy piłka wraca wiele razy — to znaczy, że obie strony świetnie współpracują.' },
  plywak: { day: 'Prowadzi naukę pływania, oswaja z wodą i przypomina o zasadach bezpieczeństwa.', team: 'Ratownik Prąd czuwa przy zajęciach, a Nurek Kropel pokazuje podwodne ciekawostki.', favourite: 'Zna ćwiczenie oddechowe, które pomaga uspokoić się przed startem.' },
  kolarz: { day: 'Planuje bezpieczne trasy wokół rafy i zaprasza na wycieczki w spokojnym tempie.', team: 'Mechanik Śrubek sprawdza sprzęt, a Tenisistka Rakietka dołącza do przejażdżek.', favourite: 'Przed każdą trasą sprawdza trzy rzeczy: kask, drogę i towarzysza.' },
  szachistka: { day: 'Uczy, jak przewidywać kilka ruchów naprzód i jak z radością uczyć się po pomyłce.', team: 'Profesor Muszelka prowadzi z nią klub zagadek w Szkole Muszelka.', favourite: 'Mówi, że najlepszy ruch to czasem spokojne zastanowienie się.' },
  mechanik: { day: 'Naprawia rowerki, skrzynki i drobne urządzenia, zawsze najpierw sprawdzając, co się stało.', team: 'Inżynier Trybik przynosi mu plany, a Kolarz Pędek testuje naprawiony sprzęt.', favourite: 'Trzyma śrubki w muszli z przegródkami według wielkości.' },
  piekarz: { day: 'Wstaje wcześnie, piecze pachnące bułeczki i dzieli się nadwyżką podczas miejskich spotkań.', team: 'Kucharz Koral układa z nim świąteczne menu, a Rolnik Ziarenko dostarcza składniki.', favourite: 'Jego najpopularniejsza bułeczka ma kształt małej rybki.' },
  architektka: { day: 'Projektuje miejsca, w których łatwo się spotkać, odpocząć i bezpiecznie poruszać.', team: 'Budowniczy Rafa sprawdza z nią konstrukcje, a Królowa Perła wybiera projekty placów.', favourite: 'Szkicuje na przezroczystych kartkach, żeby zobaczyć budynek na tle rafy.' },
  ratownik: { day: 'Dyżuruje przy bezpiecznych trasach, ćwiczy pierwszą pomoc i reaguje bez paniki.', team: 'Współpracuje ze Strażakiem Iskierką, Pływakiem Pluskiem i Doktorem Łuską.', favourite: 'Nosi gwizdek, ale najważniejszy jest dla niego spokojny głos.' },
  listonosz: { day: 'Rozwozi listy, zaproszenia i podziękowania między dzielnicami Dorszolandii.', team: 'Pilot Wiatr pomaga mu w dalekich dostawach, a Kronikarz Atrament nadaje przesyłkom ważne pieczęcie.', favourite: 'Najbardziej cieszą go listy zaczynające się od słów: „Dziękuję, że…”.' },
  detektyw: { day: 'Zbiera wskazówki, zadaje uważne pytania i pomaga rozwiązywać drobne miejskie zagadki.', team: 'Dorszuś i Borys proszą go o poradę, gdy trop robi się zbyt kręty.', favourite: 'Ma lupę, ale mówi, że najważniejszą lupą jest ciekawość.' },
  wynalazczyni: { day: 'Buduje prototypy, testuje je bezpiecznie i poprawia, zanim pokaże je miastu.', team: 'Naukowiec Bąbel sprawdza jej pomysły, a Programistka Bitka pomaga je zaprogramować.', favourite: 'Jej warsztat ma szufladę „na pomysły, które jeszcze nie wiedzą, czym będą”.' },
  reporter: { day: 'Rozmawia z mieszkańcami, sprawdza informacje i pisze krótkie, zrozumiałe wiadomości.', team: 'Fotograf Migawka robi zdjęcia, a Kronikarz Atrament pomaga sprawdzać daty.', favourite: 'Zawsze pyta: „Skąd to wiemy?” zanim coś opowie dalej.' },
  ogrodniczka: { day: 'Pielęgnuje zielone zakątki, uczy sadzenia i dba o rośliny potrzebne rafie.', team: 'Rolnik Ziarenko dzieli się z nią sadzonkami, a Ekolog Zielonek planuje nowe ogrody.', favourite: 'Prowadzi kalendarz wzrostu roślin ozdobiony liśćmi.' },
  czytelnik: { day: 'Prowadzi kącik książek, poleca historie i uczy, jak szanować cudze opowieści.', team: 'Kronikarz Atrament dostarcza mu nowe zapisy, a Profesor Muszelka organizuje czytanie.', favourite: 'Przed snem wybiera jedną stronę, która daje mu nowe pytanie.' },
  majsterkowicz: { day: 'Tworzy z bezpiecznych materiałów małe przedmioty, naprawia je i pokazuje innym swoje pomysły.', team: 'Mechanik Śrubek dba o narzędzia, a Wynalazczyni Iskra pomaga w eksperymentach.', favourite: 'Najbardziej lubi projekty, które da się zrobić razem, a nie tylko oglądać.' }
};

const dorszopediaEntries = [
  { id: 'miasto', icon: '🏰', category: 'Miasto', title: 'Dorszolandia: stare i nowe razem', intro: 'Zamek jest sercem miasta, ale wokół niego działają szkoła, port, laboratorium i arena.', body: ['Dorszolandia jest współczesnym podwodnym miastem z królem i otwartym dworem. Król Dorsz nie rządzi samotnie: przy Placu Bąbelkowym spotyka się Rada Rafy, do której mieszkańcy mogą przynieść pytanie, pomysł albo prośbę.', 'W mieście tradycja oznacza pamiętanie o historii, a nowoczesność — szukanie nowych, bezpiecznych sposobów, by pomagać sobie i oceanowi. Dlatego w zamku jest kronika, a w laboratorium powstają pomysły na czystszą wodę.'], facts: ['Centrum miasta to Zamek Dorszolandii.', 'Najważniejsza zasada: każdy głos jest ważny.'] },
  { id: 'dwor', icon: '👑', category: 'Miasto', title: 'Współczesny dwór Króla Dorsza', intro: 'Dwór to nie rycerze z dawnych czasów, lecz zespół mieszkańców, który organizuje życie miasta.', body: ['Król Dorsz Wielki prowadzi spotkania Rady Rafy, Królowa Perła opiekuje się świętami, a Kapitan Łuska koordynuje bezpieczeństwo. Doktor Bąbel sprawdza pomysły naukowo, Kronikarz Atrament je zapisuje, a Gospodarz Muszelka dba o sprawy Placu Bąbelkowego.', 'Dwór słucha mieszkańców. Gdy dziecko ma pomysł na nową zabawę, a dorosły mieszkaniec zauważy problem w porcie, wiadomość może trafić do rady. Dobra decyzja powstaje wtedy, gdy najpierw się rozmawia.'], facts: ['Dwór ma sześć współczesnych ról.', 'Nie ma tu średniowiecznych mieszkańców.'] },
  { id: 'kumple', icon: '🫧', category: 'Bohaterowie', title: 'Dorszuś, Borys i Bąbel Maksymalny', intro: 'Dorszo-Kumple rozwiązują miejskie sprawy pytaniami, humorem i współpracą.', body: ['Dorszuś lubi porządkować wskazówki i pytać, zanim wyciągnie wniosek. Borys potrafi zauważyć, kiedy trzeba przyspieszyć, ale nauczył się też, że wysłuchanie drugiej strony bywa najszybszą drogą do rozwiązania.', 'Bąbel Maksymalny jest mówiącym bąblem z pracowni Dorszusiów. Czasem przesadza z dramatycznymi zapowiedziami, lecz zawsze przypomina przyjaciołom, że w dobrej przygodzie nikt nie zostaje sam.'], facts: ['Ich opowieści dzieją się we współczesnej Dorszolandii.', 'Znajdziesz je w Bibliotece Dorszolandii.'] },
  { id: 'mieszkancy', icon: '🐟', category: 'Mieszkańcy', title: 'Mieszkańcy i ich talenty', intro: 'Każda rybka ma własny talent, zawód, miejsce na mapie i historię.', body: ['W Dorszolandii mieszkają osoby pracujące dla zdrowia, bezpieczeństwa, nauki, transportu, kultury, sportu i przyrody. Zawód nie określa wszystkiego — pomaga tylko opowiedzieć, jak ktoś wspiera innych.', 'Otwórz kartę mieszkańca, aby zobaczyć jego ilustrację, codzienną pracę, współpracowników, ciekawostkę i zadanie. Dzięki temu można odkrywać różne zainteresowania bez oceniania, które z nich jest „najlepsze”.'], facts: [`W mieście jest ${residents.length} opisanych mieszkańców.`, 'Każdy profil prowadzi do miejsca na mapie.'] },
  { id: 'mapa', icon: '🗺️', category: 'Miasto', title: 'Jak czytać Mapę Krainy', intro: 'Mapa łączy historie, mieszkańców i miejsca do odkrycia.', body: ['Kliknij punkt na mapie, aby dowiedzieć się, co się dzieje w danej dzielnicy. Szkoła Muszelka to miejsce pytań, Szpital Pod Złotą Łuską to pomoc i troska, a Port Muszelka łączy Dorszolandię z dalszymi rafami.', 'Zamek Dorszolandii jest miejscem spotkań Rady Rafy, Las Wodorostów uczy troski o przyrodę, a Zatoka Tajemnic kryje zadania dla uważnych odkrywców. Mapa nie jest dekoracją — każde miejsce otwiera własny opis i misję.'], facts: ['Mapa ma osiem interaktywnych miejsc.', 'Misje można wykonywać bez logowania i bez zakupów.'] },
  { id: 'ocean', icon: '🌊', category: 'Ocean', title: 'Czysta rafa, bezpieczna woda', intro: 'Rafa jest domem dla wielu stworzeń, dlatego każdy mieszkaniec może jej pomagać.', body: ['Najprostsze działania mają znaczenie: nie zostawiaj śmieci, oszczędzaj wodę, korzystaj wielokrotnie z tych samych rzeczy i pytaj dorosłych, jak bezpiecznie sortować odpady. W Dorszolandii Ekolog Zielonek i Nurek Kropel prowadzą takie akcje razem z mieszkańcami.', 'Przy wodzie obowiązuje też zasada troski o siebie. Pływak Plusk i Ratownik Prąd przypominają, że zabawa jest najlepsza wtedy, gdy odbywa się w bezpiecznym miejscu i pod opieką dorosłych.'], facts: ['Nie dotykaj dzikich zwierząt bez potrzeby.', 'W razie zagrożenia poproś dorosłego o pomoc.'] },
  { id: 'zawody', icon: '🧰', category: 'Mieszkańcy', title: 'Zawody są różne i potrzebne', intro: 'Lekarz, artystka, mechanik czy ogrodniczka — każdy zawód wnosi coś ważnego.', body: ['Niektóre zawody pomagają bezpośrednio w nagłych sytuacjach, inne budują, uczą, tworzą, naprawiają albo sprawiają, że miasto jest przyjemniejsze. W Dorszolandii mieszkańcy często łączą siły, bo żadna duża sprawa nie jest zadaniem jednej rybki.', 'Karta mieszkańca nie mówi, kim musisz zostać. Jest zaproszeniem, aby zauważyć, co lubisz robić, czego chcesz się nauczyć i jak możesz pomagać innym po swojemu.'], facts: ['Można mieć wiele zainteresowań naraz.', 'Pytania o pracę to dobry początek rozmowy.'] },
  { id: 'historie', icon: '📚', category: 'Bohaterowie', title: 'Jak czytać opowiadania Dorszo-Kumpli', intro: 'Biblioteka ma 20 historii, a archiwum zachowuje także wersję źródłową 1:1.', body: ['Biblioteka zawiera 20 ukończonych historii o Złotym Pęcherzu, znikających plecakach, Algorii, nocnym meduzotramie, kosmosie i wielu innych przygodach. Każdy tytuł jest podzielony na cztery rozdziały, więc można wrócić do czytania w dogodnym momencie.', 'W sekcji Opowiadania znajduje się też wyraźnie oznaczone archiwum PDF i dokument źródłowy. To one są punktem odniesienia dla wersji 1:1; nie mieszamy ich z nowym cyklem 20 historii.'], facts: ['20 historii w bibliotece.', 'Archiwum źródłowe 1:1 jest dostępne bez skracania.', 'Dorszuś i Borys są częścią miasta Króla Dorsza.'] },
  { id: 'czytanie', icon: '📖', category: 'Bohaterowie', title: 'Pełna historia, nie skrót', intro: 'Opowiadania są w osobnym pliku biblioteki i łatwo dopisać do nich kolejny tom.', body: ['Każdy tytuł zawiera metadane, bohaterów, czas czytania i rozdziały z pełnymi akapitami. Dzięki temu karta na stronie, modal biblioteki i czytnik korzystają z tych samych danych — nie trzeba kopiować tekstu w kilku miejscach.', 'Nową opowieść można dodać jako kolejny obiekt w pliku stories.js. Wystarczy wpisać tytuł, opis, postacie, obrazek okładkowy i rozdziały. Strona automatycznie pokaże ją na półce oraz w bibliotece.'], facts: ['Każdy rozdział można czytać osobno.', 'Biblioteka nie wymaga logowania ani pobierania aplikacji.'] },
  { id: 'cyfrowy-swiat', icon: '🖥️', category: 'Technologia', title: 'Algoria i dobre technologie', intro: 'Ekran może pomagać, jeżeli daje wybór, przerwę i jasną informację.', body: ['Algoria uczy mieszkańców trzech cyfrowych pytań: czy to jest potrzebne, czy wiem, kto to zobaczy oraz czy mogę łatwo przerwać? To samo dotyczy gier, filmów, powiadomień i udostępniania cudzych treści.', 'Gdy coś w internecie wydaje się bardzo pilne, śmieszne lub zaskakujące, warto zrobić pauzę i zapytać zaufanego dorosłego. To nie psuje zabawy — pomaga wybrać bezpieczniejszy sposób działania.'], facts: ['Nie każda liczba polubień oznacza dobrą wiadomość.', 'Przerwa od ekranu to część mądrego korzystania.'] },
  { id: 'rada-rafy', icon: '🗣️', category: 'Miasto', title: 'Jak działa Rada Rafy', intro: 'Do Króla i jego dworu można przynieść pytanie, pomysł albo prośbę o pomoc.', body: ['Rada Rafy spotyka się w Sali Map. Najpierw ktoś przedstawia sprawę, potem mieszkańcy mogą dopytać, a na końcu zespół zapisuje prosty plan. Jeśli potrzebna jest wiedza, Doktor Bąbel sprawdza fakty. Jeśli sprawa dotyczy wydarzenia, Królowa Perła pyta, czy każdy będzie mógł w nim uczestniczyć.', 'Nie trzeba mówić najgłośniej, aby zostać wysłuchanym. Można napisać pytanie, poprosić kogoś o pomoc w przedstawieniu pomysłu albo najpierw porozmawiać z Gospodarzem Muszelką na placu.'], facts: ['Król jest mieszkańcem i gospodarzem miasta.', 'Dwór jest kategorią wśród mieszkańców, a nie osobnym średniowiecznym światem.'] },
  { id: 'wspolpraca', icon: '🤝', category: 'Wartości', title: 'Cztery zasady Dorszolandii', intro: 'Przyjaźń, ciekawość, współpraca i troska o ocean prowadzą mieszkańców przez codzienne sprawy.', body: ['Przyjaźń oznacza zauważanie innych. Ciekawość oznacza zadawanie pytań. Współpraca oznacza dzielenie się zadaniami i słuchanie różnych pomysłów. Troska o ocean oznacza wybieranie działań, które nie szkodzą wspólnemu domowi.', 'Nie trzeba umieć wszystkiego, żeby należeć do zespołu. W Dorszolandii można poprosić o pomoc, zmienić zdanie i uczyć się na błędach — to właśnie część dobrej przygody.'], facts: ['Pytanie jest ważniejsze od udawania, że wszystko się wie.', 'Pomoc może być mała i nadal bardzo potrzebna.'] },
  { id: 'slownik', icon: '🔎', category: 'Ocean', title: 'Mały słownik rafy', intro: 'Kilka słów, które przydają się podczas wypraw po Dorszolandii.', body: ['Rafa to podwodny dom wielu organizmów. Prąd to ruch wody, który może pomagać w podróży, ale czasem zmienia trasę. Plankton to maleńkie organizmy unoszące się w wodzie. Muszla to twarda osłona niektórych morskich zwierząt.', 'Gdy napotkasz nieznane słowo, sprawdź je w książce, zapytaj dorosłego albo poszukaj odpowiedzi razem z nauczycielem. Dorszopedia ma być początkiem ciekawości, a nie ostatnim zdaniem.'], facts: ['Wiedza rośnie, gdy ją sprawdzamy.', 'Oceany są połączone z życiem na całej Ziemi.'] },
  { id: 'bezpieczenstwo', icon: '🛟', category: 'Ocean', title: 'Bezpieczna wyprawa pod wodę', intro: 'Najlepsza przygoda jest zaplanowana i odbywa się z pomocą dorosłych.', body: ['Przed wyprawą warto ustalić, dokąd idziemy, z kim jesteśmy i kiedy wracamy. Należy słuchać instrukcji opiekuna, używać odpowiedniego sprzętu i nie oddalać się samemu od grupy.', 'W Dorszolandii Kapitan Łuska, Ratownik Prąd i Strażak Iskierka ćwiczą takie zasady razem z mieszkańcami. W prawdziwym świecie zawsze proś dorosłego o pomoc, jeśli czujesz się niepewnie albo widzisz zagrożenie.'], facts: ['Nie wchodź do wody bez opieki dorosłego.', 'W razie problemu mów wyraźnie i od razu.'] },
  { id: 'start', icon: '✨', category: 'Miasto', title: 'Od czego zacząć przygodę?', intro: 'Wybierz jeden trop i odkrywaj Dorszolandię po swojemu.', body: ['Jeśli lubisz postacie, zacznij od mieszkańców i ich kart. Jeśli lubisz podróże, kliknij Mapę Krainy. Jeśli chcesz przeczytać dłużej, wejdź do Biblioteki Dorszolandii. A jeśli masz własny pomysł, użyj Kreatora Dorsza i ułóż swój bezpieczny strój z rekwizytów.', 'Nie ma złej kolejności. Wszystkie ścieżki prowadzą do tego samego miasta, w którym pytania są mile widziane, a pomysły można rozwijać razem z innymi.'], facts: ['Kreator działa myszką i dotykiem.', 'Gry są krótkie i nie wymagają konta.'] }
];

const placeGuides = {
  szkola: { eyebrow: 'Dzielnica pytań', intro: 'Szkoła Muszelka to pełna, otwierana opowieść o uczeniu się bez pośpiechu.', sections: [['Co dzieje się każdego dnia?', 'Profesor Muszelka zaczyna od pytania, nie od gotowej odpowiedzi. W klasach są stoliki do doświadczeń, kącik czytelniczy i plansza „Jeszcze nie umiem”, na której można zapisać rzecz do przećwiczenia.'], ['Jak można tu pomóc?', 'Można podzielić się odkryciem, wytłumaczyć coś młodszej rybce albo spokojnie poprosić o wyjaśnienie. W Szkole Muszelka błąd nie jest powodem do wstydu — jest wskazówką, co sprawdzić dalej.']], takeaway: 'Najważniejsze zdanie szkoły: „Pytanie otwiera drogę”.' },
  szpital: { eyebrow: 'Dzielnica troski', intro: 'Szpital Pod Złotą Łuską jest miejscem wiedzy, spokoju i życzliwego wsparcia.', sections: [['Co dzieje się każdego dnia?', 'Doktor Łuska i Pielęgniarka Perła najpierw pytają, jak ktoś się czuje, a potem pomagają dobrać bezpieczne działanie. W sali odpoczynku można usiąść obok bliskiej rybki i nabrać odwagi.'], ['Jak można tu pomóc?', 'Dobre słowo, spokojne wskazanie dorosłego i zadbanie o własny odpoczynek są równie ważne jak wiedza. Gdy sprawa jest pilna, mieszkańcy nie działają sami — proszą o pomoc zaufanych dorosłych.']], takeaway: 'Troska zaczyna się od uważnego pytania: „Czego potrzebujesz?”.' },
  arena: { eyebrow: 'Dzielnica ruchu', intro: 'Płetwa Arena jest miejscem treningów, prób i fair play — nie tylko wygrywania.', sections: [['Co dzieje się każdego dnia?', 'Na arenie odbywają się krótkie zajęcia z pływania, piłki, tenisa i spokojnych ćwiczeń. Każdy może wybrać tempo odpowiednie dla siebie, a przed startem sprawdza się sprzęt i zasady.'], ['Jak można tu pomóc?', 'Dobra drużyna cieszy się z udanego podania, pociesza po nieudanej próbie i daje każdemu szansę. Bramkarz Strzałek mówi, że najlepsza obrona zaczyna się od dobrej współpracy.']], takeaway: 'Wynik jest chwilą, a fair play zostaje na dłużej.' },
  laboratorium: { eyebrow: 'Dzielnica odkryć', intro: 'W Laboratorium Bąbel pomysły przechodzą drogę od pytania do bezpiecznego testu.', sections: [['Co dzieje się każdego dnia?', 'Naukowiec Bąbel, Inżynier Trybik i Wynalazczyni Iskra zapisują hipotezy, budują małe modele i porównują wyniki. Nic nie trafia do miasta, zanim nie zostanie kilka razy sprawdzone.'], ['Jak można tu pomóc?', 'Wystarczy zauważyć problem, opisać go jasno i zaproponować mały test. Jeśli coś nie działa, laboratorium nie mówi „porażka”, tylko „mamy nową wskazówkę”.']], takeaway: 'Dobry wynalazek pomaga, jest bezpieczny i można go wyjaśnić.' },
  port: { eyebrow: 'Dzielnica wypraw', intro: 'Port Muszelka łączy Dorszolandię z innymi rafami i dba o jasną komunikację.', sections: [['Co dzieje się każdego dnia?', 'Kapitan Fok układa trasy, Pilot Wiatr sprawdza warunki, a Listonosz Kropelka rozwozi wiadomości. Przy molo można obejrzeć mapę prądów i listę rzeczy potrzebnych przed wyprawą.'], ['Jak można tu pomóc?', 'Przed podróżą warto ustalić trasę, towarzyszy i powrót. W porcie mieszkańcy mówią jasno, dla kogo jest wiadomość i czy naprawdę wymaga głośnego alarmu.']], takeaway: 'Najlepsza wyprawa jest dobrze zaplanowana i ma czas na pytania.' },
  las: { eyebrow: 'Dzielnica żywej rafy', intro: 'Las Wodorostów to zielona część miasta, w której przyroda i mieszkańcy uczą się żyć razem.', sections: [['Co dzieje się każdego dnia?', 'Ekolog Zielonek sprawdza wodę, Ogrodniczka Zielinka pielęgnuje rośliny, a Nurek Kropel obserwuje głębsze zakątki lasu. Wiele miejsc jest wyznaczonych jako spokojne strefy dla małych stworzeń.'], ['Jak można tu pomóc?', 'Nie zostawiaj śmieci, nie dotykaj zwierząt bez potrzeby i wybieraj drogę, która nie niszczy młodych roślin. Najlepszym skarbem lasu jest miejsce, które zostaje zdrowe dla następnych mieszkańców.']], takeaway: 'Przyroda potrzebuje nie hałasu, lecz uważności.' },
  zatoka: { eyebrow: 'Dzielnica zagadek', intro: 'Zatoka Tajemnic jest bazą dla osób, które obserwują, szukają tropów i bezpiecznie odkrywają głębiny.', sections: [['Co dzieje się każdego dnia?', 'Detektyw Trop zbiera wskazówki, Reporter Fala sprawdza informacje, a Policjant Fala i Strażak Iskierka pomagają utrzymać bezpieczne trasy. Zatoka ma też tablicę „Co wiemy? Czego nie wiemy?”.'], ['Jak można tu pomóc?', 'Nie zgaduj od razu. Zapisz trop, zapytaj świadka, sprawdź drugie źródło i dopiero potem wyciągnij wniosek. To zasada Dorszusia, z której korzysta cała zatoka.']], takeaway: 'Ciekawość jest najlepsza wtedy, gdy idzie razem z ostrożnością.' },
  zamek: { eyebrow: 'Serce miasta', intro: 'Zamek Dorszolandii łączy historię miasta z pracą współczesnego dworu Króla Dorsza.', sections: [['Co dzieje się każdego dnia?', 'W Sali Map spotyka się Rada Rafy, Kronikarz Atrament zapisuje ważne sprawy, a Królowa Perła przygotowuje święta i wydarzenia dla mieszkańców. Zamek nie jest zamknięty — można tu przynieść pytanie albo propozycję dla miasta.'], ['Jak można tu pomóc?', 'Dobry pomysł należy opisać jasno, wysłuchać innych i wspólnie sprawdzić, czy nikogo nie pomija. Król Dorsz przypomina, że rada nie potrzebuje najgłośniejszego głosu, tylko mądrego rozwiązania.']], takeaway: 'Tradycja to pamięć, a przyszłość to wspólne działanie.' }
};

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

function openModal(markup) {
  modalContent.innerHTML = markup;
  if (!modal.open) modal.showModal();
  modal.scrollTop = 0;
}

function closeModal() { if (modal.open) modal.close(); }

function residentById(id) { return residents.find(resident => resident.id === id); }

function residentArtwork(person, alt = '') {
  const badge = person.badge ? `<span class="resident-badge" aria-hidden="true">${escapeHtml(person.badge)}</span>` : '';
  return `<img src="assets/${person.art}" alt="${escapeHtml(alt)}" loading="lazy" />${badge}`;
}

function renderResidents() {
  const grid = $('#residentGrid');
  const filters = $('#categoryFilters');
  let selectedCategory = 'Wszystkie';
  let showAll = false;
  const render = () => {
    filters.innerHTML = categoryOrder.map(category => `<button type="button" class="filter-button ${category === selectedCategory ? 'is-active' : ''}" data-category="${category}">${category}</button>`).join('');
    const matching = selectedCategory === 'Wszystkie' ? residents : residents.filter(person => person.category === selectedCategory);
    const visible = showAll || selectedCategory !== 'Wszystkie' ? matching : matching.slice(0, 8);
    grid.innerHTML = visible.map(person => `
      <button class="resident-card" type="button" data-resident="${person.id}" aria-label="Otwórz profil: ${person.name}, ${person.role}">
        <div class="resident-art">${residentArtwork(person)}</div><h3>${person.name}</h3><p>${person.tagline}</p>
      </button>`).join('');
    const button = $('#showAllResidents');
    button.textContent = showAll ? 'Pokaż wybrane 8 mieszkańców' : `Zobacz wszystkich ${residents.length} mieszkańców →`;
  };
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    selectedCategory = button.dataset.category;
    showAll = selectedCategory !== 'Wszystkie';
    render();
  });
  $('#showAllResidents').addEventListener('click', () => { showAll = !showAll; selectedCategory = 'Wszystkie'; render(); });
  grid.addEventListener('click', event => {
    const card = event.target.closest('[data-resident]');
    if (card) openResident(card.dataset.resident);
  });
  render();
}

function openResident(id) {
  const person = residentById(id);
  if (!person) return;
  const details = residentProfileDetails[id] || { day: 'Każdego dnia wykorzystuje swój talent, aby Dorszolandia była lepszym miejscem.', team: 'Współpracuje z mieszkańcami swojej dzielnicy.', favourite: 'Najbardziej ceni ciekawość i życzliwe pytania.' };
  openModal(`<article class="profile-modal"><div class="profile-art">${residentArtwork(person, `Ilustracja: ${person.name}`)}</div><div><p class="modal-eyebrow">${person.category} · ${person.place}</p><h2>${person.name}</h2><p><strong>${person.role}</strong> — ${person.tagline}</p><h3>Historia mieszkańca</h3><p>${person.story}</p><h3>Na czym polega jego rola?</h3><p>${person.roleText}</p><section class="resident-detail-card"><h3>Jego dzień w Dorszolandii</h3><p>${details.day}</p><div class="resident-detail-grid"><div><strong>Współpracuje z</strong><span>${details.team}</span></div><div><strong>Lubi</strong><span>${details.favourite}</span></div></div></section><div class="fact-box"><strong>Ciekawostka:</strong> ${person.fact}</div><div class="mission-box"><strong>Zadanie dla Ciebie:</strong> ${person.task}</div><button class="button button-sun button-small modal-place-button" data-place-open="${places.find(place => place.name === person.place)?.id || ''}" type="button">Poznaj jego miejsce w Dorszolandii →</button></div></article>`);
}

const pinPositions = {
  szkola: [20, 26], szpital: [43, 24], arena: [62, 27], laboratorium: [80, 26],
  port: [17, 73], las: [38, 75], zatoka: [61, 74], zamek: [82, 72]
};

function renderMap() {
  const pins = $('#mapPins');
  pins.innerHTML = places.map(place => {
    const [left, top] = pinPositions[place.id];
    return `<button class="map-pin" type="button" data-place="${place.id}" style="left:${left}%;top:${top}%"><span class="pin-icon">${place.icon}</span><span class="pin-label">${place.name.replace(' Dorszolandii', '')}</span></button>`;
  }).join('');
  pins.addEventListener('click', event => { const pin = event.target.closest('[data-place]'); if (pin) openPlace(pin.dataset.place); });
}

function openPlace(id) {
  const place = places.find(item => item.id === id);
  if (!place) return;
  const people = place.people.map(residentById).filter(Boolean);
  const guide = placeGuides[id] || { eyebrow: 'Miejsce na mapie', intro: place.description, sections: [], takeaway: '' };
  openModal(`<article class="story-modal place-guide"><p class="modal-eyebrow">${guide.eyebrow}</p><h2>${place.icon} ${place.name}</h2><p class="place-lead">${guide.intro}</p><div class="place-reading">${guide.sections.map(([title, body]) => `<section><h3>${title}</h3><p>${body}</p></section>`).join('')}</div><h3>Kto tu działa?</h3><div class="modal-people">${people.map(person => `<button type="button" class="modal-person" data-resident-open="${person.id}">${person.name}</button>`).join('')}</div><div class="mission-box"><strong>Misja:</strong> ${place.mission}</div><div class="fact-box"><strong>Ważna myśl:</strong> ${guide.takeaway}</div><div class="fact-box"><strong>Mini-zadanie:</strong> ${place.task}</div></article>`);
}

function renderAdventures() {
  const grid = $('#adventureGrid');
  grid.innerHTML = adventures.map(adventure => `<article class="adventure-card"><img src="assets/${adventure.art}" alt="" loading="lazy" /><div><h3>${adventure.title}</h3><p>${adventure.short}</p></div><button class="round-arrow" type="button" data-adventure="${adventure.id}" aria-label="Otwórz przygodę ${adventure.title}">→</button></article>`).join('');
  grid.addEventListener('click', event => { const button = event.target.closest('[data-adventure]'); if (button) openAdventure(button.dataset.adventure); });
}

function openAdventure(id) {
  const adventure = adventures.find(item => item.id === id);
  if (!adventure) return;
  const steps = id === 'muszla' ? ['Odwiedź Port Muszelka.', 'Porozmawiaj z Fotografem Migawką.', 'Wybierz właściwy trop: piasek, bąbelki czy wiadomość?'] : id === 'bramkarze' ? ['Rozgrzej płetwy.', 'Zagraj w Bramkarza Dorsza.', 'Pamiętaj o fair play po każdym wyniku.'] : ['Odwiedź Las Wodorostów.', 'Wskaż rzeczy, które szkodzą wodzie.', 'Wymyśl jedną własną zmianę dla oceanu.'];
  openModal(`<article class="story-modal"><p class="modal-eyebrow">Przygoda miasta</p><h2>${adventure.icon} ${adventure.title}</h2><p>${adventure.full}</p><h3>Twoja misja</h3><ol class="story-steps">${steps.map(step => `<li>${step}</li>`).join('')}</ol><button class="button button-sun button-small adventure-action" data-adventure-action="${id}" type="button">${id === 'bramkarze' ? 'Zagraj w Bramkarza Dorsza' : 'Wróć na mapę'} →</button></article>`);
}

function showCityStories() {
  const volumeOne = storyLibrary.filter(story => story.volume === 1);
  const volumeTwo = storyLibrary.filter(story => story.volume === 2);
  const cards = stories => stories.map(story => `<button type="button" class="story-card" data-story-open="${story.id}"><img class="story-card-cover" src="assets/${story.cover}" alt="" loading="lazy" /><span><span class="story-status is-complete">Tom ${story.volume} · ${story.minutes} min czytania</span><strong>${story.title}</strong><small>${story.teaser}</small></span><b aria-hidden="true">→</b></button>`).join('');
  openModal(`<article class="story-modal"><p class="modal-eyebrow">Dorszo-Kumple · biblioteka</p><h2>Biblioteka Dorszolandii</h2><p>Każda pozycja otwiera jedną całą historię — bez skrótów i bez dzielenia jej na sztuczne części.</p><h3>Tom 1 — pierwsze przygody</h3><div class="story-library">${cards(volumeOne)}</div><h3>Tom 2 — nowe wyprawy</h3><div class="story-library">${cards(volumeTwo)}</div></article>`);
}

function openCityStory(id) {
  const story = storyLibrary.find(item => item.id === id);
  if (!story) return;
  const label = `Tom ${story.volume} · pełna opowieść`;
  const status = `Pełny tekst · około ${story.minutes} min czytania`;
  openModal(`<article class="story-modal"><button type="button" class="story-back" data-stories-home="true">← Wszystkie historie</button><p class="modal-eyebrow">${label}</p><img class="story-reader-cover" src="assets/${story.cover}" alt="Ilustracja do opowiadania: ${story.title}" /><p class="story-status is-complete">${status}</p><h2>${story.icon} ${story.title}</h2><p>${story.teaser}</p><div class="modal-people">${story.people.map(person => `<span class="modal-person">${person}</span>`).join('')}</div><div class="story-reader">${story.chapters.map(chapter => `<section class="story-chapter"><span class="story-chapter-number">Pełna historia</span><h3>${chapter.title}</h3>${chapter.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}</section>`).join('')}</div><div class="mission-box"><strong>Po lekturze:</strong> Która decyzja bohaterów była najmądrzejsza? Jak Ty pomógłbyś mieszkańcom Dorszolandii?</div></article>`);
}

function storyShelfCard(story) {
  return `<button type="button" class="story-shelf-card" data-story-open="${story.id}" aria-label="Czytaj opowiadanie: ${story.title}"><img src="assets/${story.cover}" alt="" loading="lazy" /><span class="story-shelf-copy"><span class="story-status is-complete">Tom ${story.volume} · ${story.minutes} min</span><strong>${story.title}</strong><small>${story.teaser}</small><em>Czytaj pełną historię →</em></span></button>`;
}

function renderStoryShelf() {
  const shelf = $('#storyShelf');
  const supplementShelf = $('#storySupplementShelf');
  shelf.innerHTML = storyLibrary.filter(story => story.volume === 1).map(storyShelfCard).join('');
  supplementShelf.innerHTML = storyLibrary.filter(story => story.volume === 2).map(storyShelfCard).join('');
  shelf.addEventListener('click', event => { const card = event.target.closest('[data-story-open]'); if (card) openCityStory(card.dataset.storyOpen); });
  supplementShelf.addEventListener('click', event => { const card = event.target.closest('[data-story-open]'); if (card) openCityStory(card.dataset.storyOpen); });
}

function encyclopediaCard(entry) {
  return `<button type="button" class="encyclopedia-card" data-encyclopedia-open="${entry.id}"><span aria-hidden="true">${entry.icon}</span><strong>${entry.title}</strong><small>${entry.intro}</small><b aria-hidden="true">Czytaj →</b></button>`;
}

function renderDorszopedia() {
  const preview = $('#encyclopediaPreview');
  if (!preview) return;
  preview.innerHTML = dorszopediaEntries.slice(0, 6).map(encyclopediaCard).join('');
}

function showDorszopedia() {
  const categories = ['Wszystkie', ...new Set(dorszopediaEntries.map(entry => entry.category))];
  openModal(`<article class="story-modal encyclopedia-modal"><p class="modal-eyebrow">Wiedza w bąbelkach</p><h2>Dorszopedia</h2><p>Pełny przewodnik po współczesnej Dorszolandii, jej mieszkańcach, oceanie i opowieściach Dorszo-Kumpli.</p><div class="encyclopedia-filter-bar">${categories.map((category, index) => `<button type="button" class="filter-button ${index === 0 ? 'is-active' : ''}" data-encyclopedia-category="${category}">${category}</button>`).join('')}</div><div class="encyclopedia-library" id="encyclopediaLibrary">${dorszopediaEntries.map(encyclopediaCard).join('')}</div></article>`);
}

function openDorszopediaEntry(id) {
  const entry = dorszopediaEntries.find(item => item.id === id);
  if (!entry) return;
  openModal(`<article class="story-modal encyclopedia-entry"><button type="button" class="story-back" data-dorszopedia-home="true">← Dorszopedia</button><p class="modal-eyebrow">${entry.category}</p><h2>${entry.icon} ${entry.title}</h2><p class="encyclopedia-lead">${entry.intro}</p><div class="encyclopedia-reading">${entry.body.map(paragraph => `<p>${paragraph}</p>`).join('')}</div><h3>Zapamiętaj</h3><ul class="encyclopedia-facts">${entry.facts.map(fact => `<li>${fact}</li>`).join('')}</ul>${entry.id === 'historie' ? '<button class="button button-sun button-small" type="button" data-stories-home="true">Otwórz Bibliotekę Dorszolandii →</button>' : ''}</article>`);
}

let memoryDeck = [];
let memoryOpen = [];
let memoryMatched = new Set();
let memoryLocked = false;

function resetMemory() {
  const selected = shuffle(residents).slice(0, 4);
  memoryDeck = shuffle([...selected, ...selected]);
  memoryOpen = [];
  memoryMatched = new Set();
  memoryLocked = false;
  renderMemory();
}

function renderMemory() {
  const grid = $('#memoryGrid');
  grid.innerHTML = memoryDeck.map((person, index) => {
    const state = memoryMatched.has(index) ? 'is-matched is-open' : memoryOpen.includes(index) ? 'is-open' : '';
    return `<button type="button" class="memory-card ${state}" data-memory-card="${index}" ${memoryMatched.has(index) ? 'disabled' : ''} aria-label="Karta memory ${index + 1}"><span>${memoryOpen.includes(index) || memoryMatched.has(index) ? `<span class="memory-art">${residentArtwork(person, person.role)}</span>` : '🫧'}</span></button>`;
  }).join('');
  const pairs = memoryMatched.size / 2;
  $('#memoryStatus').textContent = pairs === 4 ? 'Brawo! Znalazłeś wszystkie pary!' : `Pary: ${pairs} z 4`;
}

function openMemoryCard(index) {
  if (memoryLocked || memoryMatched.has(index) || memoryOpen.includes(index)) return;
  memoryOpen.push(index);
  renderMemory();
  if (memoryOpen.length !== 2) return;
  memoryLocked = true;
  const [first, second] = memoryOpen;
  if (memoryDeck[first].id === memoryDeck[second].id) {
    memoryMatched.add(first); memoryMatched.add(second); memoryOpen = []; memoryLocked = false; renderMemory();
    if (memoryMatched.size === memoryDeck.length) showToast('Brawo! Wszystkie Dorsze znalazły swoją parę.');
  } else {
    window.setTimeout(() => { memoryOpen = []; memoryLocked = false; renderMemory(); }, 720);
  }
}

let currentQuiz;
function newQuiz() {
  currentQuiz = residents[Math.floor(Math.random() * residents.length)];
  const options = shuffle([currentQuiz.role, ...shuffle(residents.filter(person => person.id !== currentQuiz.id)).slice(0, 3).map(person => person.role)]);
  $('#quizBody').innerHTML = `<p class="quiz-clue">„${currentQuiz.story}”<br /><strong>Jaki to zawód?</strong></p><div class="quiz-options">${options.map(option => `<button type="button" class="quiz-option" data-quiz-answer="${escapeHtml(option)}">${option}</button>`).join('')}</div><p class="quiz-feedback" id="quizFeedback"></p>`;
}

function answerQuiz(button) {
  const answer = button.dataset.quizAnswer;
  const right = answer === currentQuiz.role;
  $$('.quiz-option').forEach(option => {
    option.disabled = true;
    if (option.dataset.quizAnswer === currentQuiz.role) option.classList.add('is-right');
  });
  if (!right) button.classList.add('is-wrong');
  $('#quizFeedback').textContent = right ? `Brawo! To ${currentQuiz.name}.` : `Prawidłowa odpowiedź: ${currentQuiz.role}.`;
}

let goalTimer;
let goalMovement;
let goalRunning = false;
let goalBest = 0;
function moveGoalBall() {
  const field = $('#goalField');
  const ball = $('#goalBall');
  const maxX = Math.max(0, field.clientWidth - ball.offsetWidth - 28);
  const maxY = Math.max(0, field.clientHeight - ball.offsetHeight - 28);
  ball.style.left = `${14 + Math.random() * maxX}px`;
  ball.style.top = `${14 + Math.random() * maxY}px`;
}
function startGoalGame() {
  if (goalRunning) return;
  goalRunning = true;
  let remaining = 15;
  $('#goalScore').textContent = '0';
  $('#goalTime').textContent = String(remaining);
  $('#goalOverlay').classList.add('is-hidden');
  $('#goalBall').classList.add('is-visible');
  moveGoalBall();
  goalMovement = window.setInterval(moveGoalBall, 1300);
  goalTimer = window.setInterval(() => {
    remaining -= 1;
    $('#goalTime').textContent = String(remaining);
    if (remaining > 0) return;
    window.clearInterval(goalTimer); window.clearInterval(goalMovement);
    goalRunning = false;
    $('#goalBall').classList.remove('is-visible');
    $('#goalOverlay').classList.remove('is-hidden');
    $('#goalOverlay').innerHTML = `<button class="button button-sun button-small" type="button" id="startGoal">Zagraj jeszcze raz</button>`;
    showToast(`Koniec gry! Twoje obrony: ${$('#goalScore').textContent}.`);
  }, 1000);
}
function saveGoal() {
  if (!goalRunning) return;
  const score = Number($('#goalScore').textContent) + 1;
  $('#goalScore').textContent = String(score);
  if (score > goalBest) { goalBest = score; $('#goalBest').textContent = String(goalBest); }
  moveGoalBall();
}

let foundDifferences = new Set();
function resetDifferences() {
  foundDifferences = new Set();
  $$('#differenceScene [data-difference]').forEach(item => item.classList.remove('is-found'));
  $('#differenceResult').textContent = 'Znajdź 4 ukryte skarby. Klikaj tylko różne elementy!';
}
function setUpDifferences() {
  $('#differenceScene').addEventListener('click', event => {
    const item = event.target.closest('[data-difference]');
    if (!item || foundDifferences.has(item.dataset.difference)) return;
    foundDifferences.add(item.dataset.difference); item.classList.add('is-found');
    $('#differenceResult').textContent = foundDifferences.size === 4 ? 'Brawo! Znalazłeś wszystkie 4 skarby rafy.' : `Znalezione: ${foundDifferences.size} z 4. Szukaj dalej!`;
    if (foundDifferences.size === 4) showToast('Świetne oko! Wszystkie różnice odnalezione.');
  });
  $('#resetDifferences').addEventListener('click', resetDifferences);
}

const detectiveCases = [
  { clue: 'W bibliotece zaginęła mapa do Skrzydłobusu. Czym Dorszuś powinien jej poszukać?', answer: 'Lupa', options: [['Lupa', '🔍'], ['Piłka', '⚽'], ['Garnek', '🍲']] },
  { clue: 'Borys płynie w nocną wyprawę przez Koralowy Las. Co pomoże mu bezpiecznie znaleźć drogę?', answer: 'Latarka', options: [['Latarka', '🔦'], ['Gitara', '🎸'], ['Pędzel', '🖌️']] },
  { clue: 'Przed zawodami ktoś ukrył medal wśród muszli. Jaki przedmiot pomoże odnaleźć właściwe miejsce?', answer: 'Mapa', options: [['Mapa', '🗺️'], ['Słuchawki', '🎧'], ['Puchar', '🏆']] },
  { clue: 'W pracowni Torpedy trzeba zobaczyć maleńki ślad na koralu. Czego użyje detektyw?', answer: 'Lupa', options: [['Lupa', '🔍'], ['Korona', '👑'], ['Rakieta', '🚀']] },
  { clue: 'Dorszuś szykuje występ dla całej rafy. Co będzie potrzebne, aby zagrać melodię?', answer: 'Gitara', options: [['Gitara', '🎸'], ['Kompas', '🧭'], ['Teleskop', '🔭']] }
];
let currentDetective;
function newDetective() {
  currentDetective = detectiveCases[Math.floor(Math.random() * detectiveCases.length)];
  $('#detectiveBody').innerHTML = `<p class="detective-clue">${currentDetective.clue}</p><div class="detective-options">${shuffle(currentDetective.options).map(([label, icon]) => `<button type="button" class="detective-option" data-detective-answer="${label}"><span aria-hidden="true">${icon}</span>${label}</button>`).join('')}</div><p class="detective-feedback" id="detectiveFeedback"></p>`;
}
function answerDetective(button) {
  const right = button.dataset.detectiveAnswer === currentDetective.answer;
  $$('.detective-option').forEach(option => { option.disabled = true; if (option.dataset.detectiveAnswer === currentDetective.answer) option.classList.add('is-right'); });
  if (!right) button.classList.add('is-wrong');
  $('#detectiveFeedback').textContent = right ? 'Brawo, detektywie! Trop rozwiązany.' : `Prawidłowo: ${currentDetective.answer}. Spróbuj kolejnego tropu.`;
  if (right) showToast('Detektyw Dorszuś rozwiązał zagadkę!');
}

const bubbleSymbols = ['🐚', '⭐', '🫧', '🐠', '⚓', '🪸'];
let bubbleSequence = [];
let bubbleProgress = 0;
let bubbleReady = false;
function renderBubbleCode(reveal = false) {
  $('#bubbleCodeDisplay').innerHTML = bubbleSequence.map(symbol => `<span class="bubble-symbol ${reveal ? '' : 'is-hidden'}">${symbol}</span>`).join('');
  $('#bubbleCodeOptions').innerHTML = shuffle(bubbleSymbols).map(symbol => `<button type="button" class="bubble-code-option" data-bubble-symbol="${symbol}"><span aria-hidden="true">${symbol}</span></button>`).join('');
}
function startBubbleCode() {
  bubbleSequence = [bubbleSymbols[Math.floor(Math.random() * bubbleSymbols.length)]];
  bubbleProgress = 0; bubbleReady = false;
  $('#bubbleCodeResult').textContent = 'Zapamiętaj symbol…';
  $('#startBubbleCode').textContent = 'Pokaż kod →';
  renderBubbleCode(true);
  window.setTimeout(() => { bubbleReady = true; renderBubbleCode(false); $('#bubbleCodeResult').textContent = 'Teraz powtórz kod.'; }, 1100);
}
function answerBubbleCode(button) {
  if (!bubbleReady) return;
  const symbol = button.dataset.bubbleSymbol;
  if (symbol !== bubbleSequence[bubbleProgress]) {
    bubbleReady = false; $('#bubbleCodeResult').textContent = 'Prawie! Kod zaczął się od nowa.'; renderBubbleCode(true);
    window.setTimeout(() => { bubbleProgress = 0; bubbleReady = true; renderBubbleCode(false); $('#bubbleCodeResult').textContent = 'Spróbuj ponownie.'; }, 850);
    return;
  }
  bubbleProgress += 1;
  if (bubbleProgress < bubbleSequence.length) { $('#bubbleCodeResult').textContent = 'Dobrze! Jaki jest następny bąbelek?'; return; }
  bubbleSequence.push(bubbleSymbols[Math.floor(Math.random() * bubbleSymbols.length)]);
  bubbleProgress = 0; bubbleReady = false;
  $('#bubbleCodeResult').textContent = `Brawo! Poziom ${bubbleSequence.length - 1}. Nowy symbol już płynie…`;
  renderBubbleCode(true);
  window.setTimeout(() => { bubbleReady = true; renderBubbleCode(false); $('#bubbleCodeResult').textContent = `Poziom ${bubbleSequence.length}: powtórz cały kod.`; }, 1200);
}

const accessoryOptions = [
  { key: 'czapka', label: 'Czapka', icon: '🧢', x: 49, y: 19 }, { key: 'korona', label: 'Korona', icon: '👑', x: 50, y: 16 },
  { key: 'helm', label: 'Hełm', icon: '⛑️', x: 49, y: 20 }, { key: 'czapka-kapitana', label: 'Czapka kapitana', icon: '⚓', x: 49, y: 19 },
  { key: 'okulary', label: 'Okulary', icon: '👓', x: 48, y: 42 }, { key: 'maska', label: 'Maska nurka', icon: '🥽', x: 49, y: 42 },
  { key: 'sluchawki', label: 'Słuchawki', icon: '🎧', x: 49, y: 34 }, { key: 'mucha', label: 'Mucha', icon: '🎀', x: 54, y: 58 },
  { key: 'plecak', label: 'Plecak', icon: '🎒', x: 26, y: 60 }, { key: 'pilka', label: 'Piłka', icon: '⚽', x: 77, y: 66 },
  { key: 'lupa', label: 'Lupa', icon: '🔍', x: 72, y: 56 }, { key: 'stetoskop', label: 'Stetoskop', icon: '🩺', x: 52, y: 66 },
  { key: 'ksiazka', label: 'Książka', icon: '📘', x: 70, y: 68 }, { key: 'mapa', label: 'Mapa', icon: '🗺️', x: 70, y: 68 },
  { key: 'kompas', label: 'Kompas', icon: '🧭', x: 73, y: 61 }, { key: 'aparat', label: 'Aparat', icon: '📷', x: 66, y: 54 },
  { key: 'gitara', label: 'Gitara', icon: '🎸', x: 66, y: 70 }, { key: 'pedzel', label: 'Pędzel', icon: '🖌️', x: 72, y: 64 },
  { key: 'paleta', label: 'Paleta', icon: '🎨', x: 70, y: 67 }, { key: 'latarka', label: 'Latarka', icon: '🔦', x: 70, y: 60 },
  { key: 'tablet', label: 'Tablet', icon: '💻', x: 69, y: 66 }, { key: 'mikroskop', label: 'Mikroskop', icon: '🔬', x: 69, y: 64 },
  { key: 'roslinka', label: 'Roślinka', icon: '🌿', x: 29, y: 68 }, { key: 'gwiazdka', label: 'Odznaka', icon: '⭐', x: 60, y: 56 },
  { key: 'choragiewka', label: 'Flaga', icon: '🚩', x: 75, y: 47 }, { key: 'gwizdek', label: 'Gwizdek', icon: '📣', x: 72, y: 61 },
  { key: 'dzwonek', label: 'Dzwonek szkolny', icon: '🔔', x: 72, y: 57 }, { key: 'bilet', label: 'Bilet na meduzotram', icon: '🎟️', x: 69, y: 64 },
  { key: 'zegarek', label: 'Chronobąbel', icon: '⏰', x: 70, y: 60 }, { key: 'latarnia', label: 'Latarnia', icon: '🏮', x: 72, y: 56 },
  { key: 'puchar', label: 'Puchar', icon: '🏆', x: 68, y: 62 }, { key: 'rakieta', label: 'Rakieta Koral-1', icon: '🚀', x: 73, y: 58 },
  { key: 'meduza', label: 'Świecąca meduza', icon: '🪼', x: 71, y: 54 }, { key: 'ksiezyc', label: 'Nocny księżyc', icon: '🌙', x: 69, y: 49 },
  { key: 'narzedzia', label: 'Narzędzia Torpedy', icon: '🧰', x: 71, y: 68 }, { key: 'zwoj', label: 'Stara mapa', icon: '📜', x: 69, y: 65 }
];
const colorFilters = { '#ffad24': 'none', '#33a8e8': 'hue-rotate(135deg) saturate(1.16)', '#f26492': 'hue-rotate(295deg) saturate(1.13)', '#75c95b': 'hue-rotate(74deg) saturate(1.1)', '#8c69e8': 'hue-rotate(218deg) saturate(1.14)' };
let creatorItems = [];
let creatorColor = '#ffad24';
let movingItemId = null;
let selectedItemId = null;
let resizeState = null;

function renderAccessories() {
  $('#accessoryPalette').innerHTML = accessoryOptions.map(accessory => `<button type="button" class="accessory-button" data-accessory="${accessory.key}" title="Dodaj: ${accessory.label}" aria-label="Dodaj ${accessory.label}">${accessory.icon}</button>`).join('');
  const itemMarkup = item => `<button type="button" class="placed-item ${item.id === selectedItemId ? 'is-selected' : ''}" data-item-id="${item.id}" style="left:${item.x}%;top:${item.y}%;z-index:${item.layer};font-size:${item.size}px;transform:translate(-50%,-50%) rotate(${item.angle}deg)" aria-label="${item.label}. Przeciągnij, aby przesunąć. Użyj żółtego uchwytu, aby zmienić wielkość.">${item.icon}<span class="resize-handle" aria-hidden="true">↘</span></button>`;
  const ordered = items => [...items].sort((first, second) => first.layer - second.layer).map(itemMarkup).join('');
  $('#placedItemsBack').innerHTML = ordered(creatorItems.filter(item => item.surface === 'back'));
  $('#placedItemsFront').innerHTML = ordered(creatorItems.filter(item => item.surface !== 'back'));
  $('#layerList').innerHTML = creatorItems.length ? [...creatorItems].sort((first, second) => (first.surface === second.surface ? second.layer - first.layer : first.surface === 'front' ? -1 : 1)).map(item => `<button type="button" class="layer-chip ${item.id === selectedItemId ? 'is-selected' : ''}" data-layer-item="${item.id}"><span>${item.icon}</span>${item.label}<small>${item.surface === 'back' ? 'za' : 'przed'} · ${item.layer}</small></button>`).join('') : '<span class="layer-empty">Dodaj pierwszy rekwizyt z palety.</span>';
  updateAccessoryControls();
}

function updateAccessoryControls() {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  const sizeInput = $('#accessorySize');
  const removeButton = $('#removeSelectedAccessory');
  const increaseButton = $('#increaseAccessory');
  const decreaseButton = $('#decreaseAccessory');
  const rotationInput = $('#accessoryRotation');
  const transformButtons = ['layerDown', 'layerUp', 'sendToBack', 'bringToFront', 'sendBehindFish', 'bringBeforeFish', 'resetSelectedAccessory', 'duplicateAccessory', 'centerAccessory'].map(id => $(`#${id}`));
  if (!selected) {
    $('#accessorySelection').textContent = 'Wybierz dodatek na Dorszu, aby go przesunąć, obrócić lub zmienić jego wielkość.';
    sizeInput.value = '48'; rotationInput.value = '0'; $('#accessorySizeValue').textContent = '—'; $('#accessoryRotationValue').textContent = '—';
    sizeInput.disabled = true; rotationInput.disabled = true; removeButton.disabled = true; increaseButton.disabled = true; decreaseButton.disabled = true; transformButtons.forEach(button => { if (button) button.disabled = true; });
    return;
  }
  $('#accessorySelection').textContent = `Wybrano: ${selected.label}. ${selected.surface === 'back' ? 'Za Dorszem' : 'Przed Dorszem'}, warstwa ${selected.layer}.`;
  sizeInput.value = String(selected.size); rotationInput.value = String(selected.angle); $('#accessorySizeValue').textContent = `${selected.size}px`; $('#accessoryRotationValue').textContent = `${selected.angle}°`;
  sizeInput.disabled = false; rotationInput.disabled = false; removeButton.disabled = false; increaseButton.disabled = false; decreaseButton.disabled = false; transformButtons.forEach(button => { if (button) button.disabled = false; });
}

function selectAccessory(id) {
  selectedItemId = creatorItems.some(item => item.id === id) ? id : null;
  $$('.placed-item').forEach(element => element.classList.toggle('is-selected', element.dataset.itemId === selectedItemId));
  updateAccessoryControls();
}

function updateAccessorySize(size) {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.size = Math.min(104, Math.max(24, Math.round(Number(size))));
  const element = $(`[data-item-id="${selected.id}"]`);
  if (element) element.style.fontSize = `${selected.size}px`;
  $('#accessorySize').value = String(selected.size); $('#accessorySizeValue').textContent = `${selected.size}px`;
}

function updateAccessoryRotation(angle) {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.angle = Math.min(180, Math.max(-180, Math.round(Number(angle))));
  const element = $(`[data-item-id="${selected.id}"]`);
  if (element) element.style.transform = `translate(-50%,-50%) rotate(${selected.angle}deg)`;
  $('#accessoryRotation').value = String(selected.angle); $('#accessoryRotationValue').textContent = `${selected.angle}°`;
}

function setAccessoryLayer(layer) {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.layer = Math.min(30, Math.max(1, layer));
  renderAccessories();
}

function setAccessorySurface(surface) {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.surface = surface;
  renderAccessories();
}

function resetSelectedAccessory() {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.x = selected.homeX; selected.y = selected.homeY; selected.size = selected.homeSize; selected.angle = 0; selected.layer = 10; selected.surface = 'front';
  renderAccessories();
}

function duplicateSelectedAccessory() {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  const duplicate = { ...selected, id: `${selected.key}-${Date.now()}-${Math.floor(Math.random() * 1000)}`, x: Math.min(92, selected.x + 7), y: Math.min(88, selected.y + 7), layer: Math.min(30, selected.layer + 1) };
  creatorItems.push(duplicate); selectedItemId = duplicate.id; renderAccessories(); showToast(`${selected.label} skopiowany.`);
}

function centerSelectedAccessory() {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.x = 50; selected.y = 50; renderAccessories();
}

function addAccessory(key) {
  const option = accessoryOptions.find(item => item.key === key);
  if (!option) return;
  const item = { ...option, id: `${option.key}-${Date.now()}-${Math.floor(Math.random() * 1000)}`, size: 48, homeX: option.x, homeY: option.y, homeSize: 48, angle: 0, layer: 10, surface: 'front' };
  creatorItems.push(item);
  selectedItemId = item.id;
  renderAccessories();
  showToast(`${option.label} dodany. Przeciągnij go lub zmień jego wielkość.`);
}

function setCreatorColor(color) {
  creatorColor = color;
  const colorFilter = colorFilters[color] || 'none';
  $('#creatorFish').style.filter = colorFilter === 'none' ? 'drop-shadow(0 8px 8px rgba(0,63,119,.24))' : `${colorFilter} drop-shadow(0 8px 8px rgba(0,63,119,.24))`;
  $$('.color-dot').forEach(button => button.classList.toggle('is-selected', button.dataset.color === color));
}

function moveCreatorItem(event) {
  if (!movingItemId) return;
  if (resizeState) {
    updateAccessorySize(resizeState.startSize + (event.clientX - resizeState.startX) / 1.3);
    return;
  }
  const rect = $('#creatorStage').getBoundingClientRect();
  const x = Math.min(94, Math.max(6, (event.clientX - rect.left) / rect.width * 100));
  const y = Math.min(92, Math.max(7, (event.clientY - rect.top) / rect.height * 100));
  const item = creatorItems.find(entry => entry.id === movingItemId);
  if (item) { item.x = x; item.y = y; }
  const element = $(`[data-item-id="${movingItemId}"]`);
  if (element) { element.style.left = `${x}%`; element.style.top = `${y}%`; }
}

function loadCreatorFish() {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = 'assets/generated/dorsz-baza-transparent.png';
  });
}

function drawCreatorItem(context, item, stage) {
  context.save();
  context.translate(stage.x + item.x / 100 * stage.width, stage.y + item.y / 100 * stage.height);
  context.rotate(item.angle * Math.PI / 180);
  context.font = `${Math.round(item.size * 1.55)}px sans-serif`;
  context.fillText(item.icon, 0, 0);
  context.restore();
}

async function createFishCardCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 720;
  const context = canvas.getContext('2d');
  const image = await loadCreatorFish();
  const stage = { x: 190, y: 125, width: 700, height: 445 };
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1ab7e9'); gradient.addColorStop(1, '#d4f9ff');
  context.fillStyle = gradient; context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#fff'; context.font = '900 66px Nunito, sans-serif'; context.textAlign = 'center';
  context.fillText($('#fishName').value.trim() || 'Mój Dorsz', canvas.width / 2, 86);
  [...creatorItems].filter(item => item.surface === 'back').sort((first, second) => first.layer - second.layer).forEach(item => drawCreatorItem(context, item, stage));
  const fishHeight = 410;
  const fishWidth = Math.round(fishHeight * image.width / image.height);
  context.save();
  context.filter = colorFilters[creatorColor] || 'none';
  context.drawImage(image, (canvas.width - fishWidth) / 2, 128, fishWidth, fishHeight);
  context.restore();
  [...creatorItems].filter(item => item.surface !== 'back').sort((first, second) => first.layer - second.layer).forEach(item => drawCreatorItem(context, item, stage));
  context.fillStyle = '#073c87'; context.font = '800 32px Nunito, sans-serif';
  context.fillText(`${$('#fishRole').value} · Dorszolandia`, canvas.width / 2, 650);
  return canvas;
}

async function createCustomFish(event) {
  event.preventDefault();
  const name = escapeHtml($('#fishName').value.trim() || 'Mój Dorsz');
  const role = escapeHtml($('#fishRole').value);
  const addOnText = creatorItems.length ? creatorItems.map(item => item.label.toLowerCase()).join(', ') : 'bez dodatków — gotowy na własny pomysł';
  $('#customCardOutput').classList.add('is-visible');
  $('#customCardOutput').innerHTML = '<p>Tworzymy kartę Twojego Dorsza…</p>';
  try {
    const canvas = await createFishCardCanvas();
    $('#customCardOutput').innerHTML = `<img src="${canvas.toDataURL('image/png')}" alt="Karta mieszkańca: ${name}" /><div><p class="eyebrow eyebrow-blue">Nowy mieszkaniec</p><h3>${name}</h3><p><strong>${role}</strong><br />Akcesoria: ${addOnText}</p></div>`;
    showToast(`${name} dołącza do Dorszolandii!`);
  } catch {
    $('#customCardOutput').classList.remove('is-visible');
    showToast('Nie udało się utworzyć karty. Spróbuj ponownie.');
  }
}

async function downloadCustomFish() {
  try {
    const canvas = await createFishCardCanvas();
    const link = document.createElement('a');
    link.download = `${($('#fishName').value.trim() || 'moj-dorsz').replace(/[^a-z0-9ąćęłńóśźż_-]+/gi, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Karta PNG została przygotowana do pobrania.');
  } catch {
    showToast('Nie udało się przygotować karty. Spróbuj ponownie.');
  }
}

function randomResident() {
  const person = residents[Math.floor(Math.random() * residents.length)];
  $('#dreamResult').innerHTML = `<span class="dream-art">${residentArtwork(person)}</span><span><strong>${person.name} — ${person.role}</strong><br /><small>${person.category} · ${person.tagline}</small></span>`;
  $('#dreamResult').classList.add('is-visible');
}

function openShop() {
  openModal(`<article class="story-modal"><p class="modal-eyebrow">Zapowiedź kolekcji</p><h2>Sklep Dorszolandii</h2><p>Przygotowaliśmy spójną sekcję sklepu, ale nie udajemy działającego koszyka ani płatności. Przed uruchomieniem sprzedaży trzeba podłączyć prawdziwy katalog, regulamin, dostawę i bezpieczne płatności.</p><div class="encyclopedia-grid"><article><span>👕</span><h3>Koszulki</h3><p>Motywy mieszkańców i hasło „Ryby też mają marzenia”.</p></article><article><span>☕</span><h3>Kubki</h3><p>Dla małych i dużych miłośników Dorszolandii.</p></article><article><span>🎒</span><h3>Gadżety</h3><p>Przypinki, zeszyty, torby i zestawy kreatywne.</p></article></div></article>`);
}

function openSong() {
  openModal(`<article class="story-modal"><p class="modal-eyebrow">Melodia miasta</p><h2>♫ Muzyka i teledyski Dorszolandii</h2><p>Wszystkie nagrania są zapisane bezpośrednio w Dorszolandii i odtwarzają się bez przechodzenia na Dysk.</p><section class="song-player"><h3>Teledysk: Dorszolandia</h3><video controls preload="metadata" poster="assets/hero/dorszolandia-hero-original.webp"><source src="assets/stories/piosenka-dorszolandii.mp4" type="video/mp4" />Twoja przeglądarka nie obsługuje odtwarzania filmu.</video></section><section class="song-player"><h3>Piosenka Dorszolandii 2</h3><audio controls preload="metadata"><source src="assets/songs/dorszolandia-2.mp3" type="audio/mpeg" />Twoja przeglądarka nie obsługuje odtwarzania dźwięku.</audio></section><section class="song-player"><h3>Piosenka Dorszolandii 3</h3><audio controls preload="metadata"><source src="assets/songs/dorszolandia-3.mp3" type="audio/mpeg" />Twoja przeglądarka nie obsługuje odtwarzania dźwięku.</audio></section></article>`);
}

function setUpEvents() {
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { const rect = modal.getBoundingClientRect(); if (event.target === modal && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeModal(); });
  modalContent.addEventListener('click', event => {
    const person = event.target.closest('[data-resident-open]'); if (person) { openResident(person.dataset.residentOpen); return; }
    const place = event.target.closest('[data-place-open]'); if (place?.dataset.placeOpen) { openPlace(place.dataset.placeOpen); return; }
    const story = event.target.closest('[data-story-open]'); if (story) { openCityStory(story.dataset.storyOpen); return; }
    if (event.target.closest('[data-stories-home]')) { showCityStories(); return; }
    if (event.target.closest('[data-dorszopedia-home]')) { showDorszopedia(); return; }
    const encyclopediaEntry = event.target.closest('[data-encyclopedia-open]'); if (encyclopediaEntry) { openDorszopediaEntry(encyclopediaEntry.dataset.encyclopediaOpen); return; }
    const encyclopediaCategory = event.target.closest('[data-encyclopedia-category]');
    if (encyclopediaCategory) {
      const category = encyclopediaCategory.dataset.encyclopediaCategory;
      $$('.encyclopedia-filter-bar [data-encyclopedia-category]', modalContent).forEach(button => button.classList.toggle('is-active', button === encyclopediaCategory));
      const library = $('#encyclopediaLibrary', modalContent);
      if (library) library.innerHTML = (category === 'Wszystkie' ? dorszopediaEntries : dorszopediaEntries.filter(entry => entry.category === category)).map(encyclopediaCard).join('');
      return;
    }
    const action = event.target.closest('[data-adventure-action]'); if (action) { closeModal(); document.querySelector(action.dataset.adventureAction === 'bramkarze' ? '#gry' : '#mapa').scrollIntoView({ behavior: 'smooth' }); }
  });
  $('#openStories').addEventListener('click', showCityStories);
  $('#openDorszopedia').addEventListener('click', showDorszopedia);
  $('#encyclopediaPreview').addEventListener('click', event => { const card = event.target.closest('[data-encyclopedia-open]'); if (card) openDorszopediaEntry(card.dataset.encyclopediaOpen); });
  $('#playSong').addEventListener('click', openSong);
  $('#openMusicLibrary').addEventListener('click', openSong);
  $('#openMusicLibraryInline').addEventListener('click', openSong);
  $('#shopButton').addEventListener('click', openShop);
  $('#randomResident').addEventListener('click', randomResident);
  $('#memoryGrid').addEventListener('click', event => { const card = event.target.closest('[data-memory-card]'); if (card) openMemoryCard(Number(card.dataset.memoryCard)); });
  $('#resetMemory').addEventListener('click', resetMemory);
  $('#quizBody').addEventListener('click', event => { const option = event.target.closest('[data-quiz-answer]'); if (option && !option.disabled) answerQuiz(option); });
  $('#nextQuiz').addEventListener('click', newQuiz);
  $('#detectiveBody').addEventListener('click', event => { const option = event.target.closest('[data-detective-answer]'); if (option && !option.disabled) answerDetective(option); });
  $('#nextDetective').addEventListener('click', newDetective);
  $('#bubbleCodeOptions').addEventListener('click', event => { const option = event.target.closest('[data-bubble-symbol]'); if (option) answerBubbleCode(option); });
  $('#startBubbleCode').addEventListener('click', startBubbleCode);
  $('#goalField').addEventListener('click', event => { if (event.target.closest('#startGoal')) startGoalGame(); });
  $('#goalBall').addEventListener('click', saveGoal);
  $('#accessoryPalette').addEventListener('click', event => { const button = event.target.closest('[data-accessory]'); if (button) addAccessory(button.dataset.accessory); });
  $('#colorPicker').addEventListener('click', event => { const button = event.target.closest('[data-color]'); if (button) setCreatorColor(button.dataset.color); });
  $('#clearAccessories').addEventListener('click', () => { creatorItems = []; selectedItemId = null; renderAccessories(); showToast('Akcesoria zostały usunięte.'); });
  $('#accessorySize').addEventListener('input', event => updateAccessorySize(event.target.value));
  $('#accessoryRotation').addEventListener('input', event => updateAccessoryRotation(event.target.value));
  $('#increaseAccessory').addEventListener('click', () => { const selected = creatorItems.find(item => item.id === selectedItemId); if (selected) updateAccessorySize(selected.size + 8); });
  $('#decreaseAccessory').addEventListener('click', () => { const selected = creatorItems.find(item => item.id === selectedItemId); if (selected) updateAccessorySize(selected.size - 8); });
  $('#layerDown').addEventListener('click', () => { const selected = creatorItems.find(item => item.id === selectedItemId); if (selected) setAccessoryLayer(selected.layer - 1); });
  $('#layerUp').addEventListener('click', () => { const selected = creatorItems.find(item => item.id === selectedItemId); if (selected) setAccessoryLayer(selected.layer + 1); });
  $('#sendToBack').addEventListener('click', () => setAccessoryLayer(1));
  $('#bringToFront').addEventListener('click', () => setAccessoryLayer(30));
  $('#sendBehindFish').addEventListener('click', () => setAccessorySurface('back'));
  $('#bringBeforeFish').addEventListener('click', () => setAccessorySurface('front'));
  $('#resetSelectedAccessory').addEventListener('click', resetSelectedAccessory);
  $('#duplicateAccessory').addEventListener('click', duplicateSelectedAccessory);
  $('#centerAccessory').addEventListener('click', centerSelectedAccessory);
  $('#layerList').addEventListener('click', event => { const item = event.target.closest('[data-layer-item]'); if (item) selectAccessory(item.dataset.layerItem); });
  $('#removeSelectedAccessory').addEventListener('click', () => {
    const selected = creatorItems.find(item => item.id === selectedItemId);
    if (!selected) return;
    creatorItems = creatorItems.filter(item => item.id !== selectedItemId); selectedItemId = null; renderAccessories(); showToast(`${selected.label} został usunięty.`);
  });
  $('#creatorForm').addEventListener('submit', createCustomFish);
  $('#downloadFish').addEventListener('click', downloadCustomFish);
  $('#creatorStage').addEventListener('pointerdown', event => {
    const item = event.target.closest('[data-item-id]'); if (!item) return;
    movingItemId = item.dataset.itemId;
    selectAccessory(movingItemId);
    if (event.target.closest('.resize-handle')) {
      const selected = creatorItems.find(entry => entry.id === movingItemId);
      resizeState = { startX: event.clientX, startSize: selected?.size || 48 };
    }
    item.classList.add('is-moving'); item.setPointerCapture(event.pointerId); event.preventDefault();
  });
  $('#creatorStage').addEventListener('pointermove', moveCreatorItem);
  $('#creatorStage').addEventListener('pointerup', event => { const item = event.target.closest('[data-item-id]'); if (item) item.classList.remove('is-moving'); movingItemId = null; resizeState = null; });
  $('#creatorStage').addEventListener('pointercancel', () => { movingItemId = null; resizeState = null; $$('.placed-item').forEach(item => item.classList.remove('is-moving')); });
  const toggle = $('.mobile-toggle');
  toggle.addEventListener('click', () => { const open = $('.nav-links').classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); });
  $$('.nav-links a').forEach(link => link.addEventListener('click', () => { $('.nav-links').classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }));
}

function init() {
  renderResidents(); renderMap(); renderAdventures(); renderStoryShelf(); renderDorszopedia(); resetMemory(); newQuiz(); newDetective(); setUpDifferences(); renderAccessories(); setUpEvents();
}

init();
