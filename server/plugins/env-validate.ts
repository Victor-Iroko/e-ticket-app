import * as z from "zod";

export default defineNitroPlugin(() => {
  const env = envSchema.safeParse(process.env);

  if (!env.success) {
    if (import.meta.dev) {
      // eslint-disable-next-line no-console
      console.error(z.formatError(env.error));
    } else {
      throw createError({
        message: env.error.message,
        statusMessage: "Environment variable validation error",
        status: 500,
      });
    }
  }
});
