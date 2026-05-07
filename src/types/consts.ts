export type siteType = {
  title: string;
  description: string;
  cfAnalyticsToken?: string;
  cfTurnstileSiteKey: string;
};

export type protectType = {
  question: string;
  password: string;
};

export interface TransformedWeatherData {
  weather: {
    description: string;
    icon: string;
  };
  temperature: {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
  };
  atmospheric: {
    pressure: number;
    humidity: number;
    seaLevel: number;
    groundLevel: number;
    visibility: number;
  };
  wind: {
    speed: number;
    direction: number;
    gust: number;
  };
  clouds: number;
  sun: {
    sunrise: number;
    sunset: number;
  };
  lastUpdated: number;
  rain?: number;
  snow?: number;
}

export type verifyTypes = {
  success: boolean;
  "error-codes"?: string[];
};

export type argon2Types = {
  success: boolean;
  errcode?: string;
};
