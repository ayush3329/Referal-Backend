import express from "express"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

const app = express();

app.use(express.json());
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?(\d{1,3})?[-. (]?(\d{1,4})[-. )]?(\d{1,4})[-. ]?(\d{1,9})$/;

app.post('/referral', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const already_phone = await prisma.referral.findFirst({
      where: {
        phone: phone
      }
    });

    if (already_phone) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    const already_email = await prisma.referral.findFirst({
      where: {
        email: email
      }
    });

    if (already_email) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const referral = await prisma.referral.create({
      data: {
        name,
        email,
        phone,
      },
    });
    console.log(referral);

    //email yha pr implement kareyo

    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
