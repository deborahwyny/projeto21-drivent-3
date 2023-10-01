import app, { init } from "@/app"
import supertest from "supertest"
import httpStatus from "http-status";
import { cleanDb, generateValidToken } from "../helpers";
import {faker} from "@faker-js/faker";
import { createEnrollmentWithAddress, createUser , createTicket} from "../factories";

import * as jwt from "jsonwebtoken"
import { TicketStatus, prisma } from "@prisma/client";
import { creatRoom, createTicketTypeRemote, createTicketTypeWithHotel, hotelCreat } from "../factories/hotels.factory";


const server = supertest(app)

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });

describe("GET /hotels", () =>{

/// erros

it("Se receber token inválido, deve retornar 401 (Unauthorized)", async()=>{
    const retornar = await server.get('/hotels');
    expect(retornar.status).toBe(httpStatus.UNAUTHORIZED);

})
it("Se receber token sem associação, deve retornar 401 (Unauthorized)", async()=>{
   const token = faker.lorem.word()
   const retornar = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
   expect(retornar.status).toBe(httpStatus.UNAUTHORIZED);

})
it("Se não receber token, deve retornar 401 (Unauthorized)", async()=>{
    const usuarioSemSessao = await createUser();
    const token = jwt.sign({ userId: usuarioSemSessao.id }, process.env.JWT_SECRET);
    const retornar = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(retornar.status).toBe(httpStatus.UNAUTHORIZED);
})
///////////////////////

it("Se o ingresso for remoto, deve retornar com 402", async()=>{

    const usuario = await createUser()
    const token = await generateValidToken(usuario)
    const enrollment = await createEnrollmentWithAddress(usuario)
    const ticketType = await createTicketTypeRemote()
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const retornar = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
      expect(retornar.status).toBe(httpStatus.PAYMENT_REQUIRED)


})

it("Se o usuario não possuir enrollment, deve retornar 404", async()=>{
    const usuario = await createUser()
    const token = await generateValidToken(usuario)
    const ticketType = await createTicketTypeRemote()
    const retornar = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(retornar.status).toBe(httpStatus.NOT_FOUND)
    
})

it("sucesso status 200", async()=>{
    const usuario = await createUser()
    const token = await generateValidToken(usuario)
    const enrollment = await createEnrollmentWithAddress(usuario)
    const ticketType = await createTicketTypeWithHotel()
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
    const hotels = await hotelCreat()
    const {status, body} = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(status).toBe(httpStatus.OK)
    expect(body).toEqual([{
        id: hotels.id,
        name: hotels.name,
        image: hotels.image,
        createdAt: hotels.createdAt.toISOString(),
        updatedAt: hotels.updatedAt.toISOString(),
    }])


})

})


describe("GET /hotels/:hotelId", () =>{
    it("Se receber token inválido, deve retornar 401 (Unauthorized)", async()=>{
        const retornar = await server.get('/hotels/1');
        expect(retornar.status).toBe(httpStatus.UNAUTHORIZED);
    
    })
    it("Se receber token sem associação, deve retornar 401 (Unauthorized)", async()=>{
       const token = faker.lorem.word()
       const retornar = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
       expect(retornar.status).toBe(httpStatus.UNAUTHORIZED);
    
    })
    it("Se não receber token, deve retornar 401 (Unauthorized)", async()=>{
        const usuarioSemSessao = await createUser();
        const token = jwt.sign({ userId: usuarioSemSessao.id }, process.env.JWT_SECRET);
        const retornar = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(retornar.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it("Se o ingresso for remoto, deve retornar com 402", async()=>{
        const usuario = await createUser()
        const token = await generateValidToken(usuario)
        const enrollment = await createEnrollmentWithAddress(usuario)
        const ticketType = await createTicketTypeRemote()
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
        const retornar = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
          expect(retornar.status).toBe(httpStatus.PAYMENT_REQUIRED)
    
    
    })
    })
    it("Se o usuario não possuir enrollment, deve retornar 404", async()=>{
        const usuario = await createUser()
        const token = await generateValidToken(usuario)
        const ticketType = await createTicketTypeRemote()
        const retornar = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
        expect(retornar.status).toBe(httpStatus.NOT_FOUND)
    })
    it("Se não encontrar o hotel, deve retornar o erro 404", async()=>{
        const usuario= await createUser()
      const token = await generateValidToken(usuario)
      const enrollment = await createEnrollmentWithAddress(usuario)
      const ticketType = await createTicketTypeWithHotel()
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
      const retorno = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
      expect(retorno.status).toEqual(httpStatus.NOT_FOUND);
    })
    it("Retonar hotel com os quartos e status 200", async()=>{
        const usuario = await createUser()
        const token = await generateValidToken(usuario)
        const enrollment = await createEnrollmentWithAddress(usuario)
        const ticketTipo = await createTicketTypeWithHotel()
        const ticket = await createTicket(enrollment.id, ticketTipo.id, TicketStatus.PAID)
        const hotel = await hotelCreat()
        const rooms = await creatRoom(hotel.id)

        const {status, body} = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
        expect(status).toBe(httpStatus.OK)
        expect(body).toEqual({
            id: hotel.id,
            name: hotel.id,
            image: hotel.name,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
        rooms: [{

            id: rooms.id,
            name:rooms.name,
            capacity: rooms.capacity,
            hotelId: hotel.id,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),


        }]    
      })
    })
