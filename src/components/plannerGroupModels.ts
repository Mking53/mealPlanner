export type PlannerGroup = {
  id: string;
  memberIds: string[];
  memberNamesPreview?: string[];
  name: string;
};

export type PlannerFriendOption = {
  email?: string;
  id: string;
  name: string;
};

export function getPlannerGroupButtonLabel(groups: PlannerGroup[], selectedGroupIds: string[]) {
  if (selectedGroupIds.length === 0) {
    return 'Groups Selected';
  }

  if (selectedGroupIds.length === 1) {
    return groups.find((group) => group.id === selectedGroupIds[0])?.name ?? 'Groups Selected';
  }

  return `${selectedGroupIds.length} Groups Selected`;
}
