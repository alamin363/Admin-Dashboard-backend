import express from "express";
import bodyParser from "body-parser";

import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

import clientRoutes from "./router/client.js";
import generalRoutes from "./router/general.js";
import managementRoutes from "./router/management.js";
import salesRoutes from "./router/sales.js";

// data input
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import { dataUser, dataProduct, dataProductStat, dataTransaction} from "./data/index.js";
import Transaction from "./models/Transaction.js";
// configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//  Router

app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

// mongoose setup
// dataTransaction
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGODB_DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`server port ${PORT}`));

    // OnLY DATA AD single time
    //  Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // User.insertMany(dataUser);
  //  Transaction.insertMany(dataTransaction)
  })
  .catch((error) => console.log(`${error} did not connect`));
