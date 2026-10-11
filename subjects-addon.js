/* Дополнение к RPG game153. Исходные функции остаются в index.html. */
(() => {
  'use strict';
  const sets = {
    ice: [
      ['Столица Казахстана?', 'Астана', 'Алматы', 'Шымкент', 'Атырау'],
      ['Самый большой океан?', 'Тихий', 'Атлантический', 'Индийский', 'Северный Ледовитый'],
      ['На каком материке находится Египет?', 'Африка', 'Азия', 'Европа', 'Южная Америка'],
      ['Столица Японии?', 'Токио', 'Киото', 'Пекин', 'Сеул'],
      ['Какая река протекает через Лондон?', 'Темза', 'Сена', 'Дунай', 'Рейн'],
      ['Какая пустыня находится в Северной Африке?', 'Сахара', 'Гоби', 'Атакама', 'Каракумы'],
      ['На каком материке расположена Бразилия?', 'Южная Америка', 'Африка', 'Австралия', 'Европа'],
      ['Какая гора самая высокая над уровнем моря?', 'Эверест', 'Эльбрус', 'Килиманджаро', 'Монблан'],
      ['Столица Франции?', 'Париж', 'Рим', 'Берлин', 'Мадрид'],
      ['Какой океан омывает западную часть Европы?', 'Атлантический', 'Тихий', 'Индийский', 'Южный'],
      ['На каком материке находится Антарктида?', 'Антарктида', 'Австралия', 'Евразия', 'Африка'],
      ['Столица Канады?', 'Оттава', 'Торонто', 'Ванкувер', 'Монреаль']
    ],
    hell: [
      ['Какой орган перекачивает кровь?', 'Сердце', 'Печень', 'Желудок', 'Почка'],
      ['Где происходит фотосинтез у растений?', 'В хлоропластах', 'В ядре', 'В митохондриях', 'В вакуоли'],
      ['Какой газ нужен человеку для дыхания?', 'Кислород', 'Азот', 'Гелий', 'Водород'],
      ['Что переносит наследственную информацию?', 'ДНК', 'Вода', 'Крахмал', 'Кальций'],
      ['Как называется основная единица живого?', 'Клетка', 'Орган', 'Ткань', 'Молекула воды'],
      ['Какие клетки переносят кислород в крови?', 'Эритроциты', 'Нейроны', 'Тромбоциты', 'Лейкоциты'],
      ['Какой орган отвечает за газообмен у человека?', 'Лёгкие', 'Печень', 'Сердце', 'Желудок'],
      ['Какой пигмент делает листья зелёными?', 'Хлорофилл', 'Гемоглобин', 'Меланин', 'Каротин'],
      ['Что изучает ботаника?', 'Растения', 'Минералы', 'Планеты', 'Погоду'],
      ['К какой группе относятся грибы?', 'Отдельное царство', 'Животные', 'Растения', 'Бактерии'],
      ['Какой орган фильтрует кровь и образует мочу?', 'Почки', 'Лёгкие', 'Кожа', 'Сердце'],
      ['Что необходимо семени для прорастания?', 'Вода', 'Пластик', 'Соль', 'Бензин']
    ],
    space: [
      ['Перевод слова «apple»?', 'Яблоко', 'Апельсин', 'Груша', 'Банан'],
      ['Choose the correct form: She ___ a student.', 'is', 'are', 'am', 'be'],
      ['Перевод слова «sky»?', 'Небо', 'Море', 'Земля', 'Лес'],
      ['Past Simple of «go»?', 'went', 'goed', 'gone', 'going'],
      ['Choose the plural: one child — two ...', 'children', 'childs', 'childes', 'child'],
      ['Перевод слова «beautiful»?', 'Красивый', 'Быстрый', 'Громкий', 'Холодный'],
      ['Choose: I ___ English every day.', 'study', 'studies', 'studying', 'studied tomorrow'],
      ['What is the opposite of «hot»?', 'cold', 'warm', 'big', 'high'],
      ['Перевод слова «library»?', 'Библиотека', 'Лаборатория', 'Магазин', 'Больница'],
      ['Choose: There ___ three books.', 'are', 'is', 'am', 'be'],
      ['Past Simple of «eat»?', 'ate', 'eated', 'eaten', 'eating'],
      ['What does «because» mean?', 'Потому что', 'Несмотря на', 'Никогда', 'Вместо']
    ],
    cave: [
      ['Химический символ кислорода?', 'O', 'H', 'N', 'C'],
      ['Формула воды?', 'H₂O', 'CO₂', 'NaCl', 'O₂'],
      ['Как называется частица с отрицательным зарядом?', 'Электрон', 'Протон', 'Нейтрон', 'Ядро'],
      ['Химический символ золота?', 'Au', 'Ag', 'Fe', 'Cu'],
      ['Какой газ обозначают CO₂?', 'Углекислый газ', 'Кислород', 'Азот', 'Водород'],
      ['Какой элемент обозначают Fe?', 'Железо', 'Фтор', 'Фосфор', 'Франций'],
      ['Формула поваренной соли?', 'NaCl', 'HCl', 'KOH', 'H₂SO₄'],
      ['Какой заряд имеет протон?', 'Положительный', 'Отрицательный', 'Нулевой', 'Переменный'],
      ['Сколько атомов водорода в молекуле H₂O?', '2', '1', '3', '4'],
      ['Какая частица не имеет электрического заряда?', 'Нейтрон', 'Протон', 'Электрон', 'Ион Na⁺'],
      ['Какая формула у молекулярного кислорода?', 'O₂', 'O₃', 'CO', 'H₂'],
      ['Как называется вещество с pH меньше 7?', 'Кислота', 'Щёлочь', 'Нейтральное вещество', 'Металл']
    ]
  };
  const labels = {ice:'География', hell:'Биология', space:'Английский язык', cave:'Химия'};
  const baseGen = genMath;
  const baseCheck = checkAnswer;
  const baseTimeout = timeOutPunishment;
  let current = null;
  let busy = false;
  const previous = {};
  const shuffle = a => { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
  document.querySelectorAll('.zone-card').forEach(card => {
    const z = card.querySelector('[data-z]')?.dataset.z;
    if(labels[z]) card.querySelector('.z-desc').textContent = labels[z];
  });
  const display = document.getElementById('math-display');
  display.style.cssText += ';max-width:92%;width:92%;box-sizing:border-box;text-align:center;font-size:clamp(17px,2.9vw,29px);padding:16px 12px;line-height:1.25;min-height:80px;display:flex;align-items:center;justify-content:center;';
  genMath = function() {
    if(!sets[zone]) { current=null; busy=false; baseGen(); return; }
    busy = false;
    const items=sets[zone];
    const candidates = items.filter(q=>q!==previous[zone]);
    current = candidates[Math.floor(Math.random()*candidates.length)];
    previous[zone] = current;
    mathAnswer = 0;
    display.textContent = current[0];
    const grid = document.getElementById('answers-grid');
    grid.replaceChildren();
    const opts=shuffle(current.slice(1).map((answer,index)=>({answer,index})));
    opts.forEach(opt=>{
      const b=document.createElement('button');
      b.type='button';b.className='ans-btn';b.textContent=opt.answer;
      b.style.cssText='height:80px;font-size:clamp(15px,2vw,24px);padding:6px 12px;line-height:1.15;overflow-wrap:anywhere;';
      b.onclick=()=>checkAnswer(opt.index,b);
      grid.appendChild(b);
    });
    startTimer();
  };
  checkAnswer = function(value, button) {
    if(!sets[zone] || !current) return baseCheck(value,button);
    if(busy) return;
    busy = true;
    stopTimer();
    document.querySelectorAll('#answers-grid .ans-btn').forEach(b=>b.disabled=true);
    if(value===0){
      button.classList.add('ans-btn-correct');
      const reward=Math.floor(Math.random()*4)+2;
      hero.gold+=reward;stats.solves++;
      log(`Правильно! Урон врагу: ${hero.dmg}. +${reward} 💰`,'#2ecc71');
      if(timer>=18) unlockAchievement('speed');
      checkAchievements();updateUI();
      setTimeout(()=>{
        if(!document.getElementById('scr-battle').classList.contains('active'))return;
        enemy.hp-=hero.dmg;shake('enemy-vis');
        if(enemy.hp<=0)winWave();else genMath();
        updateUI();
      },350);
    } else {
      const damage=10+Math.floor(Math.random()*6);
      button.classList.add('ans-btn-wrong');
      log(`Неверно! −${damage} HP`,'#e74c3c');
      shake('hero-vis');hero.hp=Math.max(0,hero.hp-damage);updateUI();
      if(hero.hp<=0)gameOver();else setTimeout(()=>{
        if(document.getElementById('scr-battle').classList.contains('active'))genMath();
      },650);
    }
  };
  timeOutPunishment = function(){
    if(!sets[zone]) return baseTimeout();
    const damage=10+Math.floor(Math.random()*6);
    log(`Время вышло! −${damage} HP`,'#e74c3c');
    hero.hp=Math.max(0,hero.hp-damage);shake('hero-vis');updateUI();
    if(hero.hp<=0)gameOver();else setTimeout(()=>{
      if(document.getElementById('scr-battle').classList.contains('active'))genMath();
    },1000);
  };
  console.info('Дополнение: география, биология, английский и химия загружены.');
})();
