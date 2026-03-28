const logBox = document.getElementById("log");
const ipInput = document.getElementById("ip");
const onBtn = document.getElementById("onBtn");
const offBtn = document.getElementById("offBtn");
const saveIpBtn = document.getElementById("saveIpBtn");
const clearLogBtn = document.getElementById("clearLogBtn");
const checkBtn = document.getElementById("checkBtn");
const statusDot = document.getElementById("statusDot");
const miniStatus = document.getElementById("miniStatus");

const STORAGE_KEY = "onbon_controller_ip";

function log(message) {
  const time = new Date().toLocaleTimeString();
  logBox.textContent += `[${time}] ${message}\n`;
  logBox.scrollTop = logBox.scrollHeight;
}

function setStatus(type, text) {
  statusDot.classList.remove("ok", "error");

  if (type === "ok") statusDot.classList.add("ok");
  if (type === "error") statusDot.classList.add("error");

  miniStatus.textContent = text;
}

function getIp() {
  return ipInput.value.trim();
}

function saveIp() {
  const ip = getIp();
  if (!ip) {
    log("Нечего сохранять: IP пустой.");
    setStatus("error", "IP не указан");
    return;
  }

  localStorage.setItem(STORAGE_KEY, ip);
  log(`IP сохранён: ${ip}`);
  setStatus("", "IP сохранён");
}

function loadIp() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    ipInput.value = saved;
    log(`Загружен сохранённый IP: ${saved}`);
  } else {
    log("Сохранённый IP пока не найден.");
  }
}

async function sendCommand(path) {
  const ip = getIp();

  if (!ip) {
    log("Сначала введи IP контроллера.");
    setStatus("error", "Нет IP");
    return;
  }

  const url = `http://${ip}${path}`;
  log(`Отправка запроса: ${url}`);
  setStatus("", "Отправка...");

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors"
    });

    log(`HTTP статус: ${response.status}`);

    const text = await response.text().catch(() => "");
    if (text) {
      log(`Ответ: ${text}`);
    }

    setStatus("ok", "Запрос выполнен");
  } catch (error) {
    log(`Ошибка: ${error.message}`);
    setStatus("error", "Ошибка запроса");
  }

  log("--------------------");
}

async function checkConnection() {
  const ip = getIp();

  if (!ip) {
    log("Для проверки связи введи IP.");
    setStatus("error", "Нет IP");
    return;
  }

  const url = `http://${ip}`;
  log(`Проверка связи: ${url}`);
  setStatus("", "Проверка связи...");

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors"
    });

    log(`Контроллер ответил. HTTP статус: ${response.status}`);
    setStatus("ok", "Контроллер доступен");
  } catch (error) {
    log(`Связь не подтверждена: ${error.message}`);
    setStatus("error", "Связи нет");
  }

  log("--------------------");
}

saveIpBtn.addEventListener("click", saveIp);

clearLogBtn.addEventListener("click", () => {
  logBox.textContent = "Лог:\n";
  setStatus("", "Лог очищен");
});

checkBtn.addEventListener("click", checkConnection);

onBtn.addEventListener("click", () => {
  sendCommand("/turnOn");
});

offBtn.addEventListener("click", () => {
  sendCommand("/turnOff");
});

loadIp();
setStatus("", "Ожидание");
