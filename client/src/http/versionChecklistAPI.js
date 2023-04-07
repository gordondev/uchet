import { $authHost, $host } from "./index";

export const createVersion = async (version) => {
  const { data } = await $authHost.post("api/versionchecklist/create", version);
  return data;
};

export const fetchVersionChecklist = async () => {
    const {data} = await $authHost.get('api/versionchecklist/');
    return data;
}