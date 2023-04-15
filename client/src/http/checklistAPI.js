import { $authHost, $host } from "./index";

export const createChecklist = async (checklist) => {
  const { data } = await $authHost.post("api/checklist/create", checklist);
  return data;
};

export const fetchChecklist = async (limit, page) => {
    const {data} = await $authHost.get('api/checklist/', { params: { limit, page } });
    return data;
};

export const fetchOneChecklist = async (id) => {
    const {data} = await $host.get('api/checklist/' + id)
    return data
};