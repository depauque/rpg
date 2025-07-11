const playerImg = document.querySelector("#player-img");
const playerNameText = document.querySelector("#name");
const playerHPText = document.querySelector("#health");
const playerGoldText = document.querySelector("#gold");
const playerXPText = document.querySelector("#xp");
const playerLuckText = document.querySelector("#luck");
const currentWeaponText = document.querySelector("#weapon");
const monsterImg = document.querySelector("#monster-img");
const monsterNameText = document.querySelector("#monster-name");
const monsterHealthText = document.querySelector("#monster-health");
const monsterGoldText = document.querySelector("#monster-gold");
const monsterLevelText = document.querySelector("#monster-level");
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const gameLog = document.querySelector("#game-log");

const player = prompt("Введите имя игрока") || "Игрок";
let isOldWeaponSold = false;
let currentWeapon = 0;
let xp = 0;
let hp = 100;
let gold = 50;
let luck = 0;
let monsterHealth;
let monsterLevel;
let monsterGold;

const monsters = [
  {
    name: "Пещерный гоблин",
    hp: 60,
    gold: 15,
    level: 5,
  },
  {
    name: "Ледяной элементаль",
    hp: 135,
    gold: 40,
    level: 10,
  },
  {
    name: "Чёрный дракон",
    hp: 340,
    gold: 185,
    level: 25,
  },
];

const weapons = [
  { name: "Палка", damage: 5 },
  { name: "Кинжал", damage: 10 },
  { name: "Двуручный меч", damage: 15 },
];

const locations = [
  {
    name: "Город",
    buttons_names: ["Магазин", "Таверна", "Подземелье"],
    buttons_actions: [goShop, goTavern, goDungeon],
    text: "Вы на городской площади.",
  },
  {
    name: "Магазин",
    buttons_names: [
      "+10 здоровья" + "\n" + "-10🪙",
      "Купить оружие" + "\n" + "-50🪙",
      "Вернуться в город",
    ],
    buttons_actions: [buyHealth, buyWeapon, goTown],
    text: "Вы в магазине.",
  },
  {
    name: "Таверна",
    buttons_names: ["Выпить эля", "Сыграть в карты", "Вернуться в город"],
    buttons_actions: [drinkBeer, playCards, goTown],
    text: "Вы в таверне.",
  },
  {
    name: "Подземелье",
    buttons_names: [monsters[0].name, monsters[1].name, monsters[2].name],
    buttons_actions: [fightGoblin, fightElemental, fightDragon],
    text: "Вы в подземелье. Выберите противника.",
  },
  {
    name: "Сражаться",
    buttons_names: ["Атаковать", "Увернуться", "Убежать"],
    buttons_actions: [attack, dodge, goTown],
    text: `Вы вступили в бой.`,
  },
  {
    name: "Монстр убит",
    buttons_names: [
      "Вернуться в город",
      "Вернуться в город",
      "Вернуться в город",
    ],
    buttons_actions: [goTown, goTown, goTown],
    text: "Монстр убит. Вы получили опыт и золото!",
  },
  {
    name: "Поражение",
    buttons_names: ["Начать заново", "Начать заново", "Начать заново"],
    buttons_actions: [restart, restart, restart],
    text: "Игрок убит. ☠️",
  },
  {
    name: "Победа",
    buttons_names: ["Начать заново", "Начать заново", "Начать заново"],
    buttons_actions: [restart, restart, restart],
    text: "Дракон повержен. Вы победили! 🏆",
  },
];

button1.textContent = locations[0].buttons_names[0];
button2.textContent = locations[0].buttons_names[1];
button3.textContent = locations[0].buttons_names[2];
button1.onclick = locations[0].buttons_actions[0];
button2.onclick = locations[0].buttons_actions[1];
button3.onclick = locations[0].buttons_actions[2];

playerNameText.innerText = player;
playerHPText.innerText = hp;
playerGoldText.innerText = gold;
playerXPText.innerText = xp;
playerLuckText.innerText = luck;
currentWeaponText.innerText = weapons[currentWeapon].name;

function update(location) {
  button1.innerText = location.buttons_names[0];
  button2.innerText = location.buttons_names[1];
  button3.innerText = location.buttons_names[2];
  button1.onclick = location.buttons_actions[0];
  button2.onclick = location.buttons_actions[1];
  button3.onclick = location.buttons_actions[2];
  monsterHealth = "?";
  monsterGold = "?";
  monsterLevel = "?";
  monsterImg.src = "/images/blank.jpg";
  monsterNameText.innerText = "???";
  monsterHealthText.innerText = monsterHealth;
  monsterGoldText.innerText = monsterGold;
  monsterLevelText.innerText = monsterLevel;
  gameLog.innerText += `\n${location.text}`;
  trimGameLog();
}

function goTown() {
  update(locations[0]);
}

function goShop() {
  update(locations[1]);
}

function goTavern() {
  update(locations[2]);
}

function goDungeon() {
  update(locations[3]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    hp += 10;
    playerGoldText.innerText = gold;
    playerHPText.innerText = hp;
  } else {
    gameLog.innerText += `\nНедостаточно золота.`;
  }
  trimGameLog();
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 50) {
      gold -= 50;
      currentWeapon++;
      playerGoldText.innerText = gold;
      currentWeaponText.innerText = weapons[currentWeapon].name;
      gameLog.innerText += `\nВы купили ${weapons[currentWeapon].name}.`;
    } else {
      gameLog.innerText += `\nНедостаточно золота.`;
    }
  } else {
    gameLog.innerText += `\nУ вас уже самое мощное оружие.`;
    button2.innerText = "Продать оружие" + "\n" + "+25🪙";
    button2.onclick = sellWeapon;
  }
  trimGameLog();
}

