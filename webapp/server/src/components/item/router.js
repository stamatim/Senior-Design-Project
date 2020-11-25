import ItemController from './controller';

const router = require('express').Router();

// Item route GET
router.get('/item', (req, res) => {
    res.send(req.item)
})

// Item route POST
router.post('/item', ItemController.updateItem);

// Item route DELETE
router.delete('/item', ItemController.removeItem);

export default router;