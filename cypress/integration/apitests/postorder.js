/// <reference types ="Cypress" />
const dataJson = require('../../fixtures/createorder')
describe('Place an order for a pet', () => {
    let randomNumber
    it('Create pet order', () => {
        randomNumber = Math.floor(Math.random() * 9) + 1
        cy.log(randomNumber)
        // 1. Create order (POST request)
        cy.request({
            method: 'POST',
            url: Cypress.env('url'),
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "id": randomNumber,
                "petId": dataJson.petId,
                "quantity": dataJson.quantity,
                "shipDate": dataJson.shipDate,
                "status": dataJson.status,
                "complete": dataJson.complete
            }
        }).then((res) => { // strore response inside res 
            cy.log(JSON.stringify(res))
            expect(res.status).to.eq(200)
            expect(res.body).has.property('status', dataJson.status)
            expect(res.body).has.property('complete', dataJson.complete)
        }).then((res) => {
            const orderId = res.body.id
            cy.log('Order id is: ' + orderId)
            // 2. Get order (GET request)
            cy.request({
                method: 'GET',
                url: Cypress.env('url') + orderId
            }).then((res) => {
                expect(res.status).to.eq(200)
                expect(res.body).has.property('id', orderId)
                expect(res.body).has.property('status', dataJson.status)
            })
        }).then((res) => {
            const orderId = res.body.id
            cy.log('Order id is: ' + orderId)
            // 3. Delete order (DELETE request)
            cy.request({
                method: 'DELETE',
                url: Cypress.env('url') + orderId
            }).then((res) => {
                expect(res.status).to.eq(200)
            })
        })
    })
})
