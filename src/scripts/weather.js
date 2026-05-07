export async function getWeatherData() {
  const url = `https://object.amia.work/weather`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  }
}

export function updateWeatherWidget(widget, data) {
  if (!data) {
    widget.innerHTML = "<p>気象データの読み込みに失敗しました。</p>";
    return;
  }

  const {
    weather,
    temperature,
    atmospheric,
    wind,
    sun,
    lastUpdated,
    rain,
    snow,
  } = data;
  const widgetSize = widget.dataset.size || "small";
  const locale = "ja-JP-u-ca-japanese";
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Tokyo",
  };
  const dateTimeOptions = {
    era: "long",
    calendar: "japanese",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Tokyo",
  };
  const sunriseTime = new Date(sun.sunrise * 1000).toLocaleTimeString(
    locale,
    timeOptions,
  );
  const sunsetTime = new Date(sun.sunset * 1000).toLocaleTimeString(
    locale,
    timeOptions,
  );
  const updatedTime = new Date(lastUpdated * 1000).toLocaleString(
    locale,
    dateTimeOptions,
  );

  const weatherHtml = weather
    .map(
      (w) => `
        <div class="weather-item">
          <img src="https://openweathermap.org/payload/api/media/file/${w.icon}.png" alt="${w.description}">
          <span>${w.description}</span>
        </div>
      `,
    )
    .join("");

  let html = `<div class="weather-header">
${weatherHtml}
<span>${temperature.current}°C</span>
</div>`;

  if (widgetSize === "big") {
    html += `<div class="weather-content">
<p>体感温度: ${temperature.feelsLike} °C</p>
<p>湿度: ${atmospheric.humidity} %&nbsp;&nbsp;気圧: ${atmospheric.pressure} hPa</p>
<p>視程: ${atmospheric.visibility} m&nbsp;&nbsp;雲量: ${atmospheric.clouds} %</p>
<p>風: <span class="wind-arrow">↑</span> ${wind.speed} m/s&nbsp;&nbsp;突風: ${wind.gust} m/s</p>
<p>日の出/日の入り: ${sunriseTime} / ${sunsetTime}</p>
${rain > 0 ? `<p>降水量 (過去1時間): ${rain} mm</p>` : ""}
${snow > 0 ? `<p>降雪量 (過去1時間): ${snow} mm</p>` : ""}
<p>観測時刻: ${updatedTime}</p>
</div>`;
  }

  widget.innerHTML = html;

  if (widgetSize === "big") {
    const windArrow = widget.querySelector(".wind-arrow");
    if (windArrow) {
      windArrow.style.transform = `rotate(${wind.direction + 180}deg)`;
    }
  }
}
