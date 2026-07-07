import { runInTransactionIfSupported } from './mongo-session.util';

describe('runInTransactionIfSupported', () => {
  it('aborts the transaction when work fails', async () => {
    const abortTransaction = jest.fn().mockResolvedValue(undefined);
    const commitTransaction = jest.fn().mockResolvedValue(undefined);
    const endSession = jest.fn().mockResolvedValue(undefined);
    const startTransaction = jest.fn();

    const connection = {
      startSession: jest.fn().mockResolvedValue({
        startTransaction,
        commitTransaction,
        abortTransaction,
        endSession,
      }),
    };

    await expect(
      runInTransactionIfSupported(connection as never, async () => {
        throw new Error('transaction failed');
      }),
    ).rejects.toThrow('transaction failed');

    expect(startTransaction).toHaveBeenCalled();
    expect(abortTransaction).toHaveBeenCalled();
    expect(commitTransaction).not.toHaveBeenCalled();
    expect(endSession).toHaveBeenCalled();
  });

  it('commits the transaction when work succeeds', async () => {
    const abortTransaction = jest.fn().mockResolvedValue(undefined);
    const commitTransaction = jest.fn().mockResolvedValue(undefined);
    const endSession = jest.fn().mockResolvedValue(undefined);
    const startTransaction = jest.fn();

    const connection = {
      startSession: jest.fn().mockResolvedValue({
        startTransaction,
        commitTransaction,
        abortTransaction,
        endSession,
      }),
    };

    const result = await runInTransactionIfSupported(
      connection as never,
      async (session) => {
        expect(session).toBeDefined();
        return 'ok';
      },
    );

    expect(result).toBe('ok');
    expect(commitTransaction).toHaveBeenCalled();
    expect(abortTransaction).not.toHaveBeenCalled();
    expect(endSession).toHaveBeenCalled();
  });
});
