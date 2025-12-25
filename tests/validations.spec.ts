import { describe, it, expect } from "vitest";
import {
  articleSchema,
  loginSchema,
  registerSchema,
  changePasswordSchema,
  articleUpdateSchema,
} from "../src/lib/validations";

describe("Article Validation Schema", () => {
  it("validates a complete valid article", () => {
    const validArticle = {
      title: "Test Article Title",
      slug: "test-article-title",
      excerpt: "This is a short excerpt",
      content:
        "This is the main content of the article that is long enough to pass validation",
      coverImageUrl: "https://example.com/image.jpg",
      pdfUrl: "https://example.com/file.pdf",
      type: "inspiration",
      status: "draft",
      countryId: "123e4567-e89b-12d3-a456-426614174000",
      readingTime: 5,
    };

    const result = articleSchema.safeParse(validArticle);
    expect(result.success).toBe(true);
  });

  it("rejects article with too short title", () => {
    const article = {
      title: "Test",
      slug: "test",
      content: "This is the main content of the article that is long enough",
      type: "inspiration",
      status: "draft",
    };

    const result = articleSchema.safeParse(article);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("5 caractères");
    }
  });

  it("rejects article with invalid slug format", () => {
    const article = {
      title: "Test Article",
      slug: "Test Article!",
      content: "This is the main content of the article that is long enough",
      type: "inspiration",
      status: "draft",
    };

    const result = articleSchema.safeParse(article);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("slug");
    }
  });

  it("rejects article with too short content", () => {
    const article = {
      title: "Test Article",
      slug: "test-article",
      content: "Too short",
      type: "inspiration",
      status: "draft",
    };

    const result = articleSchema.safeParse(article);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("50 caractères");
    }
  });

  it("accepts empty coverImageUrl", () => {
    const article = {
      title: "Test Article",
      slug: "test-article",
      content: "This is the main content of the article that is long enough",
      coverImageUrl: "",
      type: "inspiration",
      status: "draft",
    };

    const result = articleSchema.safeParse(article);
    expect(result.success).toBe(true);
  });

  it("validates article type enum", () => {
    const validTypes = ["inspiration", "carnet", "ressource"];

    validTypes.forEach((type) => {
      const article = {
        title: "Test Article",
        slug: "test-article",
        content: "This is the main content of the article that is long enough",
        type,
        status: "draft",
      };

      const result = articleSchema.safeParse(article);
      expect(result.success).toBe(true);
    });
  });

  it("rejects invalid article type", () => {
    const article = {
      title: "Test Article",
      slug: "test-article",
      content: "This is the main content of the article that is long enough",
      type: "invalid-type",
      status: "draft",
    };

    const result = articleSchema.safeParse(article);
    expect(result.success).toBe(false);
  });

  it("validates reading time range", () => {
    const validArticle = {
      title: "Test Article",
      slug: "test-article",
      content: "This is the main content of the article that is long enough",
      type: "inspiration",
      status: "draft",
      readingTime: 30,
    };

    expect(articleSchema.safeParse(validArticle).success).toBe(true);

    const invalidArticle = {
      ...validArticle,
      readingTime: 61,
    };

    expect(articleSchema.safeParse(invalidArticle).success).toBe(false);
  });
});

describe("Login Validation Schema", () => {
  it("validates a valid login", () => {
    const validLogin = {
      email: "user@example.com",
      password: "password123",
    };

    const result = loginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const login = {
      email: "not-an-email",
      password: "password123",
    };

    const result = loginSchema.safeParse(login);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("email");
    }
  });

  it("rejects password shorter than 8 characters", () => {
    const login = {
      email: "user@example.com",
      password: "short",
    };

    const result = loginSchema.safeParse(login);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("8 caractères");
    }
  });
});

describe("Register Validation Schema", () => {
  it("validates a complete valid registration", () => {
    const validRegister = {
      email: "newuser@example.com",
      password: "Password123",
      confirmPassword: "Password123",
      firstName: "John",
      lastName: "Doe",
    };

    const result = registerSchema.safeParse(validRegister);
    expect(result.success).toBe(true);
  });

  it("rejects password without uppercase", () => {
    const register = {
      email: "user@example.com",
      password: "password123",
      confirmPassword: "password123",
      firstName: "John",
      lastName: "Doe",
    };

    const result = registerSchema.safeParse(register);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("majuscule");
    }
  });

  it("rejects password without lowercase", () => {
    const register = {
      email: "user@example.com",
      password: "PASSWORD123",
      confirmPassword: "PASSWORD123",
      firstName: "John",
      lastName: "Doe",
    };

    const result = registerSchema.safeParse(register);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("minuscule");
    }
  });

  it("rejects password without number", () => {
    const register = {
      email: "user@example.com",
      password: "PasswordABC",
      confirmPassword: "PasswordABC",
      firstName: "John",
      lastName: "Doe",
    };

    const result = registerSchema.safeParse(register);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("chiffre");
    }
  });

  it("rejects mismatched passwords", () => {
    const register = {
      email: "user@example.com",
      password: "Password123",
      confirmPassword: "Different123",
      firstName: "John",
      lastName: "Doe",
    };

    const result = registerSchema.safeParse(register);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("ne correspondent pas");
    }
  });

  it("rejects too short first name", () => {
    const register = {
      email: "user@example.com",
      password: "Password123",
      confirmPassword: "Password123",
      firstName: "J",
      lastName: "Doe",
    };

    const result = registerSchema.safeParse(register);
    expect(result.success).toBe(false);
  });
});

describe("Change Password Validation Schema", () => {
  it("validates a valid password change", () => {
    const validChange = {
      currentPassword: "OldPassword123",
      newPassword: "NewPassword456",
      confirmNewPassword: "NewPassword456",
    };

    const result = changePasswordSchema.safeParse(validChange);
    expect(result.success).toBe(true);
  });

  it("rejects when new passwords do not match", () => {
    const change = {
      currentPassword: "OldPassword123",
      newPassword: "NewPassword456",
      confirmNewPassword: "DifferentPassword789",
    };

    const result = changePasswordSchema.safeParse(change);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("ne correspondent pas");
    }
  });

  it("rejects when new password is same as current", () => {
    const change = {
      currentPassword: "SamePassword123",
      newPassword: "SamePassword123",
      confirmNewPassword: "SamePassword123",
    };

    const result = changePasswordSchema.safeParse(change);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("différent");
    }
  });

  it("enforces strong password requirements for new password", () => {
    const weakPasswords = [
      "short",
      "nouppercase123",
      "NOLOWERCASE123",
      "NoNumbers",
    ];

    weakPasswords.forEach((password) => {
      const change = {
        currentPassword: "OldPassword123",
        newPassword: password,
        confirmNewPassword: password,
      };

      const result = changePasswordSchema.safeParse(change);
      expect(result.success).toBe(false);
    });
  });
});

describe("Article Update Schema", () => {
  it("allows partial updates", () => {
    const partialUpdate = {
      title: "Updated Title",
    };

    const result = articleUpdateSchema.safeParse(partialUpdate);
    expect(result.success).toBe(true);
  });

  it("validates updated fields correctly", () => {
    const partialUpdate = {
      title: "Up",
    };

    const result = articleUpdateSchema.safeParse(partialUpdate);
    expect(result.success).toBe(false);
  });

  it("allows updating multiple fields", () => {
    const partialUpdate = {
      title: "Updated Title",
      status: "published",
      readingTime: 10,
    };

    const result = articleUpdateSchema.safeParse(partialUpdate);
    expect(result.success).toBe(true);
  });
});
