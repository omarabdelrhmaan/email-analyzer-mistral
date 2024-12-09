require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Mistral } = require("@mistralai/mistralai");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/agent", async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input is required." });
  }

  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    const agent_id = process.env.MISTRAL_AGENT_ID;
    const client = new Mistral({ apiKey: apiKey });
    console.log(agent_id);
    const chatResponse = await client.agents.complete({
      agentId: agent_id,
      messages: [{ role: "user", content: input }],
    });

    console.log("Chat:", chatResponse.choices[0].message.content);
    return res.json({ response: chatResponse.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
