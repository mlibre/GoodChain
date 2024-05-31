/* eslint-disable @typescript-eslint/no-explicit-any */
interface BlockchainConstructorParams
{
	readonly dbPath: string;
	nodes: {
		list: string[];
		hostUrl: string;
	};
	readonly chainName: string;
	readonly minerPublicKey: string;
	readonly consensus: Consensus;
}

type AllWallets = Record<string, UserWallet>;

type UserWallets = UserWallet[];

interface UserWallet
{
	balance: number;
	transaction_number: number;
}

type UserWalletsObj = Record<string, UserWallet>;

interface PutAction
{
	type: "put",
	sublevel: any,
	key: string,
	value: any
}

interface BlockData
{
	[x: string]: string | number | TransactionData[];
	index: number;
	chainName: string;
	timestamp: number;
	transactions: TransactionData[];
	previousHash: string;
	miner?: string;
	hash?: string;
}

interface TransactionData
{
	from: string | null;
	to: string;
	amount: number;
	fee: number;
	transaction_number: number;
	signature?: string | null;
	id?: string;
}

interface NodesBlocks
{
	block: BlockData,
	node: string
}

interface KeyPair
{
	publicKey: string;
	privateKey: string;
}

interface ErrorWithStdsOutErr extends Error
{
	stderr: string;
	stdout: string;
	status?: number;
}

interface SimpleError
{
	message?: string;
	stack?: string;
	[key: string]: SimpleError;
}

interface LevelNotFoundError
{
	code: string;
	notFound: boolean;
	status: number;
	message: string;
	stack: string;
	[key: string]: SimpleError;
}
