
const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, getDocs, doc, setDoc, deleteDoc, query, orderBy, limit } = require('firebase/firestore');

// Create a new gallery item in Firestore with createdOn timestamp
const createGalleryItem = async (galleryItemData) => {
    try {
        // Fetch all documents to determine the count
        const galleryItemsSnapshot = await getDocs(collection(db, "gallery"));
        const galleryItemCount = galleryItemsSnapshot.size + 1; // Next gallery item number

        // Generate gallery item number in the format GALLERY01, GALLERY02, etc.
        const galleryItemNo = `GALLERY${galleryItemCount.toString().padStart(2, "0")}`;

        const galleryItemWithTimestamp = { 
            ...galleryItemData, 
            galleryItemNo, // Store gallery item number
            createdOn: Date.now(), 
            updatedOn: Date.now(),
            isActive: true
        };

        const docRef = await addDoc(collection(db, "gallery"), galleryItemWithTimestamp);
        
        return { id: docRef.id, ...galleryItemWithTimestamp };
    } catch (error) {
        throw new Error("Error creating gallery item: " + error.message);
    }
};

// Get all gallery items from Firestore sorted by createdOn in descending order (newest first)
const getGalleryItems = async () => {
    try {
        const galleryItemsQuery = query(collection(db, "gallery"), orderBy("createdOn", "desc"));
        const querySnapshot = await getDocs(galleryItemsQuery);
        const galleryItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return galleryItems;
    } catch (error) {
        throw new Error("Error fetching gallery items: " + error.message);
    }
};

// Get top 5 gallery items sorted by createdOn in descending order (newest first)
const getLatestGalleryItems = async () => {
    try {
        const galleryItemsQuery = query(
            collection(db, "gallery"),
            orderBy("createdOn", "desc"),
            limit(5) // Limit the results to 5
        );
        const querySnapshot = await getDocs(galleryItemsQuery);
        const galleryItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return galleryItems;
    } catch (error) {
        throw new Error("Error fetching top 5 gallery items: " + error.message);
    }
};

// Get a single gallery item by ID from Firestore
const getGalleryItemById = async (galleryItemId) => {
    try {
        const galleryItemRef = doc(db, "gallery", galleryItemId);
        const galleryItemDoc = await getDoc(galleryItemRef);

        if (!galleryItemDoc.exists()) {
            throw new Error("Gallery item not found");
        }

        return { id: galleryItemDoc.id, ...galleryItemDoc.data() };
    } catch (error) {
        throw new Error("Error fetching gallery item: " + error.message);
    }
};

// Update gallery item data in Firestore
const updateGalleryItem = async (galleryItemId, galleryItemData) => {
    try {
        const updatedData = {
            ...galleryItemData,
            updatedOn: Date.now(), // Ensure updatedOn is always set
        };
        const galleryItemRef = doc(db, "gallery", galleryItemId);
        await setDoc(galleryItemRef, updatedData, { merge: true });
        return { id: galleryItemId, ...updatedData };
    } catch (error) {
        throw new Error("Error updating gallery item: " + error.message);
    }
};


// Delete a gallery item from Firestore
const deleteGalleryItem = async (galleryItemId) => {
    try {
        const galleryItemRef = doc(db, "gallery", galleryItemId);
        await deleteDoc(galleryItemRef);
        return { message: "Gallery item deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting gallery item: " + error.message);
    }
};

module.exports = { createGalleryItem, getGalleryItems, getLatestGalleryItems, getGalleryItemById, updateGalleryItem, deleteGalleryItem };