import * as migration_20261024_154809_initial from './20261024_154809_initial';

export const migrations = [
  {
    up: migration_20261024_154809_initial.up,
    down: migration_20261024_154809_initial.down,
    name: '20261024_154809_initial'
  },
];
