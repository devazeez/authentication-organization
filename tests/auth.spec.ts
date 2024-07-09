const dotenv = require("dotenv").config();
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { app } from "../src/index";
const pool = require("../src/common/database/db");

const random = Math.floor(Math.random() * 1000) + 1;

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    await pool.connect();
  });

  // afterAll(async () => {
  //   await pool.end();
  // });

  it("Should register user successfully with default organization", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: `john${random}@example.com`,
        password: "Password12@@",
        phone: "09055755671",
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("accessToken");
    expect(response.body.data.user).toHaveProperty(
      "email",
      `john${random}@example.com`
    );
  });

  it("Should log the user in successfully", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: `john${random}@example.com`,
        password: "Password12@@",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeTruthy();
    expect(response.body.data.user.email).toEqual(`john${random}@example.com`);
  });

  it("Should fail if required fields are missing", async () => {
    const response = await request(app).post("/api/auth/register").send({
      firstName: "John",
      email: "john.doe@example.com",
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("errors");
  });

  it("Should fail if theres duplicate email or userId", async () => {
    const response = await request(app).post("/api/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: `john${random}@example.com`,
      password: "password123",
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("errors");
  });
});
