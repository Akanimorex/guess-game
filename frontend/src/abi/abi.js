const abi = [{"inputs":[{"name":"_tCoreTokenAddress","internalType":"address","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"indexed":false,"name":"win","internalType":"bool","type":"bool"},{"indexed":false,"name":"guessedNumber","internalType":"uint256","type":"uint256"},{"indexed":false,"name":"correctNumber","internalType":"uint256","type":"uint256"}],"name":"GameResult","anonymous":false,"type":"event"},{"outputs":[],"inputs":[],"name":"claimTokens","stateMutability":"nonpayable","type":"function"},{"outputs":[],"inputs":[],"name":"endGame","stateMutability":"nonpayable","type":"function"},{"outputs":[],"inputs":[],"name":"generateRandomNumber","stateMutability":"nonpayable","type":"function"},{"outputs":[{"name":"","internalType":"uint256","type":"uint256"}],"inputs":[],"name":"getRandomNumber","stateMutability":"view","type":"function"},{"outputs":[{"name":"","internalType":"string","type":"string"}],"inputs":[{"name":"_guess","internalType":"uint256","type":"uint256"}],"name":"guess","stateMutability":"nonpayable","type":"function"},{"outputs":[{"name":"","internalType":"bool","type":"bool"}],"inputs":[],"name":"isGameActive","stateMutability":"view","type":"function"},{"outputs":[{"name":"","internalType":"address","type":"address"}],"inputs":[],"name":"owner","stateMutability":"view","type":"function"},{"outputs":[],"inputs":[],"name":"restartGame","stateMutability":"nonpayable","type":"function"},{"outputs":[{"name":"","internalType":"contract IERC20","type":"address"}],"inputs":[],"name":"tCoreToken","stateMutability":"view","type":"function"}]
export default abi;