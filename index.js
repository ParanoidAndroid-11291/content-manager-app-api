

const express = require('express');
const app = express();
const PORT = 3001;

const fs = require('fs');
const path = require("path");
const pathToFile = path.resolve("./data.json");

const getResources = () => JSON.parse(fs.readFileSync(pathToFile));

app.use(express.json());

app.get("/api/resources", (req, res) => {
  const resources = getResources();
  res.send(resources);

})

app.get("/api/resources/:id", (req, res) => {
  const resources = getResources();
  const { id } = req.params;
  const resource = resources.find((resource) => String(resource.id) === id);
  res.send(resource);
})

app.patch("/api/resources/:id", (req, res) => {
  const resources = getResources();
  const { id } = req.params;
  const index = resources.findIndex((resource) => String(resource.id) === id);  
  resources[index] = req.body;

  fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) {
      return res.status(422).send("Cannot update data");
    }

    return res.send("Data has been updated");
  });
})

app.post("/api/resources", (req, res) => {
  const resources = getResources(); //resources from file
  const resource = req.body; // request body data

  const d = new Date();
  resource.createdAt = d.toISOString();
  resource.status = "inactive";
  resource.id = Date.now();

  resources.push(resource);
  fs.writeFile(pathToFile, JSON.stringify(resources, null, 2), (error) => {
    if (error) {
      return res.status(422).send("Cannot save data in file");
    }

    return res.send("Data has been saved");
  });
})

app.listen(PORT, () => {
  console.log('server is listening on port:' + PORT);
});
