import * as z from "zod";

const User = z.object({
  name: z.string(),
});