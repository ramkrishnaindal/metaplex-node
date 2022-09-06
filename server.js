import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";

import {
  Connection,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  Keypair,
} from "@solana/web3.js";

import express from "express";
import * as fs from "fs";
let bufferData = fs.readFileSync("./images/0.json");
let stData = bufferData.toString();
let metaData = JSON.parse(stData);
let uriUpload, balance;
const app = express();
const PORT = process.env.PORT || 5859;
const connection = new Connection(clusterApiUrl("devnet"));

try {
  if (!balance) {
    const id = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL * 2
    );
    await connection.confirmTransaction(id);
    balance = await connection.getBalance(wallet.publicKey);
  }
} catch (error) {
  console.error(error);
}
app.get("/wallet", (req, res) => {
  const wallet = Keypair.generate();
  res.status(200).json(wallet);
  //   res.send("Welcome to root URL of Server");
});

const uploadmetadata = async () => {
  //   balance = await connection.getBalance(wallet.publicKey);
  if (!balance) return;
  try {
    const { uri, metadata } = await metaplex
      .nfts()
      .uploadMetadata(metaData)
      .run();
    debugger;
    console.log(metadata.image); // https://arweave.net/123
    console.log(metadata.properties.files[0].uri); // https://arweave.net/456
    console.log(uri); // https://arweave.net/789
    uriUpload = uri;
  } catch (error) {
    console.error(error);
  }
};
const createNft = async () => {
  if (!balance) return;
  const { nft } = await metaplex
    .nfts()
    .create({
      uri: uriUpload || "https://arweave.net/123",
      name: "My NFT",
      sellerFeeBasisPoints: 0, // Represents 5.00%.
      supply: 100,
      decimals: 0,
    })
    .run();
  return nft;
};
app.post("/createNFT", async (req, res) => {
  await uploadmetadata();
  const nft = await createNft();
  res.status(200).json(nft);
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
