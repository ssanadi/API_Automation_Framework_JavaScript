import { faker } from '@faker-js/faker';

export const userPayload = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    gender: faker.person.sex(),
    status: "active"
}