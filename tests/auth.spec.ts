import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../src/lib/auth";

describe("Password Hashing", () => {
  it("hashes a password successfully", async () => {
    const password = "TestPassword123";
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  it("produces different hashes for the same password", async () => {
    const password = "TestPassword123";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
  });

  it("verifies correct password", async () => {
    const password = "CorrectPassword123";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("rejects incorrect password", async () => {
    const password = "CorrectPassword123";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword("WrongPassword456", hash);
    expect(isValid).toBe(false);
  });

  it("is case-sensitive", async () => {
    const password = "CaseSensitive123";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword("casesensitive123", hash);
    expect(isValid).toBe(false);
  });

  it("handles empty password", async () => {
    const password = "";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword("", hash);
    expect(isValid).toBe(true);
  });

  it("handles special characters in password", async () => {
    const password = "P@ssw0rd!#$%&*()_+-=[]{}|;:,.<>?";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("handles very long password", async () => {
    const password = "A".repeat(200) + "123";
    const hash = await hashPassword(password);

    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });
});

describe("Password Security", () => {
  it("uses bcrypt with appropriate cost factor", async () => {
    const password = "TestPassword123";
    const hash = await hashPassword(password);

    expect(hash.startsWith("$2")).toBe(true);

    const costFactor = hash.split("$")[2];
    expect(parseInt(costFactor)).toBeGreaterThanOrEqual(10);
  });

  it("hashing takes reasonable time (bcrypt cost)", async () => {
    const password = "TestPassword123";
    const startTime = Date.now();

    await hashPassword(password);

    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(2000);
    expect(duration).toBeGreaterThan(10);
  });
});
