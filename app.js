const logBox = document.getElementById("log");
const ipInput = document.getElementById("ip");
const onBtn = document.getElementById("onBtn");
const offBtn = document.getElementById("offBtn");

function log(message) {
  logBox.textContent += message + "\n";
}

async function sendCommand(path) {
  const ip = ipInput.value.trim();

  if (!ip) {
    log("Сначала введи IP контроллера.");
    return;
  }

  const url = `http://${ip}${path}`;
  log(`Отправка: ${url}`);

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
  } catch (error) {
    log(`Ошибка: ${error.message}`);
  }

  log("--------------------");
}

onBtn.addEventListener("click", () => {
  sendCommand("/turnOn");
});

offBtn.addEventListener("click", () => {
  sendCommand("/turnOff");
});