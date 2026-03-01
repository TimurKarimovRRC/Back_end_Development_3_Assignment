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

export const createDocument = async <T>(
  collectionName: string,
  data: Partial<T>,
  id?: string
): Promise<string> => {
  try {
    let documentReference: FirebaseFirestore.DocumentReference;

    if (id) {
      documentReference = db.collection(collectionName).doc(id);
      await documentReference.set(data);
    } else {
      documentReference = await db.collection(collectionName).add(data);
    }

    return documentReference.id;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to create document in ${collectionName}: ${errorMessage}`);
  }
};