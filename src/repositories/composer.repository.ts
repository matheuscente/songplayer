import { PrismaClient } from "@prisma/client";
import { IComposerRepository, IClientComposer, IDatabaseComposer } from "../models/composer.model";
class ComposerRepository implements IComposerRepository {
    constructor(private readonly database: PrismaClient) {
        this.database = database
    }

    async getAll(): Promise<IDatabaseComposer[]> {
        return this.database.composers.findMany() as Promise<IDatabaseComposer[]>
    }
    async getById(id: number): Promise<IDatabaseComposer | undefined> {
        const composer =  this.database.composers.findUnique({where: {id}})
            if(!composer) return undefined
            return composer as Promise<IDatabaseComposer>
    }
    async create(composer: IClientComposer): Promise<number> {
        const data = await this.database.composers.create({data: composer})
        return Number(data)
    }
    async update(composer: IDatabaseComposer): Promise<void> {
        await this.database.composers.update({data: composer, where: {id: composer.id}})
    }
    async delete(id: number): Promise<void> {
        await this.database.composers.delete({where: {id}})
}
}

export default ComposerRepository