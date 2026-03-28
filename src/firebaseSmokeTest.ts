import { db } from "../config/firebaseConfig";

async function run(): Promise<void> {
  const docRef = db.collection("smokeTest").doc("ping");
  await docRef.set({ ok: true, time: new Date().toISOString() });
  const snapshot = await docRef.get();
  console.log("Firestore OK:", snapshot.exists, snapshot.data());
}

run().catch((error) => {
  console.error("Firestore FAIL:", error);
});