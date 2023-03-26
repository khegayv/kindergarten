const { isValidObjectId } = require("mongoose")
const { Cart } = require("../models/cartModel")
const User = require("../models/userModel")

exports.addItemToCart = async (req, res) => {
    let userId = req.params.userId

    if (!userId || !isValidObjectId(userId))
        return res.status(400).send({ status: false, message: "Invalid user ID" })

    let productId = req.body.productId
    if (!productId)
        return res.status(400).send({ status: false, message: "Invalid product" })

    let cart = await Cart.findOne({ userId: userId })

    if (cart) {
        let itemIndex = cart.products.findIndex((p) => p.productId == productId)

        if (itemIndex > -1) {
            let productItem = cart.products[itemIndex]
            productItem.quantity += 1
            cart.products[itemIndex] = productItem
        } else {
            cart.products.push({ productId: productId, quantity: 1 })
        }
        cart = await cart.save()
        return res.status(200).send({ status: true, updatedCart: cart })
    } else {
        const newCart = await Cart.create({
            userId,
            products: [{ productId: productId, quantity: 1 }],
        })

        return res.status(201).send({ status: true, newCart: newCart })
    }
}

exports.getCart = async (req, res) => {
    let userId = req.params.userId

    if (!userId || !isValidObjectId(userId))
        return res.status(400).send({ status: false, message: "Invalid user ID" })

    let cart = await Cart.findOne({ userId: userId })
    if (!cart)
        return res
            .status(404)
            .send({ status: false, message: "Cart not found for this user" })

    res.status(200).send({ status: true, cart: cart })
}

exports.decreaseQuantity = async (req, res) => {
    // use add product endpoint for increase quantity
    let userId = req.params.userId
    let productId = req.body.productId

    if (!userId || !isValidObjectId(userId))
        return res.status(400).send({ status: false, message: "Invalid user ID" })

    let cart = await Cart.findOne({ userId: userId })
    if (!cart)
        return res
            .status(404)
            .send({ status: false, message: "Cart not found for this user" })

    let itemIndex = cart.products.findIndex((p) => p.productId == productId)

    if (itemIndex > -1) {
        let productItem = cart.products[itemIndex]
        productItem.quantity -= 1
        cart.products[itemIndex] = productItem
        cart = await cart.save()
        return res.status(200).send({ status: true, updatedCart: cart })
    }
    res
        .status(400)
        .send({ status: false, message: "Item does not exist in cart" })
}

exports.removeItem = async (req, res) => {
    let userId = req.params.userId
    let productId = req.body.productId

    if (!userId || !isValidObjectId(userId))
        return res.status(400).send({ status: false, message: "Invalid user ID" })

    let cart = await Cart.findOne({ userId: userId })
    if (!cart)
        return res
            .status(404)
            .send({ status: false, message: "Cart not found for this user" })

    let itemIndex = cart.products.findIndex((p) => p.productId == productId)
    if (itemIndex > -1) {
        cart.products.splice(itemIndex, 1)
        cart = await cart.save()
        return res.status(200).send({ status: true, updatedCart: cart })
    }
    res
        .status(400)
        .send({ status: false, message: "Item does not exist in cart" })
}