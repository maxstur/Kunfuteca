const { faker } = require("@faker-js/faker");

const generateProducts = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.imageUrl(),
    code: faker.rendom.numeric(),
    stock: faker.string.numeric(),
    category: faker.commerce.department(),
  };
};

module.exports = { generateProducts };
