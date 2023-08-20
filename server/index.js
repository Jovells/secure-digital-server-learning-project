import fs from 'fs';
import path from 'path';
import express from 'express';
const app = express();
import cors from 'cors';
import { verify } from './signatures.js';
const port = 3042;
import { fileURLToPath } from 'url';


app.use(cors());
app.use(express.json());


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '..', 'records.json'); // The file path in the directory above the current directory
const fsLines = fs.readFileSync(filePath, 'utf8')
const balances = JSON.parse(fsLines)

const getOwnerBalance = (owner) => {
  const record = balances.find((record) => record.wallet === owner)
  return record ? record.balance : 'invalid address'
}
const getOwnerPik = (owner) => {
  const record = balances.find((record) => record.wallet === owner)
  return record ? record.pik : 'invalid address'
}
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = getOwnerBalance(address) || 0;
  const pik = getOwnerPik(address)
  res.send({ balance, pik});
});



app.post("/send", (req, res) => {
  const { sender, recipient, msg, signature } = req.body;

  // setInitialBalance(sender);
  // setInitialBalance(recipient);

  const isVerified = verify(msg, signature)

  if (!isVerified) {
    return res.status(400).send({ message: "invalid signature" });
  }
  const message = JSON.parse(msg)
  const amount = parseInt(message.amount);

  const senderRecord = balances.find((record) => record.wallet === sender)
  const recipientRecord = balances.find((record) => record.wallet === recipient)

  if (senderRecord.balance < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    senderRecord.balance -= amount;
    recipientRecord.balance += amount;
    res.send({ balance: senderRecord.balance });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
