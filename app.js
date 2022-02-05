const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const dbURL = "mongodb+srv://aakar:1234@cluster0.tdqtc.mongodb.net/bajaj-task?retryWrites=true&w=majority"

const user = require('./models/user');
const cart = require('./models/cart');
const product = require('./models/product');
const orders = require('./models/orders');

app.use(express.json())
app.use(cors())
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })

if (mongoose) {
    console.log("connected to mongoose")
}
else {
    console.log("unable to connected to mongoose")
}
app.listen(
    3000,
    () => { console.log("started at ", 3000) }
)

app.post('/signup', (req, res) => {
    const data = req.body;

    id = Math.random().toString(16).slice(2);
    const user_data = new user({
        userId: id,
        fname: data.fname,
        lname: data.lname,
        email: data.email,
        mobile: data.mnum,
        password: data.pass,
        role: data.role
    })
    try {
        user_data.save()
    }
    catch (e) {
        console.log("this is error in try block", e)
    }

    res.status(200).send({
        message: 'You Have Successfully Registered with ESTORE',
    })
})

app.get('/login', (req, res) => {
    var data = req.query;
    const findResult = user.find({
        email: data.email,
        password: data.pass
    },
        (error, result) => {
            if (error || result.length == 0) {
                res.status(404).send("error in finding user");
            }
            else {
                tosend = {
                    userId: result[0].userId,
                    fname: result[0].fname,
                    lname: result[0].lname,
                    email: result[0].email,
                    mobile: result[0].mobile,
                    role: result[0].role,
                    status: 200
                }
                { res.status(201).send(tosend) }
            }
        })
});

app.post('/carts', (req, res) => {
    const data = req.body;
    const cart_data = new cart({
        userId: data.userId,
        products: data.products

    })
        ;
    var findifcart = cart.find({
        userId: data.userId
    },
        (error, result) => {
            if (error || result.length == 0) {
                try {
                    cart_data.save()
                }
                catch (e) {
                    console.log("this is error in try block")
                }
            }
            else {
                flag = 0;
                for (var i = 0; i < data.products.length; i++) {
                    for (var j = 0; j < result[0].products.length; j++) {
                        if (data.products[i].productId == result[0].products[j].productId) {
                            result[0].products[j].quantity += data.products[i].quantity;
                            flag = 1;
                            break;
                        }
                    }
                    if (flag == 0) {
                        result[0].products.push(data.products[i]);
                    }
                }
                cart.updateOne({ userId: data.userId }, { $set: { products: result[0].products } }, (error, result) => { });
                res.status(201);
            }
        }
    )
    res.status(201).send({ "message": "added to cart" });
});

app.get('/carts', (req, res) => {
    const data = req.query;
    var findResult = cart.find({
        userId: data.userId
    }, (error, result) => {
        if (error || result.length == 0) {
            res.status(404).send("Cart is Empty");
        }
        else {
            res.status(201).send(result);
        }
    })
});

app.post('/carts/delete', (req, res) => {
    const data = req.body;
    var finalcart = [];
    var findResult = cart.find({
        userId: data.userId
    }, (error, result) => {
        if (error || result.length == 0) {
            res.status(404).send("Cart is Empty");
        }
        else {
            console.log(data.products);
            if (data.products.length > 0) {
                for (var i = 0; i < data.products.length; i++) {
                    var d = {
                        productId: data.products[i].productId,
                        quantity: data.products[i].quantity
                    }
                    finalcart.push(d)
                }
                cart.updateOne({ userId: data.userId }, { $set: { products: finalcart } }, (error, result) => { });
            }
            else {
                cart.deleteMany({ userId: data.userId }, (error, result) => { });
            }
        }
    })
})

var loc;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        loc = file.originalname
        cb(null, loc);
    }
});

var upload = multer({ storage: storage });

app.post('/product/image-upload', upload.single('image'), (req, res) => {
    const image = req.image;
    res.send(apiResponse({ path: "http://localhost:3000/uploads/" + loc, image }));
});
function apiResponse(results) {
    return JSON.stringify({ "status": 200, "error": null, "response": results });
}

app.get('/uploads/:filename', function (req, res) {
    const filePath = "./uploads/" + req.params.filename;
    res.sendFile(filePath, { root: __dirname });
});


app.post('/products', (req, res) => {
    id = Math.random().toString(16).slice(2);
    const data = req.body;
    const product_data = new product({
        userId: data.userId,
        productId: id,
        title: data.title,
        description: data.description,
        price: data.price,
        image: data.image
    })
    try {
        product_data.save()
    }
    catch (e) {
        console.log("this is error in try block", e)
    }
    res.status(200).send({
        message: 'Product Added Successfully',
    })
});

app.get('/products', (req, res) => {
    const data = req.query;
    var findResult = product.find({
        userId: data.userId
    }, (error, result) => {
        if (error || result.length == 0) {
            res.status(404).send("No Products");
        }
        else {
            res.status(201).send(result);
        }
    })
});

app.get('/allproducts', (req, res) => {
    var products = product.find({}, (error, result) => {
        if (error || result.length == 0) {
            res.status(404).send("No Products");
        }
        else {
            res.status(201).send(result);
        }
    })
});

app.post('/products/update', (req, res) => {
    const data = req.body;
    product.updateOne({ productId: data.productId }, { $set: { title: data.title, description: data.description, price: data.price, image: data.image } }, (error, result) => { });
    res.status(200).send({
        message: 'Product Updated Successfully',
    })
});

app.post('/products/delete', (req, res) => {
    const data = req.body;
    product.deleteOne({ productId: data.productId }, (error, result) => { });
    res.status(200).send({
        message: 'Product Deleted Successfully',
    })
});

app.post('/carts/pay', (req, res) => {
    const data = req.body;
    id = Math.random().toString(16).slice(2);
    const order_data = new orders({
        userId: data.userId,
        orderId: id,
        products: data.products,
        amount: data.total,
    })
    try {
        order_data.save()
    }
    catch (e) {
        console.log("this is error in try block", e)
    }
    res.status(200).send({
        message: 'Order Placed Successfully',
    })
    cart.deleteMany({ userId: data.userId }, (error, result) => { });
});

app.get('/totalsales', (req, res) => {
    const data = req.query;
    prods = [];
    var findproductids = product.find({
        userId: data.userId
    }, (error, result) => {
        if (error || result.length == 0) {
        }
        else {
            result.forEach(element => {
                console.log(element['productId'])
                prods.push(element['productId'])
            }
            )
            var findResult = orders.find({
                'products.productId': { $in: prods }

            }, (error, result) => {
                console.log(result)
                if (error || result.length == 0) {
                }
                else {
                    res.status(201).send(result);
                }
            })
        }
    });
});