import app, { init } from "@/app"
import supertest from "supertest"
import httpStatus from "http-status";
import { cleanDb, generateValidToken } from "../helpers";
import {faker} from "@faker-js/faker";
import { createEnrollmentWithAddress, createUser , createTicket} from "../factories";

import * as jwt from "jsonwebtoken"
import { TicketStatus, prisma } from "@prisma/client";
import { createTicketTypeRemote, createTicketTypeWithHotel, hotelCreat } from "../factories/hotels.factory";


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
        Image: hotels.image,
        createdAt: hotels.createdAt.toISOString(),
        updatedAt: hotels.updatedAt.toISOString(),
    }])


})

})


describe("GET /hotels/:hotelId", () =>{
    
})