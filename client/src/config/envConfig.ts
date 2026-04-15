function getRequiredEnvVariable(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

const Env = {
  API_URL: getRequiredEnvVariable('VITE_API_URL'),
  MODEL: getRequiredEnvVariable('VITE_MODEL'),
};

export const { API_URL, MODEL } = Env;