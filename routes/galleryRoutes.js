const express = require("express");
const router = express.Router();
const { createGalleryItem, getLatestGalleryItems, getGalleryItemById, updateGalleryItem, deleteGalleryItem } = require("../services/galleryServices");
const { uploadFile } = require("../controller/imageController");

router.get("/", async (req, res) => {
    try {
        const galleryItems = await getLatestGalleryItems();
        res.status(200).json({
            statusCode: 200,
            message: "Gallery items retrieved successfully",
            data: galleryItems
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Failed to retrieve gallery items",
            error: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const galleryItem = await getGalleryItemById(req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: "Gallery item retrieved successfully",
            data: galleryItem
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Failed to retrieve gallery item",
            error: error.message
        });
    }
}); 

router.post("/", async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                statusCode: 400,
                message: "No image file uploaded",
            });
        }

        // Upload the image to ImageKit
        const uploadedImage = await uploadFile(req.files.image);
        
        // Prepare gallery item data with uploaded image URL
        const galleryItemData = {
            ...req.body,
            image: uploadedImage
        };

        // Create gallery item with the image URLs
        const galleryItem = await createGalleryItem(galleryItemData);
        
        res.status(201).json({
            statusCode: 201,
            message: "Gallery item created successfully",
            data: galleryItem
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Failed to create gallery item",
            error: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const galleryItem = await updateGalleryItem(req.params.id, req.body);
        res.status(200).json({
            statusCode: 200,
            message: "Gallery item updated successfully",
            data: galleryItem
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Failed to update gallery item",
            error: error.message
        });
    }
}); 

router.delete("/:id", async (req, res) => {
    try {
        const galleryItem = await deleteGalleryItem(req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: "Gallery item deleted successfully",
            data: galleryItem
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Failed to delete gallery item",
            error: error.message
        });
    }
});

module.exports = router;