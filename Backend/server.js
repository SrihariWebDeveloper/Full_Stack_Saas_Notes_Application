import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import Tenant from './models/Tenant.js';
import Note from './models/Note.js';
import auth from './middlewares/auth.js';
import Users from './models/Users.js';
import connectDB from './db/connectDb.js';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

connectDB();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const seed = async () => {
  const tenants = [
    { slug: 'acme', name: 'Acme', plan: 'free' },
    { slug: 'globex', name: 'Globex', plan: 'free' },
  ];
  for (const t of tenants) {
    let tenant = await Tenant.findOne({ slug: t.slug });
    if (!tenant) tenant = await Tenant.create(t);

    const users = [
      { email: `admin@${t.slug}.test`, password: 'password', role: 'admin', tenantId: t.slug },
      { email: `user@${t.slug}.test`, password: 'password', role: 'member', tenantId: t.slug },
    ];
    for (const u of users) {
      let user = await Users.findOne({ email: u.email });
      if (!user) {
        const hash = await bcrypt.hash(u.password, 10);
        await Users.create({ ...u, password: hash });
      }
    }
  }
};
seed();

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,         
      tenantId: user.tenantId, 
    },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  );
  res.json({ token });
});


app.post('/api/users/invite', auth, async (req, res) => {
  const { role, tenantId } = req.user;
  if (role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { email, role: newRole, tenantId: inviteTenantId } = req.body;
  if (!email || !newRole || !inviteTenantId) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  if (tenantId !== inviteTenantId) {
    return res.status(403).json({ error: 'Cannot invite to another tenant' });
  }
  let user = await Users.findOne({ email });
  if (user) return res.status(409).json({ error: 'User already exists' });

  const password = 'password';
  const hash = await bcrypt.hash(password, 10);
  user = await Users.create({
    email,
    password: hash,
    role: newRole,
    tenantId: inviteTenantId,
  });
  res.json({ success: true, user });
});

app.post('/api/notes', auth, async (req, res) => {
  try {
    const { tenantId, id, role } = req.user;
    const tenant = await Tenant.findOne({ slug: tenantId });
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    const noteCount = await Note.countDocuments({ tenantId });
    if (tenant.plan === 'free' && noteCount >= 3) {
      return res.status(403).json({ error: 'Upgrade to Pro to add more notes.' });
    }
    if (!['admin', 'member'].includes(role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (!req.body.content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    const note = await Note.create({ tenantId, userId: id, content: req.body.content });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/notes', auth, async (req, res) => {
  const { tenantId, role } = req.user;
  if (!['admin', 'member'].includes(role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const notes = await Note.find({ tenantId });
  res.json(notes);
});

app.get('/api/notes/:id', auth, async (req, res) => {
  const { tenantId, role } = req.user;
  if (!['admin', 'member'].includes(role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const note = await Note.findOne({ _id: req.params.id, tenantId });
  if (!note) return res.status(404).json({ error: 'Not found' });
  res.json(note);
});

app.put('/api/notes/:id', auth, async (req, res) => {
  const { tenantId, role } = req.user;
  if (!['admin', 'member'].includes(role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenantId },
    { content: req.body.content },
    { new: true }
  );
  if (!note) return res.status(404).json({ error: 'Not found' });
  res.json(note);
});

app.delete('/api/notes/:id', auth, async (req, res) => {
  const { tenantId, role } = req.user;
  if (!['admin', 'member'].includes(role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await Note.deleteOne({ _id: req.params.id, tenantId });
  res.json({ success: true });
});

app.post('/api/tenants/:slug/upgrade', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const tenant = await Tenant.findOneAndUpdate({ slug: req.params.slug }, { plan: 'pro' }, { new: true });
  res.json({ success: true, tenant });
});

app.post('/api/tenants/:slug/checkout', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const tenant = await Tenant.findOne({ slug: req.params.slug });
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Pro Plan Upgrade' },
        unit_amount: 1000,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `https://full-stack-saas-notes-application.vercel.app/success?tenant=${tenant.slug}`,
    cancel_url: 'https://full-stack-saas-notes-application.vercel.app/cancel',
    metadata: { tenantSlug: tenant.slug }
  });

  if(!session) return res.status(500).json({ error: 'Failed to create checkout session' });

  tenant.plan = 'pro';
  await tenant.save();
  res.json({ url: session.url , tenantData: tenant.plan});
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;