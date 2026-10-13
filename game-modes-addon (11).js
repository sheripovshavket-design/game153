/* Дополнение к RPG: выбор режима после героя + 3 босса в каждом режиме.
   Подключать ПОСЛЕ subjects-addon.js. Исходный index.html не заменяет. */
(() => {
  'use strict';

  const originalPickHero = pickHero;
  const originalPickLevel = pickLevel;
  const originalNextWave = nextWave;
  const originalProceedNext = proceedNext;
  const originalGenMath = genMath;
  const originalCheckAnswer = checkAnswer;
  const originalTimeout = timeOutPunishment;

  let playMode = 'levels';
  let subjectRun = false;
  let difficulty = 'easy';
  let bossNumber = 0;
  let questionNow = null;
  let answerLocked = false;
  // Уникальные вопросы хранятся до конца одного прохождения режима.
  const usedQuestions = new Set();

  const subjectQuestions = {
  "english": [
    [
      1,
      "Choose: If I ___ enough money, I would travel abroad.",
      "had",
      "have",
      "will have",
      "has"
    ],
    [
      1,
      "Choose: She has lived here ___ 2019.",
      "since",
      "for",
      "during",
      "from"
    ],
    [
      1,
      "Choose: This book ___ by millions of people.",
      "is read",
      "reads",
      "is reading",
      "read"
    ],
    [
      1,
      "Choose: I look forward to ___ from you.",
      "hearing",
      "hear",
      "heard",
      "be heard"
    ],
    [
      1,
      "Choose: Neither Tom nor his friends ___ ready.",
      "are",
      "is",
      "was",
      "be"
    ],
    [
      1,
      "Choose: By the time we arrived, the film ___.",
      "had started",
      "has started",
      "starts",
      "will start"
    ],
    [
      1,
      "Choose: You ___ smoke in the laboratory.",
      "must not",
      "do not have to",
      "might",
      "could"
    ],
    [
      1,
      "Choose: He asked me where I ___.",
      "lived",
      "do live",
      "am living",
      "will live"
    ],
    [
      1,
      "Choose: Despite ___ tired, she finished the project.",
      "being",
      "be",
      "was",
      "been"
    ],
    [
      1,
      "Choose: The harder you work, ___ you become.",
      "the better",
      "better",
      "the best",
      "best"
    ],
    [
      1,
      "Choose: I wish I ___ speak French fluently.",
      "could",
      "can",
      "will",
      "may"
    ],
    [
      1,
      "Choose: The bridge ___ when we visited the town.",
      "was being repaired",
      "has repaired",
      "is repairing",
      "repairs"
    ],
    [
      1,
      "Choose: Unless it ___, we will go hiking.",
      "rains",
      "will rain",
      "rained",
      "is rain"
    ],
    [
      1,
      "Choose: She is used to ___ early.",
      "getting up",
      "get up",
      "got up",
      "gets up"
    ],
    [
      1,
      "Choose: He denied ___ the window.",
      "breaking",
      "to break",
      "break",
      "broke"
    ],
    [
      1,
      "Choose: I would rather you ___ here.",
      "stayed",
      "stay",
      "will stay",
      "staying"
    ],
    [
      1,
      "Choose: Not only ___ late, but he also forgot his notes.",
      "was he",
      "he was",
      "is he",
      "he is"
    ],
    [
      1,
      "Choose: She told me she ___ the task the day before.",
      "had completed",
      "has completed",
      "completes",
      "will complete"
    ],
    [
      2,
      "Choose: Had I known, I ___ earlier.",
      "would have arrived",
      "will arrive",
      "had arrived",
      "would arrive"
    ],
    [
      2,
      "Choose: Rarely ___ such a difficult problem.",
      "have I seen",
      "I have seen",
      "I saw",
      "did I seeing"
    ],
    [
      2,
      "Choose: It is essential that he ___ on time.",
      "be",
      "is",
      "was",
      "being"
    ],
    [
      2,
      "Choose: No sooner had she arrived ___ it started raining.",
      "than",
      "when",
      "then",
      "that"
    ],
    [
      2,
      "Choose: If he had studied, he ___ the exam.",
      "would have passed",
      "would pass",
      "will pass",
      "had passed"
    ],
    [
      2,
      "Choose: The report is believed ___ yesterday.",
      "to have been written",
      "to write",
      "writing",
      "to have wrote"
    ],
    [
      2,
      "Choose: Scarcely had we sat down ___ the lights went out.",
      "when",
      "than",
      "that",
      "while"
    ],
    [
      2,
      "Choose: Were I in your position, I ___ the offer.",
      "would accept",
      "will accept",
      "accepted",
      "had accepted"
    ],
    [
      2,
      "Choose: She insisted that the documents ___ immediately.",
      "be sent",
      "are sent",
      "were sending",
      "sent"
    ],
    [
      2,
      "Choose: He speaks as though he ___ everything.",
      "knew",
      "knows",
      "will know",
      "has know"
    ],
    [
      2,
      "Choose: The more you practice, ___ mistakes you make.",
      "the fewer",
      "the less",
      "fewer",
      "least"
    ],
    [
      2,
      "Choose: Little ___ that the plan would fail.",
      "did they know",
      "they knew",
      "they know",
      "had they knew"
    ]
  ],
  "geography": [
    [
      1,
      "Какая сила вызывает отклонение ветров из-за вращения Земли?",
      "Сила Кориолиса",
      "Сила трения",
      "Архимедова сила",
      "Сила упругости"
    ],
    [
      1,
      "Как называется линия с равной высотой на карте?",
      "Горизонталь",
      "Изобара",
      "Изотерма",
      "Меридиан"
    ],
    [
      1,
      "Какая порода образуется при застывании магмы?",
      "Магматическая",
      "Осадочная",
      "Органогенная",
      "Метаморфическая"
    ],
    [
      1,
      "Что показывает абсолютная высота?",
      "Высоту над уровнем моря",
      "Высоту над ближайшей рекой",
      "Глубину почвы",
      "Расстояние до экватора"
    ],
    [
      1,
      "Какая воздушная масса обычно приносит жаркую сухую погоду?",
      "Тропическая континентальная",
      "Арктическая морская",
      "Умеренная морская",
      "Антарктическая морская"
    ],
    [
      1,
      "Где расположена зона субдукции?",
      "На границе сходящихся плит",
      "В центре плиты",
      "На экваторе",
      "В русле реки"
    ],
    [
      1,
      "Как называется сезонный ветер, меняющий направление?",
      "Муссон",
      "Пассат",
      "Бриз",
      "Фён"
    ],
    [
      1,
      "Что измеряют изобары на синоптической карте?",
      "Равное атмосферное давление",
      "Равную температуру",
      "Равную высоту",
      "Равное количество осадков"
    ],
    [
      1,
      "Какой тип климата имеет сухое лето и влажную зиму?",
      "Средиземноморский",
      "Экваториальный",
      "Муссонный тропический",
      "Арктический"
    ],
    [
      1,
      "Что служит причиной приливов и отливов?",
      "Притяжение Луны и Солнца",
      "Вращение облаков",
      "Извержения вулканов",
      "Движение ледников"
    ],
    [
      1,
      "Как называется область питания реки и её притоков?",
      "Речной бассейн",
      "Дельта",
      "Эстуарий",
      "Водораздел"
    ],
    [
      1,
      "Какое течение у западных берегов Южной Америки холодное?",
      "Перуанское",
      "Гольфстрим",
      "Куросио",
      "Бразильское"
    ],
    [
      1,
      "Что такое эпицентр землетрясения?",
      "Точка на поверхности над очагом",
      "Центр Земли",
      "Граница литосферы",
      "Место образования ветра"
    ],
    [
      1,
      "Почему на вершине горы обычно холоднее?",
      "Температура воздуха падает с высотой",
      "Солнце дальше",
      "Ветер всегда северный",
      "Воздух плотнее"
    ],
    [
      1,
      "Что означает масштаб 1:100 000?",
      "1 см на карте равен 1 км",
      "1 см равен 100 км",
      "1 см равен 100 м",
      "1 см равен 10 км"
    ],
    [
      1,
      "Какие широты лежат между тропиками?",
      "Низкие",
      "Высокие",
      "Полярные",
      "Субполярные"
    ],
    [
      1,
      "Как называется разрушение горных пород на месте?",
      "Выветривание",
      "Аккумуляция",
      "Субдукция",
      "Мелиорация"
    ],
    [
      1,
      "Какая природная зона характерна для многолетней мерзлоты и мхов?",
      "Тундра",
      "Саванна",
      "Степь",
      "Сельва"
    ],
    [
      2,
      "Как называется граница плит, расходящихся в стороны?",
      "Дивергентная",
      "Конвергентная",
      "Трансформная",
      "Сейсмическая"
    ],
    [
      2,
      "Какие процессы создают срединно-океанические хребты?",
      "Спрединг океанического дна",
      "Речная эрозия",
      "Ветровая аккумуляция",
      "Карст"
    ],
    [
      2,
      "Какое явление связано с потеплением вод восточной части Тихого океана?",
      "Эль-Ниньо",
      "Ла-Нинья",
      "Муссон",
      "Фён"
    ],
    [
      2,
      "Почему пустыня Атакама крайне сухая?",
      "Холодное течение и барьер Анд",
      "Тёплое течение",
      "Постоянные циклоны",
      "Близость экватора"
    ],
    [
      2,
      "Как называют линии одинаковой солёности океана?",
      "Изогалины",
      "Изотермы",
      "Изобары",
      "Изогиеты"
    ],
    [
      2,
      "Какой процесс образует карстовые пещеры?",
      "Растворение пород водой",
      "Застывание лавы",
      "Движение ледника",
      "Извержение вулкана"
    ],
    [
      2,
      "Какая граница плит вызывает сдвиг без образования коры?",
      "Трансформная",
      "Дивергентная",
      "Конвергентная",
      "Пассивная"
    ],
    [
      2,
      "Какой тип облаков чаще связан с грозами?",
      "Кучево-дождевые",
      "Перистые",
      "Слоистые",
      "Высокослоистые"
    ],
    [
      2,
      "Как называется перенос обломков ледником?",
      "Ледниковая транспортировка",
      "Дефляция",
      "Субдукция",
      "Конденсация"
    ],
    [
      2,
      "Что такое альбедо?",
      "Доля отражённого излучения",
      "Скорость ветра",
      "Глубина океана",
      "Солёность воды"
    ],
    [
      2,
      "Где наиболее выражены пассаты?",
      "В тропических широтах",
      "На полюсах",
      "В стратосфере",
      "В высоких горах"
    ],
    [
      2,
      "Какая причина образования фьордов?",
      "Затопление ледниковых долин",
      "Извержение вулкана",
      "Накопление песка",
      "Высыхание озера"
    ]
  ],
  "biology": [
    [
      1,
      "Где в клетке синтезируется большинство белков?",
      "На рибосомах",
      "В лизосомах",
      "В вакуолях",
      "В центриолях"
    ],
    [
      1,
      "Какую функцию выполняют митохондрии?",
      "Синтез АТФ",
      "Хранение наследственности",
      "Фотосинтез",
      "Синтез клеточной стенки"
    ],
    [
      1,
      "Какой процесс создаёт гаметы с половинным набором хромосом?",
      "Мейоз",
      "Митоз",
      "Диффузия",
      "Осмос"
    ],
    [
      1,
      "Какой компонент крови отвечает за свёртывание?",
      "Тромбоциты",
      "Эритроциты",
      "Лимфоциты",
      "Плазма без белков"
    ],
    [
      1,
      "Что переносит кислород в эритроцитах?",
      "Гемоглобин",
      "Инсулин",
      "Хлорофилл",
      "Коллаген"
    ],
    [
      1,
      "Как называется обмен газами через устьица листа?",
      "Газообмен",
      "Транскрипция",
      "Брожение",
      "Оплодотворение"
    ],
    [
      1,
      "Какой органоид содержит ферменты внутриклеточного пищеварения?",
      "Лизосома",
      "Рибосома",
      "Хлоропласт",
      "Ядрышко"
    ],
    [
      1,
      "Какой тип связи соединяет основания двух цепей ДНК?",
      "Водородная",
      "Ионная",
      "Металлическая",
      "Пептидная"
    ],
    [
      1,
      "Что является продуктом транскрипции?",
      "РНК",
      "Белок",
      "Липид",
      "Глюкоза"
    ],
    [
      1,
      "Что контролирует уровень глюкозы, снижая его?",
      "Инсулин",
      "Адреналин",
      "Тироксин",
      "Мелатонин"
    ],
    [
      1,
      "Как называется деление соматических клеток?",
      "Митоз",
      "Мейоз",
      "Конъюгация",
      "Оплодотворение"
    ],
    [
      1,
      "Какой сосуд несёт кровь от сердца?",
      "Артерия",
      "Вена",
      "Капилляр к сердцу",
      "Лимфатический проток"
    ],
    [
      2,
      "Какова вероятность aa при скрещивании Aa × Aa?",
      "25%",
      "50%",
      "75%",
      "100%"
    ],
    [
      2,
      "Какая РНК переносит аминокислоты к рибосоме?",
      "тРНК",
      "мРНК",
      "рРНК",
      "ДНК"
    ],
    [
      2,
      "Как называется синтез РНК на матрице ДНК?",
      "Транскрипция",
      "Трансляция",
      "Репликация",
      "Мутация"
    ],
    [
      2,
      "Что образуется при окислительном фосфорилировании?",
      "АТФ",
      "ДНК",
      "Хлорофилл",
      "Целлюлоза"
    ],
    [
      2,
      "Какие клетки вырабатывают антитела?",
      "Плазматические клетки",
      "Эритроциты",
      "Тромбоциты",
      "Нейроны"
    ],
    [
      2,
      "Какая структура регулирует вход веществ в клетку?",
      "Плазматическая мембрана",
      "Рибосома",
      "Ядрышко",
      "Центриоль"
    ],
    [
      2,
      "Что такое кодон?",
      "Тройка нуклеотидов мРНК",
      "Пара хромосом",
      "Тип фермента",
      "Часть липида"
    ],
    [
      2,
      "Что происходит при репликации ДНК?",
      "Удвоение ДНК",
      "Синтез белка",
      "Распад глюкозы",
      "Синтез АТФ"
    ],
    [
      2,
      "Как называется передача энергии между трофическими уровнями?",
      "Поток энергии",
      "Митоз",
      "Осмос",
      "Фотолиз"
    ],
    [
      2,
      "Какой этап клеточного дыхания идёт в цитоплазме?",
      "Гликолиз",
      "Цикл Кребса",
      "Электрон-транспортная цепь",
      "Фотосинтез"
    ]
  ],
  "chemistry": [
    [
      1,
      "Какой заряд имеет ион Ca²⁺?",
      "+2",
      "−2",
      "+1",
      "0"
    ],
    [
      1,
      "Сколько молей содержится в 18 г воды (M=18 г/моль)?",
      "1",
      "2",
      "0,5",
      "18"
    ],
    [
      1,
      "Какова валентность кислорода в H₂O?",
      "II",
      "I",
      "III",
      "IV"
    ],
    [
      1,
      "Какой тип связи в NaCl?",
      "Ионная",
      "Ковалентная неполярная",
      "Металлическая",
      "Водородная"
    ],
    [
      1,
      "Какая среда при pH=3?",
      "Кислая",
      "Нейтральная",
      "Щелочная",
      "Не определяется"
    ],
    [
      1,
      "Какой газ выделяется при реакции Zn с HCl?",
      "Водород",
      "Кислород",
      "Азот",
      "Хлор"
    ],
    [
      1,
      "Чему равен коэффициент перед O₂ в 2H₂ + O₂ → 2H₂O?",
      "1",
      "2",
      "3",
      "4"
    ],
    [
      1,
      "Какой элемент имеет атомный номер 6?",
      "Углерод",
      "Кислород",
      "Азот",
      "Бор"
    ],
    [
      1,
      "Какая формула у серной кислоты?",
      "H₂SO₄",
      "H₂SO₃",
      "HCl",
      "HNO₃"
    ],
    [
      1,
      "Какая реакция является нейтрализацией?",
      "Кислота + основание",
      "Металл + кислород",
      "Соль + соль всегда",
      "Вода + вода"
    ],
    [
      1,
      "Что является восстановлением?",
      "Присоединение электронов",
      "Отдача электронов",
      "Потеря нейтронов",
      "Испарение"
    ],
    [
      1,
      "Какая молярная масса CO₂ (C=12, O=16)?",
      "44 г/моль",
      "28 г/моль",
      "32 г/моль",
      "48 г/моль"
    ],
    [
      2,
      "Степень окисления Mn в KMnO₄?",
      "+7",
      "+2",
      "+4",
      "+6"
    ],
    [
      2,
      "Сколько молей в 11 г CO₂ (M=44 г/моль)?",
      "0,25",
      "0,5",
      "1",
      "4"
    ],
    [
      2,
      "Какая формула нитрата кальция?",
      "Ca(NO₃)₂",
      "CaNO₃",
      "Ca₂NO₃",
      "Ca(NO₂)₂"
    ],
    [
      2,
      "Каков коэффициент перед O₂ в 4Fe + 3O₂ → 2Fe₂O₃?",
      "3",
      "2",
      "4",
      "1"
    ],
    [
      2,
      "Что происходит с равновесием экзотермической реакции при нагревании?",
      "Смещается к реагентам",
      "Смещается к продуктам",
      "Не меняется никогда",
      "Реакция останавливается"
    ],
    [
      2,
      "Какой объём занимает 1 моль идеального газа при н.у. (школьное приближение)?",
      "22,4 л",
      "2,24 л",
      "44,8 л",
      "1 л"
    ],
    [
      2,
      "Какой окислитель в реакции Zn + CuSO₄ → ZnSO₄ + Cu?",
      "Cu²⁺",
      "Zn",
      "SO₄²⁻",
      "Cu"
    ],
    [
      2,
      "Сколько атомов O в 3 молекулах H₂SO₄?",
      "12",
      "4",
      "7",
      "9"
    ],
    [
      2,
      "Какой тип гибридизации углерода в CH₄?",
      "sp³",
      "sp²",
      "sp",
      "нет гибридизации"
    ],
    [
      2,
      "Каков pH нейтральной воды при 25 °C?",
      "7",
      "0",
      "14",
      "10"
    ]
  ]
};

  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  function addScreen(id, html) {
    if (document.getElementById(id)) return document.getElementById(id);
    const el = document.createElement('div');
    el.id = id;
    el.className = 'screen';
    el.innerHTML = html;
    document.getElementById('game-wrapper').appendChild(el);
    return el;
  }

  addScreen('scr-mode-pick', `
    <h1 style="font-size:clamp(26px,4vw,42px)">ВЫБЕРИ РЕЖИМ</h1>
    <p style="font-size:18px;text-align:center;max-width:650px">После выбора героя можно играть как раньше или пройти испытания по предметам.</p>
    <button class="btn" style="margin:12px" onclick="chooseRPGMode('levels')">🗺️ По уровням — классическая игра</button>
    <button class="btn" style="margin:12px;background:#6c3483;border-color:#512e5f" onclick="chooseRPGMode('subjects')">📚 По предметам — 3 босса</button>
  `);

  addScreen('scr-subject-difficulty', `
    <h1 style="font-size:clamp(26px,4vw,42px)">ВЫБЕРИ СЛОЖНОСТЬ</h1>
    <div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;max-width:850px">
      <button class="btn" style="background:#239b56;border-color:#196f3d" onclick="startSubjectRun('easy')">🟢 ЛЁГКИЙ<br><small>Математика</small><br><small>3 босса</small></button>
      <button class="btn" style="background:#2874a6;border-color:#1b4f72" onclick="startSubjectRun('medium')">🔵 СРЕДНИЙ<br><small>Английский + география</small><br><small>3 босса</small></button>
      <button class="btn" style="background:#922b21;border-color:#641e16" onclick="startSubjectRun('hard')">🔴 СЛОЖНЫЙ<br><small>Все предметы, сложность растёт</small><br><small>3 босса</small></button>
    </div>
    <button class="btn" style="margin-top:24px;background:#555;border-color:#333" onclick="show('scr-mode-pick')">⬅ Назад</button>
  `);

  window.chooseRPGMode = function(mode) {
    playMode = mode;
    subjectRun = false;
    if (mode === 'levels') show('scr-world');
    else show('scr-subject-difficulty');
  };

  window.startSubjectRun = function(level) {
    difficulty = level;
    subjectRun = true;
    playMode = 'subjects';
    bossNumber = 0;
    usedQuestions.clear();
    launchSubjectBoss();
  };

  // После выбора персонажа показываем выбор режима вместо немедленного перехода на карту.
  window.pickHero = function(type) {
    originalPickHero(type);
    show('scr-mode-pick');
  };

  function questionPool() {
    if (difficulty === 'easy') return ['math'];
    if (difficulty === 'medium') return ['english', 'geography'];
    return ['math', 'english', 'geography', 'biology', 'chemistry'];
  }

  // Сложность растёт плавно: второй босс не получает максимальную сложность сразу.
  function mathTier() {
    if (difficulty === 'easy') return bossNumber < 2 ? 0 : 1;
    if (difficulty === 'medium') return bossNumber === 0 ? 0 : (bossNumber === 1 ? 1 : 2);
    return bossNumber < 2 ? 1 : 2;
  }

  function makeMathQuestion() {
    const tier = mathTier();
    const ops = tier === 0 ? ['+', '-'] : (tier === 1 ? ['+', '-', '×'] : ['+', '-', '×', '÷']);
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;
    if (op === '+') {
      a = randInt(tier === 0 ? 1 : tier === 1 ? 10 : 25, tier === 0 ? 20 : tier === 1 ? 60 : 150);
      b = randInt(tier === 0 ? 1 : tier === 1 ? 5 : 15, tier === 0 ? 10 : tier === 1 ? 40 : 120);
      answer = a + b;
    } else if (op === '-') {
      a = randInt(tier === 0 ? 5 : tier === 1 ? 15 : 40, tier === 0 ? 30 : tier === 1 ? 100 : 250);
      b = randInt(1, a);
      answer = a - b;
    } else if (op === '×') {
      a = randInt(tier === 1 ? 2 : 5, tier === 1 ? 10 : 20);
      b = randInt(tier === 1 ? 2 : 5, tier === 1 ? 10 : 15);
      answer = a * b;
    } else {
      b = randInt(2, 12);
      answer = randInt(2, 15);
      a = b * answer;
    }
    const prompt = `${a} ${op === '÷' ? '÷' : op} ${b} = ?`;
    const answers = new Set([String(answer)]);
    while (answers.size < 4) {
      let wrong = answer + randInt(-Math.max(5, Math.floor(Math.abs(answer) / 3)), Math.max(5, Math.floor(Math.abs(answer) / 3)));
      if (wrong >= 0 && wrong !== answer) answers.add(String(Math.round(wrong)));
    }
    return { prompt, answers: shuffle([...answers]), correct: String(answer), category: 'Математика' };
  }

  function nextQuestion() {
    const pool = questionPool();
    // Сначала выбираем только те предметные вопросы, которые ещё не задавались.
    const available = pool.filter(category => category === 'math' ||
      subjectQuestions[category].some(row => row[0] === (bossNumber === 2 || (difficulty === 'hard' && bossNumber >= 1) ? 2 : 1) && !usedQuestions.has(`${category}:${row[1]}`)));
    // Если все вопросы выбранных предметов уже использованы, продолжаем уникальными примерами.
    const category = available.length ? available[Math.floor(Math.random() * available.length)] : (difficulty === 'hard' || difficulty === 'easy' ? 'math' : null);
    if (!category) return null;
    if (category === 'math') {
      let q;
      // Защита от случайного совпадения математических примеров в одной серии.
      for (let tries = 0; tries < 200; tries++) {
        q = makeMathQuestion();
        if (!usedQuestions.has(`math:${q.prompt}`)) break;
      }
      usedQuestions.add(`math:${q.prompt}`);
      return q;
    }
    const tier = bossNumber === 2 || (difficulty === 'hard' && bossNumber >= 1) ? 2 : 1;
    const source = subjectQuestions[category].filter(row => row[0] === tier && !usedQuestions.has(`${category}:${row[1]}`));
    const row = source[Math.floor(Math.random() * source.length)];
    usedQuestions.add(`${category}:${row[1]}`);
    return { prompt:row[1], answers:shuffle(row.slice(2)), correct:row[2], category:({english:'Английский',geography:'География',biology:'Биология',chemistry:'Химия'})[category] };
  }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function launchSubjectBoss() {
    const backgrounds = ['forest', 'ice', 'space'];
    zone = backgrounds[bossNumber % backgrounds.length];
    zoneStage = bossNumber + 1;
    wave = 5; // классический индикатор уровня показывает бой с боссом
    setBg(zone);
    show('scr-battle');
    updateStageVisuals();
    updateUI();
    const bossNames = difficulty === 'easy' ? ['Математический страж','Повелитель чисел','Король примеров'] : difficulty === 'medium' ? ['Страж знаний','Хранитель слов','Повелитель карт'] : ['Испытатель наук','Лорд знаний','Финальный босс'];
    document.getElementById('enemy-vis').innerText = ['👹','🐉','💀'][bossNumber];
    document.getElementById('enemy-vis').style.fontSize = '200px';
    document.getElementById('log-msg').innerText = `${bossNames[bossNumber]} — босс ${bossNumber + 1} из 3`;
    nextWave();
  }

  window.pickLevel = function(z, s) {
    if (!subjectRun) return originalPickLevel(z, s);
    // Если игрок нажал карту во время режима предметов, не выходим из серии боссов.
    launchSubjectBoss();
  };

  window.nextWave = function() {
    if (!subjectRun) return originalNextWave();
    const hpBase = difficulty === 'easy' ? 110 : difficulty === 'medium' ? 170 : 240;
    enemy.max = hpBase + bossNumber * (difficulty === 'hard' ? 100 : 60);
    enemy.hp = enemy.max;
    enemy.dmg = difficulty === 'easy' ? 10 + bossNumber * 2 : difficulty === 'medium' ? 12 + bossNumber * 3 : 15 + bossNumber * 4;
    updateUI();
    genMath();
  };

  window.genMath = function() {
    if (!subjectRun) return originalGenMath();
    answerLocked = false;
    questionNow = nextQuestion();
    if (!questionNow) {
      stopTimer();
      document.getElementById('math-display').textContent = 'Вопросы закончились! Начни новое прохождение, чтобы сыграть снова.';
      document.getElementById('answers-grid').replaceChildren();
      return;
    }
    const display = document.getElementById('math-display');
    display.textContent = `${questionNow.category}: ${questionNow.prompt}`;
    const grid = document.getElementById('answers-grid');
    grid.replaceChildren();
    questionNow.answers.forEach(answer => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ans-btn';
      button.textContent = answer;
      button.style.cssText = 'height:auto;min-height:70px;font-size:clamp(15px,2vw,24px);padding:10px;line-height:1.2;overflow-wrap:anywhere';
      button.onclick = () => checkAnswer(answer, button);
      grid.appendChild(button);
    });
    startTimer();
  };

  window.checkAnswer = function(value, button) {
    if (!subjectRun) return originalCheckAnswer(value, button);
    if (answerLocked || !questionNow) return;
    answerLocked = true;
    stopTimer();
    document.querySelectorAll('#answers-grid .ans-btn').forEach(b => b.disabled = true);
    if (String(value) === String(questionNow.correct)) {
      button.classList.add('ans-btn-correct');
      const reward = randInt(2, 5);
      hero.gold += reward;
      stats.solves++;
      log(`Верно! Боссу −${hero.dmg} HP, +${reward} 💰`, '#2ecc71');
      checkAchievements();
      setTimeout(() => {
        if (!subjectRun || !document.getElementById('scr-battle').classList.contains('active')) return;
        enemy.hp -= hero.dmg;
        shake('enemy-vis');
        updateUI();
        if (enemy.hp <= 0) subjectBossDefeated();
        else genMath();
      }, 300);
    } else {
      button.classList.add('ans-btn-wrong');
      const damage = randInt(10, 15);
      hero.hp = Math.max(0, hero.hp - damage);
      log(`Неправильно! Ты потерял ${damage} HP`, '#e74c3c');
      shake('hero-vis');
      updateUI();
      if (hero.hp <= 0) gameOver();
      else setTimeout(() => { if (subjectRun && document.getElementById('scr-battle').classList.contains('active')) genMath(); }, 650);
    }
  };

  window.timeOutPunishment = function() {
    if (!subjectRun) return originalTimeout();
    if (answerLocked) return;
    answerLocked = true;
    const damage = randInt(10, 15);
    hero.hp = Math.max(0, hero.hp - damage);
    log(`Время вышло! −${damage} HP`, '#e74c3c');
    shake('hero-vis');
    updateUI();
    if (hero.hp <= 0) gameOver();
    else setTimeout(() => { if (subjectRun && document.getElementById('scr-battle').classList.contains('active')) genMath(); }, 700);
  };

  function subjectBossDefeated() {
    hero.gold += 25 + bossNumber * 10;
    stats.kills++;
    checkAchievements();
    updateUI();
    if (bossNumber < 2) {
      document.getElementById('modal-story').dataset.finish = 'subject-next';
      document.getElementById('modal-story').style.display = 'flex';
      document.getElementById('story-title').innerText = 'БОСС ПОВЕРЖЕН!';
      document.getElementById('story-text-content').innerText = `Победа! Следующий бой: босс ${bossNumber + 2} из 3.`;
    } else {
      document.getElementById('modal-story').dataset.finish = 'subject-done';
      document.getElementById('modal-story').style.display = 'flex';
      document.getElementById('story-title').innerText = '🏆 ВСЕ 3 БОССА ПОБЕЖДЕНЫ!';
      document.getElementById('story-text-content').innerText = 'Отличная работа! Ты завершил режим по предметам.';
    }
  }

  window.proceedNext = function() {
    const modal = document.getElementById('modal-story');
    const finish = modal.dataset.finish;
    if (subjectRun && (finish === 'subject-next' || finish === 'subject-done')) {
      modal.style.display = 'none';
      if (finish === 'subject-next') {
        bossNumber++;
        launchSubjectBoss();
      } else {
        subjectRun = false;
        show('scr-mode-pick');
        setBg('main');
      }
      return;
    }
    return originalProceedNext();
  };

  // В классическом режиме сохраняем исходную карту и её механику.
  console.info('Режимы игры подключены: вопросы без повторов за прохождение, сложность растёт постепенно.');
})();
