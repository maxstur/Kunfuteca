const socket = io();

const id = document.getElementById("id");
const title = document.getElementById("title");
const description = document.getElementById("description");
const code = document.getElementById("code");
const price = document.getElementById("price");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
const status = document.getElementById("status");
const createProductBtn = document.getElementById("createProductBtn");
const productsTable = document.getElementById("productsTable");

createProductBtn.addEventListener("click", () => {
  socket.emit("createNewProduct", {
    id: id.value,
    title: title.value,
    description: description.value,
    code: code.value,
    price: price.value,
    stock: stock.value,
    category: category.value,
  });

  (id.value = ""),
    (title.value = ""),
    (description.value = ""),
    (code.value = ""),
    (price.value = ""),
    (stock.value = ""),
    (category.value = "");
});

// socket.on('newProduct', (data) => {

socket.on("List of products updated", ({ products }) => {
  productsTable.innerHTML = "";
  products.forEach((product) => {
    productsTable.innerHTML += `
      <tr>   
        <td>${product._id}</td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.code}</td>
        <td>${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td><button onclick="deleteProduct('${product._id}')">Delete</button></td>
      </tr>
    `;
  });
});

function deleteProduct(id) {
  socket.emit("deleteProduct", { id: id });
}
