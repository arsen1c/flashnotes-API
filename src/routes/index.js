import express from 'express';
const router = express.Router();

// import controllers
import {
  registerController,
  loginController,
  userController,
  notesController,
} from '../controllers';
import auth from '../middlewares/auth';

router.get('/', (req, res) => {
  res.send({
    status: 'Success',
    message: 'Hello World!',
    version: '1.0.0',
  });
});
router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.post('/notes', auth, notesController.add);
router.get('/me', auth, userController.me);
router.get('/notes', auth, notesController.listAllNotes);
router.put('/notes/:id', auth, notesController.update);
router.delete('/notes/:id', auth, notesController.delete);
router.get('/generateLink/:id', auth, notesController.generateLink);
router.get('/:username/:link', notesController.getNote);

// Development
router.get('/all', notesController.all);
export default router;
