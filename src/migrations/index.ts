import * as migration_20261024_154809_initial from './20261024_154809_initial';
import * as migration_20261024_180000_blob_object_key from './20261024_180000_blob_object_key';

export const migrations = [
  {
    up: migration_20261024_154809_initial.up,
    down: migration_20261024_154809_initial.down,
    name: '20261024_154809_initial'
  },
  {
    up: migration_20261024_180000_blob_object_key.up,
    down: migration_20261024_180000_blob_object_key.down,
    name: '20261024_180000_blob_object_key'
  },
];
