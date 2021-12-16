const express = require("express");
const { check, validationResult } = require('express-validator');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const Restaurant = require('./models/restaurant');
const Menu = require('./models/menu');
const MenuItem = require('./models/menuItem');
const {sequelize} = require ('./db');
const initialiseDb = require('./initialiseDb');
initialiseDb();

const app = express();
const port = 3000;



app.use(express.static('public'));

app.use(express.json())
app.use(express.urlencoded())


//Configures handlebars library to work well w/ Express + Sequelize model
const handlebars = expressHandlebars({
    handlebars : allowInsecurePrototypeAccess(Handlebars)
})

//Tell this express app we're using handlebars
app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars')

const seedDb = async () => {
    
    // await sequelize.sync({ force: true });

    const restaurants = [
        {name : 'McDonalds', image : '/img/McDonalds.gif'},
        {name : 'Chipotle', image: '/img/chipotle.gif'},
        {name : 'KFC', image: '/img/KFC.gif'},
        {name : 'Wendys', image: '/img/wendys-eyebrows.gif'}
    ]

    const restaurantsPromises = restaurants.map(restaurant => Restaurant.create(restaurant))
    await Promise.all(restaurantsPromises)
    console.log("db populated!")
}

// seedDb();



const restaurantChecks = [
    check('name').not().isEmpty().trim().escape(),
    check('image').isURL(),
    check('name').isLength({ max: 50 })
]

app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.render('restaurants',{restaurants});
});

app.get('/restaurant-data', async (req,res) => {
    const restaurants = await Restaurant.findAll();
    res.json({restaurants})
})

app.get('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    res.render('restaurant',{restaurant});
});

app.get('/menu/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    res.json(restaurant)
});



//New Restaurant go here: 

app.get('/new-restaurant',async(req,res)=>{
    const restaurantAlert=""
    res.render('newrestaurant',{restaurantAlert})
})

app.post('/new-restaurant',async(req,res)=>{
const newRestaurant=await Restaurant.create(req.body)
let restaurantAlert = `${newRestaurant.name} Added to your Database`
const foundRestaurant=await Restaurant.findByPk(newRestaurant.id)

if(foundRestaurant){
    res.render('newrestaurant',{restaurantAlert})
}else{
    restaurantAlert='Failed to add Restaurant'
    res.render('newrestaurant',{restaurantAlert})
}
 
})

app.delete('/restaurants/:id', async (req,res)=>{
    const deletedRestaurant = await Restaurant.destroy({
        where: {id:req.params.id}
    })
    const restaurants = await Restaurant.findAll();
    res.render('restaurants', {restaurants})
})




// app.post('/restaurants', restaurantChecks, async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     await Restaurant.create(req.body);
//     res.sendStatus(201);
// });

// app.delete('/restaurants/:id', async (req, res) => {
//     await Restaurant.destroy({
//         where: {
//             id: req.params.id
//         }
//     });
//     res.sendStatus(200);
// });

// app.put('/restaurants/:id', restaurantChecks, async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const restaurant = await Restaurant.findByPk(req.params.id);
//     await restaurant.update(req.body);
//     res.sendStatus(200);
// });

// app.patch('/restaurants/:id', async (req, res) => {
//     const restaurant = await Restaurant.findByPk(req.params.id);
//     await restaurant.update(req.body);
//     res.sendStatus(200);
// });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});