import { Router } from 'express';
import {
  getContacts, adminGetContacts, createContact, updateContact, deleteContact,
} from '../controllers/contactController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getContacts);
router.get('/admin/list', authenticate, adminGetContacts);
router.post('/admin/create', authenticate, createContact);
router.put('/admin/:id', authenticate, updateContact);
router.delete('/admin/:id', authenticate, deleteContact);

export default router;
