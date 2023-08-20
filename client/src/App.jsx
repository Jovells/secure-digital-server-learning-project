import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';


function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  return (
    <div className="app">
      <Toaster/>
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        setPrivateKey={setPrivateKey}
      />
      <Transfer setBalance={setBalance} address={address} privateKey={privateKey} />
    </div>
  );
}

export default App;
