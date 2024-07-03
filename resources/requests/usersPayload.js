import { faker } from '@faker-js/faker';

export const createUserPayload = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    gender: faker.person.sex(),
    status: "active"
}