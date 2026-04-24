import pg from "pg";

let _usersDb: pg.Pool | null = null;
let _sessionsDb: pg.Pool | null = null;

export function getUsersDb(): pg.Pool | null {
  if (!_usersDb && process.env.GHOST_USERS_DB_URL) {
    _usersDb = new pg.Pool({
      connectionString: process.env.GHOST_USERS_DB_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return _usersDb;
}

export function getSessionsDb(): pg.Pool | null {
  if (!_sessionsDb && process.env.GHOST_SESSIONS_DB_URL) {
    _sessionsDb = new pg.Pool({
      connectionString: process.env.GHOST_SESSIONS_DB_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return _sessionsDb;
}
