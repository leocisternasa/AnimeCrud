import express from "express";
import fs, { readFileSync } from "fs";

const app = express();
const PORT = 3100;
const dataFile = "anime.json";

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
//rutas

//Endpoint lista todos los animes
app.get("/animes", async (req, res) => {
  let data = readFileSync(dataFile, "utf8");
  let animes = JSON.parse(data);
  res.status(200).json(animes);
});

// Endpoint busqueda por nombre
app.get("/animes/search", async (req, res) => {
  try {
    const { nombre } = req.query;
    let data = readFileSync(dataFile, "utf8");
    let animes = JSON.parse(data);
    let animeFound = false;
    for (const animeId in animes) {
      if (animes[animeId].nombre == nombre) {
        animeFound = true;
        return res.status(200).json(animes[animeId]);
      }
    }
    if (animeFound === false) throw new Error();
  } catch (error) {
    res.status(404).send("El anime que buscas no existe");
  }
});

//Endpoint busqueda por id
app.get("/animes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = readFileSync(dataFile, "utf8");
    let animes = JSON.parse(data);
    console.log(id);
    if (!animes[id]) throw new Error();
    res.status(200).json(animes[id]);
  } catch (error) {
    res.status(400).send("El anime que buscas no existe");
  }
});

//Endpoint crear anime
app.post("/animes", (req, res) => {
  const { nombre, genero, año, autor } = req.body;
  const data = readFileSync(dataFile, "utf8");
  let animes = JSON.parse(data);
  const keys = Object.keys(animes);
  const id = keys.length + 1;
  let anime = { [id]: { nombre, genero, año, autor } };
  animes = { ...animes, ...anime };
  fs.writeFileSync(dataFile, JSON.stringify(animes), "utf8");
  res.status(201).send("Anime creado con exito");
});

app.delete("/animes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = readFileSync(dataFile, "utf8");
    let animes = JSON.parse(data);
    if (!animes[id]) throw new Error();
    let animeKeys = Object.keys(animes);
    let animeFilter = animeKeys.filter((animeId) => animeId != id);
    let animePairs = animeFilter.map((animeId) => [animeId, animes[animeId]]);
    const animesUpdated = Object.fromEntries(animePairs);
    fs.writeFileSync(dataFile, JSON.stringify(animesUpdated), "utf8");
    res.status(200).send("Anime eliminado con exito");
  } catch (error) {
    res.status(404).json({ error: "El anime que quieres eliminar no existe" });
  }
});

app.put("/animes", async (req, res) => {
  try {
    const { nombre, genero, año, autor, id } = req.body;
    const data = readFileSync(dataFile, "utf8");
    let animes = JSON.parse(data);
    console.log(id);
    if (!animes[id]) throw new Error();
    const animeUpdated = { [id]: { nombre, genero, año, autor } };
    const animesUpdate = { ...animes, ...animeUpdated };
    fs.writeFileSync(dataFile, JSON.stringify(animesUpdate), "utf8");
    res.status(200).send("Anime actualizado con exito");
  } catch (error) {
    res.status(404).send("El anime que intentas actualizar no existe");
  }
});

app.listen(PORT, console.log("Corriendo en el puerto " + PORT));
