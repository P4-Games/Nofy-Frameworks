import { Wallet, ethers, id, solidityPackedKeccak256 } from "ethers";
import { Signature } from "ethers";
import { TransactionTargetResponse } from "frames.js";
import { NextRequest, NextResponse } from 'next/server'
import { Abi, encodeFunctionData } from "viem";

export async function POST(req: NextRequest, res: NextResponse) {
    //const request = await req.json();
    const nofyId = BigInt(4);
    let signer = new Wallet(process.env.VALIDATOR_PRIVATE_KEY!.toString());

    const contractAddress = process.env.ERC721_CONTRACT ?? 'falta la variable de entorno ERC721_CONTRACT';

    const hash = solidityPackedKeccak256(
        ["address", "address", "uint256"],
        [contractAddress, "0xedD31e732EA38E95f0637634FE1EBb3Ca5055979", nofyId]
    );

    // Signing the message
    let rawSig = signer.signingKey.sign(hash);
    let sig = Signature.from(rawSig);
    
    const mintAbi = [ {"type":"function","name":"mint","inputs":[{"name":"nofyId","type":"uint256","internalType":"uint256"},{"name":"v","type":"uint8","internalType":"uint8"},{"name":"r","type":"bytes32","internalType":"bytes32"},{"name":"s","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"} ];

    const calldata = encodeFunctionData({
        abi: mintAbi,
        functionName: 'mint',
        args: [nofyId, sig.v, sig.r, sig.s],
    });

    return NextResponse.json({
        chainId: "eip155:84532",
        method: "eth_sendTransaction",
        params: {
            abi: mintAbi as Abi,
            to: contractAddress,
            data: calldata,
            value: 0,
        },
    });
}


