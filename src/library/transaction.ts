import crypto from "crypto";
import { generateUuid } from "./utils.js";

export default class Transaction
{
	from: string | null;
	to: string;
	amount: number;
	fee: number;
	transaction_number: number;
	signature?: string | null;
	id: string;

	constructor ({ from, to, amount, fee, transaction_number, signature, id }: TransactionData )
	{
		this.from = from;
		this.to = to;
		this.amount = amount;
		this.fee = fee;
		this.transaction_number = transaction_number;
		this.signature = signature;
		this.id = id || generateUuid();
	}

	get data (): TransactionData
	{
		return {
			from: this.from,
			to: this.to,
			amount: this.amount,
			fee: this.fee,
			transaction_number: this.transaction_number,
			signature: this.signature,
			id: this.id
		};
	}

	get dataWithoutSignature (): TransactionData
	{
		return {
			from: this.from,
			to: this.to,
			amount: this.amount,
			fee: this.fee,
			transaction_number: this.transaction_number,
			id: this.id
		};
	}

	validate (): boolean
	{
		if ( this.amount < 0 )
		{
			throw new Error( "Invalid amount" );
		}
		if ( this.isCoinBase() )
		{
			return true;
		}
		if ( !this.to )
		{
			throw new Error( "Invalid transaction: missing 'to' address" );
		}
		this.verifySignature();
		return true;
	}

	verifySignature (): boolean
	{
		if ( !this.signature || !this.from )
		{
			throw new Error( "No signature or from" );
		}
		const signature = Buffer.from( this.signature, "hex" );
		const result = crypto.verify( null, Buffer.from( JSON.stringify( this.dataWithoutSignature ) ), this.from, signature );
		if ( !result )
		{
			throw new Error( "Invalid signature" );
		}
		return result;
	}

	sign ( privateKey: string ): string
	{
		const signature = crypto.sign( null, Buffer.from( JSON.stringify( this.dataWithoutSignature ) ), privateKey );
		this.signature = signature.toString( "hex" );
		return this.signature;
	}

	isCoinBase (): boolean
	{
		return this.from === null;
	}
}