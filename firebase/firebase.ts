import { getFirestore } from "firebase-admin/firestore";

export const getUsers = async () => {
    const firestore = getFirestore();
    const snapshot = await firestore.collection("Users").get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
    };
  });
  
};