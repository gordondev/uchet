import { $authHost, $host, $download } from "./index";

export const createChecklist = async (checklist, id) => {
  const { data } = await $authHost.post("api/checklist/create/versionchecklist-id/" + id, checklist);
  return data;
};

export const fetchChecklist = async (limit, page, versionChecklistId, title, id) => {
  const { data } = await $authHost.get("api/checklist/", {
    params: { limit, page, versionChecklistId, title },
  });
  return data;
};

export const fetchOneChecklist = async (id) => {
  const { data } = await $host.get("api/checklist/" + id);
  return data;
};

export const updateOne = async (id, newChecklist) => {
  await $host.put("api/checklist/edit/" + id, newChecklist);
};

export const deleteOne = async (id) => {
  await $host.delete("api/checklist/edit/" + id);
};

export const download = async (id, file) => {
  const { data } = await $download.get("api/checklist/" + id + "/download/", {
    params: { file },
  });
  return data;
};
