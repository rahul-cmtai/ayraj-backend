const express = require('express');
const {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
} = require('../services/contactServices');

const router = express.Router();
// Create a new contact
router.post('/', async (req, res) => {
    try {
        const contactData = req.body;
        const newContact = await createContact(contactData);
        console.log('Contact created successfully');
        res.status(201).json({
            success: true,
            data: newContact,
            message: 'Contact created successfully'
        });
    } catch (error) {
        console.log('Error creating contact:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error creating contact'
        });
    }
});

// Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await getContacts();
        console.log('Contacts fetched successfully');
        res.status(200).json({
            success: true,
            data: contacts,
            message: 'Contacts fetched successfully'
        });
    } catch (error) {
        console.log('Error fetching contacts:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error fetching contacts'
        });
    }
});

// Get a single contact by ID
router.get('/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await getContactById(contactId);
        if (!contact) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found',
                message: 'Contact not found'
            });
        }
        console.log('Contact fetched successfully');
        res.status(200).json({
            success: true,
            data: contact,
            message: 'Contact fetched successfully'
        });
    } catch (error) {
        console.log('Error fetching contact:', error.message);
        if (error.message === 'Contact not found') {
            return res.status(404).json({
                success: false,
                error: error.message,
                message: 'Contact not found'
            });
        }
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error fetching contact'
        });
    }
});

// Update contact data
router.put('/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const contactData = req.body;
        const updatedContact = await updateContact(contactId, contactData);
        console.log('Contact updated successfully');
        res.status(200).json({
            success: true,
            data: updatedContact,
            message: 'Contact updated successfully'
        });
    } catch (error) {
        console.log('Error updating contact:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error updating contact'
        });
    }
});

// Delete a contact
router.delete('/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const deletedContact = await deleteContact(contactId);
        console.log('Contact deleted successfully');
        res.status(200).json({
            success: true,
            data: deletedContact,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.log('Error deleting contact:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error deleting contact'
        });
    }
});

module.exports = router;