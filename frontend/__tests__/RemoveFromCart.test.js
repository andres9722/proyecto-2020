import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { ApolloConsumer } from "react-apollo";
import RemoveFromCart, {
  REMOVE_FROM_CART_MUTATION,
} from "../components/RemoveFromCart";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

global.alert = console.log;

// Información de prueba - Peticiones con resultados esperados
const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem({ id: "abc123" })],
        },
      },
    },
  },
  {
    request: { query: REMOVE_FROM_CART_MUTATION, variables: { id: "abc123" } },
    result: {
      data: {
        removeFromCart: {
          __typename: "CartItem",
          id: "abc123",
        },
      },
    },
  },
];

describe("<RemoveFromCart/>", () => {
  it("Remover el producto del carrito", async () => {
    // Simulamos la carga del componente con los datos de prueba necesarios
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client;
            return <RemoveFromCart id="abc123" />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    // Consultamos la información de prueba del usuario
    const res = await apolloClient.query({ query: CURRENT_USER_QUERY });
    // Esperamos que en la información del usuario, el carrito tengo una longitud de 1 (1 producto agregado)
    expect(res.data.me.cart).toHaveLength(1);
    // Esperamos que en la información del usuario, el producto agregado tenga un precio de 5000
    expect(res.data.me.cart[0].item.price).toBe(5000);
    // Simular click en el boton de eliminar del carrito y proceder a eliminarlo
    wrapper.find("button").simulate("click");
    // Esperamos que se complete la peticion
    await wait();
    // Volvemos a consultar la informacion del usuario
    const res2 = await apolloClient.query({ query: CURRENT_USER_QUERY });
    // Esperamos que en la nueva información del usuario, no haya ningun producto agregado
    expect(res2.data.me.cart).toHaveLength(0);
  });
});
