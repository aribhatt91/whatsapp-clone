import { storage, storageRef } from '../firebase';
import { uploadBytes } from "firebase/storage";


const getImage = (roomId, filename) => {
    const imageRef = storageRef(storage, `images/${roomId}/${filename}`);
}

const uploadImage = async (roomId, image) => {
    const folderRef = storageRef(storage, `images/${roomId}`);
}