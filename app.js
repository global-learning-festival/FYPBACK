const express = require('express');
const bodyParser = require('body-parser');
const product = require('./model/product');
const announcement = require('./model/announcement');
const map = require('./model/map')
const events = require('./model/events');
const importantInformation = require('./model/importantInfo');
const User = require('./model/user');
const cors = require('cors');
const app = express();
const path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const multer = require('multer');


// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
//Test
app.post('/product', (req, res) => {


    var name = req.body.name
    var description = req.body.description
    var brand = req.body.brand
    var price = req.body.price

    // call the model method add module
    product.addproduct(name, description, brand, price, (err, result) => {
        if (err) {
            console.log(err)
            // respond the error
            res.status(500).send()
        } else {


            res.status(201).send(result)
        }
    })

})

app.get('/products', (req, res) => {
    product.getproduct((err, result) => {
        if (err) {
            console.log(err)
            // respond with status 500 
            res.status(500).send()
        } else {
            console.log(result)
            //respond with status 200 and send result back
            res.status(200).send(result.rows)
        }
    })
})

//Create Announcements
app.post('/announcement', (req, res) => {


    var title = req.body.title
    var description = req.body.description
    var imageid = req.body.publicId


    // call the model method add module
    announcement.addAnnouncement(title, description, imageid, (err, result) => {
        if (err) {
            console.log(err)
            // respond the error
            res.status(500).send()
        } else {
            console.log(result)

            res.status(201).send(result)
        }
    })

})

//Retrieve announcements
app.get('/announcements', (req, res) => {
    announcement.getAnnouncements((err, result) => {
        if (err) {
            console.log(err)
            // respond with status 500 
            res.status(500).send()
        } else {
            console.log(result)
            //respond with status 200 and send result back
            res.status(200).send(result.rows)
        }
    })
})


app.get('/announcements/:id', (req, res) => {
    var announcementid = parseInt(req.params.id);
    

    announcement.getAnnouncementById(announcementid, (err, result) => {
        if (err) {
            console.log(result)
            console.log(err);
            res.status(500).send();
        } else {
            console.log(result);
            res.status(200).send(result.rows);
        }
    });
});



app.put('/announcements/:id/', (req, res) => {

    var productid = parseInt(req.params.id);
    var title = req.body.title
    var description = req.body.description
    var image = req.body.publicId


    // call the model method add module
    announcement.updateAnnouncement(productid, title, description, image, (err, result) => {
        if (err) {
            console.log(err)
            // respond the error
            res.status(500).send()
        } else {


            res.status(201).send(result)
        }
    })

})

app.delete('/announcements/:id', (req, res)=>{
    var productid = parseInt(req.params.id);

    announcement.deleteAnnouncement(productid, (err, result)=>{
        if(err){
            console.log(err)
            // respond with status 500 
            res.status(500).send()
        }else {
            console.log(result)
            //respond with status 200 and send result back
            res.status(200).send(result.rows)    
        }
    })
})
app.post('/events', (req, res) => {

    var title = req.body.title;
    var image_banner = req.body.image_banner;
    var time_start = req.body.time_start;
    var time_end = req.body.time_end;
    var location = req.body.location;
    var keynote_speaker = req.body.keynote_speaker;
    var description = req.body.description;
    var survey_link = req.body.survey_link;


    events.addEvent(title, image_banner, time_start, time_end, location, keynote_speaker, description, survey_link, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})

app.get('/events', (req, res) => {

    events.getEvents((err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            console.log(result)
            res.status(200).send(result.rows)
        }
    })

})

app.get('/events/:id', (req, res) => {
    var eventid = parseInt(req.params.id);
    

    events.getEventbyId(eventid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            console.log(result);
            res.status(200).send(result.rows);
        }
    });
});

app.put('/events/:id', (req, res) => {
    var eventid = parseInt(req.params.id);
    var title = req.body.title
    var image_banner = req.body.image_banner
    var time_start = req.body.time_start
    var time_end = req.body.time_end
    var location = req.body.location
    var keynote_speaker = req.body.keynote_speaker
    var description = req.body.description
    var survey_link = req.body.survey_link
  
    events.updateEvent(eventid, title, image_banner, time_start,time_end, location, keynote_speaker, description, survey_link ,(err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send();
      } else {
        res.status(200).send(result);
      }
    });
});

app.delete('/deleteevent/:id', (req, res) => {
    var eventid = parseInt(req.params.id);

    events.deleteEvent(eventid, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})
app.post('/importantInformation', (req, res) => {

    var title = req.body.title
    var subtitle = req.body.subtitle
    var description = req.body.description

    importantInformation.addImportantInfomation(title, subtitle, description, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})

app.get('/importantInformation', (req, res) => {

    importantInformation.getImportantInfomation((err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            console.log(result)
            res.status(200).send(result.rows)
        }
    })

})
app.get('/info/:id', (req, res) => {
    var infoid = parseInt(req.params.id);
    

    importantInformation.getImportantInformationById(infoid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            console.log(result);
            res.status(200).send(result.rows);
        }
    });
});


app.put('/importantinfo/:id', (req, res) => {
    var infoid = parseInt(req.params.id);
    var title = req.body.title
    var subtitle = req.body.subtitle
    var description = req.body.description
  
    importantInformation.updateImportantInformation(infoid, title, subtitle, description, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send();
      } else {
        res.status(200).send(result);
      }
    });
});



app.delete('/delete/:id', (req, res) => {
    var eventid = parseInt(req.params.id);

    events.deleteEvent(eventid, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})
app.post('/marker', (req, res) => {

    var location_name = req.body.location_name
    var category = req.body.category
    var description = req.body.description
    var coordinates = req.body.coordinates
    var image = req.body.publicId

    map.addmarker(location_name, category, description, coordinates, image, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })


})

app.get('/markerindiv/:id', (req, res) => {
    var mapid = parseInt(req.params.id);
    

    map.getmarkerindiv(mapid, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            console.log(result);
            res.status(200).send(result.rows);
        }
    });
});

app.get('/markers', (req, res) => {

    map.getmarker((err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            console.log(result)
            res.status(200).send(result.rows)
        }
    })

})


app.put('/marker/:id', (req, res) => {
    var mapid = parseInt(req.params.id);
    var location_name = req.body.location_name
    var category = req.body.category
    var description = req.body.description
  
    map.updatemarker(mapid, location_name, category, description, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send();
      } else {
        res.status(200).send(result);
      }
    });
});

app.delete('/delmarker/:id', (req, res) => {
    var mapid = parseInt(req.params.id);

    map.deletemarker(mapid, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})





app.post('/adduser', (req, res) => {

    var username = req.body.username
    var password = req.body.password
    var type = req.body.type

    User.addUser(username, password, type, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})

app.post('/login', (req, res) => {

    var username = req.body.username
    var password = req.body.password
    

    User.addUser(username, password, (err, result) => {

        if (err) {
            console.log(err)
            res.status(500).send()
        }

        else {
            res.status(201).send(result)
        }
    })

})










module.exports = app;

