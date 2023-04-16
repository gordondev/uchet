import { $authHost, $host } from "./index";

export const createChecklist = async (checklist) => {
  const { data } = await $authHost.post("api/checklist/create", checklist);
  return data;
};

export const fetchChecklist = async (versionChecklistId, limit, page) => {
  const { data } = await $authHost.get("api/checklist/", {
    params: { versionChecklistId, limit, page },
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
