import { model } from "mongoose";
import ItemModel from '../components/item/model';


// encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    let bitmap = fs.readFileSync(file);

    // convert binary data to base64 encoded string
    let encodedString = new Buffer(bitmap).toString('base64');

    return encodedString;
}

export default {
    // Process images sent from WeBots
    process_item: (req, res) => {
        if(!req.body) {
            return res
                .status(404)
                .send({error: 'Missing body of request'});
        }

        var itemVars = req.body.title.split(';');
        
        var item = new ItemModel();
        item.productId              = itemVars[0];
        item.title                  = itemVars[1];
        item.manufacturer           = itemVars[2];
        item.quantity               = itemVars[3];
        item.weight                 = itemVars[4];
        item.location.wsection      = itemVars[5];
        item.location.wshelf        = itemVars[6];
        item.location.wrow          = itemVars[7];
        item.arrival                = itemVars[8];
        item.departure_scheduled    = itemVars[9];

        console.log(item);

        item.save();

        res.status(200).send({
            message: 'Request successfully received! Received item: ' + item
        })
    },
    // Add a new item to the database
    add_new: (req, res) => {
        const { 
            title, 
            manufacturer, 
            quantity, 
            weight, 
            wsection, 
            wshelf, 
            wrow, 
            arrival, 
            departure_scheduled 
        } = req.body

        if(!req) {
            return res
                .status(404)
                .send({error: 'Must provide an item to add to database'});
        }

        ItemModel
            .findOne({
                title: title
            }, function(err, existingItem) {
                // if there is an error...
                if (err) return res.status(402).send(err)
                // if the item exists, return
                // if (existingItem) {
                //     return res
                //         .status(422)
                //         .send({error: 'Item already exists in the database. Consider updating the quantity instead.'})
                // }
                // if the item does not exist, add it to the database normally
                // create new item model
                const item = new ItemModel({
                    title: title,
                    manufacturer: manufacturer,
                    quantity: quantity,
                    weight: weight,
                    wsection: wsection,
                    wshelf: wshelf,
                    wrow: wrow,
                    arrival: arrival,
                    departure_scheduled: departure_scheduled
                });    

                // add item to database
                item.save(function (err, savedItem) {
                    if (err) {
                        return next(err)
                    }
                    res.json({
                        success: true,
                        message: "Successfully updated item in database."
                    })
                })
            })
    },
    // TODO: Needs fixing
    // Update an existing item in the database
    update_existing: (req, res) => {
        const {  
            title, 
            manufacturer, 
            quantity, 
            weight, 
            wsection, 
            wshelf, 
            wrow, 
            arrival, 
            departure_scheduled 
        } = req.body

        if(!req) {
            return res
                .status(404)
                .send({error: 'Must provide an item to update in database'});
        }

        ItemModel
            .findOne({
                title: title
            }, function(err, existingItem) {
                // if there is an error...
                if (err) return res.status(402).send(err)
                // if the item exists, return
                if (existingItem) {
                    // update quantity 
                    let newQuantity = quantity;
                    newQuantity += 1; // increment
                    // create new item model
                    const item = req.body;
                    item.updateOne({title: {title}}, {quantity: {newQuantity}}, function(err, updatedItem) {
                        if (err) {
                            return next(err)
                        }
                        res.json({
                            success: true, 
                            message: "Updated item successfully in database"
                        })
                    });
                }
            })
    },
    // TODO: Needs fixing
    // Remove an existing item from the database
    remove_existing: (req, res) => {
        const { 
            title, 
            manufacturer, 
            quantity, 
            weight, 
            wsection, 
            wshelf, 
            wrow, 
            arrival, 
            departure_scheduled 
        } = req.body

        if(!req) {
            return res
                .status(404)
                .send({error: 'Must provide an item to delete from database'});
        }

        ItemModel
            .findOne({
                title: title
            }, function (err, existingItem) {
                // if there is an error...
                if (err) return res.status(422).send(err);
                // if the item exists, decrease quantity
                if (existingItem) {
                    let newQuantity = req.body.quantity--; // decrease quantity by 1

                    const item = new ItemModel({
                        title: title,
                        manufacturer: manufacturer,
                        quantity: newQuantity,
                        weight: weight,
                        wsection: wsection,
                        wshelf: wshelf,
                        wrow: wrow,
                        arrival: arrival,
                        departure_scheduled: departure_scheduled
                    });

                    // Update the item quantity
                    if (item.quantity > 1) {
                        item.save(function(err, savedItem) {
                            if (err) {
                                return next(err)
                            }
                            res.json({
                                success: true,
                                message: "Successfully decreased quantity of item by 1."
                            })
                        })
                    }
                    
                    return res
                        .status(200)
                        .send({alert: "Item with title " + req.body.title + " already exists. Decreased quantity by 1"})
                }


                // delete item completely from database
                item.deleteMany(function(err, savedItem) {
                    if (err) {
                        return next(err)
                    }
                    res.json({
                        success: true,
                        message: "Successfully removed item as a whole from database."
                    })
                })
            })
    },
    get_all: (req, res) => {
        ItemModel.find({}, function(error, data) {
            if(error) {
                console.log(error);
                res.status(404).json({
                    success: false,
                    message: error
                })
                return;
            }
            console.log(data);
            res.status(200).json({
                success: true,
                items: data
            })
        })
    },
    get_by_id: (req, res) => {
        ItemModel.find({ productId: req.params.productId }, function(error, data) {
            if(error) {
                console.log(error);
                res.status(404).json({
                    success: false,
                    message: error
                })
                return;
            }
            console.log(data);
            res.status(200).json({
                success: true,
                items: data
            })
        })
    }
}