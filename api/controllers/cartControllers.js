const { Cart, User, Books, Cart_Books } = require("../db");

const getCart = async (req, res, next) =>{
    let { userId } = req.query;
    try{
            let cartUser = await Cart.findOne({
                where:{
                    UserId: userId,
                    status: "Active",
                },
                include: {
                    model: User,
                    attributes: ["username", "profile_picture", "status"],
                    model: Books,
                    attributes: ["id", "title", "price","authors"],
                    through: {attributes: ["amount"]}
                },
                
            });
            if(cartUser) res.status(200).json(cartUser)
            else res.status(400).send("No user was found with that ID")
    }catch(err){
        next(err);
    }
};

const getAllCarts = async (req, res, next) =>{
    let { userId } = req.query;
    try{
        let allCartsUser = await Cart.findAll({
            where:{
                UserId: userId,
            },
            include:{
                model: Books,
                attributes: ["id", "title", "price","authors"],
                through: {attributes: ["amount"]}
            }
        });
        if(allCartsUser) res.status(200).json(allCartsUser)
        else res.status(400).send("No user was found with that ID")
    }catch(err){
        next(err);
    }
};

const addBookToCart = async (req, res, next) =>{
    let { bookId, userId } = req.body;
    try{
        let bookToAdd = await Books.findOne({
            where:{
                id: bookId,
            }
        });
        
        if(!bookToAdd) return res.status(400).send("No book was found with that ID");

        let cart = await Cart.findOne({
            where:{
                UserId: userId,
                status: "Active",
            },
            include:{
                model: Books,
            }
        });

        if(!cart) return res.status(400).send("No cart was found with that user ID");

        let repeatedBookCheck = cart.Books.filter(book => book.id === bookId)
        if(repeatedBookCheck.length > 0){
            await Cart_Books.update({
                amount: repeatedBookCheck[0].Cart_Books.amount + 1,
            },{
                where:{
                    CartId: cart.id,
                    BookId: bookId,
                }
            }) 
            return res.send("Amount increased")
        }else{
            await cart.addBook(bookToAdd);
            return res.send(`${bookToAdd.title} added to cart!`);
        }
    }catch(err){
        next(err);
    }
};

const removeOneBookFromCart = async (req, res, next) =>{
    let { userId, bookId } = req.body;
    try{
        let bookToRemove = await Books.findOne({
            where:{
                id: bookId,
            }
        });
        
        if(!bookToRemove) return res.status(400).send("No book was found with that ID");

        let cart = await Cart.findOne({
            where:{
                UserId: userId,
                status: "Active",
            },
            include:{
                model: Books,
            }
        });

        if(!cart) return res.status(400).send("No cart was found with that user ID");
        
        let repeatedBookCheck = cart.Books.filter(book => book.id === bookId && book.Cart_Books.amount > 1)
        if(repeatedBookCheck.length > 0){
            await Cart_Books.update({
                amount: repeatedBookCheck[0].Cart_Books.amount - 1,
            },{
                where:{
                    CartId: cart.id,
                    BookId: bookId,
                }
            }) 
            return res.send("Amount decreased")
        }else{
            if(await cart.removeBook(bookToRemove)) return res.send(`All copies of ${bookToRemove.title} removed from cart`);
            else return res.send(`No copies of ${bookToRemove.title} in cart!`);
        }
    }catch(err){
        next(err);
    }
};

const removeAllBooksFromCart = async (req, res, next) => {
    let { userId, bookId } = req.body;
    try{
        let bookToRemove = await Books.findOne({
            where:{
                id: bookId,
            }
        });
        
        if(!bookToRemove) return res.status(400).send("No book was found with that ID");

        let cart = await Cart.findOne({
            where:{
                UserId: userId,
                status: "Active",
            },
            include:{
                model: Books,
            }
        });

        if(!cart) return res.status(400).send("No cart was found with that user ID");

        if(await cart.removeBook(bookToRemove)) return res.send(`All copies of ${bookToRemove.title} removed from cart`);
        else return res.send(`No copies of ${bookToRemove.title} in cart!`);

    }catch(err){
        next(err);
    }
};

const clearCart = async (req, res, next) => {
    let { userId } = req.body;
    try{
        let cart = await Cart.findOne({
            where:{
                UserId: userId,
                status: "Active",
            },
            include:{
                model: Books,
            }
        });

        if(!cart) return res.status(400).send("No cart was found with that user ID");

        await cart.setBooks([])
        res.status(200).send("Cart has been emptied")
    }catch(err){
        next(err);
    }
};

const checkoutCart = async (req, res, next) =>{
    let { userId } = req.body;
    try{
        let arrayPromises = [];
        let user = await User.findByPk(userId);
        let oldCart = await Cart.findOne({
            where:{
                UserId: userId,
            }
        })
        let newCart = await Cart.create()
        arrayPromises.push(Cart.update({
            status: "Disabled"
        },{
            where:{
                UserId: userId,
            }
        }))
        arrayPromises.push(newCart.setUser(user))

        //RESTAMOS EL STOCK

        await Promise.all(arrayPromises)
        res.status(200).send("Cart has been checked out, you can still continue purchasing tho!")
    }catch(err){
        next(err);
    }
};


module.exports = { getCart, getAllCarts, addBookToCart, removeOneBookFromCart, removeAllBooksFromCart, clearCart, checkoutCart };