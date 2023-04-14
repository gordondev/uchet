import { $authHost, $host } from "./index";

export const createChecklist = async (checklist) => {
  const { data } = await $authHost.post("api/checklist/create", checklist);
  return data;
};