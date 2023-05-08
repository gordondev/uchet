import { $authHost, $host, $download } from "./index";

export const fetchActualThemes = async () => {
  const { data } = await $host.get("api/result/actual-themes/");
  return data;
};

export const fetchActualChecklists = async () => {
  const { data } = await $host.get("api/result/actual-checklists/");
  return data;
};

export const createResult = async (result) => {
  const { data } = await $authHost.post("api/result/create", result);
  return data;
};

export const fetchResult = async (limit, page, workInProgress, impactOnSave, division) => {
  const { data } = await $authHost.get("api/result/", {
    params: { limit, page, workInProgress, impactOnSave, division },
  });
  return data;
};

export const fetchOneResult = async (id) => {
  const { data } = await $host.get("api/result/" + id);
  return data;
};

export const download = async (id, file) => {
  const { data } = await $download.get("api/result/" + id + "/download/", {
    params: { file },
  });
  return data;
};
