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

export const getDocuments = async (
  collectionName: string
): Promise<FirebaseFirestore.QuerySnapshot> => {
  try {
    return await db.collection(collectionName).get();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch documents from ${collectionName}: ${errorMessage}`);
  }
};

export const getDocumentById = async (
  collectionName: string,
  id: string
): Promise<FirebaseFirestore.DocumentSnapshot | null> => {
  try {
    const documentSnapshot: FirebaseFirestore.DocumentSnapshot = await db
      .collection(collectionName)
      .doc(id)
      .get();

    return documentSnapshot.exists ? documentSnapshot : null;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch document ${id} from ${collectionName}: ${errorMessage}`);
  }
};


export const updateDocument = async <T>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  try {
    await db.collection(collectionName).doc(id).update(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to update document ${id} in ${collectionName}: ${errorMessage}`);
  }
};