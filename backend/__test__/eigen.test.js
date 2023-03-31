const request = require("supertest");
const { app } = require("../index");
const { Member, Book } = require("../models");

beforeAll(async () => {
  try {
    const bookData = require("../data/book.json");
    await Book.bulkCreate(bookData);
    const memberData = require("../data/member.json");
    await Member.bulkCreate(memberData);
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  await Member.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await Book.destroy({ truncate: true, cascade: true, restartIdentity: true });
});

describe("borrow book", () => {
  describe("POST /borrow", () => {
    test("should return status code 400 - should user is not registered", async () => {
      const response = await request(app).post("/borrow").send({
        memberName: "",
        title: "The Lion, the witch and the Wardrobe",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "please input member name"
      );
    });
    test("should return status code 400 - should user is not registered", async () => {
      const response = await request(app).post("/borrow").send({
        memberName: "angga",
        title: "",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "please input title book"
      );
    });
    test("should return status code 400 - should user is not registered", async () => {
      const response = await request(app).post("/borrow").send({
        memberName: "aaaa",
        title: "The Lion, the witch and the Wardrobe",
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "member not found");
    });
    test("should return status code 201 - should member borrow book", async () => {
      const response = await request(app).post("/borrow").send({
        memberName: "angga",
        title: "The Lion, the witch and the Wardrobe",
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "book succesfully borrow"
      );
    });
  });
});

describe("return book", () => {
  describe("POST /return", () => {
    test("should return status code 400 - should user is not registered", async () => {
      const response = await request(app).post("/return").send({
        memberName: "",
        title: "The Lion, the witch and the Wardrobe",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "please input member name"
      );
    });
    test("should return status code 400 - should user is not registered", async () => {
      const response = await request(app).post("/return").send({
        memberName: "angga",
        title: "",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "please input title book"
      );
    });
    test("should return status code 400 - should user is not registered", async () => {
      const response = await request(app).post("/return").send({
        memberName: "angga",
        title: "Taaaa",
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "book not found");
    });
    test("should return status code 201 - should member borrow book", async () => {
      const response = await request(app).post("/return").send({
        memberName: "angga",
        title: "The Hobbit, or There and Back Again",
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "this is not the book you borrow"
      );
    });
    test("should return status code 201 - should member borrow book", async () => {
      const response = await request(app).post("/return").send({
        memberName: "angga",
        title: "The Lion, the witch and the Wardrobe",
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "book succesfully return"
      );
    });
  });
});

describe("get all book available", () => {
  describe("GET /all/book", () => {
    test("should return status code 400 - should user is not registered", async () => {
      const response = await request(app).get("/all/book");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", expect.any(Object));
    });

    test("should return status code 400 - should user is not registered", async () => {
      await Book.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });

      const response = await request(app).get("/all/book");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "no book available");
    });
  });
});

describe("get all book available", () => {
  describe("GET /all/book", () => {
    test("should return status code 400 - should user is not registered", async () => {
      const response = await request(app).get("/all/member");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data", expect.any(Object));
    });
  });
});
