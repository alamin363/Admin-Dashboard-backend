import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getTransaction = async (req, res) => {
  try {
    // sort should Like this {"field": "userId", "sort": "desc" }

    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    //  formatted sort should look like {userId: -1}

    const generatSort = () => {
      const shortParsed = JSON.parse(sort);
      const sortFormatted = {
        [shortParsed.field]: (shortParsed.sort = "asc" ? 1 : -1),
      };
      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generatSort() : {};

    const transaction = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(404).json({
      transaction,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
