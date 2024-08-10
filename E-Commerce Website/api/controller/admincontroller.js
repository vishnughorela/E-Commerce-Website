const AdminProductCollection = require("../models/adminproduct");
const QueryCollection = require("../models/query");
const RegCollection = require("../models/reg");
const nodemailer = require("nodemailer");

exports.AdminproductsController = async (req, res) => {
  try {
    const imageName = req.file.filename;
    const { Ptitle, PDesc, Pprice } = req.body;

    if (!Ptitle || !PDesc || !Pprice || !req.file.filename) {
      return res.status(400).json({ Message: "All Fields hy" });
    }

    const record = new AdminProductCollection({
      productTitle: Ptitle,
      productDesc: PDesc,
      productPrice: Pprice,
      productImage: imageName,
    });
    await record.save();
    res
      .status(200)
      .json({ Data: record, Message: "Successfully Add Product" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Message: "Server Error : Please try again " });
  }
};

exports.AlladminproductController = async (req, res) => {
  try {
    const record = await AdminProductCollection.find();
    res.status(200).json({ Data: record, Message: "Successfully Fetch" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Message: "Server Error : Please try again " });
  }
};

exports.AdminProductDeleteController = async (req, res) => {
  const id = req.params.id;
  await AdminProductCollection.findByIdAndDelete(id);
  res.json({ Message: "Successfully Delete Product" });
};

exports.AdminUpdateProductController = async (req, res) => {
  const id = req.params.id;
  const record = await AdminProductCollection.findById(id);
  res.json({ Data: record });
};

exports.AdminupdatedDataController = async (req, res) => {
  const id = req.params.id;
  const { title, desc, price, Pstatus } = req.body;
  await AdminProductCollection.findByIdAndUpdate(id, {
    productTitle: title,
    productDesc: desc,
    productPrice: price,
    productStatus: Pstatus,
  });

  res.json({ Message: "Successfully Update Product " });
};

exports.QueryDataController = async (req, res) => {
  const record = await QueryCollection.find();
  res.json({ Data: record });
};

exports.QueryReplyController = async (req, res) => {
  const id = req.params.query;
  const { mailSub, mailBody } = req.body;

  const mailData = await QueryCollection.findById(id);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    
    auth: {
      user: "vishnughorelapress@gmail.com",
      pass: "vishnu123",
    },
  });

  const info = await transporter.sendMail({
    from: " vishnughorelapress@gmail.com", 
    to: mailData.UserEmail, 
    subject: mailSub, 
    text: mailBody, 
    html: mailBody, 
  });

  await QueryCollection.findByIdAndUpdate(id, {
    MailStatus: "Read",
  });

  res.json({ Message: "Successfully Reply Mail " });
};

exports.deleteQueryController = async (req, res) => {
  const id = req.params.id;
  await QueryCollection.findByIdAndDelete(id);
  res.json({ Message: "Successfully Delete  " });
};

exports.UserDataController = async (req, res) => {
  const record = await RegCollection.find();
  res.json({ Data: record });
};

exports.UpdateStatusController = async (req, res) => {
  const id = req.params.id;

  const record = await RegCollection.findById(id);

  let newStatus = null;

  if (record.status === "Active") {
    newStatus = "Suspended";
  } else {
    newStatus = "Active";
  }

  const data = await RegCollection.findByIdAndUpdate(id, {
    status: newStatus,
  });

  res.json({ Data: data, Message: "Update User Status  " });
};