function sellWeapon() {
  if (!isOldWeaponSold) {
    gold += 25;
    playerGoldText.innerText = gold;
    isOldWeaponSold = true;
    gameLog.innerText += `\nВы продали своё старое оружие за 25 золота.`;
  } else {
    gameLog.innerText += `\nУ вас не осталось оружия для продажи.`;
  }
  trimGameLog();
}

function drinkBeer() {
  const xpGain = Math.floor(Math.random() * 10) + 1;
  const hpLoss = Math.floor(Math.random() * 10) + 5;
  xp += xpGain;
  hp -= hpLoss;
  playerXPText.innerText = xp;
  playerHPText.innerText = hp;

  if (hp <= 0) {
    lose();
    return;
  }

  gameLog.innerText += `\nВы выпили эля и услышали пару занятных историй (+${xpGain} опыта, -${hpLoss} здоровья).`;
  trimGameLog();
}

function playCards() {
  const points = Math.floor(Math.random() * 16) + 1;

  if (points > gold) {
    gameLog.innerText += `\nУ вас не хватает золота.`;
    trimGameLog();
    return;
  }

  if (Math.random() >= 0.55) {
    gold += points;
    luck++;
    gameLog.innerText += `\nВы выиграли ${points} золота. +1 к удаче.`;
  } else {
    gold -= points;
    luck--;
    gameLog.innerText += `\nВы проиграли ${points} золота. -1 к удаче.`;
  }

  playerGoldText.innerText = gold;
  playerLuckText.innerText = luck;
  trimGameLog();
}

function fightGoblin() {
  update(locations[4]);
  updateEnemy(0);
  monsterImg.src = "images/goblin.jpg";
}

function fightElemental() {
  update(locations[4]);
  updateEnemy(1);
  monsterImg.src = "images/elemental.jpg";
}

function fightDragon() {
  update(locations[4]);
  updateEnemy(2);
  monsterImg.src = "images/dragon.jpg";
}

function updateEnemy(rank) {
  monsterHealth = monsters[rank].hp;
  monsterGold = monsters[rank].gold;
  monsterLevel = monsters[rank].level;
  monsterNameText.innerText = monsters[rank].name;
  monsterHealthText.innerText = monsterHealth;
  monsterGoldText.innerText = monsterGold;
  monsterLevelText.innerText = monsterLevel;
}

function attack() {
  let damage = calcPlayerDamage(
    xp,
    monsterLevel,
    weapons[currentWeapon].damage,
    luck
  );

  monsterHealth -= damage;
  hp -= Math.floor(Math.random() * 8) + monsterLevel;

  gameLog.innerText += `\n${monsterNameText.innerText} атакует.`;
  gameLog.innerText += ` Вы наносите ${damage} урона с помощью ${currentWeaponText.innerText}.`;
  trimGameLog();

  monsterHealthText.innerText = monsterHealth;
  playerHPText.innerText = hp;

  if (hp <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (monsterLevel === 25) {
      winGame();
    } else {
      defeatMonster();
    }
  }
}

function calcPlayerDamage(playerXP, monsterLvl, weaponDamage, luck) {
  return Math.max(
    1,
    Math.floor(
      weaponDamage +
        (playerXP || 1) / 5 +
        Math.random() * 10 +
        luck * 5 -
        monsterLvl * 0.7
    )
  );
}

function calcMonsterDamage() {
  return Math.floor(Math.random() * 8) + monsterLevel;
}

function dodge() {
  if (Math.random() >= (luck > 1 ? 0.45 : 0.55)) {
    const skillPoints = Math.floor(Math.random() * 3) + 1;
    xp += skillPoints;
    playerXPText.innerText = xp;
    gameLog.innerText += `\nВы увернулись от атаки и получили ${skillPoints} опыта.`;
  } else {
    hp -= calcMonsterDamage();
    playerHPText.innerText = hp;
    gameLog.innerText += `\nВы не смогли увернуться от атаки и получили урон.`;
  }
  if (hp <= 0) {
    lose();
  }
  trimGameLog();
}

function defeatMonster() {
  const skillPoints = monsterLevel + Math.floor(Math.random() * monsterLevel);
  xp += skillPoints;
  gold += monsterGold + Math.floor(Math.random() * monsterGold) + 15;
  playerXPText.innerText = xp;
  playerGoldText.innerText = gold;
  update(locations[5]);
}

function lose() {
  update(locations[6]);
}

function winGame() {
  update(locations[7]);
}

function restart() {
  isOldWeaponSold = false;
  currentWeapon = 0;
  xp = 0;
  hp = 100;
  gold = 50;
  luck = 0;
  playerNameText.innerText = player;
  playerHPText.innerText = hp;
  playerGoldText.innerText = gold;
  playerXPText.innerText = xp;
  playerLuckText.innerText = luck;
  currentWeaponText.innerText = weapons[currentWeapon].name;
  goTown();
  gameLog.innerText =
    "Вы стоите на пыльной площади старого города. Куда направитесь?";
}

function trimGameLog() {
  gameLog.innerText = gameLog.innerText.split("\n").slice(-14).join("\n");
}
