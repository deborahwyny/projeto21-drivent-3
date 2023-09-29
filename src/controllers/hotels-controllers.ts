import { AuthenticatedRequest } from '@/middlewares';
import { hotelService } from '@/services/hotels-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';


export async function getHotels(req:AuthenticatedRequest, res:Response){
    const  userId = req.userId;
try{
    const listHotels  = await hotelService.getListHotels(userId)
    return res.send(listHotels)

}catch(error){
    return res.sendStatus(httpStatus.NOT_FOUND)
}

}

export async function getHotelsById(req:AuthenticatedRequest, res:Response){

try{

    const listRooms = await hotelService.getListRooms()
    return res.send(listRooms)

}catch(error){

    return res.sendStatus(httpStatus.NOT_FOUND)
}
}