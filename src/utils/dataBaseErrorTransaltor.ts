//caso mudar o database, mudar a lógica de captura de erro

//import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

const databaseErrorTranslator = (err: unknown): string | null => {
    console.log(err)

if ((err as any)?.code === "P2002" && (err as any)?.meta?.target) {
     const fields = Array.isArray((err as any)?.meta?.target)
        ? (err as any)?.meta?.target.join(", ")
        : (err as any)?.meta?.target.meta.target;
      return `please send another ${fields}`;

    }

    return null
}

export default databaseErrorTranslator