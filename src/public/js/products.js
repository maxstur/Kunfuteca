const addToCart = (cartId, productId) => {
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "POST",
  }).then((res) => {
    if (res.status == 200) {
      windows.location.reload();
    }
  });
};

const purchaseCart = (cartId) => {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: "GET",
  }).then((res) => {
    if (res.status == 200) {
      windows.location.reload();
    }
  });
};

const deleteFromCart = (cartId, productId) => {
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "DELETE",
  }).then((res) => {
    if (res.status == 200) {
      windows.location.reload();
    }
  });
};
