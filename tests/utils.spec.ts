import { describe, it, expect } from "vitest";

describe("String Utilities", () => {
  it("creates valid slug from title", () => {
    const createSlug = (title: string) => {
      return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    expect(createSlug("Hello World")).toBe("hello-world");
    expect(createSlug("Article Été 2024")).toBe("article-ete-2024");
    expect(createSlug("Test  Multiple   Spaces")).toBe("test-multiple-spaces");
    expect(createSlug("Special!@#$Characters")).toBe("special-characters");
  });

  it("sanitizes filename correctly", () => {
    const sanitizeFilename = (filename: string) => {
      return filename
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 50);
    };

    expect(sanitizeFilename("document.pdf")).toBe("document.pdf");
    expect(sanitizeFilename("été 2024.pdf")).toBe("ete-2024.pdf");
    expect(sanitizeFilename("../../../etc/passwd")).toBe("etc-passwd");
    expect(sanitizeFilename("a".repeat(100) + ".pdf")).toHaveLength(50);
  });

  it("truncates text with ellipsis", () => {
    const truncate = (text: string, maxLength: number) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength - 3) + "...";
    };

    expect(truncate("Short text", 20)).toBe("Short text");
    expect(truncate("This is a very long text that needs truncation", 20)).toBe(
      "This is a very lo...",
    );
    expect(truncate("Exactly 20 chars txt", 20)).toBe("Exactly 20 chars txt");
  });
});

describe("Date Utilities", () => {
  it("formats date to French locale", () => {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    };

    const testDate = new Date("2024-12-25");
    const formatted = formatDate(testDate);

    expect(formatted).toContain("décembre");
    expect(formatted).toContain("2024");
  });

  it("calculates reading time from word count", () => {
    const calculateReadingTime = (content: string, wordsPerMinute = 200) => {
      const wordCount = content.trim().split(/\s+/).length;
      return Math.ceil(wordCount / wordsPerMinute);
    };

    const shortText = "This is a short text with few words.";
    expect(calculateReadingTime(shortText)).toBe(1);

    const longText = "word ".repeat(500);
    expect(calculateReadingTime(longText)).toBe(3);

    const emptyText = "";
    expect(calculateReadingTime(emptyText)).toBe(1);
  });
});

describe("Validation Utilities", () => {
  it("validates email format", () => {
    const isValidEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("test.user@domain.co.uk")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user@domain")).toBe(false);
  });

  it("validates UUID format", () => {
    const isValidUUID = (uuid: string) => {
      const regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return regex.test(uuid);
    };

    expect(isValidUUID("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    expect(isValidUUID("invalid-uuid")).toBe(false);
    expect(isValidUUID("123e4567-e89b-12d3-a456-42661417400")).toBe(false);
  });

  it("validates URL format", () => {
    const isValidURL = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    expect(isValidURL("https://example.com")).toBe(true);
    expect(isValidURL("http://localhost:3000")).toBe(true);
    expect(isValidURL("ftp://files.example.com")).toBe(true);
    expect(isValidURL("not-a-url")).toBe(false);
    expect(isValidURL("//example.com")).toBe(false);
  });
});

describe("Array Utilities", () => {
  it("removes duplicates from array", () => {
    const removeDuplicates = <T>(arr: T[]) => {
      return [...new Set(arr)];
    };

    expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    expect(removeDuplicates(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
    expect(removeDuplicates([])).toEqual([]);
  });

  it("chunks array into smaller arrays", () => {
    const chunk = <T>(arr: T[], size: number) => {
      const chunks: T[][] = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };

    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk(["a", "b", "c"], 1)).toEqual([["a"], ["b"], ["c"]]);
    expect(chunk([], 3)).toEqual([]);
  });
});

describe("Object Utilities", () => {
  it("removes null and undefined values from object", () => {
    const removeNullish = (obj: Record<string, unknown>) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value != null),
      );
    };

    expect(removeNullish({ a: 1, b: null, c: undefined, d: "test" })).toEqual({
      a: 1,
      d: "test",
    });

    expect(removeNullish({ a: 0, b: "", c: false })).toEqual({
      a: 0,
      b: "",
      c: false,
    });
  });

  it("deeply clones an object", () => {
    const deepClone = <T>(obj: T): T => {
      return JSON.parse(JSON.stringify(obj));
    };

    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
  });
});
