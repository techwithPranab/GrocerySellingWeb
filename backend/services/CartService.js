const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
  static async getCart(userId) {
    try {
      const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price images isActive stock');
      if (!cart) {
        return { items: [], total: 0 };
      }

      // Filter out inactive products or products with insufficient stock
      const validItems = cart.items.filter(item => {
        const product = item.productId;
        return product && product.isActive && product.stock >= item.quantity;
      });

      // Update cart if items were filtered out
      if (validItems.length !== cart.items.length) {
        cart.items = validItems;
        cart.total = this.calculateTotal(validItems);
        await cart.save();
      }

      return {
        items: cart.items.map(item => ({
          productId: item.productId._id.toString(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          subtotal: item.subtotal
        })),
        total: cart.total
      };
    } catch (error) {
      console.error('Error getting cart:', error);
      throw new Error('Failed to retrieve cart');
    }
  }

  static async addToCart(userId, productId, quantity, name, price, unit) {
    try {
      // Verify product exists and is active
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        throw new Error('Product not found or unavailable');
      }

      if (product.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update existing item
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        if (product.stock < newQuantity) {
          throw new Error('Insufficient stock for requested quantity');
        }

        cart.items[existingItemIndex].quantity = newQuantity;
        cart.items[existingItemIndex].subtotal = price * newQuantity;
      } else {
        // Add new item
        cart.items.push({
          productId,
          name,
          price,
          quantity,
          unit,
          subtotal: price * quantity
        });
      }

      cart.total = this.calculateTotal(cart.items);
      await cart.save();

      return await this.getCart(userId);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  static async updateCartItem(userId, productId, quantity) {
    try {
      if (quantity <= 0) {
        return await this.removeFromCart(userId, productId);
      }

      // Verify product stock
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        throw new Error('Product not found or unavailable');
      }

      if (product.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        throw new Error('Cart not found');
      }

      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex === -1) {
        throw new Error('Item not found in cart');
      }

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity;
      cart.total = this.calculateTotal(cart.items);

      await cart.save();
      return await this.getCart(userId);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  static async removeFromCart(userId, productId) {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );

      cart.total = this.calculateTotal(cart.items);
      await cart.save();

      return await this.getCart(userId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  static async clearCart(userId) {
    try {
      await Cart.findOneAndDelete({ userId });
      return { items: [], total: 0 };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  static async hasCart(userId) {
    try {
      const cart = await Cart.findOne({ userId });
      return cart && cart.items.length > 0;
    } catch (error) {
      console.error('Error checking cart existence:', error);
      return false;
    }
  }

  static calculateTotal(items) {
    return items.reduce((total, item) => {
      item.subtotal = item.price * item.quantity;
      return total + item.subtotal;
    }, 0);
  }

  // Get cart item count for a user
  static async getCartItemCount(userId) {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return 0;

      return cart.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error getting cart item count:', error);
      return 0;
    }
  }
}

module.exports = CartService;
