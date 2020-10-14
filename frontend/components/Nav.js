import Link from "next/link";
import { Mutation } from "react-apollo";
import { TOGGLE_CART_MUTATION } from "./Cart";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import CartCount from "./CartCount";
import Signout from "./Signout";

const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null;
      return (
        <NavStyles data-test="nav">
          <Link href="/items">
            <a>Tienda</a>
          </Link>
          {me && (
            <>
              <Link href="/sell">
                <a>Venta</a>
              </Link>
              <Link href="/orders">
                <a>Ordenes</a>
              </Link>
              <Link href="/me">
                <a>Cuenta</a>
              </Link>
              <Signout />
              <Mutation mutation={TOGGLE_CART_MUTATION}>
                {(toggleCart) => (
                  <button onClick={toggleCart}>
                    Mi carrito
                    <CartCount
                      count={me.cart.reduce(
                        (tally, cartItem) => tally + cartItem.quantity,
                        0
                      )}
                    ></CartCount>
                  </button>
                )}
              </Mutation>
            </>
          )}
          {!me && (
            <Link href="/signup">
              <a>Iniciar sesión</a>
            </Link>
          )}
        </NavStyles>
      );
    }}
  </User>
);

export default Nav;
