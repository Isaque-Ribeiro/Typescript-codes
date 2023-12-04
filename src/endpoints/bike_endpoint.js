server.post("/api/bikes", async (req, res) => {
    try {
      const id = await app.registerBike(req.body);
      res.status(201).json({ id });
    } catch (e) {
      res.status(400).json({ message: "Could not register bike." });
      return;
    }
  });
