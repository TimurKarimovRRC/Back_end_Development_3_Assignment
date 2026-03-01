import { db } from "../../../../config/firebaseConfig";

export const runTransaction = async <T>(
  operations: (transaction: FirebaseFirestore.Transaction) => Promise<T>
): Promise<T> => {
  try {
    return await db.runTransaction(operations);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Transaction failed: ${errorMessage}`);
  }
};