const express = require("express");
const router = express.Router();
const products = require("../models/productTransition");

router.get("/seedData", async (req, res) => {
  try {
    const result = await fetch(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const data = await result.json();

    await products.insertMany(data);

    res.status(200).json({ msg: "Database Initialized" });
  } catch (error) {
    res.status(500).json({ error: "Error while Database Initializing" });
  }
});

router.get("/transition", async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9]/g, "");
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;

    const searchQuery = {
      title: { $regex: new RegExp(searchNoSpecialChar, "i") },
    };
    const TotalProduct = await products.countDocuments(searchQuery);

    const pagitation = await products
      .find(searchQuery)
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.json({ data: pagitation, totalProducts: TotalProduct });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/statistics", async (req, res) => {
  const month = req.query.month;
  if (!month) {
    return res.status(400).json({ error: "Month parameter is required." });
  }
  const startDate = new Date(`${month}-01`);
  const endDate = new Date(`${month}-31`);

  try {
    const totalSoldItems = await products.countDocuments({
      sold: true,
      dateOfSale: { $gte: startDate, $lte: endDate },
    });

    const soldItems = await products.find({
      sold: true,
      dateOfSale: { $gte: startDate, $lte: endDate },
    })
    
    const totalSaleAmount = soldItems.reduce((total,item)=>{
      return total + Number(item.price);
    },0)
    
    const totalNotSoldItems = await products.countDocuments({sold:false});

    res.status(200).json({
      totalSoldItems,
      totalSaleAmount:totalSaleAmount,
      totalNotSoldItems
    });
  } catch (error) {
   
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/bar_chart',async(req,res)=>{

    const month = parseInt(req.query.month,10);

    const priceRange = [
      {range:'0 - 100',count:0},
      {range:'101 - 200',count:0},
      {range:'201 - 300',count:0},
      {range:'301 - 400',count:0},
      {range:'401 - 500',count:0},
      {range:'501 - 600',count:0},
      {range:'601 - 700',count:0},
      {range:'701 - 800',count:0},
      {range:'801 - 900',count:0},
      {range:'901 - above',count:0},
    ]
    try {
      const startDate = new Date(2022, month - 1, 1);
      const endDate = new Date(2022, month, 1);
      
      
      const product = await products.find({
        dateOfSale:{
          $gte: startDate,
          $lt: endDate
        }
      })
     
      
     
      product.forEach(items=>{
        const price = parseFloat(items.price)
     
        if(price <= 100) priceRange[0].count++;
        else if(price <=200) priceRange[1].count++;
        else if(price <=300) priceRange[2].count++;
        else if(price <=400) priceRange[3].count++;
        else if(price <=500) priceRange[4].count++;
        else if(price <=600) priceRange[5].count++;
        else if(price <=700) priceRange[6].count++;
        else if(price <=800) priceRange[7].count++;
        else if(price <=900) priceRange[8].count++;
        else priceRange[9].count++;
        
        
      })
     
      res.json(priceRange)
     

  
  } catch (error) {    
    res.status(500).json({ error: "Internal server error" });
  }
  
  })

  router.get('/pie_chart', async (req, res) => {
    const month = parseInt(req.query.month, 10);
    
    let categoryCounts = [];

    try {
      
      const startDate = new Date(2022, month - 1, 1);
      const endDate = new Date(2022, month, 1);
     
        const product = await products.find({
            dateOfSale: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        for (let i = 0; i < product.length; i++) {
            const item = product[i];
            const category = item.category;
         

            let found = false;
            for (let j = 0; j < categoryCounts.length; j++) {
                if (categoryCounts[j].category === category) {
                    categoryCounts[j].count++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                categoryCounts.push({ category: category, count: 1 });
            }
        }

        res.status(200).json(categoryCounts);
    } catch (error) {
       
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get('/combinedApi',async(req,res)=>{
  try {
    const monthParm = req.query.month;
    if (!monthParm) {
      return res.status(400).json({ error: "Missing 'month' query parameter" });
  }
    const[year,month] =  monthParm.split('-').map(Number);
    
    const statsResponse = await fetch(`http://localhost:8000/statistics?month=${monthParm}`);
    const pieChartResponse = await fetch(`http://localhost:8000/pie_chart?month=${month}`);
    const barChartResponse = await fetch(`http://localhost:8000/bar_chart?month=${month}`);

    const statsData = await statsResponse.json();
    const pieChartData = await pieChartResponse.json();
    const barChartData = await barChartResponse.json();

    // Combine the responses into a single object
    const combinedResponse = {
        stats: statsData,
        pieChart: pieChartData,
        barChart: barChartData,
    };

    res.json(combinedResponse);


  } catch (error) {
   
    res.status(500).json({ error: "Internal server error" });
  }
})


  
module.exports = router;
