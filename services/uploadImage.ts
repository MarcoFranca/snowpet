import { ref, uploadBytes, getDownloadURL, deleteObject, getStorage } from 'firebase/storage';
import { FIREBASE_STORAGE } from '@/firebaseConfig';

// Helper: converte uma URI local em Blob (compatível com Storage)
export async function uriToBlob(uri: string): Promise<Blob> {
    return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
}

export async function uploadPetImage(uri: string, userId: string, petId: string) {
    const path = `${userId}/pets/${petId}-${Date.now()}.jpg`;
    const blob = await uriToBlob(uri);
    const fileRef = ref(FIREBASE_STORAGE, path);
    await uploadBytes(fileRef, blob);
    // Não tente usar blob.close() (não existe, pode ignorar)
    return getDownloadURL(fileRef);
}

export async function deletePetImage(photoURL: string) {
    if (!photoURL) return; // nada para deletar
    try {
        // Acha o caminho do arquivo a partir da URL pública
        // Exemplo: https://firebasestorage.googleapis.com/v0/b/seu-bucket/o/pets%2FuserId%2FpetId.jpg?...
        // O caminho é o trecho entre '/o/' e o '?'
        const url = decodeURIComponent(photoURL);
        const matches = url.match(/\/o\/(.*?)\?/);
        if (!matches || !matches[1]) return;
        const filePath = matches[1]; // ex: 'pets/userId/petId.jpg'

        const storage = getStorage();
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
    } catch (e) {
        // Não impede de deletar o doc, só loga o erro
        console.warn('Erro ao deletar imagem do Storage:', e);
    }
}