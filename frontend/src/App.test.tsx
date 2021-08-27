import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import { MemoryRouter as Router } from 'react-router-dom';
import App from './App';
import TopBar from './components/TopBar';

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renderiza TopBar com título", () => {
  act(() => {
    render(<Router><TopBar title="Teste" /></Router>, container);
  });
  expect(container.querySelector("h1").textContent).toBe("Teste");
});

it("renderiza TopBar com nome do usuário", () => {
  localStorage.setItem("user-name", "Vinicius");
  act(() => {
    render(<Router><TopBar title="Teste" /></Router>, container);
  });
  expect(container.querySelector("span").textContent).toBe("Vinicius");
  localStorage.removeItem("user-name"); //clear after test
});

it("renderiza tela de login quando esta deslogado", () => {
  localStorage.removeItem("loggedin");
  act(() => {
    render(<App />, container);
  });
  expect(container.querySelector("h1").textContent).toBe("Bem vindo!");
});