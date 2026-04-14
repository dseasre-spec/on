import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../config/firebase";

// جلب المقالات مع تحديث فوري
export const subscribeToArticles = (callback) => {
  const q = query(collection(db, "articles"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(articles);
  });

  return unsubscribe;
};
