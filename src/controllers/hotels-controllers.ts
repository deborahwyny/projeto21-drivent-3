import { AuthenticatedRequest } from '@/middlewares';
import { hotelService } from '@/services/hotels-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';


export async function getHotels(req:AuthenticatedRequest, res:Response){
    const  userId = req.userId;
    const listHotels  = await hotelService.getListHotels(userId)
    return res.status(httpStatus.OK).send(listHotels)


}

export async function getHotelsById(req:AuthenticatedRequest, res:Response){
    const  userId = req.userId;
    const hotelId = Number(req.params.hotelId)

    const listRooms = await hotelService.getListRooms(userId, hotelId)
    return res.status(httpStatus.OK).send(listRooms)


}