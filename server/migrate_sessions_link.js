// Usage: node server/migrate_sessions_link.js
const mongoose = require('mongoose');
const { Session, SessionRequest } = require('./models/Session');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/alumni_interactive_website';

async function migrate() {
  await mongoose.connect(MONGO_URI);
  const sessions = await Session.find({ sessionRequestId: { $exists: false } });
  let updated = 0;
  for (const session of sessions) {
    const req = await SessionRequest.findOne({
      userId: session.sessionHead,
      sessionTitle: session.title,
      sessionDescription: session.description
    });
    if (req) {
      session.sessionRequestId = req._id;
      await session.save();
      updated++;
    }
  }
  console.log(`Linked ${updated} sessions to their SessionRequest.`);
  await mongoose.disconnect();
}

migrate().catch(e => { console.error(e); process.exit(1); }); 