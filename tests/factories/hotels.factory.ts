import {faker} from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';


export async function createTicketTypeRemote(){
    return prisma.ticketType.create({
      data: {
        name: faker.name.findName(),
        price: faker.datatype.number(),
        isRemote: true,
        includesHotel: false
      }
    })
  }
  

export async function createTicketTypeWithHotel(){
    return prisma.ticketType.create({
      data: {
        name: faker.name.findName(),
        price: faker.datatype.number(),
        isRemote: false,
        includesHotel: true
      }
    })
}

export async function hotelCreat(){
    return prisma.hotel.create({
        data: {
            name: faker.name.findName(),
            image: faker.image.imageUrl(),
        }
    })
}
  