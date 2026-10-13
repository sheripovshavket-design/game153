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
    geography: [
      ['Какова столица Казахстана?', 'Астана', 'Алматы', 'Шымкент', 'Актобе'],
      ['Какой океан самый большой?', 'Тихий', 'Атлантический', 'Индийский', 'Северный Ледовитый'],
      ['На каком материке находится Бразилия?', 'Южная Америка', 'Африка', 'Европа', 'Австралия'],
      ['Как называется самая высокая гора мира?', 'Эверест', 'Эльбрус', 'Монблан', 'Килиманджаро'],
      ['Столица Японии?', 'Токио', 'Киото', 'Пекин', 'Сеул'],
      ['Какая река протекает через Лондон?', 'Темза', 'Сена', 'Рейн', 'Дунай'],
      ['Какой материк самый холодный?', 'Антарктида', 'Евразия', 'Африка', 'Австралия'],
      ['Столица Франции?', 'Париж', 'Рим', 'Берлин', 'Мадрид']
    ],
    english: [
      ['Choose: She ___ my friend.', 'is', 'are', 'am', 'be'],
      ['Past Simple of “go”?', 'went', 'goed', 'gone', 'going'],
      ['What is the opposite of “hot”?', 'cold', 'warm', 'high', 'big'],
      ['Перевод слова “library”?', 'Библиотека', 'Лаборатория', 'Больница', 'Магазин'],
      ['Choose: There ___ two books.', 'are', 'is', 'am', 'be'],
      ['Plural of “child”?', 'children', 'childs', 'childes', 'child'],
      ['Перевод слова “beautiful”?', 'Красивый', 'Быстрый', 'Громкий', 'Холодный'],
      ['Past Simple of “eat”?', 'ate', 'eated', 'eaten', 'eating']
    ],
    biology: [
      ['Какой орган перекачивает кровь?', 'Сердце', 'Печень', 'Желудок', 'Почка'],
      ['Где происходит фотосинтез?', 'В хлоропластах', 'В ядре', 'В митохондриях', 'В вакуоли'],
      ['Какова основная единица живого организма?', 'Клетка', 'Орган', 'Ткань', 'Молекула'],
      ['Какие клетки крови переносят кислород?', 'Эритроциты', 'Нейроны', 'Тромбоциты', 'Лейкоциты'],
      ['Какой орган отвечает за газообмен?', 'Лёгкие', 'Печень', 'Сердце', 'Желудок'],
      ['Какой пигмент придаёт листьям зелёный цвет?', 'Хлорофилл', 'Гемоглобин', 'Меланин', 'Кератин']
    ],
    chemistry: [
      ['Формула воды?', 'H₂O', 'CO₂', 'NaCl', 'O₂'],
      ['Химический символ кислорода?', 'O', 'H', 'N', 'C'],
      ['Как называется частица с отрицательным зарядом?', 'Электрон', 'Протон', 'Нейтрон', 'Ядро'],
      ['Химический символ золота?', 'Au', 'Ag', 'Fe', 'Cu'],
      ['Какой элемент обозначает Fe?', 'Железо', 'Фтор', 'Фосфор', 'Франций'],
      ['Формула поваренной соли?', 'NaCl', 'HCl', 'KOH', 'H₂SO₄']
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
      subjectQuestions[category].some(row => !usedQuestions.has(`${category}:${row[0]}`)));
    // Если все вопросы выбранных предметов уже использованы, продолжаем уникальными примерами.
    const category = available.length ? available[Math.floor(Math.random() * available.length)] : 'math';
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
    const source = subjectQuestions[category].filter(row => !usedQuestions.has(`${category}:${row[0]}`));
    const row = source[Math.floor(Math.random() * source.length)];
    usedQuestions.add(`${category}:${row[0]}`);
    return { prompt:row[0], answers:shuffle(row.slice(1)), correct:row[1], category:({english:'Английский',geography:'География',biology:'Биология',chemistry:'Химия'})[category] };
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
