import type { ApiErrorBody } from "@/types/api";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly messages: string[],
  ) {
    super(messages.join(", "));
    this.name = "ApiError";
  }
}

function isApiErrorBody(body: unknown): body is ApiErrorBody {
  return typeof body === "object" && body !== null && "message" in body;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

/** Sends a JSON request to the API and throws ApiError for any failure. */
export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    throw new ApiError(0, [
      "Cannot reach the server. Check that the API is running.",
    ]);
  }

  const body = await readJson(response);

  if (!response.ok) {
    const message = isApiErrorBody(body) ? body.message : response.statusText;
    throw new ApiError(
      response.status,
      Array.isArray(message) ? message : [message || "Request failed"],
    );
  }

  return body as T;
}
