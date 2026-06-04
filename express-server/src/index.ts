import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json())
const client = createClient();
client.on('error', (err) => console.log("Redis client error: ", err));

app.post("/submit", async(req, res) => {
  // const problemId = req.body.problemId;
  // const code = req.body.code;
  // const lang = req.body.lang;
  const { problemId, code, lang } = req.body;

  try {
    await client.lPush("Problems", JSON.stringify({ code, lang, problemId }));
    // store the sub primsa.submissions.create()
    res.status(200).send("Submission received and stored");
  } catch (error) {
    console.log("Redis error: ",error)
    res.status(500).send("failed to store submission");
  }
})


async function startServer() {
  try {
    await client.connect();
    console.log("Connected to redis!");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    })
  } catch (error) {
    console.log("Failed to connect to redis: ", error);
  }
}


startServer();