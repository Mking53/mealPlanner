export type PlannerGroup = {
  id: string;
  memberIds: string[];
  memberNamesPreview?: string[];
  name: string;
};

export type PlannerFriendOption = {
  id: string;
  name: string;
};

export const MOCK_PLANNER_FRIENDS: PlannerFriendOption[] = [
  { id: 'friend-1', name: 'Ava Thompson' },
  { id: 'friend-2', name: 'Noah Martinez' },
  { id: 'friend-3', name: 'Sophia Patel' },
  { id: 'friend-4', name: 'Liam Kim' },
  { id: 'friend-5', name: 'Emma Rivera' },
  { id: 'friend-6', name: 'Mason Brooks' },
];

export const MOCK_PLANNER_GROUPS: PlannerGroup[] = [
  {
    id: 'group-1',
    name: 'Family Dinners',
    memberIds: ['friend-1', 'friend-2', 'friend-5'],
    memberNamesPreview: ['Ava', 'Noah', 'Emma'],
  },
  {
    id: 'group-2',
    name: 'Weekend Crew',
    memberIds: ['friend-3', 'friend-4'],
    memberNamesPreview: ['Sophia', 'Liam'],
  },
  {
    id: 'group-3',
    name: 'Meal Prep Team',
    memberIds: ['friend-2', 'friend-6'],
    memberNamesPreview: ['Noah', 'Mason'],
  },
];

export function getPlannerGroupButtonLabel(groups: PlannerGroup[], selectedGroupIds: string[]) {
  if (selectedGroupIds.length === 0) {
    return 'Groups Selected';
  }

  if (selectedGroupIds.length === 1) {
    return groups.find((group) => group.id === selectedGroupIds[0])?.name ?? 'Groups Selected';
  }

  return `${selectedGroupIds.length} Groups Selected`;
}
