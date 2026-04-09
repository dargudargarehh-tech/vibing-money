let money = 0;
let level = 1;
let clickPower = 1;
let upgradeCost = 50;

// 30 LEVELS (first 10 < 1000, next 20 increasingly far apart)
const levels = [
  0, 50, 100, 200, 350, 500, 700, 850, 950, 1000,  
  2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 
  5000000, 10000000, 25000000, 50000000, 100000000, 250000000, 500000000, 1000000000, 5000000000, 10000000000
];

// Shop items: name, baseCost, baseIncome, quantity, upgradeLevel
let shopItems = [
  {name: "Lemonade Stand", baseCost: 50, income: 1, qty: 0, upgradeLevel: 0},
  {name: "Vending Machine", baseCost: 500, income: 10, qty: 0, upgradeLevel: 0},
  {name: "Small Factory", baseCost: 5000, income: 100, qty: 0, upgradeLevel: 0},
  {name: "Mega Factory", baseCost: 50000, income: 1000, qty: 0, upgradeLevel: 0}
];

function clickMoney() {
  money += clickPower;
  updateLevel();
  updateDisplay();
  saveGame();
}

function buyUpgrade() {
  if (money >= upgradeCost) {
    money -= upgradeCost;
    clickPower *= 2;
    upgradeCost = Math.floor(upgradeCost * 2.5);
    updateDisplay();
    saveGame();
  }
}

function buyShopItem(index) {
  let item = shopItems[index];
  let cost = Math.floor(item.baseCost * Math.pow(1.15, item.qty));
  if (money >= cost) {
    money -= cost;
    item.qty += 1;
    updateDisplay();
    saveGame();
  }
}

function upgradeShopItem(index) {
  let item = shopItems[index];
  let upgradeCost = Math.floor(item.baseCost * Math.pow(2, item.upgradeLevel));
  if (money >= upgradeCost) {
    money -= upgradeCost;
    item.upgradeLevel += 1;
    item.income = Math.floor(item.income * 1.5);
    updateDisplay();
    saveGame();
  }
}

function updateLevel() {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (money >= levels[i]) {
      level = i + 1;
      break;
    }
  }
}

function updateDisplay() {
  document.getElementById("money").innerText = "$" + money.toLocaleString();
  document.getElementById("level").innerText = "Level " + level;
  renderShop();
}

function renderShop() {
  let shopDiv = document.getElementById("shop");
  shopDiv.innerHTML = "";
  shopItems.forEach((item, index) => {
    let cost = Math.floor(item.baseCost * Math.pow(1.15, item.qty));
    let upgradeCost = Math.floor(item.baseCost * Math.pow(2, item.upgradeLevel));
    let div = document.createElement("div");
    div.className = "shop-item";
    div.innerHTML = `
      ${item.name} - Cost: $${cost.toLocaleString()} - Produces $${item.income}/s - Owned: ${item.qty} 
      <button onclick="buyShopItem(${index})">Buy</button>
      Upgrade: $${upgradeCost.toLocaleString()} - Level ${item.upgradeLevel} 
      <button onclick="upgradeShopItem(${index})">Upgrade</button>
    `;
    shopDiv.appendChild(div);
  });
}

function autoGenerateMoney() {
  let totalIncome = 0;
  shopItems.forEach(item => {
    totalIncome += item.income * item.qty;
  });
  money += totalIncome;
  updateLevel();
  updateDisplay();
  saveGame();
}

function saveGame() {
  localStorage.setItem("vibingMoneySave", JSON.stringify({
    money, level, clickPower, upgradeCost, shopItems
  }));
}

function loadGame() {
  let save = JSON.parse(localStorage.getItem("vibingMoneySave"));
  if (save) {
    money = save.money;
    level = save.level;
    clickPower = save.clickPower;
    upgradeCost = save.upgradeCost;
    shopItems = save.shopItems;
  }
}

function updateLeaderboard() {
  let name = prompt("Enter your name for the Vibing Money leaderboard:");
  if (!name) return;

  let leaderboard = JSON.parse(localStorage.getItem("vibingMoneyLeaderboard")) || [];

  leaderboard.push({ name: name, money: money });
  leaderboard.sort((a, b) => b.money - a.money);
  leaderboard = leaderboard.slice(0, 5);

  localStorage.setItem("vibingMoneyLeaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("vibingMoneyLeaderboard")) || [];
  let list = document.getElementById("leaderboard");
  list.innerHTML = "";
  leaderboard.forEach(player => {
    let li = document.createElement("li");
    li.textContent = player.name + " - $" + player.money.toLocaleString();
    list.appendChild(li);
  });
}

// Auto-generate money every 1 second
setInterval(autoGenerateMoney, 1000);

// Save every 5 seconds
setInterval(saveGame, 5000);

// Detect max level
setInterval(() => {
  if (level === 30) {
    alert("🎉 You reached MAX LEVEL in Vibing Money!");
    updateLeaderboard();
  }
}, 3000);

// Load on start
loadGame();
updateDisplay();
renderLeaderboard();