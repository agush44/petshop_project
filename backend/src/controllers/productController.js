import Product from "../models/product.js";

const getProducts = async (req, res) => {
  try {
    const { category, animalType, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (animalType) filter.animalType = animalType;
    if (search) filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

const getPromotionProducts = async (req, res) => {
  try {
    const currentDate = new Date();
    const products = await Product.find({
      discount: { $gt: 0 },
      discountExpiresAt: { $gte: currentDate },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching promotion products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json({ message: "Product deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

export {
  getProducts,
  getPromotionProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
