/**
 * Simple in-memory encryption utilities using Web Crypto API.
 * This provides an extra layer of protection for credentials in the store.
 */

let sessionKey: CryptoKey | null = null;

export const initSession = async () => {
    sessionKey = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
};

export const encrypt = async (text: string): Promise<string> => {
    if (!sessionKey) await initSession();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        sessionKey!,
        encoded
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);
    
    return btoa(String.fromCharCode(...combined));
};

export const decrypt = async (encryptedBase64: string): Promise<string> => {
    if (!sessionKey) return encryptedBase64;
    
    const combined = new Uint8Array(
        atob(encryptedBase64).split("").map(c => c.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        sessionKey,
        ciphertext
    );
    
    return new TextDecoder().decode(decrypted);
};

export const clearSession = () => {
    sessionKey = null;
};
