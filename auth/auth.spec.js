const supertest = require("supertest")
const server = require("../api/server")
const db = require("../database/dbConfig.js")

let token
describe("auth & jokes", () => {
  describe("/register", () => {
    it("should return 201 when user is succefully created", async () => {
      await db("users").truncate()
      return supertest(server)
        .post("/api/auth/register")
        .send({ username: "sam", password: "pass" })
        .then(res => {
          expect(res.status).toBe(201)
        })
    })
    it('should return 500 if user is already created', () => {
      return supertest(server)
      .post("/api/auth/register")
      .send({ username: "sam", password: "pass" })
      .then(res => {
        expect(res.status).toBe(500)
      })
    })
  })
  describe('/login', () => {
    it('should return 200 upon succefful login', () => {
      return supertest(server)
      .post("/api/auth/login")
      .send({ username: "sam", password: "pass" })
      .then(res => {
        expect(res.status).toBe(200)
      })
    })
    it('should return 500 upon unsuccessful login', () => {
      return supertest(server)
      .post("/api/auth/login")
      .send({ username: "sam", password: "pass" })
      .then(res => {
        token = res.body.token
        expect(res.status).toBe(200)
      })
    })
  })
  describe('/jokes', () => {
    it('should return 200 upon after succeful get, post login', () => {
      return supertest(server)
      .get("/api/jokes")
      .set("Authorization", token)
      .then(res => {
        expect(res.status).toBe(200)
      })
    })
    it('should return 401 if unauthorized', () => {
      return supertest(server)
      .get("/api/jokes")
      .then(res => {
        expect(res.status).toBe(401)
      })
    })
  })
})