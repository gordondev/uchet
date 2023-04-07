import { $authHost, $host } from "./index";

export const createVersion = async (version) => {
  const { data } = await $authHost.post("api/versionchecklist/create", version);
  return data;
};
