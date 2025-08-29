import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { ApiResponse } from "../utils/api-response.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function registerUser(req, res) {
  

  try {
  const { username, password } = req.body;

  const usersFile = await readFile(path.join(__dirname, "..", "database", "users.json"), "utf-8");

  const usersArray = JSON.parse(usersFile);

  const isUserExsists = usersArray.find(u => u.username === username);

  if(isUserExsists) return res.status(409).json({error: "username already exsists"});

    const newCreatedUser = {
    username,
    password,
    url: `./data/${username}.json`
  }

  usersArray.push(newCreatedUser);
  
  const filePath = path.join(__dirname, "..", "database", "users.json");

  const updatedData = JSON.stringify(usersArray, null, 2);

  await writeFile(filePath, updatedData);

  res.status(201).json( new ApiResponse(201, newCreatedUser, "user registered successfully"));

  } catch(error) {
     console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  
}

export { registerUser }