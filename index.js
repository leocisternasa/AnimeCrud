import express from "express";
import fs, { readFileSync } from "fs";

const app = express();
const PORT = 3100;
const dataFile = "anime.json";

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//funcionhelper

const readFile = async () => {
  let data = readFileSync(dataFile, "utf8");
  let animes = JSON.parse(data);
  return animes;
};

//rutas

//Endpoint para probar que el servidor este arriba

app.get("/", async (req, res) => {
  try {
    res.json({ message: "El servidor esta funcionando" });
  } catch (error) {
    res.status(400).json({ message: "Hubo un error al levantar el servidor" });
  }
});

//Endpoint lista todos los animes
app.get("/animes", async (req, res) => {
  const animes = await readFile();
  res.status(200).json(animes);
});

// Endpoint busqueda por nombre
app.get("/animes/search", async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) throw new Error();
    const animes = await readFile();
    let anime = Object.values(animes).find((anime) => anime.nombre === nombre);
    if (anime) {
      res.status(200).json(anime);
    } else {
      res.status(404).send("El anime que buscas no existe");
    }
  } catch (error) {
    res.status(400).send("Falta el nombre para realizar la busqueda");
  }
});

//Endpoint busqueda por id
app.get("/animes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const animes = await readFile();
    if (!animes[id]) throw new Error();
    res.status(200).json(animes[id]);
  } catch (error) {
    res.status(400).send("El anime que buscas no existe");
  }
});

//Endpoint crear anime
app.post("/animes", async (req, res) => {
  try {
    let animes = await readFile();
    const { nombre, genero, año, autor } = req.body;
    console.log(animes);
    if (!nombre || !genero || !año || !autor) throw new Error();
    const keys = Object.keys(animes);
    const id = keys.length + 1;
    let anime = { [id]: { nombre, genero, año, autor } };
    animes = { ...animes, ...anime };
    fs.writeFileSync(dataFile, JSON.stringify(animes), "utf8");
    res.status(201).send("Anime creado con exito");
  } catch (error) {
    res.status(400).send("faltan datos para la creacion del nuevo anime");
  }
});

app.delete("/animes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error();
    const animes = await readFile();
    if (!animes[id])
      res
        .status(404)
        .json({ error: "El anime que quieres eliminar no existe" });
    let animeKeys = Object.keys(animes);
    let animeFilter = animeKeys.filter((animeId) => animeId != id);
    let animePairs = animeFilter.map((animeId) => [animeId, animes[animeId]]);
    const animesUpdated = Object.fromEntries(animePairs);
    fs.writeFileSync(dataFile, JSON.stringify(animesUpdated), "utf8");
    res.status(200).send("Anime eliminado con exito");
  } catch (error) {
    res.status(400).send("Falta el param string ID para realizar la busqueda");
  }
});

app.put("/animes", async (req, res) => {
  try {
    const { nombre, genero, año, autor, id } = req.body;
    if (!nombre || !genero || !año || !autor || !id) throw new Error();
    const animes = await readFile();
    console.log(id);
    if (!animes[id])
      res.status(404).send("El anime que intentas actualizar no existe");
    const animeUpdated = { [id]: { nombre, genero, año, autor } };
    const animesUpdate = { ...animes, ...animeUpdated };
    fs.writeFileSync(dataFile, JSON.stringify(animesUpdate), "utf8");
    res.status(200).send("Anime actualizado con exito");
  } catch (error) {
    res.status(400).send("faltan datos para la actualizacion del nuevo anime");
  }
});

app.listen(PORT, () => console.log("Corriendo en el puerto " + PORT));

export default app;
