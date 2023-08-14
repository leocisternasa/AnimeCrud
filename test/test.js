import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";
chai.use(chaiHttp);

const expect = chai.expect;

describe("Probando Servidor", () => {
  it("Deberia retornar que el servidor esta corriendo en el puerto 3100", async () => {
    const response = await chai.request(app).get("/");
    expect(response).to.have.status(200);
    expect(response.body.message).to.equal("El servidor esta funcionando");
  });
});
