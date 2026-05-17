const mongoose = require("mongoose");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

const createOrderNumber = () => {
  return `ORD-${Date.now()}`;
};

const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { items } = req.body;

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new AppError("Product not found", 404);
      }

      if (!product.isActive) {
        throw new AppError(`${product.name} is not active`, 400);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Not enough stock for ${product.name}`, 400);
      }

      const totalPrice = product.price * item.quantity;

      totalAmount += totalPrice;

      orderItemsData.push({
        product: product._id,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        totalPrice,
      });

      product.stock -= item.quantity;
      await product.save({ session });
    }

    const order = await Order.create(
      [
        {
          user: req.user._id,
          orderNumber: createOrderNumber(),
          totalAmount,
          status: "confirmed",
        },
      ],
      { session },
    );

    const finalOrder = order[0];

    const orderItems = orderItemsData.map((item) => ({
      ...item,
      order: finalOrder._id,
    }));

    await OrderItem.create(orderItems, { session });

    await session.commitTransaction();

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: {
        order: finalOrder,
        items: orderItems,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

const listMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const orderIds = orders.map((order) => order._id);

    const orderItems = await OrderItem.find({
      order: { $in: orderIds },
    })
      .populate("product", "name")
      .lean();

    const formattedOrders = orders.map((order) => {
      const products = orderItems
        .filter((item) => item.order.toString() === order._id.toString())
        .map((item) => ({
          productId: item.product?._id,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        }));

      return {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        purchasedAt: order.createdAt,
        products,
      };
    });

    res.status(200).json({
      status: "success",
      results: formattedOrders.length,
      data: {
        orders: formattedOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  listMyOrders,
};
