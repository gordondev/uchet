import { $authHost, $host } from "./index";

export const createVersion = async (version) => {
  const { data } = await $authHost.post("api/versionchecklist/create", version);
  return data;
};

export const fetchVersionChecklist = async (limit, page) => {
    const {data} = await $authHost.get('api/versionchecklist/', { params: { limit, page } });
    return data;
}
