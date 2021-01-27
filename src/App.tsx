// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

import { useState } from 'react'
import { useQuery } from 'react-query'

// Components
import Item from './Item/Item';
import Cart from './Cart/Cart';
import Drawer from '@material-ui/core/Drawer';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Badge from '@material-ui/core/Badge';

// Styles
import { Wrapper, StyledButton } from './App.styles';

// Types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}


const getProducts =async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[])
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    getProducts
    );
    console.log(data);

const getTotalItems = (items: CartItemType[]) => 
  items.reduce((ack: number, item) => ack + item.amount, 0);

// const handleAddToCart = (clickedItem: CartItemType) => null;
const handleAddToCart = (clickedItem: CartItemType) => {
  setCartItems(prev => {
    // 1. Is the item already already in the cart?
    const isItemInCart = prev.find(item => item.id === clickedItem.id)

    if (isItemInCart) {
      return prev.map(item => 
        item.id === clickedItem.id
         ? { ...item, amount: item.amount + 1}
         : item
      );      
    }
    // First time the item is added
    return [...prev, { ...clickedItem, amount: 1 }]
  });
};

// const handleRemoveFromCart = () => null;
const handleRemoveFromCart = (id: number) => {
  setCartItems(prev => 
    prev.reduce((ack, item) => {
      if (item.id === id) {
        if (item.amount === 1) return ack;
        return [...ack, { ...item, amount: item.amount - 1}]
      } else {
        return [...ack, item]
      }
    }, [] as CartItemType[])
  );
};

if (isLoading) return <LinearProgress />;
if (error) return <div>Something went wrong ...</div>

// return <div className="App">Start</div>; 
return (
  <Wrapper>
    <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
      {/* Cart goes here */}
      <Cart 
        CartItems={cartItems} 
        addToCart={handleAddToCart} 
        removeFromCart={handleRemoveFromCart}
      />
    </Drawer>
    <StyledButton onClick={() => setCartOpen(true)}>
      <Badge badgeContent={(getTotalItems(cartItems))} color='error'>
        <AddShoppingCartIcon />
      </Badge>
    </StyledButton>
    <Grid container spacing={3}>
      {data?.map(item => (
        <Grid item key={item.id} xs={12} sm={4}>
          <Item item={item} handleAddToCart={handleAddToCart} />
        </Grid>
      ))}
      </Grid>
  </Wrapper>
)
};

export default App;
