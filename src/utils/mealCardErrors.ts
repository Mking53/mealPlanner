import { ApiError } from '@/src/api';

export function isMealCardNameConflictError(error: unknown) {
  if (!(error instanceof ApiError)) {
    return false;
  }

  const normalizedMessage = error.message.toLowerCase();

  return (
    error.status === 409 ||
    normalizedMessage.includes('already exists') ||
    normalizedMessage.includes('must be unique') ||
    normalizedMessage.includes('duplicate')
  );
}

export function getMealCardNameConflictMessage(name?: string) {
  if (name?.trim()) {
    return `${name.trim()} is already used in My Meal Cards. Please choose a different name.`;
  }

  return 'That meal card name is already used in My Meal Cards. Please choose a different name.';
}
