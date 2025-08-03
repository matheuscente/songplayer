import { PrismaClient } from "@prisma/client";
import { IComposerRepository, IClientComposer, IDatabaseComposer } from "../models/composer.model";
import { PrismaTransactionClient } from "../models/global.model";
class ComposerRepository implements IComposerRepository {
    constructor(private readonly database: PrismaClient) {
        this.database = database
    }

    async getAll(tx = this.database): Promise<IDatabaseComposer[]> {
        return tx.composers.findMany() as Promise<IDatabaseComposer[]>
    }
    async getById(id: number, tx = this.database): Promise<IDatabaseComposer | undefined> {
        const composer = await tx.composers.findUnique({where: {id}})
            if(!composer) return undefined
            return composer
    }
    async create(composer: IClientComposer, tx: PrismaTransactionClient): Promise<number> {
        const data = await tx.composers.create({data: composer})
        return Number(data)
    }
    async update(composer: IDatabaseComposer, tx: PrismaTransactionClient): Promise<void> {
        await tx.composers.update({data: composer, where: {id: composer.id}})
    }
    async delete(id: number, tx: PrismaTransactionClient): Promise<void> {
        await tx.composers.delete({where: {id}})
}
}

export default ComposerRepository