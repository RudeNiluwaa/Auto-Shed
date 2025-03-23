import express from 'express';
import Presentation from '../models/Presentation.js';

const router = express.Router();

// Create a new presentation request
router.post('/create', async (req, res) => {
  try {
    const newPresentation = new Presentation(req.body);
    await newPresentation.save();
    res.status(201).json({ message: 'Presentation request created', newPresentation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read all scheduled presentations
router.get('/all', async (req, res) => {
  try {
    const presentations = await Presentation.find();
    res.status(200).json(presentations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get a single presentation by ID
router.get('/:id', async (req, res) => {
    try {
      const presentation = await Presentation.findById(req.params.id);
      if (!presentation) {
        return res.status(404).json({ message: 'Presentation not found' });
      }
      res.status(200).json(presentation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
// Update a presentation request
router.put('/update/:id', async (req, res) => {
  try {
    const updatedPresentation = await Presentation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Presentation updated', updatedPresentation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a presentation request
router.delete('/delete/:id', async (req, res) => {
  try {
    await Presentation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Presentation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
