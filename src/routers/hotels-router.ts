import { getHotels, getHotelsById } from '@/controllers/hotels-controllers';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';


const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken)
hotelsRouter.get("/", getHotels)
hotelsRouter.get("/:hotelId", getHotelsById)


export { hotelsRouter };


