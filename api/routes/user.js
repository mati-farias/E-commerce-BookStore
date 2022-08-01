const express = require('express');
const { Router } = require('express');
const {
	registerUser,
	userLogin,
	searchUserByUsername,
	addFavorite,
	getFavorite,
	deleteFavorite,
	searchUserById,
	getAllUsers,
	profilePicture,
	updateUser,
	googleSignIn,
} = require('../controllers/userControllers');

const router = Router();

router.post('/register', registerUser);

router.post('/login', userLogin);

router.get('/search/:username', searchUserByUsername);

router.get('/search/:id', searchUserById);

router.get('/all', getAllUsers);

router.put('/favorites', addFavorite);

router.get('/favorites/:idUser', getFavorite);

router.delete('/favorites', deleteFavorite);

//Eze y lucho: rodi e ivo avisen si lo ven. Rodri: Lo vi...no me gusto.Salu2
router.put('/image/:id', async (req, res) => {
	try {
		await profilePicture(req.params, req.body);
		res.status(200).json('actualizado');
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.put('/update', updateUser);


router.post('/google', googleSignIn)

module.exports = router;
