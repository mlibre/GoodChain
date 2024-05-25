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

interface WalletData
{
	blockNumber: number;
	list: Record<string, WalletBalance>;
}

interface WalletBalance
{
	balance: number;
	transaction_number: number;
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

interface CustomError extends Error
{
	[x: string]: CustomError;
}

interface SimpleError
{
	message?: string;
	stack?: string;
	[key: string]: SimpleError;
}