import UserController from './controller';

const router = require('express').Router();

// Profile route GET
router.get('/profile', (req, res) => {
    res.send(req.user);
})

// Profile route POST
router.post('/profile', UserController.updateProfile)

export default router;