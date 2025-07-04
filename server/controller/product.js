const productModel = require("../model/product");

// user can view prouct without login by name
exports.viewProduct = async (req, res) => {
  const { name } = req.body;

  const product = await productModel.findOne({ productName: name });
  // console.log("product: ", product);
  if (!product) {
    return res.status(400).json({ message: "product does not exist" });
  }

  // create object has images and content

  const result = {
    images: product.productImages,
    content: product.productDescription,
    message: "product updated",
  };
  return res.status(200).json(result);
};

// admin can edit  product by name
exports.editProduct = async (req, res) => {
  console.log(req.body);
  const { productName, content, newImages } = req.body;
  console.log("productName: ", productName);
  let product = await productModel.findOne({ productName });
  console.log(product);
  let Images = product.productImages;

  if (!product) {
    Images.push(newImages);

    //create one
    product = await productModel.create({
      productName,
      productDescription: content,
      images: Images,
    });
  }
  Images.push(newImages);

  if (content) {
    console.log("content: ", content);
    await productModel.findOneAndUpdate(
      { productName },
      { productDescription: content }
    );
  }

  if (newImages)
    await productModel.findOneAndUpdate(
      { productName },
      { productImages: Images }
    );
  // console.log(product);
  const result = {
    images: product.productImages,
    content: product.productDescription,
    message: "product updated",
  };
  return res.status(200).json(result);
};
exports.deleteImage = async (req, res) => {
  const { productName, image } = req.body;
  console.log("image: ", image);
  console.log("productName: ", productName);
  let product = await productModel.findOne({ productName });
  let Images = product.productImages;
  console.log("Images: ", Images);
  if (!product) {
    return res.status(400).json({ message: "product does not exist" });
  }
  Images = Images.filter((img) => img !== image);
  console.log("Images: ", Images);
  await productModel.findOneAndUpdate(
    { productName },
    { productImages: Images }
  );

  const result = {
    images: Images,
    message: "image deleted",
  };
  return res.status(200).json(result);
};
