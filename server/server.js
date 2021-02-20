require("dotenv").config();
const express = require('express')
const db = require('./db')


const morgan = require('morgan')

const app = express()

app.use(express.json())
// get all restaurants
app.get('/api/v1/restaurants', async (req, res) => {

    try {
    const result = await db.query("select * from restaurants")
    console.log(result)
    res.status(200).json({
        status: "success",
        results: result.rowCount,
        data: {
            restaurants: result.rows,
        }
    })
    } catch (error) {
        console.error(error)
    }
})

// get a restaurant
app.get('/api/v1/restaurants/:id' , async (req, res) => {
  console.log(req.params)

  try {
  const result = await db.query("select * from restaurants where id = $1", [req.params.id])
  res.status(200).json({
      status: "success",
      data: {
          restaurant: result.rows[0]
      }

  })
  } catch (error) {
      console.error(error)
  }
})

//  Create a Restaurant
app.post('/api/v1/restaurants' , async (req, res) => {
      console.log(req.body)
    const {name, location, price_range} = req.body
    try {
        const results = await db.query("INSERT INTO restaurants (name, location, price_range) values($1, $2, $3) returning *", [name, location, price_range])
      console.log(results)
      res.status(201).json({
      status: "success", 
      data: {
          restaurant: results.rows[0]
      }

  })
    } catch (error) {
        console.error(error)
    }
  
})

// Update Restaurants
app.put('/api/v1/restaurants/:id' , async (req , res)=> {
     const {name, location, price_range} = req.body;
    try {
    const results = await db.query('UPDATE restaurants SET name = $1 , location = $2 , price_range = $3 where id = $4 returning *' , [name, location, price_range, req.params.id]);
      res.status(200).json({
      status: "success",
      data: {
          restaurant: results.rows[0]
      }

  })
    } catch (error) {
        console.log(error)
    }
   console.log(req.params.id)
   console.log(req.body)
})

// Delete retaurants
app.delete('/api/v1/restaurants/:id', async (req, res) => {

    try {
        const result = await db.query(' DELETE FROM restaurants where id = $1', [req.params.id]);
         res.status(204).json({
        status: "success"
    })
    } catch (error) {
        console.log(error)
    }
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`)
})