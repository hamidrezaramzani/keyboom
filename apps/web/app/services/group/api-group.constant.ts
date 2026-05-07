export const GROUP_ENDPOINTS = {
  create: "/groups",
  readMany: (workspaceId: string) => `/groups/${workspaceId}`,
  update: (groupId: string) => `/groups/${groupId}`,
  reorder: "/groups/reorder",
  archive: (groupId: string) => `/groups/${groupId}/archive`,
  restore: (groupId: string) => `/groups/${groupId}/restore`,
  delete: (groupId: string) => `/groups/${groupId}`,
};
