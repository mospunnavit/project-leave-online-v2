import { getFirestore } from "firebase/firestore";

export const getUsers = async () => {
    const db = getFirestore();
    const user = collection(db, 'Users');
    const querySnapshot = await getDocs(user);
    return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            email: data.email,
        }
    })

}