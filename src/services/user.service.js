clase UsersService {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll(queryParams = null) {
        return await this.dao.getAll();
    }

    async getById(id) {
        const product = await this.dao.getById(id);
        if (!product)
            throw { message: `The product ${id} does not exist`, status: 400 };
        return product;
    }

    async create(product) {
        return await this.dao.create(product);
    }

    async update(id, product) {
        await this.dao.getById(id);
        return await this.dao.update(id, product);
    }

    async delete(id) {
        await this.dao.getById(id);
        return await this.dao.delete(id);
    }
}

module.exports = UserService