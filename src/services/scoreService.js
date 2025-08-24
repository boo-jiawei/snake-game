import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

const scoresRef = collection(db, "scores");

// Add new score to scoreboard
export async function addScore(name, score) {
  try {
    await addDoc(scoresRef, {
      name,
      score,
    });
  } catch (err) {
    console.error("Error adding score:", err);
  }
}

// Subscribe to top 5 scores in realtime
export function streamTopScores(callback) {
  const q = query(scoresRef, orderBy("score", "desc"), limit(5));

  return onSnapshot(q, (snapshot) => {
    const scores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(scores);
  });
}