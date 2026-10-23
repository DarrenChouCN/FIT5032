const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

exports.countBooks = onRequest(
  { cors: true, maxInstances: 2 },
  async (req, res) => {
    try {
      const snapshot = await admin.firestore()
        .collection("books")
        .get();

      res.status(200).json({ count: snapshot.size });
    } catch (error) {
      console.error("Error counting books:", error);
      res.status(500).json({ error: "Failed to count books" });
    }
  }
);

exports.getAllBooks = onRequest(
  { cors: true, maxInstances: 2 },
  async (req, res) => {
    try {
      const snapshot = await admin.firestore()
        .collection("books")
        .get();

      const books = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));

      res.status(200).json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  }
);