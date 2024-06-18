const input = require("readline-sync")
const lices = require("./.license.json")
const orders = []

const prefix = lices["auth"]["user"] + "-Casier@"

start()

function start(){
    login("")
}

function login(logText){
    console.clear()

    console.log("You must logged before starting!")
    console.log(logText)

    let args = input.question("\n" + prefix + "Password: ")

    if(args == ""){
        login("\n(!) You must field password!")
    }
    if(args == lices["auth"]["password"]){
        dashboard()
    }else{
        login("\n(!) Wrong password!")
    }
}

function dashboard(){
    console.clear()

    console.log("+============[ User Dashboard ]============+\n")
    console.log("+ Main Menu:")
    console.log(" - 1. New Order (Add another order)")
    console.log(" - 2. Check Order (View the order list)")
    console.log(" - 3. Finish Order (Finishing the order)")
    console.log(" - 0. Logout (Logout to end session)")

    let selection = input.question("\n" + prefix + "Enter ID: ")

    if(selection == ""){
        dashboard()
    }

    if(selection == 0){
        //exit
    }

    if(selection == 1){
        let id = parseInt(Object.keys(orders).length) + parseInt(1);
        createOrder(id)
    }

    if(selection == 2){
        checkOrder()
    }

    if(selection == 3){
        paymentOrder()
    }
}

function paymentOrder(){
    console.clear()

    console.log("+============[ Payment Order ]============+\n")
    console.log("+ Main Menu:")
    console.log(" - 0. Dashboard (Back to Dashboard)")

    let text = "\n+ List of Orders ID:\n"
    Object.keys(orders).forEach(orderId => {
        if(orders[orderId]["isPaid"] == true){
            text += " - #" + orderId + " items x" + Object.keys(orders[orderId]["items"]).length + " status PAID\n" 
        }else{
            text += " - #" + orderId + " items x" + Object.keys(orders[orderId]["items"]).length + " total Rp." + getPriceTotal(orderId) + "\n" 
        }
    })
    console.log(text)

    let selection = input.question(prefix + "Enter OrderID: ")
    
    if(selection == 0){
        dashboard()
    }else if(selection == ""){
        dashboard()
    }else{
        orders[selection]["isPaid"] = true
        finishOrder(selection)
    }
}

function finishOrder(id){
    console.clear()

    console.log("+============[ Finish Order ]============+\n")
    console.log("+ Order #" + id + " has be PAID!")

    let selection = input.question("\n" + prefix + "Enter Dashboard: ")

    if(selection == ""){
        dashboard()
    }
}

function checkOrder(){
    console.clear()

    console.log("+============[ Check Order ]============+\n")
    console.log("+ Main Menu:")
    console.log(" - 0. Dashboard (Back to Dashboard)")

    let text = "\n+ List of Orders ID:\n"
    Object.keys(orders).forEach(orderId => {
        if(orders[orderId]["isPaid"] == true){
            //
            return
        }
        text += " - #" + orderId + " items x" + Object.keys(orders[orderId]["items"]).length + " total Rp." + getPriceTotal(orderId) + "\n" 
    })
    console.log(text)

    let selection = input.question(prefix + "Enter OrderID: ")
    
    if(selection == 0){
        dashboard()
    }else if(selection == ""){
        dashboard()
    }else{
        showOrderInfo(selection)
    }
}

function showOrderInfo(id){
    console.clear()

    console.log("+============[ Order Info ]============+\n")
    console.log("+ Main Menu:")
    console.log(" - 1. Dashboard (Back to Dashboard)")

    console.log("\n+ Total: Rp." + getPriceTotal(id))
    let text = "+ List Items of Order #" + id + "\n"
    if(Object.keys(orders[id]["items"]).length !== 0){
        Object.keys(orders[id]["items"]).forEach(index => {
            text += " - " + index + " x" + orders[id]["items"][index]["amount"] + " Rp." + orders[id]["items"][index]["price"] + " = Rp." + parseInt(orders[id]["items"][index]["price"]) * parseInt(orders[id]["items"][index]["amount"]) + "\n"
        })
    }else{
        text = ""
    }
    console.log(text)

    let selection = input.question(prefix + "Enter: ")

    if(selection == 1){
        dashboard()
    }else if(selection == ""){
        dashboard()
    }
}

function mainOrder(id){
    console.clear()

    console.log("+============[ New Order #" + id + " ]============+\n")
    console.log("+ Main Menu:")
    console.log(" - 1. Dashboard (Cancel, Back to Dashboard)")
    console.log("\n+ Usage: item@price@amount")

    console.log("\n+ Total: Rp." + getPriceTotal(id))
    let text = "+ List Items of Order #" + id + "\n"
    if(Object.keys(orders[id]["items"]).length !== 0){
        Object.keys(orders[id]["items"]).forEach(index => {
            text += " - " + index + " x" + orders[id]["items"][index]["amount"] + " Rp." + orders[id]["items"][index]["price"] + " = Rp." + parseInt(orders[id]["items"][index]["price"]) * parseInt(orders[id]["items"][index]["amount"]) + "\n"
        })
    }else{
        text = ""
    }
    console.log(text)

    let selection = input.question(prefix + "Enter: ")

    if(selection.split("@").length == 1 || selection.split("@") == 2){
        mainOrder(id)
        return
    }

    if(selection == 1){
        delete(orders[id])
        dashboard()
    }else if(selection == ""){
        dashboard()
    }else{
        addItemOrder(id, selection.split("@")[0], selection.split("@")[1], selection.split("@")[2])
    }
}

function getPriceTotal(id){
    let priceTotal = 0;
    Object.keys(orders[id]["items"]).forEach(index => {
        let price = parseInt(orders[id]["items"][index]["price"]) * parseInt(orders[id]["items"][index]["amount"]);
        priceTotal = priceTotal + price;
    })
    return priceTotal;
}

function createOrder(id){
    orders[id] = {
        "items": {},
        "isPaid": false
    }
    mainOrder(id)
}

function addItemOrder(id, item, price, amount){
    orders[id]["items"][item] = {
        "price": price,
        "amount": amount
    }
    mainOrder(id)
}
