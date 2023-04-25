import { $authHost, $host, $download } from "./index";

export const createVersion = async (version) => {
  const { data } = await $authHost.post("api/versionchecklist/create", version);
  return data;
};

export const editVersion = async (version) => {
  const { data } = await $authHost.post("api/versionchecklist/create", version);
  return data;
};

export const fetchVersionChecklist = async (limit, page, actualKey, title) => {
  const { data } = await $authHost.get("api/versionchecklist/", {
    params: { limit, page, actualKey, title },
  });
  return data;
};

export const fetchOneVersion = async (id) => {
  const { data } = await $host.get("api/versionchecklist/" + id);
  return data;
};

export const deleteOne = async (id) => {
  await $host.delete("api/versionchecklist/edit/" + id);
};

export const updateOne = async (id, newVersion) => {
  await $host.put("api/versionchecklist/edit/" + id, newVersion);
};

export const downloadHeaderFile = async (id, headerFile) => {
  const { data } = await $download.get("api/versionchecklist/" + id + "/download-header/", { params: { headerFile } });
  return data;
};

export const downloadCommentFile = async (id, commentFile) => {
  const { data } = await $download.get("api/versionchecklist/" + id + "/download-comment/", { params: { commentFile } });
  return data;
};
