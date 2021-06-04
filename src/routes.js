import { Router } from 'express';

import DoctorController from './app/controllers/DoctorController';

const routes = new Router();

routes.get('/doctors', DoctorController.index);
routes.get('/doctors/:id', DoctorController.show);
routes.post('/doctors', DoctorController.insert);
routes.put('/doctors', DoctorController.update);
routes.delete('/doctors/:id', DoctorController.delete);


export default routes;
