import express from "express"
import {PrismaClient} from "@prisma/client"
import {course} from "./coursedata"

const prisma = new PrismaClient()

const app = express();

app.use(express.json());
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?(\d{1,3})?[-. (]?(\d{1,4})[-. )]?(\d{1,4})[-. ]?(\d{1,9})$/;

app.post('/referral', async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    if (!referral_name || !referal_email || !referal_phone || referee_name || refree_email || id) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (!emailRegex.test(referal_email)) {
      return res.status(400).json({ error: 'Invalid referal email format' });
    }
    if(!email.test(refree_email)){
      return res.status(400).json({ error: 'Invalid refree email format' });

    }
    if (!phoneRegex.test(referal_phone)) {
      return res.status(400).json({ error: 'Invalid referal phone number format' });
    }
    

    const already_phone = await prisma.referral.findFirst({
      where: {
        referal_phone: referal_phone
      }
    });

    if (already_phone) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    const already_email = await prisma.referral.findFirst({
      where: {
        referal_email: referal_email
      }
    });

    if (already_email) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const referral = await prisma.referral.create({
      data: {
        course_id: id,
        course_name: course[id].name,
        referal_email,
        referal_phone,
        referral_name,
        referal_money: course[id].referal_bonus,
        referee_name,
        refree_email,
        refree_money: course[id].referee_bonus
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
