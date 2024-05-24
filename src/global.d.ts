interface BlockchainConstructorParams
{
	dbPath: string;
	nodes: {
		list: string[];
		hostUrl: string;
	};
	chainName: string;
	minerPublicKey: string;
	consensus: Consensus;
}

interface WalletData
{
	blockNumber: number;
	list:	Record<string, {
		balance: number;
		transaction_number: number;
	}>;
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

interface ErrorWithStdsOutErr
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

interface AnyError extends Error
{
	[x: string]: string;
	[key: string]: string;
}