import { prisma } from "@/config";


async function findHotels(){
    return prisma.hotel.findMany()
}

async function findRooms(){

}


export const hotelsRepository = {
    findHotels,
    findRooms
}