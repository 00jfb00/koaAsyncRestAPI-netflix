import 'babel-polyfill';
import Router from 'koa-router';
import { baseApi } from '../config';
import jwt from '../middlewares/jwt';
import ShowsControllers from '../controllers/shows';

const api = 'shows';

const router = new Router();

router.prefix(`/${baseApi}/${api}`);

router.get('/fetch/:qntReg', ShowsControllers.fetch);

router.get('/', ShowsControllers.find);

router.get('/:id', ShowsControllers.findById);

router.get('/groupedByGenre', ShowsControllers.findGroupedByGenre);

// protected
// router.post('/groupedByGenre', jwt, CitiesControllers.add);


export default router;
