import type { Context } from "elysia";
import { UnauthorizedException } from "../helper/exception.helper";

export const protect = async (c: Context) => {
  const authHeader = c.request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer"))
    throw new UnauthorizedException();

  const [, token] = authHeader.split(" ");
  if (!token) throw new UnauthorizedException();

  // Todo: Add JWT Logic Here
  (c.store as any)["userId"] = 1;
};
