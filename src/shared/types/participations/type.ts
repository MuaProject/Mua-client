import type { paths } from '@shared/types/schema';

export type GetParticipantsResponse =
  paths['/api/feeds/{feedId}/participations']['get']['responses']['200']['content']['*/*'];
