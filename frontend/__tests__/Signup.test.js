import { mount } from "enzyme";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import { ApolloConsumer } from "react-apollo";
import Signup, { SIGNUP_MUTATION } from "../components/Signup";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser } from "../lib/testUtils";

function type(wrapper, name, value) {
  wrapper.find(`input[name="${name}"]`).simulate("change", {
    target: { name, value },
  });
}

const me = fakeUser();
const mocks = [
  // mock para la mutación de registrarse
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: "123",
      },
    },
    result: {
      data: {
        signup: {
          __typename: "User",
          id: "abc123",
          email: me.email,
          name: me.name,
        },
      },
    },
  },
  // Mock usuario actual
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } },
  },
];

describe("<Signup/>", () => {
  it("Completar el registro de un usuario correctamente", async () => {
    // Simulamos la carga del componente con los datos de prueba necesarios
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {(client) => {
            apolloClient = client;
            return <Signup />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // Simulamos el llenado de la informacion en los campos del formulario
    type(wrapper, "name", me.name);
    type(wrapper, "email", me.email);
    type(wrapper, "password", "123");
    // Actualizamos el componente con los nuevos datos en el formulario
    wrapper.update();
    // Simulamos el envio del formulario
    wrapper.find("form").simulate("submit");
    // Esperamos que se complete la información
    await wait();
    // Consultar la información del usuario registrado
    const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
    // Esperamos que el usuario registrado tenga la informacion correcta
    expect(user.data.me).toMatchObject(me);
    // Esperamos que se muestre el mensaje de exito
    expect(wrapper.find("p").text()).toContain(
      "Usuario registrado correctamente!"
    );
  });
});
