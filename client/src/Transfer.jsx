import { useState } from "react";
import server from "./server";
import { sign } from "../../server/signatures";
import toast from 'react-hot-toast';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const myPromise = (async () => {
    
    const msg = JSON.stringify({ amount: sendAmount});
    const signature = sign(msg, privateKey);
    
  
try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          sender: address,
          msg,
          signature,
          recipient,
        });
        return setBalance(balance);
} catch (error) {

  console.log(error)
  throw new Error(error.response?.data.message || error.message)

}

  })()

  toast.promise(myPromise, {
    loading: 'Loading',
    success: 'Transaction Successful',
    error: (err) => {
      console.log(err)
      return ` ${err.toString()}`},
  });
}


  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
