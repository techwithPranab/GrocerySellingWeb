// Shared cart storage (in production, use Redis or database)
const carts = new Map();

class CartService {
  static getCart(userId) {
    return carts.get(userId) || { items: [], total: 0 };
  }

  static setCart(userId, cart) {
    carts.set(userId, cart);
  }

  static deleteCart(userId) {
    carts.delete(userId);
  }

  static hasCart(userId) {
    return carts.has(userId);
  }

  static calculateTotal(items) {
    return items.reduce((total, item) => {
      item.subtotal = item.price * item.quantity;
      return total + item.subtotal;
    }, 0);
  }
}

module.exports = CartService;
