// Express import
const express = require("express");
const app = express();
app.use(express.json());

// path import
const path = require("path");
db_path = path.join(__dirname, "cricketTeam.db");
// console.log(db_path);

//  Sqlite  and Sqlite3 import
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let db = null;

const initialize_db_and_server = async () => {
  try {
    db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => console.log("Server is running"));
  } catch (error) {
    console.log(`Database error ${error}`);
    process.exit(1);
  }
};

// Returns all players in the list

app.get("/players/", async (request, response) => {
  const query = `select *
    from cricket_team
    order by player_id;`;

  const result = await db.all(query);
  response.send(result);
});

// Create a new player

app.post("/players/", async (request, response) => {
  const player_details = request.body;
  const { playerName, jerseyNumber, role } = player_details;
  //   console.log(typeof playerName, typeof jerseyNumber, role);

  const query = `insert into
    cricket_team(player_name, jersey_number, role)
    values ('${playerName}', ${jerseyNumber}, '${role}');`;

  const result = await db.run(query);
  //   console.log(result);
  response.send("Player Added to Team");
});

// Get player details

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const query = `select *
    from cricket_team
    where player_id = ${playerId};`;

  const result = await db.get(query);
  response.send(result);
});

// Update player details

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const player_details = request.body;
  const { playerName, jerseyNumber, role } = player_details;
  //   console.log(typeof playerName, typeof jerseyNumber, role);

  const query = `update cricket_team
  set player_name = '${playerName}',
  jersey_number = ${jerseyNumber},
    role = '${role}'
    where player_id = ${playerId};`;

  const result = await db.run(query);
  response.send("Player Details Updated");
  //   console.log("Updated");
});

//  Delete player

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const query = `delete from cricket_team
    where player_id = ${playerId};`;

  const result = await db.run(query);
  response.send("Player Removed");
  //   console.log("Player Removed");
});

initialize_db_and_server();

module.exports = app;
