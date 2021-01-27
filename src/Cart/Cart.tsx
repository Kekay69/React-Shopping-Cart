import CartItem from '../CartItem/CartItem';

// Styles
import { Wrapper } from './Cart.styles';

// Types
import { CartItemType } from '../App';

type Props = {
    CartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
};

const Cart: React.FC<Props> = ({ CartItems, addToCart, removeFromCart}) => {
    const calculateTotal = (items: CartItemType[]) =>
        items.reduce((ack: number, item) => ack + item.amount * item.price, 0);


    return (
        <Wrapper>
            <h2>Your Shopping Cart</h2>
            {CartItems.length === 0 ? <p>No items in cart.</p> : null}
            {CartItems.map(item => (
                <CartItem 
                    key={item.id}
                    item={item}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}                
                />
            ))}
            <h2>Total: ${calculateTotal(CartItems).toFixed(2)}</h2>
        </Wrapper>
    );
};

export default Cart;

