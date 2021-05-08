import { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import ShoppingCart from "./components/ShoppingCart";
import OrderDetails from "./components/OrderDetails";
import HomePage from "./components/HomePage";
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  console.log("ISORDERCOMPLETED: ", isOrderComplete);

  useEffect( () => {
    const fetchProducts = async () => {
      let response = await fetch("http://localhost:3001/api/products");
      let products = await response.json();
      console.log("USEFFECT: ", products);
      setProducts(products);
    }
    fetchProducts();
  }, []);

  const addToCart = async productIdQuantity => {
    let {id, quantity} = productIdQuantity;
    let inCart = false, newCart = [];
    cart.forEach(p => {if(p.id == id) inCart=true;});
    if(inCart)
      newCart = cart.map(p => (p.id == id) ? {...p, quantity: quantity+p.quantity} : {...p});
    else 
      newCart = cart.concat({...products.find(p => p.id == id),quantity:quantity});
    await fetch("http://localhost:3001/api/shoppingCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCart)
    })
    setCart(newCart);
  }

  const removeFromCart = async productIdQuantity => {
    let {id, quantity} = productIdQuantity;
    let newCart = cart.map(p => (p.id == id) ? {...p, quantity: p.quantity-quantity} : {...p});
    newCart = newCart.filter(p => p.quantity > 0);

    await fetch("http://localhost:3001/api/shoppingCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCart)
    });
    
    setCart(newCart);
  }

  const emptyCart = async () => {
    await fetch("http://localhost:3001/api/shoppingCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([])
    });
    setCart([]);
  }

  const finishOrder = async orderDetails => {
    let totalCost = 0;
    orderDetails.purchasedItems = cart;
    cart.forEach(item => totalCost += item.price * item.quantity);
    orderDetails.totalCost = totalCost;
    
    await fetch("http://localhost:3001/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderDetails)
    });

    emptyCart();
  }

  return (
    <div className="app-container">
      <Navbar />
      <Switch>
        <Route exact path="/products/:category">
          <Products products={products} />
        </Route>
        <Route path="/products/productDetail/:productId">
          <ProductDetail products={products} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
        </Route>
        <Route path="/shoppingCart">
          <ShoppingCart cart={cart} />
        </Route>
        <Route path="/orderDetails">
          <OrderDetails finishOrder={finishOrder} />
        </Route>
        <Route exact path="/">
          <HomePage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
