The package has been configured successfully. The Adonis WhatsApp configuration stored inside `config/whatsapp.ts` file relies on the following environment variables, and hence we recommend validating them.

Open the `env.ts` file and paste the following code inside the `Env.rules` object.

```ts
WABA_ID: Env.schema.number(),
WABA_TOKEN: Env.schema.string(),
WABA_VERIFY: Env.schema.string(),
```
