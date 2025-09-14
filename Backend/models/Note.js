import mongoose from 'mongoose';
const NoteSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
});

export default mongoose.model('Note', NoteSchema);