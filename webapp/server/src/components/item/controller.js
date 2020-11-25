import ItemModel from './model'

export default {
    updateItem: (req, res, next) => {
        const itemID = req.item._id;
        const newItem = {
            productId: req.item.productId,
            title: req.item.title,
            manufacturer: req.item.manufacturer,
            quantity: req.item.quantity,
            weight: req.item.weight,
            wsection: req.item.wsection,
            wshelf: req.item.wshelf, 
            wrow: req.item.wrow,
            arrival: req.item.arrival,
            departure_scheduled: req.item.departure_scheduled
        }

        ItemModel.findByIdAndUpdate(itemID, newItem, {new: true})
        .then(() => res.sendStatus(200))
        .catch(next)
    },
    removeItem: (req, res, next) => {
        const itemID = req.item._id;
        ItemModel.findByIdAndDelete(itemID)
        .then(() => res.sendStatus(200))
        .catch(next)
    }
}