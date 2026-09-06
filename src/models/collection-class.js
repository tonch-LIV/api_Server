'use strict';

class Collection {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async read(id = null, options = {}) {
    if (id) {
      return this.model.findByPk(id, options);
    }

    return this.model.findAll(options);
  }

  async update(id, data) {
    const record = await this.model.findByPk(id);

    if (!record) {
      return null;
    }

    return record.update(data);
  }

  async delete(id) {
    const record = await this.model.findByPk(id);

    if (!record) {
      return null;
    }

    await record.destroy();

    return this.model.findByPk(id);
  }
}

module.exports = Collection;