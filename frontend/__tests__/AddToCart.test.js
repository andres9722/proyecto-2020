import { mount } from "enzyme";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import { ApolloConsumer } from "react-apollo";
import AddToCart, { ADD_TO_CART_MUTATION } from "../components/AddToCart";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

// Información de prueba - Peticiones con resultados esperados
const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [],
        },
      },
    },
  },
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()],
        },
      },
    },
  },
  {
    request: { query: ADD_TO_CART_MUTATION, variables: { id: "abc123" } },
    result: {
      data: {
        addToCart: {
          ...fakeCartItem(),
          quantity: 1,
        },
      },
    },
  },
];

describe("<AddToCart/>", () => {
  it("Agregar un producto al carrito", async () => {
    // Simular la carga del componente con los datos de prueba necesarios
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client;
            return <AddToCart id="abc123" />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    // Esperar que el componente se monte
    await wait();
    // Actualizar el componente con la informacion de prueba (mock)
    wrapper.update();
    // Consultar la informacion del usuario activo haciendo la query al proveedor de la informacion
    const {
      data: { me },
    } = await apolloClient.query({ query: CURRENT_USER_QUERY });

    // Esperamos que en primera instancia el carrito de este usuario no tenga ningun producto agregado
    expect(me.cart).toHaveLength(0);
    // Simular click en el boton de agregar al carrito y proceder a agregarlo
    wrapper.find("button").simulate("click");
    // Esperamos que se complete la peticion para agregar al carrito
    await wait();
    // Consultamos de nuevo la información del usuario activo para revisar que el producto fue agregado
    const {
      data: { me: me2 },
    } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    // Esperamos que en la nueva información del usuario el carrito tengo una longitud de 1 (1 producto agregado)
    expect(me2.cart).toHaveLength(1);
    // Esperamos que el id de este producto agregado sea omg123
    expect(me2.cart[0].id).toBe("omg123");
    // Esperamos que la cantidad agregada al carrito sea 3
    expect(me2.cart[0].quantity).toBe(3);
  });

  it("Cambiar 'Agregar al carrito' por 'Agregando al carrito' cuando se da click al botón", async () => {
    // Simular la carga del componente con los datos de prueba necesarios
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <AddToCart id="abc123" />
      </MockedProvider>
    );
    // Esperamos que el componente se monte
    await wait();
    // Actualizar el componente con la informacion de prueba (mock)
    wrapper.update();
    // Esperamos que el texto por defecto del boton sea 'Agregar al carrito'
    expect(wrapper.text()).toContain("Agregar al carrito");
    // Simular click en el boton de agregar al carrito
    wrapper.find("button").simulate("click");
    // Esperamos que el texto del boton sea actualizado a 'Agregando al carrito'
    expect(wrapper.text()).toContain("Agregando al carrito");
  });
});
