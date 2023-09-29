import { notFoundError } from "@/errors"
import { paymentRequired } from "@/errors/paymentRequired-error"
import { enrollmentRepository, ticketsRepository } from "@/repositories"
import { hotelsRepository } from "@/repositories/hotels-repository"
import { PAYMENT_REQUIRED } from "http-status"

async function getListHotels(userId: number){

    const enrollments = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!enrollments) {throw notFoundError()}

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollments.userId)
    if (ticket.TicketType.isRemote || ticket.status === 'RESERVED' || !ticket.TicketType.includesHotel) {
        throw PAYMENT_REQUIRED}

        
    const hotels = await hotelsRepository.findHotels()
    return hotels
}

async function getListRooms(){

}

export const hotelService ={
    getListHotels,
    getListRooms
}