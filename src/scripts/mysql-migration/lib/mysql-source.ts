import mysql from 'mysql2/promise';
import type { MigrationConfig } from './types';

export async function connectMysql(config: MigrationConfig) {
  const password =
    config.mysqlPassword !== undefined && config.mysqlPassword !== ''
      ? config.mysqlPassword
      : undefined;
  return mysql.createConnection({
    host: config.mysqlHost,
    port: config.mysqlPort,
    user: config.mysqlUser,
    ...(password !== undefined ? { password } : {}),
    database: config.mysqlDatabase,
    dateStrings: false,
    supportBigNumbers: true,
  });
}

export async function countMysqlRows(
  connection: mysql.Connection,
  table: string,
): Promise<number> {
  const [rows] = await connection.query<mysql.RowDataPacket[]>(
    `SELECT COUNT(*) AS cnt FROM \`${table}\``,
  );
  return Number(rows[0]?.cnt ?? 0);
}

export async function* streamMysqlRows(
  connection: mysql.Connection,
  table: string,
  pk: string,
  batchSize: number,
): AsyncGenerator<mysql.RowDataPacket[]> {
  let lastId = 0;
  for (;;) {
    const [rows] = await connection.query<mysql.RowDataPacket[]>(
      `SELECT * FROM \`${table}\` WHERE \`${pk}\` > ? ORDER BY \`${pk}\` ASC LIMIT ?`,
      [lastId, batchSize],
    );
    if (!rows.length) break;
    yield rows;
    lastId = Number(rows[rows.length - 1][pk]);
  }
}

export async function fetchAllMysqlRows(
  connection: mysql.Connection,
  table: string,
  pk: string,
): Promise<mysql.RowDataPacket[]> {
  const [rows] = await connection.query<mysql.RowDataPacket[]>(
    `SELECT * FROM \`${table}\` ORDER BY \`${pk}\` ASC`,
  );
  return rows;
}
