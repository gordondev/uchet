import { $authHost, $host, $download } from "./index";

export const fetchActualThemes = async () => {
  const { data } = await $host.get("api/result/actual-themes/");
  return data;
};
