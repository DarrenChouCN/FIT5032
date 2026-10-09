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