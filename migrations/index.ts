import * as migration_20250307_100531 from './20250307_100531';

export const migrations = [
  {
    up: migration_20250307_100531.up,
    down: migration_20250307_100531.down,
    name: '20250307_100531'
  },
];
