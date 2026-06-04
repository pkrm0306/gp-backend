import { Connection, ClientSession } from 'mongoose';

function isTransactionNotSupportedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return (
    message.includes('Transaction numbers are only allowed') ||
    message.includes('replica set member or mongos') ||
    message.includes('does not support retryable writes')
  );
}

/**
 * Runs work in a Mongo transaction when the deployment supports it (replica set / Atlas).
 * Falls back to non-transactional execution on standalone local MongoDB.
 */
export async function runInTransactionIfSupported<T>(
  connection: Connection,
  work: (session?: ClientSession) => Promise<T>,
): Promise<T> {
  const session = await connection.startSession();
  try {
    session.startTransaction();
    const result = await work(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction().catch(() => undefined);
    if (isTransactionNotSupportedError(error)) {
      return work(undefined);
    }
    throw error;
  } finally {
    session.endSession();
  }
}
