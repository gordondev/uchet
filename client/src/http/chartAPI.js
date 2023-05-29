import { $authHost, $host, $download } from "./index";

export const fetchCountResults = async () => {
  const { data } = await $authHost.get("api/chart/");
  return data;
};